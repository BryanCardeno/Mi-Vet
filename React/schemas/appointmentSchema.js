import * as Yup from "yup";

const NOTES_CHAR_COUNT = 2000;

const formValidation = Yup.object().shape({
  appointmentTypeId: Yup.number().required("Please select an appointment Type").positive("Please select from the list below").integer().max(4), // change number to reflect number of appointment types from services lookup
  clientId: Yup.number().required().positive(),
  vetProfileId: Yup.number().required().positive("Please select a vet"),
  notes: Yup.string().max(NOTES_CHAR_COUNT),
  patientId: Yup.number().required("Please select from the list").positive("Please select from the list"),
  locationId: Yup.number().required("Please select a location").positive("Please select a location"),
  time: Yup.string().required("Please select a time"),
  appointmentStart: Yup.date().required("Please select a date").min(new Date(), "Choose a later date"),
  
});

export { NOTES_CHAR_COUNT, formValidation};
