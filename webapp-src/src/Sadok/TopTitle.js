import React, { useState, useEffect } from 'react';

export default function TopTitle({book, cbTogglePlay}) {
  let title = [];
  if (book?.metadata?.author?.name) {
    title.push(book?.metadata?.author?.name);
  }
  if (book?.metadata?.title) {
    title.push(book?.metadata?.title);
  }
  return (
    <div className="row elt-bottom book-title-row">
      <div className="col text-center">
        <h1>
          <span onClick={cbTogglePlay} id="sadok-title" className="book-title">{title.join(" - ")}</span>
        </h1>
      </div>
    </div>
  );
}
