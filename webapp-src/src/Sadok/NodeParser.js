import React, { useState, useEffect } from 'react';

import SubNode from './SubNode';
import TextDisplayed from './TextDisplayed';
import ImageDisplayed from './ImageDisplayed';

export default function NodeParser({node, offset, book}) {
  switch (node.tag) {
    case "html":
    case "body":
      return (
        <SubNode node={node} offset={offset} book={book} />
      )
      break;
    case "p":
      return (
        <p className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </p>
      )
      break;
    case "div":
      return (
        <div className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </div>
      )
      break;
    case "span":
      return (
        <span className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </span>
      )
      break;
    case "h1":
      return (
        <h1 className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </h1>
      )
      break;
    case "h2":
      return (
        <h2 className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </h2>
      )
      break;
    case "h3":
      return (
        <h3 className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </h3>
      )
      break;
    case "h4":
      return (
        <h4 className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </h4>
      )
      break;
    case "h5":
      return (
        <h5 className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </h5>
      )
      break;
    case "h6":
      return (
        <h6 className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </h6>
      )
      break;
    case "i":
      return (
        <i className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </i>
      )
      break;
    case "strong":
      return (
        <strong className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </strong>
      )
      break;
    case "b":
      return (
        <b className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </b>
      )
      break;
    case "sup":
      return (
        <sup className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </sup>
      )
      break;
    case "em":
      return (
        <em className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </em>
      )
      break;
    case "aside":
      return (
        <aside className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </aside>
      )
      break;
    case "small":
      return (
        <small className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </small>
      )
      break;
    case "ul":
      return (
        <ul className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </ul>
      )
      break;
    case "li":
      return (
        <li className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </li>
      )
      break;
    case "a":
      if (node.href) {
        return (
          <a href={node.href} title={node.title} name={node.name} id={node.id} className={[node.classList, "link-opacity-50-hover"].join(" ")}>
            <SubNode node={node} offset={offset} book={book} />
          </a>
        )
      } else {
        return (
          <SubNode node={node} offset={offset} book={book} />
        )
      }
      break;
    case "img":
      return (
        <ImageDisplayed node={node} book={book} />
      )
      break;
    case "section":
      return (
        <section className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </section>
      )
      break;
    case "figure":
      return (
        <figure className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </figure>
      )
      break;
    case "figcaption":
      return (
        <figcaption className={node.classList}>
          <SubNode node={node} offset={offset} book={book} />
        </figcaption>
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
      return (
        <TextDisplayed text={node.text} coordStart={coordStart} coordEnd={coordEnd} book={book} />
      );
      break;
    case "#comment":
      break;
    case "link":
      break;
    case "meta":
      break;
    default:
      console.error("tag not found", node.tag, node);
      break;
  }
}
