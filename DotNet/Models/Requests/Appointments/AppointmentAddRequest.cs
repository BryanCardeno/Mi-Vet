using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Appointments
{
    public class AppointmentAddRequest
    {

        [Required, Range(1, 4)]
        public int AppointmentTypeId { get; set; }

        [Required, Range(1, Int32.MaxValue)]
        public int ClientId { get; set; }

        [Required, Range(1, Int32.MaxValue)]
        public int VetProfileId { get; set; }
        
        [StringLength(2000), AllowNull]
        public string Notes { get; set; }

        [Range(1, Int32.MaxValue), Required]
        public int PatientId { get; set; }

        [Required, Range(1, Int32.MaxValue)]
        public int LocationId { get; set; }

        [Required]
        public DateTime AppointmentStart { get; set; }

        [Required]
        [DateEndGreaterThanStart]
        public DateTime AppointmentEnd { get; set; }




    }
}
