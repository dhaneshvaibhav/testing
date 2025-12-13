import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    tls: process.env.REDIS_HOST ? true : false // Enable TLS for remote Redis
  },
  username: process.env.REDIS_USERNAME || 'default', // Use username from env
  password: process.env.REDIS_PASSWORD || undefined,
});

client.on('error', (err) => console.log('❌ Redis Client Error', err));
client.on('connect', () => console.log('✅ Redis Connected'));
client.on('reconnecting', () => console.log('🔄 Redis Reconnecting...'));
client.on('ready', () => console.log('🟢 Redis Ready!'));

await client.connect().catch(err => {
  console.warn('⚠️ Redis connection failed. Running without cache:', err.message);
});

export default client;
