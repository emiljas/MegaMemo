var Card = function (deckId, front, back, reverse) {
    var self = this;
    self.data = {
        deckId: deckId,
        front: front,
        back: back,
        
        repetitionCount: 0,
        easinessFactor: 2.5,
        nextRepetitionDate: Date.now(),
        daysToNextRepetition: 0
    };
};

Card.makeReview = function (data, grade) {
    if (grade < 3) {
        data.repetitionCount = 0;
        data.nextRepetitionDate = Date.now();
        data.daysToNextRepetition = 0;
    }
    else {
        ++data.repetitionCount;

        if (data.repetitionCount == 1)
            data.daysToNextRepetition = 1;
        else if (data.repetitionCount == 2)
            data.daysToNextRepetition = 6;
        else
            data.daysToNextRepetition = parseInt(data.daysToNextRepetition * data.easinessFactor);

        daysToNextRepetition = data.daysToNextRepetition;
        data.nextRepetitionDate = moment(data.nextRepetitionDate).add('days', data.daysToNextRepetition).valueOf();
    }

    data.easinessFactor = data.easinessFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
 
    if (data.easinessFactor < 1.3)
        data.easinessFactor = 1.3;
};