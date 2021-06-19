# PhoenixQL

## Installation
`$ npm i`

## Development
`$ npm start`

## Testing
`$ npm test`

## Docker
* Build: `$ docker build --rm -t cnbc/phoenixql .`
* Start: `$ docker run -p 3000:3000 -u cnbc -e 'NODE_ENV=production' -d cnbc/phoenixql`
* Stop: `$ docker stop <CONTAINER ID>`
* Enter: `$ docker exec -it <CONTAINER ID> /bin/bash`
* Logs: `$ docker logs <CONTAINER ID> -f`
