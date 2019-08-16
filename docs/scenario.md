# Scenario

A scenario is a collection of tests. It is a child of a Suite.

## Methods

### after(callback: Function): Scenario

This will be called immediately after the scenario completes execution. You can set more than one and they will be called in the order that they were set.

If this callback returns a promise, further callbacks are delayed until the promise resolves.

### before(callback: Function): Scenario

This will be called immediately before the scenario executes the request. You can set more than one and they will be called in the order that they were set.

If this callback returns a promise, execution is delayed until the promise resolves.

### comment(message: string)

Write a comment line to the output log.

### error(callback: Function, scenario: Scenario): Scenario

Set an error callback. This function will be called if there are any exceptions encountered in this scenario. It is important to understand, this is not the same as an assertion failure. This will be unhandled errors. You can set more than one of these callbacks and they will be called in the order set.

```typescript
scenario.error((msg: string) => {
    console.log(msg);
})
```

Additionally you can return a promise. Execution will be delayed until the promise is resolved.

### execute(): Promise<Scenario>

You don't normally need to call this method. However, if you set the wait method to true then use this to start execution.

### failure(callback: Function): Scenario

Assign a callback that will be hit whenever the scenario completes with at least one failed assertion. You can set more than one of these callbacks, which will be called in the order they are set.

```typescript
scenario.failure((scenario: Scenario) => {
    console.log(':-(');
})
```

Additionally you can return a promise. Execution will be delayed until the promise is resolved.

```typescript
scenario.failure((scenario: Scenario) => {
    return new Promise((resolve) => {
        console.log('I am sad that we failed an assertion, so I will delay further execution one second.');
        setTimeout(resolve, 1000);
    });
})
```

### finally(callback: Function): Scenario

This will be called after everything else has been called. This is the last hoorah of the scenario. It will be called regardless of pass, failure, or error. Multiple finally callbacks can be set and they will execute in the order set.

```typescript
scenario.finally((scenario: Scenario) => {
    console.log(
        scenario.hasPassed ? ':-)' : ':-('
    );
});
```

### getLog(): Promise<iLogLine[]>

Return the logs from each line of the test, including passes, fails, and comments.

### logResult(result: AssertionResult)

Write a result line to the output log.

### logWarning(message: string): Scenario

Write a non-fatal warning line to the output log.

### next(): Scenario

These callbacks will contain the assertions and other parts of the scenario we want to execute. Next can be chained to group the scenario into logical sections. The method has two overload possibilities:

#### next(message: string, callback: any): Scenario

```javascript
scenario.next('Fill out the form', async (context) => {
    const form = await context.find('form');
    await form.fillForm({
        'q': 'Flagpole JS QA'
    })
});
```

#### next(callback: any): Scenario

```javascript
scenario.next(async (context) => {
    const form = await context.find('form');
    await form.fillForm({
        'q': 'Flagpole JS QA'
    })
});
```

### open(url: string): Scenario

Set the URL that the scenario should open. If at least one next callback has already been set, this will cause the scenario to start executing (unless you have set wait to true). Typically this is a relative URL, which will be built based on the suite's base.

### shouldFollowRedirects(onRedirect: boolean | Function): Scenario

Redirects can be tricky. Passing in false as the argument prevents the request from following any redirects. Passing in a callback function instead allows you to determine if it should follow a given redirect by returning a boolean.

### setBasicAuth(authorization: { username: string, password: string }): Scenario

Set basic authentication schema for sites that expect this old fashioned auth strategy.

### setBearerToken(token: string): Scenario

Many APIs are starting to use the bearer token method of authentication. This will set the header accordingly.

### setCookie(key: string, value: string, opts?: any): Scenario

Set a cookie with a key and value. The opts allow you to set additional options like domain and ttl. 

Options supports these properties, in line with the ToughCookie format.

* expires - Date - if set, the Expires= attribute of the cookie (defaults to the string "Infinity"). See setExpires()
* maxAge - seconds - if set, the Max-Age= attribute in seconds of the cookie. May also be set to strings "Infinity" and "-Infinity" for non-expiry and immediate-expiry, respectively. See setMaxAge()
* domain - string - the Domain= attribute of the cookie
* path - string - the Path= of the cookie
* secure - boolean - the Secure cookie flag
* httpOnly - boolean - the HttpOnly cookie flag
* extensions - Array - any unrecognized cookie attributes as strings (even if equal-signs inside)
* creation - Date - when this cookie was constructed
* creationIndex - number - set at construction, used to provide greater sort precision (please see cookieCompare(a,b) for a full explanation)

### setFormData(form: {}): Scenario

When you want to simulate a form submission, pass in those values here. It expects an object, which will be serialized automatically in this method.

