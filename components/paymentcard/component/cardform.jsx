import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentForm = () => {
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3">Input Your Card Details</h4>

        <div className="mb-3">
          <input
            type="text"
            name="name"
            placeholder="Card Holder Name"
            value={cardDetails.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="number"
            placeholder="Card Number"
            value={cardDetails.number}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="expiry"
              placeholder="Expiry Date"
              value={cardDetails.expiry}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              value={cardDetails.cvv}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button className="btn btn-primary">Pay Now (INR 0)</button>
          <button className="btn btn-secondary">Back</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
