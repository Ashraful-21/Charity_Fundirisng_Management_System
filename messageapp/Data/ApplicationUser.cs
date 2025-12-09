using Microsoft.AspNetCore.Identity;

namespace messageapp.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
