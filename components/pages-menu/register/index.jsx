import Register2 from "../../common/form/register/Register2";
import MobileMenu from "../../header/MobileMenu";
import Header from "./Header";

const index = () => {
  return (
    <>
      {/* <Header />
      

      <MobileMenu /> */}
      <div
        style={{
          backgroundColor: "#EBE8E2",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="flex-grow"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 0 25px",
            overflow: "auto",
          }}
        >
          {/* <!-- Login Form --> */}
          <div
            className="login-form default-form"
            style={{ backgroundColor: "#FFFFFF", maxWidth: "600px" }}
          >
            <Register2 />
          </div>
          {/* <!--End Login Form --> */}
        </div>
      </div>
      {/* <!-- End Info Section --> */}
    </>
  );
};

export default index;
