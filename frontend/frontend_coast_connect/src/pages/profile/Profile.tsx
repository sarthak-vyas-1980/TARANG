import React, { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import { Layout, PageHeader } from '../../components/common';
import { Card, Input, Select, Button, Alert } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { UsersService } from '../../services';
import { USER_ROLES } from '../../utils/constants';
import { validateName, validateEmail } from '../../utils/validators';
import { formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import type { UpdateUserRequest } from '../../types';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'CITIZEN'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (formData.name) {
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        newErrors.name = nameValidation.errors[0];
      }
    }

    // Email validation
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !user) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData: UpdateUserRequest = {
        name: formData.name || undefined,
        email: formData.email,
        role: formData.role as any
      };

      const response = await UsersService.updateCurrentUser(updateData);
      
      if (response.success && response.data) {
        updateUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'CITIZEN'
    });
    setErrors({});
    setError('');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading profile..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="My Profile"
          description="View and manage your account information"
          action={{
            label: isEditing ? 'Cancel' : 'Edit Profile',
            onClick: isEditing ? handleCancel : () => setIsEditing(true),
            icon: isEditing ? <X size={16} /> : <Edit2 size={16} />
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <User size={32} className="text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.name || 'Anonymous User'}
                  </h2>
                  <p className="text-gray-600 capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
              </div>

              {error && (
                <Alert variant="error" className="mb-6">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-6">
                  {success}
                </Alert>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    disabled={!isEditing}
                    error={errors.name}
                    leftIcon={<User size={20} />}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    disabled={!isEditing}
                    error={errors.email}
                    required
                    leftIcon={<Mail size={20} />}
                  />
                </div>

                <Select
                  label="Role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  options={USER_ROLES}
                  disabled={!isEditing || user.role !== 'OFFICIAL'} // Only officials can change roles
                  helper={user.role !== 'OFFICIAL' ? 'Contact an administrator to change your role' : ''}
                />

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      leftIcon={loading ? <LoadingSpinner size="sm" /> : <Save size={16} />}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Profile Stats & Info */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <h3 className="font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Member since</span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatDate(user.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">Role</span>
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {user.role.toLowerCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-600">User ID</span>
                  </div>
                  <span className="text-sm font-mono text-gray-500">
                    #{user.id}
                  </span>
                </div>
              </div>
            </Card>

            {/* Role Description */}
            <Card>
              <h3 className="font-semibold mb-4">Your Role</h3>
              <div className="space-y-3">
                {user.role === 'CITIZEN' && (
                  <>
                    <p className="text-sm text-gray-600">
                      As a <strong>Citizen</strong>, you can:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Report ocean hazards</li>
                      <li>• View all verified reports</li>
                      <li>• Track your submissions</li>
                      <li>• Contribute to community safety</li>
                    </ul>
                  </>
                )}

                {user.role === 'OFFICIAL' && (
                  <>
                    <p className="text-sm text-gray-600">
                      As an <strong>Official</strong>, you can:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Review and verify reports</li>
                      <li>• Update report statuses</li>
                      <li>• Access all system data</li>
                      <li>• Manage user roles</li>
                      <li>• View analytics dashboard</li>
                    </ul>
                  </>
                )}

                {user.role === 'ANALYST' && (
                  <>
                    <p className="text-sm text-gray-600">
                      As an <strong>Analyst</strong>, you can:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Analyze hazard patterns</li>
                      <li>• Generate detailed reports</li>
                      <li>• Access analytics tools</li>
                      <li>• Export data for research</li>
                      <li>• Provide expert insights</li>
                    </ul>
                  </>
                )}
              </div>
            </Card>

            {/* Security */}
            <Card>
              <h3 className="font-semibold mb-4">Security</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {/* Implement change password */}}
                >
                  Change Password
                </Button>
                
                <div className="text-xs text-gray-500 text-center">
                  Contact support to update security settings
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
