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
