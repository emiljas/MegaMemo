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

        var request = store.add(deck);

        request.onsuccess = function (e) {
            deck.id = e.srcElement.result;
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
        }
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

        var request = store.add(card);
    };

    self.updateCard = function (card) {
        var trans = db.transaction("cards", "readwrite");
        var store = trans.objectStore("cards");

        var request = store.put(card);
    }
}

var repository = new Repository();

function Synchronizer() {
    var self = this;

    self.rowsToSync = {
        decks: [],
        cards: []
    };
    self.isSync = function () {
        for (var prop in self.rowsToSync) {
            var rows = self.rowsToSync[prop];
            if (rows.length != 0)
                return false;
        }

        return true;
    }

    self.lockObject = false;
    self.isLock = function () {
        return self.lockObject;
    };
    self.lock = function () {
        self.lockObject = true;
    };
    self.unlock = function (callback) {
        if(callback)
            callback();
        else
            self.lockObject = false;
    };

    self.isOnline = false;
    self.setNetworkStatusIntervalId = setInterval(function () {
        if (self.isLock())
            return;

        self.lock();

        var isOnline = navigator.onLine;

        if (isOnline) {
            /* we must check this */

            $.ajax({
                type: "POST",
                url: "/",
                data: {},
                cache: false,
                success: function (a, b, c) {
                    self.isOnline = true;
                    self.unlock(self.synchronize);
                },
                error: function (a, b, c) {
                    self.isOnline = false;
                    self.unlock(self.synchronize);
                },
                timeout: 800
            });
        }
        else {
            self.isOnline = false;
            self.unlock(self.synchronize);
        }
    }, 500);

    self.synchronize = function () {
        var sync = self.isSync();

        if (self.isOnline) {
            if (sync)
                changeStatus(SyncStatus.online);
            else {

            }
        }
        else {
            if (sync)
                changeStatus(SyncStatus.offline);
            else
                changeStatus(SyncStatus.notSync);
        }

        self.unlock();

        /*if (self.newDecks.length !== 0) {
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
        }*/
    };
}

var synchronizer = new Synchronizer();