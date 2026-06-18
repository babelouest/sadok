import React, { useState, useEffect } from 'react';

import NodeParser from './NodeParser';

export default function SubNode({node, offset, book}) {
  let nodesJsx = [];
  node.parsedNodes?.forEach((subNode, index) => {
    nodesJsx.push(
      <NodeParser node={subNode} offset={offset} key={index} book={book} />
    );
    if ((offset !== -1) && offset < subNode.tokens) {
      offset = -1;
    } else if (offset !== -1) {
      offset -= subNode.tokens;
    }
  });
  return (nodesJsx);
}
