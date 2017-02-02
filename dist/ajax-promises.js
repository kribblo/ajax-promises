(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ajaxPromises = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function addHeaders(request, options) {
    var headers = options.headers || {};
    for (var header in headers) {
        request.setRequestHeader(header, headers[header]);
    }
}

function createRequest(url, options) {
    var request = new XMLHttpRequest();
    var method = options.method || 'GET';
    request.open(method, url);
    request.withCredentials = options.withCredentials || false;
    addHeaders(request, options);
    return request;
}

function addHandlers(request, resolve, reject) {
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            resolve(request.responseText);
        } else {
            var error = Error(request.statusText || 'Unknown failure; possibly CORS');
            error.status = request.status;
            reject(error);
        }
    };
    request.onerror = function (e) {
        reject(e);
    };
}

function encodeQuery(data) {
    var urlData = [];

    var _loop = function _loop(key) {
        var value = Array.isArray(data[key]) ? data[key] : [data[key]];
        value.forEach(function (v) {
            urlData.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
        });
    };

    for (var key in data) {
        _loop(key);
    }
    return urlData.join('&');
}

function load(url, options) {
    var request = createRequest(url, options);

    var promise = new Promise(function (resolve, reject) {
        addHandlers(request, resolve, reject);
        request.send(options.data);
    });

    function headers(executor) {
        return new Promise(function (resolve, reject) {
            executor = executor || resolve;
            request.onreadystatechange = function () {
                if (this.readyState == this.HEADERS_RECEIVED) {
                    executor(request.getAllResponseHeaders());
                }
            };
            promise.then(resolve);
            promise.catch(reject);
        });
    }

    function json(executor) {
        return new Promise(function (resolve, reject) {
            promise.then(JSON.parse).then(executor || resolve).catch(reject);
        });
    }

    promise.json = json;
    promise.headers = headers;

    return promise;
}

/**
 * XMLHttpRequest to Promise wrapper, with JSON functionality built in.
 */
var ajaxPromises = {

    /**
     * @property {String} version current version of ajaxPromises
     */
    version: '1.0.1',

    /**
     * URL encode data for use as query string.
     */
    encodeQuery: encodeQuery,

    /**
     * GET url with options.
     */
    get: function get(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        options.method = 'GET';
        options.data = null;
        return load(url, options);
    },


    /**
     * POST data to url (with options) as an URL-encoded form. This usually works anywhere, with anything.
     */
    post: function post(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        options.method = 'POST';
        options.headers = options.headers || {};
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        options.data = encodeQuery(data);
        return load(url, options);
    },


    /**
     * POST raw JSON to url (with options).
     */
    postJson: function postJson(url, data) {
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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
    head: function head(url) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        options.method = 'HEAD';
        options.data = null;
        return load(url, options).headers();
    }
};

