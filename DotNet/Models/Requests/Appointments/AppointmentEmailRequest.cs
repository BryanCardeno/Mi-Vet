using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Appointments
{
    public class AppointmentEmailRequest
    {
        [Required]
        public DateTime AppointmentStart { get; set; }

        [Required, EmailAddress]
        public string ClientEmail { get; set; }

        [Required, EmailAddress]
        public string VetEmail { get; set; }
        
    }
}
