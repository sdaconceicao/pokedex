# Pokedex

[![CI](https://github.com/sdaconceicao/pokedex/workflows/CI%20Status%20Checks/badge.svg)](https://github.com/sdaconceicao/pokedex/actions/workflows/ci.yml)

This is a full stack application setup to provide information on pokemon. You can search for pokemon by name or other attributes. Built with GraphQL and Next.js.

## Getting Started

1. Run `npm i`
2. Run `npm run dev` in the api folder
3. Run `npm run dev` in the frontend folder

## Testing

The project includes comprehensive testing with Jest and React Testing Library. To run tests:

```bash
cd frontend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
```

Tests run automatically on all pull requests via GitHub Actions.

## GitHub Actions

The project uses a modular GitHub Actions setup:

- **Shared Workflow**: Contains all common status checks (linting, type checking, tests, coverage)
- **CI Workflow**: Runs on PRs and pushes to main/development branches
- **Pull Request Workflow**: Runs specifically on pull requests

All workflows use the same shared checks for consistency and maintainability.
