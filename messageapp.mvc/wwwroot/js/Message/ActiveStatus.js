connection.on("UserOnline", (userId) => {
    let el = document.getElementById("status-" + userId);
    if (el) el.innerHTML = "🟢 Online";
});

connection.on("UserOffline", (userId) => {
    let el = document.getElementById("status-" + userId);
    if (el) el.innerHTML = "🔴 Offline";
});
