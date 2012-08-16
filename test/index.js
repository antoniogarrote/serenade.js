var serenade = require("./../src/index.js");

FREQS = {
    'C': {

	0: 16.351,
	1: 32.703,
	2:65.406,
	3:130.812,
	4:261.625,
	5:523.251,
	6:1046.502,
	7:2093.004,
	8:4186.008,
	9:8372.016,
	10:16744.032
    },
    'C#': {

	0:17.323,
	1:34.647,
	2:69.295,
	3:138.591,
	4:277.182,
	5:554.365,
	6:1108.730,
	7:2217.460,
	8:4434.920,
	9:8869.840
    },
    'D': {
    
	0:18.354,
	1:36.708,
	2:73.416,
	3:146.832,
	4:293.664,
	5:587.329,
	6:1174.059,
	7:2349.32,
	8:4698.636,
	9:9397.272
    },

    'D#': {

	0:19.445,
	1:38.890,
	2:77.781,
	3:155.563,
	4:311.126,
	5:622.253,
	6:1244.507,
	7:2489.014,
	8:4978.028,
	9:9956.056
    },	 	 
 
    'E': {

	0:20.601,
	1:41.203,
	2:82.406,
	3:164.813,
	4:329.627,
	5:659.255,
	6:1318.510,
	7:2637.020,
	8:5274.040,
	9:10548.080
    },

    'F': {

	0:21.826,
	1:43.653,
	2:87.307,
	3:174.614,
	4:349.228,
	5:698.456,
	6:1396.912,
	7:2793.824,
	8:5587.648,
	9:11175.26
    },

    'F#': {

	0:23.124,
	1:46.249,
	2:92.498,
	3:184.997,
	4:369.994,
	5:739.988,
	6:1479.976,
	7:2959.952,
	8:5919.904,
	9:11839.808
    },

    'G': {

	0:24.449,
	1:48.999,
	2:97.998,
	3:195.997,
	4:391.995,
	5:783.991,
	6:1567.982,
	7:3135.964,
	8:6270.928,
	9:12541.856
    },

 
    'G#': {

	0:25.956,
	1:51.913,
	2:103.826,
	3:207.652,
	4:415.304,
	5:830.609,
	6:1661.218,
	7:3322.436,
	8:6644.872,
	9:13289.744
    },

    'A': {

	0:27.500,
	1:55.000,
	2:110.000,
	3:220.000,
	4:440.000,
	5:880.000,
	6:1760.000,
	7:3520.000,
	8:7040.000,
	9:14080.000
    },
    'A#': {

	0:29.135,
	1:58.270,
	2:116.540,
	3:233.081,
	4:466.163,
	5:932.327,
	6:1864.66,
	7:3729.308,
	8:7458.616,
	9:14917.232
    },
    'B': {

	0:30.867,
	1:61.735,
	2:123.470,
	3:246.941,
	4:493.883,
	5:987.766,
	6:1975.532,
	7:3951.064,
	8:7902.128,
	9:15804.256
    }
};


exports.testMod12 = function(test) {
    test.ok(serenade.mod12(13) === 1);
    test.done();
};

exports.testDivMod = function(test) {
    var res = serenade.divmod(62,12);
    test.ok(res[0] === 5);
    test.ok(res[1] === 2);
    test.done();
};

exports.testNoteNames = function(test) {
    test.ok(serenade.note_name(0) === 'C');
    test.ok(serenade.note_name(1) === 'C#');
    test.ok(serenade.note_name(13) === 'C#');
    test.done();
};

exports.testAccidentals = function(test) {
    test.ok(serenade.accidentals("C##")===2);
    test.ok(serenade.accidentals("C")===0);
    test.ok(serenade.accidentals("Cbb")===-2);
    test.done();
};

exports.testnoteToNumber = function(test) {
    test.ok(serenade.name_to_number("C##")===2);
    test.ok(serenade.name_to_number("C")===0);
    test.ok(serenade.name_to_number("Cbb")===10);
    test.ok(serenade.name_to_number("Ebb")===2);
    test.done();
};

exports.testDottedDuration = function(test) {
    test.ok(serenade.dotted_duration(1/4,0) === 1/4);
    test.ok(serenade.dotted_duration(1/4,1) === 3/8);
    test.ok(serenade.dotted_duration(1/4,2) === 7/16);
    test.done();
};


exports.testInterval = function(test) {
    test.ok(serenade.interval(2,4) === 10);
    test.ok(serenade.interval(4,2) === 2);
    test.done();
};

