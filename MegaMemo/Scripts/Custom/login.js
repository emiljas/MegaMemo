setDefaultButton('#loginContainer', '#loginBtn');

var loginModel = {
	userName: ko.observable(),
	password: ko.observable(),
	success: ko.observable(),
    errors: ko.observable(),
	login: function () {
	    $.ajax({
	        url: '/Account/JsonLogin',
	        type: 'POST',
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify({ model: ko.toJS(loginModel) }),
	        success: function (data) {
	            loginModel.success(data.success)
	            console.log(data);

	            var errors = '';
	            for (var i = 0; i < data.errors.length; ++i) {
	                errors += data.errors[i] + '<br />';
	            }

	            loginModel.errors(errors);
	        }
	    });
	}
};

/*ko.applyBindings(loginModel);*/