/**
 * 
 * Sadok e-book reader
 * 
 * Copyright 2026 Nicolas Mora <mail@babelouest.org>
 * 
 * License AGPL
 * 
 */
import apiManager from './APIManager';
import { TextSizesAvailable, OpacityAvailable, SpeedReaderWordsPerMinuteAvailable, TEXT_SIZE_VALS, DARK_MODE, READ_MODE, BOOK_PROFILE_DEFAULT } from '../lib/Constants';

const API_URL = "api/profile/";
const API_GLOBAL_CONFIG_URL = "/config/";
const API_BOOK_PROFILE_URL = "/book/";

const LS_PREFIX = "sadok-";
const LS_GLOBAL_CONFIG = LS_PREFIX + "global-config";
const LS_PROFILE_NAME = LS_PREFIX + "profile";
const LS_BOOK_PROFILE_PREFIX = LS_PREFIX + "book-";

function stringToUUIDv5(name) {
  // URL Namespace UUID as the base (ce188333-1c16-4d96-83b8-482e271b5225)
  const namespaceBytes = new Uint8Array([
    0xce, 0x18, 0x83, 0x33, 0x1c, 0x16, 0x4d, 0x96,
    0x83, 0xb8, 0x48, 0x2e, 0x27, 0x1b, 0x52, 0x25
  ]);
  
  const nameBytes = new TextEncoder().encode(name);
  const buffer = new Uint8Array(namespaceBytes.length + nameBytes.length);
  buffer.set(namespaceBytes);
  buffer.set(nameBytes, namespaceBytes.length);
  
  // Hash the combined array using SHA-1
  return crypto.subtle.digest('SHA-1', buffer)
  .then(hashBuffer => {
    const hashBytes = new Uint8Array(hashBuffer);
    
    // Set variant and version numbers for UUID v5
    hashBytes[6] = (hashBytes[6] & 0x0f) | 0x50; // Version 5
    hashBytes[8] = (hashBytes[8] & 0x3f) | 0x80; // Variant RFC4122
    
    // Convert byte array into standard 8-4-4-4-12 hex string
    const hex = Array.from(hashBytes.slice(0, 16))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
      
    return hex.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
  });
}

class Profile {
  constructor() {
    this.useProfileApi = false;
    this.profileApiName = false;
  }
  
  setProfileApiName(name) {
    this.profileApiName = name;
    if (window.localStorage) {
      window.localStorage.setItem(LS_PROFILE_NAME, name);
    }
  }
  
  initProfile() {
    return apiManager.APIRequestExecute(API_URL)
    .then(() => {
      this.useProfileApi = true;
      if (window.localStorage) {
        this.profileApiName = window.localStorage.getItem(LS_PROFILE_NAME)||false;
      }
    })
    .catch(() => {
      // no profile
    });
  }

  checkConfigValues(config) {
    let cleanConfig = {...config};
    do {
      if (config.darkMode && !Object.values(DARK_MODE).includes(config.darkMode)) {
        console.error("invalid darkMode");
        break;
      }
      if (config.textBackgroundOpacity && !OpacityAvailable.includes(parseInt(config.textBackgroundOpacity))) {
        console.error("invalid textBackgroundOpacity");
        break;
      }
      cleanConfig.useBookCss = !!config.useBookCss;
      cleanConfig.coverBackground = !!config.coverBackground;
      cleanConfig.fullScreen = !!config.fullScreen;
      if (config.readMode && !Object.values(READ_MODE).includes(config.readMode)) {
        console.error("invalid readMode");
        break;
      }
      if (config.speedReaderTextSize && !TextSizesAvailable.includes(config.speedReaderTextSize)) {
        console.error("invalid speedReaderTextSize");
        break;
      }
      if (config.speedReaderTextSpeed && !SpeedReaderWordsPerMinuteAvailable.includes(config.speedReaderTextSpeed)) {
        console.error("invalid speedReaderTextSpeed");
        break;
      }
      cleanConfig.speedReaderSlowLongWords = !!config.speedReaderSlowLongWords;
      cleanConfig.speechLang = !!config.speechLang;
      if (config.speechPitch !== undefined && (isNaN(config.speechPitch) || config.speechPitch < 0 || config.speechPitch > 2)) {
        console.error("invalid speechPitch");
        break;
      }
      if (config.speechRate !== undefined && (isNaN(config.speechRate) || config.speechRate < 0 || config.speechRate > 10)) {
        console.error("invalid speechRate");
        break;
      }
      if (config.speechTextSize && !TextSizesAvailable.includes(config.speechTextSize)) {
        console.error("invalid speechTextSize");
        break;
      }
      if (config.sentenceReaderTextSize && !TextSizesAvailable.includes(config.sentenceReaderTextSize)) {
        console.error("invalid sentenceReaderTextSize");
        break;
      }
      return cleanConfig;
    } while (false);
    return false;
  }

  getGlobalConfig() {
    if (this.useProfileApi && this.profileApiName) {
      return this.getGlobalConfigApi();
    } else {
      return this.getGlobalConfigLocalStrorage();
    }
  }
  
  getGlobalConfigApi() {
    return apiManager.APIRequestExecute(API_URL + encodeURIComponent(this.profileApiName) + API_GLOBAL_CONFIG_URL)
    .then(config => {
      return this.checkConfigValues(config);
    })
    .catch((err) => {
      console.error(err);
    });
  }
  
