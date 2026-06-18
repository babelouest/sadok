import React, { useState, useEffect } from 'react';

import NodeParser from './NodeParser';
import Cover from './Cover';
import TextBackgroundStyle from './TextBackgroundStyle';

export default function TextBackgroundContainer({
  config,
  chapter,
  chapterIndex,
  offset,
  textBackgroundOpacity,
  showCoverBackground,
  book,
  playReader,
  cbTogglePlay
}) {
  if (chapter && textBackgroundOpacity) {
    return (
      <>
        <TextBackgroundStyle useBookCss={config?.useBookCss||false} styles={book.styles||[]} />
        <Cover book={book} opacity={textBackgroundOpacity} showCover={!playReader && showCoverBackground} />
        <div id="sadok-text-background" className={"text-background-container padding-top-text text-background opacity-" + textBackgroundOpacity} onClick={cbTogglePlay}>
          {
            chapter.parsedNodes.map((node, index) => {
              if (offset < node.tokens) {
                return (
                  <NodeParser node={node} offset={offset} key={index} book={book} />
                );
              } else {
                offset -= node.tokens;
                return (
                  <NodeParser node={node} offset={-1} key={index} book={book} />
                );
              }
            })
          }
        </div>
      </>
    );
  }
}
