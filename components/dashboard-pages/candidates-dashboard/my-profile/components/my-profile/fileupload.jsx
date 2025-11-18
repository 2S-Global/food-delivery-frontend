import { useState } from "react";

const UploadButton = ({ label, id, file, onChange, accept }) => (
  <div className="form-group col-lg-4 col-md-12">
    <label htmlFor={id}>{label}</label>
    <div className="uploadButton">
      <input
        className="uploadButton-input"
        type="file"
        id={id}
        accept={accept}
        onChange={onChange}
        required
      />
      <label className="uploadButton-button ripple-effect" htmlFor={id}>
        {file ? file.name : "Browse Transcript.."}
      </label>
    </div>
  </div>
);

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="file-upload-container">
      <UploadButton
        label="Transcript"
        id="classXTranscript"
        file={selectedFile}
        onChange={handleFileChange}
        accept="image/*, .pdf"
      />
      {selectedFile && (
        <p className="file-name">Selected File: {selectedFile.name}</p>
      )}
    </div>
  );
};

export default FileUpload;
