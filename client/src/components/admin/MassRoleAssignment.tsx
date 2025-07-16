import React, { useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Zap, Shield, Crown, User, Eye, EyeOff, Download, Upload, RefreshCw, Target } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface RoleAssignmentData {
  email: string;
  currentRole: string;
  newRole: 'user' | 'admin' | 'super_admin';
  subscriptionPlan: 'free' | 'basic' | 'professional' | 'enterprise';
  permissions: string[];
  status: 'pending' | 'success' | 'error' | 'warning';
  errorMessage?: string;
  aiSuggestion?: string;
  confidenceScore?: number;
}

interface ValidationError {
  row: number;
  column: string;
  error: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

interface MassRoleAssignmentProps {
  users: unknown[];
  onRolesAssigned?: (assignments: RoleAssignmentData[]) => void;
}

export const MassRoleAssignment: React.FC<MassRoleAssignmentProps> = ({ 
  users, 
  onRolesAssigned 
}) => {
  const [assignments, setAssignments] = useState<RoleAssignmentData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiValidationEnabled, setAiValidationEnabled] = useState(true);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [bulkRole, setBulkRole] = useState<'user' | 'admin' | 'super_admin'>('user');
  const [bulkPlan, setBulkPlan] = useState<'free' | 'basic' | 'professional' | 'enterprise'>('free');

  const roleHierarchy = {
    'user': 1,
    'admin': 2,
    'super_admin': 3
  };

  const permissionsByRole = {
    'user': ['view_contacts', 'edit_own_contacts', 'view_deals', 'edit_own_deals'],
    'admin': ['view_contacts', 'edit_contacts', 'view_deals', 'edit_deals', 'view_users', 'manage_team'],
    'super_admin': ['all_permissions', 'manage_platform', 'manage_users', 'view_analytics', 'system_config']
  };

  const validateCSVData = async (csvData: string): Promise<RoleAssignmentData[]> => {
    const lines = csvData.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const assignments: RoleAssignmentData[] = [];
    const errors: ValidationError[] = [];

    for (const i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const rowData: unknown = {};
      
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });

      // AI-powered validation
      const validation = await aiValidateRow(rowData, i + 1);
      
      const assignment: RoleAssignmentData = {
        email: rowData.email || '',
        currentRole: findCurrentRole(rowData.email),
        newRole: rowData.newrole || rowData.role || 'user',
        subscriptionPlan: rowData.subscriptionplan || rowData.plan || 'free',
        permissions: permissionsByRole[rowData.newrole] || permissionsByRole['user'],
        status: validation.isValid ? 'pending' : 'error',
        errorMessage: validation.error,
        aiSuggestion: validation.suggestion,
        confidenceScore: validation.confidence
      };

      assignments.push(assignment);
      
