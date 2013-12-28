﻿function EditDeckModel() {
    var self = this;

    self.deckId = ko.observable(0);
    self.title = ko.observable();
    self.cardsNumber = ko.observable();

    self.front = function (val) {
        var frontBody = $("#frontContainer").find('iframe').contents().find('body');
        if (val === undefined)
        {
            return frontBody.html();
        }
        else
        {
            frontBody.html(val);
        }
    }
    self.back = function (val) {
        var backBody = $("#backContainer").find('iframe').contents().find('body');
        if (val === undefined)
        {
            return backBody.html();
        }
        else
        {
            backBody.html(val);
        }
    }
    self.reverse = ko.observable(false);
    self.addNewDeck = function () {

        var newCard = new Card(self.deckId(), self.front(), self.back(), self.reverse());

        repository.addCard(newCard.data);

        self.front('');
        self.back('');
        self.cardsNumber(self.cardsNumber() + 1);
    };
}

var editDeckModel = new EditDeckModel();
ko.applyBindings(editDeckModel, $('#editDeckSection')[0]);

function loadDeckToEdit(deck) {
    editDeckModel.deckId(deck.id);
    editDeckModel.title(deck.title);
    editDeckModel.cardsNumber(deck.cardsNumber);
}