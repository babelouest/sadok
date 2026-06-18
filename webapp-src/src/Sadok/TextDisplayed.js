import React, { useState, useEffect } from 'react';

import NodeParser from './NodeParser';

export default function TextDisplayed({
  text,
  textSize,
  coordStart,
  coordEnd
}) {
  if (coordStart || coordEnd) {
    return (
      <>
        {text.substring(0, coordStart)}
        <span id="sadok-bg-word" className="bg-primary">{text.substring(coordStart, coordEnd)}</span>
        {text.substring(coordEnd, text.length)}
      </>
    );
  } else {
    return (
      <>{text}</>
    );
  }
}
