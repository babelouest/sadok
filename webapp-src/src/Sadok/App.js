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
import speechSynth from '../lib/SpeechSynth';
import { textSize, TEXT_SIZE_VALS, DARK_MODE, READ_MODE, CONFIG_DEFAULT, BOOK_PROFILE_DEFAULT, LS_SPEECH_LANG } from '../lib/Constants';

import TextBackgroundContainer from './TextBackgroundContainer';
import Menu from './Menu';
import Chapters from './Chapters';
import TopTitle from './TopTitle';
import BottomInfo from './BottomInfo';
import Browse from './Browse';

export default function App({}) {
  const [ config, setConfig ] = useState({...CONFIG_DEFAULT, ...{ lang: i18next.language }});
  const [ bookProfile, setBookProfile ] = useState(BOOK_PROFILE_DEFAULT);
  const [ book, setBook ] = useState({metadata: {tokens: 0}, bookContent: []});
  const [ cssFonts, setCssFonts ] = useState([]);
  const [ chapter, setChapter ] = useState(false);
  const [ chapterIndex, setChapterIndex ] = useState(-1);
  const [ chapterOffset, setChapterOffset ] = useState(0);
  const [ chapterOffsetEnd, setChapterOffsetEnd ] = useState(-1);
  const [ playReader, setPlayReader ] = useState(false);
  const [ currentText, setCurrentText ] = useState("");
  const [ currentTextForBlock, setCurrentTextForBlock ] = useState(null);
  const [ chapterLabel, setChapterLabel ] = useState(false);
  const [ openBrowse, setOpenBrowse ] = useState(false);
  const [ jumpTextRight, setJumpTextRight ] = useState(false);
  const [ coverData, setCoverData ] = useState(false);
  const wakeLockRef = useRef(null);
  const previousDisplayRef = useRef(null);
  const sessionOffsetTimeoutRef = useRef(false);
  const speakTextListRef = useRef([]);
  const speechRunningRef = useRef(false);

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

  const keyUpEvent = (e) => {
    if (e.key === " " || e.code === "Space" || e.keyCode === 32) { // Start reading when space key is pressed
      togglePlay();
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

  const checkJumpTextRight = (currentText) => {
    if (previousDisplayRef.current?.text === currentText.text && previousDisplayRef.current?.chapterOffset !== currentText.chapterOffset && !jumpTextRight && playReader) {
      setJumpTextRight(true);
    } else if (jumpTextRight) {
      setJumpTextRight(false);
    }
    previousDisplayRef.current = currentText;
  };

  const updateChapterIndex = (currentText) => {
    if (!chapter || currentText.chapterIndex !== chapterIndex) {
      setChapterIndex(currentText.chapterIndex);
      setChapter(book.bookContent[currentText.chapterIndex]);
      book.bookContent.forEach((chap, index) => {
        if (index <= currentText.chapterIndex && chap.label) {
          setChapterLabel(chap.label);
        }
      });
    }
    setChapterOffset(currentText.chapterOffset);
  };

  const speedReaderTextLoop = (currentText) => {
    let timeoutFactor = 1;
    if (currentText.text?.length > 16 && config.speedReaderSlowLongWords) {
      timeoutFactor = Math.floor(currentText.text.length/10)*2;
      if (timeoutFactor > 20) {
        timeoutFactor = 20;
      }
    }
    return setTimeout(() => {
      if (book?.metadata?.tokens && bookProfile.offset < book.metadata.tokens) {
        setBookProfile({...bookProfile, ...{offset: bookProfile.offset+1}});
      } else {
        setPlayReader(false);
        endFullScreen();
      }
    }, timeoutFactor*(60000/config.speedReaderTextSpeed));
  };

  const startSpeechThat = () => {
    const currentText = bookParser.getCurrentText(book.bookContent, bookProfile.offset);
    const currentBlock = bookParser.getNextTextBlock(currentText.nodeOffset, currentText.node.text.length, currentText.node.text, currentText.node.coord);
    if (currentBlock) {
      speakTextListRef.current = [{offset: bookProfile.offset, tokensLength: currentBlock.lastOffset - currentBlock.firstOffset}];
      speechSynth.speakText(currentBlock.textForSpeech,
                            currentBlock.text,
                            handleUtterEvent,
                            (window.localStorage?.getItem(LS_SPEECH_LANG)||config.speechLang),
                            config.speechPitch,
                            config.speechRate,
                            bookProfile.offset,
                            currentBlock.lastOffset - currentBlock.firstOffset);
    }
  };

  const getTextSize = () => {
    let param = config.speedReaderTextSize;
    if (config.readMode === READ_MODE.SPEECH) {
      param = config.speechTextSize;
    } else if (config.readMode === READ_MODE.SENTENCE) {
      param = config.sentenceReaderTextSize;
    }
    return textSize[param];
  };

  useEffect(() => { // [] (starup)
    profile.initProfile()
    .then(() => {
      profile.getGlobalConfig()
      .then(cfg => {
        let startConfig = {...config, ...cfg};
        setConfig(startConfig);
        if (startConfig.currentBook && !startConfig.currentBook.startsWith("file://")) {
          openBook({url: startConfig.currentBook, type: startConfig.currentBookType});
        }
      });
    })
    .catch(() => {
    });
  },[]);

  useEffect(() => { // [bookProfile] (save profile)
    if (config.currentBook && (!playReader || speechRunningRef.current)) {
      profile.setBookProfile(config.currentBook, bookProfile);
    }
  },[bookProfile,playReader]);

  useEffect(() => { // [book,config,playReader] (events)
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

  useEffect(() => { // [book,bookProfile,playReader] (show text and loop)
    const currentText = bookParser.getCurrentText(book.bookContent, bookProfile.offset);
    let currentBlock = false;
    if (currentText) {
      checkJumpTextRight(currentText);
      updateChapterIndex(currentText);
    } else {
      setCurrentText("");
      setChapterIndex(0);
      setChapter(false);
    }
    if (bookProfile.readMode === READ_MODE.SPEED_READER) {
      setChapterOffsetEnd(-1);
      if (currentText.text) {
        setCurrentText(currentText.text);
      }
    } else if (bookProfile.readMode === READ_MODE.SPEECH || bookProfile.readMode === READ_MODE.SENTENCE) {
      if (currentText.node) {
        currentBlock = bookParser.getNextTextBlock(currentText.nodeOffset, currentText.node.text.length, currentText.node.text, currentText.node.coord);
        setCurrentTextForBlock(currentText);
        setCurrentText(currentBlock.text);
        setChapterOffsetEnd(currentText.chapterOffset - currentBlock.firstOffset + currentBlock.lastOffset);
      }
    }
    if (playReader) {
      if (bookProfile.readMode === READ_MODE.SPEED_READER) {
        const intervalId = speedReaderTextLoop(currentText);
        return () => clearTimeout(intervalId);
      }
    }
  },[book,bookProfile,playReader]);

  useEffect(() => { // [currentText] (scroll to current word)
    bgWordScrollIfNotVisible();
  },[currentText]);

  useEffect(() => { // [config] (dark mode?)
    const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if ((config.darkMode === "system" && darkModeMql && darkModeMql.matches) || config.darkMode === "enabled") {
      document.documentElement.setAttribute('data-bs-theme','dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme','light');
    }
  },[config]);

  const togglePlay = () => {
    if (!playReader) {
      if (book) {
        startFullScreen();
        startWakeLock();
        if (bookProfile.readMode === READ_MODE.SPEECH) {
          speechRunningRef.current = true;
          startSpeechThat();
        }
        setPlayReader(true);
      }
    } else {
      endFullScreen();
      stopWakeLock();
      if (bookProfile.readMode === READ_MODE.SPEECH) {
        speakTextListRef.current = [];
        speechRunningRef.current = false;
        speechSynth.stopText();
        updateOffset(bookProfile.offset);
      }
      setPlayReader(false);
    }
  };

  const updateConfig = (newConfig) => {
    const updatedConfig = {...config, ...newConfig};
    setConfig(updatedConfig);
    profile.setGlobalConfig(updatedConfig);
  };

  const cbInitConfig = () => {
    profile.initProfile()
    .then(() => {
      profile.getGlobalConfig()
      .then(cfg => {
        setConfig({...CONFIG_DEFAULT, ...cfg});
        if (cfg.currentBook) {
          openBook({url: cfg.currentBook, type: cfg.currentBookType});
        } else {
          setBook({metadata: {}, bookContent: []});
        }
      });
    });
  };

  const startFullScreen = () => {
    if (config.fullScreen) {
      let elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
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
  }

  const startWakeLock = () => {
    if ("wakeLockRef" in navigator) {
      try {
        if (wakeLockRef.current) {
          wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
        navigator.wakeLockRef.request("screen").then((res) => {
          wakeLockRef.current = res;
        });
      } catch (err) {
        console.error("Error wakeLockRef", err);
      }
    }
  };

  const stopWakeLock = () => {
    if ("wakeLockRef" in navigator) {
      try {
        if (wakeLockRef.current) {
          wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      } catch (err) {
        console.error("Error wakeLockRef unlock", err);
      }
    }
  };

  const navigateNext = (far) => {
    if (bookProfile.readMode === READ_MODE.SPEED_READER) {
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
    } else if (bookProfile.readMode === READ_MODE.SPEECH || bookProfile.readMode === READ_MODE.SENTENCE) {
      if (far) {
        // jump next 10 blocks
        let curBlockOffset = bookProfile.offset;
        let curText = bookParser.getCurrentText(book.bookContent, curBlockOffset);
        let curBlock = bookParser.getNextTextBlock(curText.nodeOffset, curText.node.text.length, curText.node.text, curText.node.coord);
        for (let i=0; i<10; i++) {
          if (curBlockOffset + (curBlock.lastOffset - curBlock.firstOffset) < book.metadata.tokens) {
            curBlockOffset += (curBlock.lastOffset - curBlock.firstOffset) + 1;
            curText = bookParser.getCurrentText(book.bookContent, curBlockOffset);
            curBlock = bookParser.getNextTextBlock(curText.nodeOffset, curText.node.text.length, curText.node.text, curText.node.coord);
          }
        }
        updateOffset(curBlockOffset);
      } else {
        // jump next block
        const nextBlockOffset = bookProfile.offset + (chapterOffsetEnd - chapterOffset) + 1;
        //console.log("nextBlockOffset", nextBlockOffset, chapterOffsetEnd, chapterOffset);
        if (nextBlockOffset < book.metadata.tokens) {
          updateOffset(nextBlockOffset);
        }
      }
    }
  };

  const navigatePrevious = (far) => {
    if (bookProfile.readMode === READ_MODE.SPEED_READER) {
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
    } else if (bookProfile.readMode === READ_MODE.SPEECH || bookProfile.readMode === READ_MODE.SENTENCE) {
      if (far) {
        // jump previous 10 blocks
        let currentOffset = bookProfile.offset;
        for (let i=0; i<10; i++) {
          if (currentOffset >= 0) {
            const previousText = bookParser.getCurrentText(book.bookContent, currentOffset);
            const previousBlock = bookParser.getPreviousTextBlock(previousText.nodeOffset, previousText.node.text.length, previousText.node.text, previousText.node.coord);
            currentOffset = currentOffset - 1 + (previousBlock.firstOffset - previousBlock.lastOffset);
          }
        }
        updateOffset(currentOffset + 1);
      } else {
        // jump previous block
        const previousText = bookParser.getCurrentText(book.bookContent, bookProfile.offset - 1);
        const previousBlock = bookParser.getPreviousTextBlock(previousText.nodeOffset, previousText.node.text.length, previousText.node.text, previousText.node.coord);
        const previousBlockOffset = bookProfile.offset - 1 + (previousBlock.firstOffset - previousBlock.lastOffset);
        if (previousBlockOffset >= 0) {
          updateOffset(previousBlockOffset);
        }
      }
    }
  };

  const cbOpenBrowse = () => {
    setOpenBrowse(true);
  };

  const openBook = (newBook) => {
    let prom = false;
    if (newBook.type === "epub") {
      prom = bookParser.parseEpub(newBook.url);
    } else if (newBook.type === "epubInline") {
      const blob = new File([newBook.data], newBook.url, { type: 'application/epub+zip' });
      prom = bookParser.parseEpub(blob);
    } else if (newBook.type === "pdf") {
      prom = bookParser.parsePDF(newBook.url);
    } else if (newBook.type === "pdfInline") {
      prom = bookParser.parsePDF(newBook);
    } else if (newBook.type === "txt") {
      prom = bookParser.parseTxt(newBook.url);
    } else if (newBook.type === "txtInline") {
      prom = bookParser.parseTxtInline(newBook.url, newBook.data);
    }
    if (prom) {
      return prom.then(bookParsed => {
        setBook(bookParsed);
        profile.getBookProfile(newBook.url)
        .then(curBookProfile => {
          let extendedBookProfile = {...{...BOOK_PROFILE_DEFAULT, ...{readMode: config.readMode}}, ...curBookProfile};
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
        if (bookParsed.book?.resources?.cover) {
          bookParsed.book.loadBlob(bookParsed.book.resources.cover.href)
          .then(res => {
            const reader = new FileReader();
            reader.readAsDataURL(res);
            reader.onloadend = () => {
              const dataUrlPrefix = `data:${bookParsed.book.resources.cover.mediaType};base64,`;
              setCoverData(dataUrlPrefix+reader.result.split(",")[1]);
            };
          });
        } else {
          setCoverData(false);
        }
      })
      .catch(err => {
        console.error("error open book", newBook, err);
      });
    } else {
      return Promise.reject(false);
    }
  };

  const updateOffset = (newOffset, saveSessionOffset = true) => {
    let extendedBookProfile = {...bookProfile, ...{offset: newOffset}};
    setBookProfile(extendedBookProfile);
    clearTimeout(sessionOffsetTimeoutRef.current);
    if (saveSessionOffset) {
      sessionOffsetTimeoutRef.current = setTimeout(() => {
        let newSessionOffset = [...extendedBookProfile.sessionOffset];
        newSessionOffset.push(newOffset);
        if (newSessionOffset.length > 10) {
          newSessionOffset = newSessionOffset.slice(-10);
        }
        let newExtendedProfile = {...extendedBookProfile, ...{sessionOffset: newSessionOffset}};
        setBookProfile(newExtendedProfile);
      }, 1000);
    }
  };

  const cbCloseBrowse = () => {
    setOpenBrowse(false);
  };

  const cbNavigateBeginChapter = () => {
    let newOffset = 0;
    book.bookContent.forEach((chap, i) => {
      if (chapterOffset === 0) {
        if (i === chapterIndex-1) {
          updateOffset(newOffset);
        }
      } else {
        if (i === chapterIndex) {
          updateOffset(newOffset);
        }
      }
      newOffset += chap.tokens;
    });
  };

  const cbNavigateNextChapter = () => {
    let newOffset = 0;
    book.bookContent.forEach((chap, i) => {
      if (i === (chapterIndex+1)) {
        updateOffset(newOffset);
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

  const openBookByContent = (url, type, data) => {
    openBook({type: type+"Inline", data: data, url: url})
    .then(() => {
      updateConfig({ currentBook: url, currentBookType: type });
    });
    setOpenBrowse(false);
  };

  const cbRemoveProfile = () => {
    profile.deleteBookProfile(bookProfile.uri)
    .then(() => {
      updateConfig({ currentBook: false, currentBookType: false });
      setBook({metadata: {}, bookContent: []});
      setCoverData(false);
    });
  };

  const updateBookProfile = (updatedProfile) => {
    setBookProfile({...bookProfile, ...updatedProfile});
  };

  const cbSessionClear = () => {
    setBookProfile({...bookProfile, ...{sessionOffset: [bookProfile.offset]}});
  };

  const handleUtterEvent = (e) => {
    if (speechRunningRef.current) {
      if (e.type === "start") {
        let speakTextList = [...speakTextListRef.current];
        const lastText = speakTextList[speakTextList.length - 1];
        if (lastText.offset + lastText.tokensLength < book.metadata.tokens) {
          const nextOffset = lastText.offset + lastText.tokensLength + 1;
          const currentText = bookParser.getCurrentText(book.bookContent, nextOffset);
          if (currentText) {
            const currentBlock = bookParser.getNextTextBlock(currentText.nodeOffset, currentText.node.text.length, currentText.node.text, currentText.node.coord);
            if (currentBlock) {
              speakTextList.push({offset: nextOffset, tokensLength: currentBlock.lastOffset - currentBlock.firstOffset});
              speakTextListRef.current = speakTextList;
              speechSynth.speakText(currentBlock.textForSpeech,
                                    currentBlock.text,
                                    handleUtterEvent,
                                    (window.localStorage?.getItem(LS_SPEECH_LANG)||config.speechLang),
                                    config.speechPitch,
                                    config.speechRate,
                                    nextOffset,
                                    currentBlock.lastOffset - currentBlock.firstOffset);
            }
          }
        } else {
        }
      } else if (e.type === "end") {
        let speakTextList = [...speakTextListRef.current];
        console.log([...speakTextList].length);
        if (speakTextList.length > 1) {
          updateOffset(speakTextList[speakTextList.length - 1].offset, false);
          speakTextList.splice(0, 1); // should remove current utterance coord
          speakTextListRef.current = speakTextList;
        } else {
          updateOffset(book.metadata.tokens, false);
          endFullScreen();
          stopWakeLock();
          setPlayReader(false);
        }
      }
    }
  }

  if (openBrowse) {
    return (
      <Browse config={config} cbOpenBook={openBrowsedBook} cbOpenBookByContent={openBookByContent} cbClose={cbCloseBrowse} />
    );
  } else {
    return (
      <div>
        <TopTitle book={book} cbTogglePlay={togglePlay} />
        <Menu book={book}
              offset={bookProfile.offset}
              bookProfile={bookProfile}
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
              cbUpdateBookProfile={updateBookProfile}
              cbInitConfig={cbInitConfig}
              cbOpenBrowse={cbOpenBrowse}
              cbRemoveProfile={cbRemoveProfile}
              cbSessionClear={cbSessionClear} />
        <TextBackgroundContainer config={config}
                                 bookProfile={bookProfile}
                                 chapter={chapter}
                                 chapterIndex={chapterIndex}
                                 offset={chapterOffset}
                                 offsetEnd={chapterOffsetEnd}
                                 textBackgroundOpacity={config.textBackgroundOpacity}
                                 showCoverBackground={config.coverBackground}
                                 book={book}
                                 coverData={coverData}
                                 playReader={playReader}
                                 cbTogglePlay={togglePlay} />
        {bookProfile.readMode === READ_MODE.SENTENCE?
        <button type="button" className="btn btn-secondary fixed-left-button elt-left" onClick={() => navigatePrevious(false)}>
          <img src="img/chevron_backward_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </button>:<></>}
        <div className="perfect-centering" onClick={togglePlay}>
          <p className={"fw-bold "+getTextSize()}>
            {jumpTextRight?<span>&nbsp;&nbsp;&nbsp;</span>:<></>}
            {currentText}
          </p>
          {!book.metadata.tokens?<h2>{i18next.t("no-book")}</h2>:<></>}
        </div>
        {bookProfile.readMode === READ_MODE.SENTENCE?
        <button type="button" className="btn btn-secondary fixed-right-button elt-right" onClick={() => navigateNext(false)}>
          <img src="img/chevron_forward_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" />
        </button>:<></>}
        <BottomInfo book={book}
                    bookProfile={bookProfile}
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
