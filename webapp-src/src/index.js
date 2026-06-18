/**
 * 
 * Sadok e-book reader
 * 
 * Copyright 2026 Nicolas Mora <mail@babelouest.org>
 * 
 * License AGPL
 * 
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import i18next from 'i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import apiManager from './lib/APIManager.js';
import App from './Sadok/App';

try {
  i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    showSupportNotice: false,
    fallbackLng: 'en',
    backend: {
      loadPath: 'locales/{{lng}}/translations.json'
    }
  })
  .then(() => {
    createRoot(document.getElementById('root')).render(<App />);
  });
} catch (e) {
  $("#root").html('<div class="alert alert-danger" role="alert">' +
                    '<i class="fas fa-exclamation-triangle"></i>' +
                    '<span class="elt-right">You must use a browser compatible with Sadok</span>' +
                  '</div>');
}
