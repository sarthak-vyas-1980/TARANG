import React, { useState, FormEvent } from 'react';
import { Input, Select, Button, Card } from '../ui';
import { HAZARD_TYPES, SEVERITY_LEVELS } from '../../utils/constants';
import { validateRequired, validateDescription, validateLocationName, validateLatitude, validateLongitude } from '../../utils/validators';
import LoadingSpinner from '../common/LoadingSpinner';
import type { CreateReportData, HazardType, Severity } from '../../types';

interface ReportFormProps {
  onSubmit: (data: CreateReportData) => Promise<void>;
  loading?: boolean;
  initialData?: Partial<CreateReportData>;
}

const ReportForm: React.FC<ReportFormProps> = ({
  onSubmit,
  loading = false,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<CreateReportData>({
    type: initialData.type || 'TSUNAMI',
    description: initialData.description || '',
    severity: initialData.severity || 'LOW',
    locationName: initialData.locationName || '',
    lat: initialData.lat || 0,
    lng: initialData.lng || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof CreateReportData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: keyof CreateReportData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof CreateReportData) => {
    const value = formData[field];
    let error = '';

    switch (field) {
      case 'type':
        if (!value) error = 'Hazard type is required';
        break;
      case 'description':
        const descValidation = validateDescription(value as string);
        if (!descValidation.isValid) error = descValidation.errors[0];
        break;
      case 'severity':
        if (!value) error = 'Severity level is required';
        break;
      case 'locationName':
        const locValidation = validateLocationName(value as string);
        if (!locValidation.isValid) error = locValidation.errors[0];
        break;
      case 'lat':
        const latValidation = validateLatitude(value as number);
        if (!latValidation.isValid) error = latValidation.errors[0];
        break;
      case 'lng':
        const lngValidation = validateLongitude(value as number);
        if (!lngValidation.isValid) error = lngValidation.errors[0];
        break;
    }

    if (error) {
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = (): boolean => {
    const fields: (keyof CreateReportData)[] = ['type', 'description', 'severity', 'locationName', 'lat', 'lng'];
    
    fields.forEach(field => validateField(field));
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
    setTouched(allTouched);

    // Check if there are any errors
    return Object.values(errors).every(error => !error);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const isFormValid = Object.values(errors).every(error => !error) &&
    formData.type && formData.description && formData.severity && 
    formData.locationName && formData.lat !== 0 && formData.lng !== 0;

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hazard Type */}
          <Select
            label="Hazard Type"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value as HazardType)}
            onBlur={() => handleBlur('type')}
            options={HAZARD_TYPES}
            error={touched.type ? errors.type : undefined}
            required
          />

          {/* Severity */}
          <Select
            label="Severity Level"
            value={formData.severity}
            onChange={(e) => handleInputChange('severity', e.target.value as Severity)}
            onBlur={() => handleBlur('severity')}
            options={SEVERITY_LEVELS}
            error={touched.severity ? errors.severity : undefined}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Describe the hazard situation in detail..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
          {touched.description && errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Minimum 10 characters, maximum 1000 characters
          </p>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Location Information</h3>
          
          <div className="space-y-4">
            <Input
              label="Location Name"
              type="text"
              value={formData.locationName}
              onChange={(e) => handleInputChange('locationName', e.target.value)}
              onBlur={() => handleBlur('locationName')}
              placeholder="e.g., Mumbai Beach, Marina Bay"
              error={touched.locationName ? errors.locationName : undefined}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => handleInputChange('lat', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('lat')}
                placeholder="e.g., 19.0760"
                error={touched.lat ? errors.lat : undefined}
                helper="Latitude between -90 and 90 degrees"
                required
              />

              <Input
                label="Longitude"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => handleInputChange('lng', parseFloat(e.target.value) || 0)}
                onBlur={() => handleBlur('lng')}
                placeholder="e.g., 72.8777"
                error={touched.lng ? errors.lng : undefined}
                helper="Longitude between -180 and 180 degrees"
                required
              />
            </div>

            <div className="text-sm text-gray-500">
              <p>💡 <strong>Tip:</strong> You can get coordinates from Google Maps by right-clicking on a location.</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReportForm;
