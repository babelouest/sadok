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
  cbSetOffset
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
        <div className="chapter-list">
          <div className="mb-3">
            <div className="list-group">
              {chaptersJsx}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
