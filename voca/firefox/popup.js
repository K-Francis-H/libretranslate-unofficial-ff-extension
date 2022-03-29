const DEFAULT_SETTINGS = {
	API: "http://192.168.0.40",
	PORT: 5001, //5000 is real default...
	API_KEY: "",
	HIGHLIGHT_COLOR: "#00FFFF",
	TRANSLATION_HOTKEY : "Alt",
	SOURCE_LANG : "auto",
	TARGET_LANG : "es"
};

var settings = DEFAULT_SETTINGS;

function applySettings(s){
	document.getElementById("source-lang").value = s.SOURCE_LANG || DEFAULT_SETTINGS.SOURCE_LANG;
	document.getElementById("target-lang").value = s.TARGET_LANG || DEFAULT_SETTINGS.TARGET_LANG;
}

function translate(){
	var sourceSelect = document.getElementById("source-lang");
	var targetSelect = document.getElementById("target-lang");

	var sourceText = document.getElementById("source-lang-text").value;
	var sourceLang = sourceSelect.value;

	console.log(sourceText);
	console.log(document.getElementById("source-lang-text"));

	console.log(settings.API+":"+settings.PORT+"/translate");

	let payload = {
		method: "POST",
		body: JSON.stringify({
			q: sourceText,
			source: sourceSelect.value, //TODO detect beforehand to save time
			target: targetSelect.value
		}),
		//mode: 'no-cors',
		headers: {"Content-type": "application/json"}
	};
	console.log(payload);

	fetch(settings.API+":"+settings.PORT+"/translate", {
		method: "POST",
		body: JSON.stringify({
			q: sourceText,
			source: sourceSelect.value, //TODO detect beforehand to save time
			target: targetSelect.value
		}),
		//mode: 'no-cors',
		headers: {"Content-type": "application/json"}
	})
	.then( response => response.json())
	.then( data => {
		console.log(data);
		document.getElementById("target-lang-text").value = data.translatedText;
	})
	.catch( error => { console.log(error); throw(error); } );
}

function loadLanguages(){
	var sourceSelect = document.getElementById("source-lang");
	var targetSelect = document.getElementById("target-lang");

	//load up the language selects
	fetch(settings.API+":"+settings.PORT+"/languages", {
		method: "GET",
		mode: 'no-cors'
	})
	.then( response => response.json())
	.then( data => {
		sourceSelect.add(new Option("Auto", "auto"));

		for(let i=0; i < data.length; i++){

			let opt = new Option(data[i].name, data[i].code);
			let opt2 = new Option(data[i].name, data[i].code);

			sourceSelect.add(opt);
			targetSelect.add(opt2);
		}

		sourceSelect.value = settings.SOURCE_LANG;
		targetSelect.value = settings.TARGET_LANG;
	});
}

document.addEventListener("DOMContentLoaded", function(){
	//button listeners
	document.getElementById("settings").onclick = function(){
		browser.runtime.openOptionsPage();
	};

	document.getElementById("translate-page").onclick = function(){
		//TODO talk to the tab, get the whole page and translate (probably within the tab)
	};
	//load settings
	browser.storage.local.get(DEFAULT_SETTINGS)
	.then( res => {
		settings = res;
		console.log(settings);

		applySettings(settings);
		loadLanguages();
	});

	//TODO fill language select ui

	//TODO set languages and allow that to overwrite settings

	var lastKeyDown = 0;
	var lastKeyup = 0;
	document.getElementById("source-lang-text").onkeyup = function(){
		setTimeout(function(){
			if( (new Date().getTime()) - lastKeyDown > 500){
				translate();
			}
		}, 600);
	};

	document.getElementById("source-lang-text").onkeydown = function(){
		lastKeyDown = (new Date().getTime());
	};
	
});
