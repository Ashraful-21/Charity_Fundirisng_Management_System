using messageapp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace messageapp.Data
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        // userId → connectionId
        public static Dictionary<string, string> OnlineUsers = new();

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;  // GUID from JWT
            var connectionId = Context.ConnectionId;

            lock (OnlineUsers)
            {
                OnlineUsers[userId] = connectionId;
            }

            await Clients.All.SendAsync("UserOnline", userId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;

            lock (OnlineUsers)
            {
                if (OnlineUsers.ContainsKey(userId))
                    OnlineUsers.Remove(userId);
            }

            await Clients.All.SendAsync("UserOffline", userId);
        }

        public async Task SendPrivateMessage(string receiverUserId, string message)
        {
            var senderUserId = Context.UserIdentifier;

            // Save message in DB
            var msg = new Message
            {
                SenderId = senderUserId,
                ReceiverId = receiverUserId,
                Content = message,
                Timestamp = DateTime.Now
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();

            // deliver to receiver
            if (OnlineUsers.TryGetValue(receiverUserId, out string receiverConn))
            {
                await Clients.Client(receiverConn)
                    .SendAsync("ReceivePrivateMessage", senderUserId, message, msg.Timestamp);
            }

            // deliver to sender UI
            await Clients.Client(Context.ConnectionId)
                .SendAsync("ReceivePrivateMessage", senderUserId, message, msg.Timestamp);
        }
    }
}
