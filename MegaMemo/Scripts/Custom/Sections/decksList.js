setDefaultButton('#newDeckContainer', '#newDeckContainer .btn');

function DecksModel() {
    var self = this;

    self.decks = ko.observableArray();

    self.newDeckTitle = ko.observable('');

    self.addDeck = function () {
        if (self.newDeckTitle() !== '') {
            var newDeck = {
                title: self.newDeckTitle(),
                cardsNumber: 0,
                sync: false
            };

            self.decks.push(newDeck);

            self.newDeckTitle('');

            repository.addDeck(newDeck);

            synchronizer.newDecks.push(newDeck);
        }
    };

    self.clickAction = function (event) {
        var deck = event;

        if (deck.id != undefined) {
            showSection('editDeckSection');
            loadDeckToEdit(deck.id);
        }
    };

    self.removeDeck = function () {
        self.decks.remove(this);
    };
};

var decksModel = new DecksModel();
ko.applyBindings(decksModel, $('#decksSection')[0]);

function loadDecks(decks) {
    $.each(decks, function (index, element) {
        repository.getCardByDeckId(element.id, function (cards) {
            element.cardsNumber = cards.length;
        });
    });

    decksModel.decks(decks);
}