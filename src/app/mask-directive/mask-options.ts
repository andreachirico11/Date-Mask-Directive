export type MaskConfigOptions = {
    dateConfiguration?: string,
    timeConfiguration?: string,
    dateSeparator?: Separators,
    timeSeparator?: Separators,
    dateTimeSeparator?: Separators,
    maxYear?: number,
    minYear?: number
}

export enum Separators {
    colon = ':',
    slash = '/',
    space = ' ',
    dash = '-',
    dot = '.'
}
