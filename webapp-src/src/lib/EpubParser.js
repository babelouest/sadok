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
    //console.log("getTocFromId", id, tocList);
    tocList.forEach(toc => {
      if (!content.label && toc.href === id) {
        //console.log("Found label", toc.label);
        content.label = toc.label;
      }
      if (!content.label && toc.subitems?.length) {
        content = this.getTocFromId(toc.subitems, id, (depth+1));
      }
    });
    //console.log(content);
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
          //console.log("sec", sec);
          let parsedNodes = this.navigateDom(doc.childNodes);
          let tokens = 0;
          parsedNodes.forEach(sn => {
            if (!isNaN(sn.tokens)) {
              tokens += sn.tokens;
            }
          });
          tokensTotal += tokens;
          let toc = this.getTocFromId(book.toc, sec.id, 0);
          //console.log(toc);
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
