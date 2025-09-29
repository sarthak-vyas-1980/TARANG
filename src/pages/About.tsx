// src/pages/About.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, MapPin, Shield, Users, TrendingUp } from 'lucide-react';
import { GlassButton } from '../components/ui';
import oceanBg from '../assets/ocean.webp';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section with ocean background and glass overlay */}
      <div
        className="relative rounded-lg overflow-hidden mb-8"
        style={{ minHeight: '320px' }}
      >
        <img
          src={oceanBg}
          alt="Ocean background"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          style={{ filter: 'brightness(0.7)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-600/60 to-transparent z-10" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="flex justify-center mb-4">
            <Waves className="w-16 h-16 text-blue-200 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">TARANG</h1>
          <p className="text-xl text-blue-100 mb-6 drop-shadow">
            Empowering Coastal Communities Through Real-Time Ocean Hazard Reporting
          </p>
          <div className="flex justify-center space-x-4">
            <GlassButton onClick={() => navigate('/login')} className="px-6 py-3 text-lg !bg-white !text-blue-700 hover:!bg-blue-100 font-bold drop-shadow">
              Login
            </GlassButton>
            <GlassButton onClick={() => navigate('/signup')} className="px-6 py-3 text-lg !bg-white !text-blue-700 hover:!bg-blue-100 font-bold drop-shadow">
              Sign Up
            </GlassButton>
          </div>
        </div>
      </div>

  {/* About Section */}
  <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">About TARANG</h2>
        <p className="text-gray-700 mb-4">
          {/* TARANG which stands for Technology for Alerts on Rising Aquatic Natural Geohazards is a cutting-edge platform designed to enhance coastal safety through 
          community-driven ocean hazard reporting and official verification. Our system bridges 
          the gap between citizens, coastal authorities, and emergency responders, enabling 
          faster response times and better disaster preparedness. */}
          <b>TARANG (Technology for Alerts on Rising Aquatic Natural Geohazards)</b> is a robust, cutting-edge digital platform specifically designed to fundamentally enhance coastal safety and resilience. We achieve this through a unique, community-driven framework that integrates real-time ocean hazard reporting with official verification protocols. Our system effectively bridges the operational gap between citizens, maritime regulatory authorities, and critical emergency responders, leading to substantially faster incident response times and dramatically improved disaster preparedness strategies.

        </p>
        <p className="text-gray-700 mb-6">
          {/* By combining real-time citizen reports with social media analysis and official 
          verification workflows, TARANG provides comprehensive situational awareness 
          for tsunamis, storm surges, high waves, coastal flooding, and other marine threats. */}

The platform's core strength lies in its ability to synthesize multiple data streams. By combining verified, crowd-sourced citizen reports with proactive social media analysis and established official verification workflows, TARANG delivers comprehensive, actionable situational awareness. This critical intelligence covers a full spectrum of hydro-marine threats, including tsunami inundation risks, severe storm surges, hazardous high wave events, extensive coastal flooding, and other impending marine emergencies.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 text-center">
          <MapPin className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Location-Based Reporting</h3>
          <p className="text-sm text-gray-600">
            Submit hazard reports with precise GPS coordinates and interactive map integration
          </p>
        </div>

  <div className="glass-card p-6 text-center">
          <Shield className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Official Verification</h3>
          <p className="text-sm text-gray-600">
            Trusted verification system with role-based access for coastal authorities
          </p>
        </div>

  <div className="glass-card p-6 text-center">
          <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Social Media Integration</h3>
          <p className="text-sm text-gray-600">
            AI-powered analysis of social media trends and sentiment for enhanced awareness
          </p>
        </div>

  <div className="glass-card p-6 text-center">
          <Users className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
          <p className="text-sm text-gray-600">
            Empowering citizens to actively participate in coastal safety and disaster response
          </p>
        </div>
      </div>

  {/* Key Features */}
  <div className="glass-card p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Submit detailed hazard reports with photos and location data
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Interactive map visualization with severity-based color coding
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Real-time status updates and verification workflow
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Advanced filtering and search capabilities
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Official dashboard for authorities and emergency responders
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Social media sentiment analysis and trend tracking
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Comprehensive analytics and reporting tools
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Mobile-responsive design for field reporting
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
  <div className="glass-card bg-gradient-to-br from-blue-700 via-cyan-500 to-green-400 rounded-lg p-8 text-center border-0 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-navy drop-shadow-lg">Join TARANG Today</h2>
        <p className="mb-6 text-navy drop-shadow">
          Be part of the solution. Help make coastal communities safer and more resilient.
        </p>
        <div className="flex justify-center space-x-4">
          <GlassButton
            onClick={() => navigate('/signup')}
            className="px-8 py-3 text-lg !bg-white !text-blue-700 hover:!bg-blue-100 font-bold drop-shadow"
          >
            Get Started
          </GlassButton>
          <GlassButton
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-lg !bg-transparent !border-white !text-blue-700 hover:!bg-white hover:!text-blue-700 font-bold drop-shadow"
          >
            Sign In
          </GlassButton>
        </div>
      </div>
    </div>
  );
};

export default About;
