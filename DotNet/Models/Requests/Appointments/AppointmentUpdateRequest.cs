using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Appointments
{
    public class AppointmentUpdateRequest : AppointmentAddRequest, IModelIdentifier
    {
        public int Id { get; set; }

        [Required]
        public bool IsConfirmed { get; set; }

        [Required, Range(1, Int32.MaxValue)]
        public int StatusTypeId { get; set; }
    }
}
