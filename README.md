# libretranslate-unofficial-ff-extension
An unofficial Firefox extension for the LibreTranslate API

## Installation & Setup

### Loading the Add-on

If you are downloading or cloning this repo then you will need to [load this as a temporary Add-on in Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing).

Basically goto [about:debugging](about:debugging) On the left hand side click the menu option: **This Firefox** then click the button near the top with label **Load Temporary Add-on** and then navigate to and select the *manifest.json* file for this repo.

This Add-on is available on the [Firefox Add-ons Marketplace](https://addons.mozilla.org/en-US/firefox/addon/open-libretranslate-addon/).

### Configuring the LibreTranslate API

Once the extension is installed you will see a blue box with three characters in it appear on the right side of your browser's toolbar. Click it and then click the button labeled **Extension Settings** that will appear in the popup. Here you will be able to set the URL, port, and optional API key of the LibreTranslate API that you are using or self-hosting. You can also configure the default languages and the highlight color of the translate in place feature. The default API is [https://translate.argosopentech.com](https://translate.argosopentech.com) which is currently free to use, courtesy of [Argos Open Tech](https://www.argosopentech.com/). That may change in the future so I highly recommend that you self-host the API if you are able to do so. [Other public APIs](https://github.com/LibreTranslate/LibreTranslate#mirrors) are listed on the [LibreTranslate github repo](https://github.com/LibreTranslate/LibreTranslate).

![Extension Options](/screenshots/ulte_options.png)

### Self-hosting the LibreTranslate API

Because LibreTranslate is open source, it is possible for users to host their own instance of the API. Self-hosting frees users from API limits on requests, can improve performance, and provides offline availability if hosted on the local machine or within the local network. [Installation instructions](https://github.com/LibreTranslate/LibreTranslate#install-and-run) are provided on the [LibreTranslate github repo](https://github.com/LibreTranslate/LibreTranslate).

Once your self-hosted instance is installed enter the URL (with protocol string, e.g http://) and port into the extension settings to begin using it.

## Features

### Translate in Place

The core feature of the extension is the ability to highlight text with your cursor and see an inline translation. Once text has been highlighted, hold the *Alt* key to see the translation. Releasing the *Alt* key returns the highlighted text to its original language. This feature is very useful for language learners that have limited vocabulary in the source language of the text.

### Popup Translation Box

Clicking the extension icon on the toolbar displays a popup. The popup contains two textboxes that users can interact with. Text entered into the left box will be translated into the target language in the right text box. This translation works both ways, so by entering text of the chosen language in the right textbox will translate it to the language selected for the left box.

![Popup Translation Box](/screenshots/ulte_popup.png)

### Full Page Translation

This feature is not yet implemented.

