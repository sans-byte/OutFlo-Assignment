import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { createCampaign } from '../api/api';
import { Campaign } from '../types';
import CampaignForm from '../components/CampaignForm';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  
  const mutation = useMutation(
    (campaignData: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt'>) => 
      createCampaign(campaignData),
    {
      onSuccess: (data) => {
        toast.success('Campaign created successfully');
        navigate(`/campaigns/${data._id}`);
      },
      onError: () => {
        toast.error('Failed to create campaign');
      },
    }
  );
  
  const handleSubmit = (data: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt'>) => {
    mutation.mutate(data);
  };
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Campaign</h1>
        
        <CampaignForm
          onSubmit={handleSubmit}
          isSubmitting={mutation.isLoading}
        />
      </div>
    </div>
  );
};

export default CreateCampaign;