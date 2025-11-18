const LoginWithSocial = () => {
  return (
    <div className="btn-box row">
      <div className="col-lg-6 col-md-12">
        {/* 
        <a href="#" className="theme-btn social-btn-two facebook-btn"> */}
        <div className="theme-btn social-btn-two facebook-btn">
          <i className="fab fa-facebook-f"></i> Log In via Facebook
        </div>
        {/*      
        </a> */}
      </div>
      <div className="col-lg-6 col-md-12">
        <div className="theme-btn social-btn-two google-btn">
          <i className="fab fa-google"></i> Log In via Gmail
        </div>
        {/*  <a href="#" className="theme-btn social-btn-two google-btn">
          <i className="fab fa-google"></i> Log In via Gmail
        </a> */}
      </div>
    </div>
  );
};

export default LoginWithSocial;
