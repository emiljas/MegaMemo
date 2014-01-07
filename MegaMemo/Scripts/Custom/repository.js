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
                    thisDB.createObjectStore("decks", { keyPath: "id", autoIncrement: false });
                }

                if (!thisDB.objectStoreNames.contains("cards")) {
                    thisDB.createObjectStore("cards", { keyPath: "id", autoIncrement: false });
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

    self.getDeckLastUpdateDate = function () {
        var date = localStorage.deckLastUpdateDate;

        if(!date)
            date = 0;

        return date;
    };

    self.setDeckLastUpdateDate = function (date) {
        localStorage.deckLastUpdateDate = date;
    };

    self.getNextDeckId = function () {
        var nextDeckId = localStorage.nextDeckId;
        if (!nextDeckId)
            nextDeckId = 1;

        nextDeckId = parseInt(nextDeckId);
        self.setDeckId(nextDeckId + 1);
        return nextDeckId;
    };

    self.setDeckId = function (deckId) {
        localStorage.nextDeckId = deckId;
    };

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

        deck.id = self.getNextDeckId();
        deck.lastUpdateDate = Date.now();

        self.setDeckLastUpdateDate(deck.lastUpdateDate);
        var request = store.add(deck);

        request.onsuccess = function (e) {
            synchronizer.decksToSync.push(deck);
        };
    };

    self.getCardLastUpdateDate = function () {
        var date = localStorage.cardLastUpdateDate;

        if (!date)
            date = 0;

        return date;
    };

    self.setCardLastUpdateDate = function (date) {
        localStorage.cardLastUpdateDate = date;
    };

    self.getNextCardId = function () {
        var nextCardId = localStorage.nextCardId;
        if (!nextCardId)
            nextCardId = 1;

        nextCardId = parseInt(nextCardId);
        self.setCardId(nextCardId + 1);
        return nextCardId;
    };

    self.setCardId = function (cardId) {
        localStorage.nextCardId = cardId;
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

        card.id = self.getNextCardId();
        card.lastUpdateDate = Date.now();
        
        self.setCardLastUpdateDate(card.lastUpdateDate);
        var request = store.add(card);

        request.onsuccess = function () {
            var cards = localStorage.cardsToSync;
            synchronizer.cardsToSync.push(card);
        };
    };

    self.updateCard = function (card) {
        var trans = db.transaction("cards", "readwrite");
        var store = trans.objectStore("cards");

        card.lastUpdateDate = Date.now();

        self.setCardLastUpdateDate(card.lastUpdateDate);
        var request = store.put(card);

        request.onsuccess = function () {
            synchronizer.cardsToSync.push(card);
        };
    }
}

var repository = new Repository();