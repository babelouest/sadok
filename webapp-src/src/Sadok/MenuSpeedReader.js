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

import { SpeedReaderWordsPerMinuteAvailable } from '../lib/Constants';

export default function MenuSpeedReader({config, currentMode, cbUpdateConfig}) {

  const setTextSpeed = (e) => {
    cbUpdateConfig({speedReaderTextSpeed: e.target.value});
  };

  const setTextSize = (e) => {
    cbUpdateConfig({speedReaderTextSize: e.target.value});
  };

  const toggleSlowLongWords = () => {
    cbUpdateConfig({speedReaderSlowLongWords: !config.speedReaderSlowLongWords});
  };

  const toggleSlowEndingPunctuation = () => {
    cbUpdateConfig({speedReaderSlowEndingPunctuation: !config.speedReaderSlowEndingPunctuation});
  };

  const toggleOptimalRecognitionPoint = () => {
    cbUpdateConfig({speedReaderOptimalRecognitionPoint: !config.speedReaderOptimalRecognitionPoint});
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className={"accordion-button"+(currentMode?"":" collapsed")} type="button" data-bs-toggle="collapse" data-bs-target="#collapseSpeedReader" aria-expanded="true" aria-controls="collapseSpeedReader">
          {i18next.t("speed-reader-title")}
        </button>
      </h2>
      <div id="collapseSpeedReader" className={"accordion-collapse collapse"+(currentMode?" show":"")} data-bs-parent="#accordionMenu">
        <div className="accordion-body">
          <div className="input-group mb-3">
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="text-speed">
                {i18next.t("text-speed")}
              </label>
              <select className="form-select" id="text-speed" value={config.speedReaderTextSpeed} onChange={setTextSpeed}>
                {SpeedReaderWordsPerMinuteAvailable.map(speed => {
                  return (
                    <option value={speed} key={speed}>{i18next.t("text-speed-option", {speed: speed})}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="input-group mb-3">
            <div className="input-group mb-3">
              <label className="input-group-text" htmlFor="text-size">
                {i18next.t("speed-reader-text-size")}
              </label>
              <select className="form-select" id="speed-reader-text-size" value={config.speedReaderTextSize} onChange={setTextSize}>
                <option value="XL">{i18next.t("text-size-XL")}</option>
                <option value="L">{i18next.t("text-size-L")}</option>
                <option value="M">{i18next.t("text-size-M")}</option>
                <option value="S">{i18next.t("text-size-S")}</option>
                <option value="XS">{i18next.t("text-size-XS")}</option>
                <option value="XXS">{i18next.t("text-size-XXS")}</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="slowLongWords" checked={config.speedReaderSlowLongWords} onChange={toggleSlowLongWords}/>
                <label className="form-check-label" htmlFor="slowLongWords">{i18next.t("slow-long-words")}</label>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="slowEndingPunctuation" checked={config.speedReaderSlowEndingPunctuation} onChange={toggleSlowEndingPunctuation}/>
                <label className="form-check-label" htmlFor="slowEndingPunctuation">{i18next.t("slow-ending-punctuation")}</label>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="optimalRecognitionPoint" checked={config.speedReaderOptimalRecognitionPoint} onChange={toggleOptimalRecognitionPoint}/>
                <label className="form-check-label" htmlFor="optimalRecognitionPoint">{i18next.t("optimal-recognition-point")}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
