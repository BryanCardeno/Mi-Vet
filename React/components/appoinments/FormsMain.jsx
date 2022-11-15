import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { vetProfileProp } from "./appointmentsCommonPropTypes";
import { NOTES_CHAR_COUNT } from "schemas/appointmentSchema";
import LocationForm from "components/location/LocationForm";
import { getUserHorses } from "../../services/horseProfilesService";

import debug from "sabio-debug";
const _logger = debug.extend("Appointments/MainForm");

const FormsMain = (props) => {
  const [notesLength, setNotesLength] = useState(NOTES_CHAR_COUNT);
  const [patientList, setPatientList] = useState([]);

  const { formik } = props;

  useEffect(() => {
    getUserHorses(0, 100)
      .then(getPatientListOnSuccess)
      .catch(getPatientOnError);
  }, []);

  const countNotesChar = () => {
    setNotesLength(() => {
      return NOTES_CHAR_COUNT - formik.values.notes.length;
    });
  };

  const submitOnClick = () => {
    props.setShowError(() => true);
  };

  const getLocationId = useCallback((newId, data) => {
    props.setClientLocations((prevState) => {
      const newLocations = [...prevState];
      newLocations.push({ ...data, id: newId });
      return newLocations;
    });

    formik.setFieldValue("locationId", 0);
  });

  const getPatientListOnSuccess = (response) => {
    _logger(response);
    setPatientList(() => {
      const newState = response.item.pagedItems.map(mapPatientList);
      return newState;
    });
  };

  const mapPatientList = (patient) => {
    return <option value={patient.id}>{patient.name}</option>;
  };

  const getPatientOnError = (error) => {
    _logger(error);
  };

  const mapClientLocations = (loc) => {
    return (
      <option
        key={loc.id}
        value={loc.id}
      >{`${loc.lineOne} ${loc.city} ${loc.zip}`}</option>
    );
  };

  return (
    <React.Fragment>
      <div className="row card shadow p-3">
        <form onSubmit={props.formik.handleSubmit}>
          <div className="form-group mb-3">
            <div className="row row-cols-2">
              <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                <label
                  htmlFor="appointmentStart"
                  className="form-label required"
                >
                  Select Date
                </label>
                {props.isErrorVisible &&
                  formik?.errors?.appointmentStart &&
                  props.renderError("appointmentStart")}
                <input
                  disabled={formik.values.isConfirmed && true}
                  type="date"
                  name="appointmentStart"
                  className="form-control"
                  onChange={formik.handleChange}
                  value={formik.values.appointmentStart}
                />
              </div>
              <div className="col-12 col-lg-6">
                <label
                  htmlFor="appointmentTime"
                  className="form-label required"
                >
                  Select Time
                </label>
                {props.isErrorVisible &&
                  formik?.errors?.time &&
                  props.renderError("time")}
                <select
                  disabled={formik.values.isConfirmed && true}
                  value={formik.values.time}
                  className="form-select"
                  name="time"
                  onChange={formik.handleChange}
                >
                  <option value="">Select a time</option>
                  {props.availabilityChecker.availabilityList}
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="row">
              <div className="col">
                <label htmlFor="location-Id" className="form-label required">
                  Select a location
                </label>
                {props.isErrorVisible &&
                  formik?.errors?.locationId &&
                  props.renderError("locationId")}
                <select
                  className="form-select mb-3"
                  name="locationId"
                  value={formik.values.locationId}
                  onChange={formik.handleChange}
                >
                  <option value="">Select Location</option>
                  {props.selectedVet?.location?.id && (
                    <option value={props.selectedVet.location.id}>
                      Use Vet Address
                    </option>
                  )}
                  {props.clientLocations.map(mapClientLocations)}
                  <option value={-1}>Add a new address</option>
                </select>
              </div>
            </div>
          </div>

          {formik.values.locationId === "-1" && (
            <LocationForm
              isLatLongHidden={true}
              hasFormSubmit={true}
              returnLocationId={getLocationId}
            />
          )}

          <div className="form-group mb-3">
            <div className="row">
              <div className="col">
                <label
                  htmlFor="appointmentTypeId"
                  className="form-label required"
                >
                  Appointment Type
                </label>
                {props.isErrorVisible &&
                  formik?.errors?.appointmentTypeId &&
                  props.renderError("appointmentTypeId")}
                <select
                  className="form-select"
                  name="appointmentTypeId"
                  onChange={formik.handleChange}
                  value={formik.values.appointmentTypeId}
                >
                  <option value="">Select an option</option>
                  {props.appointmentTypes.components}
                </select>
              </div>
            </div>
          </div>

          <div className="form-group mb-3">
            <div className="row">
              <div className="col">
                <label
                  htmlFor="appointmentTypeId"
                  className="form-label required"
                >
                  Patient
                </label>
                {props.isErrorVisible &&
                  formik?.errors?.appointmentTypeId &&
                  props.renderError("patientId")}
                <select
                  className="form-select"
                  name="patientId"
                  onChange={formik.handleChange}
                  value={formik.values.patientId}
                >
                  <option value="">Select an option</option>
                  {patientList}
                </select>
              </div>
            </div>
          </div>

          <div className="form-group mb-3">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="d-lg-flex justify-content-between align-items-center">
                  <div className="d-flex">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                  </div>
                  <div className="d-flex">
                    <div className="fs-6 text-muted form-label">
                      Characters: {notesLength}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <textarea
              maxLength={NOTES_CHAR_COUNT}
              className="form-control"
              name="notes"
              onChange={formik.handleChange}
              onKeyUp={countNotesChar}
              rows="5"
              value={formik.values.notes}
            />
          </div>

          <button
            type="submit"
            className="btn btn-outline-primary w-100 mb-2"
            onClick={submitOnClick}
          >
            Submit
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

FormsMain.propTypes = {
  formik: PropTypes.shape({
    handleSubmit: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    errors: PropTypes.shape({
      time: PropTypes.string,
      appointmentStart: PropTypes.string,
      locationId: PropTypes.string,
      appointmentTypeId: PropTypes.string,
      patientId: PropTypes.string,
    }),
    values: PropTypes.shape({
      appointmentStart: PropTypes.string,
      time: PropTypes.string,
      locationId: PropTypes.string,
      appointmentTypeId: PropTypes.number,
      notes: PropTypes.string,
      id: PropTypes.number,
      isConfirmed: PropTypes.bool,
      patientId: PropTypes.number,
    }),
  }),
  availabilityChecker: PropTypes.shape({
    availabilityList: PropTypes.arrayOf(Object),
  }),
  appointmentTypes: PropTypes.shape({
    list: PropTypes.arrayOf(Object),
    components: PropTypes.arrayOf(Object),
  }),
  isErrorVisible: PropTypes.bool.isRequired,
  renderError: PropTypes.func.isRequired,
  setShowError: PropTypes.func.isRequired,
  selectedVet: vetProfileProp,
  clientLocations: PropTypes.arrayOf(Object),
  setClientLocations: PropTypes.func,
};

export default FormsMain;
