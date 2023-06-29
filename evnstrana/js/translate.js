const googleTranslateConfig = {
  lang: "mk",
  langFirstVisit: "mk",
};

// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", (event) => {
  let script = document.createElement("script");
  script.src = `//translate.google.com/translate_a/element.js?cb=TranslateWidgetIsLoaded`;
  document.getElementsByTagName("head")[0].appendChild(script);
});

// Callback function called when the TranslateWidget script is loaded
function TranslateWidgetIsLoaded() {
  TranslateInit(googleTranslateConfig);
}

// Initialize the translation widget
function TranslateInit(config) {
  if (config.langFirstVisit && !Cookies.get("googtrans")) {
    TranslateCookieHandler("/auto/" + config.langFirstVisit);
  }

  let code = TranslateGetCode(config);
  TranslateHtmlHandler(code);

  if (code == config.lang) {
    TranslateCookieHandler(null, config.domain);
  }

  new google.translate.TranslateElement({
    pageLanguage: config.lang,
  });

  TranslateEventHandler("click", "[data-google-lang]", function (e) {
    TranslateCookieHandler(
      "/" + config.lang + "/" + e.getAttribute("data-google-lang"),
      config.domain
    );
    window.location.reload();
  });
}

// Get the language code from the cookie or config
function TranslateGetCode(config) {
  let lang =
    Cookies.get("googtrans") != undefined && Cookies.get("googtrans") != "null"
      ? Cookies.get("googtrans")
      : config.lang;
  return lang.match(/(?!^\/)[^\/]*$/gm)[0];
}

// Handle the translation cookie
function TranslateCookieHandler(val, domain) {
  Cookies.set("googtrans", val);
  Cookies.set("googtrans", val, {
    domain: "." + document.domain,
  });

  if (domain == "undefined") return;

  Cookies.set("googtrans", val, {
    domain: domain,
  });

  Cookies.set("googtrans", val, {
    domain: "." + domain,
  });
}

// Event handler for translation-related events
function TranslateEventHandler(event, selector, handler) {
  document.addEventListener(event, function (e) {
    let el = e.target.closest(selector);
    if (el) handler(el);
  });
}

// Handle the HTML elements based on the language code
function TranslateHtmlHandler(code) {
  if (document.querySelector('[data-google-lang="' + code + '"]') !== null) {
    document
      .querySelector('[data-google-lang="' + code + '"]')
      .classList.add("language__img_active");
  }
}
