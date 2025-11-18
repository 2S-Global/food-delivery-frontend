import Image from "next/image";

const users = [
  {
    name: "Darlene Robertson",
    image: "candidate-1.png",
    unread: 0,
    role: "Team Lead",
    active: true,
  },
  {
    name: "Jane Cooper",
    image: "candidate-2.png",
    unread: 2,
    role: "UI Designer",
    active: false,
  },
  {
    name: "Arlene McCoy",
    image: "candidate-3.png",
    unread: 2,
    role: "Backend Dev",
    active: true,
  },
  {
    name: "Albert Flores",
    image: "candidate-4.png",
    unread: 0,
    role: "Project Manager",
    active: true,
  },
  {
    name: "Williamson",
    image: "candidate-5.png",
    unread: 2,
    role: "QA Engineer",
    active: false,
  },
  {
    name: "Kristin Watson",
    image: "candidate-6.png",
    unread: 0,
    role: "Data Analyst",
    active: false,
  },
  {
    name: "Annette Black",
    image: "candidate-7.png",
    unread: 0,
    role: "Product Owner",
    active: true,
  },
  {
    name: "Jacob Jones",
    image: "candidate-8.png",
    unread: 0,
    role: "Mobile Dev",
    active: false,
  },
];

const ChatboxContactList = () => {
  return (
    <>
      <ul className="list-unstyled mb-0">
        {users.map((user, idx) => (
          <li className="mb-2" key={idx}>
            <a
              href="#"
              className="text-decoration-none text-dark px-2 py-2 d-block rounded hover-bg-light"
            >
              <div className="d-flex align-items-center">
                <div className="avatar-wrapper me-3 position-relative">
                  <Image
                    src={`/images/resource/${user.image}`}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="avatar-img"
                  />
                  <span
                    className={`status-dot position-absolute ${
                      user.active ? "bg-success" : "bg-secondary"
                    }`}
                    title={user.active ? "Active" : "Offline"}
                  ></span>
                </div>

                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-semibold">{user.name}</h6>
                  <small className="text-muted">{user.role}</small>
                </div>

                <div className="text-end">
                  <small className="text-muted d-block">35 mins</small>
                  {user.unread > 0 && (
                    <span className="badge bg-primary rounded-pill mt-1">
                      {user.unread}
                    </span>
                  )}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <style jsx>{`
        ul {
          max-height: 100%;
          overflow-y: auto;
        }

        .hover-bg-light:hover {
          background-color: #f8f9fa;
        }

        h6 {
          font-size: 0.95rem;
        }

        small {
          font-size: 0.8rem;
        }

        .avatar-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
        }

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #fff;
          bottom: 0;
          right: 0;
          transform: translate(25%, 25%);
        }
      `}</style>
    </>
  );
};

export default ChatboxContactList;
