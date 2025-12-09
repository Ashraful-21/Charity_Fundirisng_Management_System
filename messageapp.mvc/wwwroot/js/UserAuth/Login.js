$(document).ready(function () {
    $("#loginForm").on('submit', function (e) {
        e.preventDefault();

        const email = $("#email").val();
        const password = $("#password").val();

        $("#statusMessage").empty();

        $.ajax({
            url: 'https://localhost:7140/api/UserAuth/Login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email: email, password: password }),
            success: function (data) {
                if (data && data.token) {
                    localStorage.setItem('token', data.token);
                    $("#statusMessage").html('<div class="alert alert-success">Login successful!</div>');
                    window.location.href = '/Home/UserHomePage';
                } else {
                    $("#statusMessage").html('<div class="alert alert-danger">An unexpected error occurred during login.</div>');
                }
            },
            error: function (xhr, status, error) {
                $("#statusMessage").html('<div class="alert alert-danger">Invalid credentials, please try again.</div>');
            }
        });
    });
});
