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

import speechSynth from '../lib/SpeechSynth';

import { LS_SPEECH_LANG } from '../lib/Constants';

export default function MenuSpeechSynth({config, currentMode, cbUpdateConfig}) {
  const toggleSpeechLang = (e) => {
    if (window.localStorage) {
      window.localStorage.setItem(LS_SPEECH_LANG, e.target.value);
    }
    cbUpdateConfig({
      speechLang: e.target.value
    });
  };

  const handleSpeechPitch = (e) => {
    cbUpdateConfig({
      speechPitch: e.target.value
    });
  };

  const handleSpeechRate = (e) => {
    cbUpdateConfig({
      speechRate: e.target.value
    });
  };

  const handleSpeechTextSize = (e) => {
    cbUpdateConfig({
      speechTextSize: e.target.value
    });
  };

  speechSynth.populateVoiceList();
  if (speechSynth.hasSpeechSynth) {
    let voiceListJsx = [];
    speechSynth.voiceList.forEach((voice, index) => {
      voiceListJsx.push(
        <option key={index} value={voice.name}>{i18next.t("speech-synth-lang", {name: voice.name, lang: voice.lang})}</option>
      );
    });
    return(
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button className={"accordion-button"+(currentMode?"":" collapsed")} type="button" data-bs-toggle="collapse" data-bs-target="#collapseSpeechSynth" aria-expanded="true" aria-controls="collapseSpeechSynth">
          {i18next.t("speech-synth-title")}
        </button>
      </h2>
      <div id="collapseSpeechSynth" className={"accordion-collapse collapse"+(currentMode?" show":"")} data-bs-parent="#accordionMenu">
        <div className="accordion-body">
          <div className="mb-3">
            <label htmlFor="speechLangLabel">
              {i18next.t("speech-synth-lang-label")}
            </label>
            <select className="form-select" id="speechLangLabel" value={window.localStorage?.getItem(LS_SPEECH_LANG)||config.speechLang} onChange={toggleSpeechLang}>
              {voiceListJsx}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="speechPitchRange" className="form-label">
              {i18next.t("speech-synth-pitch-title", {val: config.speechPitch})}
            </label>
            <input type="range" className="form-range" min="0" max="2" step="0.2" id="speechPitchRange" value={config.speechPitch} onChange={handleSpeechPitch} />
          </div>
          <div className="mb-3">
            <label htmlFor="speechRateRange" className="form-label">
              {i18next.t("speech-synth-rate-title", {val: config.speechRate})}
            </label>
            <input type="range" className="form-range" min="0.1" max="10" step="0.1" id="speechRateRange" value={config.speechRate} onChange={handleSpeechRate} />
          </div>
          <div className="mb-3">
            <label htmlFor="textSpeechTextSizeSelect">
              {i18next.t("speech-synth-text-size")}
            </label>
            <select className="form-select" id="text-size" value={config.speechTextSize} onChange={handleSpeechTextSize}>
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
  } else {
    return (
      <></>
    );
  }
}
