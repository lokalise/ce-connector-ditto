#!/bin/bash

set -o pipefail

source docker/scripts/utils.sh

# Get application secrets and configuration from Vault and source them
vault2env "kv/${GIT_REPO_NAME}/${ENV}" "lok-cteng-${ENV}"

# Update image based on TAG and ENV environment variables
log "Pulling images from remote"
compose pull

log "Updating container with new image, using 'ENV: ${ENV}', 'TAG: ${TAG}'"
compose up -d --no-deps

log "Starting cadvisor container if needed..."
docker-compose -f docker/docker-compose.cadvisor.yml up -d
