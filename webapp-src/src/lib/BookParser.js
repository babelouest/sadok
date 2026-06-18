import i18next from 'i18next';

import epubParser from '../lib/EpubParser';

class BookParser {

	constructor() {
	}

  parseEpub(epub) {
    return epubParser.extractEpubText(epub)
  }

  extractUrlText(textUrl) {
    return $.ajax({
      method: "GET",
      url: textUrl
    });
  }

  parseTitleFromUrl(url, metadata = false) {
    if (metadata?.title) {
      return (metadata.author?metadata.author+" - ":"") + metadata.title;
    } else {
      let title = url.split("/");
      title = title[title.length-1];
      return decodeURIComponent(title.substring(0, title.lastIndexOf('.')).replaceAll("_", " "));
    }
  }

  parseTxtToCoord(text) {
    let coordList = [],
        wordStart = 0,
        inAWord = false,
        i = 0;
    if (text) {
      while (i<text.length) {
        let curChar = text.charCodeAt(i), nextChar = 0, prevChar = 0;
        if (i < text.length-1) {
          nextChar = text.charCodeAt(i+1);
        }
        if (i) {
          prevChar = text.charCodeAt(i-1);
        }
        if (inAWord) {
          if (this.isWhitespace(curChar) && prevChar && !this.isNonBreakSpacePreviousNonChar(prevChar)) { // Look for next whitespace
            inAWord = false;
            if (text.substring(wordStart, i).trim()) {
              let coord = {start: wordStart, end: i};
              coordList.push(coord);
            }
            wordStart = 0;
          } else if (nextChar && this.isSeparator(curChar) && !this.isWhitespace(nextChar)) { // Look for a word separator without a whitespace right after
            inAWord = false;
            if (text.substring(wordStart, i+1).trim()) {
              let coord = {start: wordStart, end: i+1};
              coordList.push(coord);
            }
            wordStart = 0;
          }
        } else {
          // Look for next non whitespace
          if (!this.isWhitespace(curChar)) {
            wordStart = i;
            inAWord = true;
          }
        }
        i++;
        if (i === text.length && wordStart) {
          if (text.substring(wordStart, i).trim()) {
            let coord = {start: wordStart, end: i};
            coordList.push(coord);
          }
        }
      }
    }
    return coordList;
  }

  getExpectedType(url) {
    let textExpectedType = "txt";
    if (url) {
      let ext = url.substring(url.lastIndexOf('.'));
      if (ext.toLowerCase() === ".epub") {
        textExpectedType = "epub";
      } else if (ext.toLowerCase() === ".pdf") {
        textExpectedType = "pdf";
      }
    }
    return textExpectedType;
  }

  getChapterFromOffset(chapters, offset) {
  let chapter = false;
    chapters.forEach(curChapter => {
      if (offset >= curChapter.startCoord && curChapter.label) {
        chapter = curChapter;
      }
    });
    return chapter;
  }

  getCoordFromTextOffset(coordList, textOffset) {
    let coordIndex = -1;
    if (coordList.length && textOffset < coordList[0].start) {
      coordIndex = 0;
    } else {
      let i = 0;
      for (i=coordList.length-1; i>0 && coordList[i].start > textOffset; i--);
      coordIndex = i;
    }
    return coordIndex;
  }

  deepSearchWord(nodes, offset) {
    let word = false;
    nodes.forEach(node => {
      if ((word === false) && offset < node.tokens) {
        if (node.tag !== "#text") {
          word = this.deepSearchWord(node.parsedNodes, offset);
        } else {
          let coord = node.coord[offset];
          if (coord) {
            word = node.text.substring(coord.start, coord.end);
          } else {
            word = "";
            console.log("error", offset, node);
          }
        }
      } else {
        offset -= node.tokens;
      }
    });
    return word;
  };

