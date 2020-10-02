export class ColorScale {
    private delta: number;
    private lightnessDelta: number;
    constructor(
        public readonly maxValue: number,
        public readonly minValue = 0,
        public readonly hue = 255,
        public readonly saturation = 100,
        public readonly maxLightness = 90,
        public readonly minLightness = 25,
    ) {
        this.delta = this.maxValue - this.minValue;
        this.lightnessDelta = this.maxLightness - this.minLightness;
    }

    // lightness between 25% and 90%
    getHslColor(value: number): string {
        const normalizedValue = Math.min(Math.max(0, value - this.minValue), this.maxValue);
        return `hsl(${this.hue}, ${this.saturation}%, ${
            this.maxLightness - (normalizedValue / this.delta) * this.lightnessDelta
        }%`;
    }
}
