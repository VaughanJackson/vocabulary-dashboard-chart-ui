# `vocabulary-dashboard-chart-ui`

## Clone Project

```text
git clone https://VaughanJackson@bitbucket.org/VaughanJackson/vocabulary-dashboard-chart-ui.git
```

## Set Up Project

```text
yarn install
```

## Start The Application

```text
http-server
```

This assumes:
 1. you have `http-server` (https://www.npmjs.com/package/http-server) installed
 2. you have a vocabulary server running locally with its endpoint at `http://localhost:8080/vocabulary`.

## Unit Test

To set up unit tests that are executed as soon as you make changes, enter the following commands.

```text
yarn test
```

To execute the project unit tests once only, enter these commands.

```text
jest
```

## Integration Testing, Automated End to End Testing

None exists as yet.

## Some TODOs

Remove when done.

* Weed out unnecessary dependencies/complexities introduced by first unit testing attempt.
* Complete Running and Unit Testing instructions.
* Develop or adopt a consistent bundling solution if such exists, so that dependencies are imported explicitly where required.
* Migrate to TypeScript.
* Integrate within an Angular or React dashboard.