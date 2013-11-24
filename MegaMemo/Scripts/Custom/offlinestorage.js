setDefaultButton('#newDeckContainer', '#newDeckContainer .btn');

var idbSupported = false;
var db;

document.addEventListener("DOMContentLoaded", function () {
	if ("indexedDB" in window) {
		idbSupported = true;
	}

	if (idbSupported) {
		var openRequest = indexedDB.open("mmdb", 1);

		openRequest.onupgradeneeded = function (e) {
			console.log("Upgrading...");

			var thisDB = e.target.result;

			if (!thisDB.objectStoreNames.contains("decks")) {
				thisDB.createObjectStore("decks");
			}
		}

		openRequest.onsuccess = function (e) {
			console.log("Success!");
			db = e.target.result;
		}

		openRequest.onerror = function (e) {
			console.log("Error");
			console.dir(e);
		}
	}
}, false);

function Synchronizer() {
    var self = this;
    
    self.newDecks = [];

    self.lock = false;
    self.synchronize = setInterval(function () {
        if (self.lock)
            return;

        self.lock = true;

        if (self.newDecks.length !== 0) {
            if (navigator.onLine)
                changeStatus(SyncStatus.syncInProgress);
            else
                changeStatus(SyncStatus.notSync);
        }
        else {
            if (navigator.onLine)
                changeStatus(SyncStatus.online);
            else
                changeStatus(SyncStatus.offline);
        }

        //for presentation purpose only
        setTimeout(function () {
            self.lock = false;
        }, 2500);


        if (navigator.onLine) {
            self.newDecks = [];
        }

    }, 500);
}

var synchronizer = new Synchronizer();

function AppViewModel() {
    var self = this;

    self.decks = ko.observableArray();
    self.newDeckTitle = ko.observable('');
    self.addDeck = function () {
        if (self.newDeckTitle() !== '') {
            var newDeck = {
                id: -1,
                title: self.newDeckTitle(),
                notesNumber: 0
            };

            self.decks.push(newDeck);
            self.newDeckTitle('');

            synchronizer.newDecks.push(newDeck);
        }
    };
    self.removeDeck = function () {
        self.decks.remove(this);
    };
};

var viewModel = new AppViewModel();
ko.applyBindings(viewModel);