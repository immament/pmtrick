import log from 'loglevel';
import { container } from 'tsyringe';

import { GsFormula, mainGsFormula } from '@src/common/model/gsFormula.model';
import { DataService } from '@src/common/services/data.service';
import { TacticEditorData } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';
import { AdvanceTacticTypes } from '@src/modules/tacticSummary/model/tacticStats.model';

function logConfig(): void {
    if (process.env.NODE_ENV !== 'production') {
        log.setLevel('DEBUG');
        log.info('bootstrap - DEV MODE - log level', log.getLevel());
    } else {
        log.setLevel('INFO');
    }
}

logConfig();

function registryDependencies(): void {
    container.registerInstance<GsFormula>('GsFormula', mainGsFormula);
    container.registerInstance('DataService<TacticEditorData>', new DataService<TacticEditorData>());
    container.registerInstance('DataService<AdvanceTacticTypes[]>', new DataService<AdvanceTacticTypes[]>([]));
}

registryDependencies();
