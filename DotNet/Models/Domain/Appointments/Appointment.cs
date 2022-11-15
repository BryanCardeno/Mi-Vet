using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Models.Domain.HorseProfiles;
using Sabio.Models.Domain.Locations;
using Sabio.Models.Domain.Users;
using Sabio.Models.Domain.VetProfiles;
using User = Sabio.Models.Domain.Users.User;

namespace Sabio.Models.Domain.Appointments
{
    public class Appointment
    {
        public int Id { get; set; }

        public LookUp AppointmentType { get; set; }

        public string Notes { get; set; }

        public bool IsConfirmed { get; set; }

        public DateTime AppointmentStart { get; set; }

        public DateTime AppointmentEnd { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public BaseUserProfile ModifiedBy { get; set; }

        public LookUp StatusType { get; set; }

        public Location Location { get; set; }

        public VetProfileV2 Vet { get; set; }

        public User Client { get; set; }

        public HorseProfile Patient {get;set; }

        public BaseUserProfile CreatedBy { get; set; }

    }
}
