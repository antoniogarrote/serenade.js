if(typeof(exports) === 'undefined') {
    window.exports = {};
    window.serenade = window.exports;
}

(function() {
    /**
     * Web Audio API
     */ 

    if(typeof(window) !== 'undefined') {
	var audiolet = null;
	try {
	    audiolet = new Audiolet();
	} catch(e){
	    alert("W3C Web Audio API not supported by this browser");	    
	}
	exports.wave = function(frequency) {
	    new Sine(audiolet, frequency).connect(audiolet.output);
	};

	var Synth = function(audiolet, frequency, duration, attack, release) {
	    AudioletGroup.apply(this, [audiolet, 0, 1]);		

	    attack = attack || 0.4;
	    release = release || 0.1;

	    this.sine = new Sine(audiolet,frequency);

	    // modulator
	    this.modulator = new Square(this.audiolet, 2 * frequency);
	    this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);

	    // gain
	    this.gain = new Gain(this.audiolet);
	    attack = duration * attack;
	    release = duration * release;
	    this.envelope = new PercussiveEnvelope(this.audiolet, 1, attack, release,
						   function() {
						       this.audiolet.scheduler.addRelative(0,
											   this.remove.bind(this));
						   }.bind(this)
						  );

	    this.modulator.connect(this.modulatorMulAdd);
	    this.modulatorMulAdd.connect(this.sine);
	    this.envelope.connect(this.gain, 0, 1);
	    this.sine.connect(this.gain);


	    this.gain.connect(this.outputs[0]);
	};
	extend(Synth, AudioletGroup);

	var Bass = function(audiolet, frequency, duration, attack, release) {
	    AudioletGroup.apply(this, [audiolet, 0, 1]);		

	    attack = attack || 0.2;
	    release = release || 0.1;

	    this.sine = new Triangle(audiolet,frequency);

	    //// modulator
	    //this.modulator = new Square(this.audiolet, 2 * frequency);
	    //this.modulatorMulAdd = new MulAdd(this.audiolet, frequency / 2, frequency);

	    // gain
	    this.gain = new Gain(this.audiolet);
	    attack = duration * attack;
	    release = duration * release;
	    this.envelope = new PercussiveEnvelope(this.audiolet, 1, attack, release,
						   function() {
						       this.audiolet.scheduler.addRelative(0,
											   this.remove.bind(this));
						   }.bind(this)
						  );

	    //this.modulator.connect(this.modulatorMulAdd);
	    //this.modulatorMulAdd.connect(this.sine);
	    this.envelope.connect(this.gain, 0, 1);
	    this.sine.connect(this.gain);


	    this.gain.connect(this.outputs[0]);
	};
	extend(Bass, AudioletGroup);
	exports.Bass = Bass;

	var instrument = new Synth(audiolet,220, 2);
	exports.instrument = instrument;

    }

    /**
     * The primitives of music
     */

    var mod12 = function(n) {
	var note = n % 12;
	if(note < 0) 
	    return 12 + note;
	else
	    return note;
    };
    exports.mod12 = mod12;

    var divmod = function(a,b) {
	var remainder = a % b;
	var coc = Math.floor(a/b);
	return [coc, remainder];
    };

    exports.divmod = divmod;

    var note_names_array = "C C# D D# E F F# G G# A A# B".split(" ");
    var note_name = function(n) {
	return note_names_array[mod12(n)];
    };
    exports.note_name = note_name;


    var notes_names = function(notes) {
	var acum = [];
	for(var i=0; i<notes.length; i++)
	    acum.push(note_name(notes[i]));
	return acum;
    };
    exports.notes_names = notes_names;

    var accidentals = function(note) {
	var num_accidentals = note.length - 1;
	if(num_accidentals === 0)
	    return num_accidentals;
	else if(note.indexOf("#") !== -1)
	    return +num_accidentals;
	else
	    return -num_accidentals;
    };
    exports.accidentals = accidentals;


    var notes_pos = "C.D.EF.G.A.B";
    var name_to_number = function(note) {
	var note_name = note.substring(0,1).toUpperCase();
	var base = notes_pos.indexOf(note_name);
	return mod12(base + accidentals(note));
    };
    exports.name_to_number = name_to_number;


    // tempo = beats per minute
    // unity = note value of the beat
    var note_duration = function(note_value, unity, tempo) {
	return (60.0 * note_value) / (tempo * unity);
    };
    exports.note_duration = note_duration;

    var durations = function(note_values, unity, tempo) {
	var acum = [];
	for(var i=0; i<note_values; i++)
	    acum.push(note_duration(note_values[i], unity, tempo));
	return acum;
    };
    exports.durations = durations;


    var dotted_duration = function(duration, dots) {
	var ratio = 1/2;

	return duration * (1 - Math.pow(ratio, (dots + 1))) / ratio;
    };
    exports.dotted_duration = dotted_duration;


    var interval = function(notea,noteb) {
	return mod12(notea - noteb);
    };
    exports.interval = interval;

    var transposition = function(notes, index) {
	var acum = [];
	for(var i=0; i<notes.length; i++)
	    acum.push(mod12(notes[i]+index));
	return acum;
    };
    exports.transposition = transposition;

    var retrograde = function(notes) {
	return notes.reverse();
    };
    exports.retrograde = retrograde;

    var rotate = function(notes, n) {
	if(n == null)
	    n = 1;
	
	var modn = n % notes.length;
	if(modn < 0 )
	    modn = notes.length + modn;
	var remaining = [];
	for(var i=0; i<modn; i++)
	    remaining.push(notes.shift());
	return notes.concat(remaining);
    };
    exports.rotate = rotate;

    var inversion = function(notes, index) {
	if(index == null)
	    index = 0;
	if(notes.constructor === Array) {
	    var acum = [];
	    for(var i=0; i<notes.length; i++) {
		acum.push(mod12(index - notes[i]));
	    }
	    return acum;
	} else {
	    return mod12(index - notes);
	}
    };
    exports.inversion = inversion;

    /**
     * Rests and Notes as Python (JS :) Objects
     */

    // Base class empty so far
    var NotationObject = function() {
	this.dur = 0;
    };
    exports.NotationObject = NotationObject;

    NotationObject.prototype.stretch_dur = function(factor) {
	return new Rest(this.dur * factor);
    };


    // Rest object
    var Rest = function(duration) {
	NotationObject.call(this);
	this.dur = duration;
    };
    Rest.prototype = new NotationObject();
    Rest.prototype.constructor = Rest;
    exports.Rest = Rest;


    Rest.prototype.verbose = function() {
	return "R, <"+this.dur+">.";
    };

    Rest.prototype.duration = function(unity, tempo) {
	return note_duration(this.dur, unity, tempo);
    };


    Rest.prototype.play = function() { };

    // Note object
    var Note = function(value, octave, duration, volume) {
	NotationObject.call(this);
	if(value.constructor === String){
	    this.value = name_to_number(value);
	} else {
	    this.value = value;
	}

	this.octave = (octave != null ? octave : 4);
	this.dur = duration || 1/4;
	this.volume = volume || 100;
	this.isDotted = false;
    };
    Note.prototype = new NotationObject();
    Note.prototype.constructor = Note;
    exports.Note = Note;

    Note.prototype.midi_number = function() { 
	return this.value +  ( this.octave * 12); 
    };
    
    Note.prototype.verbose = function() {
	return "<"+this.value+"("+note_name(this.value)+")>, <"+this.octave+">, <"+this.dur+(this.isDotted ? "." : "")+">.";
    };

    Note.prototype.transposition = function(index) {
	var distance = divmod((this.midi_number() + index), 12);

	return note(distance[1], distance[0], this.dur, this.volume);
    };

    Note.prototype.freq = function() {
	var noteName = note_name(this.value);
	var freq = note_to_freq(noteName);
	var targetOctave = ((noteName.indexOf("A") !== -1 || noteName.indexOf("B") !== -1) ? 4 : 5);
	if(this.octave === targetOctave) {
	    return freq;
	} else if(this.octave < targetOctave) {
	    return freq / (Math.pow(2.0,(targetOctave - this.octave)));
	} else if(this.octave > targetOctave) {
	    return freq	 * Math.pow(2.0,(this.octave - targetOctave));
	}
    };

    Note.prototype.inversion = function(index, initial_octave) {
	if(index == null)
	    index = 0;

	if(initial_octave == null)
	    initial_octave = this.octave;

	var inverted = inversion(this.value);
	return note(inverted, initial_octave, this.dur, this.volume);
    };

    Note.prototype.duration = function(unity, tempo) {
	if(this.isDotted) {
	    return dotted_duration(note_duration(this.dur, unity, tempo), 1);
	} else {
	    return note_duration(this.dur, unity, tempo);
	}
    };

    Note.prototype.play = function(audiolet, unity, tempo, instrument, attack, release) {
	if(instrument == null)
	    instrument = Synth;
	var synth = new instrument(audiolet, 
				   this.freq(),
				   this.duration(unity, tempo),
				   attack,
				   release);
	synth.connect(audiolet.output);
    };

    // Chord object
    var Chord = function(notes, duration, volume) {
	NotationObject.call(this);
	if(notes.constructor === String){
	    var parts = notes.split(":");
	    var acum = [], noteTmp;
	    for(var i=0; i<parts.length; i++){
		noteTmp = note(parts[i]);
		noteTmp.dur = duration;
		noteTmp.volume = volume;
		acum.push(noteTmp);
	    }
	    this.value = acum;
	} else {
	    for(i=0; i<notes.length; i++) {
		notes[i].dur = duration;
		notes[i].volume = volume;
	    }
	    this.value = notes;
	}

	this.dur = duration || 1/4;
	this.volume = volume || 100;
    };
    Chord.prototype = new NotationObject();
    Chord.prototype.constructor = Chord;
    exports.Chord = Chord;

    Chord.prototype.midi_number = function() { 
	var acum = [];
	for(var i=0; i<this.value.length; i++)
	    acum.push(this.value[i].midi_number());
	return acum;
    };
    
    Chord.prototype.verbose = function() {
	var name = [];
	for(var i=0; i<this.value.length; i++)
	    name.push(this.value[i].verbose());

	return name.join(":");
    };

    Chord.prototype.transposition = function(index) {
	var acum = [];
	for(var i=0; i<this.value.length; i++) {
	    acum.push(this.value[i].transposition(index));
	}
	return new Chord(acum, this.dur, this.volume);
    };

    Chord.prototype.freq = function() {
	var acum = [];
	for(var i=0; i<this.value.length; i++)
	    acum.push(this.value[i].freq());
	return acum;
    };

    Chord.prototype.inversion = function(index, initial_octave) {
	var acum = [];
	for(var i=0; i<this.value.length; i++)
	    acum.push(this.value[i].inversion(index, initial_octave));
	return new Chord(acum, this.dur, this.volume);
    };

    Chord.prototype.duration = function(unity, tempo) {
	if(this.isDotted) {
	    return dotted_duration(note_duration(this.dur, unity, tempo), 1);
	} else {
	    return note_duration(this.dur, unity, tempo);
	}
    };

    Chord.prototype.play = function(audiolet, unity, tempo, instrument) {
	if(instrument == null)
	    instrument = Synth;

	for(var i=0; i<this.value.length; i++) {
	    var synth = new instrument(audiolet, 
				       this.value[i].freq(),
                                       this.duration(unity, tempo));
	    synth.connect(audiolet.output);
	}
    };

    // NoteSeq object
    var NoteSeq = function(notes) {
	Array.call(this);

	if(notes.constructor === String) {
	    notes = notes.replace(/\|/g,"");
	    notes = notes.split(/\s+/g);
	}

	var prevOctave = 4;
	var prevDuration = 1/4;

	var lastNote;

	var restre = /R([\d]*)/;
	var chordre = /(\d+)/;
	
	for(var i=0; i<notes.length; i++) {
	    if(notes[i].constructor === String) {
		if(notes[i].toUpperCase().indexOf("R") !== -1) {
		    // RESTS
		    var parts = restre.exec(notes[i].toUpperCase());
		    if(parts[1] != null && parts[1] !== '') {
			prevDuration = 1/parseInt(parts[1],10);
		    }

		    this.push(new Rest(prevDuration));
		} else if(notes[i].indexOf(":") !== -1) {
		    // CHORDS
		    parts = notes[i].split(chordre);
		    if(parts.length > 1) {
			prevDuration = 1/parseInt(parts[1],10);
		    }

		    this.push(new Chord(parts[0], prevDuration));
		} else {
		    // NOTES
		    lastNote = note(notes[i]);
		    this.push(lastNote);
		    if(notes[i].indexOf("'") === -1 && notes[i].indexOf(",") === -1)
		        lastNote.octave = prevOctave;
		    else
		        prevOctave = lastNote.octave;
		     
		    if(/\d/.test(notes[i])) {
		        prevDuration = lastNote.dur;
		    } else {
		        lastNote.dur = prevDuration;
		    }
		}
	    } else {
		this.push(notes[i]);
	    }
	}
    };
    NoteSeq.prototype = new Array();
    exports.NoteSeq = NoteSeq;

    NoteSeq.prototype.at = function(index) {
	return this[index];
    };

    NoteSeq.prototype.retrograde = function() {
	return new NoteSeq(this.reverse());
    };

    NoteSeq.prototype.transposition = function(index) {
	var acum = [];
	for(var i=0; i<this.length; i++) {
	    if(this[i].constructor === Rest) 
		acum.push(new Rest(this[i].dur));
	    else 
		acum.push(this[i].transposition(index));

	}
	return new NoteSeq(acum);
    };

    NoteSeq.prototype.transposition_starts_with = function(note) {
	var dst = note.midi_number();
	var src = this[0].midi_number();
	var distance = dst - src;
	return this.transposition(distance);
    };

    // utility function to build notes
    var numbers = "0123456789";

    var note = function(value, octave, duration, volume) {
	if(arguments.length === 1 && arguments[0].constructor === String) {
	    var noteString = "";
	    var durationString = "";
	    var quotes = 0;
	    var commas = 0;

	    for(var i=0; i<value.length; i++) {
		if(numbers.indexOf(value[i]) != -1)
		    durationString += value[i];
		else if(value[i] === "'")
		    quotes++;
		else if(value[i] === ",")
		    commas++;
		else
		    noteString += value[i];
	    }

	    if(quotes === 1 || quotes ===0)
		quotes = 0;
	    else
		quotes--;
	    
	    var isDotted = false;
	    if(noteString.indexOf(".") === noteString.length-1) {
		noteString = noteString.substring(0,noteString.length-1);
		isDotted = true;
	    }

	    var note = new Note(name_to_number(noteString),
				4 + quotes - commas,
				1 / parseInt(durationString,10));
	    if(isDotted) 
		note.isDotted = true; 

	    return note;
	} else {
	    return new Note(value, octave, duration, volume);
	}
    };
    exports.note = note;

    // MIDI object
    var Midi = function(tempo, unity) {
	this.tempo = tempo || 60;
	this.unity = unity || 1/4;
	this.tracks = {};
    };
    exports.Midi = Midi;

    
    Midi.prototype.seq_notes = function(trackName, notes, instrument, attack, release) {
	var durations = [];
	for(var i=0; i<notes.length; i++) {
	    durations.push(notes[i].duration(this.unity, this.tempo));
	}

	this.tracks[trackName] = {notes: notes, instrument: instrument, durations: durations, attack:attack, release:release};
    };


    Midi.prototype.play = function(cb) {
	var that = this;
	audiolet.scheduler.setTempo(this.tempo);
	for(var trackName in this.tracks) {
	    (function(tn) {
		audiolet.scheduler.play([new PSequence(that.tracks[tn].notes)], 
					new PSequence(that.tracks[tn].durations),
					function(notation) {					    
					    if(cb != null)
						cb(tn,notation);
					    notation.play(audiolet, that.unity, that.tempo, that.tracks[tn].instrument, that.tracks[tn].attack, that.tracks[tn].release);
					}.bind(that)
				       );	
		console.log("PLAYING "+tn);
	    })(trackName);
	}
    };

    Midi.prototype.stop = function() {
	var popped = audiolet.scheduler.queue.pop();
	while(popped!=null) {
	    popped = audiolet.scheduler.queue.pop();
	}
    };

    /**
     *  A Look Inside the Primitives
     */

    var SEMITONE = 1.059463;
    var NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

    var freq_to_note = function(freq) {
	var interval = Math.round(Math.log(freq/440.0)/Math.log(SEMITONE)) % 12;
	return NOTES[interval];
    };
    exports.freq_to_note = freq_to_note;

    var note_to_freq = function(note) {
	var index = -1;
	for(var i=0; i<NOTES.length; i++) {
	    if(NOTES[i] === note.toUpperCase()) {
		index = i;
		break;
	    }
	}
	
	return 440 * (Math.pow(SEMITONE, index));
    };
    exports.note_to_freq = note_to_freq;

})();