import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import TimeRemaining from './TimeRemaining';
import ChapterItem from './ChapterItem';
import NavButtons from './NavButtons';

export default function Chapters({
  book,
  offset,
  chapterIndex,
  config,
  playReader,
  cbNavigateNext,
  cbNavigatePrevious,
  cbNavigateBeginChapter,
  cbNavigateNextChapter,
  cbTogglePlay,
  cbSetOffset,
  cbRemoveProfile
}) {
  useEffect(() => {
    let elm = document.getElementById("sadok-current-chapter");
    if (elm) {
      elm.scrollIntoView();
    }
  },[book,offset]);

  let chaptersJsx = [];
  let chapterOffset = 0;
  book.bookContent.map((chapter, index) => {
    if (chapter.label) {
      chaptersJsx.push(
        <ChapterItem key={index}
                     config={config}
                     totalTokens={book.metadata.tokens}
                     chapter={chapter}
                     chapterOffset={chapterOffset}
                     offset={offset}
                     cbSetOffset={cbSetOffset}
        />
      );
    }
    chapterOffset += chapter.tokens;
  });
  let yearJsx;
  if (book.metadata.year) {
    yearJsx = 
      <div className="mb-3 text-center">
        {(new Date(book.metadata.year)).getFullYear()}
      </div>
  }
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
        <div className="mb-3">
          <div className="mb-3 text-center fs-2">
            {book?.metadata.title||""}
          </div>
          <div className="mb-3 text-center fw-bold">
            {book?.metadata.author?.name||""}
          </div>
          {yearJsx}
          <div className="mb-3 text-center fs-6 fst-italic">
            {i18next.t("word-length", {val: book?.metadata.tokens||0})} - <TimeRemaining offset={0} textSpeed={(+config.speedReaderTextSpeed)} tokens={book?.metadata.tokens||1} compact={true} />
          </div>
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
        <div className="chapter-list elt-bottom">
          <div className="mb-3">
            <div className="list-group">
              <div className="chapter-list">
                {chaptersJsx}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
