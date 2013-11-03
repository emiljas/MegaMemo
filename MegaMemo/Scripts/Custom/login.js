var loginModel = {
	"model": {
		"UserName": "qwerty",
		"Password": "qwerty",
		RememberMe: true
	}
};

$.ajax({
	url: '/Account/JsonLogin',
	type: 'POST',
	contentType: "application/json; charset=utf-8",
	data: JSON.stringify(loginModel),
	success: function (arg) {
		console.log(arg);
	}
});