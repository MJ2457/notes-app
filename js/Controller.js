import AppController from "./AppController.js";
import UIController from "./UIController.js";



class controller {
    constructor() {
        this.UIController = new UIController();
        this.getData = JSON.parse(localStorage.getItem("noteData")) || [];
        this.setData = (data) => localStorage.setItem("noteData", JSON.stringify(data));
        this.openForm();
        this.createNoteData();
        this.createNoteUI();        
        this.deleteNote();
        this.editNote();
    }

    openForm() {
        const {newNote} = this.UIController;

        const openFormFn = (e) => {
            e.preventDefault();
            newNote.classList.add("active");

            window.addEventListener("click", (e) => {
                !e.target.closest(".new-note") && newNote.classList.remove("active");                
            });
        };
        newNote.addEventListener("click", openFormFn);
        newNote.addEventListener("contextmenu", openFormFn);
    }

    createNoteData() {
        const {newNote, noteFiles, noteTitle, noteText, noteBtn, createNoteHTML} = this.UIController;
        
        noteBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentDate = new Date().toLocaleDateString('en-GB');
            if(noteTitle.value.trim() !== "" && noteText.value.trim() !== "") {const note = new AppController(noteTitle.value, noteText.value, currentDate);

                this.getData.push(note);
                this.setData(this.getData);
                createNoteHTML(note, noteFiles);
                this.deleteNote();
                this.editNote();
    
                newNote.classList.remove("active");
                noteTitle.value = "";
                noteText.value = "";}            
        });

        noteText.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                noteBtn.click();                
            }
        });
    }

    createNoteUI() {
    const {createNoteHTML, noteFiles} = this.UIController;

    this.getData.forEach((noteData) => {
        createNoteHTML(noteData, noteFiles);
    });
}

    deleteNote() {
        const notes = this.UIController.notes();
        const deleteBtn = this.UIController.deleteBtn();
        const {noteFiles} = this.UIController;

        deleteBtn.forEach((btn, i) => {
            btn.onclick = () => {
                noteFiles.removeChild(notes[i]);
                this.getData.splice(i, 1);
                this.setData(this.getData);
            }
        });
    }

    editNote() {
        const notes = this.UIController.notes();
        
        notes.forEach((note, i) => {
            const noteTitle = note.querySelector(".title");
            const noteText = note.querySelector(".note-text");

            noteTitle.addEventListener("blur", () => {
                this.getData[i].title = noteTitle.textContent;
                this.setData(this.getData);
            });

            noteText.addEventListener("blur", () => {
                this.getData[i].note = noteText.textContent;
                this.setData(this.getData);
            });
        });
    }
}


export default controller;