module.exports = ajaxPromises;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWpheC1wcm9taXNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxVQUFULENBQW9CLE9BQXBCLEVBQTZCLE9BQTdCLEVBQXNDO0FBQ2xDLFFBQU0sVUFBVSxRQUFRLE9BQVIsSUFBbUIsRUFBbkM7QUFDQSxTQUFJLElBQUksTUFBUixJQUFrQixPQUFsQixFQUEyQjtBQUN2QixnQkFBUSxnQkFBUixDQUF5QixNQUF6QixFQUFpQyxRQUFRLE1BQVIsQ0FBakM7QUFDSDtBQUNKOztBQUVELFNBQVMsYUFBVCxDQUF1QixHQUF2QixFQUE0QixPQUE1QixFQUFxQztBQUNqQyxRQUFNLFVBQVUsSUFBSSxjQUFKLEVBQWhCO0FBQ0EsUUFBTSxTQUFTLFFBQVEsTUFBUixJQUFrQixLQUFqQztBQUNBLFlBQVEsSUFBUixDQUFhLE1BQWIsRUFBcUIsR0FBckI7QUFDQSxZQUFRLGVBQVIsR0FBMEIsUUFBUSxlQUFSLElBQTJCLEtBQXJEO0FBQ0EsZUFBVyxPQUFYLEVBQW9CLE9BQXBCO0FBQ0EsV0FBTyxPQUFQO0FBQ0g7O0FBRUQsU0FBUyxXQUFULENBQXFCLE9BQXJCLEVBQThCLE9BQTlCLEVBQXVDLE1BQXZDLEVBQStDO0FBQzNDLFlBQVEsTUFBUixHQUFpQixZQUFXO0FBQ3hCLFlBQUcsUUFBUSxNQUFSLElBQWtCLEdBQWxCLElBQXlCLFFBQVEsTUFBUixHQUFpQixHQUE3QyxFQUFrRDtBQUM5QyxvQkFBUSxRQUFRLFlBQWhCO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsZ0JBQU0sUUFBUSxNQUFNLFFBQVEsVUFBUixJQUFzQixnQ0FBNUIsQ0FBZDtBQUNBLGtCQUFNLE1BQU4sR0FBZSxRQUFRLE1BQXZCO0FBQ0EsbUJBQU8sS0FBUDtBQUNIO0FBQ0osS0FSRDtBQVNBLFlBQVEsT0FBUixHQUFrQixVQUFTLENBQVQsRUFBWTtBQUMxQixlQUFPLENBQVA7QUFD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LE1BQWpCO0FBQ0EsZ0JBQVEsT0FBUixHQUFrQixRQUFRLE9BQVIsSUFBbUIsRUFBckM7QUFDQSxnQkFBUSxPQUFSLENBQWdCLGNBQWhCLElBQWtDLGlDQUFsQztBQUNBLGdCQUFRLElBQVIsR0FBZSxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQWY7QUFDQSxlQUFPLEtBQUssR0FBTCxFQUFVLE9BQVYsQ0FBUDtBQUNILEtBekNnQjs7O0FBMkNqQjs7Ozs7QUFLQSxRQWhEaUIsZ0JBZ0RaLEdBaERZLEVBZ0RPO0FBQUEsWUFBZCxPQUFjLHVFQUFKLEVBQUk7O0FBQ3BCLGdCQUFRLE1BQVIsR0FBaUIsTUFBakI7QUFDQSxnQkFBUSxJQUFSLEdBQWUsSUFBZjtBQUNBLGVBQU8sS0FBSyxHQUFMLEVBQVUsT0FBVixFQUFtQixPQUFuQixFQUFQO0FBQ0g7QUFwRGdCLENBQXJCOztBQXdEQSxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gYWRkSGVhZGVycyhyZXF1ZXN0LCBvcHRpb25zKSB7XG4gICAgY29uc3QgaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcbiAgICBmb3IobGV0IGhlYWRlciBpbiBoZWFkZXJzKSB7XG4gICAgICAgIHJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVSZXF1ZXN0KHVybCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBjb25zdCBtZXRob2QgPSBvcHRpb25zLm1ldGhvZCB8fCAnR0VUJztcbiAgICByZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xuICAgIHJlcXVlc3Qud2l0aENyZWRlbnRpYWxzID0gb3B0aW9ucy53aXRoQ3JlZGVudGlhbHMgfHwgZmFsc2U7XG4gICAgYWRkSGVhZGVycyhyZXF1ZXN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gcmVxdWVzdDtcbn1cblxuZnVuY3Rpb24gYWRkSGFuZGxlcnMocmVxdWVzdCwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYocmVxdWVzdC5zdGF0dXMgPj0gMjAwICYmIHJlcXVlc3Quc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gRXJyb3IocmVxdWVzdC5zdGF0dXNUZXh0IHx8ICdVbmtub3duIGZhaWx1cmU7IHBvc3NpYmx5IENPUlMnKTtcbiAgICAgICAgICAgIGVycm9yLnN0YXR1cyA9IHJlcXVlc3Quc3RhdHVzO1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZW5jb2RlUXVlcnkoZGF0YSkge1xuICAgIGNvbnN0IHVybERhdGEgPSBbXTtcblxuICAgIGZvcihsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBBcnJheS5pc0FycmF5KGRhdGFba2V5XSkgPyBkYXRhW2tleV0gOiBbZGF0YVtrZXldXTtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCh2ID0+IHtcbiAgICAgICAgICAgIHVybERhdGEucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdXJsRGF0YS5qb2luKCcmJyk7XG59XG5cbmZ1bmN0aW9uIGxvYWQodXJsLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGNyZWF0ZVJlcXVlc3QodXJsLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGFkZEhhbmRsZXJzKHJlcXVlc3QsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIHJlcXVlc3Quc2VuZChvcHRpb25zLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaGVhZGVycyhleGVjdXRvcikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZXhlY3V0b3IgPSBleGVjdXRvciB8fCByZXNvbHZlO1xuICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnJlYWR5U3RhdGUgPT0gdGhpcy5IRUFERVJTX1JFQ0VJVkVEKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dG9yKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICBwcm9taXNlLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGpzb24oZXhlY3V0b3IpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihKU09OLnBhcnNlKVxuICAgICAgICAgICAgICAgIC50aGVuKGV4ZWN1dG9yIHx8IHJlc29sdmUpXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb21pc2UuanNvbiA9IGpzb247XG4gICAgcHJvbWlzZS5oZWFkZXJzID0gaGVhZGVycztcblxuICAgIHJldHVybiBwcm9taXNlO1xufVxuXG4vKipcbiAqIFhNTEh0dHBSZXF1ZXN0IHRvIFByb21pc2Ugd3JhcHBlciwgd2l0aCBKU09OIGZ1bmN0aW9uYWxpdHkgYnVpbHQgaW4uXG4gKi9cbmNvbnN0IGFqYXhQcm9taXNlcyA9IHtcblxuICAgIC8qKlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB2ZXJzaW9uIGN1cnJlbnQgdmVyc2lvbiBvZiBhamF4UHJvbWlzZXNcbiAgICAgKi9cbiAgICB2ZXJzaW9uOiAnMS4wLjEnLFxuXG4gICAgLyoqXG4gICAgICogVVJMIGVuY29kZSBkYXRhIGZvciB1c2UgYXMgcXVlcnkgc3RyaW5nLlxuICAgICAqL1xuICAgIGVuY29kZVF1ZXJ5LFxuXG4gICAgLyoqXG4gICAgICogR0VUIHVybCB3aXRoIG9wdGlvbnMuXG4gICAgICovXG4gICAgZ2V0KHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIG9wdGlvbnMubWV0aG9kID0gJ0dFVCc7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IG51bGw7XG4gICAgICAgIHJldHVybiBsb2FkKHVybCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFBPU1QgZGF0YSB0byB1cmwgKHdpdGggb3B0aW9ucykgYXMgYW4gVVJMLWVuY29kZWQgZm9ybS4gVGhpcyB1c3VhbGx5IHdvcmtzIGFueXdoZXJlLCB3aXRoIGFueXRoaW5nLlxuICAgICAqL1xuICAgIHBvc3QodXJsLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnUE9TVCc7XG4gICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xuICAgICAgICBvcHRpb25zLmRhdGEgPSBlbmNvZGVRdWVyeShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGxvYWQodXJsLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUE9TVCByYXcgSlNPTiB0byB1cmwgKHdpdGggb3B0aW9ucykuXG4gICAgICovXG4gICAgcG9zdEpzb24odXJsLCBkYXRhLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnUE9TVCc7XG4gICAgICAgIG9wdGlvbnMuaGVhZGVycyA9IG9wdGlvbnMuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04JztcbiAgICAgICAgb3B0aW9ucy5kYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgIHJldHVybiBsb2FkKHVybCwgb3B0aW9ucyk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhFQUQgdXJsIHdpdGggb3B0aW9ucy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IHRoZSBoZWFkZXJzIHJldHVybmVkIGZyb20gdGhlIFVSTC5cbiAgICAgKi9cbiAgICBoZWFkKHVybCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIG9wdGlvbnMubWV0aG9kID0gJ0hFQUQnO1xuICAgICAgICBvcHRpb25zLmRhdGEgPSBudWxsO1xuICAgICAgICByZXR1cm4gbG9hZCh1cmwsIG9wdGlvbnMpLmhlYWRlcnMoKTtcbiAgICB9LFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFqYXhQcm9taXNlcztcbiJdfQ==
