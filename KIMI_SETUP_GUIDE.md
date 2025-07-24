# Kimi AI Integration Setup Guide

## Environment Variables

Add the following to your `.env` file:

```bash
# Kimi AI Configuration
VITE_KIMI_API_KEY=your_moonshot_api_key_here
```

## Getting Your Kimi API Key

1. **Visit Moonshot AI Platform**: Go to [https://platform.moonshot.ai](https://platform.moonshot.ai)
2. **Create Account**: Sign up or log in to your account
3. **Generate API Key**: Navigate to the API section and create a new API key
4. **Add to Environment**: Copy the key and add it to your `.env` file

## API Endpoints

- **Base URL**: `https://platform.moonshot.ai/v1`
- **Model**: `kimi-k2-instruct`
- **Compatible with**: OpenAI API format

## Usage Examples

### Basic Error Analysis
```typescript
import { kimiDebugService } from './services/kimiDebugService';

// Analyze an error
const analysis = await kimiDebugService.analyzeError(
  'Cannot read property of undefined',
  'const user = data.user.name;'
);
```

### React Hook Integration
```typescript
import { useKimiDebug } from './hooks/useKimiDebug';

function MyComponent() {
  const { debugError, isAnalyzing } = useKimiDebug();
  
  const handleError = async (error: Error) => {
    const analysis = await debugError(error, 'Component context');
    console.log(analysis);
  };
}
```

### Floating Debug Assistant
The floating debug assistant is automatically available in your app. Click the bug icon in the bottom-right corner to:

- Analyze errors in real-time
- Get code explanations
- Receive debugging suggestions
- Debug React component issues

## Features

### 🔧 Error Analysis
- Automatic error detection
- Stack trace analysis
- Context-aware debugging
- Severity assessment

### 💡 Code Intelligence
- Code explanation
- Performance optimization
- Best practice suggestions
- Framework-specific advice

### 🛠️ Tool Integration
- Function calling capabilities
- Custom tool definitions
- Streaming responses
- Real-time feedback

### 🎯 React Integration
- Component debugging
- Hook integration
- Error boundaries
- Development mode features

## Configuration Options

### Service Configuration
```typescript
// Custom configuration
const kimiService = new KimiDebugService({
  apiKey: 'your-key',
  baseUrl: 'https://platform.moonshot.ai/v1',
  modelName: 'kimi-k2-instruct',
  temperature: 0.6
});
```

### Hook Options
```typescript
const debug = useKimiDebug({
  autoAnalyzeErrors: true,      // Auto-analyze console errors
  enableConsoleCapture: true    // Capture console.error calls
});
```

## API Rate Limits

- Check your Moonshot AI dashboard for current rate limits
- The service includes automatic retry logic
- Errors are gracefully handled with fallback responses

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correct in `.env`
   - Check if the key has proper permissions
   - Ensure the key hasn't expired

2. **Network Issues**
   - Check internet connectivity
   - Verify firewall settings
   - Test with curl: `curl -H "Authorization: Bearer YOUR_KEY" https://platform.moonshot.ai/v1/models`

3. **CORS Issues**
   - This shouldn't occur with the platform.moonshot.ai endpoint
   - If using a proxy, ensure CORS headers are configured

### Debug Mode

Enable debug logging:
```typescript
// Add to your console
localStorage.setItem('kimi-debug', 'true');
```

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider using server-side proxy for production
- Monitor API usage to prevent abuse

## Support

- **Documentation**: [Kimi-K2 GitHub](https://github.com/deangilmoreremix/Kimi-K2)
- **API Docs**: [Moonshot AI Platform](https://platform.moonshot.ai/docs)
- **Issues**: Report bugs in your project repository
