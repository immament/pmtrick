import { container } from 'tsyringe';

import { PlayersSkillsFactory } from '@src/modules/playersSkills/services/playersSkills.factory';
import { PlayersSkillsTableService } from '@src/modules/playersSkills/services/playersSkillsTable.service';
import {
    PageSettingsService,
    TransferListSettingsService,
} from '@src/modules/playersSkills/services/playersSkillsViewSettings';
import { TransferListSkillsTableService } from '@src/modules/playersSkills/services/transferListSkillsTable.service';

export class PlayersSkillsFactoryMock implements PlayersSkillsFactory {
    getPlayersSkillsTableService(): PlayersSkillsTableService {
        return container.resolve(TransferListSkillsTableService);
    }

    getPlayersSettingsService(): PageSettingsService {
        return container.resolve(TransferListSettingsService);
    }
}
