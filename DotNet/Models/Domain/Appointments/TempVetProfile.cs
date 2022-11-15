using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Appointments
{
    public class VetProfileBase
    {
        public int Id { get; set; }

        public string Bio { get; set; }

        public string BusinessEmail { get; set; } 

        public string EmergencyLine { get; set; }
    }
}
