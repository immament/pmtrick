import log from 'loglevel';
import { container } from 'tsyringe';

import { GsFormula, tempGsFormula } from '@src/common/model/gsFormula.model';
import { DataService } from '@src/common/services/data.service';
import { TacticEditorData } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';
import { AdvanceTacticTypes } from '@src/modules/tacticSummary/model/tacticStats.model';

// eslint-disable-next-line no-console
log.info('bootstrap +');
function logConfig(): void {
    log.setLevel('DEBUG');
    log.info('bootstrap - log level:', log.getLevel());
}

logConfig();

function registryDependencies(): void {
    container.registerInstance<GsFormula>('GsFormula', tempGsFormula);
    container.registerInstance('DataService<TacticEditorData>', new DataService<TacticEditorData>());
    container.registerInstance('DataService<AdvanceTacticTypes[]>', new DataService<AdvanceTacticTypes[]>([]));
}

registryDependencies();
