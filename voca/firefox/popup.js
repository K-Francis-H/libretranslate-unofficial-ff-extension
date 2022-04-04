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

var settings = DEFAULT_SETTINGS;

function applySettings(s){
	let sourceLang = s.SOURCE_LANG || DEFAULT_SETTINGS.SOURCE_LANG;
	let targetLang = s.TARGET_LANG || DEFAULT_SETTINGS.TARGET_LANG;

	document.getElementById("source-lang").value = sourceLang;
	document.getElementById("target-lang").value = targetLang;

	//set languages for text boxes
	document.getElementById("source-lang-text").setAttribute("lang", sourceLang);
	document.getElementById("target-lang-text").setAttribute("lang", targetLang);
}

function translate(){
	console.log("translate")
	var sourceSelect = document.getElementById("source-lang");
	var targetSelect = document.getElementById("target-lang");

	var sourceText = document.getElementById("source-lang-text").value;
	var sourceLang = sourceSelect.value;

	//abort if nothing to translate
	if(sourceText.trim() == ''){ return; }

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

//TODO probably just modify the above to choose the appropriate textbox
function reverseTranslate(){
	console.log("reverseTranslate");
	var sourceSelect = document.getElementById("source-lang");
	var targetSelect = document.getElementById("target-lang");

	var sourceText = document.getElementById("target-lang-text").value;
	var sourceLang = sourceSelect.value;

	//abort if nothing to translate
	if(sourceText.trim() == ''){ return; }

	fetch(settings.API+":"+settings.PORT+"/translate", {
		method: "POST",
		body: JSON.stringify({
			q: sourceText,
			source: targetSelect.value, 
			target: sourceSelect.value
		}),
		//mode: 'no-cors',
		headers: {"Content-type": "application/json"}
	})
	.then( response => response.json())
	.then( data => {
		console.log(data);
		document.getElementById("source-lang-text").value = data.translatedText;
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

function onBackgroundPage(page){
	page.activeTabTranslatePage();
}

document.addEventListener("DOMContentLoaded", function(){
	//button listeners
	document.getElementById("settings").onclick = function(){
		browser.runtime.openOptionsPage();
	};

	document.getElementById("translate-page").onclick = function(){
		//TODO talk to the tab, get the whole page and translate (probably within the tab)
		let bgPromise = browser.runtime.getBackgroundPage();
		bgPromise.then( onBackgroundPage, function(error){
			console.log(error);
		});
	};

	//load settings
	browser.storage.local.get(DEFAULT_SETTINGS)
	.then( res => {
		settings = res;
		console.log(settings);

		applySettings(settings);
		loadLanguages();
	});

	//set languages and allow that to overwrite settings (everywhere)
	document.getElementById("source-lang").onchange = function(){
		let lang = document.getElementById("source-lang").value;
		settings.SOURCE_LANG = lang;
		//console.log("new source-lang: "+lang);
		browser.storage.local.set(settings);

		//update spellchecker for textbox
		document.getElementById("source-lang-text").setAttribute("lang", lang);
		console.log(document.getElementById("source-lang-text"));

		if(lang !== "auto"){
			reverseTranslate();
		}
	};

	document.getElementById("target-lang").onchange = function(){
		let lang = document.getElementById("target-lang").value;
		settings.TARGET_LANG = lang;
		//console.log("new target-lang: "+lang);
		browser.storage.local.set(settings);

		//update spellchecker for textbox
		document.getElementById("target-lang-text").setAttribute("lang", lang);
		console.log(document.getElementById("target-lang-text"));

		//re-translate anything in the source text box
		translate();
	};

	/*document.addEventListener('input', function(event){
		console.log("INPUT");
		console.log(event);
		console.log(event.target.id);
		if(event.target.id == "source-lang"){
			let lang = document.getElementById("source-lang").value;
			settings.SOURCE_LANG = lang;
			//console.log("new source-lang: "+lang);
			browser.storage.local.set(settings);

			//update spellchecker for textbox
			document.getElementById("source-lang-text").setAttribute("lang", lang);
			console.log(document.getElementById("source-lang-text"));
			
			if(lang !== "auto"){
				reverseTranslate();
			}
		}
		else if(event.target.id == "target-lang"){
			let lang = document.getElementById("target-lang").value;
			settings.TARGET_LANG = lang;
			//console.log("new target-lang: "+lang);
			browser.storage.local.set(settings);

			//update spellchecker for textbox
			document.getElementById("target-lang-text").setAttribute("lang", lang);
			console.log(document.getElementById("target-lang-text"));

			//re-translate anything in the source text box
			translate();
		}
		//otherwise don't care
	});*/

	//detect typing end and translate
	(function(){
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
	})();

	(function(){
		var lastKeyDown = 0;
		var lastKeyup = 0;
		document.getElementById("target-lang-text").onkeyup = function(){
			setTimeout(function(){
				if( (new Date().getTime()) - lastKeyDown > 500){
					reverseTranslate();
				}
			}, 600);
		};

		document.getElementById("target-lang-text").onkeydown = function(){
			lastKeyDown = (new Date().getTime());
		};
	})();

	
	
});
