import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Note } from '../models';

@Injectable({
    providedIn: 'root'
})
export class NoteService {

    /**
     * Constructor de la clase.
     * @param http HttpClient
     */
    constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las notas.
     */
    getAllNotes() {
        return this.http.get(`${environment.apiBaseUrl}/notes`);
    }

    /**
     * Obtiene una nota específica.
     * @param id string
     */
    getNoteById(id: string) {
        return this.http.get(`${environment.apiBaseUrl}/notes/${id}`);
    }

    /**
     * Comprueba la existencia del título.
     * @param title string
     * @param id string
     */
    uniqueTitle(title: string, id?: string) {
        return this.http.get(`${environment.apiBaseUrl}/notes/title/${title}/${id}`);
    }

    /**
     * Registra una nueva nota.
     * @param nota Note
     */
    createNote(nota: Note) {
        return this.http.post(`${environment.apiBaseUrl}/notes`, nota);
    }

    /**
     * Actualiza una nota.
     * @param id string
     * @param nota Note
     */
    updateNote(id: string, nota: Note) {
        return this.http.put(`${environment.apiBaseUrl}/notes/${id}`, nota);
    }

    /**
     * Elimina una nota.
     * @param id string
     */
    deleteNote(id: string) {
        return this.http.delete(`${environment.apiBaseUrl}/notes/${id}`);
    }
}
