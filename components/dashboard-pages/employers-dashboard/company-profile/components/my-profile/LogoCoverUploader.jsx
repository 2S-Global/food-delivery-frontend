"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";
const LogoCoverUploader = ({ formdata, setFormdata, Deletecover }) => {
  const [logoImg, setLogoImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  // Preview URLs
  const [logoPreview, setLogoPreview] = useState(formdata?.logo_preview || "");
  const [coverPreview, setCoverPreview] = useState(
    formdata?.cover_preview || ""
  );

  useEffect(() => {
    if (formdata.logo_preview) {
      setLogoPreview(formdata.logo_preview);
    }
    if (formdata.cover_preview) {
      setCoverPreview(formdata.cover_preview);
    }
  }, [formdata.logo_preview, formdata.cover_preview]);

  // Generate preview when logo changes
  useEffect(() => {
    if (logoImg) {
      const previewUrl = URL.createObjectURL(logoImg);
      setLogoPreview(previewUrl);
      setFormdata((prev) => ({ ...prev, logo: logoImg }));
    }
  }, [logoImg]);

  // Generate preview when cover changes
  useEffect(() => {
    if (coverImg) {
      const previewUrl = URL.createObjectURL(coverImg);
      setCoverPreview(previewUrl);
      setFormdata((prev) => ({ ...prev, cover: coverImg }));
    }
  }, [coverImg]);

  const removeLogo = () => {
    setLogoImg(null);
    setLogoPreview("");
    setFormdata((prev) => ({ ...prev, logo: null, logo_preview: null }));
  };

  const removeCover = () => {
    setCoverImg(null);
    setCoverPreview("");
    setFormdata((prev) => ({ ...prev, cover: null, cover_preview: null }));
  };
  const DeleteCover = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the cover photo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      setCoverImg(null);
      setCoverPreview("");
      setFormdata((prev) => ({ ...prev, cover: null, cover_preview: null }));
      Deletecover();
    }
  };

  return (
    <>
      {/* Logo Upload */}
      <div className="form-group ">
        <label>Company Logo</label>
        <span className="text-danger ms-1">*</span>
        <div className="uploading-outer mb-4">
          <div className="uploadButton mb-2 mx-4">
            <input
              className="uploadButton-input"
              type="file"
              accept="image/*"
              id="upload_logo"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setLogoImg(file); // For upload
                  setLogoPreview(URL.createObjectURL(file)); // For preview
                  setTimeout(() => {
                    e.target.value = null; // reset after reading
                  }, 0);
                }
              }}
            />

            <label
              className="uploadButton-button ripple-effect"
              htmlFor="upload_logo"
            >
              {logoImg ? logoImg.name : "Browse Logo"}
            </label>
          </div>

          {logoPreview && (
            <div className="mb-3">
              <div className="position-relative d-inline-block">
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="img-thumbnail rounded-circle d-block mx-auto shadow"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    border: "2px solid #dee2e6", // Optional for cleaner border
                  }}
                />

                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  onClick={removeLogo}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cover Upload */}
      <div className="form-group ">
        <label>Company Cover Image</label>
        <div className="uploading-outer mb-4">
          <div className="uploadButton mb-2 mx-4">
            <input
              className="uploadButton-input"
              type="file"
              accept="image/*"
              id="upload_cover"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setCoverImg(file); // For upload
                  setCoverPreview(URL.createObjectURL(file)); // For preview
                  setTimeout(() => {
                    e.target.value = null; // reset after reading
                  }, 0);
                }
              }}
            />

            <label
              className="uploadButton-button ripple-effect"
              htmlFor="upload_cover"
            >
              {coverImg ? coverImg.name : "Browse Cover"}
            </label>
          </div>

          {coverPreview && (
            <div className="mb-3">
              <div className="position-relative d-inline-block">
                <img
                  src={coverPreview}
                  alt="Cover Preview"
                  className="img-thumbnail"
                  style={{
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    maxWidth: "300px",
                  }}
                />
                {/* Remove Button */}
                {coverPreview === formdata.cover_preview ? (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      onClick={DeleteCover}
                    >
                      <Trash2 />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0 ms-2"
                      onClick={removeCover}
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LogoCoverUploader;
