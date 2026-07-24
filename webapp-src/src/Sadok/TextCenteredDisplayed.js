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
import i18next from 'i18next';

import { isNonLetteredChar } from '../lib/BookParser';

const splitTextToORP = (text) => {
  let out = {
    pre: "",
    point: "",
    post: ""
  };
  if (text?.length > 0) {
    let textLen = text.length, firstChar = 0;
    for (let i=text.length - 1; i>=0; i--) {
      if (isNonLetteredChar(text.charCodeAt(i))) {
        textLen--;
      } else {
        break;
      }
    }
    for (let i=0; i<textLen; i++) {
      if (isNonLetteredChar(text.charCodeAt(i))) {
        firstChar++;
        textLen--;
      } else {
        break;
      }
    }
    if (textLen === 1) {
      out.point = text.substring(0,firstChar+1);
      out.post = text.substring(firstChar+1);
    } else if (textLen <= 5) {
      out.pre = text.substring(0,firstChar+1);
      out.point = text.substring(firstChar+1, firstChar+2);
      out.post = text.substring(firstChar+2);
    } else if (textLen <= 9) {
      out.pre = text.substring(0,firstChar+2);
      out.point = text.substring(firstChar+2, firstChar+3);
      out.post = text.substring(firstChar+3);
    } else if (textLen <= 13) {
      out.pre = text.substring(0,firstChar+3);
      out.point = text.substring(firstChar+3, firstChar+4);
      out.post = text.substring(firstChar+4);
    } else {
      out.pre = text.substring(0,firstChar+4);
      out.point = text.substring(firstChar+4, firstChar+5);
      out.post = text.substring(firstChar+5);
    }
  }
  return out;
};

export default function TextCenteredDisplayed({
  text,
  textSize,
  optimalRecognitionPoint,
  jumpTextRight,
  noBook
}) {
  if (noBook) {
    return (
      <h2>
        {i18next.t("no-book")}
      </h2>
    );
  } else if (optimalRecognitionPoint) {
    const { pre, point, post } = splitTextToORP(text);
    return (
      <div>
        <div className="orp-leftfocal-guide">
          <div className="orp-leftfocal-line"></div>
          <div className="orp-leftfocal-marker"></div>
          <div className="orp-leftfocal-line"></div>
        </div>
        <div className="orp-container">
          <div className={"orp-wrap fw-bold "+textSize}>
            <span className="orp-left">{pre}</span>
            <span className="text-primary orp-middle">{point}</span>
            <span className="orp-right">{post}</span>
          </div>
        </div>
        <div className="orp-leftfocal-guide">
          <div className="orp-leftfocal-line"></div>
          <div className="orp-leftfocal-marker"></div>
          <div className="orp-leftfocal-line"></div>
        </div>
      </div>
    );
  } else {
    return (
      <p className={"fw-bold "+textSize}>
        {jumpTextRight?<span>&nbsp;&nbsp;&nbsp;</span>:<></>}
        {text}
      </p>
    );
  }
}
