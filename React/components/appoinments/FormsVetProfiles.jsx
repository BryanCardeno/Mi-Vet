import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Phone, Mail } from "react-feather";
import "./appointment.css";
import { vetProfileProp } from "./appointmentsCommonPropTypes";

import debug from "sabio-debug";

const _logger = debug.extend("Appointments/VetProfiles");

const FormsVetProfiles = (props) => {
  const { vetProfile } = props;

  const localClicker = () => {
    props.setSelectedVet(vetProfile);
    props.setVetIdField("vetProfileId", vetProfile.id);

    props.formik.setFieldValue("locationId", 0, true);
    props.formik.setFieldTouched("locationId", true, true);
    props.formik.setFieldError("locationId");

    _logger("Selected Vet =>", vetProfile);
  };

  return (
    <div
      className={`card border-0 mb-1 py-2 col-xl-12 col-lg-12 col-md-12 col-sm-6 col-xs-12 ${
        props.selectedVet.id === vetProfile.id && "bg-dark bg-opacity-10"
      }`}
    >
      <Link to={`/vetprofiles/${vetProfile.id}`} target="_blank">
        <h6>
          <u>
            Dr.{" "}
            {`${vetProfile?.createdBy?.firstName} ${vetProfile?.createdBy?.lastName}`}
          </u>
        </h6>
      </Link>
      <p className="fs-6 fw-semi-bold mb-1">
        <Phone className="appointment-vet-info-icon" />
        {vetProfile.phone}
      </p>
      <p className="fs-6">
        <Mail className="appointment-vet-info-icon" />
        {vetProfile.businessEmail}
      </p>
      <button
        type="button"
        className="btn btn-outline-primary w-50"
        onClick={localClicker}
      >
        Select
      </button>
    </div>
  );
};

FormsVetProfiles.propTypes = {
  vetProfile: vetProfileProp,
  selectedVet: vetProfileProp,
  setSelectedVet: PropTypes.func.isRequired,
  setVetIdField: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    setFieldError: PropTypes.func,
    setFieldTouched: PropTypes.func,
    validateField: PropTypes.func,
  }),
};

export default React.memo(FormsVetProfiles);
