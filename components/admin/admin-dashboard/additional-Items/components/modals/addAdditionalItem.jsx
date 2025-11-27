"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import MessageComponent from "@/components/common/ResponseMsg";
import { Eye, EyeOff } from "lucide-react"; // Or any icon library you prefer
import Select from "react-select";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const AddAdditionalItemModal = ({ show, onClose, field = {} }) => {

  const [formData, setFormData] = useState({
    _id: field._id || "",
    itemName: field.itemName || "",
    itemPrice: field.itemPrice || "",
    description: field.description || "",
    images: [],
    oldImages: field.images || [],      // existing URLs
    newImages: [],                      // only new files
  });

  // const [imagePreviewLink, setImagePreviewLink] = useState(
  //   item.image || "/images/resource/no_user.png"
  // );

  // const [imagePreviewLink, setImagePreviewLink] = useState([]);

  // For Testing this should uncomment

  const [imagePreviewLink, setImagePreviewLink] = useState(
    field.images?.length ? field.images : []
  );

  const fileInputRef = useRef(null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;
  const [formErrors, setFormErrors] = useState({
    _id: "",
    itemName: "",
    itemPrice: "",
    description: "",
    oldImages: field.images || [],
    newImages: [],
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    transaction_fee: false,
    transaction_gst: false,
    allowed_verifications: false,
    phone_number: false,
    address: false,
    gst_no: false,
    package_id: false,
    discount_percent: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [gstError, setGstError] = useState(false);

  const menuTypeOptions = [
    { value: "Veg", label: "Veg" },
    { value: "Non-Veg", label: "Non-Veg" },
  ];

  const dayOptions = [
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const mealTypeOptions = [
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" }
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const newPreviewLinks = files.map((file) =>
      URL.createObjectURL(file)
    );

    setFormData((prev) => ({
      ...prev,
      // images: [...prev.images, ...files],
      newImages: [...prev.newImages, ...files],   // only new files
    }));

    setImagePreviewLink((prev) => [...prev, ...newPreviewLinks]);
  };

  // const handleRemoveImage = (index) => {
  //   setImagePreviewLink((prev) => prev.filter((_, i) => i !== index));

  //   setFormData((prev) => ({
  //     ...prev,
  //     images: prev.images.filter((_, i) => i !== index),
  //   }));

  //   // Clear file input if all images removed
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const handleRemoveImage = (index) => {
    const isOldImage = typeof imagePreviewLink[index] === "string"
      && imagePreviewLink[index].startsWith("https");

    if (isOldImage) {
      setFormData((prev) => ({
        ...prev,
        oldImages: prev.oldImages.filter((_, i) => i !== index),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        newImages: prev.newImages.filter((_, i) => i !== index - prev.oldImages.length),
      }));
    }

    setImagePreviewLink((prev) => prev.filter((_, i) => i !== index));
  };





  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const isValidGST = (gst) => {
    const regex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/;

    if (!regex.test(gst)) return false;

    let chars = gst.split("");
    let factor = [1, 2];
    let sum = 0;
    const modulus = 36;
    const codePointBase = "0".charCodeAt(0);
    const lettersBase = "A".charCodeAt(0);

    for (let i = 0; i < 14; i++) {
      let char = chars[i];
      let code = char.match(/[0-9]/)
        ? char.charCodeAt(0) - codePointBase
        : char.charCodeAt(0) - lettersBase + 10;

      let product = code * factor[i % 2];
      sum += Math.floor(product / modulus) + (product % modulus);
    }

    const checksumChar = (36 - (sum % 36)) % 36;
    const expected =
      checksumChar < 10
        ? String(checksumChar)
        : String.fromCharCode(lettersBase + checksumChar - 10);

    return chars[14] === expected;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({ ...prev, description: content }));

    // validation
    if (!content || content === "<p><br></p>" || content.trim() === "") {
      setFormErrors(prev => ({ ...prev, description: "Description is required" }));
    } else {
      setFormErrors(prev => ({ ...prev, description: "" }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let current = formData.allowed_verifications
      ? formData.allowed_verifications.split(",")
      : [];

    if (checked) {
      current.push(value);
    } else {
      current = current.filter((item) => item !== value);
    }

    setFormData({
      ...formData,
      allowed_verifications: current.join(","),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted By Chandra Sarkar:", formData);
    // return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem("Super_token");
    if (!token) {
      setError("Token not found. Please log in again.");
      return;
    }

    try {

      const formDataToSend = new FormData();

      formDataToSend.append("itemName", formData.itemName);
      formDataToSend.append("itemPrice", formData.itemPrice);
      formDataToSend.append("description", formData.description);

      // append images
      // for (let i = 0; i < formData.images.length; i++) {
      //   formDataToSend.append("images", formData.images[i]);
      // }

      // send OLD URLs
      formData.oldImages.forEach((url) => {
        formDataToSend.append("oldImages[]", url);
      });

      // send NEW files
      formData.newImages.forEach((file) => {
        formDataToSend.append("newImages", file);
      });

      // Add only new uploaded images
      // formData.newImages.forEach((file) => {
      //   formDataToSend.append("images", file);  // MUST MATCH backend
      // });

      // Send oldImages separately as JSON
      // formDataToSend.append("oldImages", JSON.stringify(formDataState.oldImages));

      // ADD vs EDIT decision
      // const isEdit = Boolean(formData.id);
      let response;
      if (!formData._id) {
        response = await axios.post(
          `${apiurl}/api/userdata/add-additional-item`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // -------------------------------
        // 🟢 EDIT MODE BLOCK
        // -------------------------------
        console.log("Calling EDIT API…");

        console.log("Here is my all Form Data: ", formDataToSend);

        response = await axios.put(
          `${apiurl}/api/userdata/edit-additional-items/${formData._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }


      // const response = await axios.post(
      //   `${apiurl}/api/userdata/add-menu`,
      //   {
      //     ...formData,
      //     // role: 2,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }

      setSuccess(response.data.message);
      window.location.reload();
      // router.push("/admin/listinstitute");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                {formData._id ? "Update Additional Item" : "Add Additional Item"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body row">
              <form onSubmit={handleSubmit}>
                {/* Response Message */}
                <MessageComponent error={error} success={success} />
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="name" className="form-label">
                      Menu Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="itemName"
                      className="form-control"
                      placeholder="Item Name"
                      required
                      value={formData.itemName}
                      onChange={handleChange}
                    />
                    {formErrors.itemName && (
                      <div className="invalid-feedback">{formErrors.itemName}</div>
                    )}
                  </div>

                  <div className="mb-3 col-md-6">
                    <label htmlFor="name" className="form-label">
                      Price <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      name="itemPrice"
                      className="form-control"
                      placeholder="Item Price"
                      required
                      value={formData.itemPrice}
                      onChange={handleChange}
                    />
                    {formErrors.itemPrice && (
                      <div className="invalid-feedback">{formErrors.itemPrice}</div>
                    )}
                  </div>

                  {/* <div className="mb-3 col-md-6">
                    <label htmlFor="email" className="form-label">
                      Menu Type{" "}
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      options={menuTypeOptions}
                      value={menuTypeOptions.find(opt => opt.value === formData.menuType)}
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          menuType: selected.value,
                        }))
                      }
                    />
                  </div> */}

                  <div className="mb-3 col-md-12">
                    <label htmlFor="address" className="form-label">
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <ReactQuill
                      id="description"
                      name="description"
                      theme="snow"
                      value={formData.description}
                      // ref={jobDescriptionRef}
                      // onChange={(content) =>
                      //   setFormData((prev) => ({ ...prev, jobDescription: content }))
                      // }
                      // onChange={(content) =>
                      //   setFormData((prev) => ({ ...prev, description: content }))
                      // }
                      onChange={handleDescriptionChange}
                      placeholder="Write detailed job description here..."
                      style={{ height: '250px', marginBottom: '40px' }}
                      className="form-group"
                    />
                    {/* {formErrors && <p style={{ color: 'red', marginTop: '50px' }}>{formErrors.description}</p>} */}
                  </div>

                  {/* Day */}
                  {/* <div className="mb-3 col-md-6">
                    <label htmlFor="phone_number" className="form-label">
                      Day <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      options={dayOptions}
                      value={dayOptions.find(opt => opt.value === formData.dayType)}
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          dayType: selected.value,
                        }))
                      }
                    />
                  </div> */}

                  {/* Meal Type */}
                  {/* <div className="mb-3 col-md-6">
                    <label htmlFor="phone_number" className="form-label">
                      Meal Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                      options={mealTypeOptions}
                      value={mealTypeOptions.find(opt => opt.value === formData.mealType)}
                      onChange={(selected) =>
                        setFormData((prev) => ({
                          ...prev,
                          mealType: selected.value,
                        }))
                      }
                    />
                  </div> */}

                  <div className="mb-3 col-md-12">
                    <label htmlFor="name" className="form-label">
                      Image <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg"
                      // name="images"
                      name="newImages"
                      className="form-control"
                      // required
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                    {formErrors.images && (
                      <div className="invalid-feedback">{formErrors.images}</div>
                    )}
                  </div>

                  {/* <div className="d-flex mt-2">
                    {imagePreviewLink.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt="Preview"
                        style={{
                          maxWidth: "120px",
                          marginRight: "8px",
                          border: "1px solid #ccc",
                          padding: "4px",
                          borderRadius: "6px",
                        }}
                      />
                    ))}
                  </div> */}

                  {/* <div className="d-flex mt-2"> */}
                  <div
                    className="d-flex flex-wrap mt-2"
                    style={{ gap: "8px" }}   // optional: spacing between images
                  >
                    {imagePreviewLink.map((src, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          marginRight: "8px",
                        }}
                      >
                        <img
                          src={src}
                          alt="Preview"
                          style={{
                            width: "120px",       // fixed width
                            height: "120px",      // fixed height
                            objectFit: "cover",   // cover the box without distortion
                            // maxWidth: "120px",
                            border: "1px solid #ccc",
                            padding: "4px",
                            borderRadius: "6px",
                            marginBottom: "40px",
                          }}
                        />

                        {/* Close button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "22px",
                            height: "27px",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || gstError}
                >
                  {/* {loading ? "Registering..." : "Register"} */}
                  {loading ? (
                    <>{formData._id ? "Updating" : "Registering"}</>
                  ) : (
                    <>{formData._id ? "Update" : "Register"}</>
                  )}
                </button>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAdditionalItemModal;