export interface PotentialConfig {
    min: number;
    max: number;
}

const potentialConfig: PotentialConfig[] = [
    { min: 0.004, max: 0.048 }, // Terrible
    { min: 0.052, max: 0.096 }, // Very Bad
    { min: 0.1, max: 0.144 }, // Bad
    { min: 0.148, max: 0.192 }, // Low
    { min: 0.196, max: 0.24 }, // Passable
    { min: 0.244, max: 0.288 }, // Good
    { min: 0.292, max: 0.336 }, // Very Good
    { min: 0.34, max: 0.384 }, // Excellent
    { min: 0.388, max: 0.432 }, // Formidable
    { min: 0.436, max: 0.48 }, // World Class
];

export function getPotentialConfig(): PotentialConfig[] {
    return potentialConfig;
}
