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
    cssStr += c.selector + "{\n";
    Object.keys(c.style).forEach(key => {
      cssStr += "  " + key + ": " + c.style[key] + ";\n";
    });
    cssStr += "}\n";
  });
  return cssStr;
};

export default function TextBackgroundStyle({useBookCss, styles}) {
  if (useBookCss) {
    return (
      <style>
        {stringifyCSS(parseCSS(styles.join("\n")))}
      </style>
    );
  }
}
