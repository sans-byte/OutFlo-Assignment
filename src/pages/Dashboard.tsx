import React from 'react';
import { useQuery } from 'react-query';
import { fetchCampaigns } from '../api/api';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import CampaignCard from '../components/CampaignCard';

const Dashboard: React.FC = () => {
  const { data: campaigns, isLoading, isError, refetch } = useQuery('campaigns', fetchCampaigns);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Campaigns Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => refetch()}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <Link
            to="/campaigns/new"
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={16} className="mr-2" />
            New Campaign
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Error loading campaigns. Please try again.</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 text-sm underline"
          >
            Retry
          </button>
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No campaigns yet</h3>
          <p className="text-gray-500 mb-4">Create your first campaign to get started</p>
          <Link
            to="/campaigns/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={16} className="mr-2" />
            Create Campaign
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;