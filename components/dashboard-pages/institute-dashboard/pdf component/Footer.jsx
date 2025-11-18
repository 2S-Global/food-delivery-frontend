const Footer = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px",
        fontSize: "12px",
        borderTop: "1px solid #ddd",
      }}
    >
      This is an auto-generated PDF. | {new Date().toLocaleDateString()}
    </div>
  );
};

export default Footer;
