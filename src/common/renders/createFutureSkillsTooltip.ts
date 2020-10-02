import { FutureSkillsSummaryWithBest, playerPositionValues, SkillsSummaryWithBest } from '../model/player.model';

export const _options = {
    gsFractionDigits: 1,
};

const formatGs = (gs: number): string => gs.toFixed(_options.gsFractionDigits);

function summaryForSkills(summary: SkillsSummaryWithBest): string {
    return playerPositionValues.map((pos) => `${pos}: ${formatGs(summary[pos].gs)}`).join('\n');
}

export const createFutureSkillsTootip = (summary?: FutureSkillsSummaryWithBest): string => {
    if (!summary || !summary.options) {
        return '';
    }

    const options = summary.options;
    return `GS in age: ${options.futureAge} 
${summaryForSkills(summary)}
            
Calculated for:
    Current season matches:
      - League:  ${options.currentSeasonLeagueMatches} 
      - Friendly: ${options.currentSeasonFriendlyMatches}
    Full season matches:
      - League: ${options.fullSeasonLeagueMatches} 
      - Friendly: ${options.fullSeasonFriendlyMatches}`;
};
