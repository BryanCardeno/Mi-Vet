import React from "react";
import PropTypes from "prop-types";

const AppointmentsSubHeader = (props) => {
  const sortTable = (e) => {
    switch (e.target.value) {
      case "descending":
        props.setAppointments(sortComponentsDescending);
        break;

      case "ascending":
        props.setAppointments(sortComponentsAscending);
        break;

      case "pending":
        props.setAppointments(sortComponentsPending);
        break;

      default:
        props.setAppointments(sortComponentsAscending);
        break;
    }
  };

  const sortComponentsDescending = (prevState) => {
    const sort = { ...prevState };

    sort.components.sort((a, b) => {
      const elementA = a.props.appointment.appointmentStart;
      const elementB = b.props.appointment.appointmentStart;

      if (elementA > elementB) {
        return -1;
      }

      if (elementB > elementA) {
        return 1;
      }

      return 0;
    });
    return sort;
  };

  const sortComponentsAscending = (prevState) => {
    const sort = { ...prevState };

    sort.components.sort((a, b) => {
      const elementA = a.props.appointment.appointmentStart;
      const elementB = b.props.appointment.appointmentStart;

      if (elementA < elementB) {
        return -1;
      }

      if (elementB < elementA) {
        return 1;
      }

      return 0;
    });
    return sort;
  };

  const sortComponentsPending = (prevState) => {
    const sort = { ...prevState };

    sort.components.sort((a, b) => {
      const elementA = a.props.appointment.isConfirmed;
      const elementB = b.props.appointment.isConfirmed;

      if (elementA < elementB) {
        return -1;
      }

      if (elementB < elementA) {
        return 1;
      }

      return 0;
    });
    return sort;
  };

  return (
    <React.Fragment>
      <div className="row px-3">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="pb-4 d-lg-flex justify-content-between align-items-center">
            {props.isVet && (
              <div className="d-flex mb-3 mb-lg-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter"
                />
              </div>
            )}
            <div className="d-flex">
              <select
                name="sort"
                id="appointments-sort"
                className="form-select"
                onChange={sortTable}
              >
                <option value="ascending">Ascending</option>
                <option value="descending">Descending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

AppointmentsSubHeader.propTypes = {
  setAppointments: PropTypes.func.isRequired,
  isVet: PropTypes.bool.isRequired,
};

export default AppointmentsSubHeader;
