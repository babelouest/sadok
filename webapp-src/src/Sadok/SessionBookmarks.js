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

export default function SessionBookmarks({sessionOffset, tokens, cbSetOffset, cbSessionClear}) {
  const setOffset = (e, offset) => {
    e.preventDefault();
    cbSetOffset(offset);
  };

  let sessionOffsetList = [];
  sessionOffset.reverse().forEach((sess, index) => {
    let percent = Math.round((sess/tokens)*100)
    if (!index) {
      sessionOffsetList.push(
        <li key={index} className="list-group-item active">
          <a href="#" onClick={(e) => setOffset(e, sess)} data-bs-toggle={cbSetOffset?"offcanvas":""} data-bs-target={cbSetOffset?"#LeftMenu":""} >
            <div>
              {sess}
            </div>
            <span className="badge text-bg-info rounded-pill">
              {i18next.t("percent", {val: percent})}
            </span>
          </a>
        </li>
      );
    } else {
      sessionOffsetList.push(
        <li key={index} className="list-group-item">
          <a href="#" onClick={(e) => setOffset(e, sess)} data-bs-toggle={cbSetOffset?"offcanvas":""} data-bs-target={cbSetOffset?"#LeftMenu":""} >
            <div>
              {sess}
            </div>
            <span className="badge text-bg-info rounded-pill">
              {i18next.t("percent", {val: percent})}
            </span>
          </a>
        </li>
      );
    }
  });
  return (
    <>
      <div className="list-group list-group-horizontal horizontal-scroll">
        <button type="button" className="list-group-item list-group-item-action" title={i18next.t("session-clear")} onClick={cbSessionClear}>
          <img src="img/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </button>
        {sessionOffsetList}
      </div>
    </>
  );
}
