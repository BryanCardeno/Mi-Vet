import React from "react";
import PropTypes from "prop-types";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import {
  FiUser,
  FiMessageSquare,
  FiVideo,
  FiPhoneCall,
  FiCheckCircle,
  FiMoreVertical,
} from "react-icons/fi";
import { IconContext } from "react-icons";
import { formatTime } from "utils/dateFormater";
import Dropdown from "react-bootstrap/Dropdown";
import "./appointment.css";
import { userProp, locationProp } from "./appointmentsCommonPropTypes";

const LIST_OF_MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const LIST_OF_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const Appointment = (props) => {
  const { appointment } = props;
  const time = formatTime(appointment.appointmentStart);

  const renderDate = (apptDay) => {
    const date = new Date(apptDay).getDate();
    const month = LIST_OF_MONTHS[new Date(apptDay).getMonth()];
    const day = LIST_OF_DAYS[new Date(apptDay).getDay()];

    return (
      <div className="text-dark">
        <p className="fs-5 fw-bold mb-0">{date}</p>
        <p className="fs-6 fw-semi-bold mb-0">{month}</p>
        <p className="fs-6 fw-semi-bold">{day}</p>
      </div>
    );
  };

  const appointmentIcons = (type) => {
    let icon = <></>;

    switch (type.id) {
      case 1:
        icon = <FiUser />;
        break;

      case 2:
        icon = <FiPhoneCall />;
        break;

      case 3:
        icon = <FiVideo />;
        break;

      case 4:
        icon = <FiMessageSquare />;
        break;

      default:
        return <BsFillQuestionCircleFill />;
    }

    return (
      <IconContext.Provider value={{ size: "2em" }}>
        {icon}
        <p className="fs-6">{type.name}</p>
      </IconContext.Provider>
    );
  };

  const localClicker = (e) => {
    props.dropDownEvents(e.target.name, appointment);
  };

  return (
    <React.Fragment>
      <tr className="text-center text-muted">
        <td role="cell">{renderDate(appointment.appointmentStart)}</td>

        <td role="cell" className="fw-semi-bold">
          {time}
        </td>

        <td role="cell" className="fs-5">
          {!appointment.isConfirmed ? (
            "Pending..."
          ) : (
            <FiCheckCircle className="text-success appointment-confirmed" />
          )}
        </td>

        <td role="cell" className="fs-5">
          {appointmentIcons(appointment.appointmentType)}
        </td>

        <td role="cell" className="d-none d-sm-table-cell">
          <div>
            <img
              src={appointment.vet.createdBy.userImage}
              alt="vetPhoto"
              className="rounded-circle appointment-vet-avatar"
            />
          </div>
          {`Dr. ${appointment.vet.createdBy.firstName} ${appointment.vet.createdBy.lastName}`}{" "}
          <br />
          {appointment.vet.businessEmail}
        </td>

        <td role="cell" className="d-none d-md-table-cell">
          {appointment.location.lineOne} <br />
          {appointment.location.lineTwo && `${appointment.location.lineTwo}`}
          {appointment.location.state.code} {appointment.location.zip}
        </td>

        <td role="cell" className="d-none d-md-table-cell">
          {`${appointment.modifiedBy.firstName} ${appointment.modifiedBy.lastName}`}
          <br />
          {new Date(appointment.dateModified).toUTCString().substring(4, 22)}
        </td>

        <td role="cell">
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-basic"
              className="bg-white border-0 text-muted"
            >
              <FiMoreVertical />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={localClicker} name="details">
                Details
              </Dropdown.Item>
              <Dropdown.Item onClick={localClicker} name="edit">
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={localClicker} name="cancel">
                Cancel Appointment
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    </React.Fragment>
  );
};

Appointment.propTypes = {
  appointment: PropTypes.shape({
    appointmentStart: PropTypes.string.isRequired,
    appointmentEnd: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    appointmentType: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    isConfirmed: PropTypes.bool.isRequired,
    client: userProp.isRequired,
    location: locationProp.isRequired,
    modifiedBy: userProp.isRequired,
    vet: PropTypes.shape({
      businessEmail: PropTypes.string.isRequired,
      createdBy: userProp.isRequired,
    }).isRequired,
  }),
  dropDownEvents: PropTypes.func.isRequired,
};

export default React.memo(Appointment);
