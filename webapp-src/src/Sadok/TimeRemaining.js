import React, { useState, useEffect } from 'react';

export default function TimeRemaining({offset, textSpeed, tokens, compact}) {
  let timeRemainingMin = 0, timeRemainingSec = 0, timeRemainingHour = 0, remainingJsx, remainingTxt = "";
  if (offset !== -1) {
    let remaining = (tokens - offset)/textSpeed;
    timeRemainingHour = Math.floor(remaining/60);
    timeRemainingMin = Math.floor(remaining%60);
    timeRemainingSec = Math.floor((remaining%1)*60);
    if (timeRemainingHour > 0) {
      remainingTxt += (timeRemainingHour<10?"0":"") + timeRemainingHour + "h";
    }
    if (timeRemainingMin > 0 || timeRemainingHour > 0) {
      remainingTxt += (timeRemainingMin<10?"0":"") + timeRemainingMin + "m";
    }
    remainingTxt += (timeRemainingSec<10?"0":"") + timeRemainingSec + "s";
    if (compact) {
      remainingJsx = remainingTxt;
    } else {
      remainingJsx = " - " + remainingTxt + " restant";
    }
  }
  return (
    <>
      {remainingJsx}
    </>
  );
}
