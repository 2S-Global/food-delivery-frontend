const Notification = () => {
  return (
    <ul className="notification-list">
      {/* like this to all */}
      <li>
        <span className="icon flaticon-briefcase"></span>
        <strong>Google</strong> has an opening for
        <span className="colored"> Product Designer</span>
      </li>

      {/* End li */}

      <li className="success">
        <span className="icon flaticon-briefcase"></span>
        <strong>Facebook</strong> has an opening for
        <span className="colored"> Product Manager</span>
      </li>
      {/* End li */}

      <li>
        <span className="icon flaticon-briefcase"></span>
        <strong>Google</strong> has an opening for
        <span className="colored"> Technical Architect</span>
      </li>
      {/* End li */}

      <li className="success">
        <span className="icon flaticon-briefcase"></span>
        <strong>Amazon</strong> has an opening for
        <span className="colored"> Software Engineer</span>
      </li>
      {/* End li */}
      <li>
        <span className="icon flaticon-briefcase"></span>
        <strong>Apple</strong> has an opening for
        <span className="colored"> UX/UI Designer</span>
      </li>
    </ul>
  );
};

export default Notification;
