import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { fetchCampaignById, updateCampaign, deleteCampaign } from '../api/api';
import { Campaign } from '../types';
import CampaignForm from '../components/CampaignForm';
import { ArrowLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: campaign, isLoading, isError } = useQuery(
    ['campaign', id],
    () => fetchCampaignById(id!),
    {
      enabled: !!id,
    }
  );
  
  const updateMutation = useMutation(
    (campaignData: Partial<Campaign>) => updateCampaign(id!, campaignData),
    {
      onSuccess: () => {
        toast.success('Campaign updated successfully');
        queryClient.invalidateQueries(['campaign', id]);
      },
      onError: () => {
        toast.error('Failed to update campaign');
      },
    }
  );
  
  const deleteMutation = useMutation(() => deleteCampaign(id!), {
    onSuccess: () => {
      toast.success('Campaign deleted successfully');
      navigate('/');
      queryClient.invalidateQueries('campaigns');
    },
    onError: () => {
      toast.error('Failed to delete campaign');
    },
  });
  
  const handleSubmit = (data: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt'>) => {
    updateMutation.mutate(data);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteMutation.mutate();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (isError || !campaign) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error loading campaign. Please try again or go back to the dashboard.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-2 text-sm underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        
        <button
          onClick={handleDelete}
          className="flex items-center text-red-600 hover:text-red-700"
        >
          <Trash2 size={16} className="mr-1" />
          Delete Campaign
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Campaign</h1>
        
        <CampaignForm
          onSubmit={handleSubmit}
          initialData={campaign}
          isSubmitting={updateMutation.isLoading}
        />
      </div>
    </div>
  );
};

export default CampaignDetail;