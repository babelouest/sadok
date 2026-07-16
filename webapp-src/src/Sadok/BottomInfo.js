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

import { READ_MODE } from '../lib/Constants';

import TimeRemaining from './TimeRemaining';
import NavButtons from './NavButtons';

export default function BottomInfo({
  book,
  bookProfile,
  chapterLabel,
  chapterIndex,
  offset,
  textSpeed,
  playReader,
  cbTogglePlay,
  cbNavigateNext,
  cbNavigatePrevious,
  cbNavigateBeginChapter,
  cbNavigateNextChapter
}) {
  if (book) {
    let displayJsx = [];
    if (chapterLabel) {
      displayJsx.push(<React.Fragment key={0}>{chapterLabel}</React.Fragment>);
    }
    if (book.metadata?.tokens) {
      if (chapterLabel) {
        displayJsx.push(<React.Fragment key={1}>{" - "}</React.Fragment>);
      }
      if (playReader) {
        displayJsx.push(<React.Fragment key={3}>{i18next.t("percent", {val: Math.floor(offset*100/book.metadata.tokens)})}</React.Fragment>);
      } else {
        displayJsx.push(<React.Fragment key={2}>{offset+"/"+book.metadata.tokens}</React.Fragment>);
        displayJsx.push(<React.Fragment key={3}>{" ("+i18next.t("percent", {val: Math.floor(offset*100/book.metadata.tokens)})+")"}</React.Fragment>);
      }
      if (bookProfile.readMode === READ_MODE.SPEED_READER) {
        displayJsx.push(<TimeRemaining key={4} offset={offset} textSpeed={textSpeed} tokens={book.metadata.tokens} />);
      }
    }
    return (
      <div className="row fixed-bottom elt-top" id="sadok-bottom">
        <div className="text-center">
          {book?.metadata?.tokens?<div className="opacity-75 alert alert-dark d-inline-block">
            {displayJsx}
          </div>:<></>}
          <div>
            {!playReader?<NavButtons book={book}
                                     offset={offset}
                                     chapterIndex={chapterIndex}
                                     fromMenu={false}
                                     cbTogglePlay={cbTogglePlay}
                                     cbNavigateNext={cbNavigateNext}
                                     cbNavigatePrevious={cbNavigatePrevious}
                                     cbNavigateBeginChapter={cbNavigateBeginChapter}
                                     cbNavigateNextChapter={cbNavigateNextChapter} />:<></>}
          </div>
        </div>
      </div>
    );
  }
}
