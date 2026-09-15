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

import SubNode from './SubNode';
import TextDisplayed from './TextDisplayed';
import ImageDisplayed from './ImageDisplayed';

export default function NodeParser({node, offset, offsetEnd, navToText, startOffset, classicReaderTextSize, book, bookProfile, cbSetOffset}) {
  switch (node.tag) {
    case "html":
    case "body":
    case "header":
    case "footer":
      return (
        <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
      )
      break;
    case "p":
      return (
        <p className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </p>
      )
      break;
    case "main":
      return (
        <main className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </main>
      )
      break;
    case "div":
      return (
        <div className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </div>
      )
      break;
    case "dd":
      return (
        <dd className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </dd>
      )
      break;
    case "dl":
      return (
        <dl className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </dl>
      )
      break;
    case "dt":
      return (
        <dt className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </dt>
      )
      break;
    case "span":
      return (
        <span className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </span>
      )
      break;
    case "abbr":
      return (
        <abbr className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </abbr>
      )
      break;
    case "bdi":
      return (
        <bdi className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </bdi>
      )
      break;
    case "bdo":
      return (
        <bdo className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </bdo>
      )
      break;
    case "cite":
      return (
        <cite className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </cite>
      )
      break;
    case "code":
      return (
        <code className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </code>
      )
      break;
    case "data":
      return (
        <data className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </data>
      )
      break;
    case "dfn":
      return (
        <dfn className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </dfn>
      )
      break;
    case "em":
      return (
        <em className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </em>
      )
      break;
    case "menu":
      return (
        <menu className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </menu>
      )
      break;
    case "h1":
      return (
        <h1 className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </h1>
      )
      break;
    case "h2":
      return (
        <h2 className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </h2>
      )
      break;
    case "h3":
      return (
        <h3 className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </h3>
      )
      break;
    case "h4":
      return (
        <h4 className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </h4>
      )
      break;
    case "h5":
      return (
        <h5 className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </h5>
      )
      break;
    case "h6":
      return (
        <h6 className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </h6>
      )
      break;
    case "hgroup":
      return (
        <hgroup className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </hgroup>
      )
      break;
    case "i":
      return (
        <i className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </i>
      )
      break;
    case "strong":
      return (
        <strong className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </strong>
      )
      break;
    case "b":
      return (
        <b className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </b>
      )
      break;
    case "sup":
      return (
        <sup className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </sup>
      )
      break;
    case "em":
      return (
        <em className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </em>
      )
      break;
    case "aside":
      return (
        <aside className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </aside>
      )
      break;
    case "small":
      return (
        <small className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </small>
      )
      break;
    case "ol":
      return (
        <ol className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </ol>
      )
      break;
    case "ul":
      return (
        <ul className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </ul>
      )
      break;
    case "li":
      return (
        <li className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </li>
      )
      break;
    case "a":
      if (node.href) {
        if (!node.href.startsWith(window.location.origin)) {
          return (
            <a href={node.href} title={node.title} name={node.name} id={node.id} className={[node.classList, "link-opacity-50-hover"].join(" ")}>
              <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
            </a>
          )
        } else {
          return (
            <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
          )
        }
      } else {
        return (
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        )
      }
      break;
    case "img":
      return (
        <ImageDisplayed node={node} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} startOffset={startOffset} />
      )
      break;
    case "section":
      return (
        <section className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </section>
      )
      break;
    case "figure":
      return (
        <figure className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </figure>
      )
      break;
    case "abbr":
      return (
        <abbr className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </abbr>
      )
      break;
    case "blockquote":
      return (
        <blockquote className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </blockquote>
      )
      break;
    case "q":
      return (
        <q className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </q>
      )
      break;
    case "sub":
      return (
        <sub className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </sub>
      )
      break;
    case "time":
      return (
        <time className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </time>
      )
      break;
    case "figcaption":
      return (
        <figcaption className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </figcaption>
      )
      break;
    case "table":
      return (
        <table className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </table>
      )
      break;
    case "thead":
      return (
        <thead className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </thead>
      )
      break;
    case "tbody":
      return (
        <tbody className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </tbody>
      )
      break;
    case "tfoot":
      return (
        <tfoot className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </tfoot>
      )
      break;
    case "th":
      return (
        <th className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </th>
      )
      break;
    case "tr":
      return (
        <tr className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </tr>
      )
      break;
    case "td":
      return (
        <td className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </td>
      )
      break;
    case "nav":
      return (
        <nav className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </nav>
      )
      break;
    case "pre":
      return (
        <pre className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </pre>
      )
      break;
    case "label":
      return (
        <label className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </label>
      )
      break;
    case "legend":
      return (
        <legend className={node.classList}>
          <SubNode node={node} offset={offset} offsetEnd={offsetEnd} navToText={navToText} startOffset={startOffset} cbSetOffset={cbSetOffset} book={book} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} />
        </legend>
      )
      break;
    case "br":
      return (
        <br/>
      )
      break;
    case "hr":
      return (
        <hr/>
      )
      break;
    case "#text":
      let coordStart = 0, coordEnd = 0;
      if (offset !== -1 && offset < node.tokens) {
        let coord = node.coord[offset];
        coordStart = coord.start;
        coordEnd = coord.end;
      }
      if (offsetEnd !== -1 && offsetEnd < node.tokens) {
        let coord = node.coord[offsetEnd];
        if (coord) {
          coordEnd = coord.end;
        }
      }
      return (
        <TextDisplayed text={node.text} coordStart={coordStart} coordEnd={coordEnd} navToText={navToText} startOffset={startOffset} bookProfile={bookProfile} classicReaderTextSize={classicReaderTextSize} cbSetOffset={cbSetOffset} />
      );
      break;
    case "#comment":
      break;
    case "link":
      break;
    case "meta":
      break;
    case "style":
      break;
    default:
      console.error("tag not found", node.tag, node);
      break;
  }
}
