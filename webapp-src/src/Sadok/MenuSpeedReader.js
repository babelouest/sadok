import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import { SpeedReaderWordsPerMinuteAvailable } from '../lib/Constants';

export default function MenuSpeedReader({config, cbUpdateConfig}) {

  const setTextSpeed = (e) => {
    cbUpdateConfig({speedReaderTextSpeed: e.target.value});
  };

  const setTextSize = (e) => {
    cbUpdateConfig({speedReaderTextSize: e.target.value});
  };

  const toggleSlowLongWords = () => {
    cbUpdateConfig({speedReaderSlowLongWords: !config.speedReaderSlowLongWords});
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSpeedReader" aria-expanded="true" aria-controls="collapseSpeedReader">
          {i18next.t("speed-reader-title")}
        </button>
      </h2>
      <div id="collapseSpeedReader" className="accordion-collapse collapse" data-bs-parent="#accordionMenu">
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
        </div>
      </div>
    </div>
  );
}
