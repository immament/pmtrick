import { singleton } from 'tsyringe';

import { CheckboxItem } from '@src/common/components/checkBoxOptions/checkboxItem.model';
import { _teamPlayersSkillsSettingsKey, _transferListSettingsKey } from '@src/common/services/settings/settings';

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
