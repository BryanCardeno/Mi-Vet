import { lazy } from "react";

const UserAppointment = lazy(() =>
  import("../components/appoinments/UserAppointment")
);
const FormsAppointment = lazy(() =>
  import("../components/appoinments/FormsAppointment")
);

const appointments = [
  {
    path: "/appointments/new",
    name: "forms appointment",
    exact: true,
    element: FormsAppointment,
    roles: ["Admin", "User", "Vet"],
    isAnonymous: false,
  },
  {
    path: "/appointments",
    name: "user appointment",
    exact: true,
    element: UserAppointment,
    roles: ["Admin", "User", "Vet"],
    isAnonymous: false,
  },
  {
    path: "/appointments/:id/edit",
    name: "forms appointment",
    exact: true,
    element: FormsAppointment,
    roles: ["Admin", "Vet", "User"],
    isAnonymous: false,
  },
  {
    path: "/appointments/meeting",
    name: "VideoChat",
    roles: ["Admin", "Vet", "User"],
    exact: true,
    element: VideoChat,
    isAnonymous: false,
  },
];


const allRoutes = [
  ...appointments,
];

export default allRoutes;
