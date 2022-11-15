import React from "react";
import PropTypes from "prop-types";
import { Home, Phone, Mail } from "react-feather";
import { vetProfileProp } from "./appointmentsCommonPropTypes";

const FormsSelectedVet = (props) => {
  const { availability } = props.availability;

  const { location } = props.selectedVet;

  return (
    <React.Fragment>
      <div className="row card p-3 mb-3 shadow">
        <div className="row row-cols-2">
          <div className="col-3">
            <img
              src={props.selectedVet.createdBy.userImage}
              className="rounded-circle"
              id="appointment-selected-vet-photo"
              alt="..."
            />
          </div>
          <div className="col-9">
            <div className="form-group mb-3">
              <h4>{`Dr. ${props.selectedVet.createdBy.firstName} ${props.selectedVet.createdBy.lastName}`}</h4>
              <span>
                <Phone className="appointment-selected-vet-icons text-success" />
                {`Phone Number: ${props.selectedVet.phone}`}
              </span>
              <br />
              <span>
                <Phone className="appointment-selected-vet-icons text-danger" />
                {`Emergency Line: ${props.selectedVet.emergencyLine}`}
              </span>
              <br />
              <span>
                <Mail className="appointment-selected-vet-icons" />
                {`E-mail: ${props.selectedVet.businessEmail}`}
              </span>
              <br />
              <span>
                <Home className="appointment-selected-vet-icons" />
                {`${location?.lineOne} ${location?.city}, ${location?.state?.name} ${location?.zip} `}
              </span>
              <div className="row form-group">
                <label htmlFor="schedAvailability" className="form-label">
                  Availability:
                </label>
                <input
                  type="text"
                  className="form-control text-muted ms-2"
                  readOnly
                  placeholder="Displays vet availability schedule when date is selected"
                  value={
                    availability && availability[0]
                      ? `${availability[0].startTime} to ${availability[0].endTime}`
                      : "No availability for this day"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

FormsSelectedVet.propTypes = {
  selectedVet: vetProfileProp,
  formik: PropTypes.shape({
    values: PropTypes.shape({
      appointmentStart: PropTypes.string.isRequired,
    }),
  }),
  availability: PropTypes.arrayOf(Object),
};

export default React.memo(FormsSelectedVet);
