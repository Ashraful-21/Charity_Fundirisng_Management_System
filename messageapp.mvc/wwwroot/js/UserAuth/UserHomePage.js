// Retrieve JWT token from localStorage
const token = localStorage.getItem("token");
let selectedUserId = null;
let myUserId = null;
let myEmail = null;

// Map to store userId -> name/email
const usersMap = {};

// Decode JWT safely
(function () {
    if (!token) return;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        myUserId = payload["nameid"];
        myEmail = payload["email"];
        usersMap[myUserId] = "You"; // label yourself
    } catch (e) {
        console.error("Error decoding JWT token:", e);
        // Handle invalid token case if necessary
    }
})();

// Create SignalR connection using accessTokenFactory
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7140/chatHub", {
        accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .build();

// -------------------- Load Users --------------------
async function loadUsers() {
    try {
        const response = await fetch("https://localhost:7140/api/Users", {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        const list = document.getElementById("usersList");
        list.innerHTML = "";

        users.forEach(u => {
            if (u.id === myUserId) return; // Skip showing current user in the list

            usersMap[u.id] = u.email; // store email as display name
            const li = document.createElement("li");
            li.style.cursor = "pointer";
            li.innerHTML = `
                        <strong>${u.email}</strong>
                        <span id="status-${u.id}" class="user-status">🔴 Offline</span>
                    `;
            li.onclick = () => openChat(u.id, u.email);
            list.appendChild(li);
        });
    } catch (err) {
        console.error("Error loading users:", err);
    }
}

loadUsers();

// -------------------- Open Chat --------------------
async function openChat(userId, email) {
    selectedUserId = userId;
    document.getElementById("chatWith").innerText = "Chat with: " + email;
    document.getElementById("chatBox").innerHTML = "";

    try {
        const response = await fetch(`https://localhost:7140/api/messages/${userId}`, {
            headers: { "Authorization": "Bearer " + token }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const history = await response.json();
        history.forEach(m => appendMessageToChatBox(m.senderId, m.content, m.timestamp));
    } catch (err) {
        console.error("Error loading chat history:", err);
    }
}

// -------------------- Send Private Message --------------------
async function sendPrivateMessage() {
    const msgInput = document.getElementById("privateMessageInput");
    const msg = msgInput.value;

    if (!selectedUserId || msg.trim() === "") return;

    if (connection.state === signalR.HubConnectionState.Connected) {
        try {
            // Manually append your message immediately for better UX
            appendMessageToChatBox(myUserId, msg, new Date().toISOString());

            await connection.invoke("SendPrivateMessage", selectedUserId, msg);
            msgInput.value = ""; // Clear input only after successful send/append
        } catch (err) {
            console.error("Send message failed:", err);
        }
    } else {
        console.warn("Connection not established. Cannot send message.");
    }
}

// Add event listener for Enter key on the input field
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("privateMessageInput");
    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default Enter key behavior (like new line)
                sendPrivateMessage();
            }
        });
    }
});


// -------------------- SignalR Event Handlers --------------------
connection.on("ReceivePrivateMessage", (fromUserId, message, timestamp) => {
    // Only append message if the current chat window is open for this user
    if (fromUserId === selectedUserId) {
        appendMessageToChatBox(fromUserId, message, timestamp);
    }
});

connection.on("UserOnline", userId => {
    const el = document.getElementById("status-" + userId);
    if (el) el.innerHTML = "🟢 Online";
});

connection.on("UserOffline", userId => {
    const el = document.getElementById("status-" + userId);
    if (el) el.innerHTML = "🔴 Offline";
});

// -------------------- Append Message (Final Professional Version) --------------------
function appendMessageToChatBox(senderId, message, timestamp) {
    const chatBox = document.getElementById("chatBox");
    const myMsg = senderId === myUserId;
    const timeString = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Get name/email from usersMap
    const senderLabel = usersMap[senderId] || "Unknown User";

    // Create container div for alignment
    const messageContainer = document.createElement("div");
    messageContainer.className = "message-container"; // Uses CSS class for flow control

    // Create the message bubble div
    const messageBubble = document.createElement("div");
    // Uses CSS classes for color and floating alignment
    messageBubble.className = `message-bubble ${myMsg ? 'message-you' : 'message-other'}`;

    // Conditional rendering of the sender name: only show the name if it's the other user.
    // (Standard chat apps usually hide 'You' to save space, but we'll keep it visible as requested).
    messageBubble.innerHTML = `
                <span class="message-sender" style="color: ${myMsg ? '#075e54' : '#005c4b'};">
                    ${senderLabel} 
                </span>
                <div>${message}</div>
                <span class="message-time">${timeString}</span>
            `;

    messageContainer.appendChild(messageBubble);
    chatBox.appendChild(messageContainer);

    // Scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// -------------------- Start Connection --------------------
async function startConnection() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
        // After connecting, ensure user list is loaded and statuses are updated
        loadUsers();
    } catch (err) {
        console.error("Connection failed:", err);
        setTimeout(startConnection, 5000); // retry after 5 seconds
    }
}

startConnection();