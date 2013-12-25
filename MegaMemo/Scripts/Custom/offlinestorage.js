var Repository = function () {
    var self = this;

    var idbSupported = false;
    var db;

    document.addEventListener("DOMContentLoaded", function () {
        if ("indexedDB" in window) {
            idbSupported = true;
        }

        if (idbSupported) {
            var openRequest = indexedDB.open("mmdb", 2);

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

                self.getDecks(loadDecks);
            }

            openRequest.onerror = function (e) {
                console.log("Error");
                console.dir(e);
            }
        }
    }, false);

    self.getDecks = function (callback) {
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

    self.addDeck = function (deck) {
        var trans = db.transaction(["decks"], "readwrite");
        var store = trans.objectStore("decks");

        var request = store.add(deck);

        request.onsuccess = function (e) {
            deck.id = e.srcElement.result;
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    };

    self.getCardByDeckId = function (deckId, callback) {
        var trans = db.transaction(["cards"], "readwrite");
        var store = trans.objectStore("cards");

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
            if (cursor && cursor.value.deckId == deckId) {
                items.push(cursor.value);
                cursor.continue();
            }
        };
    };

    self.addCard = function (card) {

        var trans = db.transaction(["cards"], "readwrite");
        var store = trans.objectStore("cards");

        //console.log(card);

        var request = store.add(card);
    };
}

var repository = new Repository();

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