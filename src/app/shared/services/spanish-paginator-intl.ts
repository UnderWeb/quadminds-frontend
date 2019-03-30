import { MatPaginatorIntl } from '@angular/material';

const spanishRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) {
        return 'Ningún registro encontrado';
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    // return `Mostrando ${startIndex + 1} de ${endIndex} de ${length} en total`;
    const TOTAL = (length === 1) ? 'registro encontrado' : 'registros encontrados';
    return `${length} ${TOTAL}`;
}

export function getSpanishPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = 'Registros por página:';
    paginatorIntl.nextPageLabel = 'Siguiente';
    paginatorIntl.previousPageLabel = 'Anterior';
    paginatorIntl.lastPageLabel = 'Última página';
    paginatorIntl.firstPageLabel = 'Primera página';
    paginatorIntl.getRangeLabel = spanishRangeLabel;
    return paginatorIntl;
}