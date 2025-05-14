import { Request, Response } from "express";

interface ProfileData {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

// Simple AI message generator without external API
export const generatePersonalizedMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const profileData: ProfileData = req.body;

    // Validate required fields
    if (!profileData.name || !profileData.job_title || !profileData.company) {
      return res.status(400).json({
        message:
          "Missing required profile data: name, job_title, and company are required",
      });
    }

    // Generate a simple personalized message
    const personalizedMessage = await generateMessage(profileData);

    res.status(200).json({ message: personalizedMessage });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error generating personalized message", error });
  }
};

// // Helper function to generate a personalized message
// function generateMessage(profile: ProfileData): string {
//   const templates = [
//     `Hi ${profile.name}, I noticed you're working as a ${profile.job_title} at ${profile.company}. I'd love to connect and share how OutFlo can help streamline your outreach campaigns.`,

//     `Hello ${profile.name}! As a ${profile.job_title} at ${profile.company}, you might be interested in how OutFlo has helped similar professionals increase their outreach effectiveness by 3x.`,

//     `${profile.name}, I came across your profile and was impressed by your experience as a ${profile.job_title} at ${profile.company}. I'd like to discuss how OutFlo's AI-powered outreach tools could benefit your work.`,

//     `Hey ${profile.name}, fellow ${profile.location} professional here! Our AI outreach tool OutFlo has been helping ${profile.job_title}s like yourself at companies similar to ${profile.company}. Would you be open to a quick chat?`
//   ];

//   // Select a random template
//   const randomIndex = Math.floor(Math.random() * templates.length);
//   return templates[randomIndex];
// }

// Uncomment and modify this section if you want to use OpenAI

// import OpenAI from 'openai';
// import dotenv from 'dotenv';

// // Load environment variables
// dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// async function generateMessage(profile: ProfileData): Promise<string> {
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are an AI assistant that helps sales professionals write personalized LinkedIn outreach messages. Keep the messages friendly, professional, and under 100 words."
//         },
//         {
//           role: "user",
//           content: `Write a personalized LinkedIn outreach message for a lead with the following information:
//             - Name: ${profile.name}
//             - Job Title: ${profile.job_title}
//             - Company: ${profile.company}
//             - Location: ${profile.location}
//             - Summary: ${profile.summary}

//             The message should introduce our product OutFlo, which is an AI-powered LinkedIn outreach tool that helps sales teams automate their outreach while keeping it personalized.`
//         }
//       ],
//       max_tokens: 200,
//     });

//     return completion.choices[0].message.content || "Hello! I'd like to connect and share how OutFlo can help with your LinkedIn outreach.";
//   } catch (error) {
//     console.error('Error generating AI message:', error);
//     return `Hi ${profile.name}, I noticed you're a ${profile.job_title} at ${profile.company}. I'd love to connect and share how OutFlo can help automate your LinkedIn outreach while keeping it personalized.`;
//   }
// }

import dotenv from "dotenv";
import Together from "together-ai";

// Load environment variables
dotenv.config();

const together = new Together();

async function generateMessage(profile: ProfileData): Promise<string> {
  try {
    // const response = await fetch(TOGETHER_API_URL, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${TOGETHER_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     model: "Qwen/Qwen3-235B-A22B-fp8-tput",
    //     messages: [
    //       {
    //         role: "system",
    //         content:
    //           "You are an AI assistant that helps sales professionals write personalized LinkedIn outreach messages. Keep the messages friendly, professional, and under 100 words.",
    //       },
    //       {
    //         role: "user",
    //         content: `Write a personalized LinkedIn outreach message for a lead with the following information:
    //           - Name: ${profile.name}
    //           - Job Title: ${profile.job_title}
    //           - Company: ${profile.company}
    //           - Location: ${profile.location}
    //           - Summary: ${profile.summary}

    //           The message should introduce our product OutFlo, which is an AI-powered LinkedIn outreach tool that helps sales teams automate their outreach while keeping it personalized.`,
    //       },
    //     ],
    //     max_tokens: 400,
    //     temperature: 0.7,
    //   }),
    // });

    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI assistant that helps sales professionals write personalized LinkedIn outreach messages. Keep the messages friendly, professional, and under 100 words.",
        },
        {
          role: "user",
          content: `Write a personalized LinkedIn outreach message for a lead with the following information:
                  - Name: ${profile.name}
                  - Job Title: ${profile.job_title}
                  - Company: ${profile.company}
                  - Location: ${profile.location}
                  - Summary: ${profile.summary}
    
                  The message should introduce our product OutFlo, which is an AI-powered LinkedIn outreach tool that helps sales teams automate their outreach while keeping it personalized.`,
        },
      ],
      max_tokens: 500,
      model: "meta-llama/Llama-Vision-Free",
    });

    const data = response.choices[0].message?.content;

    console.log(response.choices[0]);

    const content = data;
    return (
      content ||
      `Hi ${profile.name}, I noticed you're a ${profile.job_title} at ${profile.company}. I'd love to connect and share how OutFlo can help with personalized LinkedIn outreach.`
    );
  } catch (error) {
    console.error("Error generating AI message:", error);
    return `Hi ${profile.name}, I noticed you're a ${profile.job_title} at ${profile.company}. I'd love to connect and share how OutFlo can help automate your LinkedIn outreach while keeping it personalized.`;
  }
}
