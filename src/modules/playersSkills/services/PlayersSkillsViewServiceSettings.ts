import { FuturePredicationSettings } from '@src/common/services/settings/futurePredication.settings';
import { RankingsSettings, TransferListSettings } from '@src/common/services/settings/settings';

export type PlayersSkillsViewServiceSettings = {
    rankingsSettings: RankingsSettings | undefined;
    futurePredicationSettings: FuturePredicationSettings | undefined;
    transferListSettings: TransferListSettings | undefined;
};
