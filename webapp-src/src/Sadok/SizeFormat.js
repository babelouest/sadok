import React, { useState, useEffect } from 'react';

import i18next from 'i18next';

export default function SizeFormat({size}) {
  if (!isNaN(size)) {
    if (size > 1024*1024) {
      return (<>{i18next.t("size-mb", {val: Math.floor(100*size/(1024*1024))/100})}</>);
    } else if (size > 1024) {
      return (<>{i18next.t("size-kb", {val: Math.floor(100*size/(1024))/100})}</>);
    } else {
      return (<>{i18next.t("size-b", {val: Math.floor(100*size)/100})}</>);
    }
  } else {
    return <></>
  }
}
