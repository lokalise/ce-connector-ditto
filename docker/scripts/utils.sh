#!/bin/bash

set -o pipefail

REQUIRED_EXECUTABLES=(curl docker docker-compose jq vault)
DOCKER_ROOT_PATH=${DOCKER_ROOT_PATH:-docker}
LOKALISE_REGISTRY="reg.lokalise.work"
LOKALISE_ECR_REGISTRY="053497547689.dkr.ecr.eu-central-1.amazonaws.com"
REGISTRY_USER="lokalise"


# Housekeeping and misc
function log() {
  echo "[$(date +"%D | %H:%M:%S")] $1"
}

function fail() {
  log "$1"

  exit 1
}

function check_bins() {
  log "Checking executables..."

  for exe in ${REQUIRED_EXECUTABLES[@]}; do
    if ! command -v ${exe} %> /dev/null; then
      fail "'${exe}' missing!"
    fi
  done
}

check_env() {
  local missingVariables=()
  local varsIn=$@

  for envvar in ${varsIn}; do
    [[ -z "${!envvar}" ]] && missingVariables+=(${envvar})
  done

  if ! [[ ${#missingVariables[@]} -eq 0 ]]; then
    fail "Missing ENV variables: ${missingVariables[@]}"
  fi
}

function load_env_from_file() {
  env_file=$1

  log "Sourcing environment file '${env_file}'"
  source ${env_file}
}


# Docker related
function compose() {
  check_env ENV TAG

  envOverride=""
  envOverrideFile="${DOCKER_ROOT_PATH}/docker-compose.override.${ENV}.yml"

  if [ -e  $envOverrideFile ]; then
    envOverride+="-f ${envOverrideFile}"
  fi

  echo "docker-compose --project-name ${GIT_REPO_NAME} -f ${DOCKER_ROOT_PATH}/docker-compose.yml ${envOverride} $@"
  docker-compose --project-name ${GIT_REPO_NAME} -f ${DOCKER_ROOT_PATH}/docker-compose.yml ${envOverride} $@
}

docker_login() {
  check_env REGISTRY_USER REGISTRY_PASSWORD

  log "Logging in to ${LOKALISE_REGISTRY} ..."
  docker login -u ${REGISTRY_USER} --password-stdin ${LOKALISE_REGISTRY} <<< ${REGISTRY_PASSWORD}
}

docker_retag() {
  check_env LOKALISE_REGISTRY APP_NAME TAG

  NEW_DOCKER_TAG=${1}
  IMAGE="${LOKALISE_REGISTRY}/${GIT_REPO_NAME}/${APP_NAME}"

  log "Pushing Docker image '${IMAGE}:${NEW_DOCKER_TAG}'"

  docker_login
  docker tag ${IMAGE}:${TAG} ${IMAGE}:${NEW_DOCKER_TAG}
  docker push ${IMAGE}:${NEW_DOCKER_TAG}
}


# Vault related
function vault2env() {
  log "Retrieving secrets from Vault.."
  get_vault_keys.sh --kv_path ${1} \
                    --role_id ${2} -vds v2 \
                    --vault_addr https://vault-app.prod.lokalise.cloud \
                    --auth_type aws \
                    | sed 's/^/export /' > docker/.env.vault

  load_env_from_file ${DOCKER_ROOT_PATH}/.env.vault
}

# Adding custom scripts location to the PATH
export PATH=${PATH}:/usr/local/sbin
# Execute checks and initializations
check_bins
load_env_from_file ${DOCKER_ROOT_PATH}/.env.default
