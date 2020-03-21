# Fernspec Framework

[![Build Status](https://travis-ci.org/fernspec/framework.svg?branch=master)](https://travis-ci.org/mathieucaff/fernspec)&nbsp;[![codecov](https://codecov.io/gh/mathieucaroff/fernspec/branch/master/graph/badge.svg)](https://codecov.io/gh/mathieucaroff/fernspec)

Fernspec is a minimalist, magic-free (KISS), unit test library for web Typescript projects. The source code is available on [GitHub](https://github.com/mathieucaroff/fernspec) where you can also find the [issue tracker](https://github.com/mathieucaroff/fernspec/issues).

## Installation of Fernspec

It's vendor only for now:

```
mkdir -p vendor/fernspec
git clone https://github.com/mathieucaroff/fernspec vendor/fernspec
```

For now, Fernspec is expected to be run in a web browser.

### Fernspec design goals

1. Be easy to adopt, at least for Web TypeScript projects
2. Be easy to use
3. Be reliable

#### Approach to reach these goals

- (1) Have small APIs that respect the principle of least surprise and avoid
  duplication, even at the cost of adding boilerplate for the user
- (2) and (3), KISS approach (**Keep It Simple and Standard**)
- (3) Put the user in charge wherever practical

### Fernspec use-case-feature goals

- Watch-mode: watching files and tests for changes
- Running only the specified tests / the tests that failed

### Fernspec design decisions

- Support running unit tests in the browser
  - Target ES2019 browsers, not old browsers
- Feature an address system allowing to select specific tests to run
  - This system is meant to be used via the page URL
- No magic:
  - (writing-test-API) AVA-like API based on callback arguments to run the tests
    cleanly and
  - (execution-API) the user is responsible for sourcing the tests they want, and passing them to Ferspec\*\*. This gives them total control over what is run when.
- No internal support for watching for file changes: Since Fernspec is web-based, the user can just spin a development server, and rely on it to watch the files.

\*\*It'd be interesting to have some Parcel / Webpack / Gulp plugins for dealing
with sourcing the files from the filesystem.

### Writting tests

#### Initializing specs

The framework provides a `Spec` class which holds basically the whole testing power. You start your test by creating an instance of that class.

```ts
import { Spec } from 'fernspec'

const spec = new Spec()
```

#### Testing features

The Spec instance provide methods that you can use when writting tests. Most of the time you will use the `test` method which performs the test you write.

```ts
spec.test('is true', async (ctx) => {
  // promise | function
  ctx.true(1)
})
```

#### Nested specs

Tests can be nested using the `spec` method.

```ts
const colorSpec = new Spec();
...
spec.spec('color', colorSpec);
```

#### Test lifecycle

The framework provides `before` and `after` methods which are execute at the beginning and at the end of the spec case.

```ts
spec.before((stage) => {
  // execute before all tests
});
...
spec.after((stage) => {
  // execute after all tests
});
```

These methods have access to the `stage` of the spec instance. When spec instances are nested (via the `spec` method), their `stage` instance is put in common: There is only one `stage` instance per tree of spec instances. This means that settings are preserved throughout the spec tree.

There are also the `beforeEach` and `afterEach` methods which are triggered before and after each test. These methods have access to the `context` and `stage` of the spec. The context represents a copy of a stage and is preserved between `beforeEach`, `test` and `afterEach` methods. This allows for testing atomic tests where the context is always reset for each test.

```ts
spec.beforeEach((context, stage) => {
  // execute before all tests
});
...
spec.afterEach((context, stage) => {
  // execute after all tests
});
```

Callback functions can be called multiple times and the execution will happen in a defined sequence.

#### Shared data

The `context` and the `stage` both provide a way to `set` and `get` values with proper TypeScript types.

```ts
interface Data {
  id: number
  name: string
}

const spec = new Spec<Data>()

spec.beforeEach((ctx) => {
  ctx.set('id', 100)
  ctx.set('name', 'John')
})

spec.test('is John with id=100', (ctx) => {
  const id = ctx.get('id')
  const name = ctx.get('name')
  ctx.is(id, 100)
  ctx.is(name, 'John')
})
```

Values set inside the `before` and `after` blocks are available to all `spec` methods. Values set in the `beforeEach` and `afterEach` blocks are available only on the context stack of each test.

#### Running tests

_Undocumented for now_

#### Configuration

_Undocumented for now_

## Contributing

-

## Licence

See [LICENSE](https://github.com/mathieucaroff/fernspec/blob/master/LICENCE) for details.
