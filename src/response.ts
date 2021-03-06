import { URL } from "url";
import {
  iValue,
  iResponse,
  iScenario,
  iAssertionContext,
  FindOptions,
  FindAllOptions,
  OptionalXY,
} from "./interfaces";
import { ResponseType } from "./enums";
import { HttpResponse } from "./httpresponse";
import { AssertionContext } from "./assertioncontext";
import { wrapAsValue } from "./helpers";
import { EvaluateFn, SerializableOrJSHandle } from "puppeteer-core";
import { ValuePromise } from "./value-promise";

export function isPuppeteer(type: ResponseType): boolean {
  return ["browser", "extjs"].indexOf(type) >= 0;
}

export abstract class ProtoResponse implements iResponse {
  public readonly scenario: iScenario;

  private _httpResponse: HttpResponse = HttpResponse.createEmpty();

  abstract get responseType(): ResponseType;
  abstract get responseTypeName(): string;
  abstract find(selector: string, opts?: FindOptions): ValuePromise;
  abstract find(
    selector: string,
    contains: string,
    opts?: FindOptions
  ): ValuePromise;
  abstract find(
    selector: string,
    matches: RegExp,
    opts?: FindOptions
  ): ValuePromise;
  abstract findAll(selector: string, opts?: FindAllOptions): Promise<iValue[]>;
  abstract findAll(
    selector: string,
    contains: string,
    opts?: FindAllOptions
  ): Promise<iValue[]>;
  abstract findAll(
    selector: string,
    matches: RegExp,
    opts?: FindAllOptions
  ): Promise<iValue[]>;
  abstract eval(callback: any, ...args: any[]): Promise<any>;

  /**
   * Is this a browser based test
   */
  public get isBrowser(): boolean {
    return false;
  }

  public get httpResponse(): HttpResponse {
    return this._httpResponse;
  }

  /**
   * HTTP Status Code
   */
  public get statusCode(): iValue {
    return wrapAsValue(
      this.context,
      this.httpResponse.statusCode,
      "HTTP Status Code"
    );
  }

  /**
   * HTTP Status Message
   */
  public get statusMessage(): iValue {
    return wrapAsValue(
      this.context,
      this.httpResponse.statusMessage,
      "HTTP Status Message"
    );
  }

  /**
   * Raw Response Body
   */
  public get body(): iValue {
    return wrapAsValue(
      this.context,
      this.httpResponse.body,
      "Raw Response Body"
    );
  }

  /**
   * Size of the response body
   */
  public get length(): iValue {
    return wrapAsValue(
      this.context,
      this.httpResponse.body.length,
      "Length of Response Body"
    );
  }

  /**
   * HTTP Headers
   */
  public get headers(): iValue {
    return wrapAsValue(this.context, this.httpResponse.headers, "HTTP Headers");
  }

  /**
   * HTTP Cookies
   */
  public get cookies(): iValue {
    return wrapAsValue(this.context, this.httpResponse.cookies, "HTTP Cookies");
  }

  /**
   * HTTP Trailers
   */
  public get trailers(): iValue {
    return wrapAsValue(
      this.context,
      this.httpResponse.trailers,
      "HTTP Trailers"
    );
  }

  /**
   * JSON parsed response body
   */
  public get jsonBody(): iValue {
    try {
      const json = JSON.parse(this.httpResponse.body);
      return wrapAsValue(this.context, json, "JSON Response");
    } catch (ex) {
      return wrapAsValue(this.context, null, `JSON Response: ${ex}`);
    }
  }

  /**
   * URL of the request
   */
  public get url(): iValue {
    return wrapAsValue(this.context, this.scenario.url, "Request URL");
  }

  /**
   * URL of the response, after all redirects
   */
  public get finalUrl(): iValue {
    return wrapAsValue(
      this.context,
      this.scenario.finalUrl,
      "Response URL (after redirects)"
    );
  }

  /**
   * URL of the response, after all redirects
   */
  public get redirectCount(): iValue {
    return wrapAsValue(
      this.context,
      this.scenario.redirectCount,
      "Response URL (after redirects)"
    );
  }

  /**
   * Time from request start to response complete
   */
  public get loadTime(): iValue {
    return wrapAsValue(
      this.context,
      this.scenario.requestDuration,
      "Request to Response Load Time"
    );
  }

  public get method(): iValue {
    return wrapAsValue(this.context, this._httpResponse.method, "Method");
  }

  public get context(): iAssertionContext {
    return new AssertionContext(this.scenario, this);
  }

  constructor(scenario: iScenario) {
    this.scenario = scenario;
  }

  public init(httpResponse: HttpResponse) {
    this._httpResponse = httpResponse;
  }

