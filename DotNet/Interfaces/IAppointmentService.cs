using Sabio.Models;
using Sabio.Models.Domain.Appointments;
using Sabio.Models.Requests.Appointments;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IAppointmentService
    {
        int Add(AppointmentAddRequest request, int userId);

        void Update(AppointmentUpdateRequest request, int userId);

        Appointment GetById (int id);
        Paged<Appointment> GetAll(int pageIndex, int pageSize);

        Paged<Appointment> GetByClientId(int id, int pageIndex, int pageSize);

        Paged<Appointment> GetByVetProfileId(int id, int pageIndex, int pageSize);
        Paged<Appointment> GetByVetProfileIdByMonth(int id, int pageIndex, int pageSize, int month);
        Paged<Appointment> GetByVetProfileIdByUpcomingDay(int id, int pageIndex, int pageSize, int day);

        void Delete(int id);


    }
}