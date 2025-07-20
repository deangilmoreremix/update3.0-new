import React from 'react'
import { Users, Phone, Mail, MapPin } from 'lucide-react'

export default function Contacts() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contacts</h1>
        <p className="text-gray-600">Manage your customer relationships</p>
      </div>

      {/* Contact Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">1,248</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Phone className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Contacts</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Email Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Management */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Management</h2>
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a simplified Contacts page. In the full implementation, this would include:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Contact directory with search and filtering</li>
            <li>Individual contact profiles and history</li>
            <li>Communication tracking (calls, emails, meetings)</li>
            <li>Contact segmentation and tagging</li>
            <li>Import/export functionality</li>
            <li>Integration with email and phone systems</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
