import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";

const Booking = (props) => {
  const {name, _id, email, serviceName, servicePrice} = props.booking;
  const [loggedInUser] = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4040/booking/" + _id)
      .then((res) => res.json())
      .then((data) => console.log(data[0]));
  }, [_id]);

  return (
    <>
      {loggedInUser.email === email && (
        <div className="col-md-4 service-card">
          <p>Booked Service: {serviceName}</p>
          <p>Service Price: {servicePrice}</p>
          <p>Booking Author Name: {name}</p>
          <p>Booking Author Email: {email}</p>
          <button className="btn btn-secondary">Pending Order</button>
        </div>
      )}
    </>
  );
};

export default Booking;
