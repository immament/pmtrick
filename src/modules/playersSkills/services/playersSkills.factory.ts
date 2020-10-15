import { container, singleton } from 'tsyringe';

import { CheckboxItem } from '@src/common/components/checkBoxOptions/checkboxItem.model';
import { _teamPlayersSkillsSettingsKey, _transferListSettingsKey } from '@src/common/services/settings/settings';

import { PlayersSkillsTableService } from './playersSkillsTable.service';
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

export interface PlayersSkillsViewSettings {
    hiddenColumns: string[];
}

export interface PageSettingsService {
    key: string;
    columnsConfig: CheckboxItem[];
}

@singleton()
export class TransferListSettingsService implements PageSettingsService {
    key = _transferListSettingsKey;
    columnsConfig: CheckboxItem[] = [
        { name: 'country', isChecked: true, label: 'Country' },
        { name: 'wage', isChecked: true, label: 'Wage' },
        { name: 'gs', isChecked: true, label: 'GS' },
        { name: 'gsFutureMin', isChecked: true, label: 'GS future min' },
        { name: 'gsFutureMax', isChecked: true, label: 'GS future max' },
    ];
}

@singleton()
export class TeamPlayersSkillsSettingsService implements PageSettingsService {
    key = _teamPlayersSkillsSettingsKey;
    columnsConfig: CheckboxItem[] = [
        { name: 'country', isChecked: true, label: 'Country' },
        { name: 'gs', isChecked: true, label: 'GS' },
    ];
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
