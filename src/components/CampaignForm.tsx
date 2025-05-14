import React from "react";
import { useForm } from "react-hook-form";
import { Campaign } from "../types";

interface CampaignFormProps {
  onSubmit: (data: Omit<Campaign, "_id" | "createdAt" | "updatedAt">) => void;
  initialData?: Partial<Campaign>;
  isSubmitting: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Campaign, "_id" | "createdAt" | "updatedAt">>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      status: initialData?.status || "inactive",
      leads: initialData?.leads || [],
      accountIDs: initialData?.accountIDs || [],
    },
  });

  const processLeadsInput = (leadsInput: string): string[] => {
    return leadsInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const submitHandler = (data: any) => {
    // Process leads from textarea into array
    const processedData = {
      ...data,
      leads: processLeadsInput(data.leadsRaw),
    };

    delete processedData.leadsRaw;
    onSubmit(processedData);
  };

  const leadsDisplay = initialData?.leads?.join("\n") || "";

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Campaign Name
        </label>
        <input
          type="text"
          {...register("name", { required: "Campaign name is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter campaign name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter campaign description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          {...register("status")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          LinkedIn Leads (One URL per line)
        </label>
        <textarea
          //@ts-ignore
          {...register("leadsRaw")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="https://linkedin.com/in/johndoe&#10;https://linkedin.com/in/janedoe"
          defaultValue={leadsDisplay}
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter LinkedIn profile URLs, one per line
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Campaign"}
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;
