// Browser Error Detection Script
// Add this to check for runtime ReferenceErrors

// Create a global error catcher
window.addEventListener('error', (event) => {
  if (event.error && event.error.message.includes('ce')) {
    console.log('🚨 Found CE Error:', {
      message: event.error.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error.stack
    });
  }
});

// Check for any ce variables in global scope
console.log('🔍 Checking global scope for ce...');
if (typeof ce !== 'undefined') {
  console.log('✅ ce is defined:', ce);
} else {
  console.log('❌ ce is not defined in global scope');
}

// Monitor React components for ce references
const originalConsoleError = console.error;
console.error = function(...args) {
  const message = args.join(' ');
  if (message.includes('ce') && (message.includes('ReferenceError') || message.includes('is not defined'))) {
    console.log('🚨 React CE Error detected:', message);
  }
  originalConsoleError.apply(console, args);
};

console.log('✅ CE Error monitoring active');
