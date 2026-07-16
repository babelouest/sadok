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

import { convertTxtToDom } from './BookParser.js';

import pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/legacy/build/pdf.worker.mjs';

class SadokPDFParser {

	constructor() {
	}

  extractPdfText(pdfUrl) {
    let pdf = pdfjsLib.getDocument({ url: pdfUrl });
    return this.parsePdfContent(pdf);
  }

  extractPdfData(data) {
    let pdf = pdfjsLib.getDocument({ data: data });
    return this.parsePdfContent(pdf);
  };

  parsePdfContent(pdf) {
    return pdf.promise.then((pdfDoc) => {
      let metadata = {type: "pdf", tokens: 0};
      let contentArray = []
      pdfDoc.getMetadata().then((pdfMeta) => {
        metadata.author = pdfMeta.info?.Author;
        metadata.title = pdfMeta.info?.Title;
      })
      let totalPageCount = pdfDoc.numPages;
      let countPromises = [];
      for (let currentPage = 1; currentPage <= totalPageCount; currentPage++) {
        let page = pdfDoc.getPage(currentPage);
        countPromises.push(
          page.then((page) => {
            let textContent = page.getTextContent();
            return textContent.then((text) => {
              contentArray.push(convertTxtToDom(text.items
              .map((s) => {
                return s.str.trim();
              })
              .join('\n')));
            });
          })
          .catch((err) => {
            return Promise.reject(err);
          })
        );
      }

      return Promise.all(countPromises).then(() => {
        let bookContent = [];
        contentArray.forEach((page, index) => {
          bookContent.push({
            depth: 0,
            label: i18next.t("page-label", {index: (index+1)}),
            parsedNodes: page.nodes,
            tokens: page.tokensTotal,
            tocTokens: page.tokensTotal
          });
          metadata.tokens += page.tokensTotal;
        });
        return Promise.resolve({
          book: false,
          metadata: metadata,
          styles: [],
          fonts: [],
          imgResources: [],
          bookContent: bookContent
        });
      });
    });
  };
}

let sadokPdfParser = new SadokPDFParser();

export default sadokPdfParser;
