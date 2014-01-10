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

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

function showLoader(container, id, message) {
    var pos = container.position();
    var width = container.outerWidth(true);
    var height = container.outerHeight(true);
    var loaderHtml = "\
        <div id='" + id + "' class='loader'>\
            <div class='img'>\
                <img src='/Images/loader.gif' />" +
                (
                message
                ?
                ("<br /><br />" + message)
                :
                ''
                )
                +
            "</div>\
        </div>";
    $('body').append(loaderHtml);

    var loader = $('#' + id);
    loader.offset({ top: pos.top, left: pos.left });
    loader.width(width);
    loader.height(height);

    var loaderImg = loader.find('.img');
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

    hi($('div.section'));
    sh($('#' + id));

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
    if (isLogin()) {
        showLoader($('body'), 'synchronizeLoader', 'Synchronizing...');
        synchronizer.sychronizeFromServer(function () {
            showSection('studyListSection');
            hi($('.nav li'));
            sh($('.nav .registerOnly'));

            hideLoader('synchronizeLoader');
        });
    }
    else {
        showSection('registrationSection');
        showAppGuide();
    }
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
