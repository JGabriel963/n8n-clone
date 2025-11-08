import { describe, it, expect, beforeEach } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { makeQueryClient } from '../query-client'

describe('Query Client', () => {
  describe('makeQueryClient', () => {
    it('should create a QueryClient instance', () => {
      const queryClient = makeQueryClient()
      
      expect(queryClient).toBeDefined()
      expect(queryClient).toBeInstanceOf(QueryClient)
    })

    it('should create a new instance each time it is called', () => {
      const queryClient1 = makeQueryClient()
      const queryClient2 = makeQueryClient()
      
      expect(queryClient1).not.toBe(queryClient2)
    })

    it('should configure staleTime to 30 seconds', () => {
      const queryClient = makeQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      expect(defaultOptions.queries?.staleTime).toBe(30 * 1000)
    })

    it('should have dehydrate configuration', () => {
      const queryClient = makeQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      expect(defaultOptions.dehydrate).toBeDefined()
      expect(defaultOptions.dehydrate?.shouldDehydrateQuery).toBeDefined()
    })

    it('should have hydrate configuration', () => {
      const queryClient = makeQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      expect(defaultOptions.hydrate).toBeDefined()
    })

    it('should dehydrate queries with pending status', () => {
      const queryClient = makeQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      const shouldDehydrate = defaultOptions.dehydrate?.shouldDehydrateQuery
      expect(shouldDehydrate).toBeDefined()
      
      // Mock query with pending status
      const mockQuery = {
        state: { status: 'pending' },
        queryKey: ['test'],
        queryHash: 'test-hash',
      } as any
      
      const result = shouldDehydrate?.(mockQuery)
      expect(result).toBe(true)
    })

    it('should dehydrate successful queries based on default behavior', () => {
      const queryClient = makeQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      const shouldDehydrate = defaultOptions.dehydrate?.shouldDehydrateQuery
      
      // Mock query with success status and fresh data
      const mockSuccessQuery = {
        state: { 
          status: 'success',
          dataUpdatedAt: Date.now(),
          errorUpdatedAt: 0,
        },
        queryKey: ['test'],
        queryHash: 'test-hash',
        options: { staleTime: 30000 },
      } as any
      
      const result = shouldDehydrate?.(mockSuccessQuery)
      expect(typeof result).toBe('boolean')
    })

    it('should handle queries with error status', () => {
      const queryClient = makeQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      const shouldDehydrate = defaultOptions.dehydrate?.shouldDehydrateQuery
      
      const mockErrorQuery = {
        state: { status: 'error' },
        queryKey: ['test'],
        queryHash: 'test-hash',
      } as any
      
      const result = shouldDehydrate?.(mockErrorQuery)
      expect(typeof result).toBe('boolean')
    })

    it('should create independent query clients', () => {
      const queryClient1 = makeQueryClient()
      const queryClient2 = makeQueryClient()
      
      // Set a query in client1
      queryClient1.setQueryData(['test'], 'data1')
      
      // client2 should not have the data
      const data2 = queryClient2.getQueryData(['test'])
      expect(data2).toBeUndefined()
    })

    it('should support basic query operations', async () => {
      const queryClient = makeQueryClient()
      
      // Set query data
      queryClient.setQueryData(['test-key'], { value: 'test-data' })
      
      // Get query data
      const data = queryClient.getQueryData(['test-key'])
      expect(data).toEqual({ value: 'test-data' })
    })

    it('should respect staleTime configuration', async () => {
      const queryClient = makeQueryClient()
      const staleTime = queryClient.getDefaultOptions().queries?.staleTime
      
      expect(staleTime).toBe(30000)
    })

    it('should allow clearing all queries', () => {
      const queryClient = makeQueryClient()
      
      queryClient.setQueryData(['test1'], 'data1')
      queryClient.setQueryData(['test2'], 'data2')
      
      queryClient.clear()
      
      expect(queryClient.getQueryData(['test1'])).toBeUndefined()
      expect(queryClient.getQueryData(['test2'])).toBeUndefined()
    })
  })

  describe('Query Client Configuration', () => {
    it('should have properly typed default options', () => {
      const queryClient = makeQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      expect(defaultOptions).toBeDefined()
      expect(defaultOptions.queries).toBeDefined()
      expect(defaultOptions.dehydrate).toBeDefined()
      expect(defaultOptions.hydrate).toBeDefined()
    })

    it('should maintain default query options', () => {
      const queryClient = makeQueryClient()
      const options = queryClient.getDefaultOptions()
      
      expect(options.queries).toHaveProperty('staleTime')
    })
  })
})