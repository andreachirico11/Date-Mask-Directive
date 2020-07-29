export type MaskConfigOptions = {
    dateConfiguration?: string,
    timeConfiguration?: string,
    dateSeparator?: Separators,
    timeSeparator?: Separators,
    dateTimeSeparator?: Separators,
    maxYear?: number,
    minYear?: number,
    circularArrowBehaviour?: boolean
}

export enum Separators {
    colon = ':',
    slash = '/',
    space = ' ',
    dash = '-',
    dot = '.'
}
