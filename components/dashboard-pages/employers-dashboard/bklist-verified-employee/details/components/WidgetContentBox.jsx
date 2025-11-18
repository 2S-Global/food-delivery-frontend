import React from "react";

import { CheckCircle, XCircle, MapPin } from "lucide-react";

const userData = [
  { label: "Name", value: "Avik Ghosh" },
  { label: "Email", value: "avik@gmail.com" },
  { label: "Address", value: "Lueilwitz, Wisoky and Leuschke" },
  { label: "Phone Number", value: "9876543210" },
  { label: "Date of Birth", value: "20-08-1985" },
];

const WidgetContentBox = () => {
  return (
    <div className="widget-content p-4 border rounded shadow-sm bg-white">
      <h4 className="mb-3 text-primary">User Information</h4>

      <form className="default-form">
        <div className="row">
          {userData.map((field, index) => (
            <div key={index} className="form-group col-md-4 mb-3">
              <label className="fw-bold">{field.label}</label>
              <input
                type="text"
                className="form-control"
                value={field.value}
                readOnly
              />
            </div>
          ))}
        </div>
      </form>

      <div className="row">
        <h4 className="text-primary mb-3">Verification Details</h4>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-light">
            {" "}
            {/* Simple box with padding and background */}
            <h5 className="fw-bold text-dark mb-2">PAN</h5>
            <div className="mt-2">
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Full Name:</span>
                <span className="text-break">Avik Ghosh</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Number:</span>
                <span className="text-break">AMPPG7969P</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Type:</span>
                <span className="text-break">Person</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Verified:</span>
                <CheckCircle size={16} className="text-success" />
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Address:</span>
                <MapPin size={16} className="me-1" />
                <span className="text-break">
                  Lueilwitz, Wisoky and Leuschke
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-light">
            {" "}
            {/* Simple box with padding and background */}
            <h5 className="fw-bold text-dark mb-2">AADHAAR</h5>
            <div className="mt-2">
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Full Name:</span>
                <span className="text-break">Avik Ghosh</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">DOB:</span>
                <span className="text-break">20-08-1985</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Gender:</span>
                <span className="text-break">Male</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Verified:</span>
                <CheckCircle size={16} className="text-success" />
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Address:</span>
                <MapPin size={16} className="me-1" />
                <span className="text-break">
                  Lueilwitz, Wisoky and Leuschke
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-light">
            {" "}
            {/* Simple box with padding and background */}
            <h5 className="fw-bold text-dark mb-2">EPIC</h5>
            <div className="mt-2">
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Full Name:</span>
                <span className="text-break">Avik Ghosh</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">EPIC:</span>
                <span className="text-break">KTF2559334</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Verified:</span>
                <CheckCircle size={16} className="text-success" />
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Constituency Name:</span>
                <MapPin size={16} className="me-1" />
                <span className="text-break">Rajarhat New Town</span>
              </div>

              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Address:</span>
                <MapPin size={16} className="me-1" />
                <span className="text-break">
                  Lueilwitz, Wisoky and Leuschke
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-light">
            {" "}
            {/* Simple box with padding and background */}
            <h5 className="fw-bold text-dark mb-2">DL</h5>
            <div className="mt-2">
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Full Name:</span>
                <span className="text-break">Avik Ghosh</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">DL Number:</span>
                <span className="text-break">KTF2559334</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Verified:</span>
                <CheckCircle size={16} className="text-success" />
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Cover:</span>
                <span className="text-break">LMV</span>
              </div>

              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Expiry Date:</span>
                <span className="text-break">06-03-2033</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="p-3 shadow-sm rounded bg-light">
            {" "}
            {/* Simple box with padding and background */}
            <h5 className="fw-bold text-dark mb-2">Passport</h5>
            <div className="mt-2">
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Full Name:</span>
                <span className="text-break">Avik Ghosh</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Passport Number:</span>
                <span className="text-break">KTF2559334</span>
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Verified:</span>
                <CheckCircle size={16} className="text-success" />
              </div>
              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Country:</span>
                <MapPin size={16} className="me-1" />
                <span className="text-break">India</span>
              </div>

              <div className="d-flex align-items-center mb-1">
                <span className="fw-bold me-2">Address:</span>
                <MapPin size={16} className="me-1" />
                <span className="text-break">
                  Lueilwitz, Wisoky and Leuschke
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetContentBox;
