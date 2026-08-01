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

import BrowseIconBook from './BrowseIconBook';
import BrowseIconDir from './BrowseIconDir';

export default function BrowseIcons({list, show, bookProfiles, cbOpenBook, cbOpenDir, cbViewBook}) {
  return (
    <div className="row">
      {list.map((elt, index) => {
        if (elt.type !== "dir" && (show === true || show === "files")) {
          return (
            <BrowseIconBook key={"book"+elt.url} book={elt} cbOpenBook={cbOpenBook} cbViewBook={cbViewBook} />
          );
        } else if (show === true || show === "folders") {
          return (
            <BrowseIconDir key={"dir"+elt.title} dir={elt} cbOpenDir={cbOpenDir} />
          );
        }
      })}
    </div>
  );
}
