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
