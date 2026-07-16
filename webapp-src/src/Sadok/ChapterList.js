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

import React, { useState, useEffect } from 'react';

import ChapterItem from './ChapterItem';

export default function ChapterList({book, config, offset, cbSetOffset}) {

  let chaptersJsx = [];
  let chapterOffset = 0;
  book.bookContent.map((chapter, index) => {
    if (chapter.label) {
      chaptersJsx.push(
        <ChapterItem key={index}
                     config={config}
                     totalTokens={book.metadata.tokens}
                     chapter={chapter}
                     chapterOffset={chapterOffset}
                     offset={offset}
                     active={offset >= chapterOffset && offset < (chapterOffset+chapter.tocTokens)}
                     cbSetOffset={cbSetOffset}
        />
      );
    }
    chapterOffset += chapter.tokens;
  });

  return (
    <div className="list-group">
      <div className="chapter-list">
        {chaptersJsx}
      </div>
    </div>
  );
}
