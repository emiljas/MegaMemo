var Card = function (front, back, reverse) {
	this.deckId = deckId;
	this.front = front;
	this.back = back;
	this.reverse = reverse;

	this.sync = false;
	this.repetitionCount = 0;
	this.easinessFactor = 2.5;
	this.nextRepetitionDate = Date.now;
	this.daysToNextRepetition = 0;
};