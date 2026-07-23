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

import i18next from 'i18next';

import epubParser from '../lib/EpubParser';
import sadokPdfParser from '../lib/PDFParser';
import apiManager from './APIManager';

import { separators } from '../lib/Constants';

class BookParser {

	constructor() {
	}

  parseEpub(epub) {
    return epubParser.extractEpubText(epub)
  }

  parsePDF(pdf) {
    if (typeof pdf  === "string") {
      return sadokPdfParser.extractPdfText(pdf);
    } else {
      return sadokPdfParser.extractPdfData(pdf.data);
    }
  }

  parseTxt(txtUrl) {
    return fetch(txtUrl, {
      method: "GET",
      redirect: "error"
    })
    .then(resp => {
      if (resp.ok) {
        return resp.text()
        .then(text => {
          return this.parseTxtInline(txtUrl, text);
        });
      } else {
        return Promise.reject("error");
      }
    })
    .catch(err => {
      console.error("API error", err);
    });
  }

  parseTxtInline(url, data) {
    const { nodes, tokensTotal } = convertTxtToDom(data);
    return Promise.resolve({
      book: false,
      metadata: {
        type: "txt",
        author: false,
        title: parseTitleFromUrl(url),
        year: false,
        tokens: tokensTotal,
      },
      styles: [],
      fonts: [],
      imgResources: [],
      bookContent: [{
        depth: 0,
        label: false,
        parsedNodes: nodes,
        tokens: tokensTotal,
        tocTokens: tokensTotal
      }]
    });
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
    let searchedWord = false;
    nodes.forEach(node => {
      if ((searchedWord === false) && offset < node.tokens) {
        if (node.tag !== "#text") {
          searchedWord = this.deepSearchWord(node.parsedNodes, offset);
        } else {
          let coord = node.coord[offset];
          if (coord) {
            searchedWord = {
              text: node.text.substring(coord.start, coord.end),
              node: node,
              nodeOffset: offset
            };
          } else {
            searchedWord = false;
            console.log("error", offset, node);
          }
        }
      } else {
        offset -= node.tokens;
      }
    });
    return searchedWord;
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

  getCurrentText(bookContent, offset) {
    const curChapterIndex = this.getChapterIndexFromOffset(bookContent, offset);
    if (curChapterIndex) {
      const searchedWord = this.deepSearchWord(bookContent[curChapterIndex.index].parsedNodes, curChapterIndex.offset);
      return {
        chapterIndex: curChapterIndex.index,
        chapterOffset: curChapterIndex.offset,
        text: searchedWord.text,
        node: searchedWord.node,
        nodeOffset: searchedWord.nodeOffset
      }
    } else {
      return false;
    }
  }

  getTextDisplayed(fullPlain, coordList, offset) {
    let textDisplayed = "";
    let coord = coordList[offset];
    if (coord) {
      textDisplayed = fullPlain.substring(coord.start, coord.end);
    }
    return textDisplayed;
  }

  getNextTextBlock(firstOffset, textLen, fullPlain, textCoordList) {
    let lastOffset = firstOffset;
    let str = "", strForSpeech = "";
    if (textLen && fullPlain && textCoordList) {
      // iterate words
      // if lastOffset is the last coord available, end iteration
      // if a word ends with a separator char, end interation
      // if iteration is more than 100, end iteration
      while (lastOffset < textCoordList.length - 1 &&
             !(separators.some(x=>this.getTextDisplayed(fullPlain, textCoordList, lastOffset).includes(x))) &&
             lastOffset < (firstOffset + 100)) {
        lastOffset++;
      }
      if (textCoordList[firstOffset] && textCoordList[lastOffset]) {
        str = fullPlain.substring(textCoordList[firstOffset].start, textCoordList[lastOffset].end);
        strForSpeech = str.replaceAll("\n", " ");
      }
    }
    return {text: str, textForSpeech: strForSpeech, firstOffset: firstOffset, lastOffset: lastOffset};
  };

  getPreviousTextBlock(firstOffset, textLen, fullPlain, textCoordList) {
    let previousOffset = firstOffset>0?firstOffset-1:0;
    let str = "", strForSpeech = "";
    if (textLen && fullPlain && textCoordList) {
      while (previousOffset > 0 &&
             !(separators.some(x=>this.getTextDisplayed(fullPlain, textCoordList, (previousOffset-1)).includes(x))) &&
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

export const isEndingPunctuation = (code) => {
  return ([
//    0x002c, // ,
    0x002e, // .
    0x0021, // !
    0x003f, // ?
    0x2026  // …
  ].indexOf(code) > -1)
}

export const isNonLetteredChar = (code) => {
  return ([
    0x002c, // ,
    0x002e, // .
    0x003a, // :
    0x0021, // !
    0x003f, // ?
    0x0028, // (
    0x0029, // )
    0x005b, // [
    0x005d, // ]
    0x007b, // {
    0x007d, // }
    0x2014, // —
    0x2026  // …
  ].indexOf(code) > -1)
}

export const isWordEndingPunctuation = (text) => {
  return (text?.length&&isEndingPunctuation(text.charCodeAt(text.length-1)))||false;
}

export const isNonBreakSpacePreviousNonChar = (code) => {
  return ([
    0x2013, // –
    0x2014, // —
  ].indexOf(code) > -1)
}

export const parseTitleFromUrl = (url, metadata = false) => {
  if (metadata?.title) {
    return (metadata.author?metadata.author+" - ":"") + metadata.title;
  } else {
    let title = url.split("/");
    title = title[title.length-1];
    return decodeURIComponent(title.substring(0, title.lastIndexOf('.')).replaceAll("_", " "));
  }
}

export const convertTxtToDom = (data) => {
  let splitText = data.split("\n");
  let nodes = [], tokensTotal = 0;
  splitText.forEach(paragraph => {
    let coords = parseTxtToCoord(paragraph);
    tokensTotal += coords.length;
    nodes.push({
      classList: "",
      id: "",
      tag: "p",
      tokens: coords.length,
      parsedNodes: [{
        classList: "",
        id: "",
        tag: "#text",
        tokens: coords.length,
        coord: coords,
        text: paragraph,
        parsedNodes: []
      }]
    });
  });
  return {
    nodes: nodes,
    tokensTotal: tokensTotal
  };
};
