import { Routes } from '@angular/router';
import { AppBlankComponent } from './layouts';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'notes',
        pathMatch: 'full'
    },
    {
        path: '',
        component: AppBlankComponent,
        children: [
            {
                path: '',
                loadChildren: './notes/note.module#NoteModule'
            }
        ]
    }
];
