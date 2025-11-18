"use client";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-input.css";

const AutoDetectPhoneInput = ({
  phone = "",
  setPhone = () => {},
  setDisableSubmit = () => {},
}) => {
  const [error, setError] = useState("");

  const handleChange = (val, countryData) => {
    setPhone(val);

    const regex = /^\d+$/; // only digits

    if (!val) {
      setError("Phone number is required");
      setDisableSubmit(true);
      return;
    }

    if (!regex.test(val)) {
      setError("Phone number must contain digits only");
      setDisableSubmit(true);
      return;
    }

    // remove dial code for validation
    const nationalNumber = val.replace(countryData.dialCode, "");

    if (countryData.countryCode === "in") {
      // 🇮🇳 India → must be exactly 10 digits
      if (nationalNumber.length !== 10) {
        setError("Indian phone number must be exactly 10 digits");
        setDisableSubmit(true);
        return;
      }
    } else {
      // 🌍 All other countries → 7–15 digits
      if (nationalNumber.length < 7 || nationalNumber.length > 15) {
        setError("Phone number must be between 7 and 15 digits");
        setDisableSubmit(true);
        return;
      }
    }

    setError(""); // ✅ valid
    setDisableSubmit(false);
  };

  return (
    <div className="form-group w-100 mb-1">
      <label>Phone Number</label>

      <PhoneInput
        country="in" // default India
        value={phone || ""}
        onChange={handleChange}
        placeholder="Phone Number"
        inputProps={{
          name: "phone_number",
          required: true,
        }}
        containerClass="w-100"
        inputClass={`form-control w-100 ${error ? "is-invalid" : ""}`}
        buttonClass="border-0 bg-transparent"
      />

      {/* Validation message */}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

export default AutoDetectPhoneInput;
