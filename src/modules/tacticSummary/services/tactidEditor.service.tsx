import log from 'loglevel';
import React from 'react';
import ReactDOM from 'react-dom';
import { singleton } from 'tsyringe';

import { injectFileScript } from '@src/common/services/utils/injectScript';
import { TacticSummary } from '@src/modules/tacticSummary/components/tacticSummary.component';
import { AtOptionsExtractor } from '@src/modules/tacticSummary/services/atOptions.extractor';
import { TacticDataService } from '@src/modules/tacticSummary/services/tacticData.service';
import { TacticEditorPlayersExtractor } from '@src/modules/tacticSummary/services/tacticEditorPlayers.extractor';

@singleton()
export class TacticEditorService {
    constructor(
        private readonly tacticEditorExtractor: TacticEditorPlayersExtractor,
        private readonly atOptionsExtractor: AtOptionsExtractor,
        private readonly tacticDataService: TacticDataService,
    ) {}

    run(): void {
        log.debug('TacticEditorService RUN ++++++++++++++++');
        this.addListeners();

        setTimeout(() => injectFileScript('/js/tacticEditor.js', document.body), 1000);
        this.append();
        // log.debug('.player-row main', document.querySelector('.player-row'));
    }

    private addListeners() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this;
        document.addEventListener('PMT_tacticSquadChanged', (e: CustomEvent) => {
            log.debug('PMT_tacticSquadChanged event:', e.detail);
            that.reloadPostitions();
        });

        document.addEventListener('PMT_tacticInit', (e: CustomEvent) => {
            log.debug('PMT_tacticInit event:', e.detail);
            this.reloadAtOptions();
            that.reloadPostitions();
        });

        document.addEventListener('PMT_advTacticChanged', (e: CustomEvent) => {
            log.debug('PMT_advTacticChanged  event', e.detail);
            this.reloadAtOptions();
        });
    }

    private reloadPostitions() {
        const positions = this.tacticEditorExtractor.extractPositions();
        this.tacticDataService.positions.newData({ positions });

        log.debug('reloadData result', positions);
    }

    private reloadAtOptions() {
        const ats = this.atOptionsExtractor.extract();
        this.tacticDataService.ats.newData(ats);
    }

    private append(): void {
        const containerElement = document.querySelector('.panel-body');
        if (containerElement) {
            const component = document.createElement('div');
            component.className = 'pmt-tactic-summary';
            component.id = 'pmt-tactic-summary';

            containerElement.appendChild(component);
            ReactDOM.render(<TacticSummary />, component);
        }
    }
}
