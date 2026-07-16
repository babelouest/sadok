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

const parseCSS = (cssString, insertSelector) => {
  // Create a detached HTML document to avoid rendering overhead
  const doc = document.implementation.createHTMLDocument("");
  const style = document.createElement("style");
  
  style.textContent = cssString;
  doc.body.appendChild(style);
  
  // Extract parsed CSS rules from the stylesheet object
  const rules = style.sheet.cssRules;
  const result = [];

  for (let rule of rules) {
    if (rule.type === CSSRule.STYLE_RULE) {
      const styles = {};
      // Iterate through individual style declarations
      for (let i = 0; i < rule.style.length; i++) {
        const property = rule.style[i];
        styles[property] = rule.style.getPropertyValue(property);
      }
      result.push({
        selector: (insertSelector??"") + " " + rule.selectorText,
        style: styles
      });
    }
  }
  return result;
};

const stringifyCSS = (css) => {
  let cssStr = "";
  css.forEach(c => {
    if (!c.selector.includes("body")) {
      cssStr += c.selector + "{\n";
      Object.keys(c.style).forEach(key => {
        cssStr += "  " + key + ": " + c.style[key] + ";\n";
      });
      cssStr += "}\n";
    }
  });
  return cssStr;
};

export default function TextBackgroundStyle({useBookCss, styles}) {
  if (useBookCss) {
    return (
      <style>
        {stringifyCSS(parseCSS(styles.join("\n"), ".sadok-text-background"))}
      </style>
    );
  }
}
