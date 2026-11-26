const app = { currentEarNote: null,
    init: async () => { await initAudio(); app.buildPiano(); app.setupNavigation(); app.setupEarTraining();
        document.getElementById("start-btn").addEventListener("click", () => { document.getElementById("loader").style.display = "none"; initMIDI(); });
        document.getElementById("record-btn").addEventListener("click", startRecording);
        document.getElementById("stop-record-btn").addEventListener("click", stopRecording);
    },
    buildPiano: () => { const container = document.getElementById("piano-container"); const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]; let html = "";
        for (let oct = 3; oct <= 4; oct++) {
            notes.forEach(note => { if (!note.includes("#")) html += `<div class="key" data-note="${note+oct}" onclick="playNote('${note+oct}')"></div>`; });
            notes.forEach(note => { if (note.includes("#")) html += `<div class="key black" data-note="${note+oct}" style="left: calc(${notes.indexOf(note)/11 * 100}% - 30%)" onclick="playNote('${note+oct}')"></div>`; });
        } container.innerHTML = html;
    },
    setupNavigation: () => { document.querySelectorAll(".nav-item").forEach(item => { item.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active")); item.classList.add("active");
        document.querySelectorAll(".view").forEach(v => v.classList.remove("active")); document.getElementById(`view-${item.getAttribute("data-view")}`).classList.add("active");
        document.getElementById("page-title").textContent = item.textContent.trim(); }); });
    },
    setupEarTraining: () => { const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
        notes.forEach(note => { const btn = document.createElement("button"); btn.className = "note-btn"; btn.textContent = note.replace(/[0-9]/g, ""); btn.onclick = () => app.checkEarAnswer(note); document.getElementById("note-options").appendChild(btn); });
        document.getElementById("play-ear-btn").addEventListener("click", () => { app.currentEarNote = notes[Math.floor(Math.random() * notes.length)]; playNote(app.currentEarNote, 0.8); document.getElementById("ear-feedback").textContent = ""; });
    },
    checkEarAnswer: (selectedNote) => { const fb = document.getElementById("ear-feedback");
        if (selectedNote === app.currentEarNote) { fb.textContent = "✅ ¡Correcto!"; fb.className = "feedback correct"; }
        else { fb.textContent = "❌ Incorrecto. Escucha de nuevo."; fb.className = "feedback incorrect"; }
    },
    playProgression: () => { const chords = ["C4", "E4", "G4", "C4", "E4", "G4", "A3", "C4", "E4", "F3", "A3", "C4"]; let time = Tone.now(); chords.forEach(note => { playNote(note, 0.7); time += 0.5; }); },
    saveCreation: async (title, url, type) => { const creations = await localforage.getItem("zk_creations") || []; creations.push({ title, url, type, date: new Date().toISOString() }); await localforage.setItem("zk_creations", creations); alert("Guardado en Biblioteca"); },
    exportData: async () => { const data = await localforage.getItem("zk_creations"); const blob = new Blob([JSON.stringify(data)], {type: "application/json"}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "zk_backup.json"; a.click(); },
    importData: (input) => { const file = input.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = async (e) => { await localforage.setItem("zk_creations", JSON.parse(e.target.result)); alert("Datos restaurados"); }; reader.readAsText(file); }
}; document.addEventListener("DOMContentLoaded", app.init); if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});