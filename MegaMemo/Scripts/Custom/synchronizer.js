var Rows = function () {
    var self = this;

    self.decks = [];
    self.cards = [];
}

function Synchronizer() {
    var self = this;

    self.syncLock = false;
    self.rowsToSync = new Rows();

    self.isSync = function () {
        for (var prop in self.rowsToSync) {
            var rows = self.rowsToSync[prop];
            if (rows.length != 0)
                return false;
        }

        return true;
    };

    self.isOnline = false;
    self.setNetworkStatus = function () {
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
                    self.showNetworkStatusAndSynchronize();
                },
                error: function (a, b, c) {
                    self.isOnline = false;
                    self.showNetworkStatusAndSynchronize();
                },
                timeout: 800
            });
        }
        else {
            self.isOnline = false;
            self.showNetworkStatusAndSynchronize();
        }
    };

    self.nextNetworkCheck = function () {
        setTimeout(self.setNetworkStatus, 500);
    };

    self.showNetworkStatusAndSynchronize = function () {
        var sync = self.isSync();

        if (self.isOnline) {
            if (sync) {
                changeStatus(SyncStatus.online);
                self.nextNetworkCheck();
            }
            else {
                changeStatus(SyncStatus.syncInProgress);

                self.synchronize(function () {
                    changeStatus(SyncStatus.online);
                    self.nextNetworkCheck();
                });
            }
        }
        else {
            if (sync)
                changeStatus(SyncStatus.offline);
            else
                changeStatus(SyncStatus.notSync);

            self.nextNetworkCheck();
        }
    };

    self.synchronize = function (afterSyncCallback) {
        self.synchronizeDecks(function () {
            self.synchronizeCards(afterSyncCallback);
        });
    };

    self.synchronizeDecks = function (successCallback) {
        var decks = self.rowsToSync.decks;

        var url = "/Synchronize/SynchronizeDecks";
        $.post(url, { json: JSON.stringify(decks) }, function (data, textStatus) {
            if (data.success) {
                successCallback();
                self.rowsToSync.decks = [];
            }
            else
                self.setNetworkStatus();
        });
    };

    self.synchronizeCards = function (successCallback) {
        var cards = self.rowsToSync.cards;

        var url = "/Synchronize/SynchronizeCards";
        $.post(url, { json: JSON.stringify(cards) }, function (data, textStatus) {
            if (data.success) {
                successCallback();
                self.rowsToSync.cards = [];
            }
            else
                self.setNetworkStatus();
        });
    };

    self.sychronizeFromServer = function (successCallback) {
        self.synchronizeDecksFromServer(function () {
            self.synchronizeCardsFromServer(successCallback);
        });
    };

    self.synchronizeDecksFromServer = function (successCallback) {
        var url = "/Synchronize/GetDecksToSync";
        var deckLastUpdateDate = repository.getDeckLastUpdateDate();
        $.post(url, { lastUpdateDate: deckLastUpdateDate }, function (data, textStatus) {
            if (data.success) {
                var decksFromServer = JSON.parse(data.decks);

                repository.getDecks(function (decks) {
                    var decksToUpdate = decks.filter(function (deck) {
                        return deck.lastUpdateDate > deckLastUpdateDate;
                    });

                    self.updateDecksFromServer(decks, decksFromServer, successCallback);
                });
            }
        });
    };

    self.updateDecksFromServer = function (decksToUpdate, decksFromServer, successCallback) {
        for (var i = 0; i < decksFromServer.length; ++i) {
            var deckFromServer = decksFromServer[i];
            for (var j = 0; j < decksToUpdate.length; ++j) {
                var deckToUpdate = decksToUpdate[j];

                if (deckFromServer.id == deckToUpdate.id) {
                    /* no reason to implement yet */
                    break;
                }
            }

            console.log(deckFromServer);
            repository.addDeck(deckFromServer);
        }

        successCallback();
    };

    self.synchronizeCardsFromServer = function (successCallback) {
        var url = "/Synchronize/GetCardsToSync";
        var cardLastUpdateDate = repository.getCardLastUpdateDate();
        $.post(url, { lastUpdateDate: cardLastUpdateDate }, function (data, textStatus) {
            if (data.success) {

                console.log(data.cards);

                successCallback();
            }
        });
    };

    self.setNetworkStatus();
}

var synchronizer = new Synchronizer();