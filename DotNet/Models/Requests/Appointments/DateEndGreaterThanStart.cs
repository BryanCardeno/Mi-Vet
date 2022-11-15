using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Appointments
{
    public class DateEndGreaterThanStart : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var model = (AppointmentAddRequest)validationContext.ObjectInstance;
            DateTime _dateEnd = Convert.ToDateTime(value);
            DateTime _dateStart = Convert.ToDateTime(model.AppointmentStart);

            if(_dateEnd < _dateStart)
            {
                return new ValidationResult("End date need to be after start date");
            }
            else
            {
                return ValidationResult.Success;
            }
        }
    }
}
