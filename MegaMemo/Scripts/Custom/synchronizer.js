function LocalStorageArray(id) {
    var self = this;

    self.clean = function () {
        localStorage[id] = JSON.stringify([]);
    };

    self.push = function (o) {
        var array = JSON.parse(localStorage[id]);
        array.push(o);
        localStorage[id] = JSON.stringify(array);
    };

    self.get = function () {
        var array = JSON.parse(localStorage[id]);
        return array;
    };

    self.clean();
};

function Synchronizer() {
    var self = this;

    self.syncLock = false;

    self.decksToSync = new LocalStorageArray("decksToSync");
    self.cardsToSync = new LocalStorageArray("cardsToSync");

    self.isSync = function () {
        if (self.decksToSync.get().length != 0)
            return false;

        if (self.cardsToSync.get().length != 0)
            return false;

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
        var decks = self.decksToSync.get();

        var url = "/Synchronize/SynchronizeDecks";
        $.post(url, { json: JSON.stringify(decks) }, function (data, textStatus) {
            if (data.success) {
                successCallback();
                self.decksToSync.clean();
            }
            else
                self.setNetworkStatus();
        });
    };

    self.synchronizeCards = function (successCallback) {
        var cards = self.cardsToSync.get();

        var url = "/Synchronize/SynchronizeCards";
        $.post(url, { json: JSON.stringify(cards) }, function (data, textStatus) {
            if (data.success) {
                successCallback();
                self.cardsToSync.clean();
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

                    self.updateDecksFromServer(decksToUpdate, decksFromServer, successCallback);
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

            repository.addDeck(deckFromServer);
        }

        successCallback();
    };

    self.synchronizeCardsFromServer = function (successCallback) {
        var url = "/Synchronize/GetCardsToSync";
        var cardLastUpdateDate = repository.getCardLastUpdateDate();
        $.post(url, { lastUpdateDate: cardLastUpdateDate }, function (data, textStatus) {
            if (data.success) {
                var cardsFromServer = JSON.parse(data.cards);

                repository.getCards(function (cards) {
                    var cardsToUpdate = cards.filter(function (card) {
                        return card.lastUpdateDate > cardLastUpdateDate;
                    });

                    self.updateCardsFromServer(cardsToUpdate, cardsFromServer, successCallback);
                });
            }
        });
    };

    self.updateCardsFromServer = function (cardsToUpdate, cardsFromServer, successCallback) {
        for (var i = 0; i < cardsFromServer.length; ++i) {
            var cardFromServer = cardsFromServer[i];
            for (var j = 0; j < cardsToUpdate.length; ++j) {
                var cardToUpdate = cardsToUpdate[j];

                if (cardFromServer.id == cardToUpdate.id) {
                    repository.updateCard(cardFromServer);
                    break;
                }
            }

            repository.addCard(cardFromServer);
        }

        successCallback();
    };

    self.setNetworkStatus();
}

var synchronizer = new Synchronizer();