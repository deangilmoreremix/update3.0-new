import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle, RefreshCw, Lock, ExternalLink } from 'lucide-react';

interface SSLCertificate {
  id: string;
  domain: string;
  status: 'active' | 'pending' | 'expired' | 'failed';
  issuer: string;
  validFrom: string;
  validUntil: string;
  autoRenewal: boolean;
  lastChecked: string;
  daysUntilExpiry: number;
}

interface AutoSSLProps {
  tenantId: string;
  domains: Array<{ id: string; domain: string; isActive: boolean }>;
  onSSLUpdate?: (domainId: string, sslStatus: string) => void;
}

export default function AutoSSL({ tenantId, domains, onSSLUpdate }: AutoSSLProps) {
  const [certificates, setCertificates] = useState<SSLCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingDomain, setProcessingDomain] = useState<string | null>(null);

  useEffect(() => {
    fetchSSLCertificates();
  }, [tenantId, domains]);

  const fetchSSLCertificates = async () => {
    try {
      setLoading(true);
      
      // Generate mock SSL certificates for demo
      const mockCertificates: SSLCertificate[] = domains.map(domain => ({
        id: `ssl-${domain.id}`,
        domain: domain.domain,
        status: domain.isActive ? 'active' : 'pending',
        issuer: "Let's Encrypt",
        validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenewal: true,
        lastChecked: new Date().toISOString(),
        daysUntilExpiry: 60
      }));

      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error fetching SSL certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestSSLCertificate = async (domainId: string, domainName: string) => {
    try {
      setProcessingDomain(domainId);
      
      // Simulate SSL certificate request
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Update certificate status
      setCertificates(prev => prev.map(cert => 
        cert.domain === domainName 
          ? { ...cert, status: 'active' as const, lastChecked: new Date().toISOString() }
          : cert
      ));

      if (onSSLUpdate) {
        onSSLUpdate(domainId, 'active');
      }

      alert(`SSL certificate successfully issued for ${domainName}!`);
    } catch (error) {
      console.error('Error requesting SSL certificate:', error);
      alert(`Failed to request SSL certificate for ${domainName}`);
    } finally {
      setProcessingDomain(null);
    }
  };

  const renewSSLCertificate = async (domainId: string, domainName: string) => {
    try {
      setProcessingDomain(domainId);
      
      // Simulate SSL certificate renewal
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update certificate with new expiry
      setCertificates(prev => prev.map(cert => 
        cert.domain === domainName 
          ? { 
              ...cert, 
              validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              daysUntilExpiry: 90,
              lastChecked: new Date().toISOString()
            }
          : cert
      ));

      alert(`SSL certificate successfully renewed for ${domainName}!`);
    } catch (error) {
      console.error('Error renewing SSL certificate:', error);
      alert(`Failed to renew SSL certificate for ${domainName}`);
    } finally {
      setProcessingDomain(null);
    }
  };

  const toggleAutoRenewal = async (domainName: string) => {
    setCertificates(prev => prev.map(cert => 
      cert.domain === domainName 
        ? { ...cert, autoRenewal: !cert.autoRenewal }
        : cert
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'expired':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">SSL Certificate Management</h2>
        </div>
        <button
          onClick={fetchSSLCertificates}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* SSL Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-2">
            {certificates.filter(cert => cert.status === 'active').length}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-yellow-700 dark:text-yellow-300">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
            {certificates.filter(cert => cert.status === 'pending').length}
          </p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300">Expired</span>
          </div>
          <p className="text-2xl font-bold text-red-900 dark:text-red-100 mt-2">
            {certificates.filter(cert => cert.status === 'expired').length}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300">Auto-Renewal</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
            {certificates.filter(cert => cert.autoRenewal).length}
          </p>
        </div>
      </div>

      {/* Certificate List */}
      <div className="space-y-4">
        {certificates.map(cert => (
          <div key={cert.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(cert.status)}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 dark:text-white font-medium">{cert.domain}</span>
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(cert.status)}`}>
                      {cert.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>Issuer: {cert.issuer}</span>
                    <span>Expires: {new Date(cert.validUntil).toLocaleDateString()}</span>
                    <span>Days left: {cert.daysUntilExpiry}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {cert.status === 'pending' && (
                  <button
                    onClick={() => requestSSLCertificate(cert.id, cert.domain)}
                    disabled={processingDomain === cert.id}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 text-green-400 rounded border border-green-500/30 hover:bg-green-500/30 transition-colors text-sm"
                  >
                    {processingDomain === cert.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Request SSL</span>
                      </>
                    )}
                  </button>
                )}

                {cert.status === 'active' && cert.daysUntilExpiry < 30 && (
                  <button
                    onClick={() => renewSSLCertificate(cert.id, cert.domain)}
                    disabled={processingDomain === cert.id}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    {processingDomain === cert.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Renewing...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Renew</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => toggleAutoRenewal(cert.domain)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded border transition-colors text-sm ${
                    cert.autoRenewal 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{cert.autoRenewal ? 'Auto-Renewal ON' : 'Auto-Renewal OFF'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Let's Encrypt Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-2 mb-2">
          <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-700 dark:text-blue-300 font-medium">Let's Encrypt Integration</span>
        </div>
        <p className="text-blue-700 dark:text-blue-300 text-sm mb-2">
          Free SSL certificates are automatically issued and renewed using Let's Encrypt. 
          Certificates are valid for 90 days and auto-renewal is enabled by default.
        </p>
        <div className="flex items-center space-x-2">
          <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <a 
            href="https://letsencrypt.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
          >
            Learn more about Let's Encrypt
          </a>
        </div>
      </div>
    </div>
  );
}