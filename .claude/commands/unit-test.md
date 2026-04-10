# Unit Tests

Write Jest + React Testing Library unit tests for all new and modified components.

## Step 1 — Check Jest setup

Check if Jest is already configured (`jest.config.ts` exists and `jest` is in `package.json` devDependencies).

If Jest is NOT configured, set it up now:

```bash
npm install --save-dev jest jest-environment-jsdom ts-jest @types/jest \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  identity-obj-proxy
```

Create `jest.config.ts` in the project root:

```ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|svg)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
};
```

Create `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom';
```

Add test script to `package.json` scripts:

```json
"test": "jest --passWithNoTests"
```

## Step 2 — Write tests

For each new or modified component, create a test file alongside it:
`src/<same-path>/<ComponentName>.test.tsx`

Each test file must cover:

- [ ] **Smoke test** — component renders without crashing
- [ ] **Key UI elements** — headings, labels, buttons, and important text are visible
- [ ] **User interactions** — form submissions, button clicks, input changes work as expected
- [ ] **Conditional rendering** — empty states, loading states, error states (where applicable)

### Testing conventions

- Import `render`, `screen` from `@testing-library/react`
- Import `userEvent` from `@testing-library/user-event`
- Wrap with Jotai `<Provider>` for any component that reads atoms
- Prefer accessible queries: `getByRole`, `getByLabelText`, `getByText`
- Use `userEvent` over `fireEvent` for user interactions
- One behaviour per test — keep tests short and focused
- No `any` in test files

## Step 3 — Run tests

```bash
npm test
```

All tests must pass before moving to the next step. Fix any failures now.
