import { useState, useEffect } from 'react';
import { Palette, Upload, Eye, Save, RotateCcw, Sparkles, Globe, Code, Monitor, Mail, Plus, Trash2, ExternalLink, Settings, ShoppingCart, Shield, BarChart3 } from 'lucide-react';
import { useTenant } from '../components/TenantProvider';
import { ConditionalRender } from '../components/RoleBasedAccess';
import DomainAnalytics from '../components/analytics/DomainAnalytics';
import AutoSSL from '../components/security/AutoSSL';
import DomainHealthMonitor from '../components/monitoring/DomainHealthMonitor';
import ABTestingManager from '../components/testing/ABTestingManager';

interface DomainConfig {
  id: string;
  domain: string;
  type: 'primary' | 'sales' | 'support' | 'custom';
  isActive: boolean;
  sslStatus: 'pending' | 'active' | 'failed';
  salesPageTemplate?: string;
  customSettings?: {
    redirectUrl?: string;
    analyticsId?: string;
    conversionTracking?: string;
  };
}

interface SalesPageConfig {
  id: string;
  name: string;
  template: string;
  domain: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaColor: string;
  features: string[];
  testimonials: unknown[];
  pricing: unknown[];
  isActive: boolean;
}

interface BrandingConfig {
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  companyName: string;
  tagline?: string;
  domains: DomainConfig[];
  salesPages: SalesPageConfig[];
  customCSS?: string;
  footerText?: string;
  loginPageConfig: {
    backgroundImage?: string;
    welcomeMessage?: string;
    supportEmail?: string;
  };
  emailConfig: {
    fromName?: string;
    replyToEmail?: string;
    emailSignature?: string;
    headerLogo?: string;
  };
  features: {
    showPoweredBy: boolean;
    customFavicon: boolean;
    customEmailTemplates: boolean;
    advancedBranding: boolean;
    whiteLabel: boolean;
    multiDomain: boolean;
    salesPageBuilder: boolean;
  };
}

