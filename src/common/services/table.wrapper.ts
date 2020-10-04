import log from 'loglevel';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isHeader(obj: any): obj is Header {
    return obj.isHeader;
}

export class Table<T> {
    private _rows: DataRow<T>[] = [];
    get rows(): DataRow<T>[] {
        return this._rows;
    }

    private _headers: Header[] = [];
    public get headers(): Header[] {
        return this._headers;
    }

    public get htmlTable(): HTMLTableElement {
        return this._htmlTable;
    }

    constructor(private _htmlTable: HTMLTableElement) {}

    init(callback: (row: HTMLTableRowElement, index: string) => DataRow<T> | Header | undefined): void {
        log.info('Table.init - rows:', this._htmlTable.rows.length);

        for (const [index, htmlRow] of Object.entries(this._htmlTable.rows)) {
            const row = callback(htmlRow, index);

            if (row) {
                if (isHeader(row)) {
                    this.headers.push(row);
                    continue;
                }

                this._rows.push(row);
                htmlRow.id = row.id;
            }
        }
    }
}

export class HeaderCell {
    constructor(public name: string) {}
}

export class Cell {
    constructor(public htmlCell: HTMLTableDataCellElement) {}
}

export class Row {
    isHeader?: boolean;

    private extraCells: Cell[] = [];

    constructor(private htmlRow: HTMLTableRowElement) {}

    applyCells(cells: Cell[]): void {
        this.removeExtraHtmlCells();
        this.extraCells = [];
        this.extraCells.push(...cells);

        for (const cell of cells) {
            this.htmlRow.appendChild(cell.htmlCell);
        }
    }

    private removeExtraHtmlCells(): void {
        for (const cell of this.extraCells) {
            cell.htmlCell.remove();
        }
        this.extraCells = [];
    }

    applyHtmlCells(htmlCells: HTMLTableCellElement[]): void {
        this.removeExtraHtmlCells();
        for (const htmlCell of htmlCells) {
            this.htmlRow.appendChild(htmlCell);
            const cell = new Cell(htmlCell);
            this.extraCells.push(cell);
        }
    }
}
export class DataRow<T> extends Row {
    constructor(public data: T, public id: string, htmlRow: HTMLTableRowElement) {
        super(htmlRow);
    }
}

export class Header extends Row {
    isHeader = true;
    constructor(private htmlHeaderRow: HTMLTableRowElement) {
        super(htmlHeaderRow);
    }
}
