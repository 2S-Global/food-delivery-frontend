import React from "react";

const UploadButton = ({
  label = "Upload",
  id,
  file,
  onChange,
  accept,
  width = "340px",
  image,
}) => {
  // Check from `file.type` or fallback to image url
  const fileType = file?.type?.toLowerCase() || "";
  const isImage =
    fileType.startsWith("image/") ||
    (typeof image === "string" && /\.(jpe?g|png|gif|bmp|webp)$/i.test(image));
  const isPDF =
    fileType === "application/pdf" ||
    (typeof image === "string" && /\.pdf$/i.test(image));

  return (
    <div className="form-group col-lg-4 col-md-12">
      <div className="uploadButton">
        <input
          className="uploadButton-input"
          type="file"
          id={id}
          accept={accept}
          onChange={onChange}
          required
        />
        <label
          className="uploadButton-button ripple-effect"
          style={{ width }}
          htmlFor={id}
        >
          {file ? file.name : "Browse..."}
        </label>
      </div>

      {image && (
        <div style={{ marginTop: "10px" }}>
          {isImage ? (
            <img
              src={image}
              alt="Uploaded Preview"
              style={{
                maxWidth: width,
                height: "auto",
                borderRadius: "8px",
                border: "1px solid #ddd",
              }}
            />
          ) : isPDF ? (
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginTop: "5px",
                color: "#007bff",
                textDecoration: "underline",
              }}
            >
              View PDF
            </a>
          ) : (
            <p style={{ color: "#888", marginTop: "5px" }}>
              Preview not available for this file type.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadButton;
