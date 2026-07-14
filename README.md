# Sadok

Online e-book reader

![screenshot](screenshot-sadok.png)

## Available modes

### Speed reading

Read the e-book using a speed reading mode: one word at a time on the center of the screen, more or less fast.

### Text-to-speech reading

Read the book using the [speech synthetisis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) API on the browser.
Beware of the speech synthetisis, there is no emotion, no change of rythm, no change of tone. It's not as cool as a real audio book read by a human.

### By-sentence reading

Read a e-book one sentence at a time.

## Document format supported

### ePub

Parses electronic books in ePub format using the library [foliate-js](https://github.com/johnfactotum/foliate-js), renders the html content and the images of the book.

### PDF

Parses the text content of PDF files using [PDF.js](https://mozilla.github.io/pdf.js/), renders only the text, not the style, nor the images.

### Text

Parses a text content

Copyright 2026 Nicolas Mora <mail@babelouest.org>

License: AGPL
