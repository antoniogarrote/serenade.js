##serenade.js

serenade.js is a small library implementing the abstractions described in ["Music for Geeks and Nerds"](http://musicforgeeksandnerds.com/) using JavaScript.

The library also makes it possible to actually generate sound from the coded musical notation using the W3C's incoming ["Web Audio API"](https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html) and the [Audiolet](https://github.com/oampo/Audiolet/) JS library wrapping it.

If you want to follow the chapters of the book, look at the comments in the source code of the library. Function definitions are grouped by chapter and a JS comment with the name of the chapter is at the beginning of each group.

A sample use of the library could be:

```js
var bpm = 90;
var tempoUnit = 1/4;
var midi = new serenade.Midi(bpm,tempoUnit);

var notes = "...";
var bassNotes = "...";

midi.seq_notes('melody', new serenade.NoteSeq(notes), serenade.Synth);
midi.seq_notes('bass', new serenade.NoteSeq(bassNotes), serenade.Bass);

midi.play(window.updateState);
```

Sequences of notes can be specified programmatically or using the string representation specified in the book for example:

```js
var notes = "Bb.''4 R4 |";
```

will be translated as a quarter note (4), dotted (.), B flat (Bb) in the 5th octave ('') and a rest (R) with a quarter note duration (4). The '|' will be ignored but can be used to delimit bars.

A demo JS app is available in the *test* folder including a small ruby sinatra app. Use bundler to install the dependencies and then *rackup* to start the server.