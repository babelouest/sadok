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

import TimeRemaining from './TimeRemaining';

export default function ChapterItem({config, totalTokens, chapter, chapterOffset, offset, active, cbSetOffset}) {
  const selectChapter = (e, chapterOffset) => {
    e.preventDefault();
    if (cbSetOffset) {
      cbSetOffset(chapterOffset);
    }
  };

  let remainingJsx =
    <>
      <TimeRemaining offset={0} textSpeed={config.speedReaderTextSpeed} tokens={chapterOffset+chapter.tokens} compact={true}/>
      &nbsp;(<TimeRemaining offset={chapterOffset} textSpeed={config.speedReaderTextSpeed} tokens={totalTokens} compact={true}/>)
    </>
  let percent = Math.round((chapterOffset/totalTokens)*100), className = "", currentId = "";
  if (active) {
    className = " active";
    currentId = "sadok-current-chapter";
  }
  return (
    <>
      <a className={"list-group-item"+className}
         href="#"
         onClick={(e) => selectChapter(e, chapterOffset)}
         aria-current="true"
         id={currentId}
         data-bs-toggle={cbSetOffset?"offcanvas":""}
         data-bs-target={cbSetOffset?"#LeftMenu":""}>
        <div className="d-flex w-80 justify-content-between">
          <h6 className="mb-1 fw-bold">
            {chapter.label}
          </h6>
          <div>
            <small>
              {i18next.t("percent", {val: percent})+" - "+chapterOffset}
            </small>
          </div>
          {/*<div>
            <small>
              {remainingJsx}
            </small>
          </div>*/}
        </div>
      </a>
    </>
  );
}
