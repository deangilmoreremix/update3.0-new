import { Request, Response, NextFunction } from 'express';
import { whiteLabelClient } from '../integrations/whiteLabelClient';

export interface TenantRequest extends Request {
  tenantId?: string;
  tenant?: any;
  tenantFeatures?: any;
}

/**
 * Middleware to extract tenant information from request
 * Supports multiple methods:
 * 1. Subdomain (tenant.crm-platform.com)
 * 2. Custom domain (client.com)
 * 3. Header (X-Tenant-ID)
 * 4. Query parameter (?tenant=abc)
 */
export const extractTenant = async (req: TenantRequest, res: Response, next: NextFunction) => {
  try {
    let tenantId: string | null = null;

    // Method 1: Extract from subdomain
    const host = req.get('host') || '';
    const subdomain = host.split('.')[0];
    
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      tenantId = subdomain;
    }

    // Method 2: Check for custom domain
    if (!tenantId) {
      // This would require a lookup table of custom domains to tenant IDs
      // For now, we'll implement a simple check
      const customDomainTenant = await findTenantByDomain(host);
      if (customDomainTenant) {
        tenantId = customDomainTenant;
      }
    }

    // Method 3: Check headers
    if (!tenantId) {
      tenantId = req.get('X-Tenant-ID') || null;
    }

    // Method 4: Check query parameters
    if (!tenantId) {
      tenantId = req.query.tenant as string || null;
    }

    // Method 5: Extract from JWT token (if using tenant-specific tokens)
    if (!tenantId && req.user) {
      tenantId = (req.user as any).tenantId || null;
    }

    if (tenantId) {
      req.tenantId = tenantId;
      
      // Optionally fetch tenant details
      try {
        const tenant = await whiteLabelClient.getTenant(tenantId);
        req.tenant = tenant;
        req.tenantFeatures = tenant.features;
      } catch (error) {
        console.warn(`Failed to fetch tenant details for ${tenantId}:`, error);
      }
    }

    next();
  } catch (error) {
    console.error('Tenant extraction error:', error);
    next(); // Continue without tenant info
  }
};

/**
 * Middleware to require tenant identification
 */
export const requireTenant = (req: TenantRequest, res: Response, next: NextFunction) => {
  if (!req.tenantId) {
    return res.status(400).json({
      error: 'Tenant identification required',
      message: 'Please provide tenant information via subdomain, header, or query parameter'
    });
  }
  next();
};

/**
 * Middleware to check if tenant has access to specific features
 */
export const requireFeature = (featureName: string) => {
  return (req: TenantRequest, res: Response, next: NextFunction) => {
    if (!req.tenantFeatures) {
      return res.status(403).json({
        error: 'Feature access denied',
        message: 'Tenant features not available'
      });
    }

    const hasFeature = req.tenantFeatures[featureName];
    if (!hasFeature) {
      return res.status(403).json({
        error: 'Feature access denied',
        message: `Feature '${featureName}' is not available for this tenant`
      });
    }

    next();
  };
};

/**
 * Helper function to find tenant by custom domain
 * This would typically query a database or cache
 */
async function findTenantByDomain(domain: string): Promise<string | null> {
  // In a real implementation, this would check a database
  // For now, return null
  return null;
}

/**
 * Middleware to add tenant context to database queries
 */
export const addTenantContext = (req: TenantRequest, res: Response, next: NextFunction) => {
  if (req.tenantId) {
    // Add tenant filter to all database operations
    req.query.tenantId = req.tenantId;
  }
  next();
};