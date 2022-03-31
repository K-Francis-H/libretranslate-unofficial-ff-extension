//docker run -d -ti --rm -p 5000:5000 libretranslate/libretranslate

// /usr/local/bin/python /usr/local/bin/libretranslate --host 0.0.0.0

//sudo apt install libicu-dev
//sudo apt install pkg-config

//on a vm run main.py --host 0.0.0.0 --port XXXX

//settings

//defaults
const settings = getDefaultSettings();

var port = browser.runtime.connect({name: "connect"});
port.onMessage.addListener(handleBackgroundMessage);
port.onDisconnect.addListener( (p) => {
	console.log("reconnecting to bg.js");
	port = browser.runtime.connect({name: "connect"});	
});
//console.log(port);


function handleBackgroundMessage(msg){
	console.log(msg);
	console.log(msg.type == "settingsChanged");
	if(msg.type == "settingsChanged"){

		let keys = Object.keys(msg.changes);
		for(let i=0; i < keys.length; i++){
			settings[keys[i]] = msg.changes[keys[i]].newValue;
		}
		//console.log("new settings");
		//console.log(settings);
	}
	//this will be sent as soon as a connection happens, it loads the latest settings
	else if(msg.type == "settings"){
		settings = {
			...settings,
			...msg.settings
		};
		//console.log("init settings");
		//console.log(settings);
	}
	else if(msg.type == "translatePage"){
		console.log("translatePage");
	}
}

//from https://stackoverflow.com/questions/17642799/javascript-jquery-get-selected-texts-container
var getSelectionContainer = function() { 

    if (document.selection){  // IE
	return document.selection.createRange().parentElement();
    }

    var select = window.getSelection();
    if (select.rangeCount > 0) {
       return select.getRangeAt(0).startContainer.parentNode;
    }
};

//won't work for textarea see https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
	text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
	text = document.selection.createRange().text;
    }
    return text;
}

document.body.onkeydown = function(edown){
	console.log("keydown");
	console.log(edown);
	if(edown.altKey || edown.key == "Alt"){
		edown.preventDefault();
		let highlightedText = getSelectionText();
		if(highlightedText == ""){
			console.log("no selection");
			return;
		}
		let element = getSelectionContainer();
		console.log(highlightedText);
		console.log(element);

		//translate
		let originalText = element.innerText;
		let originalHTML = element.innerHTML;

		console.log(originalText);
		console.log(originalHTML);

		console.log(settings.API+":"+settings.PORT+"/translate");
		let url = settings.API+":"+settings.PORT+"/translate";

		fetch(url, {
			method: "POST",
			body: JSON.stringify({
				q: highlightedText,
				source: settings.SOURCE_LANG, //TODO detect beforehand to save time
				target: settings.TARGET_LANG
			}),
			headers: {"Content-type": "application/json"}
		})
		.then( response => response.json())
		.then( data => {
			console.log(data);

			let show = '<span style="background-color:'+settings.HIGHLIGHT_COLOR+';">'+data.translatedText+'</span>';


			let translated = originalText.replace(highlightedText.trim(), show);

			console.log(translated);

			element.innerHTML = translated;

			document.body.onkeyup = function(eup){
				//console.log("keyup");
				//console.log(eup);
				if(eup.key == "Alt"){
					//console.log("eup altKey");
					eup.preventDefault();
					element.innerHTML = originalHTML;
				}
			};

			//switch to auto if we are unable to translate
			if(settings.SOURCE_LANG != "auto" && (highlightedText == data.translatedText) ){
				//we failed to translate, set local source lang to auto and see if we get a better result
				settings.SOURCE_LANG = "auto"; 	
			}
			//update our source language if the API supports it
			else if(settings.SOURCE_LANG == "auto" && data.detectedLanguage){
				let confidence = data.detectedLanguage.confidence;
				let language = data.detectedLanguage.language;
				//if confidence is high set it so that future translations are better
				if(confidence >= 70){
					//at least a gentleman's C
					settings.SOURCE_LANG = language; //NOTE this is local to this tab, that way if auto is set elsewhere its not overwritten elsewhere
					//also it can get overwritten by global preferences...
				}
			}

			

		})
		.catch( error => { console.log(error); throw(error); } );


			

		
	}
};
