import { JSHandle, Page, EvaluateFn } from "puppeteer-core";
import { ExtJsComponent } from "./extjscomponent";
import { iAssertionContext, iValue } from "../interfaces";
import { Value } from "../value";
import { asyncMap } from "../util";

export async function jsHandleArrayToHandles(results: JSHandle) {
  const length = await results.evaluate((r) => r.length);
  const handles: JSHandle[] = [];
  for (let i = 0; i < length; i++) {
    handles.push(await results.evaluateHandle((r, i) => r[i], i));
  }
  return handles;
}

export async function jsHandleArrayToComponents(
  results: JSHandle,
  context: iAssertionContext,
  name: string,
  path: string
): Promise<iValue[]> {
  const handles = await jsHandleArrayToHandles(results);
  return asyncMap(handles, async (handle: JSHandle, i) => {
    return await jsHandleToComponent(handle, context, `${name} [${i}]`, path);
  });
}

export async function filter(
  jsHandleArray: JSHandle,
  filterFunction: EvaluateFn,
  ...args: any[]
): Promise<JSHandle[]> {
  const handles = await jsHandleArrayToHandles(jsHandleArray);
  return asyncMap(handles, async (handle: JSHandle) => {
    return !!(await handle.evaluateHandle.apply(handle, [
      filterFunction,
      ...args,
    ]));
  });
}

export async function query(page: Page, selector: string) {
  return page.evaluateHandle(
    // @ts-ignore
    (selector) => Ext.ComponentQuery.query(selector),
    selector
  );
}

export async function queryWithinComponent(
  component: JSHandle,
  selector: string
) {
  return component.evaluateHandle((c, selector) => c.query(selector), selector);
}

export async function id(component: JSHandle) {
  return component.evaluateHandle((c) => c.getId());
}

export async function down(context: JSHandle, selector: string) {
  return context.evaluateHandle((c, selector) => c.down(selector), selector);
}

export async function child(context: JSHandle, selector: string) {
  return context.evaluateHandle((c, selector) => c.child(selector), selector);
}

export async function up(context: JSHandle, selector: string) {
  return context.evaluateHandle((c, selector) => c.up(selector), selector);
}

export async function parent(context: JSHandle) {
  return context.evaluateHandle((c) => c.parent || c.getParent());
}

export async function ancestors(context: JSHandle, selector: string) {
  return context.evaluateHandle(
    (c, selector) => c.getAncestors(selector),
    selector
  );
}

export async function jsHandleToComponent(
  handle: JSHandle<any> | null,
  context: iAssertionContext,
  name: string,
  path: string
): Promise<iValue> {
  return handle
    ? await ExtJsComponent.create(handle, context, name, path)
    : new Value(null, context, name, path);
}