  /**
   * Take a relative URL and make it absolute, based on the requested URL
   *
   * @param uri
   */
  public absolutizeUri(uri: string): string {
    return new URL(uri, this.scenario.buildUrl()).href;
  }

  public getRoot(): any {
    return this.httpResponse.body;
  }

  /**
   * Return a single header by key or all headers in an object
   *
   * @param {string} key
   * @returns {Value}
   */
  public header(key: string): iValue {
    // Try first as they put it in the test, then try all lowercase
    key =
      typeof this.httpResponse.headers[key] !== "undefined"
        ? key
        : key.toLowerCase();
    const headerValue: any = this.httpResponse.headers[key];
    return wrapAsValue(
      this.context,
      typeof headerValue == "undefined" ? null : headerValue,
      "HTTP Headers[" + key + "]"
    );
  }

  /**
   * Return a single cookie by key or all cookies in an object
   *
   * @param key
   */
  public cookie(key: string): iValue {
    return wrapAsValue(
      this.context,
      this.httpResponse.cookies[key],
      "HTTP Cookies[" + key + "]"
    );
  }

  public async waitForFunction(
    js: EvaluateFn<any>,
    opts?: { polling?: string | number; timeout?: number },
    ...args: SerializableOrJSHandle[]
  ): Promise<void> {
    return this.context.pause(1);
  }

  public async waitForNavigation(
    timeout: number = 10000,
    waitFor?: string | string[]
  ): Promise<void> {
    return this.context.pause(1);
  }

  public async waitForLoad(timeout: number = 30000): Promise<void> {
    return this.context.pause(1);
  }

  public async waitForReady(timeout: number = 30000): Promise<void> {
    return this.context.pause(1);
  }

  public async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    return this.context.pause(1);
  }

  public async waitForHidden(
    selector: string,
    timeout: number = 30000
  ): Promise<iValue> {
    await this.context.pause(1);
    return wrapAsValue(this.context, null, selector);
  }

  public async waitForVisible(
    selector: string,
    timeout: number = 30000
  ): Promise<iValue> {
    await this.context.pause(1);
    return wrapAsValue(this.context, null, selector);
  }

  public async waitForExists(
    selector: string,
    timeout: number = 30000
  ): Promise<iValue> {
    await this.context.pause(1);
    return wrapAsValue(this.context, null, selector);
  }

  public async waitForHavingText(
    selector: string,
    text: string,
    timeout: number = 30000
  ): Promise<iValue> {
    await this.context.pause(1);
    return wrapAsValue(this.context, null, selector);
  }

  public async screenshot(): Promise<Buffer> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support screenshots.`
    );
  }

  public async type(
    selector: string,
    textToType: string,
    opts: any = {}
  ): Promise<any> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support type.`
    );
  }

  public async clear(selector: string): Promise<any> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support clear.`
    );
  }

  public async waitForXPath(xPath: string): Promise<iValue> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support waitForXPath.`
    );
  }

  public async findXPath(xPath: string): Promise<iValue> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support findXPath.`
    );
  }

  public async findAllXPath(xPath: string): Promise<iValue[]> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support findAllXPath.`
    );
  }

  public async findHavingText(
    selector: string,
    searchForText: string | RegExp
  ): Promise<iValue> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support findHavingText.`
    );
  }

  public async findAllHavingText(
    selector: string,
    searchForText: string | RegExp
  ): Promise<iValue[]> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support findAllHavingText.`
    );
  }

  public async selectOption(
    selector: string,
    value: string | string[]
  ): Promise<void> {
    throw new Error(
      `This scenario type (${this.responseTypeName}) does not support selectOption.`
    );
  }

  public async scrollTo(_point: OptionalXY): Promise<iResponse> {
    return this;
  }

  /**
   * Click on this element
   *
   * @param selector
   */
  click(selector: string, opts?: FindOptions): Promise<iValue>;
  click(
    selector: string,
    contains: string,
    opts?: FindOptions
  ): Promise<iValue>;
  click(selector: string, matches: RegExp, opts?: FindOptions): Promise<iValue>;
  public async click(
    selector: string,
    a?: FindOptions | string | RegExp,
    b?: FindOptions
  ): Promise<iValue> {
    const contains = typeof a == "string" ? a : undefined;
    const matches = a instanceof RegExp ? a : undefined;
    const opts = (b || a || {}) as FindOptions;
    const element = contains
      ? await this.find(selector, contains, opts)
      : matches
      ? await this.find(selector, matches, opts)
      : await this.find(selector, opts);
    if (!(await element.exists()).isNull()) {
      return element.click();
    }
    return element;
  }
}
