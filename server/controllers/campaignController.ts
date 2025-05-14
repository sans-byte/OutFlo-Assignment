import { Request, Response } from 'express';
import Campaign, { ICampaign } from '../models/Campaign';
import mongoose from 'mongoose';

// Get all campaigns (excluding deleted)
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({ status: { $ne: 'deleted' } });
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};

// Get a single campaign by ID
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign || campaign.status === 'deleted') {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaign', error });
  }
};

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    // Validate accountIDs are valid ObjectIds
    const validAccountIDs = accountIDs?.filter((id: string) => 
      mongoose.Types.ObjectId.isValid(id)
    ).map((id: string) => new mongoose.Types.ObjectId(id)) || [];
    
    const campaign = new Campaign({
      name,
      description,
      status: status || 'inactive',
      leads: leads || [],
      accountIDs: validAccountIDs,
    });
    
    const savedCampaign = await campaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error });
  }
};

// Update a campaign
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { name, description, status, leads, accountIDs } = req.body;
    
    // Validate accountIDs are valid ObjectIds
    const validAccountIDs = accountIDs?.filter((id: string) => 
      mongoose.Types.ObjectId.isValid(id)
    ).map((id: string) => new mongoose.Types.ObjectId(id));
    
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign || campaign.status === 'deleted') {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    // Update campaign fields
    if (name) campaign.name = name;
    if (description) campaign.description = description;
    if (status && status !== 'deleted') campaign.status = status;
    if (leads) campaign.leads = leads;
    if (validAccountIDs) campaign.accountIDs = validAccountIDs;
    
    const updatedCampaign = await campaign.save();
    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error updating campaign', error });
  }
};

// Soft delete a campaign
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign || campaign.status === 'deleted') {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    campaign.status = 'deleted';
    await campaign.save();
    
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting campaign', error });
  }
};