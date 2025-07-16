// Simple debug component to test if React is working
console.log('🚀 App is starting...');

// Test environment variables
console.log('🔧 Environment check:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY ? 'SET' : 'NOT SET');
console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'SET' : 'NOT SET');

// Test if we can reach the supabase import
try {
  console.log('📦 Testing Supabase import...');
  // Don't actually import here, just log
  console.log('✅ About to test Supabase client creation');
} catch (error) {
  console.error('❌ Error during Supabase test:', error);
}

export {};
