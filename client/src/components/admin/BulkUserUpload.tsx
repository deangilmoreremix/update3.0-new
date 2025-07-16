import React, { useState, useCallback } from 'react';
import { Upload, Download, Users, CheckCircle, XCircle, AlertTriangle, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UserUploadData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin';
  subscriptionPlan: 'free' | 'basic' | 'professional' | 'enterprise';
  organizationName?: string;
  phoneNumber?: string;
  status: 'pending' | 'success' | 'error';
  errorMessage?: string;
}

interface BulkUserUploadProps {
  onUsersUploaded?: (users: UserUploadData[]) => void;
}

export const BulkUserUpload: React.FC<BulkUserUploadProps> = ({ onUsersUploaded }) => {
  const [uploadedUsers, setUploadedUsers] = useState<UserUploadData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const parseCSV = (csvText: string): UserUploadData[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['firstname', 'lastname', 'email'];
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const users: UserUploadData[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const userData: unknown = {};
      headers.forEach((header, index) => {
        userData[header] = values[index];
      });

      // Validate required fields
      if (!userData.firstname || !userData.lastname || !userData.email) {
        errors.push(`Row ${i + 1}: Missing required fields`);
        continue;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.push(`Row ${i + 1}: Invalid email format`);
        continue;
      }

      users.push({
        firstName: userData.firstname,
        lastName: userData.lastname,
        email: userData.email,
        role: userData.role || 'user',
        subscriptionPlan: userData.subscriptionplan || 'free',
        organizationName: userData.organizationname,
        phoneNumber: userData.phonenumber,
        status: 'pending'
      });
    }

    if (errors.length > 0) {
      setErrors(errors);
    }

    return users;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setErrors(['Please upload a CSV file']);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const users = parseCSV(csvText);
        setUploadedUsers(users);
        setErrors([]);
      } catch (error) {
        setErrors([error instanceof Error ? error.message : 'Failed to parse CSV']);
      }
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const updateUserRole = (index: number, role: 'user' | 'admin' | 'super_admin') => {
    setUploadedUsers(prev => 
      prev.map((user, i) => 
        i === index ? { ...user, role } : user
      )
    );
  };

  const updateUserPlan = (index: number, plan: 'free' | 'basic' | 'professional' | 'enterprise') => {
    setUploadedUsers(prev => 
      prev.map((user, i) => 
        i === index ? { ...user, subscriptionPlan: plan } : user
      )
    );
  };

  const createUsers = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    const results: UserUploadData[] = [];
    
    for (let i = 0; i < uploadedUsers.length; i++) {
      const user = uploadedUsers[i];
      try {
        const response = await fetch('/api/admin/users/bulk-create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });

        if (response.ok) {
          results.push({ ...user, status: 'success' });
        } else {
          const error = await response.text();
          results.push({ ...user, status: 'error', errorMessage: error });
        }
      } catch (error) {
        results.push({ 
          ...user, 
          status: 'error', 
          errorMessage: 'Network error' 
        });
      }

      setUploadProgress(((i + 1) / uploadedUsers.length) * 100);
    }

    setUploadedUsers(results);
    setIsUploading(false);
    onUsersUploaded?.(results);
  };

  const downloadTemplate = () => {
    const csvContent = 'firstName,lastName,email,role,subscriptionPlan,organizationName,phoneNumber\n' +
                      'John,Doe,john@company.com,user,professional,Acme Corp,+1234567890\n' +
                      'Jane,Smith,jane@company.com,admin,enterprise,Tech Solutions,+1987654321';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'error':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <AlertTriangle className="text-yellow-600" size={16} />;
    }
  };

  const successCount = uploadedUsers.filter(u => u.status === 'success').length;
  const errorCount = uploadedUsers.filter(u => u.status === 'error').length;
  const pendingCount = uploadedUsers.filter(u => u.status === 'pending').length;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Users className="mr-2" size={20} />
          Bulk User Upload
        </h2>
        <button
          onClick={downloadTemplate}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="mr-2" size={16} />
          Download Template
        </button>
      </div>

      {/* Upload Area */}
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
          {isDragActive ? 'Drop the CSV file here' : 'Drag & drop a CSV file here'}
        </p>
        <p className="text-sm text-gray-500">
          or click to select a file
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">Upload Errors:</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Creating Users...</span>
            <span className="text-sm text-blue-600">{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Results Summary */}
      {uploadedUsers.length > 0 && !isUploading && (
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-green-700">Successful</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-red-700">Failed</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
        </div>
      )}

      {/* User List */}
      {uploadedUsers.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Users to Create ({uploadedUsers.length})
            </h3>
            {pendingCount > 0 && (
              <button
                onClick={createUsers}
                disabled={isUploading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create All Users
              </button>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(user.status)}
                          {user.errorMessage && (
                            <span className="ml-2 text-xs text-red-600">{user.errorMessage}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(index, e.target.value as unknown)}
                          disabled={user.status !== 'pending'}
                          className="text-sm border border-gray-300 rounded px-2 py-1 disabled:bg-gray-100"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.subscriptionPlan}
                          onChange={(e) => updateUserPlan(index, e.target.value as unknown)}
                          disabled={user.status !== 'pending'}
                          className="text-sm border border-gray-300 rounded px-2 py-1 disabled:bg-gray-100"
                        >
                          <option value="free">Free</option>
                          <option value="basic">Basic</option>
                          <option value="professional">Professional</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.organizationName || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CSV Format Guide */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <FileText className="mr-2" size={16} />
          CSV Format Requirements
        </h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Required columns:</strong> firstName, lastName, email</p>
          <p><strong>Optional columns:</strong> role, subscriptionPlan, organizationName, phoneNumber</p>
          <p><strong>Valid roles:</strong> user, admin, super_admin</p>
          <p><strong>Valid plans:</strong> free, basic, professional, enterprise</p>
          <p><strong>Note:</strong> You can modify roles and plans after upload using the dropdowns above.</p>
        </div>
      </div>
    </div>
  );
};