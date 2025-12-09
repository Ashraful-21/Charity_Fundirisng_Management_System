const token = localStorage.getItem("token");

if (!token) {
    alert("You are not logged in!");
    window.location.href = "/Home/Login";
}

// Decode JWT payload
const jwtPayload = JSON.parse(atob(token.split('.')[1]));

// These MUST match your JWT claims
const myUserId = jwtPayload["nameid"]; // ClaimTypes.NameIdentifier
const myEmail = jwtPayload["unique_name"] || jwtPayload["email"]; 
