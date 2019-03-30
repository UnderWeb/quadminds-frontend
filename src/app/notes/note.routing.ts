import { Routes } from '@angular/router';
import { NoteComponent, NoteCreateComponent, NoteUpdateComponent } from './components';

export const NoteRoutes: Routes = [
    {
        path: 'notes',
        children: [
            {
                path: '',
                component: NoteComponent
            },
            {
                path: 'create',
                component: NoteCreateComponent
            },
            {
                path: 'edit/:id',
                component: NoteUpdateComponent
            }
        ]
    }
];
