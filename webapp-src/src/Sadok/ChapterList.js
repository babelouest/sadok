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
