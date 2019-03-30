import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
    selector: 'app-note-update',
    templateUrl: './note-update.component.html',
    styleUrls: ['./note-update.component.scss'],
    animations: [moltenAnimation]
})
export class NoteUpdateComponent implements OnInit {

    /**
     * Campos privados.
     */
    private id_note: string;
    private note: Note;

    /**
     * Campos públicos.
     */
    public formUpdate: FormGroup;

    /**
     * Constructor de la clase.
     * @param _noteService NoteService
     * @param _titleUniqueValidate TitleUniqueValidate
     * @param router Router
     * @param activatedRoute ActivatedRoute
     * @param titleCasePipe: TitleCasePipe
     * @param lowerCasePipe: LowerCasePipe
     * @param formBuilder: FormBuilder
     */
    constructor(
        private _noteService: NoteService,
        private _titleUniqueValidate: TitleUniqueValidate,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private titleCasePipe: TitleCasePipe,
        private lowerCasePipe: LowerCasePipe,
        public formBuilder: FormBuilder
    ) {
        this.note = new Note();
        this.getForm();
    }

    /**
     * Obtiene el id de la nota.
     */
    get id() {
        return this.formUpdate.get('id');
    }

    /**
     * Obtiene el título de la nota.
     */
    get title() {
        return this.formUpdate.get('title');
    }

    /**
     * Obtiene el contenido de la nota.
     */
    get content() {
        return this.formUpdate.get('content');
    }

    /**
     * Construye el formulario de actualización.
     */
    private getForm() {
        this.formUpdate = this.formBuilder.group({
            'id': [null],
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
                const id = this.formUpdate.get('id').value;
                if (title !== 'undefined' && title !== null) {
                    this.title.setAsyncValidators(this._titleUniqueValidate.titleValidator(this._noteService, id));
                }
            }
        );
    }

    /**
     * Método de inicio de la clase.
     */
    ngOnInit() {
        this.getNote();
    }

    /**
     * Determina si se ha pegado el valor del título para su validación.
     */
    public onTitlePaste() {
        this.title.setValue('');
    }

    /**
     * Obtiene los datos de una nota según su id.
     */
    private getNote() {
        this.activatedRoute.params.forEach((params: Params) =>  {
            if (!params['id']) {
                this.router.navigate(['/error404']);
            }

            this.id_note = params['id'];
            this._noteService.getNoteById(this.id_note).subscribe(
                (response: any) => {
                    if (!response.note) {
                        this.router.navigate(['/']);
                      } else {
                        this.note = response.note;
                        this.id.setValue(this.note._id);
                        this.title.setValue(this.note.title);
                        this.content.setValue(this.note.content);
                      }
                },
                error => {
                    console.log(<any>error);
                    this.router.navigate(['/error404']);
                }
            );
        });
    }

    /**
     * Modifica una nota específica.
     */
    onSubmit() {
        if (this.formUpdate.valid) {
            const data = this.formUpdate.getRawValue();
            this.formUpdate.disable();
            this.updateNote(data);
        }
    }

    /**
     * Actualiza una nota.
     * @param data formUpdate
     */
    private updateNote(data: any): void {
        const id = data.id;
        this.note.title = this.titleCasePipe.transform(this.lowerCasePipe.transform(data.title.trim()));
        this.note.content = data.content.trim();

        this._noteService.updateNote(id, this.note).subscribe(
            response => {
                Swal.fire({
                    type: 'success',
                    text: 'Nota modificada correctamente',
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
                    text: 'Error al modificar la nota. Si el problema persiste, contacte a soporte',
                    confirmButtonColor: '#1e88e5',
                    confirmButtonText: 'Aceptar',
                    allowEnterKey: false,
                    allowOutsideClick: false
                });
                this.router.navigate(['/notes']);
            }
        );
    }
}
