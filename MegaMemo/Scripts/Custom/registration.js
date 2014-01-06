setDefaultButton('#registrationSection', '#registerBtn');

function RegisterModel() {
    var self = this;

    self.userName = ko.observable();
    self.password = ko.observable();
    self.confirmPassword = ko.observable();
    self.errors = ko.observable();

    self.register = function () {
        showLoader($('#registrationForm'), 'registrationLoader');

        $.ajax({
            url: '/Account/JsonRegister',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: ko.toJSON(self),
            success: function (data) {
                if (data.errors) {
                    var errors = '';
                    for (var i = 0; i < data.errors.length; ++i) {
                        errors += data.errors[i] + '<br />';
                    }

                    self.errors(errors);
                    hideLoader('registrationLoader');
                }
                else if (data.success) {
                    self.errors('');

                    var autoLoginAlertFunction = function () {
                        hideLoader('registrationLoader');
                        bootbox.alert("\
                            <div class='center'>\
                                You are logged on as <b>" + self.userName()) + "</b>." +
                            "</div>";
                    };
                    login({
                        userName: self.userName(),
                        password: self.password()
                    }, autoLoginAlertFunction);
                }
            }
        });
    };
}

var registerModel = new RegisterModel();
ko.applyBindings(registerModel, $('#registrationSection')[0]);