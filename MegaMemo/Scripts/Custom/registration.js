setDefaultButton('#registerContainer', '#registerBtn');

$('#registerBtn').click(register);

function register() {
    var registerModel = {
        userName: $('#userName').val(),
        password: $('#password').val(),
        confirmPassword: $('#confirmPassword').val()
    };

    console.log(userName);

    $.ajax({
        url: '/Account/JsonRegister',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(registerModel),
        success: function (data) {
            //loginModel.success(data.success)
            console.log(data);

            if (data.errors) {
                var errors = '';
                for (var i = 0; i < data.errors.length; ++i) {
                    errors += data.errors[i] + '<br />';
                }

                $('#registerContainer .errors').html(errors);
            }
        }
    });
}

/*
var registrationModel = {
    userName: ko.observable(),
    password: ko.observable(),
    confirmPassword: ko.observable(),
    errors: ko.observable(),
    register: function () {
        $.ajax({
            url: '/Account/JsonRegister',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ model: ko.toJS(loginModel) }),
            success: function (data) {
                //loginModel.success(data.success)
                console.log(data);

                var errors = '';
                for (var i = 0; i < data.errors.length; ++i) {
                	errors += data.errors[i] + '<br />';
                }

                registrationModel.errors(errors);
            }
        });
    }
};
ko.applyBindings(registrationModel);*/