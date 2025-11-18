import React, { useState } from "react";

const SearchableInput = ({
  name,
  label,
  value,
  onChange,
  options,
  onSelect,
  setFormData,
  formData,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    // Update parent form data
    const { name, value } = e.target;
    if (setFormData) {
      setFormData({ ...formData, [name]: value });
    }

    onChange(e);

    // Slight delay so click (onMouseDown) can register
    setTimeout(() => setIsFocused(false), 100);
  };

  return (
    <div className="form-group position-relative">
      <label>
        {label}
        <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        placeholder={`Search ${label}`}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        name={name}
      />
      {isFocused && value && options.length > 0 && (
        <ul
          className="dropdown-menu show"
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 1000,
            maxHeight: "200px", // 👈 limit height
            overflowY: "auto", // 👈 make scrollable
          }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onMouseDown={() => {
                onSelect(option);
                setIsFocused(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableInput;

/*
this works fine just dont hide the list 
import React from "react";

const SearchableInput = ({
  name,
  label,
  value,
  onChange,
  options,
  onSelect,
}) => {
  return (
    <div className="form-group  position-relative">
      <label>
        {label}
        <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        placeholder={`Search ${label}`}
        value={value}
        onChange={onChange}
        autoComplete="off"
        name={name}
      />
      {options.length > 0 && value && (
        <ul
          className="dropdown-menu show"
          style={{ position: "absolute", width: "100%" }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableInput;
 */
