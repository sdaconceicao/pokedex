# GitHub Actions

This directory contains GitHub Actions workflows for automated testing and CI/CD.

## Workflow Structure

### Shared Workflow (`.github/workflows/shared-checks.yml`)

A reusable workflow that contains all the common status checks. This workflow can be called by other workflows with configurable parameters.

#### Inputs

- `run-tests`: Whether to run tests (default: true)
- `run-lint`: Whether to run linting (default: true)
- `run-type-check`: Whether to run type checking (default: true)
- `run-coverage`: Whether to run tests with coverage (default: true)

#### Jobs

1. **Setup**: Installs dependencies and sets up caching
2. **Frontend Checks**: Runs all frontend status checks

### CI Workflow (`.github/workflows/ci.yml`)

Runs on pull requests and pushes to `development` and `main` branches. Uses the shared workflow with all checks enabled.

### Pull Request Workflow (`.github/workflows/pull-request.yml`)

Runs specifically on pull requests to `development` and `main` branches. Uses the shared workflow with all checks enabled.

## Benefits of Shared Workflow

- **DRY Principle**: No code duplication between workflows
- **Consistency**: Same checks run in the same way across different triggers
- **Maintainability**: Changes to checks only need to be made in one place
- **Flexibility**: Can easily create new workflows with different check combinations
- **Reusability**: Other workflows can call this with custom parameters

## Usage Examples

### Call with all checks enabled (default)

```yaml
jobs:
  shared-checks:
    uses: ./.github/workflows/shared-checks.yml
```

### Call with only tests and linting

```yaml
jobs:
  shared-checks:
    uses: ./.github/workflows/shared-checks.yml
    with:
      run-tests: true
      run-lint: true
      run-type-check: false
      run-coverage: false
```

### Call with only type checking

```yaml
jobs:
  shared-checks:
    uses: ./.github/workflows/shared-checks.yml
    with:
      run-tests: false
      run-lint: false
      run-type-check: true
      run-coverage: false
```

## Local Testing

Before pushing code, you can run the same checks locally:

```bash
cd frontend

# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Tests
npm test

# Tests with coverage
npm run test:coverage
```

## Troubleshooting

### Common Issues

1. **Tests failing**: Check the test output in the Actions tab
2. **Linting errors**: Run `npm run lint` locally to see issues
3. **Type errors**: Run `npx tsc --noEmit` to check types
4. **Workflow not running**: Ensure the workflow file is in the correct location

### Workflow Status

- Check the Actions tab in your GitHub repository
- Green checkmark = all checks passed
- Red X = one or more checks failed
- Click on failed workflows to see detailed error logs
