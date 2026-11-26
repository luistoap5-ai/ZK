const app = {
    currentEarNote: null,

    init() {
        piano.init();
        this.buildPiano();
        this.setupNavigation();
        this.setupEarTraining();
        this.setupMIDI();

        document.getElementById("start-btn").addEventListener("click", () => {
            document.getElementById("loader").style.display = "none";
        });
    },

    buildPiano() {
        const container = document.getElementById("piano-container");
        const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        let html = "";
        for (let oct = 3; oct <= 4; oct++) {
            notes.forEach(note => {
                if (!note.includes("#")) {
                    html += `<div class="key" data-note="${note}${oct}" onmousedown="app.playKey('${note}${oct}')" onmouseup="app.releaseKey('${note}${oct}')"></div>`;
                }
            });
            notes.forEach(note => {
                if (note.includes("#")) {
                    html += `<div class="key black" data-note="${note}${oct}" style="left: calc(${notes.indexOf(note)/11 * 100}% - 30%)" onmousedown="app.playKey('${note}${oct}')" onmouseup="app.releaseKey('${note}${oct}')"></div>`;
                }
            });
        }
        container.innerHTML = html;
    },

    playKey(note) {
        piano.playNote(note, 0.8);
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) key.classList.add("active");
    },

    releaseKey(note) {
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) key.classList.remove("active");
    },

    setupNavigation() {
        document.querySelectorAll(".nav-item").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
                document.getElementById(`view-${item.getAttribute("data-view")}`).classList.add("active");
                document.getElementById("page-title").textContent = item.textContent.trim();
            });
        });
    },

    setupEarTraining() {
        const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
        const optionsContainer = document.getElementById("note-options");
        notes.forEach(note => {
            const btn = document.createElement("button");
            btn.className = "note-btn";
            btn.textContent = note.replace(/[0-9]/g, "");
            btn.onclick = () => this.checkEarAnswer(note);
            optionsContainer.appendChild(btn);
        });

        document.getElementById("play-ear-btn").addEventListener("click", () => {
            this.currentEarNote = notes[Math.floor(Math.random() * notes.length)];
            piano.playNote(this.currentEarNote, 0.8);
            document.getElementById("ear-feedback").textContent = "";
        });
    },

    checkEarAnswer(selectedNote) {
        const fb = document.getElementById("ear-feedback");
        if (selectedNote === this.currentEarNote) {
            fb.textContent = "✅ ¡Correcto!";
            fb.className = "feedback correct";
        } else {
            fb.textContent = "❌ Incorrecto. Escucha de nuevo.";
            fb.className = "feedback incorrect";
        }
    },

    playProgression() {
        const chords = ["C4", "E4", "G4", "C4", "E4", "G4", "A3", "C4", "E4", "F3", "A3", "C4"];
        chords.forEach((note, i) => {
            setTimeout(() => piano.playNote(note, 0.7), i * 500);
        });
    },

    setupMIDI() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(midiAccess => {
                document.getElementById("midi-status").textContent = "MIDI: Conectado";
                document.getElementById("midi-status").classList.add("connected");
                for (let input of midiAccess.inputs.values()) {
                    input.onmidimessage = (msg) => {
                        const command = msg.data[0];
                        const note = msg.data[1];
                        const velocity = msg.data.length > 2 ? msg.data[2] : 0;
                        const noteName = this.midiToNoteName(note);
                        if (command === 144 && velocity > 0) this.playKey(noteName);
                        else if (command === 128 || (command === 144 && velocity === 0)) this.releaseKey(noteName);
                    };
                }
            }).catch(() => {
                document.getElementById("midi-status").textContent = "MIDI: No disponible";
            });
        }
    },

    midiToNoteName(midi) {
        const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        return notes[midi % 12] + (Math.floor(midi / 12) - 1);
    },

    exportData() {
        alert("Función de exportación en desarrollo");
    },

    importData(input) {
        alert("Función de importación en desarrollo");
    }
};

document.addEventListener("DOMContentLoaded", () => app.init());