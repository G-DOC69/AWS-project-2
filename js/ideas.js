/*global AWS _config */

AWS.config.region = _config.cognito.region;

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: '<Your-Identity-Pool-Id>', // Replace with your Identity Pool ID
    Logins: {
        [`cognito-idp.${_config.cognito.region}.amazonaws.com/${_config.cognito.userPoolId}`]:
            localStorage.getItem("idToken")
    }
});

const docClient = new AWS.DynamoDB.DocumentClient();

function addIdea(content) {
    const params = {
        TableName: 'Ideas',
        Item: { id: Date.now().toString(), content }
    };
    docClient.put(params, (err, data) => {
        if (err) console.error(err);
        else alert("Idea added successfully!");
    });
}