export default function WhiteLabelCustomization() {
  const [config, setConfig] = useState<BrandingConfig>({
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    companyName: '',
    domains: [
      {
        id: '1',
        domain: 'yourcrm.com',
        type: 'primary',
        isActive: true,
        sslStatus: 'active'
      }
    ],
    salesPages: [],
    loginPageConfig: {},
    emailConfig: {},
    features: {
      showPoweredBy: true,
      customFavicon: false,
      customEmailTemplates: false,
      advancedBranding: false,
      whiteLabel: false,
      multiDomain: false,
      salesPageBuilder: false,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'email'>('desktop');
  const [activeTab, setActiveTab] = useState('basic');

  const { tenant, applyBranding } = useTenant();

  useEffect(() => {
    fetchBrandingConfig();
  }, [tenant]);

  const fetchBrandingConfig = async () => {
    try {
      setIsLoading(true);
      if (tenant) {
        const response = await fetch(`/api/white-label/tenants/${tenant.id}/branding`);
        if (response.ok) {
          const brandingData = await response.json();
          setConfig({ ...config, ...brandingData });
        }
      }
    } catch (error) {
      console.error('Failed to fetch branding config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBrandingConfig = async () => {
    try {
      setSaving(true);
      if (tenant) {
        const response = await fetch(`/api/white-label/tenants/${tenant.id}/branding`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config),
        });

        if (response.ok) {
          alert('Branding configuration saved successfully!');
          applyBranding(); // Apply changes immediately
        } else {
          alert('Failed to save branding configuration');
        }
      }
    } catch (error) {
      alert('Error saving branding configuration');
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default branding? This will lose all customizations.')) {
      setConfig({
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        accentColor: '#10B981',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        companyName: '',
        domains: [
          {
            id: '1',
            domain: 'yourcrm.com',
            type: 'primary',
            isActive: true,
            sslStatus: 'active'
          }
        ],
        salesPages: [],
        loginPageConfig: {},
        emailConfig: {},
        features: {
          showPoweredBy: true,
          customFavicon: false,
          customEmailTemplates: false,
          advancedBranding: false,
          whiteLabel: false,
          multiDomain: false,
          salesPageBuilder: false,
        },
      });
    }
  };

  const uploadFile = async (file: File, type: 'logo' | 'favicon' | 'background') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/white-label/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        return url;
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'background') => {
    const file = event.target.files?.[0];
    if (file) {
      const url = await uploadFile(file, type);
      if (url) {
        if (type === 'logo') {
          setConfig({ ...config, logo: url });
        } else if (type === 'favicon') {
          setConfig({ ...config, favicon: url });
        } else if (type === 'background') {
          setConfig({
            ...config,
            loginPageConfig: { ...config.loginPageConfig, backgroundImage: url }
          });
        }
      }
    }
  };

  const presetThemes = [
    { name: 'Default Blue', primary: '#3B82F6', secondary: '#1E40AF', accent: '#10B981' },
    { name: 'Professional Gray', primary: '#6B7280', secondary: '#374151', accent: '#059669' },
    { name: 'Elegant Purple', primary: '#8B5CF6', secondary: '#7C3AED', accent: '#F59E0B' },
    { name: 'Modern Green', primary: '#10B981', secondary: '#059669', accent: '#3B82F6' },
    { name: 'Warm Orange', primary: '#F97316', secondary: '#EA580C', accent: '#EF4444' },
    { name: 'Dark Mode', primary: '#1F2937', secondary: '#111827', accent: '#3B82F6' },
  ];

  const applyTheme = (theme: typeof presetThemes[0]) => {
    setConfig({
      ...config,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
      accentColor: theme.accent,
    });
  };

  const addDomain = () => {
    const newDomain: DomainConfig = {
      id: Date.now().toString(),
      domain: '',
      type: 'custom',
      isActive: false,
      sslStatus: 'pending'
    };
    setConfig({
      ...config,
      domains: [...config.domains, newDomain]
    });
  };

  const updateDomain = (domainId: string, updates: Partial<DomainConfig>) => {
    setConfig({
      ...config,
      domains: config.domains.map(domain => 
        domain.id === domainId ? { ...domain, ...updates } : domain
      )
    });
  };

  const removeDomain = (domainId: string) => {
    setConfig({
      ...config,
      domains: config.domains.filter(domain => domain.id !== domainId)
    });
  };

  const addSalesPage = () => {
    const newSalesPage: SalesPageConfig = {
      id: Date.now().toString(),
      name: 'New Sales Page',
      template: 'modern',
      domain: config.domains[0]?.domain || '',
      headline: 'Transform Your Business Today',
      subheadline: 'Discover the power of our solution',
      ctaText: 'Get Started Now',
      ctaColor: config.primaryColor,
      features: [],
      testimonials: [],
      pricing: [],
      isActive: false
    };
    setConfig({
      ...config,
      salesPages: [...config.salesPages, newSalesPage]
    });
  };

  const updateSalesPage = (pageId: string, updates: Partial<SalesPageConfig>) => {
    setConfig({
      ...config,
      salesPages: config.salesPages.map(page => 
        page.id === pageId ? { ...page, ...updates } : page
      )
    });
  };

  const removeSalesPage = (pageId: string) => {
    setConfig({
      ...config,
      salesPages: config.salesPages.filter(page => page.id !== pageId)
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading branding configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Modern Dashboard Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-4">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  White-Label Customization
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  Transform your brand identity with advanced customization tools
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetToDefaults}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-white/90 dark:hover:bg-gray-700/90 flex items-center gap-2 transition-all duration-200"
              >
                <RotateCcw className="h-5 w-5" />
                Reset
              </button>
              <button
                onClick={saveBrandingConfig}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Save className="h-5 w-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          
          {/* Enhanced KPI Summary */}
          <div className="pb-8">
            <div className="p-6 rounded-xl border border-white/20 dark:border-gray-700/50 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20 dark:bg-blue-500/30 mr-4">
                    <Settings className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Features</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Object.values(config.features).filter(f => f).length}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-500/20 dark:bg-purple-500/30 mr-4">
                    <Shield className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">SSL Status</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">Secure</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-500/20 dark:bg-green-500/30 mr-4">
                    <Globe className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Domains</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {config.domains.length}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-pink-500/20 dark:bg-pink-500/30 mr-4">
                    <BarChart3 className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Performance</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">98.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Modern Navigation Tabs */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/20 dark:border-gray-700/50 shadow-lg p-2">
              <nav className="flex flex-wrap gap-2">
                {[
                  { id: 'basic', label: 'Basic Branding', icon: Palette },
                  { id: 'advanced', label: 'Advanced', icon: Sparkles },
                  { id: 'domain', label: 'Domain & URLs', icon: Globe },
                  { id: 'sales', label: 'Sales Pages', icon: ShoppingCart },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'ssl', label: 'SSL Security', icon: Shield },
                  { id: 'monitoring', label: 'Monitoring', icon: Activity },
                  { id: 'testing', label: 'A/B Testing', icon: TestTube },
                  { id: 'code', label: 'Custom Code', icon: Code },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Basic Branding Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                {/* Company Information */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={config.companyName}
                        onChange={(e) => setConfig({ ...config, companyName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={config.tagline || ''}
                        onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your company tagline"
                      />
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-500" />
                    Logo & Assets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {config.logo ? (
                          <img src={config.logo} alt="Logo" className="h-16 mx-auto mb-2" />
                        ) : (
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                        >
                          Upload Logo
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Favicon
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {config.favicon ? (
                          <img src={config.favicon} alt="Favicon" className="h-8 mx-auto mb-2" />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'favicon')}
                          className="hidden"
                          id="favicon-upload"
                        />
                        <label
                          htmlFor="favicon-upload"
                          className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                        >
                          Upload Favicon
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-pink-500" />
                    Color Scheme
                  </h3>
                  
                  {/* Preset Themes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Quick Themes
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {presetThemes.map((theme) => (
                        <button
                          key={theme.name}
                          onClick={() => applyTheme(theme)}
                          className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.primary }}></div>
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.secondary }}></div>
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.accent }}></div>
                          </div>
                          <span className="text-sm font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Primary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={config.primaryColor}
                          onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Secondary Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={config.secondaryColor}
                          onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Accent Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={config.accentColor}
                          onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={config.accentColor}
                          onChange={(e) => setConfig({ ...config, accentColor: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === 'advanced' && (
              <div className="space-y-6">
                {/* Login Page Customization */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Login Page Customization
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Welcome Message
                      </label>
                      <input
                        type="text"
                        value={config.loginPageConfig.welcomeMessage || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          loginPageConfig: { ...config.loginPageConfig, welcomeMessage: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Welcome to our platform"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Background Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {config.loginPageConfig.backgroundImage ? (
                          <img src={config.loginPageConfig.backgroundImage} alt="Background" className="h-20 mx-auto mb-2 object-cover rounded" />
                        ) : (
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'background')}
                          className="hidden"
                          id="background-upload"
                        />
                        <label
                          htmlFor="background-upload"
                          className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                        >
                          Upload Background
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Configuration */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Mail className="h-5 w-5 text-green-500" />
                    Email Branding
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={config.emailConfig.fromName || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          emailConfig: { ...config.emailConfig, fromName: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your Company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reply-To Email
                      </label>
                      <input
                        type="email"
                        value={config.emailConfig.replyToEmail || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          emailConfig: { ...config.emailConfig, replyToEmail: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="noreply@yourcompany.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    White-Label Features
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'showPoweredBy', label: 'Show "Powered by" branding', description: 'Display platform attribution' },
                      { key: 'customFavicon', label: 'Custom favicon support', description: 'Use your own favicon' },
                      { key: 'customEmailTemplates', label: 'Custom email templates', description: 'Branded email communications' },
                      { key: 'advancedBranding', label: 'Advanced branding options', description: 'CSS customization and more' },
                      { key: 'whiteLabel', label: 'Complete white-label mode', description: 'Remove all platform branding' },
                      { key: 'multiDomain', label: 'Multi-domain support', description: 'Use multiple custom domains' },
                      { key: 'salesPageBuilder', label: 'Sales page builder', description: 'Create custom sales pages' },
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{feature.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                        </div>
                        <button
                          onClick={() => setConfig({
                            ...config,
                            features: {
                              ...config.features,
                              [feature.key]: !config.features[feature.key as keyof typeof config.features]
                            }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            config.features[feature.key as keyof typeof config.features] ? 'bg-purple-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              config.features[feature.key as keyof typeof config.features] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Domain Tab */}
            {activeTab === 'domain' && (
              <div className="space-y-6">
                {/* Domain Management */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-500" />
                      Domain Management
                    </h3>
                    <button
                      onClick={addDomain}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Domain
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {config.domains.map((domain) => (
                      <div key={domain.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Domain Name
                            </label>
                            <input
                              type="text"
                              value={domain.domain}
                              onChange={(e) => updateDomain(domain.id, { domain: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              placeholder="example.com"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <select
                              value={domain.type}
                              onChange={(e) => updateDomain(domain.id, { type: e.target.value as unknown })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="primary">Primary</option>
                              <option value="sales">Sales Page</option>
                              <option value="support">Support</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                SSL Status
                              </label>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                domain.sslStatus === 'active' ? 'bg-green-100 text-green-800' :
                                domain.sslStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {domain.sslStatus}
                              </span>
                            </div>
                            {domain.type !== 'primary' && (
                              <button
                                onClick={() => removeDomain(domain.id)}
                                className="p-2 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {domain.type === 'sales' && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Sales Page Settings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Analytics ID
                                </label>
                                <input
                                  type="text"
                                  value={domain.customSettings?.analyticsId || ''}
                                  onChange={(e) => updateDomain(domain.id, {
                                    customSettings: { ...domain.customSettings, analyticsId: e.target.value }
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="UA-XXXXXX-X"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Conversion Tracking
                                </label>
                                <input
                                  type="text"
                                  value={domain.customSettings?.conversionTracking || ''}
                                  onChange={(e) => updateDomain(domain.id, {
                                    customSettings: { ...domain.customSettings, conversionTracking: e.target.value }
                                  })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  placeholder="GTM-XXXXXX"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* DNS Configuration Guide */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    DNS Configuration Guide
                  </h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                    To use custom domains, configure your DNS records as follows:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">CNAME</code>
                      <span className="text-blue-700 dark:text-blue-300">Point your domain to: crm.yourplatform.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">A Record</code>
                      <span className="text-blue-700 dark:text-blue-300">IP: 192.168.1.100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sales Pages Tab */}
            {activeTab === 'sales' && (
              <div className="space-y-6">
                {/* Sales Page Management */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Sales Page Templates
                    </h3>
                    <button
                      onClick={addSalesPage}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create Sales Page
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {config.salesPages.map((page) => (
                      <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">{page.name}</h4>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateSalesPage(page.id, { isActive: !page.isActive })}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                page.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {page.isActive ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => removeSalesPage(page.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Page Name
                            </label>
                            <input
                              type="text"
                              value={page.name}
                              onChange={(e) => updateSalesPage(page.id, { name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Template
                            </label>
                            <select
                              value={page.template}
                              onChange={(e) => updateSalesPage(page.id, { template: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              <option value="modern">Modern</option>
                              <option value="classic">Classic</option>
                              <option value="minimal">Minimal</option>
                              <option value="premium">Premium</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Domain
                            </label>
                            <select
                              value={page.domain}
                              onChange={(e) => updateSalesPage(page.id, { domain: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                              {config.domains.map((domain) => (
                                <option key={domain.id} value={domain.domain}>
                                  {domain.domain}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                page.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {page.isActive ? 'Published' : 'Draft'}
                              </span>
                              <button className="p-1 text-blue-500 hover:text-blue-700">
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Headline
                            </label>
                            <input
                              type="text"
                              value={page.headline}
                              onChange={(e) => updateSalesPage(page.id, { headline: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Subheadline
                            </label>
                            <input
                              type="text"
                              value={page.subheadline}
                              onChange={(e) => updateSalesPage(page.id, { subheadline: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CTA Text
                              </label>
                              <input
                                type="text"
                                value={page.ctaText}
                                onChange={(e) => updateSalesPage(page.id, { ctaText: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CTA Color
                              </label>
                              <input
                                type="color"
                                value={page.ctaColor}
                                onChange={(e) => updateSalesPage(page.id, { ctaColor: e.target.value })}
                                className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {config.salesPages.length === 0 && (
                      <div className="text-center py-12">
                        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Sales Pages Yet</h3>
                        <p className="text-gray-500 mb-4">Create your first sales page to get started</p>
                        <button
                          onClick={addSalesPage}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                        >
                          <Plus className="h-4 w-4" />
                          Create Sales Page
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Template Library */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Available Templates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: 'Modern', description: 'Clean, contemporary design', preview: '/templates/modern.jpg' },
                      { name: 'Classic', description: 'Traditional business layout', preview: '/templates/classic.jpg' },
                      { name: 'Minimal', description: 'Simple, focused design', preview: '/templates/minimal.jpg' },
                      { name: 'Premium', description: 'High-end, professional', preview: '/templates/premium.jpg' }
                    ].map((template) => (
                      <div key={template.name} className="border border-gray-200 rounded-lg p-3 hover:border-purple-500 transition-colors">
                        <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-gray-500 text-sm">{template.name} Preview</span>
                        </div>
                        <h5 className="font-medium text-gray-900 mb-1">{template.name}</h5>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <DomainAnalytics 
                  domainId={config.domains[0]?.id || '1'} 
                  domainName={config.domains[0]?.domain || 'demo.com'} 
                />
              </div>
            )}

            {/* SSL Security Tab */}
            {activeTab === 'ssl' && (
              <div className="space-y-6">
                <AutoSSL 
                  tenantId={tenant?.id || 'demo'} 
                  domains={config.domains} 
                  onSSLUpdate={(domainId, sslStatus) => {
                    updateDomain(domainId, { sslStatus: sslStatus as unknown });
                  }}
                />
              </div>
            )}

            {/* Monitoring Tab */}
            {activeTab === 'monitoring' && (
              <div className="space-y-6">
                <DomainHealthMonitor 
                  tenantId={tenant?.id || 'demo'} 
                  domains={config.domains} 
                />
              </div>
            )}

            {/* A/B Testing Tab */}
            {activeTab === 'testing' && (
              <div className="space-y-6">
                <ABTestingManager 
                  tenantId={tenant?.id || 'demo'} 
                  domains={config.domains} 
                  salesPages={config.salesPages} 
                />
              </div>
            )}

            {/* Custom Code Tab */}
            {activeTab === 'code' && (
              <ConditionalRender resource="custom_branding">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Custom CSS
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional CSS
                    </label>
                    <textarea
                      value={config.customCSS || ''}
                      onChange={(e) => setConfig({ ...config, customCSS: e.target.value })}
                      className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      placeholder="/* Add your custom CSS here */"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Custom CSS will be injected into your application
                    </p>
                  </div>
                </div>
              </ConditionalRender>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {/* Preview Controls */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  Live Preview
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  >
                    <Monitor className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  >
                    <div className="h-4 w-4 border-2 border-current rounded-sm"></div>
                  </button>
                  <button
                    onClick={() => setPreviewMode('email')}
                    className={`p-2 rounded ${previewMode === 'email' ? 'bg-purple-100 text-purple-600' : 'text-gray-500'}`}
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className={`border rounded-lg overflow-hidden ${
                previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
              }`}>
                {previewMode === 'desktop' || previewMode === 'mobile' ? (
                  <div 
                    className="p-6"
                    style={{ 
                      backgroundColor: config.backgroundColor,
                      color: config.textColor 
                    }}
                  >
                    {/* Header Preview */}
                    <div 
                      className="flex items-center justify-between p-4 rounded-lg mb-4"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <div className="flex items-center gap-3">
                        {config.logo && (
                          <img src={config.logo} alt="Logo" className="h-8" />
                        )}
                        <span className="text-white font-semibold">{config.companyName || 'Your Company'}</span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold" style={{ color: config.textColor }}>
                        Welcome to {config.companyName || 'Your Company'}
                      </h2>
                      {config.tagline && (
                        <p className="text-gray-600">{config.tagline}</p>
                      )}
                      
                      <button 
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        Get Started
                      </button>
                      
                      <button 
                        className="px-4 py-2 rounded-lg font-medium ml-2"
                        style={{ 
                          backgroundColor: config.secondaryColor,
                          color: 'white'
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Email Preview */
                  <div className="p-4 bg-gray-100">
                    <div className="bg-white rounded-lg p-6 max-w-md">
                      {config.emailConfig.headerLogo && (
                        <img src={config.emailConfig.headerLogo} alt="Logo" className="h-12 mb-4" />
                      )}
                      <h3 className="text-lg font-semibold mb-4">
                        Email from {config.emailConfig.fromName || config.companyName || 'Your Company'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        This is how your emails will appear to customers.
                      </p>
                      <div className="border-t pt-4 text-sm text-gray-500">
                        {config.emailConfig.emailSignature || `Best regards,\n${config.companyName || 'Your Company'} Team`}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Settings className="h-4 w-4 text-purple-500" />
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={saveBrandingConfig}
                  className="w-full p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save & Apply
                </button>
                <button
                  onClick={() => window.open('/', '_blank')}
                  className="w-full p-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview Live
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}