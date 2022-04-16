/*try{
	importScripts("common.js");
}catch(e){
	console.log(e);
}*/

console.log("from common.js");
console.log(getDefaultSettings());

const DEFAULT_SETTINGS = getDefaultSettings();

/*{
	API: "https://translate.argosopentech.com",
	PORT: 443, //5000 is real default...
	API_KEY: "",
	HIGHLIGHT_COLOR: "#00FFFF",
	TRANSLATION_HOTKEY : "Alt",
	SOURCE_LANG : "auto",
	TARGET_LANG : "es"
};*/

const ports = [];

function findTabPort(ports, tabId){
	console.log(ports);
	for(i=0; i < ports.length; i++){
		//ports is a sparxe array
		if(ports[i] && ports[i].sender.tab.id == tabId){
			return ports[i];
		}
	}
	return false;
}

//called by popup.js to translate the full page of the active tab
function activeTabTranslatePage(){
	console.log("activeTabTranslatePage()");
	const querying = browser.tabs.query({currentWindow: true, active: true});
	querying.then(onTabs, function(error){
		console.log(error);
	});
}

function onTabs(tabs){
	//should only be one with that query...
	//console.log(tabs);
	if(tabs.length < 1){ return; }

	let port = ports[tabs[0].id];//findTabPort(ports, tabs[0].id);
	if(port !== false){
		port.postMessage({
			src: "background.js",
			type: "translatePage"
		});
	}else{
		console.log("no port connected for active tab.");
	}

/*
	let activeTab = tabs[0];

	console.log(activeTab);

	browser.tabs.sendMessage(
		activeTab.index,//activeTab.id,
		{
			type: "translatePage"
		}
	);
*/
}

browser.runtime.onMessage.addListener(function(msg){
	//console.log(msg);
});

browser.runtime.onConnect.addListener( p => {
	//console.log(p);
	ports[p.sender.tab.id] = p;
	
	//push latest settings on connect, content scripts have no way to get them directly
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
	//console.log(changes);
	//console.log(type);
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
