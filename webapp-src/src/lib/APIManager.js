/**
 * 
 * Sadok e-book reader
 * 
 * Copyright 2026 Nicolas Mora <mail@babelouest.org>
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
 * for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <https://www.gnu.org/licenses/>. 
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
    });
	}
}

let apiManager = new APIManager();

export default apiManager;
