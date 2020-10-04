import React from 'react';
import ReactDOM from 'react-dom';
import { injectable } from 'tsyringe';

import { ContentScriptService } from '@src/contentScript/contentServices/contentScript.service';
import { SkillsTablesOptionsButton } from '@src/modules/playersSkills/components/skillsTablesOptionsButton/skillsTablesOptionsButton.component';
import {
    getPlayersSkillsPageType,
    PlayersSkillsPages,
} from '@src/modules/playersSkills/services/playersSkillsTable.factory';
import { PlayersSkillsViewService } from '@src/modules/playersSkills/services/playersSkillsView.service';

@injectable()
export default class PlayersSkillsContentService implements ContentScriptService {
    name = 'PlayersSkills';
    constructor(private playersSkillsService: PlayersSkillsViewService) {}

    match(url: string): boolean {
        return (
            url.indexOf('procurar.asp') > -1 || // transfer list
            (url.indexOf('plantel.asp') > -1 && url.indexOf('filtro=1') > -1) // team player list - skills
        );
    }

    apply(): void {
        const pageType = getPlayersSkillsPageType();
        if (pageType) {
            this.appendSkillsTableOptions(pageType);
            this.playersSkillsService.run();
        }
    }

    private appendSkillsTableOptions(pageType: PlayersSkillsPages): void {
        const titleBar = document.querySelector('div.panel-primary3 div.panel-heading');

        if (titleBar) {
            titleBar.classList.add('pmt-flex', 'pmt-justify-space-between');
            const optionsBar = document.createElement('div');
            optionsBar.id = 'pmt-options-root';
            titleBar.appendChild(optionsBar);
            ReactDOM.render(<SkillsTablesOptionsButton pageType={pageType} />, optionsBar);
        }
    }
}
