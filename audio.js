let pianoSampler = null, recorder = null, isRecording = false;
async function initAudio() {
    await Tone.start();
    const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).toDestination();
    // MOTOR DE PIANO REAL: Salamander Grand Piano Samples
    pianoSampler = new Tone.Sampler({
        urls: { "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3", "A4": "A4.mp3" },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => { document.getElementById("start-btn").disabled = false; document.getElementById("start-btn").textContent = "Iniciar ZK"; },
        onerror: () => { document.querySelector(".loader-content p").textContent = "Error: Conecta a internet para cargar el piano."; }
    }).connect(reverb);
}
function playNote(note, velocity = 0.8) {
    if (!pianoSampler) return;
    pianoSampler.triggerAttackRelease(note, "8n", Tone.now(), velocity);
}
function initRecorder() { recorder = new Tone.Recorder(); pianoSampler.connect(recorder); }
async function startRecording() { if (!recorder) initRecorder(); await recorder.start(); isRecording = true; document.getElementById("record-btn").classList.add("hidden"); document.getElementById("stop-record-btn").classList.remove("hidden"); }
async function stopRecording() { if (!recorder) return; const recording = await recorder.stop(); isRecording = false; document.getElementById("record-btn").classList.remove("hidden"); document.getElementById("stop-record-btn").classList.add("hidden"); app.saveCreation("Grabación Piano", URL.createObjectURL(recording), "wav"); }
function initMIDI() { if (navigator.requestMIDIAccess) navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure); }
function onMIDISuccess(midiAccess) { document.getElementById("midi-status").textContent = "MIDI: Conectado"; document.getElementById("midi-status").classList.add("connected"); for (let input of midiAccess.inputs.values()) input.onmidimessage = getMIDIMessage; }
function onMIDIFailure() { document.getElementById("midi-status").textContent = "MIDI: No permitido"; }
function getMIDIMessage(message) {
    let command = message.data[0], note = message.data[1], velocity = (message.data.length > 2) ? message.data[2] : 0;
    let noteName = midiToNoteName(note);
    if (command === 144 && velocity > 0) { playNote(noteName, velocity / 127); highlightKey(noteName); }
    else if (command === 128 || (command === 144 && velocity === 0)) { unhighlightKey(noteName); }
}
function midiToNoteName(midi) { const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; return notes[midi % 12] + (Math.floor(midi / 12) - 1); }
function highlightKey(n) { const k = document.querySelector(`[data-note="${n}"]`); if (k) k.classList.add("active"); }
function unhighlightKey(n) { const k = document.querySelector(`[data-note="${n}"]`); if (k) k.classList.remove("active"); }