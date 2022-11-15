import React, { useEffect, useState } from "react";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";
import FormsVetProfiles from "./FormsVetProfiles";
import { vetProfileProp } from "./appointmentsCommonPropTypes";
import vetProfilesService from "components/vetprofile/vetProfilesService";

import debug from "sabio-debug";

const _logger = debug.extend("Appointments/VetPanel");

const FormsVetPanel = (props) => {
  const [vetProfiles, setVetProfiles] = useState([]);
  const [searchVet, setSearchVet] = useState();
  const [displayNotFound, setDisplayNotFound] = useState(false);
  const [pageController, setPageController] = useState({
    current: 1,
    pageSize: 3,
    total: 0,
  });

  useEffect(() => {
    vetProfilesService
      .getAllPaginated(pageController.current - 1, pageController.pageSize)
      .then(getAllVetOnSuccess)
      .catch(getAllVetOnError);
  }, [pageController.current]);

  const getAllVetOnSuccess = (response) => {
    _logger(response);
    setVetProfiles(() => response.item.pagedItems);
    setPageController((prevState) => {
      const newController = { ...prevState };
      newController.total = response.item.totalCount;
      return newController;
    });
  };

  const getAllVetOnError = (error) => {
    _logger(error);
  };

  const paginateOnChange = (e) => {
    setPageController((prevState) => {
      const newPage = { ...prevState };
      newPage.current = e;
      return newPage;
    });
  };

  const mapVetList = (vet) => {
    return (
      <FormsVetProfiles
        key={vetProfiles.id}
        vetProfile={vet}
        setSelectedVet={props.setSelectedVet}
        setVetIdField={props.formik.setFieldValue}
        selectedVet={props.selectedVet}
        formik={props.formik}
      />
    );
  };

  const findVets = (e) => {
    if (e.key === "Enter") {
      vetProfilesService
        .search(0, 5, searchVet)
        .then(searchOnSucces)
        .catch(searchOnError);
    }
  };

  const searchOnSucces = (response) => {
    setVetProfiles(() => response.item.pagedItems);
    if (displayNotFound) {
      setDisplayNotFound(() => false);
    }
  };

  const searchOnError = (error) => {
    _logger(error);
    setVetProfiles(() => []);
    setDisplayNotFound(true);
  };

  const searchFieldOnChange = (e) => {
    setSearchVet(() => e.target.value);
  };

  return (
    <React.Fragment>
      <div className="col-12 col-lg-4 col-md-10 col-sm-12 shadow rounded p-4 mx-3 mt-3 card">
        <div className="form-group">
          <label htmlFor="search-vet" className="form-label">
            Search Vet
          </label>
          <input
            type="text"
            id="search-vet"
            className="form-control mb-3"
            placeholder="Search"
            value={searchVet}
            onChange={searchFieldOnChange}
            onKeyUp={findVets}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="search-by-zip" className="form-label">
            Search by Zip
          </label>
          <input
            type="text"
            id="search-by-zip"
            className="form-control"
            placeholder="5-digit zip"
          />
        </div>
        <Pagination
          className="mb-3"
          onChange={paginateOnChange}
          current={pageController.current}
          total={pageController.total}
          pageSize={pageController.pageSize}
        />

        <span className="fs-6 required">Select a Vet</span>
        <div className="row">
          {displayNotFound && <div className="col">Vet Not Found</div>}
          {props.isErrorVisible &&
            props?.formik?.errors?.vetProfileId &&
            props.renderError("vetProfileId")}
        </div>
        <div className="row px-2">{vetProfiles.map(mapVetList)}</div>
      </div>
    </React.Fragment>
  );
};

FormsVetPanel.propTypes = {
  isErrorVisible: PropTypes.bool,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func,
    errors: PropTypes.shape({
      vetProfileId: PropTypes.string,
    }),
  }),
  selectedVet: vetProfileProp,
  setSelectedVet: PropTypes.func,
  renderError: PropTypes.func,
};

export default FormsVetPanel;
