import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on('error', (err) => console.log('❌ Redis Client Error', err));
client.on('connect', () => console.log('✅ Redis Connected'));
client.on('reconnecting', () => console.log('🔄 Redis Reconnecting...'));

await client.connect().catch(err => {
  console.warn('⚠️ Redis connection failed. Running without cache:', err.message);
});

export default client;
