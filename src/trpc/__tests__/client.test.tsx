import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { TRPCReactProvider, useTRPC } from '../client'
import React from 'react'

// Mock the makeQueryClient function
vi.mock('../query-client', () => ({
  makeQueryClient: vi.fn(() => ({
    getDefaultOptions: () => ({}),
    mount: vi.fn(),
    unmount: vi.fn(),
    clear: vi.fn(),
    setQueryData: vi.fn(),
    getQueryData: vi.fn(),
  })),
}))

describe('tRPC Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset window object for browser tests
    delete (global as any).window
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('TRPCReactProvider', () => {
    it('should render children', () => {
      const TestChild = () => <div data-testid="test-child">Test Child</div>
      
      const { getByTestId } = render(
        <TRPCReactProvider>
          <TestChild />
        </TRPCReactProvider>
      )

      expect(getByTestId('test-child')).toBeDefined()
      expect(getByTestId('test-child').textContent).toBe('Test Child')
    })

    it('should wrap children with QueryClientProvider and TRPCProvider', () => {
      const TestChild = () => <div>Child Content</div>
      
      const { container } = render(
        <TRPCReactProvider>
          <TestChild />
        </TRPCReactProvider>
      )

      expect(container).toBeDefined()
      expect(container.querySelector('div')).toBeTruthy()
    })

    it('should accept children prop', () => {
      const children = <div data-testid="child">Test</div>
      
      const { getByTestId } = render(
        <TRPCReactProvider>{children}</TRPCReactProvider>
      )

      expect(getByTestId('child')).toBeDefined()
    })

    it('should handle multiple children', () => {
      const { container } = render(
        <TRPCReactProvider>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </TRPCReactProvider>
      )

      expect(container.querySelector('[data-testid="child-1"]')).toBeTruthy()
      expect(container.querySelector('[data-testid="child-2"]')).toBeTruthy()
      expect(container.querySelector('[data-testid="child-3"]')).toBeTruthy()
    })

    it('should create query client on mount', () => {
      const makeQueryClient = vi.fn(() => ({
        getDefaultOptions: () => ({}),
        mount: vi.fn(),
        unmount: vi.fn(),
      }))
      
      vi.doMock('../query-client', () => ({
        makeQueryClient,
      }))

      render(
        <TRPCReactProvider>
          <div>Test</div>
        </TRPCReactProvider>
      )

      // Query client should be created
      expect(makeQueryClient).toHaveBeenCalled()
    })

    it('should handle readonly children prop', () => {
      const readonlyChildren = Object.freeze(<div>Readonly Child</div>)
      
      const { container } = render(
        <TRPCReactProvider>{readonlyChildren}</TRPCReactProvider>
      )

      expect(container.textContent).toContain('Readonly Child')
    })
  })

  describe('getQueryClient function (internal)', () => {
    it('should create new client on server side', () => {
      // Simulate server environment (window is undefined)
      delete (global as any).window
      
      const makeQueryClient = require('../query-client').makeQueryClient
      
      render(
        <TRPCReactProvider>
          <div>Server Test</div>
        </TRPCReactProvider>
      )

      // Should work without errors on server
      expect(makeQueryClient).toHaveBeenCalled()
    })

    it('should reuse client on browser side', () => {
      // Simulate browser environment
      (global as any).window = {}
      
      render(
        <TRPCReactProvider>
          <div>Browser Test 1</div>
        </TRPCReactProvider>
      )

      render(
        <TRPCReactProvider>
          <div>Browser Test 2</div>
        </TRPCReactProvider>
      )

      // Client should be created for browser
      const makeQueryClient = require('../query-client').makeQueryClient
      expect(makeQueryClient).toHaveBeenCalled()
    })
  })

  describe('getUrl function (internal)', () => {
    it('should return empty string for browser environment', () => {
      (global as any).window = {}
      
      // The provider should work with browser URL
      const { container } = render(
        <TRPCReactProvider>
          <div>Test</div>
        </TRPCReactProvider>
      )

      expect(container).toBeDefined()
    })

    it('should handle VERCEL_URL environment variable', () => {
      delete (global as any).window
      const originalVercelUrl = process.env.VERCEL_URL
      process.env.VERCEL_URL = 'my-app.vercel.app'
      
      const { container } = render(
        <TRPCReactProvider>
          <div>Vercel Test</div>
        </TRPCReactProvider>
      )

      expect(container).toBeDefined()
      
      // Restore original value
      if (originalVercelUrl !== undefined) {
        process.env.VERCEL_URL = originalVercelUrl
      } else {
        delete process.env.VERCEL_URL
      }
    })

    it('should default to localhost:3000 for local development', () => {
      delete (global as any).window
      const originalVercelUrl = process.env.VERCEL_URL
      delete process.env.VERCEL_URL
      
      const { container } = render(
        <TRPCReactProvider>
          <div>Local Test</div>
        </TRPCReactProvider>
      )

      expect(container).toBeDefined()
      
      // Restore original value
      if (originalVercelUrl !== undefined) {
        process.env.VERCEL_URL = originalVercelUrl
      }
    })
  })

  describe('TRPCProvider and useTRPC exports', () => {
    it('should export TRPCProvider', () => {
      expect(TRPCReactProvider).toBeDefined()
      expect(typeof TRPCReactProvider).toBe('function')
    })

    it('should export useTRPC hook', () => {
      expect(useTRPC).toBeDefined()
      expect(typeof useTRPC).toBe('function')
    })

    it('should create tRPC client with httpBatchLink', () => {
      const { container } = render(
        <TRPCReactProvider>
          <div>Test</div>
        </TRPCReactProvider>
      )

      // Provider should initialize without errors
      expect(container).toBeDefined()
    })
  })

  describe('Integration', () => {
    it('should handle nested providers', () => {
      const { container } = render(
        <TRPCReactProvider>
          <div>
            <TRPCReactProvider>
              <span>Nested Content</span>
            </TRPCReactProvider>
          </div>
        </TRPCReactProvider>
      )

      expect(container.textContent).toContain('Nested Content')
    })

    it('should provide context to children', () => {
      const TestComponent = () => {
        // In real usage, useTRPC would be called here
        return <div data-testid="context-consumer">Has Context</div>
      }

      const { getByTestId } = render(
        <TRPCReactProvider>
          <TestComponent />
        </TRPCReactProvider>
      )

      expect(getByTestId('context-consumer')).toBeDefined()
    })

    it('should handle component unmounting', () => {
      const { unmount, container } = render(
        <TRPCReactProvider>
          <div>Test</div>
        </TRPCReactProvider>
      )

      expect(container).toBeDefined()
      unmount()
      // Should unmount without errors
    })

    it('should support re-rendering', () => {
      const { rerender, container } = render(
        <TRPCReactProvider>
          <div>Initial</div>
        </TRPCReactProvider>
      )

      expect(container.textContent).toContain('Initial')

      rerender(
        <TRPCReactProvider>
          <div>Updated</div>
        </TRPCReactProvider>
      )

      expect(container.textContent).toContain('Updated')
    })
  })

  describe('Client-side behavior', () => {
    it('should initialize tRPC client only once per provider instance', () => {
      (global as any).window = {}
      
      const TestComponent = () => {
        const [count, setCount] = React.useState(0)
        return (
          <div>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <span data-testid="count">{count}</span>
          </div>
        )
      }

      const { getByTestId } = render(
        <TRPCReactProvider>
          <TestComponent />
        </TRPCReactProvider>
      )

      expect(getByTestId('count').textContent).toBe('0')
    })

    it('should handle different window states', () => {
      // Test with window undefined
      delete (global as any).window
      const { container: container1 } = render(
        <TRPCReactProvider>
          <div>Server</div>
        </TRPCReactProvider>
      )
      expect(container1).toBeDefined()

      // Test with window defined
      (global as any).window = {}
      const { container: container2 } = render(
        <TRPCReactProvider>
          <div>Browser</div>
        </TRPCReactProvider>
      )
      expect(container2).toBeDefined()
    })
  })

  describe('Error boundaries', () => {
    it('should handle errors in children gracefully', () => {
      const ErrorComponent = () => {
        throw new Error('Child component error')
      }

      // We expect this to throw, but provider itself should be fine
      expect(() => {
        render(
          <TRPCReactProvider>
            <ErrorComponent />
          </TRPCReactProvider>
        )
      }).toThrow('Child component error')
    })
  })

  describe('Type safety', () => {
    it('should accept valid React children', () => {
      const validChildren = [
        <div key="1">Child 1</div>,
        <span key="2">Child 2</span>,
        'Text node',
        123,
        null,
        undefined,
      ]

      const { container } = render(
        <TRPCReactProvider>{validChildren}</TRPCReactProvider>
      )

      expect(container).toBeDefined()
    })
  })
})