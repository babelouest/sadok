import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import TimeRemaining from './TimeRemaining';

export default function ChapterItem({config, totalTokens, chapter, chapterOffset, offset, cbSetOffset}) {
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
  if (offset >= chapterOffset && offset < (chapterOffset + chapter.tokens)) {
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
         data-bs-toggle="offcanvas"
         data-bs-target="#LeftMenu">
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
