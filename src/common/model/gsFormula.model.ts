export interface GsFormula {
    main: number;
    secondary: number;
    tertiary: number;
    physical: number;
}

export const mainGsFormula: GsFormula = {
    main: 61.02,
    secondary: 20.34,
    physical: 15.25,
    tertiary: 1.13,
};

// TODO
export const tempGsFormula: GsFormula = {
    main: 60,
    secondary: 20,
    physical: 20,
    tertiary: 0,
};
