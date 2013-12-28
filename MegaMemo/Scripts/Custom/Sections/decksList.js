setDefaultButton('#newDeckContainer', '#newDeckContainer .btn');

function DecksModel() {
    var self = this;

    self.decks = ko.observableArray();

    self.newDeckTitle = ko.observable('');

    self.addDeck = function () {
        if (self.newDeckTitle() !== '') {
            var newDeck = {
                title: self.newDeckTitle(),
                sync: false
            };

            repository.addDeck(newDeck);
            synchronizer.newDecks.push(newDeck);

            newDeck.cardsNumber = 0;
            self.decks.push(newDeck);

            self.newDeckTitle('');
        }
    };

    self.clickAction = function (event) {
        var deck = event;
        if (deck.id != undefined) {
            showSection('editDeckSection', deck);
        }
    };

    self.removeDeck = function () {
        self.decks.remove(this);
    };
};

var decksModel = new DecksModel();
ko.applyBindings(decksModel, $('#decksSection')[0]);


function loadDecks(decks) {
    var i = 0;

    if (decks.length == 0)
        bindDecks([]);
    else {
        $.each(decks, function (index, element) {
            repository.getCardsByDeckId(element.id, function (cards) {
                element.cardsNumber = cards.length;
                
                ++i;

                if (i == decks.length) {
                    bindDecks(decks);
                }
            });
        });
    }
}

function bindDecks(decks) {
    decksModel.decks(decks);
}