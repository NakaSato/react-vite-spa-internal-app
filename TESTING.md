# Testing Documentation

This project includes a comprehensive test suite using Vitest, React Testing Library, and related testing tools.

## Testing Stack

- **Vitest** - Fast unit test framework that works well with Vite
- **React Testing Library** - Simple and complete testing utilities for React components
- **jsdom** - JavaScript implementation of the DOM for Node.js testing
- **@testing-library/jest-dom** - Custom Jest matchers for DOM node assertions
- **@testing-library/user-event** - Utilities for simulating user interactions

## Test Structure

### Unit Tests
- `src/pages/Home.test.tsx` - Tests for the Home component
- `src/pages/About.test.tsx` - Tests for the About component
- `src/App.test.tsx` - Tests for the main App component
- `src/AppRoutes.test.tsx` - Tests for the routing logic

### Integration Tests
- `src/Navigation.test.tsx` - Tests for navigation between pages

### Styling Tests
- `src/test/Styling.test.tsx` - Tests for CSS classes and Tailwind utilities

### Snapshot Tests
- `src/test/Snapshots.test.tsx` - Snapshot tests to catch unexpected changes

## Test Scripts

```bash
# Run tests in watch mode
bun test

# Run tests once
bun test:run

# Run tests with coverage report
bun test:coverage
```

## Testing Patterns Used

### 1. Component Rendering Tests
```typescript
it('renders without crashing', () => {
  render(<Home />)
})
```

### 2. Content Assertion Tests
```typescript
it('displays the correct heading', () => {
  render(<Home />)
  const heading = screen.getByRole('heading', { level: 1 })
  expect(heading).toHaveTextContent('Welcome to the React Vite TypeScript SPA')
})
```

### 3. CSS Class Tests
```typescript
it('has the correct CSS classes for layout', () => {
  render(<Home />)
  const container = screen.getByText('Welcome to the React Vite TypeScript SPA').closest('div')
  expect(container).toHaveClass('flex', 'flex-col', 'items-center')
})
```

### 4. Router Testing
```typescript
// Helper function to render with router at specific route
const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>
  )
}
```

### 5. User Interaction Tests
```typescript
it('can navigate between pages', async () => {
  const user = userEvent.setup()
  render(<TestAppWithNavigation />)
  
  const aboutLink = screen.getByRole('link', { name: /about/i })
  await user.click(aboutLink)
  
  expect(screen.getByText('About Us')).toBeInTheDocument()
})
```

### 6. Snapshot Tests
```typescript
it('Home component matches snapshot', () => {
  const { container } = render(<Home />)
  expect(container.firstChild).toMatchSnapshot()
})
```

## Configuration

### Vitest Configuration (`vitest.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom'
```

## Best Practices Implemented

1. **Separation of Concerns**: App component handles routing, AppRoutes handles route definitions
2. **Router Testing**: Using MemoryRouter for testing to avoid browser history issues
3. **Comprehensive Coverage**: Testing rendering, content, styling, and interactions
4. **Accessibility**: Using semantic queries like `getByRole`
5. **User-Centric Testing**: Testing from the user's perspective, not implementation details
6. **Snapshot Testing**: Catching unexpected changes in component output

## Coverage Report

Current test coverage includes:
- All main components (App, AppRoutes, Home, About)
- Route navigation
- CSS class verification
- Content rendering
- User interactions

Run `bun test:coverage` to see detailed coverage metrics.

## Adding New Tests

When adding new components or features:

1. Create a corresponding `.test.tsx` file
2. Test rendering without crashing
3. Test key functionality and user interactions
4. Test accessibility and semantic HTML
5. Add CSS class verification if using Tailwind
6. Consider snapshot tests for UI components

## Troubleshooting

### Router Conflicts
If you see "You cannot render a <Router> inside another <Router>":
- Make sure you're only wrapping with one router in tests
- Use MemoryRouter for testing, not BrowserRouter
- Consider testing AppRoutes instead of App for route-specific tests

### Missing DOM Assertions
If jest-dom matchers like `toBeInTheDocument()` aren't working:
- Ensure `@testing-library/jest-dom` is imported in setup file
- Check that setup file is included in vitest.config.ts
