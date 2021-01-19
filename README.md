## Description

[Nest](https://github.com/nestjs/nest) + TypeScript + Bull module

## Installation

```bash
$ yarn install
```

## Running the app

Run redis first.

```bash
$ docker run -d -p 6379:6379 redis
```

Run server.

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```