  deepSearchTextBlock(nodes, offset) {
    let textBlock = false;
    nodes.forEach(node => {
      if ((textBlock === false) && offset < node.tokens) {
        if (node.tag !== "#text") {
          textBlock = this.deepSearchTextBlock(node.parsedNodes, offset);
        } else {
          let coord = node.coord[offset];
          if (coord) {
            textBlock = {
              text: node.text,
              coord: node.coord,
              tokens: node.tokens,
              offset: offset
            };
          } else {
            textBlock = {
              text: "",
              coord: [],
              tokens: 0,
              offset: offset
            };
            console.log("error", offset, node);
          }
        }
      } else {
        offset -= node.tokens;
      }
    });
    return textBlock;
  };

  getChapterIndexFromOffset(bookContent, offset) {
    let found = false;
    let curOffset = offset, curIndex = -1;
    bookContent.forEach((chapter, index) => {
      if (!found) {
        if (curOffset < chapter.tokens) {
          found = true;
          curIndex = index;
        } else {
          curOffset -= chapter.tokens;
        }
      }
    });
    if (found) {
      return {
        index: curIndex,
        offset: curOffset
      };
    } else {
      return false;
    }
  };
}

let bookParser = new BookParser();

export default bookParser;

export const parseTxtToCoord = (text) => {
  let coordList = [],
      wordStart = 0,
      inAWord = false,
      i = 0;
  if (text) {
    while (i<text.length) {
      let curChar = text.charCodeAt(i), nextChar = 0, prevChar = 0;
      if (i < text.length-1) {
        nextChar = text.charCodeAt(i+1);
      }
      if (i) {
        prevChar = text.charCodeAt(i-1);
      }
      if (inAWord) {
        if (isWhitespace(curChar) && prevChar && !isNonBreakSpacePreviousNonChar(prevChar)) { // Look for next whitespace
          inAWord = false;
          if (text.substring(wordStart, i).trim()) {
            let coord = {start: wordStart, end: i};
            coordList.push(coord);
          }
          wordStart = 0;
        } else if (nextChar && isSeparator(curChar) && !isWhitespace(nextChar)) { // Look for a word separator without a whitespace right after
          inAWord = false;
          if (text.substring(wordStart, i+1).trim()) {
            let coord = {start: wordStart, end: i+1};
            coordList.push(coord);
          }
          wordStart = 0;
        }
      } else {
        // Look for next non whitespace
        if (!isWhitespace(curChar)) {
          wordStart = i;
          inAWord = true;
        }
      }
      i++;
      if (i === text.length && inAWord) {
        if (text.substring(wordStart, i).trim()) {
          let coord = {start: wordStart, end: i};
          coordList.push(coord);
        }
      }
    }
  }
  return coordList;
}

export const isWhitespace = (code) => {
  return ([
  0x0009, // character tabulation
  0x000A, // line feed
  0x000B, // line tabulation
  0x000C, // form feed
  0x000D, // carriage return
  0x0020, // space
  0x0085, // next line
  0x00A0, // no-break space
  0x1680, // ogham space mark
  0x180E, // mongolian vowel separator
  0x2000, // en quad
  0x2001, // em quad
  0x2002, // en space
  0x2003, // em space
  0x2004, // three-per-em space
  0x2005, // four-per-em space
  0x2006, // six-per-em space
  0x2007, // figure space
  0x2008, // punctuation space
  0x2009, // thin space
  0x200A, // hair space
  0x200B, // zero width space
  0x200C, // zero width non-joiner
  0x200D, // zero width joiner
  0x2028, // line separator
  0x2029, // paragraph separator
  //0x202F, // narrow no-break space
  0x205F, // medium mathematical space
  0x2060, // word joiner
  0x3000, // ideographic space
  //0xFEFF  // zero width non-breaking space
  ].indexOf(code) > -1)
}

export const isSeparator = (code) => {
  return ([
    0x002e, // .
    0x003a, // :
    0x0021, // !
    0x003f, // ?
    //0x0028, // (
    0x0029, // )
    //0x005b, // [
    0x005d, // ]
    //0x007b, // {
    0x007d, // }
    0x2026  // …
  ].indexOf(code) > -1)
}

export const isNonBreakSpacePreviousNonChar = (code) => {
  return ([
    0x2013, // –
    0x2014, // —
  ].indexOf(code) > -1)
}
