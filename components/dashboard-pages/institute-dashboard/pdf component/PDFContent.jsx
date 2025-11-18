import Header from "./Header";
import Footer from "./Footer";
import WidgetContentBox from "@/components/dashboard-pages/employers-dashboard/list-verified-employee/details/components/WidgetContentBox";

const PDFContent = () => {
  return (
    <div style={{ padding: "20px", backgroundColor: "#fff", width: "100%" }}>
      <Header />
      <WidgetContentBox />
      <Footer />
    </div>
  );
};

export default PDFContent;
