import { inject, singleton } from 'tsyringe';

import { DataService } from '@src/common/services/data.service';
import { TacticEditorData } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';
import { AdvanceTacticTypes } from '@src/modules/tacticSummary/model/tacticStats.model';

@singleton()
export class TacticDataService {
    constructor(
        @inject('DataService<TacticEditorData>') public positions: DataService<TacticEditorData>,
        @inject('DataService<AdvanceTacticTypes[]>') public ats: DataService<AdvanceTacticTypes[]>,
    ) {}
}
