# Pokedex - GraphQL

## Description

A GraphQL API server for the Pokedex project built with [Apollo Server](https://www.apollographql.com/docs/apollo-server/) and TypeScript. This API provides comprehensive Pokemon data through a GraphQL interface, including Pokemon details, abilities, types, regions, and pokedexes.

## Features

- **Pokemon Data**: Complete Pokemon information including stats, abilities, types, and images
- **Search & Filtering**: Search Pokemon by name, filter by type, region, or pokedex
- **Real-time Data**: Fetches live data from the Pokemon API (pokeapi.co)
- **Mock Mode**: Optional mock data mode for development and testing
- **Type Safety**: Full TypeScript support with generated types
- **Caching**: Built-in Apollo Server caching for improved performance

## Project setup

```bash
$ npm i
```

## Environment Configuration

The application supports multiple environment configurations:

- **Development**: Uses default environment (real Pokemon API)
- **Test**: Uses mock data for testing
- **Mock Mode**: Uses mock data for development

### Environment Variables

Key environment variables:

- `NODE_ENV`: Environment name (development, test, production)
- `USE_MOCK_API`: Set to "true" to use mock data instead of real Pokemon API

## Compile and run the project

```bash
# development (uses real Pokemon API)
$ npm run start

# watch mode (uses real Pokemon API)
$ npm run start:dev

# development with mock data
$ npm run start:dev:mock

# production mode
$ npm run start:prod
```

## GraphQL Schema

The API provides the following main queries:

- `pokemon(id: ID!)`: Get a specific Pokemon by ID
- `pokemonSearch(query: String!, limit: Int, offset: Int)`: Search Pokemon by name
- `pokemonByType(type: String, limit: Int, offset: Int)`: Get Pokemon by type
- `pokemonByPokedex(pokedex: String, limit: Int, offset: Int)`: Get Pokemon by pokedex
- `pokemonByRegion(region: String, limit: Int, offset: Int)`: Get Pokemon by region
- `ability(id: ID!)`: Get ability details
- `types`: Get all Pokemon types
- `pokedexes`: Get all pokedexes
- `regions`: Get all regions

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:coverage
```

## Development

### Code Generation

The project uses GraphQL Code Generator to generate TypeScript types from the GraphQL schema:

```bash
# Generate types from schema
$ npm run generate
```

### Linting

```bash
# Check for linting errors
$ npm run lint

# Fix linting errors
$ npm run lint:fix

# Check linting with zero warnings
$ npm run lint:check
```

### Type Checking

```bash
# Run TypeScript compiler check
$ npm run tsc
```

## API Endpoints

- **GraphQL Playground**: Available at the server URL when running in development mode
- **GraphQL Endpoint**: The main GraphQL endpoint for queries and mutations

## Data Sources

- **Real API**: Fetches data from [Pokemon API](https://pokeapi.co/) (pokeapi.co)
- **Mock API**: Uses Mock Service Worker (MSW) for development and testing

## Resources

Check out a few resources that may come in handy when working with Apollo Server and GraphQL:

- Visit the [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/) to learn more about the framework.
- For GraphQL questions and support, please visit the [GraphQL Community](https://graphql.org/community/).
- To dive deeper into GraphQL, check out the [GraphQL Learning](https://graphql.org/learn/) resources.
- For TypeScript integration, see the [Apollo Server TypeScript Guide](https://www.apollographql.com/docs/apollo-server/integrations/building-integrations/#typescript).

## License

This project is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
