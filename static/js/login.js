// var username
var email;
var password;
var poolData;

function loginButton() {
	email = document.getElementById("logInInputEmail").value;
	// username = document.getElementById("signUpInputUsername").value;
	password = document.getElementById("logInInputPassword").value;

	var authenticationData = {
		Username: email,
		Password: password,
	};

	var authenticationDetails = new AmazonCognitoIdentity.authenticationDetails(authenticationData);

	var poolData = {
		userPoolId: 'us-east-1_PDlFRpn3d',
		clientId: '4bo044no2e6vld7a31mt4mng3h'
	}

	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var userData = {
		Username: email,
		Pool:userPool,
	};

	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

	cognitoUser.authenticateUser(authenticationDetails,{
		onSuccess:function(result){
			var accessToken = result.getAccessToken().getJwtToken();
			console.log("accessToken: " + accessToken);
		},
		onFailure:function(err){
			alert(err.message||JSON.stringify(err));
		},
	})
}