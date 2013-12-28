function StudyModel() {
    var self = this;

    self.decksToReview = ko.observableArray();
};

ko.applyBindings(new StudyModel(), $('#studyListSection')[0]);

function loadDecksToReview(decks) {
    
}