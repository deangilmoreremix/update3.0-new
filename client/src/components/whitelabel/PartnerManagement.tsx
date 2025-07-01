import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Calendar,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Partner, PartnerCustomer, FeaturePackage } from '@shared/schema';

interface PartnerMetrics {
  totalCustomers: number;
  monthlyRevenue: number;
  commissionEarned: number;
  growthRate: number;
  activeSubscriptions: number;
  churnRate: number;
}

interface CustomerAnalytics {
  id: string;
  name: string;
  email: string;
  package: string;
  status: 'active' | 'suspended' | 'cancelled';
  monthlyValue: number;
  joinDate: string;
  lastActive: string;
  usageScore: number;
}

export default function PartnerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch all partners
  const { data: partnersData, isLoading: partnersLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const response = await fetch('/api/partners');
      return response.json();
    },
  });

  // Fetch feature packages
  const { data: featurePackages, isLoading: packagesLoading } = useQuery({
    queryKey: ['feature-packages'],
    queryFn: async () => {
      const response = await fetch('/api/feature-packages');
      return response.json();
    },
  });

  // Fetch customer analytics
  const { data: customers, isLoading: customersLoading } = useQuery<CustomerAnalytics[]>({
    queryKey: ['partner-customers', partnerData?.id],
    queryFn: async () => {
      const response = await fetch(`/api/partners/${partnerData.id}/customers`);
      return response.json();
    },
    enabled: !!partnerData?.id,
  });

  // Fetch available packages
  const { data: packages } = useQuery<FeaturePackage[]>({
    queryKey: ['feature-packages'],
    queryFn: async () => {
      const response = await fetch('/api/feature-packages');
      return response.json();
    },
  });

  // Filter customers based on search and filters
  const filteredCustomers = customers?.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPackage = selectedPackage === 'all' || customer.package === selectedPackage;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    return matchesSearch && matchesPackage && matchesStatus;
  }) || [];

  const handleInviteCustomer = () => {
    // Open customer invitation modal
    console.log('Opening customer invitation modal');
  };

  const handleExportData = () => {
    // Export customer data to CSV
    console.log('Exporting customer data');
  };

  if (partnerLoading || metricsLoading || customersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Partner Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your customers and grow your business
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExportData} variant="outline" className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleInviteCustomer} className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Invite Customer
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{metrics?.growthRate || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics?.monthlyRevenue || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${metrics?.commissionEarned || 0} commission earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeSubscriptions || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.churnRate || 0}% churn rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(partnerData?.commissionRate * 100) || 20}%</div>
            <p className="text-xs text-muted-foreground">
              Of customer revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Manage your customers and their subscriptions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Campaign
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <select
              value={selectedPackage}
              onChange={(e) => setSelectedPackage(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Packages</option>
              {packages?.map(pkg => (
                <option key={pkg.id} value={pkg.name}>{pkg.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Customer Table */}
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Package</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Monthly Value</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Usage Score</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Last Active</th>
                  <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{customer.package}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={customer.status === 'active' ? 'default' : 
                                customer.status === 'suspended' ? 'secondary' : 'destructive'}
                      >
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-4 font-medium">${customer.monthlyValue}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${customer.usageScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{customer.usageScore}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(customer.lastActive).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No customers found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}