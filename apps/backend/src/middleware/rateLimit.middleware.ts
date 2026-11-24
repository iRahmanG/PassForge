import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skip?: (req: Request) => boolean;
}

/**
 * Lightweight, zero-dependency in-memory sliding-window rate limiter for public demo protection
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, max, message = 'Too many requests, please try again later.', skip } = options;
  const hits = new Map<string, RateLimitRecord>();

  // Cleanup expired IPs every 60 seconds to prevent unbounded memory growth
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now > record.resetTime) {
        hits.delete(key);
      }
    }
  }, 60_000);

  // Unref timer so it doesn't hold open Node process on shutdown
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }

  return (req: Request, res: Response, next: NextFunction): void => {
    if (skip && skip(req)) {
      return next();
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    let record = hits.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      hits.set(ip, record);
    } else {
      record.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000),
      });
      return;
    }

    next();
  };
}

// 1. Bulk job creation & retry: max 20 requests per minute
export const bulkJobLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Bulk ticket generation rate limit exceeded. Please wait a minute before creating new batch exports.',
});

// 2. CSV file upload: max 30 requests per minute
export const csvUploadLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: 'Attendee CSV upload rate limit exceeded. Please wait a moment.',
});

// 3. General API limiter: 300 requests per minute, skipping polling endpoints
export const generalApiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
  message: 'API rate limit exceeded. Please try again in a few moments.',
  skip: (req: Request) => {
    // Crucial: Only exempt the 600ms bulk progress polling route (GET /bulk/:jobId).
    // Never exempt ZIP downloads (/bulk/:jobId/download) or other endpoints.
    return req.method === 'GET' && /^\/bulk\/[^/]+$/.test(req.path);
  },
});
