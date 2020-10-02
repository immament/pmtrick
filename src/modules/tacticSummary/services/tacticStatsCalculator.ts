import { injectable } from 'tsyringe';

@injectable()
export class TacticStatsCalculator<T extends { [x in keyof T]: number }> {}
