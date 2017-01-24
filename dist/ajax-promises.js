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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWpheC1wcm9taXNlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxVQUFULENBQW9CLE9BQXBCLEVBQTZCLE9BQTdCLEVBQXNDO0FBQ2xDLFFBQU0sVUFBVSxRQUFRLE9BQVIsSUFBbUIsRUFBbkM7QUFDQSxTQUFJLElBQUksTUFBUixJQUFrQixPQUFsQixFQUEyQjtBQUN2QixnQkFBUSxnQkFBUixDQUF5QixNQUF6QixFQUFpQyxRQUFRLE1BQVIsQ0FBakM7QUFDSDtBQUNKOztBQUVELFNBQVMsYUFBVCxDQUF1QixHQUF2QixFQUE0QixPQUE1QixFQUFxQztBQUNqQyxRQUFNLFVBQVUsSUFBSSxjQUFKLEVBQWhCO0FBQ0EsUUFBTSxTQUFTLFFBQVEsTUFBUixJQUFrQixLQUFqQztBQUNBLFlBQVEsSUFBUixDQUFhLE1BQWIsRUFBcUIsR0FBckI7QUFDQSxlQUFXLE9BQVgsRUFBb0IsT0FBcEI7QUFDQSxXQUFPLE9BQVA7QUFDSDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBOEIsT0FBOUIsRUFBdUMsTUFBdkMsRUFBK0M7QUFDM0MsWUFBUSxNQUFSLEdBQWlCLFlBQVc7QUFDeEIsWUFBRyxRQUFRLE1BQVIsSUFBa0IsR0FBbEIsSUFBeUIsUUFBUSxNQUFSLEdBQWlCLEdBQTdDLEVBQWtEO0FBQzlDLG9CQUFRLFFBQVEsWUFBaEI7QUFDSCxTQUZELE1BRU87QUFDSCxnQkFBTSxRQUFRLE1BQU0sUUFBUSxVQUFSLElBQXNCLGdDQUE1QixDQUFkO0FBQ0Esa0JBQU0sTUFBTixHQUFlLFFBQVEsTUFBdkI7QUFDQSxtQkFBTyxLQUFQO0FBQ0g7QUFDSixLQVJEO0FBU0EsWUFBUSxPQUFSLEdBQWtCLFVBQVMsQ0FBVCxFQUFZO0FBQzFCLGVBQU8sQ0FBUDtBQUNILEtBRkQ7QUFHSDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsSUFBckIsRUFB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Z0IsY0FBaEIsSUFBa0MsaUNBQWxDO0FBQ0EsZ0JBQVEsSUFBUixHQUFlLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBZjtBQUNBLGVBQU8sS0FBSyxHQUFMLEVBQVUsT0FBVixDQUFQO0FBQ0gsS0FuQ2dCOzs7QUFxQ2pCOzs7OztBQUtBLFFBMUNpQixnQkEwQ1osR0ExQ1ksRUEwQ087QUFBQSxZQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFDcEIsZ0JBQVEsTUFBUixHQUFpQixNQUFqQjtBQUNBLGdCQUFRLElBQVIsR0FBZSxJQUFmO0FBQ0EsZUFBTyxLQUFLLEdBQUwsRUFBVSxPQUFWLEVBQW1CLE9BQW5CLEVBQVA7QUFDSDtBQTlDZ0IsQ0FBckI7O0FBa0RBLE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBhZGRIZWFkZXJzKHJlcXVlc3QsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuICAgIGZvcihsZXQgaGVhZGVyIGluIGhlYWRlcnMpIHtcbiAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3QodXJsLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGNvbnN0IG1ldGhvZCA9IG9wdGlvbnMubWV0aG9kIHx8ICdHRVQnO1xuICAgIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCk7XG4gICAgYWRkSGVhZGVycyhyZXF1ZXN0LCBvcHRpb25zKTtcbiAgICByZXR1cm4gcmVxdWVzdDtcbn1cblxuZnVuY3Rpb24gYWRkSGFuZGxlcnMocmVxdWVzdCwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYocmVxdWVzdC5zdGF0dXMgPj0gMjAwICYmIHJlcXVlc3Quc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yID0gRXJyb3IocmVxdWVzdC5zdGF0dXNUZXh0IHx8ICdVbmtub3duIGZhaWx1cmU7IHBvc3NpYmx5IENPUlMnKTtcbiAgICAgICAgICAgIGVycm9yLnN0YXR1cyA9IHJlcXVlc3Quc3RhdHVzO1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gZW5jb2RlUXVlcnkoZGF0YSkge1xuICAgIGNvbnN0IHVybERhdGEgPSBbXTtcblxuICAgIGZvcihsZXQga2V5IGluIGRhdGEpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBBcnJheS5pc0FycmF5KGRhdGFba2V5XSkgPyBkYXRhW2tleV0gOiBbZGF0YVtrZXldXTtcbiAgICAgICAgdmFsdWUuZm9yRWFjaCh2ID0+IHtcbiAgICAgICAgICAgIHVybERhdGEucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2KSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdXJsRGF0YS5qb2luKCcmJyk7XG59XG5cbmZ1bmN0aW9uIGxvYWQodXJsLCBvcHRpb25zKSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGNyZWF0ZVJlcXVlc3QodXJsLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGFkZEhhbmRsZXJzKHJlcXVlc3QsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIHJlcXVlc3Quc2VuZChvcHRpb25zLmRhdGEpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gaGVhZGVycyhleGVjdXRvcikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgZXhlY3V0b3IgPSBleGVjdXRvciB8fCByZXNvbHZlO1xuICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnJlYWR5U3RhdGUgPT0gdGhpcy5IRUFERVJTX1JFQ0VJVkVEKSB7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWN1dG9yKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4ocmVzb2x2ZSk7XG4gICAgICAgICAgICBwcm9taXNlLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGpzb24oZXhlY3V0b3IpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihKU09OLnBhcnNlKVxuICAgICAgICAgICAgICAgIC50aGVuKGV4ZWN1dG9yIHx8IHJlc29sdmUpXG4gICAgICAgICAgICAgICAgLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByb21pc2UuanNvbiA9IGpzb247XG4gICAgcHJvbWlzZS5oZWFkZXJzID0gaGVhZGVycztcblxuICAgIHJldHVybiBwcm9taXNlO1xufVxuXG4vKipcbiAqIFhNTEh0dHBSZXF1ZXN0IHRvIFByb21pc2Ugd3JhcHBlciwgd2l0aCBKU09OIGZ1bmN0aW9uYWxpdHkgYnVpbHQgaW4uXG4gKi9cbmNvbnN0IGFqYXhQcm9taXNlcyA9IHtcbiAgICAvKipcbiAgICAgKiBVUkwgZW5jb2RlIGRhdGEgZm9yIHVzZSBhcyBxdWVyeSBzdHJpbmcuXG4gICAgICovXG4gICAgZW5jb2RlUXVlcnksXG5cbiAgICAvKipcbiAgICAgKiBHRVQgdXJsIHdpdGggb3B0aW9ucy5cbiAgICAgKi9cbiAgICBnZXQodXJsLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnR0VUJztcbiAgICAgICAgb3B0aW9ucy5kYXRhID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIGxvYWQodXJsLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUE9TVCBkYXRhIHRvIHVybCAod2l0aCBvcHRpb25zKSBhcyBhbiBVUkwtZW5jb2RlZCBmb3JtLiBUaGlzIHVzdWFsbHkgd29ya3MgYW55d2hlcmUsIHdpdGggYW55dGhpbmcuXG4gICAgICovXG4gICAgcG9zdCh1cmwsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBvcHRpb25zLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICBvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IGVuY29kZVF1ZXJ5KGRhdGEpO1xuICAgICAgICByZXR1cm4gbG9hZCh1cmwsIG9wdGlvbnMpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQT1NUIHJhdyBKU09OIHRvIHVybCAod2l0aCBvcHRpb25zKS5cbiAgICAgKi9cbiAgICBwb3N0SnNvbih1cmwsIGRhdGEsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBvcHRpb25zLm1ldGhvZCA9ICdQT1NUJztcbiAgICAgICAgb3B0aW9ucy5oZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICBvcHRpb25zLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLTgnO1xuICAgICAgICBvcHRpb25zLmRhdGEgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgcmV0dXJuIGxvYWQodXJsLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogSEVBRCB1cmwgd2l0aCBvcHRpb25zLlxuICAgICAqXG4gICAgICogQHJldHVybnMge09iamVjdH0gdGhlIGhlYWRlcnMgcmV0dXJuZWQgZnJvbSB0aGUgVVJMLlxuICAgICAqL1xuICAgIGhlYWQodXJsLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5tZXRob2QgPSAnSEVBRCc7XG4gICAgICAgIG9wdGlvbnMuZGF0YSA9IG51bGw7XG4gICAgICAgIHJldHVybiBsb2FkKHVybCwgb3B0aW9ucykuaGVhZGVycygpO1xuICAgIH0sXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYWpheFByb21pc2VzO1xuIl19
