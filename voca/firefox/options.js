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

function loadStoredValues(){
	browser.runtime.sendMessage({
		src: "options.js",
		msg: "loadStoredValues()",
		level: "v"
	});
	browser.storage.local.get(DEFAULT_SETTINGS)
	.then( (res) => {
		console.log(res);
		let api = res.API || DEFAULT_SETTINGS.API;
		let port = res.PORT || DEFAULT_SETTINGS.PORT;
		document.getElementById('api-url').value = api;
		document.getElementById('api-port').value = port;
		document.getElementById('api-key').value = res.API_KEY || DEFAULT_SETTINGS.API_KEY;
		document.getElementById('highlight-color').value = res.HIGHLIGHT_COLOR || DEFAULT_SETTINGS.HIGHLIGHT_COLOR;
		document.getElementById('translation-hotkey').value = res.TRANSLATION_HOTKEY || DEFAULT_SETTINGS.TRANSLATION_HOTKEY;
		
		var sourceLang = res.SOURCE_LANG || DEFAULT_SETTINGS.SOURCE_LANG;
		var targetLang = res.TARGET_LANG || DEFAULT_SETTINGS.TARGET_LANG;

		//console.log(api+":"+port+"/languages");
		
		fetch(api+":"+port+"/languages", {
			method: "GET",
			mode: 'no-cors'
		})
		.then( response => response.json())
		.then( data => {
			console.log(data);
			var sourceSelect = document.getElementById('source-language-select');
			var targetSelect = document.getElementById('target-language-select');

			//document.getElementById('api-url').value=data[0].name;

			//add Auto option first
			sourceSelect.add(new Option("Auto", "auto"));

			for(let i=0; i < data.length; i++){
				//load up the selections
				//let opt = document.createElement('OPTION');
				//opt.value = data[i].code;
				//opt.innerText = data[i].name;
				let opt = new Option(data[i].name, data[i].code);
				let opt2 = new Option(data[i].name, data[i].code);

				sourceSelect.add(opt);
				targetSelect.add(opt2);
			}
			

			//now set the values to defaults
			//console.log(sourceLang); console.log(targetLang);

			sourceSelect.value = sourceLang;
			targetSelect.value = targetLang;

		})
		.catch( error => {
			console.log(error);
		});
	});

	/*browser.storage.sync.get('api_port')
	.then( (res) => {
		document.getElementById('api-port').value = res.api_port || DEFAULT_SETTINGS.PORT;
	});

	browser.storage.sync.get('highlight_color')
	.then( (res) => {
		document.getElementById('highlight-color').value = res.highlight_color || DEFAULT_SETTINGS.HIGHLIGHT_COLOR;
	});

	browser.storage.sync.get('translation_hotkey')
	.then( (res) => {
		document.getElementById('translation-hotkey').value = res.translation_hotkey || DEFAULT_SETTINGS.TRANSLATION_HOTKEY;
	});*/

	/*browser.storage.sync.get('source_lang')
	.then( (res) => {
		document.getElementById('source-language-select').value = res.api_url || DEFAULT_SETTINGS.API
	});*/

	//document.getElementById("api-url").value = "helllo!";

	document.getElementById('restore-defaults').onclick = restoreDefaults;

	document.getElementById('settings-form').onsubmit = saveSettings;
}

function restoreDefaults(){
	document.getElementById('api-url').value = DEFAULT_SETTINGS.API;
	document.getElementById('api-port').value = DEFAULT_SETTINGS.PORT;
	document.getElementById('highlight-color').value = DEFAULT_SETTINGS.HIGHLIGHT_COLOR;
	document.getElementById('translation-hotkey').value = DEFAULT_SETTINGS.TRANSLATION_HOTKEY;
	document.getElementById('source-language-select').value = DEFAULT_SETTINGS.SOURCE_LANG;
	document.getElementById('target-language-select').value = DEFAULT_SETTINGS.TARGET_LANG;
}

function saveSettings(){
	let sourceSelect = document.getElementById('source-language-select');
	let targetSelect = document.getElementById('target-language-select');

	//console.log(sourceSelect.options[sourceSelect.selectedIndex].value);
	//console.log(targetSelect.options[targetSelect.selectedIndex].value);
	try{
		var sourceLang = sourceSelect.options[sourceSelect.selectedIndex].value;
	}catch(e){
		var sourceLang = DEFAULT_SETTINGS.SOURCE_LANG
	}

	try{
		var targetLang = targetSelect.options[targetSelect.selectedIndex].value;
	}catch(e){
		var targetLang = DEFAULT_SETTINGS.TARGET_LANG
	}

	let settings = {
		API : document.getElementById('api-url').value,
		PORT : document.getElementById('api-port').value,
		API_KEY : document.getElementById('api-key').value,
		HIGHLIGHT_COLOR : document.getElementById('highlight-color').value,
		TRANSLATION_HOTKEY : document.getElementById('translation-hotkey').value,
		SOURCE_LANG : sourceLang,
		TARGET_LANG : targetLang
	};
	
	browser.storage.local.set(settings);
	//.then( () => { console.log("settings saved"); })
	//.catch( (err) => { console.log(err); });
}

document.addEventListener("DOMContentLoaded", loadStoredValues);
