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

                db.onerror = function (event) {
                    alert("Database error: " + event.currentTarget.target.errorCode);
                }

                appStart();
            }

            openRequest.onerror = function (e) {
                console.log("Error");
                console.dir(e);
            }
        }
    }, false);

    self.getDecks = function (callback) {
        var trans = db.transaction("decks");
        var store = trans.objectStore("decks");
        var items = [];

        trans.oncomplete = function (evt) {
            callback(items);
        };

        var cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result;
            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            }
        };
    }

    self.addDeck = function (deck) {
        var trans = db.transaction("decks", "readwrite");
        var store = trans.objectStore("decks");

        deck.lastUpdateDate = Date.now();
        var request = store.add(deck);

        request.onsuccess = function (e) {
            deck.id = e.srcElement.result;

            synchronizer.rowsToSync.decks.push(deck);
        };
    };

    self.getCards = function (callback) {
        var trans = db.transaction("cards");
        var store = trans.objectStore("cards");

        var items = [];

        trans.oncomplete = function (evt) {
            callback(items);
        }

        var cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result;

            if (cursor) {
                items.push(cursor.value);
                cursor.continue();
            }
        };
    };

    self.getCardsByDeckId = function (deckId, callback) {
        var trans = db.transaction("cards");
        var store = trans.objectStore("cards");

        var items = [];

        trans.oncomplete = function (evt) {
            callback(items);
        };

        var cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (evt) {
            var cursor = evt.target.result;

            if (cursor && cursor.value.deckId == deckId)
                items.push(cursor.value);

            if(cursor)
                cursor.continue();
        };
    };

    self.addCard = function (card) {
        var trans = db.transaction("cards", "readwrite");
        var store = trans.objectStore("cards");

        card.lastUpdateDate = Date.now();
        var request = store.add(card);

        request.onsuccess = function () {
            synchronizer.rowsToSync.cards.push(card);
        };
    };

    self.updateCard = function (card) {
        var trans = db.transaction("cards", "readwrite");
        var store = trans.objectStore("cards");

        card.lastUpdateDate = Date.now();
        var request = store.put(card);

        request.onsuccess = function () {
            synchronizer.rowsToSync.cards.push(card);
        };
    }
}

var repository = new Repository();