  getGlobalConfigLocalStrorage() {
    if (window.localStorage) {
      try {
        let config = JSON.parse(window.localStorage.getItem(LS_GLOBAL_CONFIG));
        if (config && typeof config === 'object') {
          return Promise.resolve(this.checkConfigValues(config));
        }
      } catch (err) {
        console.error(err);
        return Promise.resolve({});
      }
      return Promise.resolve({});
    } else {
      return Promise.resolve({});
    }
  }
  
  setGlobalConfig(config) {
    if (this.useProfileApi && this.profileApiName) {
      return this.setGlobalConfigApi(config);
    } else {
      return this.setGlobalConfigLocalStrorage(config);
    }
  }
  
  setGlobalConfigApi(config) {
    return apiManager.APIRequestExecute(API_URL + encodeURIComponent(this.profileApiName) + API_GLOBAL_CONFIG_URL, "POST", config);
  }
  
  setGlobalConfigLocalStrorage(config) {
    if (window.localStorage) {
      window.localStorage.setItem(LS_GLOBAL_CONFIG, JSON.stringify(config));
    }
    return Promise.resolve({});
  }

  checkBookProfile(bookProfile) {
    let cleanBookProfile = {...bookProfile};
    do {
      if (bookProfile.readMode && !Object.values(READ_MODE).includes(bookProfile.readMode)) {
        console.error("invalid readMode");
        break;
      }
      if (bookProfile.offset !== undefined && (isNaN(bookProfile.offset) || bookProfile.offset < 0)) {
        console.error("invalid offset");
        break;
      }
      if (bookProfile.tokens !== undefined && (isNaN(bookProfile.tokens) || bookProfile.tokens < 0)) {
        console.error("invalid tokens");
        break;
      }
      if (bookProfile.sessionOffset !== undefined && !Array.isArray(bookProfile.sessionOffset)) {
        console.error("invalid sessionOffset");
        break;
      }
      let isOK = true;
      bookProfile.sessionOffset?.forEach(o => {
        if (isNaN(o) || o < 0) {
          isOK = false;
        }
      });
      if (!isOK) {
        console.error("invalid sessionOffset content");
        break;
      }
      cleanBookProfile.useBookCss = !!bookProfile.useBookCss;
      return cleanBookProfile;
    } while (false);
    return BOOK_PROFILE_DEFAULT;
  }

  getAllBookProfile() {
    if (this.useProfileApi && this.profileApiName) {
      return this.getAllBookProfileApi();
    } else {
      return this.getAllBookProfileLocalStrorage();
    }
  }
  
  getAllBookProfileApi() {
    return apiManager.APIRequestExecute(API_URL + encodeURIComponent(this.profileApiName) + API_BOOK_PROFILE_URL)
    .then(bookProfiles => {
      return bookProfiles;
    })
    .catch((err) => {
      console.error(err);
    });
  }
  
  getAllBookProfileLocalStrorage() {
    if (window.localStorage) {
      let bookProfiles = {};
      const items = { ...window.localStorage };
      Object.keys(items).forEach(key => {
        if (key.startsWith(LS_BOOK_PROFILE_PREFIX)) {
          try {
            let bookProfile = JSON.parse(items[key]);
            if (bookProfile !== null && typeof bookProfile === 'object') {
              bookProfiles[key.substring(LS_BOOK_PROFILE_PREFIX.length)] = this.checkBookProfile(bookProfile);
            }
          } catch (err) {
            console.error(key, err);
          }
        }
      });
      return Promise.resolve(bookProfiles);
    } else {
      return Promise.resolve({});
    }
  }

  getBookProfile(bookUri) {
    if (this.useProfileApi && this.profileApiName) {
      return this.getBookProfileApi(bookUri);
    } else {
      return this.getBookProfileLocalStrorage(bookUri);
    }
  }

  getBookProfileApi(bookUri) {
    return stringToUUIDv5(bookUri)
    .then(guid => {
      return apiManager.APIRequestExecute(API_URL + encodeURIComponent(this.profileApiName) + API_BOOK_PROFILE_URL + guid)
      .then(bookProfile => {
        return this.checkBookProfile(bookProfile);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }
  
  getBookProfileLocalStrorage(bookUri) {
    if (window.localStorage) {
      try {
        return stringToUUIDv5(bookUri)
        .then(guid => {
          let bookProfile = JSON.parse(window.localStorage.getItem(LS_BOOK_PROFILE_PREFIX+guid));
          if (bookProfile !== null && typeof bookProfile === 'object') {
            return this.checkBookProfile(bookProfile);
          }
        });
      } catch (err) {
        console.error(err);
        return Promise.resolve(BOOK_PROFILE_DEFAULT);
      }
      return Promise.resolve(BOOK_PROFILE_DEFAULT);
    } else {
      return Promise.resolve(BOOK_PROFILE_DEFAULT);
    }
  }

  setBookProfile(bookUri, bookProfile) {
    if (this.useProfileApi && this.profileApiName) {
      return this.setBookProfileApi(bookUri, bookProfile);
    } else {
      return this.setBookProfileLocalStrorage(bookUri, bookProfile);
    }
  }

  setBookProfileApi(bookUri, bookProfile) {
    return stringToUUIDv5(bookUri)
    .then(guid => {
      return apiManager.APIRequestExecute(API_URL + encodeURIComponent(this.profileApiName) + API_BOOK_PROFILE_URL + guid, "POST", bookProfile);
    });
  }

  setBookProfileLocalStrorage(bookUri, bookProfile) {
    return stringToUUIDv5(bookUri)
    .then(guid => {
      if (window.localStorage) {
        window.localStorage.setItem(LS_BOOK_PROFILE_PREFIX + guid, JSON.stringify(bookProfile));
      }
      return ({});
    });
  }
}

let profile = new Profile();

export default profile;
