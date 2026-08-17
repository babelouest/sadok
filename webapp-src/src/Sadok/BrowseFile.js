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
import BrowseBookProfile from './BrowseBookProfile';

export default function BrowseFile({item, bookProfile, cbOpenBook, cbOpenBookDir, cbViewBook}) {
  const viewBook = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cbViewBook(item);
  };

  const openBookDir = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    cbOpenBookDir(path);
  };

  return (
    <tr onClick={() => cbOpenBook(item)} className="clickable">
      <td className="text-break">
        {item.title}
      </td>
      <td className="text-break">
        {item.author}
      </td>
      <td>
         <SizeFormat size={item.size} />
      </td>
      <td>
        <DateFormat date={item.date} />
      </td>
      <td>
        {item.path!==undefined?<a href="#" onClick={(e) => openBookDir(e, item.path)} className="elt-left">
          <span className="badge text-bg-secondary rounded-pill">
            <img src="img/folder_open_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
          </span>
        </a>:<></>}
        <a href="#" onClick={viewBook} className="elt-left">
          <span className="badge text-bg-secondary rounded-pill">
            <img src="img/visibility_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
          </span>
        </a>
        <BrowseBookProfile bookProfile={bookProfile} />
      </td>
    </tr>
  );
}
