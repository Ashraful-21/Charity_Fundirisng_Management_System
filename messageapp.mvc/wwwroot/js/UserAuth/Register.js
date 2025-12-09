$(document).ready(function () {
    $("#registerForm").on('submit', function (e) {
        e.preventDefault();

        const name = $("#name").val();
        const email = $("#email").val();
        const password = $("#password").val();

        const formData = {
            name: name,
            email: email,
            password: password
        };

        $("#statusMessage").empty();

        $.ajax({
            url: 'https://localhost:7140/api/UserAuth/Register',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function (response) {
                $("#statusMessage").html('<div class="alert alert-success">Registration successful!</div>');
            },
            error: function (xhr, status, error) {
                $("#statusMessage").html('<div class="alert alert-danger">Registration failed. Please try again.</div>');
            }
        });
    });
});