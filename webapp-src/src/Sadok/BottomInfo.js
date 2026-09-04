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
import NavScrollButtons from './NavScrollButtons';

export default function BottomInfo({
  book,
  bookProfile,
  chapterLabel,
  chapterIndex,
  chapterOffset,
  chapterTokens,
  offset,
  textSpeed,
  playReader,
  navToText,
  allowNavToText,
  cbToggleNavigateToText,
  cbTogglePlay,
  cbNavigateNext,
  cbNavigatePrevious,
  cbNavigateBeginChapter,
  cbNavigateNextChapter
}) {
  if (book) {
    let displayJsx = [];
    if (chapterLabel) {
      displayJsx.push(<div key={0}>{chapterLabel}</div>);
    }
    if (playReader) {
      displayJsx.push(<div key={2}>{i18next.t("chapter")} {i18next.t("percent", {val: Math.floor(chapterOffset*100/chapterTokens)})} - {i18next.t("book")} {i18next.t("percent", {val: Math.floor(offset*100/book.metadata?.tokens)})}</div>);
    } else {
      displayJsx.push(<div key={2}>{i18next.t("chapter")} {chapterOffset+"/"+chapterTokens} {" ("+i18next.t("percent", {val: Math.floor(chapterOffset*100/chapterTokens)})+")"} - {i18next.t("book")} {offset+"/"+book.metadata?.tokens} {" ("+i18next.t("percent", {val: Math.floor(offset*100/book.metadata?.tokens)})+")"}</div>);
    }
    if (bookProfile.readMode === READ_MODE.SPEED_READER) {
      displayJsx.push(<TimeRemaining key={4} offset={offset} textSpeed={textSpeed} tokens={book.metadata?.tokens} />);
    }
    let navButtonsJsx;
    if (!playReader && bookProfile.readMode !== READ_MODE.SCROLL) {
      navButtonsJsx = <NavButtons book={book}
                                  offset={offset}
                                  chapterIndex={chapterIndex}
                                  fromMenu={false}
                                  navToText={navToText}
                                  allowNavToText={allowNavToText}
                                  readMode={bookProfile.readMode}
                                  cbToggleNavigateToText={cbToggleNavigateToText}
                                  cbTogglePlay={cbTogglePlay}
                                  cbNavigateNext={cbNavigateNext}
                                  cbNavigatePrevious={cbNavigatePrevious}
                                  cbNavigateBeginChapter={cbNavigateBeginChapter}
                                  cbNavigateNextChapter={cbNavigateNextChapter} />
    } else if (bookProfile.readMode === READ_MODE.SCROLL) {
      navButtonsJsx = <NavScrollButtons book={book}
                                        chapterIndex={chapterIndex}
                                        cbNavigateBeginChapter={cbNavigateBeginChapter}
                                        cbNavigateNextChapter={cbNavigateNextChapter} />
    }
    return (
      <div className="row fixed-bottom elt-top" id="sadok-bottom">
        <div className="text-center" onClick={cbTogglePlay}>
          {book.metadata?.tokens?<div className="opacity-75 alert alert-dark d-inline-block">
            {displayJsx}
          </div>:<></>}
          <div>
            {navButtonsJsx}
          </div>
        </div>
      </div>
    );
  }
}
