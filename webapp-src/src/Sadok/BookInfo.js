import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

import TimeRemaining from './TimeRemaining';

export default function BookInfo({book, config}) {

  let yearJsx;
  if (book.metadata.year) {
    yearJsx = 
      <div className="mb-3 text-center">
        {(new Date(book.metadata.year)).getFullYear()}
      </div>
  }
  return (
    <>
      <div className="mb-3 text-center fs-2">
        {book?.metadata.title||""}
      </div>
      <div className="mb-3 text-center fw-bold">
        {book?.metadata.author?.name||""}
      </div>
      {yearJsx}
      <div className="mb-3 text-center fs-6 fst-italic">
        {i18next.t("word-length", {val: book?.metadata.tokens||0})} - <TimeRemaining offset={0} textSpeed={(+config.speedReaderTextSpeed)} tokens={book?.metadata.tokens||1} compact={true} />
      </div>
    </>
  );
}