exports.testTransposition = function(test) {
    var scale = [0, 2, 4, 6, 8, 10];
    var transposed = serenade.notes_names( serenade.transposition(scale,3) );
    test.ok(transposed.join(",") === "D#,F,G,A,B,C#");
    test.done();
};


exports.testRotate = function(test) {
    var scale = [0, 2, 4, 6, 8, 10];
    test.ok(serenade.rotate(scale,3), [6, 8, 10, 0, 2, 4]);
    test.done();
};

exports.testFreqToNote = function(test) {
    test.ok(serenade.freq_to_note(455) === 'A#');
    test.ok(serenade.note_to_freq("A#") === 466.16372);
    test.done();
};

exports.testFreqToNote2 = function(test) {
    var n;
    for(var note in FREQS) {
	for(var i=0; i<9; i++) {
	    n = new serenade.Note(serenade.name_to_number(note),i);
	    //console.log(note+" "+i+")"+Math.abs(n.freq() - FREQS[note][i]));
	    test.ok(Math.abs(n.freq() - FREQS[note][i]) < 1);
	}
    }
    test.done();
};


exports.testInvrsion = function(test) {
    var inverted = serenade.inversion([11,10,7]);
    test.ok(inverted[0] === 1);
    test.ok(inverted[1] === 2);
    test.ok(inverted[2] === 5);
    test.done();
};

exports.testRestObject = function(test) {
    var rest = new serenade.Rest(1/4);
    test.ok(rest.dur === 0.25);
    test.ok(rest.stretch_dur(2).dur === 0.25*2);
    test.done();
};


exports.testNoteCreation = function(test) {
    var note = serenade.note(0,5,1/4,127);
    test.ok(note.verbose() === "<0(C)>, <5>, <0.25>.");
    test.ok(note.midi_number() === 60);
    test.done();
};

exports.testNoteShorthand = function(test) {
    var note = serenade.note("C#4'");
    test.ok(note.value === serenade.name_to_number("C#"));
    test.ok(note.octave === 4);
    test.ok(note.dur === 1/4);
    test.ok(note.volume === 100);
    test.done();
};


exports.testTransposition = function(test) {
    var note = serenade.note("D");
    var transposed = note.transposition(3);

    test.ok(serenade.note_name(transposed.value) === "F");
    test.ok(transposed.octave === note.octave);

    transposed = note.transposition(12 + 3);
    test.ok(serenade.note_name(transposed.value) === "F");
    test.ok(transposed.octave === note.octave+1);

    test.done();
};


exports.testNoteInversion = function(test) {
    var note = serenade.note("D");
    var inverted = note.inversion();

    test.ok(serenade.note_name(inverted.value) === "A#");
    test.ok(inverted.octave === note.octave);

    test.done();
    
};

exports.testNoteFreqs = function(test) {
    test.ok(serenade.note("A'").freq() === 440);
    test.ok(serenade.note("A''").freq() === 2 * 440);
    test.ok(serenade.note("A'''").freq() === 2 * 2* 440);
    test.ok(serenade.note("A'").freq() === 440);
    test.ok(serenade.note("A,").freq() === 440 / 2);
    test.ok(serenade.note("A,,").freq() === 440 / (2 * 2));
    test.done();
};

exports.testNoteSeqCreation = function(test) {
    var notes = "C8 D R R8 E F";
    var seq = new serenade.NoteSeq(notes);
    test.ok(seq.length === 6);
    for(var i=0; i<seq.length; i++) {
	test.ok(seq[i].dur === 1/8);
    }
    test.done();
};


exports.testNoteSeqRetrograde = function(test) {
    var notes = "C C D";
    var seq = new serenade.NoteSeq(notes);
    var rev = seq.retrograde();
    test.ok(rev[0].value === 2);
    test.ok(rev[1].value === 0);
    test.ok(rev[2].value === 0);
    test.done();
};

exports.testNoteSeqTransposition = function(test) {
    var notes = "C4 D8 R E";
    var seq = new serenade.NoteSeq(notes);
    var transp = seq.transposition(3);
    for(var i=0; i<seq.length; i++) {
	if(seq[i].constructor !== serenade.Rest)
	    test.ok(seq[i].value === transp[i].value - 3);
    }

    test.done();
};

exports.testNoteSeqTranspositionStartsWith = function(test) {
    var notes = "C4 D8 R E";
    var seq = new serenade.NoteSeq(notes);
    var transp = seq.transposition_starts_with(serenade.note(3));
    for(var i=0; i<seq.length; i++) {
	if(seq[i].constructor !== serenade.Rest) {
	    test.ok(seq[i].value === transp[i].value - 3);
	}
    }

    test.done();
};