      if (!validation.isValid) {
        errors.push({
          row: i + 1,
          column: validation.errorColumn || 'general',
          error: validation.error || 'Validation failed',
          severity: validation.severity || 'error',
          suggestion: validation.suggestion
        });
      }
    }

    setValidationErrors(errors);
    return assignments;
  };

  const aiValidateRow = async (rowData: any, rowNumber: number) => {
    if (!aiValidationEnabled) {
      return { isValid: true, confidence: 1 };
    }

    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!rowData.email || !emailRegex.test(rowData.email)) {
        return {
          isValid: false,
          error: 'Invalid email format',
          errorColumn: 'email',
          severity: 'error',
          suggestion: 'Please provide a valid email address',
          confidence: 0.95
        };
      }

      // Role validation with AI suggestions
      const validRoles = ['user', 'admin', 'super_admin'];
      if (!validRoles.includes(rowData.newrole)) {
        const suggestion = findClosestRole(rowData.newrole);
        return {
          isValid: false,
          error: `Invalid role: ${rowData.newrole}`,
          errorColumn: 'newrole',
          severity: 'error',
          suggestion: `Did you mean "${suggestion}"?`,
          confidence: 0.8
        };
      }

      // Permission escalation warning
      const currentRole = findCurrentRole(rowData.email);
      if (roleHierarchy[rowData.newrole] > roleHierarchy[currentRole]) {
        return {
          isValid: true,
          error: 'Role escalation detected',
          severity: 'warning',
          suggestion: `Promoting ${rowData.email} from ${currentRole} to ${rowData.newrole}`,
          confidence: 0.9
        };
      }

      // AI-powered business logic validation
      const businessValidation = await validateBusinessLogic(rowData);
      
      return {
        isValid: businessValidation.isValid,
        error: businessValidation.error,
        suggestion: businessValidation.suggestion,
        confidence: businessValidation.confidence || 0.85
      };

    } catch (error) {
      return {
        isValid: false,
        error: 'AI validation failed',
        suggestion: 'Please review manually',
        confidence: 0.5
      };
    }
  };

  const validateBusinessLogic = async (rowData: unknown) => {
    // Simulate AI business logic validation
    const suspiciousPatterns = [
      { pattern: /admin.*temp|temp.*admin/i, message: 'Temporary admin roles detected' },
      { pattern: /test.*@|@.*test/i, message: 'Test email detected in production data' },
      { pattern: /super.*admin.*bulk/i, message: 'Bulk super admin assignment flagged' }
    ];

    for (const { pattern, message } of suspiciousPatterns) {
      if (pattern.test(`${rowData.email} ${rowData.newrole}`)) {
        return {
          isValid: true,
          error: message,
          severity: 'warning',
          suggestion: 'Review this assignment carefully',
          confidence: 0.75
        };
      }
    }

    return { isValid: true, confidence: 0.95 };
  };

  const findCurrentRole = (email: string): string => {
    const user = users.find(u => u.email === email);
    return user?.role || 'user';
  };

  const findClosestRole = (invalidRole: string): string => {
    const roles = ['user', 'admin', 'super_admin'];
    const normalized = invalidRole.toLowerCase();
    
    if (normalized.includes('admin') && normalized.includes('super')) return 'super_admin';
    if (normalized.includes('admin')) return 'admin';
    return 'user';
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csvText = e.target?.result as string;
        const validatedAssignments = await validateCSVData(csvText);
        setAssignments(validatedAssignments);
      } catch (error) {
        console.error('CSV processing error:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  }, [aiValidationEnabled, users]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const applyBulkAssignment = () => {
    const selectedUsers = users.filter(user => 
      assignments.some(a => a.email === user.email)
    );

    const bulkAssignments = selectedUsers.map(user => ({
      email: user.email,
      currentRole: user.role,
      newRole: bulkRole,
      subscriptionPlan: bulkPlan,
      permissions: permissionsByRole[bulkRole],
      status: 'pending' as const,
      aiSuggestion: `Bulk assignment: ${user.role} → ${bulkRole}`,
      confidenceScore: 0.9
    }));

    setAssignments(prev => [...prev, ...bulkAssignments]);
  };

  const executeAssignments = async () => {
    setIsProcessing(true);
    
    const results: RoleAssignmentData[] = [];
    
    for (const assignment of assignments) {
      try {
        const response = await fetch('/api/admin/users/mass-role-assignment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assignment)
        });

        if (response.ok) {
          results.push({ ...assignment, status: 'success' });
        } else {
          const error = await response.text();
          results.push({ 
            ...assignment, 
            status: 'error', 
            errorMessage: error 
          });
        }
      } catch (error) {
        results.push({ 
          ...assignment, 
          status: 'error', 
          errorMessage: 'Network error' 
        });
      }
    }

    setAssignments(results);
    setIsProcessing(false);
    onRolesAssigned?.(results);
  };

  const downloadTemplate = () => {
    const csvContent = 'email,newRole,subscriptionPlan,notes\n' +
                      'john@company.com,admin,professional,Promotion to team lead\n' +
                      'jane@company.com,user,basic,Standard user access';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'role_assignment_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string, confidence?: number) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'error':
        return <XCircle className="text-red-600" size={16} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={16} />;
      default:
        return confidence && confidence > 0.8 ? 
          <CheckCircle className="text-blue-600" size={16} /> :
          <AlertTriangle className="text-yellow-600" size={16} />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="text-purple-600" size={16} />;
      case 'admin':
        return <Shield className="text-blue-600" size={16} />;
      default:
        return <User className="text-gray-600" size={16} />;
    }
  };

  const successCount = assignments.filter(a => a.status === 'success').length;
  const errorCount = assignments.filter(a => a.status === 'error').length;
  const warningCount = assignments.filter(a => a.status === 'warning').length;
  const pendingCount = assignments.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="mr-2" size={20} />
            Mass Role Assignment
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Bulk assign roles and permissions with AI-powered validation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAiValidationEnabled(!aiValidationEnabled)}
            className={`flex items-center px-3 py-2 rounded-lg text-sm ${
              aiValidationEnabled 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Zap className="mr-1" size={14} />
            AI Validation
          </button>
          <button
            onClick={downloadTemplate}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <Download className="mr-1" size={14} />
            Template
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg text-gray-600 mb-2">
            {isDragActive ? 'Drop CSV file here' : 'Upload role assignment CSV'}
          </p>
          <p className="text-sm text-gray-500">
            AI will validate emails, roles, and business logic
          </p>
        </div>
      </div>

      {/* Bulk Assignment Tools */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Quick Assignment Tools</h3>
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAdvancedOptions ? <EyeOff size={14} /> : <Eye size={14} />}
            {showAdvancedOptions ? ' Hide' : ' Show'} Advanced
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={bulkRole}
            onChange={(e) => setBulkRole(e.target.value as unknown)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="user">User Role</option>
            <option value="admin">Admin Role</option>
            <option value="super_admin">Super Admin</option>
          </select>
          
          <select
            value={bulkPlan}
            onChange={(e) => setBulkPlan(e.target.value as unknown)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="free">Free Plan</option>
            <option value="basic">Basic Plan</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>

          <button
            onClick={applyBulkAssignment}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Apply to Selected
          </button>

          <button
            onClick={() => setAssignments([])}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-800 mb-2">Validation Issues ({validationErrors.length})</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {validationErrors.map((error, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <AlertTriangle className="text-red-600 mt-0.5" size={14} />
                <div>
                  <span className="font-medium">Row {error.row}:</span> {error.error}
                  {error.suggestion && (
                    <div className="text-red-600 italic">{error.suggestion}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-green-700">Successful</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-red-700">Errors</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-yellow-700">Warnings</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
            <div className="text-sm text-blue-700">Pending</div>
          </div>
        </div>
      )}

      {/* Assignments Table */}
      {assignments.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">
              Role Assignments ({assignments.length})
            </h3>
            {pendingCount > 0 && (
              <button
                onClick={executeAssignments}
                disabled={isProcessing}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="animate-spin mr-2" size={16} />
                ) : (
                  <Zap className="mr-2" size={16} />
                )}
                Execute All
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AI Confidence</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Suggestion</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(assignment.status, assignment.confidenceScore)}
                        {assignment.errorMessage && (
                          <span className="ml-2 text-xs text-red-600">{assignment.errorMessage}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {assignment.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(assignment.currentRole)}
                        <span className="text-sm text-gray-500">{assignment.currentRole}</span>
                        <span className="text-gray-400">→</span>
                        {getRoleIcon(assignment.newRole)}
                        <span className="text-sm font-medium">{assignment.newRole}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        assignment.subscriptionPlan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                        assignment.subscriptionPlan === 'professional' ? 'bg-blue-100 text-blue-800' :
                        assignment.subscriptionPlan === 'basic' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {assignment.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {assignment.confidenceScore && (
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                assignment.confidenceScore > 0.8 ? 'bg-green-600' :
                                assignment.confidenceScore > 0.6 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${assignment.confidenceScore * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">
                            {Math.round(assignment.confidenceScore * 100)}%
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {assignment.aiSuggestion && (
                        <div className="max-w-48 truncate" title={assignment.aiSuggestion}>
                          {assignment.aiSuggestion}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};