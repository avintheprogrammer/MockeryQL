#!/bin/bash
set -e
set -u

declare HOST_URI='qa-aws02webql.cnbc.com'
[[ -n "${1-}" ]] && HOST_URI="${1}"

declare SERVICE_PROTOCOL=''
declare SERVICE_HOST=''
declare SERVICE_PATH=''

if [[ "${HOST_URI}" =~ ^((([a-z_]+):)?(//))?([^:][^/]+)(/.*)? ]]
then
    SERVICE_PROTOCOL="${BASH_REMATCH[3]:-"https"}"
    SERVICE_HOST="${BASH_REMATCH[5]:-}"
    SERVICE_PATH="${BASH_REMATCH[6]:-"/graphql"}"
else
    {
        echo 'ERROR: Invalid service URL'
        echo "URL: [${HOST_URI}]"
        exit 1
    } >&2
fi

declare SERVICE_URI="${SERVICE_PROTOCOL}://${SERVICE_HOST}${SERVICE_PATH}"
printf 'SERVICE: [%s]\n' "${SERVICE_URI}"

curl \
-H "host: ${SERVICE_HOST}" \
-H 'accept-encoding:' \
-H 'user-agent: node-fetch/1.0 (+https://github.com/bitinn/node-fetch)' \
-H 'connection: close' \
-H 'accept: application/json' \
-H 'content-length: 359' \
-H 'content-type:' \
--data-binary '{"operationName":"page","variables":{"path":"/us-homepage/"},"query":"query page($path: String) {\n  page(path: $path) {\n    id\n    brand\n    template\n    layout\n    type\n    title\n    premium\n    native\n    section {\n      id\n      headline\n      tagName\n      url\n      title\n      subType\n      __typename\n    }\n    __typename\n  }\n}\n"}' \
-X POST "${SERVICE_URI}"
