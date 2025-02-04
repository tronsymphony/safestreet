// lib/rateLimit.js
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 60, // Per 60 seconds
});

export const rateLimit = (options) => {
  return {
    check: async (res, maxPoints, key) => {
      try {
        await rateLimiter.consume(key, maxPoints);
      } catch (rejRes) {
        res.setHeader('Retry-After', Math.ceil(rejRes.msBeforeNext / 1000));
        throw new Error('Rate limit exceeded');
      }
    },
  };
};