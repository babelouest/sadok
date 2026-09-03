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

import BrowseDir from './BrowseDir';
import BrowseFile from './BrowseFile';
import SortIcon from './SortIcon';
import { findBookProfileByUri } from '../lib/Profile';

export default function BrowseTab({list, show, bookProfiles, order, cbOpenBook, cbOpenDir, cbOpenBookDir, cbViewBook, cbChangeOrder}) {

  let listDirJsx = [], listFilesJsx = [];
  list.forEach((item, index) => {
    if (item.type === "dir" && (show === true || show === "folders")) {
      listDirJsx.push (
        <BrowseDir key={index+item.title} item={item} cbOpenDir={cbOpenDir} />
      );
    } else if (item.type !== "dir" && (show === true || show === "files")) {
      listFilesJsx.push (
        <BrowseFile key={index+item.url} item={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} cbOpenBookDir={cbOpenBookDir} cbViewBook={cbViewBook} />
      );
    }
  });
  return (
    <div className="browse-content">
    <div className="overflow-auto table-responsive table-scroll-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">
              <a href="#" onClick={(e) => cbChangeOrder(e, "title")}>
                {i18next.t("browse-title")}
                <SortIcon column={order.orderColumn==="title"} asc={order.orderAsc} />
              </a>
            </th>
            <th scope="col">
              <a href="#" onClick={(e) => cbChangeOrder(e, "author")}>
                {i18next.t("browse-author")}
                <SortIcon column={order.orderColumn==="author"} asc={order.orderAsc} />
              </a>
            </th>
            <th scope="col">
              <a href="#" onClick={(e) => cbChangeOrder(e, "size")}>
                {i18next.t("browse-size")}
                <SortIcon column={order.orderColumn==="size"} asc={order.orderAsc} />
              </a>
            </th>
            <th scope="col">
              <a href="#" onClick={(e) => cbChangeOrder(e, "date")}>
                {i18next.t("browse-date")}
                <SortIcon column={order.orderColumn==="date"} asc={order.orderAsc} />
              </a>
            </th>
            <th scope="col">
            </th>
          </tr>
        </thead>
        <tbody>
          {listDirJsx}
          {listFilesJsx}
        </tbody>
      </table>
    </div>
    </div>
  );
}
