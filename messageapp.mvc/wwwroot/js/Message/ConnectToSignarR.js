const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7140/chatHub?access_token=" + token)
    .withAutomaticReconnect()
    .build();

let selectedUserId = null;
