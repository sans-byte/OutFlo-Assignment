export interface Campaign {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'deleted';
  leads: string[];
  accountIDs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id?: string;
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  summary: string;
  profileUrl: string;
}

export interface ApiError {
  message: string;
  error?: any;
}

export interface PersonalizedMessageResponse {
  message: string;
}