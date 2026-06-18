/**
 *
 * Sadok e-book reader
 *
 * Profile management API in javascript
 *
 * Copyright 2024 Nicolas Mora <mail@babelouest.org>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU GENERAL PUBLIC LICENSE
 * License as published by the Free Software Foundation;
 * version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU GENERAL PUBLIC LICENSE for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 7235;
const DATA_FILE_PATH = process.env.DATA_FILE_PATH || "sadok.json"

fs.readFile(DATA_FILE_PATH, 'utf8', (err, data) => {
  if (err) {
    console.error("Error opening file", DATA_FILE_PATH, err);
    process.exit(1);
  }
  let json = JSON.parse(data);
  if (!json || json.constructor !== Object) {
    console.error("Error file content", DATA_FILE_PATH);
    process.exit(1);
  }
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/api/profile", (request, response) => {
  response.status(200).end()
});

app.get("/api/profile/:name/config", (request, response) => {
  let fileJson = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
  if (fileJson) {
    response.send(fileJson[request.params.name].config||{});
  } else {
    console.error("Error reading file", response)
    response.status(500).end()
  }
});

app.post("/api/profile/:name/config", (request, response) => {
  if (!!request.body && request.body.constructor === Object) {
    let fileJson = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
    if (fileJson) {
      if (!fileJson[request.params.name]) {
        fileJson[request.params.name] = {config: {}, bookshelf: {}}
      }
      fileJson[request.params.name].config = request.body;
      try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(fileJson));
        response.status(200).end()
      } catch (e) {
        console.error("Error writing file", response)
        response.status(500).end()
      }
    } else {
      console.error("Error reading file", response)
      response.status(500).end()
    }
  } else {
    response.status(400).end()
  }
});

app.get("/api/profile/:name/book", (request, response) => {
  let fileJson = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
  if (fileJson) {
    response.send(fileJson[request.params.name]?.bookshelf||{});
  } else {
    console.error("Error reading file", response)
    response.status(500).end()
  }
});

app.get("/api/profile/:name/book/:book_uri", (request, response) => {
  let fileJson = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
  if (fileJson) {
    response.send(fileJson[request.params.name].bookshelf[request.params.book_uri]||{});
  } else {
    console.error("Error reading file", response)
    response.status(500).end()
  }
});

app.post("/api/profile/:name/book/:book_uri", (request, response) => {
  if (!!request.body && request.body.constructor === Object) {
    let fileJson = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
    if (fileJson) {
      if (!fileJson[request.params.name]) {
        fileJson[request.params.name] = {config: {}, bookshelf: {}}
      }
      fileJson[request.params.name].bookshelf[request.params.book_uri] = request.body;
      try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(fileJson));
        response.status(200).end()
      } catch (e) {
        console.error("Error writing file", response)
        response.status(500).end()
      }
    } else {
      console.error("Error reading file", response)
      response.status(500).end()
    }
  } else {
    response.status(400).end()
  }
});
