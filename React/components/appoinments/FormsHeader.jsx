import React from "react";
import { Link } from "react-router-dom";

const FormsHeader = () => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="border-bottom pb-4 mb-4 d-lg-flex justify-content-between">
            <div className="m-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold"> Request an Appointment</h1>
            </div>
            <div className="m-3 mb-md-0">
              <Link to="/appointments">Go Back</Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default FormsHeader;
