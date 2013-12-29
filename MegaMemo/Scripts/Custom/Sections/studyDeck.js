var statusEnum = {
    question: 1,
    answer: 2
};

function StudyDeckModel() {
    var self = this;

    self.status = ko.observable();

    self.i;
    self.cards;
    self.front = ko.observable();
    self.back = ko.observable();

    self.showAnswer = function () {
        self.status(statusEnum.answer);
    };

    self.makeReview = function (grade) {
        self.status(statusEnum.question);

        var card = self.cards[self.i];

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
        showSection('studyListSection');
    }
    else {
        studyDeckModel.front(card.front);
        studyDeckModel.back(card.back);
    }
}