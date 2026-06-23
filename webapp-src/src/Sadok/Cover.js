import React, { useState, useEffect } from 'react';

export default function Cover({coverData, opacity, showCover}) {
  if (showCover && coverData) {
    return (
      <div className="perfect-centering cover">
        <img src={coverData} className={"img-fluid opacity-"+opacity} />
      </div>
    );
  }
}
