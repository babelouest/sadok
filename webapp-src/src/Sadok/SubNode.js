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

export default function SubNode({node, offset, offsetEnd, book}) {
  let nodesJsx = [];
  node.parsedNodes?.forEach((subNode, index) => {
    nodesJsx.push(
      <NodeParser node={subNode} offset={offset} offsetEnd={offsetEnd} key={index} book={book} />
    );
    if ((offset !== -1) && offset < subNode.tokens) {
      offset = -1;
      offsetEnd = -1;
    } else if (offset !== -1) {
      offset -= subNode.tokens;
      offsetEnd -= subNode.tokens;
    }
  });
  return (nodesJsx);
}
