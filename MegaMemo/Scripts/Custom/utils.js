function setDefaultButton(container, button) {
	$(container + ' input').keypress(function (e) {
		if (e.keyCode == 13) {
			$(button).click();
		}
	});
}

function errorAlert(errors) {
    errors = "<div class='center red'>" + errors + '</div>';
    bootbox.alert(errors);
}

function sh(element) {
    element.removeClass('hide');
}

function hi(element) {
    element.addClass('hide');
}