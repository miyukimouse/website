import jquery from 'jquery';

export default class WBDataModel {
  constructor(){
    // place to store raw results from previous requests
    this._raw = {};
  }

  _getOrFetch(name, url, options){

    if (!this._raw[name]) {
      this._raw[name] = this._remoteFetch(url, options);
    }

    return this._raw[name];
  }

  _remoteFetch(url, options={}){

    return new Promise((resolve, reject) => {
      console.log(url);
      jquery.ajax(url, {
        ...options,
        success: (result) => {
          resolve(result);
        },
        error: ([,,error]) => {
          console.log(`Error: ${error}`);
          reject(error);
        },
      });
    });
  }


  _urlFor(path, params={}, options={}) {
    const delimiter = ';';
    const paramsNew = {
      ...params,
      //'content-type': 'application/json'
    };
    const paramsStr = Object.keys(paramsNew)
    .map((key) => {
      const value = paramsNew[key];
      if (Array.isArray(value)){
        return value.map((v) => `${key}=${v}`).join(delimiter);
      }
      return `${key}=${value}`;
    })
    .join(delimiter);

    const {pathPrefix} = {
      pathPrefix: '/rest/parasite/',
      ...options
    };

    return `${pathPrefix}${path}?${paramsStr}`;
  }
}


