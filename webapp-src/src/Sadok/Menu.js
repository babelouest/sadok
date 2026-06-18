import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import Parameters from './Parameters';
import Chapters from './Chapters';

export default function Menus({
  book,
  offset,
  chapterIndex,
  config,
  playReader,
  cbNavigateNext,
  cbNavigatePrevious,
  cbNavigateBeginChapter,
  cbNavigateNextChapter,
  cbSetOffset,
  cbTogglePlay,
  cbUpdateConfig,
  cbRefreshConfig,
  cbOpenBrowse
}) {

  if (!playReader) {
    return (
      <>
        <div className="position-fixed top-0 start-0 m-3">
          <div className="btn-group-vertical" role="group">
            <button className="btn btn-secondary" type="button" onClick={cbOpenBrowse} title={i18next.t("browse")}>
              <img src="img/auto_stories_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
            </button>
            <button className="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#LeftMenu" aria-controls="LeftMenu" title={i18next.t("chapters")}>
              <img src="img/format_list_numbered_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
            </button>
          </div>
        </div>
        <div className="position-fixed top-0 end-0 m-3">
          <button className="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#rightMenu" aria-controls="rightMenu" title={i18next.t("parameters")}>
            <img src="img/settings_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
          </button>
        </div>
        <Chapters book={book}
                  offset={offset}
                  config={config}
                  chapterIndex={chapterIndex}
                  playReader={playReader}
                  playReader={playReader}
                  cbNavigateNext={cbNavigateNext}
                  cbNavigatePrevious={cbNavigatePrevious}
                  cbNavigateBeginChapter={cbNavigateBeginChapter}
                  cbNavigateNextChapter={cbNavigateNextChapter}
                  cbTogglePlay={cbTogglePlay}
                  cbSetOffset={cbSetOffset} />
        <Parameters book={book}
                    offset={offset}
                    config={config}
                    playReader={playReader}
                    cbNavigateNext={cbNavigateNext}
                    cbNavigatePrevious={cbNavigatePrevious}
                    cbSetOffset={cbSetOffset}
                    cbTogglePlay={cbTogglePlay}
                    cbUpdateConfig={cbUpdateConfig}
                    cbRefreshConfig={cbRefreshConfig} />
      </>
    );
  }
}
