# Pokedex

[![CI](https://github.com/sdaconceicao/pokedex/workflows/CI%20Status%20Checks/badge.svg)](https://github.com/sdaconceicao/pokedex/actions/workflows/ci.yml)

This is a full stack application setup to provide information on pokemon. You can search for pokemon by name or other attributes. Built with GraphQL and Next.js.

## Getting Started

1. Run `npm i`
2. Run `npm run dev` in the api folder
3. Run `npm run dev` in the frontend folder

## GitHub Actions

The project uses a modular GitHub Actions setup:

- **CI Workflow**: Runs on PRs and pushes to main/development branches
- **Pull Request Workflow**: Runs specifically on pull requests
- **Frontend/Backend Checks**: Contains all common status checks (linting, type checking, tests, coverage)
