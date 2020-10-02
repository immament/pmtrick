import { PlayerQuality } from '@src/common/model/player.model';

// TODO: support languages
const qalityValues = [
    'Terrible',
    'Very Bad',
    'Bad',
    'Low',
    'Passable',
    'Good',
    'Very Good',
    'Excellent',
    'Formidable',
    'World Class',
];

export function qualityToText(num: number | PlayerQuality): string {
    return qalityValues[num];
}

export function qualityToValue(text: string): number | undefined {
    const index = qalityValues.indexOf(text);

    return index >= 0 ? index : undefined;
}
