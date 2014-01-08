var statusEnum = {
    question: 1,
    answer: 2
};

function StudyDeckModel() {
    var self = this;

    self.status = ko.observable();

    self.i = -1;
    self.cards;
    self.front = ko.observable();
    self.back = ko.observable();

    self.showAnswer = function () {
        self.status(statusEnum.answer);
    };

    self.makeReview = function (grade) {
        self.status(statusEnum.question);

        var card = self.cards[self.i];

        if (!card) {
            showSection('studyListSection');
            return;
        }

        Card.makeReview(card, grade);
        repository.updateCard(card);

        showNextCard();
    };
}

var studyDeckModel = new StudyDeckModel();
ko.applyBindings(studyDeckModel, $('#studyDeckSection')[0]);

function loadCardsToReview(cards) {
    studyDeckModel.i = -1;
    studyDeckModel.cards = cards;

    showNextCard();
}

function showNextCard() {
    studyDeckModel.status(statusEnum.question);

    ++studyDeckModel.i;
    var card = studyDeckModel.cards[studyDeckModel.i];
    
    if (card == undefined) {
        var deckId = studyDeckModel.cards[0].deckId;

        repository.getDecks(function (decks) {
            loadDecksToReview(decks, function () {

                var decksToReview = studyModel.decksToReview();

                if (decksToReview.length == 0) {
                    showSection('studyListSection');
                }
                else
                    for (var i = 0; i < decksToReview.length; ++i) {
                        var deck = decksToReview[i];

                        if (deck.id == deckId) {
                            
                            if (deck.cards == undefined || deck.cards.length == 0) {
                                showSection('studyListSection');
                                break;
                            }
                            else {
                                loadCardsToReview(deck.cards);
                                break;
                            }
                        }
                    }
            });
        });
    }
    else {
        studyDeckModel.front(card.front);
        studyDeckModel.back(card.back);
    }
}