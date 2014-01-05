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
    var cardsNumbers = [];

    if (decks.length == 0)
        bindDecks([]);
    else {
        for (var i = 0; i < decks.length; ++i) {
            cardsNumbers[decks[i].id] = 0;
        }

        repository.getCards(function (cards) {
            for (var i = 0; i < cards.length; ++i) {
                ++cardsNumbers[cards[i].deckId];
            }

            $.each(decks, function (index, element) {
                var deck = element;
                deck.cardsNumber = cardsNumbers[deck.id];
            });

            bindDecks(decks);
        });
    }
}

function bindDecks(decks) {
    decksModel.decks(decks);
}