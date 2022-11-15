import React from "react";

const AppointmentsTableHeader = () => {
  return (
    <React.Fragment>
      <thead>
        <tr className="text-center">
          <th scope="col d-none">Date</th>
          <th scope="col">Time</th>
          <th scope="col">Status</th>
          <th scope="col">Type</th>
          <th scope="col" className="d-none d-sm-table-cell">
            Vet
          </th>
          <th scope="col" className="d-none d-md-table-cell">
            Address
          </th>
          <th scope="col" className="d-none d-md-table-cell">
            Last Modified
          </th>
          <th></th>
        </tr>
      </thead>
    </React.Fragment>
  );
};

export default AppointmentsTableHeader;
