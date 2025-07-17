// Simple database connection test
import { config } from 'dotenv';
import postgres from 'postgres';

config();

const client = postgres(process.env.DATABASE_URL, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    const result = await client`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully!');
    console.log('⏰ Server time:', result[0].current_time);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
