import { ProtoResponse } from "../response";
import { iJPath, jPath } from "./jpath";
import { HttpResponse } from "../httpresponse";
import { iResponse, iValue } from "../interfaces";
import { wrapAsValue } from "../helpers";
import { ResponseType } from "../enums";
import { ValuePromise } from "../value-promise";

export class JsonResponse extends ProtoResponse implements iResponse {
  protected _json: {} = {};
  protected _jPath: iJPath | undefined;

  public get responseTypeName(): string {
    return "JSON";
  }

  public get responseType(): ResponseType {
    return "json";
  }

  public init(httpResponse: HttpResponse) {
    super.init(httpResponse);
    const json = this.jsonBody.$;
    this.context.assert("JSON is valid", json).type.not.equals("null");
    this._json = json || {};
  }

  public getRoot(): any {
    return this._json;
  }

  public async eval(): Promise<any> {
    throw "This type of scenario does not suport eval.";
  }

  /**
   * Find first matching item
   *
   * @param path
   * @param findIn
   */
  public find(path: string): ValuePromise {
    return ValuePromise.execute(async () => {
      await this.loadJmesPath();
      if (typeof this._jPath == "undefined") {
        throw new Error("Could not load jmespath");
      }
      const selection = await this._jPath.search(this._json, path);
      return wrapAsValue(this.context, selection, path, selection);
    });
  }

  /**
   * Same as find for JSON, just returns as array
   *
   * @param path
   */
  public async findAll(path: string): Promise<iValue[]> {
    const item = await this.find(path);
    return [item];
  }

  private async loadJmesPath(): Promise<any> {
    // We haven't tried to load query engines yet
    if (typeof this._jPath == "undefined") {
      // Try importing jmespath
      return (
        import("jmespath")
          // Got it, so save it and return it
          .then((jpath) => {
            this._jPath = jpath;
            return this._jPath;
          })
          // Couldn't load jmespath, so set it to null
          .catch((e) => {
            this._jPath = new jPath();
            return this._jPath;
          })
      );
    } else {
      return this._jPath;
    }
  }
}
