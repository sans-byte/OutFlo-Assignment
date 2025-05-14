# OutFlo - LinkedIn Outreach Campaign Manager

OutFlo is a full-stack web application for managing LinkedIn outreach campaigns. It helps sales professionals and marketers automate their outreach while keeping messages personalized.

## Features

- Create, manage, and track outreach campaigns
- Generate personalized messages based on LinkedIn profile data
- Toggle campaign status between active and inactive
- Soft delete mechanism for campaigns
- Clean and intuitive UI

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Libraries**: React Query, React Hook Form, Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/outflo.git
cd outflo
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/outflo
# Add your AI service API key if you want to use AI generation
# OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:
```
npm run dev
```

This will start both the frontend (Vite) and backend (Express) servers concurrently.

## API Endpoints

### Campaigns

- `GET /api/campaigns` - Get all campaigns (excluding deleted ones)
- `GET /api/campaigns/:id` - Get a single campaign
- `POST /api/campaigns` - Create a new campaign
- `PUT /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Soft delete a campaign (sets status to "deleted")

### Message Generation

- `POST /api/personalized-message` - Generate a personalized message based on LinkedIn profile data

## Future Enhancements

- LinkedIn profile scraping integration
- Campaign analytics and reporting
- Email integration for outreach
- User authentication and team collaboration

## License

This project is licensed under the MIT License - see the LICENSE file for details.