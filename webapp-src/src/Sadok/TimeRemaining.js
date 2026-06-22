import React, { useState, useEffect } from 'react';
import i18next from 'i18next';

export default function TimeRemaining({offset, textSpeed, tokens, compact}) {
  let timeRemainingMin = 0, timeRemainingSec = 0, timeRemainingHour = 0, remainingJsx, remainingTxt = "";
  if (offset !== -1) {
    let remaining = (tokens - offset)/textSpeed;
    timeRemainingHour = Math.floor(remaining/60);
    timeRemainingMin = Math.floor(remaining%60);
    timeRemainingSec = Math.floor((remaining%1)*60);
    if (timeRemainingHour < 10) {
      timeRemainingHour = "0" + timeRemainingHour;
    }
    if (timeRemainingMin < 10) {
      timeRemainingMin = "0" + timeRemainingMin;
    }
    if (timeRemainingSec < 10) {
      timeRemainingSec = "0" + timeRemainingSec;
    }
    if (compact) {
      return (
      <>
        {i18next.t("time-remaining-compact", {h: timeRemainingHour, m: timeRemainingMin, s: timeRemainingSec})}
      </>
      )
    } else {
      return (
      <>
        {i18next.t("time-remaining-long", {h: timeRemainingHour, m: timeRemainingMin, s: timeRemainingSec})}
      </>
      )
    }
  }
  return (
    <>
      {remainingJsx}
    </>
  );
}
