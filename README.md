# Ditto Content Engine Connector

### Temp change

This repository contains the code for Ditto's content engine connector on the Lokalise platform. More information about the content engine connectors can be found [on Lokalise's website](https://developers.lokalise.com/docs/lokalise-engines#content-engine).

In its current state, this connector enables users to import their workspace's components to be translated within Lokalise. The Ditto integration is still in the process of being added to Lokalise's app marketplace so setup instructions will be added in the future.

## Running

Add .env file to your project root directory based on .env.default.

For development, use the dockerized environment:

`docker compose up -d`

The app is available at: http://localhost:3000/

Run tests:

`docker compose exec -it app npm run test`

Run formatting:

`docker compose exec -it app npm run format`

Run linter:

`docker compose exec -it app npm run lint`

## Openapi

Openapi docs are available at [connector-openapi](https://github.com/lokalise/connector-openapi/blob/master/postman/schemas/schema.yaml)
