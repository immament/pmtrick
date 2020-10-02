import { StatsPositionKeys } from '@src/modules/tacticSummary/model/tacticStats.model';

import { Player } from '../../../common/model/player.model';

export interface TacticEditorPosition<T extends TacticEditorPlayer = TacticEditorPlayer> {
    position?: string;
    positionGroup?: StatsPositionKeys;
    id?: string;
    player?: T;
}

export interface TacticEditorData<T extends TacticEditorPlayer = TacticEditorPlayer> {
    positions: TacticEditorPosition<T>[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TacticEditorPlayer extends Player {}
