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
  coverData,
  playReader,
  cbTogglePlay
}) {
  if (chapter && textBackgroundOpacity) {
    let found = false;
    let nodesJsx = [];
    chapter.parsedNodes.forEach((node, index) => {
      if (!found && offset < node.tokens) {
        nodesJsx.push(
          <NodeParser node={node} offset={offset} key={index} book={book} />
        );
        found = true;
      } else {
        offset -= node.tokens;
        nodesJsx.push(
          <NodeParser node={node} offset={-1} key={index} book={book} />
        );
      }
    });
    return (
      <>
        <TextBackgroundStyle useBookCss={config?.useBookCss||false} styles={book.styles||[]} />
        <Cover coverData={coverData} opacity={textBackgroundOpacity} showCover={!playReader && showCoverBackground} />
        <div id="sadok-text-background" className={"text-background-container padding-top-text text-background opacity-" + textBackgroundOpacity} onClick={cbTogglePlay}>
          {nodesJsx}
        </div>
      </>
    );
  } else if (coverData) {
    return (
      <Cover coverData={coverData} opacity={textBackgroundOpacity} showCover={!playReader && showCoverBackground} />
    );
  }
}