### setHeader(key: string, value: any): Scenario

Set a single header.

```javascript
scenario.setHeader('jwt_token', 'your-token-here')
```

### setHeaders(headers: {}): Scenario

Allows you to set multiple headers at once with a key-value object. This does not remove existing headers, it overlays on top of the existing headers that have been set.

```javascript
scenario.setHeader({
    'jwt_token', 'your-token-here',
    'jwt_refresh', 'your-refresh-token-here'
})
```

### setJsonBody(jsonObject: any): Scenario

Sets the JSON Body that will be submitted with the request. This can only be called before the scenario has executed. This is the same thing as setRawBody, except that it accepts an object that will be stringified through this method.

```javascript
scenario.setJsonBody({
    athlete: {
        firstName: "Jose",
        lastName: "Canseco"
    }
});
```

### setMaxRedirects(n: number): Scenario

Sometimes tests can get stuck in a redirect loop. This limits how many times to allow redirects.

### setMethod(method: string): Scenario

Set the HTTP Method of the request. This can accept any value but typically it would be one the following:

* GET
* POST
* PUT
* DELETE
* PATCH
* OPTIONS

### setProxyUrl(proxyUrl: string): Scenario

If your network requires you to proxy the request through another URL, set that here.

### setRawBody(str: string): Scenario

Sets the raw post body that will be submitted with the request. This can only be run before the scenario has executed.

```javascript
scenario.setRawBody('what up');
```

### setTimeout(timeout: number): Scenario

Set the request timeout for how long to wait for a response.

### skip(message?: string): Promise<Scenario>

Sometimes, perhaps based on the results from a previous scenario in the suite, we want to skip a certain scenario. All scenarios must be completed in one way or another, in order for the parent suite to complete. So if we determine that a certain scenario should not run, we use skip. It will appear in the output as skipped and will not count as failed or passed.

```javascript
scenario.skip('There were no images on the page, so we skipped the image validation scenario.');
```

### subheading(message: string)

Write a subheading element to the output log.

### subscribe(callback: Function)

Subscribes to updates to the status of this scenario.

### success(callback: Function): Scenario

This callback will be hit after the scenario completes, if all of the assertions pass. You can set more than one of these callbacks and they'll be called in the order they were set.

The this context will be the current scenario, but if you do an arrow function you'll need to use the argument.

```javascript
scenario.success((scenario: Scenario) => {
    console.log('PASSED!!')
});
```

Additionally you can return a promise. Execution will be delayed until the promise is resolved.

### verifySslCert(verify: boolean): Scenario

By default the request will verify a valid SSL certificate if the URL is set to https protocol. Sometimes we don't want this to happen, like when we're running against a local environment that doesn't have an actual SSL certificate. Pass in false to this method to disable this check.

```javascript
scenario.verifySslCert(false);
```

### wait(bool: boolean = true): Scenario

Sometimes you may NOT want to execute a scenario until you specifically say so. By setting this argument to true, the scenario will not run until you call the execute method--even once you set a next callback and open URL. Default argument is true.

```javascript
scenario.wait();
```

## Properties 

Most of these properties are read only. You can not set any of them directly, unless otherwise designated.

### canExecute: boolean 

Indicates whether this scenario can potentially execute. A scenario can only execute once, so if it has already excuted this will be false. Additionally a scenario requires both a URL to open (via the open method) and at least one next callback (set with the next method).

### executionDuration: number | null

The total time between when the Scenario was started executing and when it finished running. Null if it has not yet completed.

### finalUrl: string | null

Get the final URL of the response after all redirects.

### hasExecuted: boolean 

Has this scenario already started executing?

### hasFailed: boolean

Did this Suite (or any of its Scenarios) fail? If the Suite is not yet completed (or hasn't started yet) this will be false, unless any Scenario has already failed.

### hasFinished: boolean

Has this scenario already finished executing?

### hasPassed: boolean

Did this Suite (and all of its Scenarios) complete and all were passing?

suite.hasPassed

### requestOptions(): any

Get the options that we have set for the request. This will include cookies, headers, JSON Body, and anything else that we set.

### responseDuration: number | null

The total time between when the Scenario's request went out and when the response back back. Null if it the request has not yet returned a response.

### responseType: ResponseType

The type of Scenario this is, the type of request we'll make and the response we'll expect back.

*Possible Values: html, json, image, stylesheet, script, video, audio, resource, browser, extjs*

### title: string

Title of the Scenario as it will be printed on reports. This is both a getter and a setter.

### totalDuration: number | null

The total time between when the Scenario was initialized and when it finished running. Null if it has not yet completed.

### url: string | null

Get the original URL of the request. This will be an absolute URL, derived from the path set in the open method and the suite's base.