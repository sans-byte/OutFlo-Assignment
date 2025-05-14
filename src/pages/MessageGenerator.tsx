import React, { useState } from "react";
import { useMutation } from "react-query";
import { generatePersonalizedMessage } from "../api/api";
import { MessageSquare, Copy, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface FormData {
  name: string;
  jobTitle: string;
  company: string;
  location: string;
  summary: string;
}

const MessageGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    jobTitle: "",
    company: "",
    location: "",
    summary: "",
  });

  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  console.log(generatedMessage);

  const mutation = useMutation(
    (data: FormData) => generatePersonalizedMessage(data),
    {
      onSuccess: (data) => {
        setGeneratedMessage(data?.message);
        toast.success("Message generated successfully");
      },
      onError: () => {
        toast.error("Failed to generate message");
      },
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.jobTitle || !formData.company) {
      toast.error("Name, job title, and company are required");
      return;
    }
    mutation.mutate(formData);
  };

  const copyToClipboard = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        LinkedIn Message Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            LinkedIn Profile Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company*
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="TechCorp"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Experienced in AI & Machine Learning..."
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className={`w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  mutation.isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {mutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <MessageSquare size={16} className="mr-2" />
                    Generate Personalized Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Generated Message
            </h2>

            {generatedMessage && generatedMessage.length > 0 && (
              <button
                onClick={copyToClipboard}
                className="flex items-center text-gray-600 hover:text-gray-900"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <CheckCircle size={16} className="mr-1 text-green-500" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} className="mr-1" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          {generatedMessage && generatedMessage.length > 0 ? (
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[200px]">
              <p className="whitespace-pre-line">{generatedMessage}</p>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50 min-h-[200px] flex flex-col items-center justify-center text-gray-500">
              <MessageSquare size={24} className="mb-2" />
              <p>
                Fill in the profile information and click "Generate" to create a
                personalized message
              </p>
            </div>
          )}

          {generatedMessage && generatedMessage.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                This is a generated message template. Feel free to edit it
                before sending.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageGenerator;
