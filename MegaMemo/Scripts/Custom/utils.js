function setDefaultButton(container, button) {
	$(container + ' input').keypress(function (e) {
		if (e.keyCode == 13) {
			$(button).click();
		}
	});
}

function isOnline() {
    return navigator.onLine;
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

function showLoader(container, id) {
    var pos = container.position();
    var width = container.outerWidth(true);
    var height = container.outerHeight(true);
    var loaderHtml = "\
        <div id='" + id + "' class='loader'>\
            <img src='/Images/loader.gif'>\
        </div>";
    $('body').append(loaderHtml);

    var loader = $('#' + id);
    loader.offset({ top: pos.top, left: pos.left });
    loader.width(width);
    loader.height(height);

    var loaderImg = loader.find('img');
    var imgPadding = (loader.height() - loaderImg.height()) / 2;
    loader.css('padding-top', imgPadding);
    loader.css('padding-bottom', imgPadding);
}

function hideLoader(id) {
    $('#' + id).remove()
}

function closeMenu() {
    $('.navbar-collapse').removeClass('in').addClass('collapse');
}

function showSection(id, args) {
    
    closeMenu();

    $('div.section').addClass('hide');
    $('#' + id).removeClass('hide');

    $('.nav li').removeClass('active');
    $('.nav #' + id + 'Link').addClass('active');

    resize();

    switch (id) {
        case 'decksSection':
            repository.getDecks(loadDecks);
            break;
        case 'editDeckSection':
            loadDeckToEdit(args);
            break;
        case 'studyListSection':
            repository.getDecks(loadDecksToReview);
            break;
        case 'studyDeckSection':
            loadCardsToReview(args);
            break;
    }
}

function appStart() {
    showSection('studyListSection');
}

function resize() {
    var htmlEditors = $('.htmlEditor');

    htmlEditors.each(function (index) {
        var htmlEditorContainer = $(this).closest('.htmlEditorContainer');
        var width = htmlEditorContainer.width();
        htmlEditorContainer.find('.jHtmlArea').width(width);
        htmlEditorContainer.find('iframe').width(width);
        htmlEditorContainer.find('.ToolBar').width(width);
    });
}

$(document).ready(function () {
    $('.htmlEditor').htmlarea();
    resize();
});

$(window).resize(function () {
    resize();
});
