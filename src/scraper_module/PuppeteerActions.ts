import { Page } from 'puppeteer';
import {
  waitRandomAmountOfTimeBetween,
  scrollPageToEnd,
  extractHTMLFromPage,
  getTextContentForSelector,
  getValueForSelector,
  getAnchorsForAllSelectors,
  waitTillSelectorIsVisible,
  findSelectorAndClick,
  getPropertyValue,
  navigatePageToURL,
  inputTextIntoSelectorWithInputName,
  PuppeteerOptions,
  EmptyPuppeteerOptions,
  WaitRandomTimeOptions,
  PuppeteerSelectorOptions,
  PuppeteerSelectorPropertyOptions,
  NavigatePageToURLOptions,
  InputTextIntoSelectorWithInputNameOptions,
} from './PuppeteerAbstractMethods';

export enum PuppeteerActionType {
  WaitRandomAmountOfTimeBetween,
  ScrollPageToEnd,
  ExtractHTMLFromPage,
  GetTextContentForSelector,
  GetValueForSelector,
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
    switch (type) {
      case PuppeteerActionType.WaitRandomAmountOfTimeBetween:
        return () => waitRandomAmountOfTimeBetween(page, options);
      case PuppeteerActionType.ScrollPageToEnd:
        return () => scrollPageToEnd(page);
      case PuppeteerActionType.ExtractHTMLFromPage:
        return () => extractHTMLFromPage(page);
      case PuppeteerActionType.GetTextContentForSelector:
        return () => getTextContentForSelector(page, options);
      case PuppeteerActionType.GetValueForSelector:
        return () => getValueForSelector(page, options);
      case PuppeteerActionType.GetAnchorsForAllSelectors:
        return () => getAnchorsForAllSelectors(page, options);
      case PuppeteerActionType.WaitTillSelectorIsVisible:
        return () => waitTillSelectorIsVisible(page, options);
      case PuppeteerActionType.FindSelectorAndClick:
        return () => findSelectorAndClick(page, options);
      case PuppeteerActionType.GetPropertyValue:
        return () => getPropertyValue(page, options);
      case PuppeteerActionType.NavigatePageToURL:
        return () => navigatePageToURL(page, options);
      case PuppeteerActionType.InputTextIntoSelectorWithInputName:
        return () => inputTextIntoSelectorWithInputName(page, options);
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
