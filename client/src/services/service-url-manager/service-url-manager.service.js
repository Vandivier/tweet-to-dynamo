const EllaUtils = require('ella-utils');

const oUrlMap = {
    'tweet': '{sBackendUri}tweet',
};

export class ServiceUrlManager {
    async fpRequest(sUrlKey, oOptions) {
        const oRequestOptions = oOptions.oRequestOptions || {};
        const oFetchConfig = {
            body: (oOptions.oRequestBody && JSON.stringify(oOptions.oRequestBody)) || null,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            //observe: oRequestOptions.bAsRawResponse ? 'response' : null,
            params: oRequestOptions.params || null,
            reportProgress: null,
            responseType: oRequestOptions.responseType || 'json',
            withCredentials: null,
        };
        let vUrl;

        oOptions.sMethod = oOptions.sMethod || 'GET';
        oFetchConfig.method = oOptions.sMethod.toUpperCase();
        oOptions.sBackendUri = oOptions.sBackendUri || this.fsGetBackendUri();

        if (window.location.href.slice(-9) === 'mock=true') {
            vUrl = _fMock();
        } else {
            if (sUrlKey[0] === '/' || sUrlKey.includes('http')) {
                // litteral url
                vUrl = sUrlKey;
            } else {
                // use oUrlMap
                vUrl = oUrlMap[sUrlKey] ? oUrlMap[sUrlKey] : sUrlKey;
            }
        }

        if (!vUrl) {
            return undefined;
        } else if (typeof vUrl === 'string') {
            vUrl = EllaUtils.fsSupplant(vUrl, oOptions);
        } else if (vUrl instanceof Object) {
            // it's a function not a url string
            return vUrl(oOptions, EllaUtils.State);
        }

        // oOptions.oFormData and oOptions.oRequestBody cannot be sent simultaneously
        // oOptions.oFormData will override and is not stringified; it's a real formData
        if (oOptions.oFormData) {
            oFetchConfig.body = oOptions.oFormData;
            delete oFetchConfig.headers['Content-Type']; // let browser handle multipart/form-data
        }

        if (typeof oRequestOptions.oHeaders === 'object') {
            oFetchConfig.headers = oRequestOptions.oHeaders || {}; // TODO: maybe use Object.assign instead?
        }

        if (oRequestOptions.sCredentials) {
            oFetchConfig.headers = oFetchConfig.headers || {};
            oFetchConfig.headers.authorization = 'Basic ' + oRequestOptions.sCredentials.replace(/["\\]/g, '');
            oFetchConfig.withCredentials = true;
        }

        try {
            const _oResponse = await fetch(vUrl, oFetchConfig);
            return oRequestOptions.bAsRawResponse ? _oResponse : _oResponse.json();
        } catch (e) {
            console.log('fetch error', e);
            return Promise.reject('fetch error');
            /* TODO: pseudocode:
            if (!bFromLogErrorCall) {
                fGet('log-error', {
                    'sErrorMessage': 'Get exception',
                    'soException': e.message
                });
            }
            */
        }

        function _fMock() {
            return 'mock/' + sUrlKey + '.json';
        }
    }

    fpGet(sUrlKey, oOptions) {
        oOptions = oOptions || {};
        oOptions.sMethod = 'GET';
        return this.fpRequest(sUrlKey, oOptions);
    }

    fpPost(sUrlKey, oOptions) {
        oOptions = oOptions || {};
        oOptions.sMethod = 'POST';
        return this.fpRequest(sUrlKey, oOptions);
    }

    fsGetBackendUri() {
        const oUriMap = {
            localhost: 'https://315xhau95d.execute-api.us-east-1.amazonaws.com/test/',
        };
        let sKey = window.location.origin.split('//')[1];
        let sMapResult;
        let sProtocol;

        if (sKey.includes('localhost:')) sKey = 'localhost';

        EllaUtils.State.sEnvironment = EllaUtils.State.sEnvironment || sKey;
        sMapResult = oUriMap[EllaUtils.State.sEnvironment];
        sProtocol = sMapResult.indexOf('http') === 0 ? '' : (window.location.protocol + '//');
        EllaUtils.State.sApiBaseUrl = sProtocol + sMapResult;

        return EllaUtils.State.sApiBaseUrl;
    }

    // ref: https://stackoverflow.com/questions/5142337/read-a-javascript-cookie-by-name
    // cookie name === cookie key
    fsGetCookie(sCookieName) {
        const cookiestring = RegExp('' + sCookieName + '[^;]+').exec(document.cookie);
        return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, '') : '');
    }

    // DOES NOT check whether cookie already exists. refer to fsGetCookie and check if needed.
    fsSetCookie(sCookieName, sCookieValue) {
        document.cookie = sCookieName + '=' + sCookieValue;
    }

    // ref: https://stackoverflow.com/questions/2144386/how-to-delete-a-cookie
    fDeleteCookie(sCookieName) {
        document.cookie = sCookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}
