import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input, Select, Button } from '../ui';
import { HAZARD_TYPES, SEVERITY_LEVELS, REPORT_STATUS } from '../../utils/constants';
import { useDebounce } from '../../hooks';
import type { ReportFilters as Filters } from '../../types';

interface ReportFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  loading = false
}) => {
  const [searchInput, setSearchInput] = React.useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update search filter when debounced value changes
  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ search: debouncedSearch });
    }
  }, [debouncedSearch, filters.search, onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600"
          >
            <X size={16} className="mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Hazard Type Filter */}
        <Select
          value={filters.type || ''}
          onChange={(e) => onFiltersChange({ type: e.target.value || undefined })}
          options={HAZARD_TYPES}
          placeholder="All Types"
        />

        {/* Severity Filter */}
        <Select
          value={filters.severity || ''}
          onChange={(e) => onFiltersChange({ severity: e.target.value || undefined })}
          options={SEVERITY_LEVELS}
          placeholder="All Severities"
        />

        {/* Status Filter */}
        <Select
          value={filters.status || ''}
          onChange={(e) => onFiltersChange({ status: e.target.value || undefined })}
          options={REPORT_STATUS}
          placeholder="All Statuses"
        />
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Input
          type="date"
          label="From Date"
          value={filters.dateFrom || ''}
          onChange={(e) => onFiltersChange({ dateFrom: e.target.value || undefined })}
        />
        
        <Input
          type="date"
          label="To Date"
          value={filters.dateTo || ''}
          onChange={(e) => onFiltersChange({ dateTo: e.target.value || undefined })}
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Active filters:</span>
            
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Search: "{filters.search}"
                <button
                  onClick={() => {
                    setSearchInput('');
                    onFiltersChange({ search: undefined });
                  }}
                  className="ml-1 text-primary-600 hover:text-primary-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            
            {filters.type && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Type: {HAZARD_TYPES.find(t => t.value === filters.type)?.label}
                <button
                  onClick={() => onFiltersChange({ type: undefined })}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            
            {filters.severity && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Severity: {SEVERITY_LEVELS.find(s => s.value === filters.severity)?.label}
                <button
                  onClick={() => onFiltersChange({ severity: undefined })}
                  className="ml-1 text-yellow-600 hover:text-yellow-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Status: {REPORT_STATUS.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => onFiltersChange({ status: undefined })}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;
