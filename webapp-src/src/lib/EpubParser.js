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

import { makeBook, EPUB } from 'foliate-js/view.js';
import { parseTxtToCoord } from './BookParser.js';

class EpubParser {

	constructor() {
	}

  getTocFromId(tocList, id, depth = 0) {
    let content = {
      depth: depth,
      label: false
    };
    tocList.forEach(toc => {
      if (!content.label && toc.href.includes(id)) {
        content.label = toc.label;
      }
      if (!content.label && toc.subitems?.length) {
        content = this.getTocFromId(toc.subitems, id, (depth+1));
      }
    });
    return content;
  }

  navigateDom(doms) {
    let parsedNodes = [];
    doms.forEach(dom => {
      if (dom.nodeName !== "head") {
        let subNodes = this.navigateDom(dom.childNodes);
        let node = {
          tag: dom.nodeName,
          parsedNodes: subNodes
        };
        if (dom.nodeName === "#text") {
          let text = dom.nodeValue.trim();
          if (text.length) {
            let coord = parseTxtToCoord(text);
            node.tokens = coord.length;
            node.coord = coord
            node.text = text;
            parsedNodes.push(node);
          }
          node.classList = "";
          node.id = dom.id;
        } else if (dom.nodeName !== "#text") {
          if (dom.nodeName === "a") {
            node.href = dom.href;
            node.title = dom.title;
            node.name = dom.name;
          } else if (dom.nodeName === "img") {
            node.alt = dom.alt;
            node.src = dom.attributes.getNamedItem("src").value;
          }
          node.classList = dom.classList?.value||"";
          node.id = dom.id;
          node.tokens = 0;
          subNodes.forEach(sn => {
            if (!isNaN(sn.tokens)) {
              node.tokens += sn.tokens;
            }
          });
          parsedNodes.push(node);
        }
      }
    });
    return parsedNodes;
  }

  extractEpubText(epub) {
    return makeBook(epub)
    .then(book => {
      let styles = [], imgResources = [], fonts = [], manProms = [];
      book.resources.manifest.forEach(man => {
        if (man.mediaType === "text/css") {
          manProms.push(book.loadText(man.href)
          .then(res => {
            styles.push(res);
          }));
        } else if (man.mediaType.startsWith("image/")) {
          imgResources.push(man);
        } else if (man.mediaType.startsWith("application/font")) {
          fonts.push(man);
        }
      });
      let bookContent = [], proms = [], tokensTotal = 0;
      book.sections.forEach((sec, index) => {
        proms.push(sec.createDocument()
        .then(doc => {
          let parsedNodes = this.navigateDom(doc.childNodes);
          let tokens = 0;
          parsedNodes.forEach(sn => {
            if (!isNaN(sn.tokens)) {
              tokens += sn.tokens;
            }
          });
          tokensTotal += tokens;
          let toc = this.getTocFromId(book.toc, sec.id, 0);
          if (!bookContent[index]) {
            bookContent[index] = {
              depth: toc.depth,
              label: toc.label,
              parsedNodes: parsedNodes,
              tokens: tokens
            }
          } else {
            bookContent[index].parsedNodes.push(...parsedNodes);
            bookContent[index].tokens += tokens;
          }
        }));
      });
      proms.push(...manProms);
      return Promise.all(proms)
      .then(() => {
        if (bookContent.length) {
          let tocTokens = 0;
          for (let i = bookContent.length - 1; i >= 0; i--) {
            tocTokens += bookContent[i].tokens;
            if (bookContent[i].label) {
              bookContent[i].tocTokens = tocTokens;
              tocTokens = 0;
            }
          }
        }
        return {
          book: book,
          metadata: {
            type: "epub",
            author: book.metadata?.author,
            title: book.metadata?.title,
            year: book.metadata?.published,
            tokens: tokensTotal
          },
          styles: styles,
          fonts: fonts,
          imgResources: imgResources,
          bookContent: bookContent
        };
      });
    });
  }
}

let epubParser = new EpubParser();

export default epubParser;
