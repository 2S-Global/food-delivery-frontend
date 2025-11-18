import React, { useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";

const CompanyNameSelect = ({ formData, setFormData, defaultOptions = [] }) => {
  const [loading, setLoading] = useState(false);
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  // API call
  const fetchCompanies = async (inputValue) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${apiurl}/api/candidate/employment/matching_company`,
        {
          params: { company_name: inputValue || "" },
        }
      );

      return (
        response.data?.data?.map((name) => ({
          label: name,
          value: name,
        })) || []
      );
    } catch (error) {
      console.error("Error loading companies:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Handle selection/change
  const handleChange = (selectedOption) => {
    setFormData({
      ...formData,
      company_name: selectedOption ? selectedOption.value : "",
    });
  };

  return (
    <div className="mb-3 form-group">
      <label className="form-label">
        Company Name <span style={{ color: "red" }}>*</span>
      </label>

      <AsyncCreatableSelect
        cacheOptions
        defaultOptions={defaultOptions}
        isClearable
        isLoading={loading}
        loadOptions={fetchCompanies}
        value={
          formData.company_name
            ? { label: formData.company_name, value: formData.company_name }
            : null
        }
        onChange={handleChange}
        placeholder="Enter or create a company name"
      />
    </div>
  );
};

export default CompanyNameSelect;
