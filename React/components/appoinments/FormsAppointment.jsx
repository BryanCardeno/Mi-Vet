import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import FormsVetPanel from "./FormsVetPanel";
import {
  lookUpAppointmentTypes,
  addAppointment,
  sendEmailRequest,
  updateAppointment,
} from "services/appointmentService";
import FormsMain from "./FormsMain";
import { formValidation } from "schemas/appointmentSchema";
import "./appointment.css";
import { DEFAULT_FORM, DEFAULT_VET_PROFILE } from "./appointmentDefaultStates";
import FormsHeader from "./FormsHeader";
import FormsSelectedVet from "./FormsSelectedVet";
import locationService from "../../services/locationService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  filterAvailability,
  mapTimeAvailability,
} from "./scheduleAvailabilityTemp"; // hard coded schedule availability for vet profiles.
import vetProfilesService from "components/vetprofile/vetProfilesService";
import { formatDateInput } from "utils/dateFormater";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../toastr/build/toastr.css";

const MySwal = withReactContent(
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-outline-primary",
    },
    buttonsStyling: false,
  })
);

const _logger = debug.extend("Appointments/FormsAppointment");

const FormsAppointment = (props) => {
  const location = useLocation();

  const [appointmentTypes, setAppointmentTypes] = useState({
    list: [],
    components: [],
  });
  const [selectedVet, setSelectedVet] = useState(DEFAULT_VET_PROFILE);
  const [clientLocations, setClientLocations] = useState([]);
  const [showError, setShowError] = useState(false);
  const [availabilityChecker, setAvailabilityChecker] = useState({
    dayOfWeek: 0,
    availability: {},
    availabilityList: [],
  });

  const formik = useFormik({
    initialValues: DEFAULT_FORM,
    validationSchema: formValidation,
    onSubmit: (values) => {
      const splitTime = values.time.split(":");
      let updateTime = new Date(formik.values.appointmentStart).setUTCHours(
        splitTime[0],
        splitTime[1]
      );
      let endTime = new Date(formik.values.appointmentStart).setUTCHours(
        splitTime[0],
        splitTime[1] + 30 // adds 30 minutes
      );

      updateTime = new Date(updateTime).toISOString();
      values.appointmentStart = updateTime;
      endTime = new Date(endTime).toISOString();
      values.appointmentEnd = endTime;
      if (formik.values.id) {
        updateAppointment(values)
          .then(updateAppointOnSuccess)
          .catch(updateAppointOnError);
      } else {
        addAppointment(values)
          .then(addAppointmentOnSuccess)
          .catch(addAppointmentOnError);
      }

      formik.resetForm();
      setShowError(() => false);
      setSelectedVet(() => DEFAULT_VET_PROFILE);

      if (props.currentUser.roles.includes("Vet")) {
        formik.setFieldValue("vetProfileId", props.currentUser.id);
      } else {
        formik.setFieldValue("clientId", props.currentUser.id);
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    _logger("USE LOCATION", location.state);

    lookUpAppointmentTypes(["AppointmentTypes"])
      .then(lookUpAppointmentTypesOnSuccess)
      .catch(lookUpAppointmentTypesOnError);

    if (location?.state?.type === "APPOINTMENT_INFO") {
      const { data } = location.state;
      _logger("DATA FROM STATE", data);

      let time = data.appointmentStart.split("T")[1];
      time = time.substring(0, time.lastIndexOf(":"));
      time = time.split(":");
      time[0] = Number(time[0]);
      time = time.join(":");

      _logger(formatDateInput(data.appointmentStart));

      vetProfilesService
        .getById(data.vet.id)
        .then(vetGetByIdOnSuccess)
        .catch(vetGetByIdOnError);

      formik.setValues({
        id: data.id,
        vetProfileId: data.vet.id,
        notes: data.notes,
        appointmentTypeId: data.appointmentType.id,
        isConfirmed: data.isConfirmed,
        locationId: data.location.id,
        statusTypeId: data.statusType.id,
        appointmentStart: formatDateInput(data.appointmentStart),
        time: time,
        clientId: data.client.id,
        patientId: data.patient.id,
      });
    }

    if (props?.currentUser?.roles.includes("User")) {
      formik.setFieldValue("clientId", props.currentUser.id);

      locationService
        .getByCreatedBy({
          id: props.currentUser.id,
          pageIndex: 0,
          pageSize: 100,
        })
        .then(getClientLocationsOnSuccess)
        .catch(getClientLocationsOnError);
    }
  }, []);

  // maps select options for time depending on the day of the week.
  // sets time field value to empty
  useEffect(() => {
    const newDate = formik.values.appointmentStart;

    setAvailabilityChecker((prevState) => {
      const newChecker = { ...prevState };
      newChecker.dayOfWeek = new Date(newDate).getUTCDay();
      let mapTime = filterAvailability(newChecker.dayOfWeek);
      if (mapTime) {
        newChecker.availabilityList = mapTime.map(mapAvailability);
      } else {
        newChecker.availabilityList = [];
      }

      newChecker.availability = mapTime;

      return newChecker;
    });
  }, [formik.values.appointmentStart]);

  const vetGetByIdOnSuccess = (response) => {
    _logger(response);
    setSelectedVet(() => response.item);
    _logger(selectedVet);
  };

  const vetGetByIdOnError = (error) => {
    toast.error("Failed to get Vet");
    _logger(error);
  };

  const addAppointmentOnSuccess = (response) => {
    _logger("ADDED SUCCESSFULLY", response);

    const payload = {
      appointmentStart: formik.values.appointmentStart,
      vetEmail: selectedVet.businessEmail,
      clientEmail: props.currentUser.email,
    };

    sendEmailRequest(payload)
      .then(
        MySwal.fire({
          title: "Appointment Request Sent",
          icon: "success",
        })
      )
      .catch((error) => _logger(error));
  };

  const addAppointmentOnError = (error) => {
    toast.error(`Failed to add appointment... ${error}`);
    _logger(error);
  };

  const updateAppointOnSuccess = () => {
    MySwal.fire({
      title: "Update Appointment Successful",
      icon: "success",
    });
  };

  const updateAppointOnError = (error) => {
    _logger(error);
  };

  const getClientLocationsOnSuccess = (response) => {
    setClientLocations(() => response.item.pagedItems);
  };

  const getClientLocationsOnError = (error) => {
    _logger(error);
  };

  const mapAvailability = (avail) => {
    const time = mapTimeAvailability(avail.startTime, avail.endTime);
    let mapTime = time.map(mapTimeSelects);

    return mapTime;
  };

  const mapTimeSelects = (time) => {
    let newTime = time.split(":");

    let isPM = Number(newTime[0]) >= 12;
    let amOrPm = isPM ? "P.M." : "A.M.";

    if (Number(newTime[0]) === 0) {
      newTime[0] = 12;
    }

    if (Number(newTime[0] > 12)) {
      newTime[0] = newTime[0] - 12;
    }

    newTime = `${newTime.join(":")} ${amOrPm}`;

    return <option value={time}>{newTime}</option>;
  };

  const lookUpAppointmentTypesOnSuccess = (response) => {
    setAppointmentTypes((prevState) => {
      const newTypes = { ...prevState };
      newTypes.list = response.item.appointmentTypes;
      newTypes.components = newTypes.list.map(mapAppointmentTypes);
      return newTypes;
    });
  };

  const lookUpAppointmentTypesOnError = (error) => {
    _logger(error);
  };

  const mapAppointmentTypes = (types) => {
    return (
      <option key={types.name} value={types.id}>
        {types.name}
      </option>
    );
  };

  const renderError = (property) => {
    return <span className="text-danger"> {formik.errors[property]}</span>;
  };

  return (
    <React.Fragment>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnHover
        pauseOnFocusLoss
        theme="colored"
      />
      <div className="container-xxl">
        <FormsHeader />
        <div className="container container-fluid appointment-form">
          <div className="row">
            {!formik.values.isConfirmed && (
              <FormsVetPanel
                isErrorVisible={showError}
                formik={formik}
                selectedVet={selectedVet}
                setSelectedVet={setSelectedVet}
                renderError={renderError}
              />
            )}

            <div
              className={`col-12 mt-3 ms-3 ${
                !formik.values.isConfirmed && "col-md-10 col-lg-7"
              }`}
            >
              {selectedVet?.id > 0 && (
                <FormsSelectedVet
                  selectedVet={selectedVet}
                  formik={formik}
                  availability={availabilityChecker}
                />
              )}
              <FormsMain
                formik={formik}
                availabilityChecker={availabilityChecker}
                isErrorVisible={showError}
                renderError={renderError}
                selectedVet={selectedVet}
                clientLocations={clientLocations}
                setClientLocations={setClientLocations}
                appointmentTypes={appointmentTypes}
                setShowError={setShowError}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

FormsAppointment.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
    email: PropTypes.string.isRequired,
  }),
};

export default FormsAppointment;
