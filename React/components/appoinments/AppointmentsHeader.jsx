import React from "react";
import { useNavigate } from "react-router-dom";

const AppointmentsHeader = () => {
    const navigate = useNavigate();

    const goToNewAppointment = e => {
        navigate(e.currentTarget.dataset.page);
    }

    return <React.Fragment>
                <div>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="border-bottom pb-4 mb-4 d-lg-flex justify-content-between align-items-center">
                                <div className="d-flex">
                                    <h1 className="mb-1 h2 fw-bold"> Appointments</h1>
                                </div>
                                <div className="d-flex">
                                    <button type="button" className="btn btn-primary" onClick={goToNewAppointment} data-page="/appointments/new">New Appointment</button>
                                </div>
                            </div>              
                        </div>   
                    </div>
                </div>
    </React.Fragment>
}

export default AppointmentsHeader;