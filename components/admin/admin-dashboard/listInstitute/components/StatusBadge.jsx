const statusBadgeMap = {
    PLACED: {
        label: "Placed",
        className: "bg-secondary"
    },
    CONFIRMED: {
        label: "Confirmed",
        className: "bg-primary"
    },
    PREPARING: {
        label: "Preparing",
        className: "bg-info text-dark"
    },
    OUT_FOR_DELIVERY: {
        label: "Out for Delivery",
        className: "bg-warning text-dark"
    },
    DELIVERED: {
        label: "Delivered",
        className: "bg-success"
    },
    CANCELLED: {
        label: "Cancelled",
        className: "bg-danger"
    }
};

const StatusBadge = ({ status }) => {

    const config = statusBadgeMap[status];

    if (!config) return status;

    return (
        <span className={`badge rounded-pill ${config.className}`}>
            {config.label}
        </span>
    );
};

export default StatusBadge;