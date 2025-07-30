# Modern React Component Patterns Guide

## React.FC vs Modern Function Components

### ❌ Old Pattern (React.FC)
```tsx
import React from 'react';

interface Props {
  name: string;
  age?: number;
}

const MyComponent: React.FC<Props> = ({ name, age = 18 }) => {
  return <div>Hello {name}, you are {age} years old</div>;
};

export default MyComponent;
```

### ✅ Modern Pattern (Function Declaration)
```tsx
// No need to import React in modern React (JSX Transform)
interface Props {
  name: string;
  age?: number;
}

export default function MyComponent({ name, age = 18 }: Props) {
  return <div>Hello {name}, you are {age} years old</div>;
}
```

### ✅ Alternative Modern Pattern (Arrow Function)
```tsx
interface Props {
  name: string;
  age?: number;
}

function MyComponent({ name, age = 18 }: Props) {
  return <div>Hello {name}, you are {age} years old</div>;
}

export default MyComponent;
```

## Why Modern Patterns Are Better

### 1. **No React Import Needed**
- Modern JSX transform handles JSX automatically
- Smaller bundle size
- Cleaner imports

### 2. **Better TypeScript Experience**
- Direct prop typing instead of generic constraints
- Better inference
- Clearer error messages

### 3. **No Hidden Children Prop**
- `React.FC` automatically adds `children?: ReactNode`
- Modern pattern only includes props you explicitly define
- More explicit and predictable

### 4. **Simpler Syntax**
- Less boilerplate
- More readable
- Standard JavaScript function patterns

## Common Patterns

### Components Without Props
```tsx
// ❌ Old
const Header: React.FC = () => {
  return <header>My App</header>;
};

// ✅ Modern
export default function Header() {
  return <header>My App</header>;
}
```

### Components With Optional Props
```tsx
// ❌ Old  
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled = false }) => {
  return <button onClick={onClick} disabled={disabled}>Click me</button>;
};

// ✅ Modern
interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ onClick, disabled = false }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>Click me</button>;
}
```

### Context Providers
```tsx
// ❌ Old
interface ProviderProps {
  children: ReactNode;
}

export const MyProvider: React.FC<ProviderProps> = ({ children }) => {
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

// ✅ Modern
interface ProviderProps {
  children: ReactNode;
}

export function MyProvider({ children }: ProviderProps) {
  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}
```

## Migration Steps

1. **Remove React.FC type annotation**
2. **Convert to function declaration or keep arrow function**
3. **Move props typing to function parameters**
4. **Remove unused React imports**
5. **Fix export statements**

## When to Import React

You still need to import React when using:
- `useState`, `useEffect`, etc. → Import specific hooks
- `createContext`, `forwardRef`, etc. → Import specific functions
- Class components → Import React
- React.memo, React.lazy → Import specific functions

```tsx
// ✅ Import only what you need
import { useState, useEffect } from 'react';
import { createContext } from 'react';
```

## Quick Migration Commands

```bash
# Find all React.FC usage
grep -r "React.FC" src/

# Find files that might have unused React imports
grep -r "import React" src/ | grep -v "from.*react.*["
```
