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
        self.synchronizeDecks(self.synchronizeCards);
        self.synchronizeCards(afterSyncCallback);
    };

    self.synchronizeDecks = function (successCallback) {
        var decks = self.rowsToSync.decks;

        var url = "/Synchronize/SynchronizeDecks";
        $.post(url, { json: JSON.stringify(decks) }, function (data, textStatus) {
            if (data.success)
                successCallback();
            else
                self.setNetworkStatus();
        });
    };

    self.synchronizeCards = function (successCallback) {
        var cards = self.rowsToSync.cards;

        url = "/Synchronize/SynchronizeCards";
        $.post(url, { json: JSON.stringify(cards) }, function (data, textStatus) {
            if (data.success)
                successCallback();
            else
                self.setNetworkStatus();
        });
    };

    self.setNetworkStatus();
}

var synchronizer = new Synchronizer();