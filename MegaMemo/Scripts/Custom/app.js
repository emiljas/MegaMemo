if (navigator.onLine) {
    
}

var Logo = function() {
    this.control = document.getElementById('logo');
    this.context =  this.control.getContext('2d'),
    this.width = this.control.width;
    this.height = this.control.height;
};

var SyncStatus = {
    online: 0, //zielona
    offline: 1, //czerwona
    syncInProgress: 2, //zielona pulsująca
    notSync: 3 //czerwona pulsująca
};

function SyncDiode(context, x, y, r, status) {
    this.context = context;
    this.x = x;
    this.y = y;

    this.rGradient1 = r * 0.6;
    this.rGradient2 = r;

    this.status = status;
}

SyncDiode.prototype.draw = function () {
    var color;
    var gradient = this.context.createRadialGradient(this.x, this.y, this.rGradient1, this.x, this.y, this.rGradient2);

    switch (this.status) {
        case SyncStatus.online:
            color = '#12e345';
            break;
        case SyncStatus.offline:
            color = '#A00000';
            break;
        case Status.notSync:
            break;
    }

    gradient.addColorStop(0, color);
    gradient.addColorStop(1, '#FFFFFF');
    this.context.fillStyle = gradient;
    this.context.fillRect(this.x - this.rGradient2, this.y - this.rGradient2, this.x + this.rGradient2, this.y + this.rGradient2);
}



var logo = new Logo();
var syncStatus;

if (navigator.onLine) {
    syncStatus = SyncStatus.online;
}
else {
    syncStatus = SyncStatus.offline;
}

var syncDiode = new SyncDiode(logo.context, logo.width / 2, logo.height / 2, (logo.height / 2) * 0.9, syncStatus);
syncDiode.draw();


window.addEventListener('online', online);
window.addEventListener('offline', offline);

function online() {
    syncDiode.status = SyncStatus.online;
    syncDiode.draw();
}

function offline() {
    syncDiode.status = SyncStatus.offline;
    syncDiode.draw();
}