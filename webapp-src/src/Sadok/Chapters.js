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
import BookInfo from './BookInfo';
import ChapterList from './ChapterList';
import NavButtons from './NavButtons';
import SessionBookmarks from './SessionBookmarks';

export default function Chapters({
  book,
  offset,
  bookProfile,
  chapterIndex,
  config,
  playReader,
  cbNavigateNext,
  cbNavigatePrevious,
  cbNavigateBeginChapter,
  cbNavigateNextChapter,
  cbTogglePlay,
  cbSetOffset,
  cbRemoveProfile,
  cbSessionClear
}) {
  return (
    <div className="offcanvas offcanvas-start" tabIndex="-1" id="LeftMenu" aria-labelledby="menuLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="menuLabel">
          {i18next.t("chapters")}
        </h5>
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <div className="input-group mb-3">
          <input type="number"
          min="0"
          max={book?.metadata?.tokens}
          step="1"
          className="form-control"
          placeholder="0"
          aria-describedby="basic-addon2"
          value={offset}
          onChange={(e) => cbSetOffset(parseInt(e.target.value))} />
          <span className="input-group-text" id="basic-addon2">/ {book?.metadata?.tokens}</span>
          <button className="btn btn-secondary" type="button" onClick={() => cbSetOffset(book.metadata.tokens)} title={i18next.t("book-complete-read")} disabled={chapterIndex >= book.bookContent.length} >
            <img src="img/download_done_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-next-chapter")} />
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => cbRemoveProfile()} title={i18next.t("book-remove-profile")} disabled={chapterIndex >= book.bookContent.length} >
            <img src="img/delete_forever_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-next-chapter")} />
          </button>
        </div>
        <NavButtons book={book}
                    offset={offset}
                    chapterIndex={chapterIndex}
                    fromMenu={true}
                    cbTogglePlay={cbTogglePlay}
                    cbNavigateNext={cbNavigateNext}
                    cbNavigatePrevious={cbNavigatePrevious}
                    cbNavigateBeginChapter={cbNavigateBeginChapter}
                    cbNavigateNextChapter={cbNavigateNextChapter} />
        <div className="mb-3">
          <SessionBookmarks sessionOffset={[...(bookProfile.sessionOffset||[])]} tokens={book?.metadata?.tokens||1} cbSetOffset={cbSetOffset} cbSessionClear={cbSessionClear} />
        </div>
        <div className="mb-3">
          <BookInfo book={book} config={config} />
        </div>
        <div className="chapter-list elt-bottom">
          <div className="mb-3">
            <ChapterList book={book} config={config} offset={offset} cbSetOffset={cbSetOffset} />
          </div>
        </div>
      </div>
    </div>
  );
}
