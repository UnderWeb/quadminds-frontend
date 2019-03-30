import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import Swal from 'sweetalert2';
import { moltenAnimation } from '../../../shared';

/**
 * Services.
 */
import { NoteService } from '../../services';
import { getSpanishPaginatorIntl } from '../../../shared';

/**
 * Models.
 */
import { Note } from '../../models';

/**
 * Interfaces.
 */
import { NoteInterface } from '../../interfaces';

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
    animations: [moltenAnimation]
})
export class NoteComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    /**
     * Campos privados.
     */
    private query: Subscription;

    /**
     * Campos públicos
     */
    public notes: Array<Note>;
    public count: number;
    public dataSource: MatTableDataSource<Note>;
    public displayedColumns: Array<string>;

    /**
     * Constructor de la clase.
     * @param _noteService NoteService
     * @param breakpointObserver BreakpointObserver
     */
    constructor(private _noteService: NoteService, public breakpointObserver: BreakpointObserver) {
        this.count = 0;
        this.breakpointObserver.observe(['(max-width: 890px)']).subscribe(result => {
            this.displayedColumns = result.matches ? ['title', 'content', 'acciones'] : ['title', 'content', 'acciones'];
        });
    }

    /**
     * Método de inicio.
     */
    ngOnInit() {
        this.paginator._intl = getSpanishPaginatorIntl();
        this.getNotes();
    }

    /**
     * Obtiene las notas.
     * @return Listado de notas.
     */
    private getNotes() {
        this.query = this._noteService.getAllNotes().subscribe(
            (response: any) => {
                if (response.notes) {
                    this.notes = response.notes;
                    this.count = this.notes.length;
                    this.dataSource = new MatTableDataSource(this.notes);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            }, error => {
                console.log(<any>error);
            }
        );
    }

    /**
     * Elimina una nota.
     */
    public deleteNote(note: NoteInterface) : void {
        Swal.fire({
            html: "¿Está seguro que desea eliminar la siguiente nota?<br>" + note.title,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1e88e5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar',
            allowEnterKey: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                this._noteService.deleteNote(note._id).subscribe(
                    response => {
                        this.getNotes();
                        Swal.fire({
                            type: 'success',
                            text: 'Nota eliminada correctamente',
                            confirmButtonColor: '#1e88e5',
                            confirmButtonText: 'Aceptar',
                            allowEnterKey: false,
                            allowOutsideClick: false
                        })
                    },
                    error => {
                        console.log(<any>error);
                        Swal.fire({
                            type: 'error',
                            text: 'Error al eliminar la nota. Por favor, intente nuevamente',
                            confirmButtonColor: '#1e88e5',
                            confirmButtonText: 'Aceptar',
                            allowEnterKey: false,
                            allowOutsideClick: false
                        })
                    }
                );
            }
        });
    }

    /**
     * Search.
     */
    public applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    /**
     * Método destructor de la clase.
     */
    ngOnDestroy() {
        this.query.unsubscribe();
    }
}
