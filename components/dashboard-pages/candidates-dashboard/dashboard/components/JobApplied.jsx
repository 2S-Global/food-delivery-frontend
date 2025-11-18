import Link from "next/link";
import recentJobApplied from "../../../../../data/job-featured";
import Image from "next/image";

const JobApplied = () => {
  return (
    <>
      <>
        {recentJobApplied.slice(0, 0).length === 0 && (
          <div className="d-flex justify-content-center align-items-center">
            <div className="inner-box bg-white shadow rounded-4 p-4 text-center border border-light">
              <div className="content">
                <h4 className="h5 fw-semibold text-dark mb-2">No Jobs Found</h4>
              </div>
            </div>
          </div>
        )}
      </>

      {recentJobApplied.slice(0, 0).map((item) => (
        <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <Image
                  width={50}
                  height={49}
                  src={item.logo}
                  alt="item brand"
                />
              </span>
              <h4>
                <Link href={`/job-details/${item.id}`}>{item.jobTitle}</Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {item.company}
                </li>
                {/* compnay info */}
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.location}
                </li>
                {/* location info */}
                <li>
                  <span className="icon flaticon-clock-3"></span> {item.time}
                </li>
                {/* time info */}
                <li>
                  <span className="icon flaticon-money"></span> {item.salary}
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                {item.jobType.map((val, i) => (
                  <li key={i} className={`${val.styleClass}`}>
                    {val.type}
                  </li>
                ))}
              </ul>
              {/* End .job-other-info */}

              <button className="bookmark-btn">
                <span className="flaticon-bookmark"></span>
              </button>
            </div>
          </div>
        </div>
        // End job-block
      ))}
    </>
  );
};

export default JobApplied;
