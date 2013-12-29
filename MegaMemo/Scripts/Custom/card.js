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
        nextRepetitionDate: Date.now(),
        daysToNextRepetition: 0
    };

    self.makeReview = function (grade) {
        var easinessFactor = self.data.easinessFactor;
        var nextRepetitionDate = self.data.nextRepetitionDate;
        var daysToNextRepetition = self.data.daysToNextRepetition;

        if (grade < 3) {
            self.data.repetitionCount = 0;
            self.data.nextRepetitionDate = Data.now();
            self.data.daysToNextRepetition = 0;
        }
        else {
            ++self.data.repetitionCount;

            if (self.data.repetitionCount == 1)
                self.data.daysToNextRepetition = 1;
            else if (self.data.repetitionCount == 2)
                self.data.daysToNextRepetition = 6;
            else
                self.data.daysToNextRepetition = parseInt(daysToNextRepetition * easinessFactor);

            daysToNextRepetition = self.data.daysToNextRepetition;
            self.data.nextRepetitionDate = moment(nextRepetitionDate).add('days', daysToNextRepetition);
        }

        self.data.easinessFactor = easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));

        if (self.data.easinessFactor < 1.3)
            self.data.easinessFactor = 1.3;
    };
};