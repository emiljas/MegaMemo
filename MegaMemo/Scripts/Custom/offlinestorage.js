setDefaultButton('#newDeckContainer', '#newDeckContainer .btn');

var idbSupported = false;
var db;

//var decksStore;

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
			    thisDB.createObjectStore("decks", { keyPath: "id", autoIncrement: true });
			}

			if (!thisDB.objectStoreNames.contains("cards")) {
			    thisDB.createObjectStore("cards", { keyPath: "id", autoIncrement: true });
			}
		}

		openRequest.onsuccess = function (e) {
			db = e.target.result;

			//decksStore = db.obj

			getDecks(loadDecks);
		}

		openRequest.onerror = function (e) {
			console.log("Error");
			console.dir(e);
		}
	}
}, false);

function getDecks(callback) {
    var trans = db.transaction("decks", "readwrite");
    var store = trans.objectStore("decks");
    var items = [];

    trans.oncomplete = function (evt) {
        callback(items);
    };

    var cursorRequest = store.openCursor();

    cursorRequest.onerror = function (error) {
        console.log(error);
    };

    cursorRequest.onsuccess = function (evt) {
        var cursor = evt.target.result;
        if (cursor) {
            items.push(cursor.value);
            cursor.continue();
        }
    };
}

function addDeck(deck) {
    var trans = db.transaction(["decks"], "readwrite");
    var store = trans.objectStore("decks");
    var request = store.add(deck);
    /*
    request.onsuccess = function (e) {
        console.log('dodano nowe deck');
    };

    request.onerror = function (e) {
        console.log(e.value);
    };*/
};

function addCard(card)
{
    var trans = db.transaction(["cards"], "readwrite");
    var store = trans.objectStore("cards");
    var request = store.add(card);
}

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

function DecksModel() {
    var self = this;

    self.decks = ko.observableArray();

    self.newDeckTitle = ko.observable('');
    self.addDeck = function () {
        if (self.newDeckTitle() !== '') {
            var newDeck = {
                title: self.newDeckTitle(),
                cardsNumber: 0,
                sync: false
            };

            self.decks.push(newDeck);
            self.newDeckTitle('');

            addDeck(newDeck);

            synchronizer.newDecks.push(newDeck);
        }
    };

    self.removeDeck = function () {
        self.decks.remove(this);
    };
};

var decksModel = new DecksModel();
ko.applyBindings(decksModel, $('#decksSection')[0]);

function loadDecks(decks) {
    decksModel.decks(decks);
}