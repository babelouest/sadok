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

import React, { useState, useEffect } from 'react';

export default function TopTitle({book, cbTogglePlay}) {
  let title = [];
  if (book?.metadata?.author?.name) {
    title.push(book?.metadata?.author?.name);
  }
  if (book?.metadata?.title) {
    title.push(book?.metadata?.title);
  }
  return (
    <div className="row elt-bottom book-title-row">
      <div className="col text-center">
        <h1>
          <span onClick={cbTogglePlay} id="sadok-title" className="book-title">{title.join(" - ")}</span>
        </h1>
      </div>
    </div>
  );
}
