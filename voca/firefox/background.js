const DEFAULT_SETTINGS = {
	API: "https://translate.argosopentech.com",
	PORT: 443, //5000 is real default...
	API_KEY: "",
	HIGHLIGHT_COLOR: "#00FFFF",
	TRANSLATION_HOTKEY : "Alt",
	SOURCE_LANG : "auto",
	TARGET_LANG : "es"
};

const ports = [];

browser.runtime.onMessage.addListener(function(msg){
	console.log(msg);
});

browser.runtime.onConnect.addListener( p => {
	console.log(p);
	ports[p.sender.tab.id] = p;

	
	//push latest settigns on connect
	browser.storage.local.get(DEFAULT_SETTINGS)
	.then( (res) => {
		p.postMessage({
			src: "background.js",
			type: "settings",
			settings: res
		});
	});
});

browser.storage.onChanged.addListener(function(changes, type){
	console.log(changes);
	console.log(type);
	if(type == "local"){
		//tell all of the client tabs to merge the new copy
		//NOTE changes looks like this:
		/*{
			key : {oldValue: "old", newValue: "new"}
		}*/
		//whereas the stuff we're updating is just:
		/*{
			key : "value"
		}*/

		ports.forEach( p => {
			p.postMessage({
				src: "background.js",
				type: "settingsChanged",
				changes: changes
			});
		});

	}
});

//browser.runtime.
