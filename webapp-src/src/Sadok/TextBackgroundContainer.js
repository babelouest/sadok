import React, { useState, useEffect } from 'react';

import NodeParser from './NodeParser';
import Cover from './Cover';
import TextBackgroundStyle from './TextBackgroundStyle';

import { READ_MODE } from '../lib/Constants';

export default function TextBackgroundContainer({
  config,
  bookProfile,
  chapter,
  chapterIndex,
  offset,
  offsetEnd,
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
          <NodeParser node={node} offset={offset} offsetEnd={offsetEnd} key={index} book={book} />
        );
        found = true;
      } else {
        offset -= node.tokens;
        offsetEnd -= node.tokens;
        nodesJsx.push(
          <NodeParser node={node} offset={-1} offsetEnd={-1} key={index} book={book} />
        );
      }
    });
    return (
      <>
        <TextBackgroundStyle useBookCss={config?.useBookCss||false} styles={book.styles||[]} />
        <Cover coverData={coverData} opacity={textBackgroundOpacity} showCover={!playReader && showCoverBackground} />
        <div id="sadok-text-background" className={"text-background-container padding-top-text text-background opacity-" + textBackgroundOpacity + ((bookProfile.readMode === READ_MODE.SENTENCE)?" text-background-container-shrinked":"")} onClick={cbTogglePlay}>
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
