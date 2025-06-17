import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

redis.on('connect', () => {
  console.log('[Redis] Client connected');
});

redis.on('error', (error) => {
  console.error('[Redis] Error:', error);
});

export default redis; 