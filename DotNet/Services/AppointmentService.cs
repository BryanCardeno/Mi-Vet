using Sabio.Data.Providers;
using Sabio.Models.Requests.Appointments;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Sabio.Services.Interfaces;
using Sabio.Models.Domain.Appointments;
using Sabio.Data;
using Newtonsoft.Json;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Domain.VetProfiles;
using Sabio.Models.Domain.Users;
using Microsoft.AspNetCore.Mvc;
using User = Sabio.Models.Domain.Users.User;
using Sabio.Models.Domain.HorseProfiles;

namespace Sabio.Services
{
    public class AppointmentService : IAppointmentService
    {
        private IDataProvider _data = null;

        public AppointmentService(IDataProvider data, IAuthenticationService<int> authService)
        {
            _data = data;
        }

        public int Add(AppointmentAddRequest request, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Appointments_Insert_V2]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection collection)
            {
                AddCommonParams(request, collection, userId);
                

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                collection.Add(idOut);


            }, delegate (SqlParameterCollection returnedCollection)
            {
                object oId = returnedCollection["@Id"].Value;
                Int32.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void Update(AppointmentUpdateRequest request, int userId)
        {
            string procName = "[dbo].[Appointments_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                AddCommonParams(request, collection, userId);
                collection.AddWithValue("@IsConfirmed", request.IsConfirmed);
                collection.AddWithValue("@StatusTypeId", request.StatusTypeId);
                collection.AddWithValue("@Id", request.Id);
              

            }, returnParameters: null);
        }

        public Appointment GetById(int id)
        {
            Appointment appointment = null;
            string procName = "[dbo].[Appointments_Select_ById]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                appointment = MapSingleAppointment(reader, ref startingIndex);
            });

            return appointment;
        }

        public Paged<Appointment> GetAll(int pageIndex, int pageSize)
        {
            Paged<Appointment> pagedList = null;
            List<Appointment> list = null;
            string procName = "[dbo].[Appointments_SelectAll]";
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    Appointment anAppointment = MapSingleAppointment(reader, ref startingIndex);

                    totalCount = reader.GetSafeInt32(startingIndex);

                    if (list == null)
                    {
                        list = new List<Appointment>();
                    }
                    list.Add(anAppointment);
                });
            if (list != null)
            {
                pagedList = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }

        public Paged<Appointment> GetByClientId(int id, int pageIndex, int pageSize)
        {
            Paged<Appointment> pa = null;
            List<Appointment> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Appointments_Select_ByClientIdV3]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(15);

                if(list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);
            });

            if(list != null)
            {
                pa = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

                return pa;
        }

        public Paged<Appointment> GetByVetProfileId(int id, int pageIndex, int pageSize)
        {
            Paged<Appointment> pa = null;
            List<Appointment> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Appointments_Select_ByVetProfileIdV3]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(15);

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);
            });

            if(list != null)
            {
                pa = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

            return pa;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Appointments_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);

            }, returnParameters: null);
        }
        public Paged<Appointment> GetByVetProfileIdByMonth(int id, int pageIndex, int pageSize, int month)
        {
            Paged<Appointment> pa = null;
            List<Appointment> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Appointments_Select_ByVetProfileId_ByMonth]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);
                collection.AddWithValue("@Month", month);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex++);

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);
            });

            if (list != null)
            {
                pa = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

            return pa;
        }
        public Paged<Appointment> GetByVetProfileIdByUpcomingDay(int id, int pageIndex, int pageSize, int day)
        {
            Paged<Appointment> pa = null;
            List<Appointment> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Appointments_Select_ByVetProfileId_ByUpcomingDay]";

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection collection)
            {
                collection.AddWithValue("@Id", id);
                collection.AddWithValue("@PageIndex", pageIndex);
                collection.AddWithValue("@PageSize", pageSize);
                collection.AddWithValue("@Day", day);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Appointment appointment = MapSingleAppointment(reader, ref startingIndex);
                totalCount = reader.GetSafeInt32(startingIndex++);

                if (list == null)
                {
                    list = new List<Appointment>();
                }

                list.Add(appointment);
            });

            if (list != null)
            {
                pa = new Paged<Appointment>(list, pageIndex, pageSize, totalCount);
            }

            return pa;
        }

        private Appointment MapSingleAppointment(IDataReader reader, ref int startingIndex)
        {
            Appointment app = new Appointment();

            app.Id = reader.GetSafeInt32(startingIndex++);
            app.Notes = reader.GetSafeString(startingIndex++);
            app.IsConfirmed = reader.GetSafeBool(startingIndex++);
            app.AppointmentStart = reader.GetSafeDateTime(startingIndex++);
            app.AppointmentEnd = reader.GetSafeDateTime(startingIndex++);
            app.DateCreated = reader.GetSafeDateTime(startingIndex++);
            app.DateModified = reader.GetSafeDateTime(startingIndex++);

            string statusType = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(statusType))
            {
                app.StatusType = JsonConvert.DeserializeObject<LookUp>(statusType);
            }

            string appointmentType = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(appointmentType))
            {
                app.AppointmentType = JsonConvert.DeserializeObject<LookUp>(appointmentType);
            }

            string modifiedBy = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(modifiedBy))
            {
                app.ModifiedBy = JsonConvert.DeserializeObject<BaseUserProfile>(modifiedBy);
            }

            string location = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(location))
            {
                app.Location = JsonConvert.DeserializeObject<Location>(location);
            }

            string client = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(client))
            {
                app.Client = JsonConvert.DeserializeObject<User>(client);
            }

            string patient = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(patient))
            {
                app.Patient = JsonConvert.DeserializeObject<HorseProfile>(patient);
            }

            string createdBy = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(createdBy))
            {
                app.CreatedBy = JsonConvert.DeserializeObject<BaseUserProfile>(createdBy);
            }

            string vet = reader.GetSafeString(startingIndex++);

            if(!String.IsNullOrEmpty(vet))
            {
                app.Vet = JsonConvert.DeserializeObject<VetProfileV2>(vet);
            }
            

            return app;
        }

        private void AddCommonParams(AppointmentAddRequest request, SqlParameterCollection collection, int userId)
        {
            collection.AddWithValue("@PatientId", request.PatientId);
            collection.AddWithValue("@AppointmentTypeId", request.AppointmentTypeId);
            collection.AddWithValue("@ClientId", request.ClientId);
            collection.AddWithValue("@VetProfileId", request.VetProfileId);
            collection.AddWithValue("@Notes", request.Notes);
            collection.AddWithValue("@LocationId", request.LocationId);
            collection.AddWithValue("@AppointmentStart", request.AppointmentStart);
            collection.AddWithValue("@AppointmentEnd", request.AppointmentEnd);
            collection.AddWithValue("@UserId", userId);
        }
    }
}
