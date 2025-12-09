using messageapp.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult GetUsers()
    {
        var currentUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value;

        var users = _userManager.Users
            .Where(u => u.Id != currentUserId)
            .Select(u => new {
                id = u.Id,
                email = u.Email,
                name = u.Name
            })
            .ToList();

        return Ok(users);
    }
}
