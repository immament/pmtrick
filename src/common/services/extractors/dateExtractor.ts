import log from 'loglevel';

export class PmDate {
    constructor(text: string) {
        const [day, season] = text.split('/');
        this.day = Number(day);
        this.season = Number(season);
    }

    day: number;
    season: number;
}

export function extractDate(element: HTMLElement): PmDate | undefined {
    const dateElem = element.querySelector<HTMLTableCellElement>('#dateTime > table > tbody > tr > td:nth-child(2)');

    if (dateElem) {
        const matches = dateElem.textContent?.match(/\d+\/\d+/);
        if (matches?.length) {
            return new PmDate(matches[0]);
        }
    }

    return;
}
