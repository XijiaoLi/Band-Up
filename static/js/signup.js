
var email;
var username;
var password;
var poolData;

function registerButton() {
	email = document.getElementById("signUpInputEmail").value;
	username = document.getElementById("signUpInputUsername").value;
	password = document.getElementById("signUpInputPassword").value;

	var poolData = {
		userPoolId: 'us-east-1_PDlFRpn3d',
		clientId: '4bo044no2e6vld7a31mt4mng3h'
	}

	var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	var attributeList = [];

	var dataEmail = {
		Name: 'email',
		Value: email, // get from form field
	};
	var dataName = {
		Name: 'name',
		Value: username, // get from form field
	};
	var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
	var attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);
	attributeList.push(attributeEmail);
	attributeList.push(attributeName);

	userPool.signUp(email, password, attributeList, null, function(err, result){
		if(err){
			alert(err.message||JSON.stringify(err));
			return;
		}
		cognitoUser = result.user;
		console.log("username is " + cognitoUser.getUsername());
		alert("Go check your email for verification link!!!");
	});
}