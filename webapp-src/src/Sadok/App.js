/**
 * 
 * Sadok e-book reader
 * 
 * Copyright 2026 Nicolas Mora <mail@babelouest.org>
 * 
 * License AGPL
 * 
 */

import React, { useState, useEffect, useRef } from 'react';

import i18next from 'i18next';

import bookParser from '../lib/BookParser';
import profile from '../lib/Profile';
import { getTextSize, TEXT_SIZE_VALS, DARK_MODE, READ_MODE, CONFIG_DEFAULT, BOOK_PROFILE_DEFAULT } from '../lib/Constants';

import TextBackgroundContainer from './TextBackgroundContainer';
import Menu from './Menu';
import Chapters from './Chapters';
import TopTitle from './TopTitle';
import BottomInfo from './BottomInfo';
import Browse from './Browse';

const bgWordScrollIfNotVisible = () => {
  let txtElm = document.getElementById("sadok-bg-word");
  let bottomElm = document.getElementById("sadok-bottom");
  let topElm = document.getElementById("sadok-title");
  if (txtElm) {
    let txtRct = txtElm.getBoundingClientRect();
    let downLimit = Math.max(document.documentElement.clientHeight, window.innerHeight);
    let upLimit = 5;
    if (bottomElm) {
      downLimit = bottomElm.getBoundingClientRect().y;
    }
    if (topElm) {
      upLimit = topElm.getBoundingClientRect().y;
    }
    if (txtRct.y < upLimit) {
      txtElm.scrollIntoView({
        behavior: "instant",
      });
    } else if (txtRct.y > downLimit) {
      txtElm.scrollIntoView({
        behavior: "smooth",
      });
    }
  }
};

const getCurrentText = (bookContent, offset) => {
  const curChapterIndex = bookParser.getChapterIndexFromOffset(bookContent, offset);
  if (curChapterIndex) {
    const text = bookParser.deepSearchWord(bookContent[curChapterIndex.index].parsedNodes, curChapterIndex.offset);
    return {
      chapterIndex: curChapterIndex.index,
      chapterOffset: curChapterIndex.offset,
      text: text
    }
  } else {
    return false;
  }
};

const getTextDisplayed = (fullPlain, coordList, offset, debugMode) => {
  let textDisplayed = "";
  let coord = coordList[offset];
  if (coord) {
    textDisplayed = fullPlain.substring(coord.start, coord.end);
    if (debugMode) {
      for (let i=0; i<textDisplayed.length; i++) {
        console.log(textDisplayed.charAt(i), textDisplayed.charCodeAt(i).toString(16));
      }
    }
  }
  return textDisplayed;
};

const getPreviousTextBlock = (firstOffset, textLen, fullPlain, textCoordList, debugMode) => {
  let previousOffset = firstOffset>0?firstOffset-1:0;
  let separators = ['.', '?', '!', '…'];
  let str = "", strForSpeech = "";
  if (textLen && fullPlain && textCoordList) {
    while (previousOffset > 0 &&
           !(separators.some(x=>getTextDisplayed(fullPlain, textCoordList, (previousOffset-1), debugMode).includes(x))) &&
           previousOffset > (firstOffset - 100)) {
      previousOffset--;
    }
    if (textCoordList[firstOffset-1] && textCoordList[previousOffset]) {
      str = fullPlain.substring(textCoordList[previousOffset].start, textCoordList[firstOffset-1].end);
      strForSpeech = str.replaceAll("\n", " ");
    }
  }
  return {text: str, textForSpeech: strForSpeech, firstOffset: previousOffset, lastOffset: firstOffset};
};

