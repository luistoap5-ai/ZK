// MOTOR DE PIANO REALISTA - Web Audio API nativo
// Sintetiza un piano acústico usando múltiples armónicos y envolvente ADSR

class RealisticPiano {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
    }

    init() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.audioContext.destination);
    }

    // Frecuencias de notas (A4 = 440Hz)
    getFrequency(noteName) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const match = noteName.match(/^([A-G]#?)(\d)$/);
        if (!match) return 440;
        const note = match[1];
        const octave = parseInt(match[2]);
        const noteIndex = notes.indexOf(note);
        const midi = (octave + 1) * 12 + noteIndex;
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    playNote(noteName, velocity = 0.8) {
        if (!this.audioContext) this.init();
        if (this.audioContext.state === 'suspended') this.audioContext.resume();

        const freq = this.getFrequency(noteName);
        const now = this.audioContext.currentTime;
        const duration = 2.5;

        // Crear osciladores con armónicos de piano
        const oscillators = [];
        const gains = [];

        // Fundamental
        const osc1 = this.audioContext.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.value = freq;
        const gain1 = this.audioContext.createGain();
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(velocity * 0.5, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(velocity * 0.3, now + 0.1);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + duration);
        osc1.connect(gain1);
        gain1.connect(this.masterGain);
        osc1.start(now);
        osc1.stop(now + duration);
        oscillators.push(osc1);
        gains.push(gain1);

        // Segundo armónico (2x frecuencia)
        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = freq * 2;
        const gain2 = this.audioContext.createGain();
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(velocity * 0.3, now + 0.01);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.7);
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        osc2.start(now);
        osc2.stop(now + duration);
        oscillators.push(osc2);
        gains.push(gain2);

        // Tercer armónico (3x frecuencia)
        const osc3 = this.audioContext.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.value = freq * 3;
        const gain3 = this.audioContext.createGain();
        gain3.gain.setValueAtTime(0, now);
        gain3.gain.linearRampToValueAtTime(velocity * 0.15, now + 0.01);
        gain3.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.5);
        osc3.connect(gain3);
        gain3.connect(this.masterGain);
        osc3.start(now);
        osc3.stop(now + duration);
        oscillators.push(osc3);
        gains.push(gain3);

        // Cuarto armónico (4x frecuencia)
        const osc4 = this.audioContext.createOscillator();
        osc4.type = 'sine';
        osc4.frequency.value = freq * 4;
        const gain4 = this.audioContext.createGain();
        gain4.gain.setValueAtTime(0, now);
        gain4.gain.linearRampToValueAtTime(velocity * 0.08, now + 0.01);
        gain4.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.4);
        osc4.connect(gain4);
        gain4.connect(this.masterGain);
        osc4.start(now);
        osc4.stop(now + duration);
        oscillators.push(osc4);
        gains.push(gain4);

        return { oscillators, gains };
    }
}

const piano = new RealisticPiano();