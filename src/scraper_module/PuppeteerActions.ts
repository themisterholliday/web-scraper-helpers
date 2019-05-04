import { Page } from 'puppeteer';
import {
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getTextContentForAllSelectors,
  getAnchorsForAllSelectors,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
} from './PuppeteerAbstractMethods';

// Options
export interface PuppeteerOptions {
  selector?: string;
  property?: string;
  min?: number;
  max?: number;
  url?: string;
  waitTimeout?: number;
  unloadJavascript?: boolean;
  unloadStyles?: boolean;
  inputName?: string;
  text?: string;
}

export class EmptyPuppeteerOptions implements PuppeteerOptions {}

export class WaitRandomTimeOptions implements PuppeteerOptions {
  public min: number;

  public max: number;

  public constructor(min: number = 1000, max: number = 5000) {
    this.min = min;
    this.max = max;
  }
}

export class PuppeteerSelectorOptions implements PuppeteerOptions {
  public selector: string;

  public constructor(selector: string) {
    this.selector = selector;
  }
}

export class PuppeteerSelectorPropertyOptions implements PuppeteerOptions {
  public selector: string;

  public property: string;

  public constructor(selector: string, property: string) {
    this.selector = selector;
    this.property = property;
  }
}

export class NavigatePageToURLOptions implements PuppeteerOptions {
  public url: string;

  public waitTimeout: number;

  public unloadStyles: boolean;

  public unloadJavascript: boolean;

  public constructor(
    url: string,
    waitTimeout: number = 0,
    unloadStyles: boolean = true,
    unloadJavascript: boolean = false,
  ) {
    this.url = url;
    this.waitTimeout = waitTimeout;
    this.unloadStyles = unloadStyles;
    this.unloadJavascript = unloadJavascript;
  }
}

export class InputTextIntoSelectorWithInputNameOptions
  implements PuppeteerOptions {
  public inputName: string;

  public text: string;

  public unloadAllExtras: boolean;

  public constructor(inputName: string, text: string) {
    this.inputName = inputName;
    this.text = text;
  }
}

export enum PuppeteerActionType {
  WaitRandomAmountOfTimeBetween,
  ScrollPageToEnd,
  ExtractHTMLFromPage,
  GetTextContentForSelector,
  GetValueForSelector,
  GetTextContentForAllSelectors,
  GetAnchorsForAllSelectors,
  WaitTillSelectorIsVisible,
  FindSelectorAndClick,
  GetPropertyValue,
  NavigatePageToURL,
  InputTextIntoSelectorWithInputName,
}

export class PuppeteerActionBuilder {
  public static puppeteerActionFrom(
    page: Page,
    action: PuppeteerAction,
  ): () => Promise<any> {
    const { type, options } = action;
    const {
      selector,
      property,
      min,
      max,
      url,
      waitTimeout,
      unloadJavascript,
      unloadStyles,
      inputName,
      text,
    } = options;
    switch (type) {
      case PuppeteerActionType.WaitRandomAmountOfTimeBetween:
        return () => waitRandomAmountOfTimeBetween(page, min, max);
      case PuppeteerActionType.ScrollPageToEnd:
        return () => scrollPageToEnd(page);
      case PuppeteerActionType.ExtractHTMLFromPage:
        return () => extractHTMLFromPage(page);
      case PuppeteerActionType.GetTextContentForSelector:
        return () => getTextContentForSelector(page, selector);
      case PuppeteerActionType.GetValueForSelector:
        return () => getValueForSelector(page, selector);
      case PuppeteerActionType.GetTextContentForAllSelectors:
        return () => getTextContentForAllSelectors(page, selector);
      case PuppeteerActionType.GetAnchorsForAllSelectors:
        return () => getAnchorsForAllSelectors(page, selector);
      case PuppeteerActionType.WaitTillSelectorIsVisible:
        return () => waitTillSelectorIsVisible(page, selector);
      case PuppeteerActionType.FindSelectorAndClick:
        return () => findSelectorAndClick(page, selector);
      case PuppeteerActionType.GetPropertyValue:
        return () => getPropertyValue(page, selector, property);
      case PuppeteerActionType.NavigatePageToURL:
        return () =>
          navigatePageToURL(
            page,
            url,
            waitTimeout,
            unloadStyles,
            unloadJavascript,
          );
      case PuppeteerActionType.InputTextIntoSelectorWithInputName:
        return () => inputTextIntoSelectorWithInputName(page, inputName, text);
      default:
        break;
    }
  }
}

