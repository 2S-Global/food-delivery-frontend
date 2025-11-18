import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Profilepic = ({
  show,
  onClose,
  imageSrc,
  setReload,
  setError_main,
  setSuccess_main,
}) => {
  const [selectedImage, setSelectedImage] = useState(
    imageSrc || "/default-profile.png"
  );
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const apiurl = process.env.NEXT_PUBLIC_API_URL;

  const token = localStorage.getItem("candidate_token");
  if (!token) {
    console.log("No token");
  }

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);

      // Revoke object URL on component unmount to prevent memory leaks
      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  // Upload image API call
  const uploadImage = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await axios.post(
        `${apiurl}/api/useraction/update-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload successful:", response.data);
      setSuccess("Image uploaded successfully!");
      setSuccess_main("Image uploaded successfully!");
      setReload(true);
      setTimeout(() => onClose(), 1500); // Close modal after success
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload image. Please try again.");
      setError_main("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  console.log(error);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">Upload a Recent Photo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <p className="text-muted">
              A profile photo enhances memorability and helps demonstrate
              professionalism.
            </p>

            {/* Profile Image Preview */}
            <div className="d-flex justify-content-center">
              <div
                className="rounded-circle overflow-hidden border"
                style={{ width: "120px", height: "120px" }}
              >
                <img
                  src={selectedImage}
                  alt="Profile"
                  className="w-100 h-100 object-cover"
                />
              </div>
            </div>

            {/* Upload & Delete Buttons */}
            <div className="d-flex justify-content-center mt-3">
              <label htmlFor="file-upload" className="btn btn-primary me-3">
                Change Photo
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                className="btn btn-danger"
                onClick={() => {
                  setSelectedImage("/default-profile.png");
                  setFile(null);
                }}
              >
                Delete Photo
              </button>
            </div>

            {/* Submit Button (Only Show If Image is Selected) */}
            {file && (
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-success"
                  onClick={uploadImage}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Submit"}
                </button>
              </div>
            )}

            {/* Success & Error Messages */}
            {success && (
              <p className="text-success text-center mt-2">{success}</p>
            )}
            {error && <p className="text-danger text-center mt-2">{error}</p>}

            <p
              className="text-muted mt-2 text-center"
              style={{ fontSize: "12px" }}
            >
              Supported file formats: PNG, JPG, JPEG, GIF - up to 2MB.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepic;
