function StudyDeck() {
    var self = this;

    self.title = '';
    self.cardsNumber = 0;
    self.cards = [];
};

function StudyModel() {
    var self = this;

    self.decksToReview = ko.observableArray();
};

var studyModel = new StudyModel();
ko.applyBindings(studyModel, $('#studyListSection')[0]);

function loadDecksToReview(decks) {
    var decksToReview = [];

    var now = moment();

    repository.getCards(function (cards) {
        for (var i = 0; i < cards.length; ++i) {
            var card = cards[i];

            var date = moment(card.nextRepetitionDate);
            if (now.diff(date, 'days') <= 0) {
                if (decksToReview[card.deckId] == undefined)
                    decksToReview[card.deckId] = new StudyDeck();

                decksToReview[card.deckId].cards.push(card);
                ++decksToReview[card.deckId].cardsNumber;
            }
        }

        for (var i = 0; i < decks.length; ++i) {
            var deck = decks[i];
            if (decksToReview[deck.id] != undefined) {
                decksToReview[deck.id].title = deck.title;
            }
        }

        for (var i = decksToReview.length - 1; i >= 0; --i) {
            if (decksToReview[i] == undefined) {
                decksToReview.splice(i, 1);
            }
        }

        studyModel.decksToReview(decksToReview);
    });
};