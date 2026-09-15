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

import { LS_TEXT_SIZE } from '../lib/Constants';

export default function MenuClassicReader({config, currentMode, cbUpdateConfig}) {

  const setTextSize = (e) => {
    if (window.localStorage) {
      window.localStorage.setItem(LS_TEXT_SIZE, e.target.value);
    }
    cbUpdateConfig({
      classicReaderTextSize: e.target.value
    });
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className={"accordion-button"+(currentMode?"":" collapsed")} type="button" data-bs-toggle="collapse" data-bs-target="#collapseClassicReader" aria-expanded="true" aria-controls="collapseClassicReader">
          {i18next.t("classic-reader-title")}
        </button>
      </h2>
      <div id="collapseClassicReader" className={"accordion-collapse collapse"+(currentMode?" show":"")} data-bs-parent="#accordionMenu">
        <div className="accordion-body">
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="text-size">
              {i18next.t("classic-reader-text-size")}
            </label>
            <select className="form-select" id="text-size" value={window.localStorage?.getItem(LS_TEXT_SIZE)||config.classicReaderTextSize} onChange={setTextSize}>
              <option value="200">{i18next.t("percent", {val: "200"})}</option>
              <option value="190">{i18next.t("percent", {val: "190"})}</option>
              <option value="180">{i18next.t("percent", {val: "180"})}</option>
              <option value="170">{i18next.t("percent", {val: "170"})}</option>
              <option value="160">{i18next.t("percent", {val: "160"})}</option>
              <option value="150">{i18next.t("percent", {val: "150"})}</option>
              <option value="140">{i18next.t("percent", {val: "140"})}</option>
              <option value="130">{i18next.t("percent", {val: "130"})}</option>
              <option value="120">{i18next.t("percent", {val: "120"})}</option>
              <option value="110">{i18next.t("percent", {val: "110"})}</option>
              <option value="100">{i18next.t("percent", {val: "100"})}</option>
              <option value="90">{i18next.t("percent", {val: "90"})}</option>
              <option value="80">{i18next.t("percent", {val: "80"})}</option>
              <option value="70">{i18next.t("percent", {val: "70"})}</option>
              <option value="60">{i18next.t("percent", {val: "60"})}</option>
              <option value="50">{i18next.t("percent", {val: "50"})}</option>
              <option value="40">{i18next.t("percent", {val: "40"})}</option>
              <option value="30">{i18next.t("percent", {val: "30"})}</option>
              <option value="20">{i18next.t("percent", {val: "20"})}</option>
              <option value="10">{i18next.t("percent", {val: "10"})}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
