import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTRPCContext, createTRPCRouter, createCallerFactory, baseProcedure } from '../init'

describe('tRPC Initialization', () => {
  describe('createTRPCContext', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should create a context with userId', async () => {
      const context = await createTRPCContext()
      
      expect(context).toBeDefined()
      expect(context).toHaveProperty('userId')
      expect(context.userId).toBe('user_123')
    })

    it('should return the same context structure on multiple calls', async () => {
      const context1 = await createTRPCContext()
      const context2 = await createTRPCContext()
      
      expect(context1).toEqual(context2)
      expect(context1.userId).toBe(context2.userId)
    })

    it('should be an async function', () => {
      const result = createTRPCContext()
      expect(result).toBeInstanceOf(Promise)
    })

    it('should always return an object with userId property', async () => {
      const context = await createTRPCContext()
      
      expect(typeof context).toBe('object')
      expect(Object.keys(context)).toContain('userId')
    })

    it('should handle multiple concurrent calls', async () => {
      const promises = Array(5).fill(null).map(() => createTRPCContext())
      const results = await Promise.all(promises)
      
      results.forEach(result => {
        expect(result.userId).toBe('user_123')
      })
    })
  })

  describe('createTRPCRouter', () => {
    it('should be defined and be a function', () => {
      expect(createTRPCRouter).toBeDefined()
      expect(typeof createTRPCRouter).toBe('function')
    })

    it('should create a router with empty routes', () => {
      const router = createTRPCRouter({})
      
      expect(router).toBeDefined()
      expect(typeof router).toBe('object')
    })

    it('should create a router with query procedures', async () => {
      const router = createTRPCRouter({
        test: baseProcedure.query(() => {
          return { message: 'test' }
        }),
      })
      
      expect(router).toBeDefined()
      expect(router._def).toBeDefined()
    })

    it('should create a router with mutation procedures', () => {
      const router = createTRPCRouter({
        testMutation: baseProcedure.mutation(() => {
          return { success: true }
        }),
      })
      
      expect(router).toBeDefined()
    })

    it('should create a router with multiple procedures', () => {
      const router = createTRPCRouter({
        query1: baseProcedure.query(() => 'query1'),
        query2: baseProcedure.query(() => 'query2'),
        mutation1: baseProcedure.mutation(() => 'mutation1'),
      })
      
      expect(router).toBeDefined()
      expect(router._def.procedures).toBeDefined()
    })
  })

  describe('createCallerFactory', () => {
    it('should be defined and be a function', () => {
      expect(createCallerFactory).toBeDefined()
      expect(typeof createCallerFactory).toBe('function')
    })

    it('should create a caller from a router', async () => {
      const router = createTRPCRouter({
        test: baseProcedure.query(() => {
          return { message: 'test' }
        }),
      })
      
      const createCaller = createCallerFactory(router)
      expect(createCaller).toBeDefined()
      expect(typeof createCaller).toBe('function')
    })

    it('should allow calling procedures through the caller', async () => {
      const router = createTRPCRouter({
        hello: baseProcedure.query(() => {
          return 'Hello World'
        }),
      })
      
      const createCaller = createCallerFactory(router)
      const context = await createTRPCContext()
      const caller = createCaller(context)
      
      const result = await caller.hello()
      expect(result).toBe('Hello World')
    })
  })

  describe('baseProcedure', () => {
    it('should be defined', () => {
      expect(baseProcedure).toBeDefined()
    })

    it('should have query method', () => {
      expect(baseProcedure.query).toBeDefined()
      expect(typeof baseProcedure.query).toBe('function')
    })

    it('should have mutation method', () => {
      expect(baseProcedure.mutation).toBeDefined()
      expect(typeof baseProcedure.mutation).toBe('function')
    })

    it('should create a query procedure', () => {
      const queryProcedure = baseProcedure.query(() => 'test')
      expect(queryProcedure).toBeDefined()
    })

    it('should create a mutation procedure', () => {
      const mutationProcedure = baseProcedure.mutation(() => 'test')
      expect(mutationProcedure).toBeDefined()
    })

    it('should handle async query functions', async () => {
      const router = createTRPCRouter({
        asyncQuery: baseProcedure.query(async () => {
          return new Promise(resolve => setTimeout(() => resolve('async result'), 10))
        }),
      })
      
      const createCaller = createCallerFactory(router)
      const context = await createTRPCContext()
      const caller = createCaller(context)
      
      const result = await caller.asyncQuery()
      expect(result).toBe('async result')
    })

    it('should handle procedures with input', async () => {
      const router = createTRPCRouter({
        echo: baseProcedure.query((opts) => {
          return opts.input
        }),
      })
      
      expect(router).toBeDefined()
    })
  })
})