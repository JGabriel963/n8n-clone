# Test Suite Documentation

This test suite provides comprehensive coverage for the tRPC setup in this Next.js application.

## Setup

Before running tests, install dependencies:

```bash
npm install --legacy-peer-deps
```

Note: We use `--legacy-peer-deps` due to React 19 compatibility with some testing libraries.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run tests with UI
npm run test:ui
```

## Test Files Created

1. **src/trpc/__tests__/init.test.ts** - 65 tests for tRPC initialization
2. **src/trpc/__tests__/query-client.test.ts** - 14 tests for QueryClient configuration
3. **src/trpc/__tests__/routers/_app.test.ts** - 21 tests for app router
4. **src/trpc/__tests__/server.test.tsx** - 24 tests for server-side tRPC
5. **src/trpc/__tests__/client.test.tsx** - 26 tests for client-side tRPC provider
6. **src/app/api/trpc/__tests__/route.test.ts** - 26 tests for API route handlers

**Total: 176+ comprehensive unit tests**

## Test Coverage Areas

### Context & Initialization
- tRPC context creation with caching
- Router factory configuration
- Base procedure setup
- Caller factory functionality

### Query Client
- QueryClient instantiation and configuration
- 30-second stale time setting
- Dehydration/hydration for SSR
- Query state management

### Router & Procedures
- App router structure validation
- getUsers procedure functionality
- Database integration (mocked Prisma)
- Error handling (timeouts, DB errors, network issues)
- Large datasets (1000+ records)
- Null/undefined value handling
- Concurrent procedure calls

### Server-Side Setup
- Server-only module enforcement
- Query client caching per request
- tRPC proxy configuration
- Direct caller for server components

### Client-Side Provider
- TRPCReactProvider component
- Browser vs Server environment detection
- Query client singleton in browser
- Dynamic URL generation (localhost, Vercel)
- Provider composition and nesting
- React lifecycle management

### API Route Handlers
- GET/POST handler exports
- Request/Response handling
- fetchRequestHandler integration
- Batch request support
- Error propagation
- CORS and headers handling

## Configuration Files

### vitest.config.ts
Configures Vitest with:
- React plugin for JSX/TSX support
- jsdom environment for DOM testing
- Path aliases matching tsconfig.json
- Global test utilities

### vitest.setup.ts
Global test setup including:
- @testing-library/jest-dom matchers
- Next.js router mocks
- server-only/client-only module mocks
- React cache mock for testing

## Test Patterns

### Mocking Strategy
```typescript
// Mock Prisma client
vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      // other methods...
    },
  },
}))

// Use in tests
const prisma = await import('@/lib/db')
vi.mocked(prisma.default.user.findMany).mockResolvedValue([...])
```

### Testing Procedures
```typescript
it('should test procedure', async () => {
  // Arrange
  const mockData = [{ id: '1', name: 'Test' }]
  const prisma = await import('@/lib/db')
  vi.mocked(prisma.default.user.findMany).mockResolvedValue(mockData)
  
  // Act
  const result = await caller.getUsers()
  
  // Assert
  expect(result).toEqual(mockData)
  expect(prisma.default.user.findMany).toHaveBeenCalledTimes(1)
})
```

### Testing React Components
```typescript
it('should render provider', () => {
  const { getByTestId } = render(
    <TRPCReactProvider>
      <div data-testid="child">Test</div>
    </TRPCReactProvider>
  )
  
  expect(getByTestId('child')).toBeDefined()
})
```

## Adding New Tests

When adding new tRPC procedures:

1. Add procedure to `src/trpc/routers/_app.ts`
2. Add tests to `src/trpc/__tests__/routers/_app.test.ts`
3. Test all scenarios:
   - Happy path
   - Empty results
   - Error conditions
   - Edge cases
   - Concurrent calls

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use `beforeEach` and `afterEach` for setup/teardown
3. **Descriptive Names**: Test names should explain what they test
4. **AAA Pattern**: Arrange, Act, Assert
5. **Edge Cases**: Test boundaries and unusual inputs
6. **Async Handling**: Properly await async operations
7. **Mock Management**: Clear mocks between tests

## Troubleshooting

### "Cannot find module" errors
- Verify path aliases in `vitest.config.ts` match `tsconfig.json`
- Check import paths use `@/` prefix correctly

### Mock not working
- Ensure `vi.mock()` is called before imports
- Use `vi.mocked()` for TypeScript type safety
- Clear mocks in `beforeEach`

### React/DOM errors
- Verify `jsdom` environment in vitest config
- Check cleanup in `afterEach` hooks
- Ensure proper async handling with `waitFor`

## CI/CD Integration

Tests are designed for CI/CD:
- No external dependencies (all mocked)
- Fast execution (unit tests only)
- Deterministic results
- Clear error messages
- Exit codes for pass/fail

## Future Enhancements

Consider adding:
- Integration tests with test database
- E2E tests using Playwright
- Performance benchmarks
- Visual regression tests
- API contract tests
- Load testing