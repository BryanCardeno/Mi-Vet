using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Appointments;
using Sabio.Models.Requests.Appointments;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/appointments")]
    [ApiController]
    public class AppointmentApiController : BaseApiController
    {
        private IAppointmentService _service = null;
        private IEmailService _emailService = null;
        IAuthenticationService<int> _authService = null;

        public AppointmentApiController(IAppointmentService service, IEmailService emailService ,IAuthenticationService<int> authService,ILogger<AppointmentApiController> logger) : base(logger)
            {
                _service = service;
            _authService = authService;
            _emailService = emailService;

            }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Appointment>> GetById (int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Appointment appointment = _service.GetById(id);

                if(appointment == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<Appointment> { Item = appointment }; 
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
        [HttpGet]
        public ActionResult<ItemsResponse<Appointment>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Appointment> page = _service.GetAll(pageIndex, pageSize);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("clients/{id:int}")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByClientId (int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Appointment> pa = _service.GetByClientId(id, pageIndex, pageSize);

                if(pa == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = pa };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("vets/{id:int}")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByVetProfileId (int id, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Appointment> pa = _service.GetByVetProfileId(id, pageIndex, pageSize);

                if(pa == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = pa };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response= new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
        [HttpGet("vets/{id:int}/month")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByVetProfileIdByMonth(int id, int pageIndex, int pageSize, int month)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Appointment> pa = _service.GetByVetProfileIdByMonth(id, pageIndex, pageSize, month);

                if (pa == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = pa };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
        [HttpGet("vets/{id:int}/day")]
        public ActionResult<ItemResponse<Paged<Appointment>>> GetByVetProfileIdByUpcomingDay(int id, int pageIndex, int pageSize, int day)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Appointment> pa = _service.GetByVetProfileIdByUpcomingDay(id, pageIndex, pageSize, day);

                if (pa == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Appointment>> { Item = pa };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create (AppointmentAddRequest model)
        {
            int code = 201;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);

                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update (AppointmentUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);

                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPut("{id:int}/delete")]
        public ActionResult<SuccessResponse> Delete (int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPut("appointmentRequestEmail")]
        public ActionResult<SuccessResponse> SendAppointmentRequest(AppointmentEmailRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _emailService.SendAppointmentEmail(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

    }
}
