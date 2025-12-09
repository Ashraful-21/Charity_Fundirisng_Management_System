using messageapp.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MessagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId}")]
    public IActionResult GetHistory(string userId)
    {
        var myId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value;

        var messages = _context.Messages
            .Where(m =>
                (m.SenderId == myId && m.ReceiverId == userId) ||
                (m.SenderId == userId && m.ReceiverId == myId))
            .OrderBy(m => m.Timestamp)
            .ToList();

        return Ok(messages);
    }
}
