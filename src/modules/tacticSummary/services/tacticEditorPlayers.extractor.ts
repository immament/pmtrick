import { singleton } from 'tsyringe';

import { playerPositionValues, PlayerQuality } from '@src/common/model/player.model';
import { PlayerSkills } from '@src/common/model/playerSkills.model';
import { NumberKeys, SubType } from '@src/common/services/utils/utils';
import { TacticEditorPlayer, TacticEditorPosition } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';
import { StatsPositionKeys } from '@src/modules/tacticSummary/model/tacticStats.model';

type ExtractorFn = (acc: TacticEditorPlayer, element: Element) => void;

@singleton()
export class TacticEditorPlayersExtractor {
    private readonly playerAttrMap = new Map<string, ExtractorFn>([
        ['agil', this.skillExtractor('agility')],
        ['tecn', this.skillExtractor('technique')],
        ['posi', this.skillExtractor('positioning')],
        ['refl', this.skillExtractor('reflexes')],
        ['shps', this.skillExtractor('passing')],
        ['spee', this.skillExtractor('speed')],
        ['stam', this.skillExtractor('strength')],
        ['tack', this.skillExtractor('tackling')],
        ['head', this.skillExtractor('heading')],
        ['hand', this.skillExtractor('handling')],
        ['fini', this.skillExtractor('finishing')],
        ['outa', this.skillExtractor('outOfArea')],
        ['Name', this.stringExtractor('name')],
        ['age', this.numberExtractor('age')],

        ['exper', this.qualityExtractor('experience', this.mapTacticEditorExp.bind(this))],
        ['qual', this.qualityExtractor('quality', this.mapTacticEditorQuality.bind(this))],
        ['pot', this.qualityExtractor('potential', this.mapTacticEditorQuality.bind(this))],
        ['pen', this.qualityExtractor('penalties', this.mapTacticEditorQuality.bind(this))],

        ['fitn', this.numberExtractor('fitness')],
        ['value', this.numberExtractor('value')],
        ['wage', this.numberExtractor('wage')],
        ['pos', this.positionExtractor.bind(this)],
        // ['form', { name: 'form', type: 'number' }],
        // ['games', { name: 'games', type: 'number' }],
        // ['goals', { name: 'goals', type: 'number' }],
        // ['happ', { name: 'happines', type: 'number' }],
        // ['indisp', { name: 'unavailable', type: 'number' }],
        // ['moms', { name: 'moms', type: 'number' }],
        // ['nr', { name: 'nr', type: 'number' }],
        // ['talt', { name: 'talent', type: 'number' }],
        // ['assist', { name: 'assist', type: 'number' }],
        // ['avrat', { name: 'avarageRating', type: 'number' }],
        // ['contr', { name: 'contract', type: 'number' }],
        // ['coun', { name: 'country', type: 'number' }],
    ]);

    extractPositions(): TacticEditorPosition[] {
        const playerRowsElements = document.querySelectorAll<HTMLElement>('.player-row');
        const playerRows = Array.from(playerRowsElements);
        const result = this.extractPlayers(playerRows);
        return result;
    }

    private extractPlayer(row: Element): TacticEditorPlayer {
        const fields = row.querySelectorAll('.field-col');
        return Array.from(fields).reduce(
            (acc, field) => {
                const fieldName = Array.from(field.classList).find((f) => f != 'field_col');
                if (!fieldName) return acc;

                const extractor = this.getFieldExtractor(fieldName);
                if (!extractor) return acc;
                extractor(acc, field);
                return acc;
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { skills: {} } as any,
        ) as TacticEditorPlayer;
    }

    private getFieldExtractor(fieldName: string) {
        return this.playerAttrMap.get(fieldName);
    }

    private extractPlayers(playerRows: HTMLElement[]): TacticEditorPosition[] {
        return playerRows.map((row) => {
            const infoElem = row.querySelector('.player-info');
            const rowResult = {
                position: row.getAttribute('data-pos') || undefined,
                positionGroup: (row.getAttribute('data-posgroup') as StatsPositionKeys) || undefined,
                id: infoElem?.id,
                player: infoElem ? this.extractPlayer(infoElem) : undefined,
            };

            if (rowResult.player) {
                rowResult.player.id = Number(rowResult.id);
            }

            return rowResult;
        });
    }

    private getFieldValue(field: Element): string | undefined {
        return field.firstElementChild?.getAttribute('data-sortvalue') ?? undefined;
    }

    private getAttrValue(field: Element, attrName: string): string | undefined {
        return field.firstElementChild?.getAttribute(attrName) ?? undefined;
    }

    private getFieldContent(field: Element): string | undefined {
        return field.textContent?.trim();
    }

    private numberExtractor(name: NumberKeys<TacticEditorPlayer, number | undefined>): ExtractorFn {
        return (acc, element) => {
            if (name) acc[name] = Number(this.getFieldValue(element));
        };
    }

    private stringExtractor(
        name: keyof Omit<SubType<TacticEditorPlayer, string | undefined>, 'positionZone'>,
    ): ExtractorFn {
        return (acc, element) => {
            if (name) acc[name] = this.getFieldValue(element) ?? '';
        };
    }

    private skillExtractor(name: keyof PlayerSkills): ExtractorFn {
        return (acc, element) => {
            if (name) acc.skills[name] = Number(this.getFieldValue(element));
        };
    }

    // QUALIT

    qualities: { [x: number]: PlayerQuality } = {
        10: PlayerQuality.Terrible,
        20: PlayerQuality['Very Bad'],
        30: PlayerQuality.Bad,
        40: PlayerQuality.Low,
        50: PlayerQuality.Passable,
        60: PlayerQuality.Good,
        70: PlayerQuality['Very Good'],
        80: PlayerQuality.Excellent,
        90: PlayerQuality.Formidable,
        100: PlayerQuality['World Class'],
    };

    private mapTacticEditorQuality(value: number): PlayerQuality {
        return this.qualities[value];
    }

    // Experience

    experiences: { [x: number]: PlayerQuality } = {
        0: PlayerQuality.Terrible,
        11: PlayerQuality['Very Bad'],
        22: PlayerQuality.Bad,
        33: PlayerQuality.Low,
        44: PlayerQuality.Passable,
        55: PlayerQuality.Good,
        66: PlayerQuality['Very Good'],
        77: PlayerQuality.Excellent,
        88: PlayerQuality.Formidable,
        100: PlayerQuality['World Class'],
    };

    private mapTacticEditorExp(value: number): PlayerQuality {
        return this.experiences[value];
    }

    private qualityExtractor(
        name: NumberKeys<TacticEditorPlayer, PlayerQuality>,
        mapper: (value: number) => PlayerQuality,
    ): ExtractorFn {
        return (acc, element) => {
            if (!name) return;
            const qualityId = mapper(Number(this.getFieldValue(element)));
            acc[name] = qualityId;
            (acc[(name + 'Text') as keyof TacticEditorPlayer] as string) = this.getAttrValue(element, 'title') ?? '';
        };
    }

    private positionExtractor(acc: TacticEditorPlayer, element: Element): void {
        const positionId = playerPositionValues[Number(this.getFieldValue(element))];
        acc.positionZone = positionId;
        acc.position = this.getFieldContent(element) ?? '';
    }
}
