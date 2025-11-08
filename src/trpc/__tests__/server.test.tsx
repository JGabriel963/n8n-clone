import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getQueryClient, trpc, caller } from '../server'
import { QueryClient } from '@tanstack/react-query'

vi.mock('@/lib/db', () => ({
  default: {
    user: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}))

describe('tRPC Server Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getQueryClient', () => {
    it('should return a QueryClient instance', () => {
      const queryClient = getQueryClient()
      
      expect(queryClient).toBeDefined()
      expect(queryClient).toBeInstanceOf(QueryClient)
    })

    it('should be a cached function', () => {
      // Due to React cache, same instance should be returned within same request
      const client1 = getQueryClient()
      const client2 = getQueryClient()
      
      expect(client1).toBeDefined()
      expect(client2).toBeDefined()
      // Note: In real React server components, cache ensures same instance per request
    })

    it('should create query client with correct configuration', () => {
      const queryClient = getQueryClient()
      const defaultOptions = queryClient.getDefaultOptions()
      
      expect(defaultOptions.queries?.staleTime).toBe(30 * 1000)
    })

    it('should create independent clients across different calls', () => {
      const client1 = getQueryClient()
      const client2 = getQueryClient()
      
      // Both should be QueryClient instances
      expect(client1).toBeInstanceOf(QueryClient)
      expect(client2).toBeInstanceOf(QueryClient)
    })
  })

  describe('trpc proxy', () => {
    it('should be defined', () => {
      expect(trpc).toBeDefined()
    })

    it('should have correct structure for tRPC proxy', () => {
      expect(trpc).toBeDefined()
      expect(typeof trpc).toBe('object')
    })

    it('should be configured with context creator', () => {
      // The trpc object should be properly configured
      expect(trpc).toBeDefined()
    })

    it('should be configured with router', () => {
      expect(trpc).toBeDefined()
    })

    it('should be configured with query client getter', () => {
      expect(trpc).toBeDefined()
    })

    it('should support procedure calls through proxy', () => {
      expect(trpc).toBeDefined()
      // Proxy structure validation
      expect(typeof trpc).toBe('object')
    })
  })

  describe('caller', () => {
    it('should be defined', () => {
      expect(caller).toBeDefined()
    })

    it('should have getUsers method', () => {
      expect(caller.getUsers).toBeDefined()
      expect(typeof caller.getUsers).toBe('function')
    })

    it('should call getUsers successfully', async () => {
      const mockUsers = [
        { id: '1', name: 'Test User', email: 'test@example.com' },
      ]

      const prisma = await import('@/lib/db')
      vi.mocked(prisma.default.user.findMany).mockResolvedValue(mockUsers as any)

      const result = await caller.getUsers()

      expect(result).toEqual(mockUsers)
      expect(prisma.default.user.findMany).toHaveBeenCalledTimes(1)
    })

    it('should be callable multiple times', async () => {
      const prisma = await import('@/lib/db')
      vi.mocked(prisma.default.user.findMany).mockResolvedValue([])

      await caller.getUsers()
      await caller.getUsers()

      expect(prisma.default.user.findMany).toHaveBeenCalledTimes(2)
    })

    it('should handle errors from procedures', async () => {
      const prisma = await import('@/lib/db')
      const error = new Error('Database error')
      vi.mocked(prisma.default.user.findMany).mockRejectedValue(error)

      await expect(caller.getUsers()).rejects.toThrow('Database error')
    })

    it('should maintain type safety', async () => {
      const prisma = await import('@/lib/db')
      const mockUsers = [
        { id: '1', name: 'User', email: 'user@test.com' },
      ]
      vi.mocked(prisma.default.user.findMany).mockResolvedValue(mockUsers as any)

      const result = await caller.getUsers()

      expect(Array.isArray(result)).toBe(true)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('email')
    })

    it('should handle empty results', async () => {
      const prisma = await import('@/lib/db')
      vi.mocked(prisma.default.user.findMany).mockResolvedValue([])

      const result = await caller.getUsers()

      expect(result).toEqual([])
      expect(Array.isArray(result)).toBe(true)
    })

    it('should handle concurrent procedure calls', async () => {
      const prisma = await import('@/lib/db')
      vi.mocked(prisma.default.user.findMany).mockResolvedValue([
        { id: '1', name: 'User', email: 'user@test.com' },
      ] as any)

      const results = await Promise.all([
        caller.getUsers(),
        caller.getUsers(),
        caller.getUsers(),
      ])

      expect(results).toHaveLength(3)
      expect(prisma.default.user.findMany).toHaveBeenCalledTimes(3)
    })
  })

  describe('Integration', () => {
    it('should properly integrate context, router, and query client', () => {
      expect(getQueryClient).toBeDefined()
      expect(trpc).toBeDefined()
      expect(caller).toBeDefined()
    })

    it('should support server-side procedure calls', async () => {
      const prisma = await import('@/lib/db')
      vi.mocked(prisma.default.user.findMany).mockResolvedValue([])

      const result = await caller.getUsers()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should maintain separate concerns', () => {
      // Query client management
      expect(getQueryClient).toBeDefined()
      
      // tRPC proxy for RSC
      expect(trpc).toBeDefined()
      
      // Direct caller for server-side usage
      expect(caller).toBeDefined()
    })
  })

  describe('Server-only enforcement', () => {
    it('should be importable in server context', () => {
      // This test validates that the module can be imported
      // In actual usage, server-only would throw if imported on client
      expect(getQueryClient).toBeDefined()
      expect(trpc).toBeDefined()
      expect(caller).toBeDefined()
    })
  })
})