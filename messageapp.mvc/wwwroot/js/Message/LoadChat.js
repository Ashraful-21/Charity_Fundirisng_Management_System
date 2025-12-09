async function openChat(userId, email) {

    selectedUserId = userId;
    document.getElementById("chatWith").innerText = "Chatting with: " + email;

    document.getElementById("chatBox").innerHTML = "";

    let response = await fetch(`https://localhost:7140/api/messages/${userId}`, {
        headers: { "Authorization": "Bearer " + token }
    });

    let history = await response.json();

    history.forEach(m => {
        appendMessageToChatBox(m.senderId, m.content, m.timestamp);
    });

    scrollToBottom();
}
