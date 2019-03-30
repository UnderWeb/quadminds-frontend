import { AbstractControl } from '@angular/forms';
import { NoteService } from '../services';
import { map } from 'rxjs/operators';

export class TitleUniqueValidate {

    /**
     * Valida el registro único de la nota mediante su título.
     * @param _noteService NoteService
     * @param id string
     */
    titleValidator(_noteService: NoteService, id?: string) {
        return (control: AbstractControl) => {
            return _noteService.uniqueTitle(control.value, id).pipe(map(
                (response: any) => {
                    return response.valid ? { existsTitle: true } : null;
                }
            ));
        }
    }
}
