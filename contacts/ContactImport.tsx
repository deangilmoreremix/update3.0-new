import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as ExcelJS from 'exceljs';
import { useContactStore } from '../../store/contactStore';
import { Contact } from '../../types';
import { Upload, CheckCircle, AlertCircle, RefreshCw, FileText } from 'lucide-react';

const ContactImport: React.FC = () => {
  const [importedData, setImportedData] = useState<Partial<Contact>[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { importContacts } = useContactStore();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);
    setError(null);
    
    const file = acceptedFiles[0];
    if (!file) return;
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Failed to read file');
        
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(data as ArrayBuffer);
        
        const worksheet = workbook.worksheets[0];
        if (!worksheet) throw new Error('No worksheet found in file');
        
        const jsonData: any[] = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber === 1) return; // Skip header row
          
          const rowData: any = {};
          row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const headerCell = worksheet.getCell(1, colNumber);
            const header = headerCell.value?.toString() || `Column${colNumber}`;
            rowData[header] = cell.value;
          });
          jsonData.push(rowData);
        });
        
        // Map to Contact structure
        const contacts = jsonData.map((row: any) => ({
          name: row.Name || row.name || row['Full Name'] || '',
          email: row.Email || row.email || row['Email Address'] || '',
          phone: row.Phone || row.phone || row['Phone Number'] || '',
          company: row.Company || row.company || row.Organization || '',
          position: row.Position || row.Title || row.position || row.title || '',
          status: row.Status || row.status || 'lead',
          industry: row.Industry || row.industry || '',
          location: row.Location || row.location || row.Address || '',
          notes: row.Notes || row.notes || row.Comments || '',
          // Ensure user_id is set by the server using RLS
        }));
        
        setImportedData(contacts);
        setSuccess(`${contacts.length} contacts ready for import`);
      } catch (err) {
        console.error('Error parsing file:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse file');
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setIsUploading(false);
    };
    
    reader.readAsArrayBuffer(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  });
  
  const handleImport = async () => {
    if (importedData.length === 0) return;
    
    setIsImporting(true);
    setError(null);
    
    try {
      await importContacts(importedData);
      setSuccess(`Successfully imported ${importedData.length} contacts`);
      setImportedData([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import contacts');
    } finally {
      setIsImporting(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-center mb-4">
          <CheckCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}
      
      {importedData.length === 0 ? (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="text-center">
              <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-gray-600">Processing file...</p>
            </div>
          ) : isDragActive ? (
            <div className="text-center">
              <Upload className="h-10 w-10 text-blue-500 mx-auto mb-2" />
              <p className="text-blue-600 font-medium">Drop the file here</p>
            </div>
          ) : (
            <div className="text-center">
              <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">Drag and drop a file here, or click to select</p>
              <p className="text-sm text-gray-500">Supports Excel (.xlsx, .xls) and CSV files</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="mt-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Preview ({importedData.length} contacts)</h3>
            <div className="max-h-64 overflow-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importedData.slice(0, 5).map((contact, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {contact.name || 'N/A'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {contact.email || 'N/A'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {contact.company || 'N/A'}
                      </td>
                    </tr>
                  ))}
                  {importedData.length > 5 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-center text-sm text-gray-500">
                        ... and {importedData.length - 5} more contacts
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={() => {
                setImportedData([]);
                setSuccess(null);
              }}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleImport}
              disabled={isImporting}
              className={`px-4 py-2 text-white rounded-md ${
                isImporting 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isImporting ? (
                <>
                  <RefreshCw className="inline-block h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                `Import ${importedData.length} Contacts`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactImport;