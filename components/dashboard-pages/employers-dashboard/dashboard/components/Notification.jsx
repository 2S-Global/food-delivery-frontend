const Notification = () => {
  const notifications = [
    {
      id: 1,
      name: "Henry Wilson",
      job: "Product Designer",
      status: "default",
    },
    {
      id: 2,
      name: "Raul Costa",
      job: "Product Manager, Risk",
      status: "success",
    },
    {
      id: 3,
      name: "Jack Milk",
      job: "Technical Architect",
      status: "default",
    },
    {
      id: 4,
      name: "Michel Arian",
      job: "Software Engineer",
      status: "success",
    },
    {
      id: 5,
      name: "Wade Warren",
      job: "Web Developer",
      status: "default",
    },
    {
      id: 6,
      name: "Michel Arian",
      job: "Software Engineer",
      status: "success",
    },
  ];

  // Split notifications into 2 halves for the 2 columns
  const middleIndex = Math.ceil(notifications.length / 2);
  const firstColumn = notifications.slice(0, middleIndex);
  const secondColumn = notifications.slice(middleIndex);

  return (
    <div className="row">
      {/* Left Column */}
      <div className="col-6 ">
        <ul className="notification-list">
          {firstColumn.map((note) => (
            <li
              key={note.id}
              className={note.status === "success" ? "success" : ""}
            >
              <span className="icon flaticon-briefcase"></span>
              <strong>{note.name}</strong> applied for a job
              <span className="colored"> {note.job}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Column */}
      <div className="col-6 border-start">
        <ul className="notification-list ps-3">
          {secondColumn.map((note) => (
            <li
              key={note.id}
              className={note.status === "success" ? "success" : ""}
            >
              <span className="icon flaticon-briefcase"></span>
              <strong>{note.name}</strong> applied for a job
              <span className="colored"> {note.job}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notification;