interface PuppeteerAction {
  type: PuppeteerActionType;

  options: PuppeteerOptions;
}

export class WaitRandomAmountOfTimeBetweenAction implements PuppeteerAction {
  public type: PuppeteerActionType =
    PuppeteerActionType.WaitRandomAmountOfTimeBetween;

  public options: PuppeteerOptions;

  public constructor(min: number = 1000, max: number = 5000) {
    this.options = new WaitRandomTimeOptions(min, max);
  }
}
export class ScrollPageToEndAction implements PuppeteerAction {
  public type: PuppeteerActionType = PuppeteerActionType.ScrollPageToEnd;

  public options: PuppeteerOptions;

  public constructor() {
    this.options = new EmptyPuppeteerOptions();
  }
}
export class ExtractHTMLFromPageAction implements PuppeteerAction {
  public type: PuppeteerActionType = PuppeteerActionType.ExtractHTMLFromPage;

  public options: PuppeteerOptions;

  public constructor() {
    this.options = new EmptyPuppeteerOptions();
  }
}
export class GetTextContentForSelectorAction implements PuppeteerAction {
  public type: PuppeteerActionType =
    PuppeteerActionType.GetTextContentForSelector;

  public options: PuppeteerOptions;

  public constructor(selector: string) {
    this.options = new PuppeteerSelectorOptions(selector);
  }
}
export class GetValueForSelectorAction implements PuppeteerAction {
  public type: PuppeteerActionType = PuppeteerActionType.GetValueForSelector;

  public options: PuppeteerOptions;

  public constructor(selector: string) {
    this.options = new PuppeteerSelectorOptions(selector);
  }
}
export class GetAnchorsForAllSelectorsAction implements PuppeteerAction {
  public type: PuppeteerActionType =
    PuppeteerActionType.GetAnchorsForAllSelectors;

  public options: PuppeteerOptions;

  public constructor(selector: string) {
    this.options = new PuppeteerSelectorOptions(selector);
  }
}
export class WaitTillSelectorIsVisibleAction implements PuppeteerAction {
  public type: PuppeteerActionType =
    PuppeteerActionType.WaitTillSelectorIsVisible;

  public options: PuppeteerOptions;

  public constructor(selector: string) {
    this.options = new PuppeteerSelectorOptions(selector);
  }
}
export class FindSelectorAndClickAction implements PuppeteerAction {
  public type: PuppeteerActionType = PuppeteerActionType.FindSelectorAndClick;

  public options: PuppeteerOptions;

  public constructor(selector: string) {
    this.options = new PuppeteerSelectorOptions(selector);
  }
}
export class GetPropertyValueAction implements PuppeteerAction {
  public type: PuppeteerActionType = PuppeteerActionType.GetPropertyValue;

  public options: PuppeteerOptions;

  public constructor(selector: string, property: string) {
    this.options = new PuppeteerSelectorPropertyOptions(selector, property);
  }
}
export class NavigatePageToURLAction implements PuppeteerAction {
  public type: PuppeteerActionType = PuppeteerActionType.NavigatePageToURL;

  public options: PuppeteerOptions;

  public constructor(
    url: string,
    waitTimeout: number = 0,
    unloadAllExtras: boolean = false,
  ) {
    this.options = new NavigatePageToURLOptions(
      url,
      waitTimeout,
      unloadAllExtras,
    );
  }
}
export class InputTextIntoSelectorWithInputNamAction
  implements PuppeteerAction {
  public type: PuppeteerActionType =
    PuppeteerActionType.InputTextIntoSelectorWithInputName;

  public options: PuppeteerOptions;

  public constructor(inputName: string, text: string) {
    this.options = new InputTextIntoSelectorWithInputNameOptions(
      inputName,
      text,
    );
  }
}
