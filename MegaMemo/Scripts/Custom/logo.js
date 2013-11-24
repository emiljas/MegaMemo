var Logo = function (id, bgcolor, syncStatus) {
    this.control = document.getElementById(id);
    this.context =  this.control.getContext('2d'),
    this.width = this.control.width;
    this.height = this.control.height;

    if (!syncStatus) {
        if (navigator.onLine) {
            syncStatus = SyncStatus.online;
        }
        else {
            syncStatus = SyncStatus.offline;
        }
    }

    this.syncDiode = new SyncDiode(this.context,
                                   this.width / 2,
                                   this.height / 2,
                                   (this.height / 2) * 0.9,
                                   syncStatus,
                                   bgcolor);

    this.syncDiode.draw();
};

var SyncStatus = {
    online: 0, //zielona
    offline: 1, //czerwona
    syncInProgress: 2, //zielona pulsująca
    notSync: 3 //czerwona pulsująca
};

function SyncDiode(context, x, y, r, status, bgcolor) {
    this.context = context;
    this.x = x;
    this.y = y;

    this.rGradient1 = r * 0.6;
    this.rGradient2 = r;

    this.status = status;
    this.color;
    this.bgcolor = bgcolor;
    this.pulseIntervalId = null;
    this.pulseSign = -1;
}

SyncDiode.prototype.draw = function () {
    switch (this.status) {
        case SyncStatus.online:
            this.color = '#12e345';
            this.disablePulse();
            this.refresh();
            break;
        case SyncStatus.offline:
            this.color = '#A00000';
            this.disablePulse();
            this.refresh();
            break;
        case SyncStatus.syncInProgress:
            this.color = '#12e345';
            this.enablePulse();
            break;
        case SyncStatus.notSync:
            this.color = '#A00000';
            this.enablePulse();
            break;
    }
}

SyncDiode.prototype.enablePulse = function () {
    var self = this;

    clearInterval(this.pulseIntervalId);
    this.pulseIntervalId = setInterval(function () {
        var diff = self.rGradient1 / 10;

        if (self.rGradient1 < 0.1 * self.rGradient2) {
            self.pulseSign = 1;
        }
        else if(self.rGradient1 > self.rGradient2 * 0.6) {
            self.pulseSign = -1;
        }

        self.rGradient1 += (diff * self.pulseSign);
        self.refresh();
    }, 18);
}

SyncDiode.prototype.disablePulse = function () {
    clearInterval(this.pulseIntervalId);
    this.rGradient1 = this.rGradient2 * 0.6;
}

SyncDiode.prototype.refresh = function () {
    this.context.clearRect(0, 0, 500, 500);

    var gradient = this.context.createRadialGradient(this.x,
                                                 this.y,
                                                 this.rGradient1,
                                                 this.x,
                                                 this.y,
                                                 this.rGradient2);

    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.bgcolor);
    this.context.fillStyle = gradient;
    this.context.fillRect(this.x - this.rGradient2,
                          this.y - this.rGradient2,
                          this.x + this.rGradient2,
                          this.y + this.rGradient2);
}

var logo = new Logo('logo', 'rgba(10, 10, 10, 0)');
var syncDiode = logo.syncDiode;

//window.addEventListener('online', function () { changeStatus(SyncStatus.online) });
//window.addEventListener('offline', function () { changeStatus(SyncStatus.offline) });

function changeStatus(status) {
    syncDiode.status = status;
    syncDiode.draw();
}