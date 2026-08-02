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
import i18next from 'i18next';

import SizeFormat from './SizeFormat';
import DateFormat from './DateFormat';

export default function BrowseIconBookMetadata({book, cbOpenBookDir, cbViewBook}) {
  let yearJsx, authorJsx, sizeJsx, tokensJsx;
  if (book.year) {
    yearJsx = book.year;
  }
  if (book.author) {
    if (yearJsx) {
      authorJsx = " - " + book.author;
    } else {
      authorJsx = book.author;
    }
  }
  if (book.size) {
    sizeJsx = <SizeFormat size={book.size} />;
  }
  if (book.tokens) {
    if (sizeJsx) {
      tokensJsx = " - " + i18next.t("word-length", {val: book.tokens});
    } else {
      tokensJsx = i18next.t("word-length", {val: book.tokens});
    }
  }
  return (
    <div className="card-body">
      <p className="card-text">{book.title}</p>
      {yearJsx||authorJsx?<p className="card-text">{yearJsx}{authorJsx}</p>:<></>}
      {sizeJsx||tokensJsx?<p className="card-text">{sizeJsx}{tokensJsx}</p>:<></>}
      {book.path!==undefined?<a href="#" onClick={() => cbOpenBookDir(book.path)} className="elt-left">
        <span className="badge text-bg-secondary rounded-pill">
          <img src="img/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </span>
      </a>:<></>}
      <a href="#" onClick={() => cbViewBook(book)}>
        <span className="badge text-bg-secondary rounded-pill">
          <img src="img/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </span>
      </a>
    </div>
  );
}
