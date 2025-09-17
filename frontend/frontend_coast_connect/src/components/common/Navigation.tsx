import React from 'react';
import { NavLink } from 'react-router-dom';
import type { NavLinkProps, NavLinkRenderProps } from 'react-router-dom';
import { Home, FileText, Plus, BarChart3, MapPin } from 'lucide-react';
import { cn } from '../../utils/helpers'; // Make sure this import exists
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  roles?: string[];
}

const Navigation: React.FC = () => {
  const { user } = useAuth();

  const navItems: NavItem[] = [
    { 
      to: '/dashboard', 
      icon: Home, 
      label: 'Dashboard' 
    },
    { 
      to: '/reports', 
      icon: FileText, 
      label: 'All Reports' 
    },
    { 
      to: '/reports/create', 
      icon: Plus, 
      label: 'Create Report' 
    },
    { 
      to: '/reports/my-reports', 
      icon: FileText, 
      label: 'My Reports' 
    }
  ];

  // Add role-specific items
  if (user?.role === 'OFFICIAL' || user?.role === 'ANALYST') {
    navItems.push(
      { 
        to: '/analytics', 
        icon: BarChart3, 
        label: 'Analytics',
        roles: ['OFFICIAL', 'ANALYST']
      },
      { 
        to: '/locations', 
        icon: MapPin, 
        label: 'Locations',
        roles: ['OFFICIAL', 'ANALYST']
      }
    );
  }

  // Filter items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <nav className="bg-gray-50 border-r border-gray-200 w-64 min-h-screen">
      <div className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }: NavLinkRenderProps) =>
                  cn(
                    'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon size={20} className="mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User Info Section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="px-4 py-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Logged in as
            </p>
            <p className="text-sm text-gray-900 truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
