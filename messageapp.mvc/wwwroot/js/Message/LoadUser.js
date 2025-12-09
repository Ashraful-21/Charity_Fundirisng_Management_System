async function loadUsers() {

    let response = await fetch("https://localhost:7140/api/users", {
        headers: { "Authorization": "Bearer " + token }
    });

    let users = await response.json();

    let list = document.getElementById("usersList");
    list.innerHTML = "";

    users.forEach(u => {
        let li = document.createElement("li");
        li.style.cursor = "pointer";

        li.innerHTML = `
            <strong>${u.email}</strong>
            <span id="status-${u.id}">🔴 Offline</span>
        `;

        li.onclick = () => openChat(u.id, u.email);

        list.appendChild(li);
    });
}

loadUsers();
