var Card = function (deckId, front, back, reverse) {
    var self = this;
    self.data = {
        deckId: deckId,
        front: front,
        back: back,
        reverse: reverse,

        sync: false,
        repetitionCount: 0,
        easinessFactor: 2.5,
        nextRepetitionDate: new Date(Date.now()),
        daysToNextRepetition: 0
    };
};