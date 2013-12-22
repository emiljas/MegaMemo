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

    var loader = $('#' + id); console.log(loader);
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

function showSection(id) {
    $('div.section').addClass('hide');
    $('#' + id).removeClass('hide');

    resize();

    switch (id) {
        case 'decksSection':

            break;
        case 'editDeckSection':
            loadDeckToEdit();
            break;
    }
}

ko.bindingHandlers.bindIframe = {
    init: function (element, valueAccessor) {
        function bindIframe() {
            try {
                var iframeInit = element.contentWindow.initChildFrame,
                    iframedoc = element.contentDocument.body;
            } catch (e) {
                // ignored
            }
            if (iframeInit)
                iframeInit(ko, valueAccessor());
            else if (iframedoc)
                ko.applyBindings(valueAccessor(), iframedoc);
        };
        bindIframe();
        ko.utils.registerEventHandler(element, 'load', bindIframe);
    }
};

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
