import { container, singleton } from 'tsyringe';

import { PlayersSkillsTableService } from './playersSkillsTable.service';
import {
    PageSettingsService,
    TeamPlayersSkillsSettingsService,
    TransferListSettingsService,
} from './playersSkillsViewSettings';
import { TeamPlayersSkillsTableService } from './teamPlayersSkillsTable.service';
import { TransferListSkillsTableService } from './transferListSkillsTable.service';

export type PlayersSkillsPages = 'transfer-list-skills' | 'team-players-list-skills';

export function getPlayersSkillsPageType(): PlayersSkillsPages | undefined {
    const url = location.href;
    if (url.indexOf('procurar.asp') > -1) {
        return 'transfer-list-skills';
    }
    if (url.indexOf('plantel.asp') > -1 && url.indexOf('filtro=1') > -1) {
        return 'team-players-list-skills';
    }
}

@singleton()
export class PlayersSkillsFactory {
    getPlayersSkillsTableService(): PlayersSkillsTableService {
        switch (getPlayersSkillsPageType()) {
            case 'transfer-list-skills':
                return container.resolve(TransferListSkillsTableService);
            case 'team-players-list-skills':
                return container.resolve(TeamPlayersSkillsTableService);
        }

        throw Error('Can not resolve PlayersSkillsTableService');
    }

    getPlayersSettingsService(): PageSettingsService {
        switch (getPlayersSkillsPageType()) {
            case 'transfer-list-skills':
                return container.resolve(TransferListSettingsService);
            case 'team-players-list-skills':
                return container.resolve(TeamPlayersSkillsSettingsService);
        }
        throw Error('Can not resolve PlayersSettingsService');
    }
}
