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

export default function MenuSentenceReader({config, currentMode, cbUpdateConfig}) {

  const setTextSize = (e) => {
    cbUpdateConfig({sentenceReaderTextSize: e.target.value});
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className={"accordion-button"+(currentMode?"":" collapsed")} type="button" data-bs-toggle="collapse" data-bs-target="#collapseSentenceReader" aria-expanded="true" aria-controls="collapseSentenceReader">
          {i18next.t("sentence-reader-title")}
        </button>
      </h2>
      <div id="collapseSentenceReader" className={"accordion-collapse collapse"+(currentMode?" show":"")} data-bs-parent="#accordionMenu">
        <div className="accordion-body">
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="text-size">
              {i18next.t("sentence-reader-text-size")}
            </label>
            <select className="form-select" id="text-size" value={config.sentenceReaderTextSize} onChange={setTextSize}>
              <option value="XL">{i18next.t("text-size-XL")}</option>
              <option value="L">{i18next.t("text-size-L")}</option>
              <option value="M">{i18next.t("text-size-M")}</option>
              <option value="S">{i18next.t("text-size-S")}</option>
              <option value="XS">{i18next.t("text-size-XS")}</option>
              <option value="XXS">{i18next.t("text-size-XXS")}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
