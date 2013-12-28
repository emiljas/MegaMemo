$('.helpLink').click(showAppGuide);

function showAppGuide() {
	var logosDemo = "\
		<div id='logoDemoContainer' class='center'>\
		This offline web app will help you learn <b>new language</b> or <b>whatever you want</b>.\
			<table id='appGuideTable'>\
                <tr>\
                    <td>deck</td>\
                    <td>group of cards (e.g. spanish words)</td>\
                </tr>\
                <tr>\
                    <td>card</td>\
                    <td>this is question and answer<br />(e.g. front: dog, back: perro)</td>\
                </tr>\
				<tr>\
					<td><canvas id='onlineLogo' width='50' height='50'></canvas></td>\
					<td>you're online</td>\
				</tr>\
				<tr>\
					<td><canvas id='offlineLogo' width='50' height='50'></canvas></td>\
					<td>you're offline</td>\
				</tr>\
				<tr>\
					<td><canvas id='syncInProgressLogo' width='50' height='50'></canvas></td>\
					<td>synchronizing in progress</td>\
				</tr>\
				<tr>\
					<td><canvas id='notSyncLogo' width='50' height='50'></canvas></td>\
					<td>connect to internet to synchronize</td>\
				</tr>\
			</table>\
		</div>";

	bootbox.alert(logosDemo);

	var onlineLogo = new Logo('onlineLogo', 'rgba(255, 255, 255, 0)', SyncStatus.online);
	var offlineLogo = new Logo('offlineLogo', 'rgba(255, 255, 255, 0)', SyncStatus.offline);
	var syncInProgressLogo = new Logo('syncInProgressLogo', 'rgba(255, 255, 255, 0)', SyncStatus.syncInProgress);
	var notSyncLogo = new Logo('notSyncLogo', 'rgba(255, 255, 255, 0)', SyncStatus.notSync);
}