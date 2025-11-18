const TopCardBlock2 = () => {
  const cardContent = [
    {
      id: 1,
      icon: "flaticon-briefcase",
      countNumber: "18",
      metaName: "Current Employees",
      uiClass: "ui-blue",
    },
    {
      id: 2,
      icon: "la-file-invoice",
      countNumber: "106",
      metaName: "Total Employees Requested",
      uiClass: "ui-yellow",
    },
    {
      id: 3,
      icon: "la-comment-o",
      countNumber: "86",
      metaName: "Total Employees Accepted",
      uiClass: "ui-green",
    },
    {
      id: 4,
      icon: "la-bookmark-o",
      countNumber: "20",
      metaName: "Total Employees Rejected",
      uiClass: "ui-red",
    },
  ];

  return (
    <>
      {cardContent.map((item) => (
        <div
          className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className={`ui-item ${item.uiClass}`}>
            <div className="left">
              <i className={`icon la ${item.icon}`}></i>
            </div>
            <div className="right">
              <h4>{item.countNumber}</h4>
              <p>{item.metaName}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopCardBlock2;
