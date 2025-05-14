import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { toggleCampaignStatus, deleteCampaign } from '../api/api';
import { Campaign } from '../types';
import { Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Toggle campaign status mutation
  const toggleStatusMutation = useMutation(
    () => toggleCampaignStatus(campaign._id, campaign.status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('campaigns');
        toast.success(`Campaign ${campaign.status === 'active' ? 'deactivated' : 'activated'}`);
      },
      onError: () => {
        toast.error('Failed to update campaign status');
      },
    }
  );
  
  // Delete campaign mutation
  const deleteMutation = useMutation(() => deleteCampaign(campaign._id), {
    onSuccess: () => {
      queryClient.invalidateQueries('campaigns');
      toast.success('Campaign deleted');
    },
    onError: () => {
      toast.error('Failed to delete campaign');
    },
  });
  
  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleStatusMutation.mutate();
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteMutation.mutate();
    }
  };
  
  const handleCardClick = () => {
    navigate(`/campaigns/${campaign._id}`);
  };
  
  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-100"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{campaign.name}</h3>
        <div className="flex items-center">
          <span 
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2
              ${campaign.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'}`}
          >
            {campaign.status}
          </span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
      
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span className="mr-4">Leads: {campaign.leads.length}</span>
        <span>Updated: {new Date(campaign.updatedAt).toLocaleDateString()}</span>
      </div>
      
      <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleStatusToggle}
          className={`flex items-center text-sm font-medium ${
            campaign.status === 'active' ? 'text-green-600 hover:text-green-700' : 'text-gray-500 hover:text-gray-600'
          }`}
        >
          {campaign.status === 'active' ? (
            <>
              <ToggleRight className="mr-1" size={16} />
              Active
            </>
          ) : (
            <>
              <ToggleLeft className="mr-1" size={16} />
              Inactive
            </>
          )}
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/campaigns/${campaign._id}`);
            }}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Eye className="mr-1" size={16} />
            View
          </button>
          
          <button
            onClick={handleDelete}
            className="flex items-center text-red-500 hover:text-red-600 text-sm font-medium"
          >
            <Trash2 className="mr-1" size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;