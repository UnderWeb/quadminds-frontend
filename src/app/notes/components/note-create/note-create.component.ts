import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TitleCasePipe, LowerCasePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { moltenAnimation } from '../../../shared';

/**
 * Services.
 */
import { NoteService } from '../../services';

/**
 * Models.
 */
import { Note } from '../../models';

/**
 * Validators.
 */
import { TitleUniqueValidate } from '../../validators';

@Component({
    selector: 'app-note-create',
    templateUrl: './note-create.component.html',
    styleUrls: ['./note-create.component.scss'],
    animations: [moltenAnimation]
})
export class NoteCreateComponent {

    /**
     * Campos privados.
     */
    private note: Note;

    /**
     * Campos públicos.
     */
    public formCreate: FormGroup;

    /**
     * Constructor de la clase.
     * @param _noteService NoteService
     * @param _titleUniqueValidate TitleUniqueValidate
     * @param router Router
     * @param titleCasePipe: TitleCasePipe
     * @param lowerCasePipe: LowerCasePipe
     * @param formBuilder: FormBuilder
     */
    constructor(
        private _noteService: NoteService,
        private _titleUniqueValidate: TitleUniqueValidate,
        private router: Router,
        private titleCasePipe: TitleCasePipe,
        private lowerCasePipe: LowerCasePipe,
        public formBuilder: FormBuilder
    ) {
        this.note = new Note();
        this.getForm();
    }

    /**
     * Obtiene el título de la nota.
     */
    get title() {
        return this.formCreate.get('title');
    }

    /**
     * Construye el formulario de creación.
     */
    private getForm() {
        this.formCreate = this.formBuilder.group({
            'title': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
            'content': [null, Validators.compose([Validators.required, Validators.minLength(3)])]
        });
        this.handleFormChanges();
    }

    /**
     * Validaciones asíncronas de campos únicos.
     */
    handleFormChanges() {
        this.title.valueChanges.subscribe(
            title => {
                // Valida la existencia del título asíncronamente.
                if (title !== 'undefined' && title !== null) {
                    this.title.setAsyncValidators(this._titleUniqueValidate.titleValidator(this._noteService, null));
                }
            }
        );
    }

    /**
     * Determina si se ha pegado el valor del título para su validación.
     */
    public onTitlePaste() {
        this.title.setValue('');
    }

    /**
     * Ingresa una nueva nota.
     */
    onSubmit() {
        if (this.formCreate.valid) {
            const data = this.formCreate.getRawValue();
            this.formCreate.disable();
            this.createNote(data);
        }
    }

    /**
     * Crea una nueva nota.
     * @param data formCreate
     */
    private createNote(data: any): void {
        this.note.title = this.titleCasePipe.transform(this.lowerCasePipe.transform(data.title.trim()));
        this.note.content = data.content.trim();

        this._noteService.createNote(this.note).subscribe(
            response => {
                console.log(response);
                Swal.fire({
                    type: 'success',
                    text: 'Nota ingresada correctamente',
                    confirmButtonColor: '#1e88e5',
                    confirmButtonText: 'Aceptar',
                    allowEnterKey: false,
                    allowOutsideClick: false
                });
                this.router.navigate(['/notes']);
            },
            error => {
                console.log(error);
                Swal.fire({
                    type: 'error',
                    text: 'Error al ingresar la nota. Si el problema persiste, contacte a soporte',
                    confirmButtonColor: '#1e88e5',
                    confirmButtonText: 'Continuar',
                    allowEnterKey: false,
                    allowOutsideClick: false
                });
                this.router.navigate(['/notes']);
            }
        );
    }
}
