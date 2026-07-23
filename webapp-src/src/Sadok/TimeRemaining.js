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
      if (timeRemainingHour > 0) {
        return (
          <>
            {i18next.t("time-remaining-compact", {h: timeRemainingHour, m: timeRemainingMin, s: timeRemainingSec})}
          </>
        );
      } else {
        return (
          <>
            {i18next.t("time-remaining-compact-no-h", {m: timeRemainingMin, s: timeRemainingSec})}
          </>
        );
      }
    } else {
      if (timeRemainingHour > 0) {
        return (
          <>
            {i18next.t("time-remaining-long", {h: timeRemainingHour, m: timeRemainingMin, s: timeRemainingSec})}
          </>
        )
      } else {
        return (
          <>
            {i18next.t("time-remaining-long-no-h", {m: timeRemainingMin, s: timeRemainingSec})}
          </>
        )
      }
    }
  }
  return (
    <>
      {remainingJsx}
    </>
  );
}
