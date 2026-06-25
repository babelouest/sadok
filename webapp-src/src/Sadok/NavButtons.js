import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

export default function NavButtons({
  book,
  offset,
  chapterIndex,
  fromMenu,
  cbTogglePlay,
  cbNavigateNext,
  cbNavigatePrevious,
  cbNavigateBeginChapter,
  cbNavigateNextChapter
}) {
  return (
    <div className="btn-group">
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigateBeginChapter()} title={i18next.t("nav-begin-chapter")} disabled={!book.metadata?.tokens}>
        <img src="img/first_page_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-begin-chapter")} />
      </button>
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigatePrevious(true)} title={i18next.t("nav-previous-10")} disabled={!offset} >
        <img src="img/keyboard_double_arrow_left_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-previous-10")} />
      </button>
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigatePrevious(false)} title={i18next.t("nav-previous")} disabled={offset < 10} >
        <img src="img/chevron_backward_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-previous")} />
      </button>
      {fromMenu?
      <button className="btn btn-secondary" type="button" onClick={cbTogglePlay} title={i18next.t("nav-start-read")} data-bs-dismiss="offcanvas" >
        <img src="img/play_arrow_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-start-read")} />
      </button>:
      <button className="btn btn-secondary" type="button" onClick={cbTogglePlay} title={i18next.t("nav-start-read")} disabled={!book.metadata?.tokens || offset >= book.metadata?.tokens} >
        <img src="img/play_arrow_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-start-read")} />
      </button>}
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigateNext(false)} title={i18next.t("nav-next")} disabled={offset >= book.metadata?.tokens} >
        <img src="img/chevron_forward_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-next")} />
      </button>
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigateNext(true)} title={i18next.t("nav-next-10")} disabled={offset >= book.metadata?.tokens - 10} >
        <img src="img/keyboard_double_arrow_right_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-next-10")} />
      </button>
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigateNextChapter()} title={i18next.t("nav-next-chapter")} disabled={chapterIndex >= book.bookContent.length} >
        <img src="img/last_page_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-next-chapter")} />
      </button>
    </div>
  );
}
