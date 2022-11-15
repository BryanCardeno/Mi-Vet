import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import {
  getByClientId,
  getByVetId,
  deleteAppointment,
  updateAppointment,
} from "services/appointmentService";
import Appointment from "./Appointment";
import debug from "sabio-debug";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AppointmentsTableHeader from "./AppointmentsTableHeader";
import AppointmentsSubHeader from "./AppointmentsSubHeader";
import AppointmentsHeader from "./AppointmentsHeader";
import { formatDateTime } from "utils/dateFormater";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const MySwal = withReactContent(
  Swal.mixin({
    customClass: {
      confirmButton: "btn btn-outline-danger m-3",
      cancelButton: "btn btn-outline-warning",
    },
    buttonsStyling: false,
  })
);

const _logger = debug.extend("Appointments");

const UserAppointment = (props) => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState({
    list: [],
    components: [],
  });
  const [modalView, setModalView] = useState({ isOpen: false, data: {} });
  const [pageController, setPageController] = useState({
    current: 1,
    pageSize: 5,
    total: 10,
  });
  const [calendarAppointments, setCalendarAppointments] = useState([]);

  const isVet = props.currentUser.roles.includes("Vet") ? true : false;
  const isClient = props.currentUser.roles.includes("User") ? true : false;
  const { location: modalLocation } = modalView.data;

  useEffect(() => {
    if (isVet) {
      getByVetId(props.currentUser.id)
        .then(getByVetOnSuccess)
        .catch(getByVetOnError);
    } else {
      getByClientId(
        props.currentUser.id,
        pageController.current - 1,
        pageController.pageSize
      )
        .then(getByClientOnSuccess)
        .catch(getByClientOnError);
    }
  }, [pageController.current]);

  const getByVetOnSuccess = (response) => {
    setAppointments((prevState) => {
      const newList = { ...prevState };
      newList.list = response.item.pagedItems;
      newList.components = newList.list.map(mapAppointments);
      return newList;
    });

    setCalendarAppointments(() => {
      const newState = response.item.pagedItems.map(mapCalendarAppointments);
      return newState;
    });
  };

  const getByVetOnError = (error) => {
    _logger(error);
  };

  const getByClientOnSuccess = (response) => {
    setAppointments((prevState) => {
      const newList = { ...prevState };
      newList.list = response.item.pagedItems;
      newList.components = newList.list.map(mapAppointments);
      return newList;
    });

    setPageController((prevState) => {
      const newPage = { ...prevState };
      newPage.total = response.item.totalCount;
      return newPage;
    });
  };

  const getByClientOnError = (error) => {
    _logger(error);
  };

  const mapAppointments = (data) => {
    return (
      <Appointment
        key={data.id}
        appointment={data}
        dropDownEvents={dropDownEvents}
      />
    );
  };

  const mapCalendarAppointments = (data) => {
    const newObj = {
      id: data.id,
      title: `${data.client.firstName} ${data.client.lastName}`,
      start: new Date(data.appointmentStart),
      extendedProps: data,
    };
    if (data.isConfirmed) {
      newObj.classNames = ["bg-success border-success text-white"];
    } else {
      newObj.classNames = [
        "bg-warning border-warning bg-opacity-75 text-white",
      ];
    }
    return newObj;
  };

  const calendarAppointmentOnClick = (info) => {
    const data = info.event.extendedProps;
    _logger(data);
    setModalView((prevState) => {
      const newState = { ...prevState };
      newState.isOpen = true;
      newState.data = data;
      return newState;
    });
  };

  const dropDownEvents = useCallback((btn, info) => {
    switch (btn) {
      case "cancel":
        MySwal.fire({
          title: "Would you like to cancel this appointment?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "No",
        }).then((result) => {
          if (result.isConfirmed) {
            const deleteHandler = deleteAppointmentOnSuccess(info.id);
            deleteAppointment(info.id)
              .then(deleteHandler)
              .catch(deleteAppointmentOnError);
          }
        });
        break;

      case "details":
        setModalView((prevState) => {
          const newView = { ...prevState };
          newView.isOpen = true;
          newView.data = info;

          return newView;
        });

        break;

      case "edit":
        const stateToTransport = { type: "APPOINTMENT_INFO", data: info };
        navigate(`${info.id.toString()}/edit`, { state: stateToTransport });
        break;

      default:
        return;
    }
  }, []);

  const deleteAppointmentOnSuccess = (id) => {
    setAppointments((prevState) => {
      const newState = { ...prevState };
      newState.list = newState.list.filter((element) => element.id !== id);
      newState.components = newState.list.map(mapAppointments);
      return newState;
    });

    MySwal.fire("Deleted", "Appointment has been canceled", "success");
  };

  const deleteAppointmentOnError = (error) => {
    _logger(error);
  };

  const modalHandleClose = () => {
    setModalView((prevState) => {
      const newView = { ...prevState };
      newView.isOpen = false;
      return newView;
    });
  };

  const modalHandleEdit = () => {
    const stateToTransport = {
      type: "APPOINTMENT_INFO",
      data: { ...modalView.data },
    };
    navigate(`${modalView.data.id.toString()}/edit`, {
      state: stateToTransport,
    });
  };

  const modalHandleSubmit = () => {
    const { data } = modalView;
    _logger(data);

    const payload = {
      id: data.id,
      isConfirmed: true,
      statusTypeId: data.statusType.id,
      notes: data.notes,
      appointmentTypeId: data.appointmentType.id,
      vetProfileId: data.vet.id,
      locationId: data.location.id,
      appointmentStart: data.appointmentStart,
      appointmentEnd: data.appointmentEnd,
      clientId: data.client.id,
      patientId: data.patient.id,
    };
    _logger(payload);
    updateAppointment(payload)
      .then(confirmAppointmentOnSuccess)
      .catch(confirmAppointmentOnError);
  };

  const confirmAppointmentOnSuccess = () => {
    MySwal.fire({
      title: "Appointment Confirmed",
      icon: "success",
    }).then(
      setModalView((prevState) => {
        const newView = { ...prevState };
        newView.isOpen = false;
        return newView;
      })
    );

    setCalendarAppointments((prevState) => {
      const newCalendar = [...prevState];
      const indexArray = prevState.findIndex(
        (element) => element.id === modalView.data.id
      );
      newCalendar[indexArray].classNames = [
        "bg-success border-success text-white",
      ];

      return newCalendar;
    });
  };

  const confirmAppointmentOnError = (error) => {
    _logger(error);
  };

  const paginateOnChange = (e) => {
    setPageController((prevState) => {
      const newPage = { ...prevState };
      newPage.current = e;
      return newPage;
    });
  };

  const notesOnChange = (e, data) => {
    _logger(e);
    setModalView((prevState) => {
      const newData = { ...prevState };
      newData.data.notes = data.getData();
      return newData;
    });
  };

  const mapModalMedications = () => {
    const { patient } = modalView.data;
    if (patient?.id && patient?.horseMedications) {
      return modalView.data.patient.horseMedications
        .map((element) => element.name)
        .join(", ");
    } else {
      return "N/A";
    }
  };

  const patientOnClick = () => {
    const { ...patient } = modalView.data;
    _logger(patient);
    const stateToTransport = { type: "HORSE-OBJ", payload: patient };
    navigate(`/owner/patient/${patient.id}/view`, { state: stateToTransport });
  };

  return (
    <React.Fragment>
      <div className="container-xxxl">
        <AppointmentsHeader />

        {isVet && (
          <div className="container container-fluid">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="dayGridMonth"
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              events={calendarAppointments}
              eventClick={calendarAppointmentOnClick}
            />
          </div>
        )}

        {!isVet && (
          <AppointmentsSubHeader
            setAppointments={setAppointments}
            isVet={isVet}
          />
        )}

        {isClient && (
          <div>
            <div className="row px-0 px-lg-4">
              <div className="card py-3 px-4">
                <table className="table table-sm table-hover align-middle">
                  <AppointmentsTableHeader />
                  <tbody>{appointments.components}</tbody>
                </table>
                <Pagination
                  onChange={paginateOnChange}
                  current={pageController.current}
                  total={pageController.total}
                  pageSize={pageController.pageSize}
                />
              </div>
            </div>
          </div>
        )}

        <Modal
          show={modalView.isOpen}
          onHide={modalHandleClose}
          size="xl"
          className="w-100"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {formatDateTime(modalView.data.appointmentStart)}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-2">
            <div className="row row-cols-2 border-bottom mb-3">
              <div className="col-12 col-lg-6 border-bottom border-bottom-lg-0">
                <div className="row">
                  <div className="col-12 col-md-3 my-auto">
                    <label htmlFor="modal-status" className="form-label">
                      Status:
                    </label>
                  </div>
                  <div className="col-12 col-md-9 pb-2">
                    <input
                      type="text"
                      className="form-control border-0"
                      value={
                        modalView?.data?.isConfirmed ? "Confirmed" : "Pending"
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                <div className="row">
                  <div className="col-12 col-md-3 my-auto">
                    <label htmlFor="modal-user" className="form-label mb-0">
                      {isVet ? "Client:" : "Veterinarian:"}
                    </label>
                  </div>

                  <div className="col-12 col-md-9">
                    <input
                      type="text"
                      className="form-control border-0"
                      value={
                        isVet
                          ? `${modalView?.data?.client?.firstName} ${modalView?.data?.client?.lastName}`
                          : `Dr. ${modalView?.data?.vet?.createdBy?.firstName} ${modalView?.data?.vet?.createdBy?.lastName}`
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row row-cols-2 border-bottom mb-3">
              <div className="col-12 col-lg-6 border-bottom border-bottom-lg-0">
                <div className="row">
                  <div className="col-12 col-md-3 my-auto">
                    <label
                      htmlFor="modal-appointment-type"
                      className="form-label"
                    >
                      Appointment Type:
                    </label>
                  </div>
                  <div className="col-12 col-md-9 pb-2">
                    <input
                      type="text"
                      className="form-control border-0"
                      value={modalView?.data?.appointmentType?.name}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                <div className="row">
                  <div className="col-12 col-md-3 my-auto">
                    <label htmlFor="modal-location" className="form-label">
                      Location:
                    </label>
                  </div>
                  <div className="col-12 col-md-9 pb-2">
                    <input
                      type="text"
                      className="form-control border-0"
                      value={
                        modalLocation &&
                        `${modalLocation.lineOne} ${
                          modalLocation.city
                        }, ${modalLocation.state.code.trim()} ${
                          modalLocation.zip
                        }`
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row row-cols-2 border-bottom mb-3">
              <div className="col-12 col-lg-6 border-bottom border-bottom-lg-0">
                <div className="row pb-2">
                  <div className="col-12 col-md-3 my-auto">
                    <label htmlFor="modal-horse" className="form-label">
                      Patient:
                    </label>
                  </div>
                  {modalView?.data?.patient?.id > 0 && (
                    <div className="ms-3" id="patient-avatar-container">
                      {/* <Link
                        target="_blank"
                        to={`/owner/patient/${modalView?.data?.patient?.id}/view`}
                      > */}
                      <img
                        onClick={patientOnClick}
                        className="roundedd float-start"
                        id="appointment-horse-avatar"
                        src={modalView?.data?.patient?.primaryImageUrl}
                        alt="#"
                      />
                      {/* </Link> */}
                    </div>
                  )}
                  <div className="col-10 col-md-7 ms-0">
                    <input
                      type="text"
                      className="form-control border-0"
                      value={
                        modalView?.data?.patient?.name
                          ? modalView.data.patient.name
                          : "N/A"
                      }
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-6 mt-3 mt-lg-0">
                <div className="row">
                  <div className="col-12 col-md-3 my-auto">Medications:</div>
                  <div className="col-12 col-md-9">
                    <input
                      type="text"
                      className="form-control border-0"
                      value={mapModalMedications()}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="modal-notes" className="form-label">
                Notes:
              </label>
              <div id="modal-text-editor">
                <CKEditor
                  editor={ClassicEditor}
                  id="notes"
                  name="notes"
                  data={modalView.data.notes}
                  onChange={notesOnChange}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-between">
            <div className="d-flex">
              {isVet && (
                <button
                  className="btn btn-outline-primary"
                  onClick={modalHandleSubmit}
                >
                  Update and Confirm
                </button>
              )}
              {!isVet && (
                <Link to="/chat">
                  <button className="btn btn-outline-primary">
                    Send Message
                  </button>
                </Link>
              )}
            </div>
            <div className="d-flex">
              <button className="btn btn-light me-3" onClick={modalHandleEdit}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={modalHandleClose}>
                Close
              </button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </React.Fragment>
  );
};

UserAppointment.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }),
};

export default UserAppointment;
