import React, { useState } from 'react';
import { Camera, Download, RefreshCw, Wand2, Settings, Eye, Palette, Grid, Zap } from 'lucide-react';

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState({
    style: 'realistic',
    size: '1024x1024',
    quality: 'high',
    model: 'dall-e-3'
  });

  const styles = [
    { value: 'realistic', label: 'Realistic', description: 'Photo-realistic images' },
    { value: 'artistic', label: 'Artistic', description: 'Artistic and creative style' },
    { value: 'cartoon', label: 'Cartoon', description: 'Cartoon and animated style' },
    { value: 'abstract', label: 'Abstract', description: 'Abstract and conceptual' },
    { value: 'vintage', label: 'Vintage', description: 'Retro and vintage style' },
    { value: 'futuristic', label: 'Futuristic', description: 'Sci-fi and futuristic' }
  ];

  const sizes = [
    { value: '256x256', label: '256×256', description: 'Small square' },
    { value: '512x512', label: '512×512', description: 'Medium square' },
    { value: '1024x1024', label: '1024×1024', description: 'Large square' },
    { value: '1792x1024', label: '1792×1024', description: 'Landscape' },
    { value: '1024x1792', label: '1024×1792', description: 'Portrait' }
  ];

  const models = [
    { value: 'dall-e-3', label: 'DALL-E 3', description: 'Latest and most advanced' },
    { value: 'dall-e-2', label: 'DALL-E 2', description: 'Fast and reliable' },
    { value: 'stable-diffusion', label: 'Stable Diffusion', description: 'Open source option' }
  ];

  const promptSuggestions = [
    'A professional business meeting in a modern office with glass walls',
    'A futuristic city skyline at sunset with flying cars',
    'A cozy coffee shop with warm lighting and comfortable seating',
    'An abstract representation of data flowing through networks',
    'A minimalist workspace with clean lines and natural light',
    'A vibrant marketplace with diverse people and colorful stalls'
  ];

  const mockGeneratedImages = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1552664688-cf412ec27db2?w=300&h=300&fit=crop',
      prompt: 'Professional business meeting in modern office',
      timestamp: new Date().toISOString(),
      settings: { style: 'realistic', size: '1024x1024', model: 'dall-e-3' }
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop',
      prompt: 'Futuristic city skyline at sunset',
      timestamp: new Date().toISOString(),
      settings: { style: 'futuristic', size: '1024x1024', model: 'dall-e-3' }
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop',
      prompt: 'Cozy coffee shop with warm lighting',
      timestamp: new Date().toISOString(),
      settings: { style: 'artistic', size: '1024x1024', model: 'dall-e-2' }
    }
  ];

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          style: settings.style,
          size: settings.size,
          model: settings.model,
          quality: settings.quality
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const newImage = {
          id: Date.now().toString(),
          url: data.imageUrl || `https://images.unsplash.com/photo-${Date.now()}?w=300&h=300&fit=crop`,
          prompt: prompt,
          timestamp: new Date().toISOString(),
          settings: { ...settings }
        };
        
        setGeneratedImages([newImage, ...generatedImages]);
      } else {
        // Fallback to placeholder
        const newImage = {
          id: Date.now().toString(),
          url: `https://images.unsplash.com/photo-${Date.now()}?w=300&h=300&fit=crop`,
          prompt: prompt,
          timestamp: new Date().toISOString(),
          settings: { ...settings }
        };
        
        setGeneratedImages([newImage, ...generatedImages]);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      // Fallback to placeholder
      const newImage = {
        id: Date.now().toString(),
        url: `https://images.unsplash.com/photo-${Date.now()}?w=300&h=300&fit=crop`,
        prompt: prompt,
        timestamp: new Date().toISOString(),
        settings: { ...settings }
      };
      
      setGeneratedImages([newImage, ...generatedImages]);
    }
    
    setIsGenerating(false);
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'generated-image.jpg';
    link.click();
  };

  const regenerateImage = (originalPrompt) => {
    setPrompt(originalPrompt);
    generateImage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Image Generator
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Generate stunning images from text descriptions using AI
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {generatedImages.length} images created
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt Input */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Wand2 className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Describe Your Image
                </h3>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                  rows={4}
                  placeholder="Describe the image you want to generate..."
                />
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {prompt.length}/1000 characters
                  </div>
                  <button
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Generate Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt Suggestions */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Palette className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Prompt Suggestions
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {promptSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(suggestion)}
                    className="text-left p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {suggestion}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Images */}
            {generatedImages.length > 0 && (
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Grid className="w-5 h-5 text-green-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Generated Images
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedImages.map((image) => (
                    <div key={image.id} className="group relative">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.prompt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => downloadImage(image.url, `generated-${image.id}.jpg`)}
                            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => regenerateImage(image.prompt)}
                            className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {image.prompt}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{image.settings.model}</span>
                          <span>{image.settings.size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Generation Settings
                </h3>
              </div>
              
              <div className="space-y-6">
                {/* Style */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style
                  </label>
                  <select
                    value={settings.style}
                    onChange={(e) => setSettings({...settings, style: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {styles.map(style => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {styles.find(s => s.value === settings.style)?.description}
                  </p>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Size
                  </label>
                  <select
                    value={settings.size}
                    onChange={(e) => setSettings({...settings, size: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {sizes.map(size => (
                      <option key={size.value} value={size.value}>
                        {size.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {sizes.find(s => s.value === settings.size)?.description}
                  </p>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    AI Model
                  </label>
                  <select
                    value={settings.model}
                    onChange={(e) => setSettings({...settings, model: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {models.map(model => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {models.find(m => m.value === settings.model)?.description}
                  </p>
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality
                  </label>
                  <select
                    value={settings.quality}
                    onChange={(e) => setSettings({...settings, quality: e.target.value})}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="standard">Standard</option>
                    <option value="high">High (HD)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Tips for Better Results
                </h3>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be specific about details like lighting, colors, and composition</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Include art styles or camera angles for better results</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use descriptive adjectives like "vibrant", "soft", "dramatic"</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Avoid conflicting descriptions or too many complex elements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;