import axios from "axios";
import { Campaign, Lead, PersonalizedMessageResponse } from "../types";

// const API_URL = "http://localhost:5000/api";
const API_URL = "https://outflo-assignment-zr3p.onrender.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Campaign API calls
export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await api.get("/campaigns");
  return response.data;
};

export const fetchCampaignById = async (id: string): Promise<Campaign> => {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
};

export const createCampaign = async (
  campaignData: Omit<Campaign, "_id" | "createdAt" | "updatedAt">
): Promise<Campaign> => {
  const response = await api.post("/campaigns", campaignData);
  return response.data;
};

export const updateCampaign = async (
  id: string,
  campaignData: Partial<Campaign>
): Promise<Campaign> => {
  const response = await api.put(`/campaigns/${id}`, campaignData);
  return response.data;
};

export const deleteCampaign = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/campaigns/${id}`);
  return response.data;
};

export const toggleCampaignStatus = async (
  id: string,
  currentStatus: "active" | "inactive" | "deleted"
): Promise<Campaign> => {
  const newStatus = currentStatus === "active" ? "inactive" : "active";
  const response = await api.put(`/campaigns/${id}`, { status: newStatus });
  return response.data;
};

// Message generation API call
export const generatePersonalizedMessage = async (
  profileData: Omit<Lead, "_id" | "profileUrl">
): Promise<PersonalizedMessageResponse> => {
  const payload = {
    name: profileData.name,
    job_title: profileData.jobTitle,
    company: profileData.company,
    location: profileData.location,
    summary: profileData.summary,
  };

  const response = await api.post("/personalized-message", payload);
  return response.data;
};

export default api;
