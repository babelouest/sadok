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

export const DARK_MODE = {
  SYSTEM: "system",
  ENABLED: "enabled",
  DISABLED: "disabled"
};

export const READ_MODE = {
  SPEED_READER: "speed-reader",
  SPEECH: "speech",
  SENTENCE: "sentence-reader"
};

export const TEXT_SIZE_VALS = {
  XL: "XL",
  L: "L",
  M: "M",
  S: "S",
  XS: "XS",
  XXS: "XXS"
};

export const textSize = {
  "XL": "fs-1",
  "L": "fs-2",
  "M": "fs-3",
  "S": "fs-4",
  "XS": "fs-5",
  "XXS": "fs-6"
};

export const TextSizesAvailable = [TEXT_SIZE_VALS.XL, TEXT_SIZE_VALS.L, TEXT_SIZE_VALS.M, TEXT_SIZE_VALS.S, TEXT_SIZE_VALS.XS, TEXT_SIZE_VALS.XXS];
export const SpeedReaderWordsPerMinuteAvailable = ["50","100","150","200","250","300","350","400","450","500","550","600","650","700","750","800"];
export const OpacityAvailable = [0,25,50,75];
export const separators = ['.', '?', '!', '…'];
export const LS_SPEECH_LANG = "sadok-speech-lang";


export const BOOK_PROFILE_USE_BOOK_CSS = {
  DEFAULT: "default",
  TRUE: "true",
  FALSE: "false"
};

export const CONFIG_DEFAULT = {
  darkMode: DARK_MODE.SYSTEM,
  textBackgroundOpacity: 25,
  useBookCss: true,
  coverBackground: true,
  fullScreen: false,
  readMode: READ_MODE.SPEED_READER,
  speedReaderTextSize: TEXT_SIZE_VALS.XL,
  speedReaderTextSpeed: "300",
  speedReaderSlowLongWords: true,
  speedReaderSlowEndingPunctuation: true,
  speechLang: false,
  speechPitch: 1,
  speechRate: 1,
  speechTextSize: TEXT_SIZE_VALS.M,
  sentenceReaderTextSize: TEXT_SIZE_VALS.M,
  currentBook: false
};

export const BOOK_PROFILE_DEFAULT = {
  uri: "",
  readMode: READ_MODE.SPEED_READER,
  offset: 0,
  tokens: 0,
  sessionOffset: [],
  useBookCss: BOOK_PROFILE_USE_BOOK_CSS.DEFAULT
};
