import { singleton } from 'tsyringe';

import { Ranking } from '../rankingBuilder';

import { BaseRepository } from './baseRepository';

const _moduleName = 'skills-rankings';

@singleton()
export class RankingsRepository extends BaseRepository<Ranking> {
    constructor() {
        super(_moduleName);
    }
}
