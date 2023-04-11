#!/bin/bash

set -o pipefail

source docker/scripts/utils.sh

url=$1
expected_http_code=$2

log "Healtcheck url     : ${url}"
log "Expected http code : ${expected_http_code:-}"

# Retrying healthcheck in case app did not have time to start
for n in {1..5}; 
do
    log "Performing healthcheck #${n}"
    http_code=$(curl -s -o /dev/null -w "%{http_code}" ${url})
    log "Received HTTP code: ${http_code}"

    if [[ ${http_code} -eq ${expected_http_code} ]]; then
        log "Post-deployment checks passed."
        exit 0
    fi

    sleep 5
done

log "Post-deployment checks failed, exiting with non-zero. Downstream job(s) will not run."
exit 1
