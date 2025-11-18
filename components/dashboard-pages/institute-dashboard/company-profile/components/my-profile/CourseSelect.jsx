"use client";

import React from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";
import Swal from "sweetalert2";

const CreatableAsyncSelect = ({ formdata, setFormdata }) => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  // Load options from API
  const loadOptions = async (inputValue) => {
    try {
      const { data } = await axios.get(
        `${apiurl}/api/sql/dropdown/CourcesSearch?search=${inputValue}`
      );

      if (
        !data?.success ||
        !Array.isArray(data.data) ||
        data.data.length === 0
      ) {
        return [];
      }

      return data.data.map((course) => ({
        value: course._id,
        label: course.name,
      }));
    } catch (error) {
      console.error("Error loading options:", error);
      return [];
    }
  };

  const handleChange = (selectedOptions) => {
    setFormdata({
      ...formdata,
      courses: selectedOptions || [], // keep full objects
    });
  };

  const handleCreate = async (inputValue) => {
    try {
      // Ask for type using SweetAlert2 dropdown
      const { value: type } = await Swal.fire({
        title: "Select Course Type",
        input: "select",
        inputOptions: {
          UG: "UG",
          PG: "PG",
          DIPLOMA: "Diploma",
          INTEGRATED: "Integrated",
        },
        inputPlaceholder: "Select a type",
        showCancelButton: true,
        confirmButtonText: "Create",
      });

      if (!type) {
        Swal.fire("Cancelled", "Course creation cancelled", "info");
        return null;
      }

      // Send both name + type
      const res = await axios.post(`${apiurl}/api/sql/dropdown/add_course`, {
        name: inputValue,
        type,
      });

      // Since API always returns array
      const course = res.data.data[0];

      const newCourse = {
        value: course._id,
        label: course.name, // already formatted with type
      };

      setFormdata((prev) => ({
        ...prev,
        courses: [...(prev.courses || []), newCourse],
      }));

      Swal.fire(
        "Success",
        res.data.message || "Course created successfully!",
        "success"
      );

      return newCourse;
    } catch (error) {
      console.error("Error creating course:", error);
      Swal.fire("Error", "Failed to create course", "error");
    }
  };

  return (
    <>
      <div className="form-group col-lg-12 col-md-12">
        <label /* onClick={() => console.log(formdata)} */>
          Courses
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </label>
        <AsyncCreatableSelect
          isMulti
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          onChange={handleChange}
          onCreateOption={handleCreate}
          value={formdata.courses || []} // full objects, so label is preserved
          placeholder="Select or create a course..."
        />
      </div>
    </>
  );
};

export default CreatableAsyncSelect;
