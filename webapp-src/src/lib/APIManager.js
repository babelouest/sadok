/**
 * 
 * Sadok e-book reader
 * 
 * Copyright 2026 Nicolas Mora <mail@babelouest.org>
 * 
 * License AGPL
 * 
 */

class APIManager {
  constructor() {
    this.contentTypeJson = "application/json; charset=utf-8";
  }

	APIRequestExecute(url, method = "GET", data = false, accept = "application/json; charset=utf-8") {
    let headers = {
      Accept: accept
    };
    let jsonData = !!data?JSON.stringify(data):null;
    if (data) {
      headers['Content-Type'] = "application/json; charset=utf-8";
    }
    return fetch(url, {
			method: method,
			body: jsonData,
			headers: headers,
      redirect: "error"
    })
    .then(resp => {
      if (resp.ok) {
        try {
          return resp.json()
          .then(data => {
            return Promise.resolve(data);
          })
          .catch(err => {
            return Promise.resolve();
          });
        } catch (err) {
          return Promise.reject({err: constants.authStatusError});
        }
      } else {
        return Promise.reject("error");
      }
    })
	}
}

let apiManager = new APIManager();

export default apiManager;
