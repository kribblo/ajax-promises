# ajax-promises

Small utility library for making common types of [AJAX requests](https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started) and return [Promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) + some extras.

## API

All GET/POST methods take an optional `options` argument. It currently only supports the argument `headers` which is a key-value object of extra HTTP headers to send along. More options may follow. Note that `'Content-type'` is overwritten when doing POSTs.

* `get(url, options = {})` - GET url with options.
* `post(url, data, options = {})` - POST data to url (with options) as `x-www-form-urlencoded`. This usually works for POSTing to most 
* `postJson(url, data, options = {})` - POST data as JSON to url (with options).
* `head(url, options = {})` - HEAD request, then.
* `encodeQuery` - URL-encode a key-value object for use as query string.

### Promise enhancements

GET/POST promises returned can, instead of using `.then()`, call `.json()` in the same way to parse the result first. This is just the same as calling `then(JSON.parse)`.

The promises returned also have a `headers()` method which is a separate promise returning the headers of the request. If only the headers are of interest, use the `head()` method.
 
## Usage

### NPM (es6)

ajax-promises is written in es6, so if you are including the NPM module via browserify or similar, you may also need a [transpiler](https://en.wikipedia.org/wiki/Source-to-source_compiler) such as [babel](https://babeljs.io/)/[babelify](https://github.com/babel/babelify) if targeting current browsers.   

    npm install --save ajax-promises

```javascript
const ajaxPromises = require('ajax-promises');
```

### Javascript (es5)

The `dist` directory contains [UMD comipled files](https://github.com/umdjs/umd) (minified and not) with source-maps, transpiled to es5 that can be included directly using a `<script>` tag or loaded using [CommonJS](https://en.wikipedia.org/wiki/CommonJS) or [RequireJS](http://requirejs.org/).  

## Examples

```javascript
const data = {
    single: 'abcdefghi',
    multiple: ['abc', 'def', 'ghi']
};

// Simple get request
ajaxPromises.get(url)
    .then(console.log)
    .catch(console.error);

// Simple get with Object decoded from JSON as callback
ajaxPromises.get(url)
    .json(console.log)
    .catch(console.error);

// Add custom header
ajaxPromises.get(url, {headers: {Accept: 'application/json'}})
    .json(console.log)
    .catch(console.error);

// See the headers
ajaxPromises.get(url)
    .headers(console.log)
    .then(console.log)
    .catch(console.error);

// Get with data encoded as query string: 'single=abcdefghi&multiple=abc&multiple=def&multiple=ghi'
ajaxPromises.get(url + '?' + ajaxPromises.encodeQuery(data))
    .then(console.log)
    .catch(console.error);

// Post data as url-encoded form data
ajaxPromises.post(url, data)
    .then(console.log)
    .catch(console.error);

// Post data as raw JSON
ajaxPromises.postJson(url, data)
    .then(console.log)
    .catch(console.error);

// Pass promises on to something else
const hogan = require('hogan.js');
ajaxPromises.post(url, data)
    .then(hogan.compile)
    .then(console.log)
    .catch(console.error);

// Simple head request
ajaxPromises.head(url)
    .then(console.log)
    .catch(console.error);
```

## Contribute

Patches and enhancements very welcome! Please make sure `npm run lint` runs cleanly.
