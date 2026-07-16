# Sadok

Online e-book reader

![screenshot](screenshot-sadok.png)

![animated demo](sadok-speed-read.gif)

You can test Sadok with the [online version](https://babelouest.github.io/sadok).

## Available modes

### Speed reading

Read the e-book using a speed reading mode: one word at a time on the center of the screen, more or less fast.

### Text-to-speech reading

Read the book using the [speech synthetisis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) API on the browser.
Beware of the speech synthetisis, there is no emotion, no change of rythm, no change of tone. It's not as cool as a real audio book read by a human.

### By-sentence reading

Read a e-book one sentence at a time.

## Save configuration, book read and position

The position of the reading and your configuration is saved either in the local storage of your browser, or in your remote profile if you use a profile server, the profile server isn't safe, so it must be used in a controlled environment like an intranet or a VPN.

## Document format supported

### ePub

Parses electronic books in ePub format using the library [foliate-js](https://github.com/johnfactotum/foliate-js), renders the html content and the images of the book.

### PDF

Parses the text content of PDF files using [PDF.js](https://mozilla.github.io/pdf.js/), renders only the text, not the style, nor the images.

### Text

Parses a text content

Copyright 2026 Nicolas Mora <mail@babelouest.org>

License: AGPL
