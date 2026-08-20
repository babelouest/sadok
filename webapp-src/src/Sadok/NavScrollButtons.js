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

export default function NavScrollButtons({
  book,
  chapterIndex,
  cbNavigateBeginChapter,
  cbNavigateNextChapter
}) {
  return (
    <div className="btn-group">
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigateBeginChapter()} title={i18next.t("nav-begin-chapter")} disabled={!book.metadata?.tokens}>
        <img src="img/first_page_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-begin-chapter")} />
      </button>
      <button className="btn btn-secondary" type="button" onClick={() => cbNavigateNextChapter()} title={i18next.t("nav-next-chapter")} disabled={chapterIndex >= book.bookContent.length} >
        <img src="img/last_page_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt={i18next.t("nav-next-chapter")} />
      </button>
    </div>
  );
}
