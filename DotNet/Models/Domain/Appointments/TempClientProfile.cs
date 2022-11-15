using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.Appointments
{
    public class TempClientProfile : TempUserProfile
    {
        public string Email { get; set; }
    }
}
