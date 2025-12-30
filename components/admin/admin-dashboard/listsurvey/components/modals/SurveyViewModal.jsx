"use client";
import React, { useEffect } from "react";

/* ======================
   HELPER COMPONENTS
====================== */

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "22px" }}>
    <h4
      style={{
        borderBottom: "1px solid #e5e7eb",
        paddingBottom: "6px",
        marginBottom: "12px",
        color: "#012169",
        fontSize: "15px",
        fontWeight: 700,
      }}
    >
      {title}
    </h4>
    {children}
  </div>
);

const Item = ({ label, value, multiline }) => (
  <div style={{ marginBottom: "10px" }}>
    <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
      {label}
    </div>
    <div
      style={{
        background: "#f9fafb",
        padding: "8px 10px",
        borderRadius: "6px",
        marginTop: "4px",
        fontSize: "13px",
        color: "#111827",
        whiteSpace: multiline ? "pre-wrap" : "normal",
        border: "1px solid #e5e7eb",
      }}
    >
      {value || "-"}
    </div>
  </div>
);

/* ======================
   MODAL
====================== */

const SurveyViewModal = ({ show, onClose, survey }) => {
  if (!show || !survey) return null;

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* HEADER */}
        <div style={header}>
          <h3 style={{ margin: 0 }}>Survey Details</h3>
          <button onClick={onClose} style={closeBtn}>
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div style={content}>
          <Section title="Basic Information">
            <Item label="Full Name" value={survey.fullName} />
            <Item label="Email" value={survey.email} />
            <Item label="Accommodation" value={survey.accommodation} />
            <Item label="Year of Study" value={survey.yearOfStudy} />
            <Item
              label="Homemade Meal Frequency"
              value={survey.homemadeFrequency}
            />
          </Section>

          <Section title="Eating & Food Preferences">
            <Item label="Meal Types" value={survey.mealTypes?.join(", ")} />
            <Item label="Other Diet" value={survey.otherDiet} />
            <Item label="Meals Per Week" value={survey.mealsPerWeek} />
            <Item label="Meal Preference" value={survey.mealPreference} />
          </Section>

          <Section title="Meal Requirements">
            <Item label="Portion Size" value={survey.portion} />
            <Item label="Plan Type" value={survey.planType} />
            <Item label="Drop-off Point" value={survey.dropoff} />
            <Item label="Other Drop-off" value={survey.otherDropoff} />
            <Item
              label="Delivery Times"
              value={survey.deliveryTimes?.join(", ")}
            />
          </Section>

          <Section title="Pricing & Preferences">
            <Item label="Price Range" value={survey.priceRange} />
            <Item label="Paid Extras" value={survey.paidExtras?.join(", ")} />
            <Item label="Struggles" value={survey.struggles?.join(", ")} />
            <Item label="Other Struggles" value={survey.otherStruggle} />
          </Section>

          <Section title="Experience & Feedback">
            <Item label="Recommendation" value={survey.recommend} />
            <Item
              label="Menu Suggestions"
              value={survey.menuSuggestions}
              multiline
            />
            <Item
              label="Additional Feedback"
              value={survey.feedback}
              multiline
            />
            <Item label="Consent Given" value={survey.consent ? "Yes" : "No"} />
            <Item
              label="Submitted On"
              value={new Date(survey.createdAt).toLocaleString()}
            />
          </Section>
        </div>

        {/* FOOTER */}
        <div style={footer}>
          <button onClick={onClose} style={primaryBtn}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyViewModal;

/* ======================
   STYLES
====================== */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)", // 🔥 light overlay (NOT black)
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modal = {
  background: "#ffffff",
  width: "100%",
  maxWidth: "900px",
  maxHeight: "90vh",
  borderRadius: "10px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  display: "flex",
  flexDirection: "column",
};

const header = {
  padding: "14px 20px",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const closeBtn = {
  background: "none",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
  color: "#6b7280",
};

const content = {
  padding: "20px",
  overflowY: "auto",
};

const footer = {
  padding: "14px 20px",
  borderTop: "1px solid #e5e7eb",
  textAlign: "right",
};

const primaryBtn = {
  background: "#012169",
  color: "#fff",
  border: "none",
  padding: "8px 22px",
  borderRadius: "6px",
  fontWeight: 600,
  cursor: "pointer",
};
