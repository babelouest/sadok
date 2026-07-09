import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import { DARK_MODE, READ_MODE, OpacityAvailable } from '../lib/Constants';
import build from '../lib/Build';
import profile from '../lib/Profile';

import MenuSpeedReader from './MenuSpeedReader';
import MenuSpeechSynth from './MenuSpeechSynth';
import MenuSentenceReader from './MenuSentenceReader';
import ParametersProfile from './ParametersProfile';

export default function Parameters({
  book,
  offset,
  config,
  bookProfile,
  cbUpdateConfig,
  cbUpdateBookProfile,
  cbInitConfig
}) {

  const setDarkMode = (e, mode) => {
    cbUpdateConfig({darkMode: mode});
    const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if ((mode === "system" && darkModeMql && darkModeMql.matches) || mode === "enabled") {
      document.documentElement.setAttribute('data-bs-theme','dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme','light');
    }
  };

  const toggleCoverBackground = () => {
    cbUpdateConfig({coverBackground: !config.coverBackground});
  };

  const toggleUseBookCss = () => {
    cbUpdateConfig({useBookCss: !config.useBookCss});
  };

  const setTextBackgroundOpacity = (e) => {
    cbUpdateConfig({textBackgroundOpacity: e.target.value});
  };

  const saveProfile = (profileName) => {
    profile.setProfileApiName(profileName);
    cbInitConfig();
  };

  const setLang = (e) => {
    i18next.changeLanguage(e.target.value)
    .then(() => {
      cbUpdateConfig({lang: e.target.value});
    });
  };

  const toggleFullScreen = () => {
    cbUpdateConfig({fullScreen: !config.fullScreen});
  };

  const setReadMode = (e) => {
    cbUpdateBookProfile({readMode: e.target.value});
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="rightMenu" aria-labelledby="menuLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="menuLabel">
          {i18next.t("title", {build: build.id})}
        </h5>
        <img className="elt-right" src={profile.useProfileApi?"img/cloud_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg":"img/cloud_off_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg"} />
        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
        <ParametersProfile config={config} cbSaveProfile={saveProfile} />
        <h4>
          {i18next.t("display-title")}
        </h4>
        <div className="input-group mb-3">
          <label className="input-group-text" htmlFor="read-mode">
            {i18next.t("read-mode")}
          </label>
          <select className="form-select" id="read-mode" value={bookProfile.readMode||config.readMode} onChange={setReadMode}>
            <option value={READ_MODE.SPEED_READER}>{i18next.t("read-mode-speed-reader")}</option>
            <option value={READ_MODE.SPEECH}>{i18next.t("read-mode-speech")}</option>
            <option value={READ_MODE.SENTENCE}>{i18next.t("read-mode-sentence-reader")}</option>
          </select>
        </div>
        <div className="input-group mb-3">
          <label className="input-group-text" htmlFor="text-background-opacity">
            {i18next.t("lang")}
          </label>
          <select className="form-select" id="text-background-opacity" value={i18next.language} onChange={setLang}>
            <option value="en">{i18next.t("lang-en")}</option>
            <option value="fr">{i18next.t("lang-fr")}</option>
          </select>
        </div>
        <div className="mb-3">
          <span>{i18next.t("dark-mode")}</span>
          <div className="form-check form-check-inline elt-right">
            <input className="form-check-input"
                   type="radio" name="darkMode"
                   id="dark-mode-system"
                   value={DARK_MODE.SYSTEM}
                   checked={config.darkMode===DARK_MODE.SYSTEM||!config.darkMode}
                   onChange={(e) => setDarkMode(e, "system")}/>
            <label className="form-check-label" htmlFor="dark-mode-system">{i18next.t("dark-mode-system")}</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input"
                   type="radio"
                   name="darkMode"
                   id="dark-mode-enabled"
                   value={DARK_MODE.ENABLED}
                   checked={config.darkMode===DARK_MODE.ENABLED}
                   onChange={(e) => setDarkMode(e, "enabled")}/>
            <label className="form-check-label" htmlFor="dark-mode-enabled">{i18next.t("dark-mode-enabled")}</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input"
                   type="radio"
                   name="darkMode"
                   id="dark-mode-disabled"
                   value={DARK_MODE.DISABLED}
                   checked={config.darkMode===DARK_MODE.DISABLED}
                   onChange={(e) => setDarkMode(e, "disabled")}/>
            <label className="form-check-label" htmlFor="dark-mode-disabled">{i18next.t("dark-mode-disabled")}</label>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="cover-background" checked={config.coverBackground} onChange={toggleCoverBackground}/>
            <label className="form-check-label" htmlFor="cover-background">{i18next.t("cover-background")}</label>
          </div>
        </div>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="use-book-css" checked={config.useBookCss} onChange={toggleUseBookCss}/>
            <label className="form-check-label" htmlFor="use-book-css">{i18next.t("use-book-css")}</label>
          </div>
        </div>
        <div className="input-group mb-3">
          <label className="input-group-text" htmlFor="text-background-opacity">
            {i18next.t("text-background-opacity")}
          </label>
          <select className="form-select" id="text-background-opacity" value={config.textBackgroundOpacity} onChange={setTextBackgroundOpacity}>
            {OpacityAvailable.map(op => {
              return (
                <option value={op} key={op}>{i18next.t("text-background-opacity-"+op)}</option>
              );
            })}
          </select>
        </div>
        <div className="mb-3">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" id="fullScreen" checked={config.fullScreen} onChange={toggleFullScreen}/>
            <label className="form-check-label" htmlFor="fullScreen">{i18next.t("fullscreen")}</label>
          </div>
        </div>
        <hr/>
        <div className="accordion" id="accordionMenu">
          <MenuSpeedReader config={config} currentMode={config.readMode===READ_MODE.SPEED_READER} cbUpdateConfig={cbUpdateConfig} />
          <MenuSpeechSynth config={config} currentMode={config.readMode===READ_MODE.SPEECH} cbUpdateConfig={cbUpdateConfig} />
          <MenuSentenceReader config={config} currentMode={config.readMode===READ_MODE.SENTENCE} cbUpdateConfig={cbUpdateConfig} />
        </div>
      </div>
    </div>
  );
}
