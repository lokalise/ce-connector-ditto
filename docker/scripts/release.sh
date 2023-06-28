#!/bin/bash

set -o pipefail

create_git_tag() {
    # Checking if commit is already tagged
    if [ "$(git tag --contains "${sha}" | wc -l | xargs)" -gt 0 ]; then
        log "Commit is already git tagged. Exiting..."
        exit 1
    fi

    # Getting the latest tag from the repo
    TAG=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" "https://api.github.com/repos/lokalise/${GIT_REPO_NAME}/tags" \
            | jq -r '.[].name | select(.|test("^[0-9]{1,}$"))' \
            | head -n 1 \
         )
    # Increasing the tag by one and pushing new tag to the repo
    TAG=$((TAG + 1))
    curl -s -X POST -d '{"ref": "refs/tags/'${TAG}'", "sha": "'"${sha}"'"}' \
         -H "Authorization: token ${GITHUB_TOKEN}" \
         -H "Content-Type:application/json" \
         "https://api.github.com/repos/lokalise/${GIT_REPO_NAME}/git/refs"

    log "Tagged commit ${sha} as ${TAG}"
}

retag_and_push_image() {
    IMAGE="${LOKALISE_ECR_REGISTRY}/${GIT_REPO_NAME}/${APP_NAME}"

    log "Retaging ECR image with ${IMAGE}:${TAG}"

    docker pull ${IMAGE}:PRE-${GIT_BASE_BRANCH}
    docker tag ${IMAGE}:PRE-${GIT_BASE_BRANCH} ${IMAGE}:${TAG}
    docker tag ${IMAGE}:PRE-${GIT_BASE_BRANCH} ${IMAGE}:latest
    docker push ${IMAGE}:${TAG}
    docker push ${IMAGE}:latest
}

create_git_release() {
    curl -s -X POST -H "Accept: application/vnd.github.v3+json" \
                    -H "Authorization: token ${GITHUB_TOKEN}" \
                    https://api.github.com/repos/lokalise/${GIT_REPO_NAME}/releases \
                    -d '{"tag_name":"'${TAG}'","target_commitish":"'${sha}'","name":"'${TAG}'","draft":false,"prerelease":false,"generate_release_notes":true}'

    log "Created github release for ${sha} as ${TAG}"
}

check_norelease() {
    norelease_tag="norelease"
    counter=0

    log "Getting the PR ID from a commit SHA"

    curl -s -H "Accept: application/vnd.github+json" \
            -H "Authorization: token ${GITHUB_TOKEN}" \
            "https://api.github.com/repos/lokalise/${GIT_REPO_NAME}/commits/${sha}/pulls"
    log "Getting the PR id..."
    pr_id=$(curl -s -H "Accept: application/vnd.github+json" \
                    -H "Authorization: token ${GITHUB_TOKEN}" \
                    "https://api.github.com/repos/lokalise/${GIT_REPO_NAME}/commits/${sha}/pulls" \
            | jq -e '.[0].number')

    if [[ "$?" -eq 0 ]]; then
        log "This commit ($sha) is part of the PR, prid: $pr_id"
        log "Checking if PR contains no release tag."
        counter=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
                          -H "Accept: application/vnd.github.v3+json" \
                          "https://api.github.com/repos/lokalise/${GIT_REPO_NAME}/pulls/${pr_id}" \
                  | jq -r '.labels?[]?.name?' \
                  | grep -c ${norelease_tag})
    else
        commit_message=$(git --no-pager log --format="%s" "${sha}" -1)

        log "This commit ($sha) is NOT part of any PR."
        log "Checking if commit message ($commit_message) is containing the norelease tag."
        counter=$(echo "$commit_message" | grep -c "#${norelease_tag}")
    fi

    log "Checking if norelease PR/commit checks passed or NORELEASE env var is set to 'true'."
    if [[ "$counter" -gt 0 || $NORELEASE == "true" ]]; then
        log "Commit is marked as $norelease_tag, stopping."
        exit 1
    fi
}


source docker/scripts/utils.sh

action=${1}
sha=${2}

case ${action} in
    git_tag)
        create_git_tag
        retag_and_push_image
        ;;
    git_release)
        create_git_release
        ;;
    check_norelease)
        check_norelease
        ;;
    *)
        echo "Sorry, invalid input."
        ;;
esac
