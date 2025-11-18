"use client";
import React, { useState, useCallback } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";

const CourseSelect = ({ apiurl, value, onChange, disabled }) => {
  const [loading, setLoading] = useState(false);

  // 🔹 Load existing courses while typing
  const loadOptions = useCallback(
    async (inputValue) => {
      if (!inputValue.trim()) return [];
      try {
        const res = await axios.get(
          `${apiurl}/api/sql/dropdown/course_list?search=${encodeURIComponent(
            inputValue
          )}`
        );
        const data = res.data?.data || [];
        return data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
      } catch (err) {
        console.error("Error fetching courses:", err);
        return [];
      }
    },
    [apiurl]
  );

  // 🔹 Create a new course
  const handleCreate = useCallback(
    async (inputValue) => {
      try {
        setLoading(true);
        const res = await axios.post(
          `${apiurl}/api/sql/dropdown/course_create`,
          {
            name: inputValue.trim(),
          }
        );

        const newCourse = res.data?.data;
        if (newCourse) {
          const newOption = { value: newCourse.id, label: newCourse.name };
          onChange(newOption);
        }
      } catch (err) {
        console.error("Error creating course:", err);
      } finally {
        setLoading(false);
      }
    },
    [apiurl, onChange]
  );

  return (
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions
      isClearable
      placeholder="Search or create course..."
      loadOptions={loadOptions}
      onCreateOption={handleCreate}
      onChange={onChange}
      value={value}
      isDisabled={disabled || loading}
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#ced4da",
          minHeight: "38px",
          boxShadow: "none",
          "&:hover": { borderColor: "#86b7fe" },
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  );
};

export default React.memo(CourseSelect);
