function sendPrivateMessage() {
    if (!selectedUserId) {
        alert("Select a user first!");
        return;
    }

    let msg = document.getElementById("privateMessageInput").value;

    connection.invoke("SendPrivateMessage", selectedUserId, msg)
        .catch(err => console.error(err));

    document.getElementById("privateMessageInput").value = "";
}
