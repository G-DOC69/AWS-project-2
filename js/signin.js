/*global AmazonCognitoIdentity _config */

var userPoolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId
};

var userPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData);

function register(email, password) {
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email });

    userPool.signUp(email, password, [attributeEmail], null, (err, result) => {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        alert("Registration successful! Please check your email for a verification code.");
    });
}

function signin(email, password) {
    var authDetails = new AmazonCognitoIdentity.AuthenticationDetails({ Username: email, Password: password });
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });

    cognitoUser.authenticateUser(authDetails, {
        onSuccess: function (result) {
            alert("Login successful!");
            localStorage.setItem("idToken", result.getIdToken().getJwtToken());
            window.location.href = "ideas.html";
        },
        onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        }
    });
}

$(document).ready(function () {
    $('#registrationForm').submit(function (event) {
        event.preventDefault();
        const email = $('#emailInputRegister').val();
        const password = $('#passwordInputRegister').val();
        const confirmPassword = $('#password2InputRegister').val();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        register(email, password);
    });

    $('#signinForm').submit(function (event) {
        event.preventDefault();
        const email = $('#emailInputSignin').val();
        const password = $('#passwordInputSignin').val();
        signin(email, password);
    });
});
