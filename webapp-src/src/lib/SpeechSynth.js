
import { LS_SPEECH_LANG } from './Constants';

class SpeechSynth {
	constructor() {
    this.hasSpeechSynth = false;
    this.voiceList = [];
	}

  setSpeechSynthesis() {
    if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.populateVoiceList;
    }
    this.populateVoiceList();
  }

  populateVoiceList() {
    if (typeof speechSynthesis === "undefined") {
      return;
    }

    const voices = speechSynthesis.getVoices();

    let voiceList = [];
    for (let i = 0; i < voices.length; i++) {
      voiceList.push(
        {
          name: voices[i].name,
          lang: voices[i].lang,
          utterVoice: voices[i],
          default: voices[i].default
        }
      );
    }
    if (voiceList.length > 0) {
      voiceList.sort((a, b) => {
        const nameA = a.name.toUpperCase(); // ignore upper and lowercase
        const nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      this.voiceList = voiceList;
      this.hasSpeechSynth = true;
    }
  }

  setVoice(name) {
    let found = false;
    this.voiceList.forEach(curVoice => {
      if (name === curVoice.name) {
        curVoice.default = true;
        found = true;
      } else {
        curVoice.default = false;
      }
    });
    return found;
  }

  getVoice(preferredVoice = false) {
    let voice = false;
    if (preferredVoice) {
      this.voiceList.forEach(curVoice => {
        if (curVoice.name === preferredVoice) {
          voice = curVoice;
        }
      });
    } else {
      this.voiceList.forEach((curVoice, index) => {
        if (index === 0) {
          voice = curVoice;
        }
        if (curVoice.default) {
          voice = curVoice;
        }
      });
    }
    return voice;
  }

  speakText(textForSpeech, text, cb = false, preferredVoice = false, pitch = 1, rate = 1, offset = false, tokensLength = false) {
    let voice = this.getVoice(preferredVoice);
    if (voice) {
      const utterThis = new SpeechSynthesisUtterance();
      utterThis.voice = voice.utterVoice;
      utterThis.pitch = pitch;
      utterThis.rate = rate;
      utterThis.text = textForSpeech;
      utterThis.sadokTextForDisplay = text;
      if (cb) {
        utterThis.addEventListener('start', cb);
        utterThis.addEventListener('end', cb);
        utterThis.addEventListener('error', cb);
        utterThis.addEventListener('boundary', cb);
        utterThis.addEventListener('pause', cb);
        utterThis.addEventListener('resume', cb);
      }
      if (offset) {
        utterThis.offset = offset;
      }
      if (tokensLength) {
        utterThis.tokensLength = tokensLength;
      }
      speechSynthesis.speak(utterThis);
    } else {
      console.error("No voice bruh");
    }
  }

  stopText() {
    speechSynthesis.cancel();
  }
}

let speechSynth = new SpeechSynth();

export default speechSynth;
