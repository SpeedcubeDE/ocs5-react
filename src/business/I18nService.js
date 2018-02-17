import PubSubEvent from "./PubSubEvent";
import lang_en from '../languages/en';
import lang_de from '../languages/de';

class I18nService {
    constructor() {
        this._texts = new Map();
        this._languages = new Map([
            ["en", lang_en],
            ["de", lang_de],
        ]);
        this.onLanguageChanged = new PubSubEvent();
        this.setLanguage(this._languages.keys().next().value);
    }

    _setTexts(textsObject) {
        this._texts = I18nService._objectToFlattenedMap(textsObject, "");
        this.onLanguageChanged.notify();
    }

    getText(path, data) {
        let text = this._texts.get(path) || `[no translation for: ${path}]`;
        for (const [find, replace] of Object.entries(data || {})) {
            const regex = new RegExp(`\{${find}\}`, "g");
            text = text.replace(regex, replace);
        }
        return text;
    }

    getAvailableLanguages() {
        return this._languages.keys();
    }

    setLanguage(languageName) {
        const languageText = this._languages.get(languageName);
        if (languageText === undefined) {
            throw new Error("Unknown language: " + languageName);
        }
        this._setTexts(languageText);
    }

    static _objectToFlattenedMap(obj) {
        let map = new Map();
        for (const [property, value] of Object.entries(obj)) {
            if (typeof value === "object") {
                const innerMap = I18nService._objectToFlattenedMap(value);
                for (const [innerProperty, innerValue] of innerMap) {
                    map.set(property + '.' + innerProperty, innerValue);
                }
            } else {
                map.set(property, value);
            }
        }
        return map;
    }
}

export default I18nService;
