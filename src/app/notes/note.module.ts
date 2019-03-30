import 'hammerjs';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared';
import { TitleCasePipe, LowerCasePipe } from '@angular/common';
import { NoteRoutes } from './note.routing';

/**
 * Services.
 */
import { NoteService } from './services';

/**
 * Components.
 */
import { NoteComponent, NoteCreateComponent, NoteUpdateComponent } from './components';

/**
 * Validators.
 */
import { TitleUniqueValidate } from './validators';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(NoteRoutes),
        FlexLayoutModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [],
    declarations: [
        NoteComponent,
        NoteCreateComponent,
        NoteUpdateComponent
    ],
    providers: [
        NoteService,
        TitleUniqueValidate,
        TitleCasePipe,
        LowerCasePipe
    ]
})
export class NoteModule { }
