connection.on("ReceivePrivateMessage", (fromUser, message, timestamp) => {

    appendMessageToChatBox(fromUser, message, timestamp);

    scrollToBottom();
});
