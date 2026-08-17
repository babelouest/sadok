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
import SortIcon from './SortIcon';
import { findBookProfileByUri } from '../lib/Profile';

const sortList = (list, column, asc) => {
  if (column === "title") {
    if (asc) {
      return [...list].sort((a, b) => (a.title?.toLowerCase().localeCompare(b.title?.toLowerCase())));
    } else {
      return [...list].sort((a, b) => (b.title?.toLowerCase().localeCompare(a.title?.toLowerCase())));
    }
  } else if (column === "author") {
    if (asc) {
      return [...list].sort((a, b) => (a.author?.toLowerCase().localeCompare(b.author?.toLowerCase())));
    } else {
      return [...list].sort((a, b) => (b.author?.toLowerCase().localeCompare(a.author?.toLowerCase())));
    }
  } else if (column === "size") {
    if (asc) {
      return [...list].sort((a, b) => a.size - b.size);
    } else {
      return [...list].sort((a, b) => b.size - b.size);
    }
  } else if (column === "date") {
    if (asc) {
      return [...list].sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime());
    } else {
      return [...list].sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
    }
  } else {
    return list;
  }
};

export default function BrowseIcons({list, show, bookProfiles, cbOpenBook, cbOpenDir, cbOpenBookDir, cbViewBook}) {
  const [ orderColumn, setOrderColumn ] = useState("title");
  const [ orderAsc, setOrderAsc ] = useState(true);

  const changeOrder = (e, order) => {
    e.preventDefault();
    if (order === orderColumn) {
      setOrderAsc(!orderAsc);
    } else {
      setOrderColumn(order);
      setOrderAsc(true);
    }
  };

  let listDirJsx = [], listFilesJsx = [];
  sortList(list, orderColumn, orderAsc).forEach((item, index) => {
    if (item.type === "dir" && (show === true || show === "folders")) {
      listDirJsx.push (
        <BrowseIconDir key={index+item.title} dir={item} cbOpenDir={cbOpenDir} />
      );
    } else if (item.type !== "dir" && (show === true || show === "files")) {
      listFilesJsx.push (
        <BrowseIconBook key={index+item.url} book={item} bookProfile={findBookProfileByUri(bookProfiles, item.url)} cbOpenBook={cbOpenBook} cbOpenBookDir={cbOpenBookDir} cbViewBook={cbViewBook} />
      );
    }
  });
  return (
    <>
      <div className="overflow-auto table-responsive">
        <table className="table">
          <thead className="">
            <tr>
              <th scope="col">
                <a href="#" onClick={(e) => changeOrder(e, "title")}>
                  {i18next.t("browse-title")}
                  <SortIcon column={orderColumn==="title"} asc={orderAsc} />
                </a>
              </th>
              <th scope="col">
                <a href="#" onClick={(e) => changeOrder(e, "author")}>
                  {i18next.t("browse-author")}
                  <SortIcon column={orderColumn==="author"} asc={orderAsc} />
                </a>
              </th>
              <th scope="col">
                <a href="#" onClick={(e) => changeOrder(e, "size")}>
                  {i18next.t("browse-size")}
                  <SortIcon column={orderColumn==="size"} asc={orderAsc} />
                </a>
              </th>
              <th scope="col">
                <a href="#" onClick={(e) => changeOrder(e, "date")}>
                  {i18next.t("browse-date")}
                  <SortIcon column={orderColumn==="date"} asc={orderAsc} />
                </a>
              </th>
              <th scope="col">
              </th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
      <div className="browse-content">
        <div className="row">
          {listDirJsx}
          {listFilesJsx}
        </div>
      </div>
    </>
  );
}
