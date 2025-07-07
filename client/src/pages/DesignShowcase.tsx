import React from 'react';
import { KPICards } from '../components/dashboard/KPICards';
import { ExecutiveOverviewSection } from '../components/sections/ExecutiveOverviewSection';
import { ContactCard } from '../components/ContactCard';
import { GlassCard } from '../components/ui/GlassCard';
import { ModernButton } from '../components/ui/ModernButton';
import { Avatar } from '../components/ui/Avatar';
import { Brain, Zap, Star, Mail, Phone, Download, Settings, Plus } from 'lucide-react';

const DesignShowcase: React.FC = () => {
  // Sample data for components
  const sampleMetrics = {
    totalContacts: 1247,
    activeDeals: 23,
    monthlyRevenue: 125000,
    conversionRate: 24
  };

  const sampleAIMetrics = {
    activeSuggestions: 12,
    efficiency: 32,
    qualityScore: 87,
    automatedTasks: 45
  };

  const sampleContact = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Corp',
    title: 'Senior Developer',
    status: 'active' as const,
    rating: 4
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Enhanced Design System Showcase
          </h1>
          <p className="text-xl text-gray-300">
            Distributed Tailwind CSS with Glass Morphism & Modern Components
          </p>
        </div>

        {/* KPI Cards Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">KPI Cards</h2>
            <p className="text-gray-300">Enhanced metrics cards with glass morphism effects</p>
          </div>
          <KPICards metrics={sampleMetrics} />
        </section>

        {/* Executive Overview Section */}
        <ExecutiveOverviewSection aiMetrics={sampleAIMetrics} />

        {/* Contact Card Demo */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Contact Cards</h2>
            <p className="text-gray-300">Professional contact cards with modern styling</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ContactCard contact={sampleContact} />
            <ContactCard 
              contact={{
                ...sampleContact,
                id: '2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@company.com',
                company: 'Design Studio',
                title: 'Creative Director',
                status: 'pending',
                rating: 5
              }}
            />
            <ContactCard 
              contact={{
                ...sampleContact,
                id: '3',
                firstName: 'Mike',
                lastName: 'Johnson',
                email: 'mike@startup.io',
                company: 'Startup Inc',
                title: 'Founder',
                status: 'inactive',
                rating: 3
              }}
            />
          </div>
        </section>

        {/* Glass Card Variants */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Glass Card Variants</h2>
            <p className="text-gray-300">Different glass morphism intensities</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard variant="default" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Default Glass</h3>
              <p className="text-gray-700">Standard glass morphism with high opacity</p>
            </GlassCard>
            <GlassCard variant="strong" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Strong Glass</h3>
              <p className="text-gray-200">Enhanced blur with medium opacity</p>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Subtle Glass</h3>
              <p className="text-gray-300">Light blur with low opacity</p>
            </GlassCard>
          </div>
        </section>

        {/* Modern Button Showcase */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Modern Buttons</h2>
            <p className="text-gray-300">Enhanced button variants with glass effects</p>
          </div>
          <div className="space-y-6">
            {/* Button Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <ModernButton variant="primary">
                  <Plus size={16} />
                  Primary
                </ModernButton>
                <ModernButton variant="glass">
                  <Brain size={16} />
                  Glass
                </ModernButton>
                <ModernButton variant="outline">
                  <Settings size={16} />
                  Outline
                </ModernButton>
                <ModernButton variant="ghost">
                  <Mail size={16} />
                  Ghost
                </ModernButton>
                <ModernButton variant="secondary">
                  <Download size={16} />
                  Secondary
                </ModernButton>
              </div>
            </div>

            {/* Button Sizes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Button Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                <ModernButton size="sm" variant="glass">Small</ModernButton>
                <ModernButton size="md" variant="glass">Medium</ModernButton>
                <ModernButton size="lg" variant="glass">Large</ModernButton>
              </div>
            </div>

            {/* Loading States */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Loading States</h3>
              <div className="flex flex-wrap gap-4">
                <ModernButton loading variant="primary">Processing</ModernButton>
                <ModernButton loading variant="glass">Analyzing</ModernButton>
                <ModernButton disabled variant="outline">Disabled</ModernButton>
              </div>
            </div>
          </div>
        </section>

        {/* Avatar Showcase */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Avatar Components</h2>
            <p className="text-gray-300">User avatars with status indicators</p>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Avatar Sizes</h3>
              <div className="flex items-center gap-4">
                <Avatar size="sm" fallback="S" showStatus status="online" />
                <Avatar size="md" fallback="M" showStatus status="away" />
                <Avatar size="lg" fallback="L" showStatus status="busy" />
                <Avatar size="xl" fallback="XL" showStatus status="offline" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Status Indicators</h3>
              <div className="flex items-center gap-4">
                <Avatar fallback="ON" showStatus status="online" />
                <Avatar fallback="AW" showStatus status="away" />
                <Avatar fallback="BS" showStatus status="busy" />
                <Avatar fallback="OF" showStatus status="offline" />
              </div>
            </div>
          </div>
        </section>

        {/* Animation Showcase */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Custom Animations</h2>
            <p className="text-gray-300">Enhanced animations from the design system</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard variant="subtle" className="p-6 animate-float-up">
              <Zap className="h-8 w-8 text-yellow-400 mb-3" />
              <h3 className="text-white font-medium">Float Up</h3>
              <p className="text-gray-300 text-sm">Smooth entry animation</p>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6 animate-scale-up">
              <Star className="h-8 w-8 text-purple-400 mb-3" />
              <h3 className="text-white font-medium">Scale Up</h3>
              <p className="text-gray-300 text-sm">Scaling entrance effect</p>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6 animate-slide-in">
              <Brain className="h-8 w-8 text-blue-400 mb-3" />
              <h3 className="text-white font-medium">Slide In</h3>
              <p className="text-gray-300 text-sm">Horizontal slide animation</p>
            </GlassCard>
            <GlassCard variant="subtle" className="p-6 animate-glow">
              <Phone className="h-8 w-8 text-green-400 mb-3" />
              <h3 className="text-white font-medium">Glow Effect</h3>
              <p className="text-gray-300 text-sm">Pulsing glow animation</p>
            </GlassCard>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-white/10">
          <p className="text-gray-400">
            Enhanced Design System • Distributed Tailwind CSS • Glass Morphism Effects
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignShowcase;