setDefaultButton('#loginContainer', '#loginBtn');

$('#loginBtn').click(login);

function login() {
    var loginModel = {
        userName: $('#userName').val(),
        password: $('#password').val()
    };

    showLoader($('#loginContainer'), 'loginLoader');

    $.ajax({
        url: '/Account/JsonLogin',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(loginModel),
        success: function (data) {
            console.log(data.success);

            hideLoader('loginLoader');

            console.log(data);

            if (data.errors) {
                var errors = '';
                for (var i = 0; i < data.errors.length; ++i) {
                    errors += data.errors[i] + '<br />';
                }

                errorAlert(errors);
            }
            else {
                localStorage.login = loginModel.userName;
                localStorage.password = loginModel.password;

                showLoginInfo();
            }
            
        }
    });

    //hideLoader('loginLoader');
}

function showLoginInfo() {
    hi($('#loginContainer'));
    sh($('#loginInfo'));
    $('#loginInfo .userName').text(localStorage.login);

}

if (localStorage.login != undefined && localStorage.password != undefined) {
    showLoginInfo();
}