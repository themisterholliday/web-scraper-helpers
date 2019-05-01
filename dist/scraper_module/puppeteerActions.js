"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PuppeteerAbstractMethods_1 = require("./PuppeteerAbstractMethods");
var PuppeteerActionType;
(function (PuppeteerActionType) {
    PuppeteerActionType[PuppeteerActionType["WaitRandomAmountOfTimeBetween"] = 0] = "WaitRandomAmountOfTimeBetween";
    PuppeteerActionType[PuppeteerActionType["ScrollPageToEnd"] = 1] = "ScrollPageToEnd";
    PuppeteerActionType[PuppeteerActionType["ExtractHTMLFromPage"] = 2] = "ExtractHTMLFromPage";
    PuppeteerActionType[PuppeteerActionType["GetTextContentForSelector"] = 3] = "GetTextContentForSelector";
    PuppeteerActionType[PuppeteerActionType["GetValueForSelector"] = 4] = "GetValueForSelector";
    PuppeteerActionType[PuppeteerActionType["GetAnchorsForAllSelectors"] = 5] = "GetAnchorsForAllSelectors";
    PuppeteerActionType[PuppeteerActionType["WaitTillSelectorIsVisible"] = 6] = "WaitTillSelectorIsVisible";
    PuppeteerActionType[PuppeteerActionType["FindSelectorAndClick"] = 7] = "FindSelectorAndClick";
    PuppeteerActionType[PuppeteerActionType["GetPropertyValue"] = 8] = "GetPropertyValue";
    PuppeteerActionType[PuppeteerActionType["NavigatePageToURL"] = 9] = "NavigatePageToURL";
    PuppeteerActionType[PuppeteerActionType["InputTextIntoSelectorWithInputName"] = 10] = "InputTextIntoSelectorWithInputName";
})(PuppeteerActionType = exports.PuppeteerActionType || (exports.PuppeteerActionType = {}));
class PuppeteerActionBuilder {
    static puppeteerActionFrom(page, action) {
        const { type, options } = action;
        switch (type) {
            case PuppeteerActionType.WaitRandomAmountOfTimeBetween:
                return () => PuppeteerAbstractMethods_1.waitRandomAmountOfTimeBetween(page, options);
            case PuppeteerActionType.ScrollPageToEnd:
                return () => PuppeteerAbstractMethods_1.scrollPageToEnd(page);
            case PuppeteerActionType.ExtractHTMLFromPage:
                return () => PuppeteerAbstractMethods_1.extractHTMLFromPage(page);
            case PuppeteerActionType.GetTextContentForSelector:
                return () => PuppeteerAbstractMethods_1.getTextContentForSelector(page, options);
            case PuppeteerActionType.GetValueForSelector:
                return () => PuppeteerAbstractMethods_1.getValueForSelector(page, options);
            case PuppeteerActionType.GetAnchorsForAllSelectors:
                return () => PuppeteerAbstractMethods_1.getAnchorsForAllSelectors(page, options);
            case PuppeteerActionType.WaitTillSelectorIsVisible:
                return () => PuppeteerAbstractMethods_1.waitTillSelectorIsVisible(page, options);
            case PuppeteerActionType.FindSelectorAndClick:
                return () => PuppeteerAbstractMethods_1.findSelectorAndClick(page, options);
            case PuppeteerActionType.GetPropertyValue:
                return () => PuppeteerAbstractMethods_1.getPropertyValue(page, options);
            case PuppeteerActionType.NavigatePageToURL:
                return () => PuppeteerAbstractMethods_1.navigatePageToURL(page, options);
            case PuppeteerActionType.InputTextIntoSelectorWithInputName:
                return () => PuppeteerAbstractMethods_1.inputTextIntoSelectorWithInputName(page, options);
            default:
                break;
        }
    }
}
exports.PuppeteerActionBuilder = PuppeteerActionBuilder;
class WaitRandomAmountOfTimeBetweenAction {
    constructor(min = 1000, max = 5000) {
        this.type = PuppeteerActionType.WaitRandomAmountOfTimeBetween;
        this.options = new PuppeteerAbstractMethods_1.WaitRandomTimeOptions(min, max);
    }
}
exports.WaitRandomAmountOfTimeBetweenAction = WaitRandomAmountOfTimeBetweenAction;
class ScrollPageToEndAction {
    constructor() {
        this.type = PuppeteerActionType.ScrollPageToEnd;
        this.options = new PuppeteerAbstractMethods_1.EmptyPuppeteerOptions();
    }
}
exports.ScrollPageToEndAction = ScrollPageToEndAction;
class ExtractHTMLFromPageAction {
    constructor() {
        this.type = PuppeteerActionType.ExtractHTMLFromPage;
        this.options = new PuppeteerAbstractMethods_1.EmptyPuppeteerOptions();
    }
}
exports.ExtractHTMLFromPageAction = ExtractHTMLFromPageAction;
class GetTextContentForSelectorAction {
    constructor(selector) {
        this.type = PuppeteerActionType.GetTextContentForSelector;
        this.options = new PuppeteerAbstractMethods_1.PuppeteerSelectorOptions(selector);
    }
}
exports.GetTextContentForSelectorAction = GetTextContentForSelectorAction;
class GetValueForSelectorAction {
    constructor(selector) {
        this.type = PuppeteerActionType.GetValueForSelector;
        this.options = new PuppeteerAbstractMethods_1.PuppeteerSelectorOptions(selector);
    }
}
exports.GetValueForSelectorAction = GetValueForSelectorAction;
class GetAnchorsForAllSelectorsAction {
    constructor(selector) {
        this.type = PuppeteerActionType.GetAnchorsForAllSelectors;
        this.options = new PuppeteerAbstractMethods_1.PuppeteerSelectorOptions(selector);
    }
}
exports.GetAnchorsForAllSelectorsAction = GetAnchorsForAllSelectorsAction;
class WaitTillSelectorIsVisibleAction {
    constructor(selector) {
        this.type = PuppeteerActionType.WaitTillSelectorIsVisible;
        this.options = new PuppeteerAbstractMethods_1.PuppeteerSelectorOptions(selector);
    }
}
exports.WaitTillSelectorIsVisibleAction = WaitTillSelectorIsVisibleAction;
class FindSelectorAndClickAction {
    constructor(selector) {
        this.type = PuppeteerActionType.FindSelectorAndClick;
        this.options = new PuppeteerAbstractMethods_1.PuppeteerSelectorOptions(selector);
    }
}
exports.FindSelectorAndClickAction = FindSelectorAndClickAction;
class GetPropertyValueAction {
    constructor(selector, property) {
        this.type = PuppeteerActionType.GetPropertyValue;
        this.options = new PuppeteerAbstractMethods_1.PuppeteerSelectorPropertyOptions(selector, property);
    }
}
exports.GetPropertyValueAction = GetPropertyValueAction;
class NavigatePageToURLAction {
    constructor(url, waitTimeout = 0, unloadAllExtras = false) {
        this.type = PuppeteerActionType.NavigatePageToURL;
        this.options = new PuppeteerAbstractMethods_1.NavigatePageToURLOptions(url, waitTimeout, unloadAllExtras);
    }
}
exports.NavigatePageToURLAction = NavigatePageToURLAction;
class InputTextIntoSelectorWithInputNamAction {
    constructor(inputName, text) {
        this.type = PuppeteerActionType.InputTextIntoSelectorWithInputName;
        this.options = new PuppeteerAbstractMethods_1.InputTextIntoSelectorWithInputNameOptions(inputName, text);
    }
}
exports.InputTextIntoSelectorWithInputNamAction = InputTextIntoSelectorWithInputNamAction;
//# sourceMappingURL=PuppeteerActions.js.map