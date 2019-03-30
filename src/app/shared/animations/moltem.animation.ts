import { animate, style, transition, trigger } from '@angular/animations';

/**
 * Animación de fundido.
 */
export const moltenAnimation = trigger(
    'moltenAnimation', [
        transition(':enter', [
            style({
                opacity: 0
            }), 
            animate('500ms linear', 
            style({
                opacity: 1
            }))
        ])
    ]
);
