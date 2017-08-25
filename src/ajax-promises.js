var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function addHeaders(request, options) {
    const headers = options.headers || {};
    for(let header in headers) {
        request.setRequestHeader(header, headers[header]);
    }
}

function createRequest(url, options) {
    const request = new XMLHttpRequest();
    const method = options.method || 'GET';
    request.open(method, url);
    request.withCredentials = options.withCredentials || false;
    addHeaders(request, options);
    return request;
}

function addHandlers(request, resolve, reject) {
    request.onload = function() {
        if(request.status >= 200 && request.status < 400) {
            resolve(request.responseText);
        } else {
            const error = Error(request.statusText || 'Unknown failure; possibly CORS');
            error.status = request.status;
            error.request = request;
            reject(error);
        }
    };
    request.onerror = function(e) {
        e.request = request;
        reject(e);
    };
}

function encodeQuery(data) {
    const urlData = [];

    for(let key in data) {
        const value = Array.isArray(data[key]) ? data[key] : [data[key]];
        value.forEach(v => {
            urlData.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
        });
    }
    return urlData.join('&');
}

function load(url, options) {
    const request = createRequest(url, options);

    const promise = new Promise((resolve, reject) => {
        addHandlers(request, resolve, reject);
        request.send(options.data);
    });

    function headers(executor) {
        return new Promise((resolve, reject) => {
            executor = executor || resolve;
            request.onreadystatechange = function() {
                if(this.readyState === this.HEADERS_RECEIVED) {
                    executor(request.getAllResponseHeaders());
                }
            };
            promise.then(resolve);
            promise.catch(reject);
        });
    }

    function json(executor) {
        return new Promise((resolve, reject) => {
            promise.then(JSON.parse)
                .then(executor || resolve)
                .catch(reject);
        });
    }

    promise.json = json;
    promise.headers = headers;

    return promise;
}

/**
 * XMLHttpRequest to Promise wrapper, with JSON functionality built in.
 */
const ajaxPromises = {

    /**
     * @property {String} version current version of ajaxPromises
     */
    version: '__VERSION__',

    /**
     * URL encode data for use as query string.
     */
    encodeQuery,

    /**
     * GET url with options.
     */
    get(url, options = {}) {
        options.method = 'GET';
        options.data = null;
        return load(url, options);
    },

    /**
     * POST data to url (with options) as an URL-encoded form. This usually works anywhere, with anything.
     */
    post(url, data, options = {}) {
        options.method = 'POST';
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        options.data = encodeQuery(data);
        return load(url, options);
    },

    /**
     * POST raw JSON to url (with options).
     */
    postJson(url, data, options = {}) {
        options.method = 'POST';
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/json; charset=UTF-8';
        options.data = JSON.stringify(data);
        return load(url, options);
    },

    /**
     * HEAD url with options.
     *
     * @returns {Object} the headers returned from the URL.
     */
    head(url, options = {}) {
        options.method = 'HEAD';
        options.data = null;
        return load(url, options).headers();
    },

};

module.exports = ajaxPromises;
