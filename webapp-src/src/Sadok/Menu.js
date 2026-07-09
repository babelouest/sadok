import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import { READ_MODE } from '../lib/Constants';

import Parameters from './Parameters';
import Chapters from './Chapters';

export default function Menus({
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
  cbSetOffset,
  cbTogglePlay,
  cbUpdateConfig,
  cbUpdateBookProfile,
  cbInitConfig,
  cbOpenBrowse,
  cbRemoveProfile,
  cbSessionClear
}) {

  if (!playReader) {
    let modeIconJsx;
    if (bookProfile.readMode === READ_MODE.SPEED_READER) {
      modeIconJsx =
        <button className="btn btn-secondary" type="button" title={i18next.t("read-mode")} disabled={true}>
          <img className="elt-right" src="img/speed_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </button>
    } else if (bookProfile.readMode === READ_MODE.SPEECH) {
      modeIconJsx =
        <button className="btn btn-secondary" type="button" title={i18next.t("read-mode")} disabled={true}>
          <img className="elt-right" src="img/select_to_speak_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </button>
    } else if (bookProfile.readMode === READ_MODE.SENTENCE) {
      modeIconJsx =
        <button className="btn btn-secondary" type="button" title={i18next.t("read-mode")} disabled={true}>
          <img className="elt-right" src="img/format_paragraph_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </button>
    }
    return (
      <>
        <div className="position-fixed top-0 start-0 m-3">
          <div className="btn-group-vertical" role="group">
            <button className="btn btn-secondary" type="button" onClick={cbOpenBrowse} title={i18next.t("browse")}>
              <img src="img/auto_stories_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
            </button>
            <button className="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#LeftMenu" aria-controls="LeftMenu" title={i18next.t("chapters")} disabled={!book.metadata.tokens}>
              <img src="img/format_list_numbered_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
            </button>
          </div>
        </div>
        <div className="position-fixed top-0 end-0 m-3">
          <div className="btn-group-vertical" role="group">
            <button className="btn btn-secondary" type="button" data-bs-toggle="offcanvas" data-bs-target="#rightMenu" aria-controls="rightMenu" title={i18next.t("parameters")}>
              <img src="img/settings_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"/>
            </button>
            {modeIconJsx}
          </div>
        </div>
        <Chapters book={book}
                  offset={offset}
                  bookProfile={bookProfile}
                  config={config}
                  chapterIndex={chapterIndex}
                  playReader={playReader}
                  playReader={playReader}
                  cbNavigateNext={cbNavigateNext}
                  cbNavigatePrevious={cbNavigatePrevious}
                  cbNavigateBeginChapter={cbNavigateBeginChapter}
                  cbNavigateNextChapter={cbNavigateNextChapter}
                  cbTogglePlay={cbTogglePlay}
                  cbSetOffset={cbSetOffset}
                  cbRemoveProfile={cbRemoveProfile}
                  cbSessionClear={cbSessionClear} />
        <Parameters book={book}
                    offset={offset}
                    bookProfile={bookProfile}
                    config={config}
                    playReader={playReader}
                    cbNavigateNext={cbNavigateNext}
                    cbNavigatePrevious={cbNavigatePrevious}
                    cbSetOffset={cbSetOffset}
                    cbTogglePlay={cbTogglePlay}
                    cbUpdateConfig={cbUpdateConfig}
                    cbUpdateBookProfile={cbUpdateBookProfile}
                    cbInitConfig={cbInitConfig} />
      </>
    );
  }
}
