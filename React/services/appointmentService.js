import axios from "axios";
import {
  onGlobalSuccess,
  onGlobalError,
  API_HOST_PREFIX,
} from "./serviceHelpers";

const endpoint = `${API_HOST_PREFIX}/api/appointments`;

const lookUpAppointmentTypes = (payload) => {
  const config = {
    method: "POST",
    url: `${API_HOST_PREFIX}/api/lookups`,
    withCredentials: true,
    data: payload,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getAllAppointments = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

//change pageIndex and pageSize to be dynamic once paginate is implemented on UserAppointments page
const getByVetId = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint}/vets/${id}?pageIndex=0&pageSize=10`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByClientId = (id, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpoint}/clients/${id}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getById = (id) => {
  const config = {
    method: "GET",
    url: `${endpoint}/${id}`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const addAppointment = (payload) => {
  const config = {
    method: "POST",
    url: endpoint,
    data: payload,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const updateAppointment = (payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/${payload.id}`,
    data: payload,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteAppointment = (id) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/${id}/delete`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getByVetIdByMonth = (id, month) => {
  const config = {
    method: "GET",
    url: `${endpoint}/vets/${id}/month?pageIndex=0&pageSize=10&month=${month}`,
    withCredentials: true,
    headers: { "COntent-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};
const getByVetIdByUpcomingDay = (id, day) => {
  const config = {
    method: "GET",
    url: `${endpoint}/vets/${id}/day?pageIndex=0&pageSize=10&day=${day}`,
    withCredentials: true,
    headers: { "COntent-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const sendEmailRequest = (payload) => {
  const config = {
    method: "PUT",
    url: `${endpoint}/appointmentRequestEmail`,
    data: payload,
    withCredentials: true,
    headers: { "Content-Type":"application/json"}
  }
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

export {
  lookUpAppointmentTypes,
  getAllAppointments,
  getByVetId,
  getByClientId,
  getById,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getByVetIdByMonth,
  getByVetIdByUpcomingDay,
  sendEmailRequest
};
