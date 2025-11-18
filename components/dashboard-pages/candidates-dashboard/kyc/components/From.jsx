"use client";

import { useState } from "react";
import axios from "axios";

import MessageComponent from "@/components/common/ResponseMsg";
const VerificationForm = ({ Document, name }) => {
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("candidate_token");
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: name || "",
    number: "",
    fieldname: Document.verification_name,
    field_id: Document._id,
  });

  const handleInputChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  };
  const addToVerificationCart = async (formData) => {
    console.log("test ", formData);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setMessageId(null);
    setSuccess(null);

    try {
      /* /api/candidate/usercart/add_candidate_cart */
      const response = await axios.post(
        `${apiurl}/api/candidate/usercart/add_candidate_cart`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setSuccess(response.data.message || "Added to Verification Cart");
        setMessageId(Date.now());
      }

      if (!response.data.success) {
        setError(response.data.message || "Failed to add to Verification Cart");
        setErrorId(Date.now());
      }
    } catch (error) {
      setError(
        error.response.data.message || "Failed to add to Verification Cart"
      );
      setErrorId(Date.now());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <MessageComponent
        error={error}
        success={success}
        errorId={errorId}
        message_id={message_id}
      />
      <form
        className="default-form"
        onSubmit={(e) => {
          e.preventDefault();
          addToVerificationCart(formData);
        }}
      >
        <div className="row">
          {Document.fields.map((field, index) => {
            const inputId = `${Document._id}-${index}`;
            const inputName = `${Document.verification_name}-${index}`;

            return (
              <div className="form-group col-lg-6 col-md-6" key={inputId}>
                <label htmlFor={inputId}>
                  {field}
                  <span className="text-danger ms-1">*</span>
                </label>
                <input
                  type="text"
                  id={inputId}
                  name={inputName}
                  className="form-control"
                  placeholder={`Enter ${field}`}
                  required
                  readOnly={index === 1}
                  value={index === 0 ? formData.number : formData.name}
                  onChange={(e) =>
                    handleInputChange(
                      index === 0 ? "number" : "name",
                      e.target.value
                    )
                  }
                  {...(Document.regex ? { pattern: Document.regex } : {})}
                />
              </div>
            );
          })}

          <div className="form-group  d-flex align-items-end">
            <button type="submit" className="btn btn-primary w-100">
              Add To Verification Cart
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default VerificationForm;