const getNextTextBlock = (firstOffset, textLen, fullPlain, textCoordList, debugMode) => {
  let lastOffset = firstOffset;
  let separators = ['.', '?', '!', '…'];
  let str = "", strForSpeech = "";
  if (textLen && fullPlain && textCoordList) {
    while (lastOffset <= textLen &&
           !(separators.some(x=>getTextDisplayed(fullPlain, textCoordList, lastOffset, debugMode).includes(x))) &&
           lastOffset < (firstOffset + 100)) {
      lastOffset++;
    }
    if (firstOffset < lastOffset && textCoordList[firstOffset] && textCoordList[lastOffset]) {
      str = fullPlain.substring(textCoordList[firstOffset].start, textCoordList[lastOffset].end);
      strForSpeech = str.replaceAll("\n", " ");
    }
  }
  return {text: str, textForSpeech: strForSpeech, firstOffset: firstOffset, lastOffset: lastOffset};
};

export default function App({}) {
  const [ config, setConfig ] = useState({...CONFIG_DEFAULT, ...{ lang: i18next.language }});
  const [ bookProfile, setBookProfile ] = useState(BOOK_PROFILE_DEFAULT);
  const [ book, setBook ] = useState({metadata: {}, bookContent: []});
  const [ cssFonts, setCssFonts ] = useState([]);
  const [ chapter, setChapter ] = useState(false);
  const [ chapterIndex, setChapterIndex ] = useState(-1);
  const [ chapterOffset, setChapterOffset ] = useState(0);
  const [ playReader, setPlayReader ] = useState(false);
  const [ currentText, setCurrentText ] = useState("");
  const [ chapterLabel, setChapterLabel ] = useState(false);
  const [ debugMode, setDebugMode ] = useState(false);
  const [ openBrowse, setOpenBrowse ] = useState(false);
  const wakeLock = useRef(null);

  const keyUpEvent = (e) => {
    if (e.key === " " || e.code === "Space" || e.keyCode === 32) { // Start reading when space key is pressed
      togglePlay();
    } else if (e.keyCode === 37) { // left arrow
      if (!playReader) {
      }
    } else if (e.keyCode === 39) { // right arrow
      if (!playReader) {
      }
    } else if (e.keyCode === 34) { // page down
      if (!playReader) {
      }
    } else if (e.keyCode === 33) { // page up
      if (!playReader) {
      }
    }
  };

  const visibilitychangeEvent = () => {
    if (document.visibilityState === 'hidden') {
      setPlayReader(false);
    }
  };

  const fullscreenchange = () => {
    if (!document.fullscreenElement && playReader) {
      setPlayReader(false);
    }
  };

  useEffect(() => { // []
    profile.initProfile()
    .then(() => {
      profile.getGlobalConfig()
      .then(cfg => {
        let startConfig = {...config, ...cfg};
        setConfig(startConfig);
        if (startConfig.currentBook) {
          openBook({url: startConfig.currentBook, type: startConfig.currentBookType});
        }
      });
    });
  },[]);

  useEffect(() => { // [bookProfile]
    profile.setBookProfile(config.currentBook, bookProfile);
  },[bookProfile]);

  useEffect(() => { // [book,config,playReader]
    document.body.addEventListener("keyup", keyUpEvent);

    // Stop reading when screen is no longer visible
    document.addEventListener('visibilitychange', visibilitychangeEvent);

    // Listen to fullscreen change event
    document.addEventListener("fullscreenchange", fullscreenchange);
    
    return () => {
      document.body.removeEventListener("keyup", keyUpEvent);
      document.removeEventListener("visibilitychange", visibilitychangeEvent);
      document.removeEventListener("fullscreenchange", fullscreenchange);
    }
  },[book,config,playReader]);

  useEffect(() => { // [book,bookProfile,playReader]
    const currentText = getCurrentText(book.bookContent, bookProfile.offset);
    if (currentText) {
      if (currentText.chapterIndex !== chapterIndex) {
        setChapterIndex(currentText.chapterIndex);
        setChapter(book.bookContent[currentText.chapterIndex]);
        book.bookContent.forEach((chap, index) => {
          if (index <= currentText.chapterIndex && chap.label) {
            setChapterLabel(chap.label);
          }
        });
        setChapter(book.bookContent[currentText.chapterIndex]);
      }
      setChapterOffset(currentText.chapterOffset);
      if (currentText.text) {
        setCurrentText(currentText.text);
      }
    }
    if (playReader) {
      let timeoutFactor = 1;
      const intervalId = setTimeout(() => {
        if (book?.metadata?.tokens && bookProfile.offset < book?.metadata?.tokens) {
          setBookProfile({...bookProfile, ...{offset: bookProfile.offset+1}});
        } else {
          setPlayReader(false);
        }
      }, timeoutFactor*(60000/config.speedReaderTextSpeed));
      return () => clearTimeout(intervalId);
    }
  },[book,bookProfile,playReader]);

  useEffect(() => { // [currentText]
    bgWordScrollIfNotVisible();
  },[currentText]);

  useEffect(() => { // [config]
    const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if ((config.darkMode === "system" && darkModeMql && darkModeMql.matches) || config.darkMode === "enabled") {
      document.documentElement.setAttribute('data-bs-theme','dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme','light');
    }
  },[config]);

  const togglePlay = () => {
    if (config.fullScreen) {
      if (!playReader) {
        startFullScreen();
      } else {
        endFullScreen();
      }
    }
    if (playReader) {
      updateOffset(bookProfile.offset);
    }
    setPlayReader(playReader => !playReader);
  };

  const updateConfig = (newConfig) => {
    const updatedConfig = {...config, ...newConfig};
    setConfig(updatedConfig);
    profile.setGlobalConfig(updatedConfig);
  };

  const cbRefreshConfig = () => {
    profile.initProfile()
    .then(() => {
      profile.getGlobalConfig()
      .then(cfg => {
        setConfig({...config, ...cfg});
      });
    });
  };

  const startFullScreen = () => {
    let elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    }
    if ("wakeLock" in navigator) {
      try {
        if (wakeLock.current) {
          wakeLock.current.release();
          wakeLock.current = null;
        }
        navigator.wakeLock.request("screen").then((res) => {
          wakeLock.current = res;
        });
      } catch (err) {
        console.error("Error wakeLock", err);
      }
    }
  }

  const endFullScreen = () => {
    if (document.fullscreen) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
          document.webkitExitFullscreen();
        }
      } catch (err) {
      }
    }
    if ("wakeLock" in navigator) {
      try {
        if (wakeLock.current) {
          wakeLock.current.release();
          wakeLock.current = null;
        }
      } catch (err) {
        console.error("Error wakeLock unlock", err);
      }
    }
  }

  const navigateNext = (far) => {
    if (config.readMode === READ_MODE.SPEED_READER) {
      if (far) {
        // jump next 10
        if (bookProfile.offset < book.metadata.tokens - 10) {
          updateOffset(bookProfile.offset + 10);
        } else {
          updateOffset(book.metadata.tokens-1);
        }
      } else {
        // jump next
        if (bookProfile.offset < book.metadata.tokens) {
          updateOffset(bookProfile.offset + 1);
        }
      }
    } else {
    }
  };

  const navigatePrevious = (far) => {
    if (config.readMode === READ_MODE.SPEED_READER) {
      if (far) {
        // jump previous 10
        if (bookProfile.offset > 10) {
          updateOffset(bookProfile.offset - 10);
        } else {
          updateOffset(0);
        }
      } else {
        // jump previous
        if (bookProfile.offset > 0) {
          updateOffset(bookProfile.offset - 1);
        }
      }
    } else {
    }
  };

  const cbOpenBrowse = () => {
    setOpenBrowse(true);
  };

  const openBook = (newBook) => {
    if (newBook.type === "epub") {
      return bookParser.parseEpub(newBook.url)
      .then(bookParsed => {
        setBook(bookParsed);
        profile.getBookProfile(newBook.url)
        .then(curBookProfile => {
          let extendedBookProfile = {...BOOK_PROFILE_DEFAULT, ...curBookProfile};
          if (extendedBookProfile.tokens !== bookParsed.metadata.tokens) {
            extendedBookProfile.tokens = bookParsed.metadata.tokens;
          }
          if (!extendedBookProfile.uri) {
            extendedBookProfile.uri = newBook.url;
          }
          setBookProfile(extendedBookProfile);
          if (JSON.stringify(extendedBookProfile) !== JSON.stringify(curBookProfile)) {
            profile.setBookProfile(newBook.url, extendedBookProfile);
          }
        });
      })
      .catch(err => {
        console.error("error open book", newBook, err);
      });
    } else if (newBook.type === "pdf") {
    }
  };

  const updateOffset = (newOffset) => {
    let newSessionOffset = [...bookProfile.sessionOffset];
    newSessionOffset.push(newOffset);
    let extendedBookProfile = {...bookProfile, ...{offset: newOffset, sessionOffset: newSessionOffset}};
    setBookProfile(extendedBookProfile);
  };

  const cbCloseBrowse = () => {
    setOpenBrowse(false);
  };

  const cbNavigateBeginChapter = () => {
    let newOffset = 0;
    book.bookContent.forEach((chap, i) => {
      if (i === chapterIndex) {
        setBookProfile({...bookProfile, ...{offset: newOffset}});
      }
      newOffset += chap.tokens;
    });
  };

  const cbNavigateNextChapter = () => {
    let newOffset = 0;
    book.bookContent.forEach((chap, i) => {
      if (i === (chapterIndex+1)) {
        setBookProfile({...bookProfile, ...{offset: newOffset}});
      }
      newOffset += chap.tokens;
    });
  };

  const openBrowsedBook = (newBook) => {
    openBook(newBook)
    .then(() => {
      updateConfig({ currentBook: newBook.url, currentBookType: newBook.type });
    });
    setOpenBrowse(false);
  };

  if (openBrowse) {
    return (
      <Browse config={config} cbOpenBook={openBrowsedBook} cbClose={cbCloseBrowse} />
    );
  } else {
    return (
      <div>
        <TopTitle book={book} cbTogglePlay={togglePlay} />
        <Menu book={book}
              offset={bookProfile.offset}
              chapterIndex={chapterIndex}
              config={config}
              playReader={playReader}
              cbSetOffset={updateOffset}
              cbNavigateNext={navigateNext}
              cbNavigatePrevious={navigatePrevious}
              cbNavigateBeginChapter={cbNavigateBeginChapter}
              cbNavigateNextChapter={cbNavigateNextChapter}
              cbTogglePlay={togglePlay}
              cbUpdateConfig={updateConfig}
              cbRefreshConfig={cbRefreshConfig}
              cbOpenBrowse={cbOpenBrowse} />
        <TextBackgroundContainer config={config}
                                 chapter={chapter}
                                 chapterIndex={chapterIndex}
                                 offset={chapterOffset}
                                 textBackgroundOpacity={config.textBackgroundOpacity}
                                 showCoverBackground={config.coverBackground}
                                 book={book}
                                 playReader={playReader}
                                 cbTogglePlay={togglePlay} />
        <div className="perfect-centering" onClick={togglePlay}>
          <p className={"fw-bold "+getTextSize[config.speedReaderTextSize]}>
            {currentText}
          </p>
        </div>
        <BottomInfo book={book}
                    chapterLabel={chapterLabel}
                    chapterIndex={chapterIndex}
                    offset={bookProfile.offset}
                    textSpeed={config.speedReaderTextSpeed}
                    playReader={playReader}
                    cbTogglePlay={togglePlay}
                    cbNavigateNext={navigateNext}
                    cbNavigatePrevious={navigatePrevious}
                    cbNavigateBeginChapter={cbNavigateBeginChapter}
                    cbNavigateNextChapter={cbNavigateNextChapter} />
      </div>
    );
  }
}
