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
        <div id="sadok-text-background" className={"sadok-text-background text-background-container padding-top-text text-background opacity-" + textBackgroundOpacity + ((bookProfile.readMode === READ_MODE.SENTENCE)?" text-background-container-shrinked":"")} onClick={cbTogglePlay}>
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
