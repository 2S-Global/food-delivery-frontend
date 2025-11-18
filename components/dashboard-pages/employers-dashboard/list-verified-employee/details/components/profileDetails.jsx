import React from "react";
import { CheckCircle, XCircle, MapPin } from "lucide-react";

const ProfileDetails = () => {
  return (
    <div className="container">
      <h4 className="text-primary mb-3">Verification Details</h4>
      <div className="row">
        {/* PAN Section */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold text-dark">PAN</h5>
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Number:</span>
                  <span className="text-break">AMPPG7969P</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Type:</span>
                  <span className="text-break">Person</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Verified:</span>
                  <CheckCircle size={16} className="text-success" />
                </div>
                <div className="d-flex align-items-center mb-2">
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

        {/* Aadhaar Section */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold text-dark">Aadhaar</h5>
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Full Name:</span>
                  <span className="text-break">Avik Ghosh</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">DOB:</span>
                  <span className="text-break">20-08-1985</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Gender:</span>
                  <span className="text-break">Male</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Father Name:</span>
                  <span className="text-break">Arup Kr. Ghosh</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Verified:</span>
                  <CheckCircle size={16} className="text-success" />
                </div>
                <div className="d-flex align-items-center mb-2">
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

        {/* EPIC Section */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold text-dark">EPIC</h5>
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Full Name:</span>
                  <span className="text-break">Avik Ghosh</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">EPIC:</span>
                  <span className="text-break">KTF2559334</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Verified:</span>
                  <CheckCircle size={16} className="text-success" />
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Constituency Name:</span>
                  <span className="text-break">Rajarhat New Town</span>
                </div>
                <div className="d-flex align-items-center mb-2">
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

        {/* Driving License Section */}
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold text-dark">Driving License</h5>
              <div className="mt-3">
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Name:</span>
                  <span className="text-break">Avik Ghosh</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Verified:</span>
                  <CheckCircle size={16} className="text-success" />
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Cover:</span>
                  <span className="text-break">LMV</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="fw-bold me-2">Expiry Date:</span>
                  <span className="text-break">06-03-2033</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
