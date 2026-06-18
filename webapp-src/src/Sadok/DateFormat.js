import React, { useState, useEffect } from 'react';

export default function DateFormat({date}) {
  try {
    let jsDate = (new Date(date)).toISOString().split("T");
    return (<>{jsDate[0]} {jsDate[1].substring(0, 8)}</>);
  } catch (err) {
    return (<></>);
  }
}
