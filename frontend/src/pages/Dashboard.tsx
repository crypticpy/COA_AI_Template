import React from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

/**
 * Dashboard Page - Main landing page after login
 * TODO: Customize this page for your application
 */
const Dashboard: React.FC = () => {
  const { user } = useAuthContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-brand-dark-blue dark:text-white">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your City of Austin AI-powered application dashboard.
        </p>
      </div>

      {/* Quick Stats / Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Example Card 1 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Getting Started
            </h3>
            <span className="text-2xl">🚀</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This is a template dashboard. Customize it for your application needs.
          </p>
        </div>

        {/* Example Card 2 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Azure OpenAI
            </h3>
            <span className="text-2xl">🤖</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Integrated with Azure OpenAI for intelligent features.
          </p>
        </div>

        {/* Example Card 3 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 card-hover">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              COA Branding
            </h3>
            <span className="text-2xl">🎨</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            City of Austin brand colors and design system included.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          TODO: Build Your Application
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400">
            This template includes:
          </p>
          <ul className="text-gray-600 dark:text-gray-400 list-disc list-inside space-y-2 mt-4">
            <li>React 18 + TypeScript + Vite frontend</li>
            <li>City of Austin brand colors and design system</li>
            <li>Supabase authentication integration</li>
            <li>FastAPI backend with Azure OpenAI provider</li>
            <li>Azure Bicep infrastructure-as-code</li>
            <li>Docker containerization</li>
            <li>GitHub Actions CI/CD pipeline</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
