export type MaskConfigOptions = {
    dateConfiguration?: string,
    timeConfiguration?: string,
    dateSeparator?: Separators,
    timeSeparator?: Separators,
    dateTimeSeparator?: Separators,
    maxYear?: number,
    minYear?: number,
    arrowsBehaviour?: ArrowBehaviour
}

export enum Separators {
    colon = ':',
    slash = '/',
    space = ' ',
    dash = '-',
    dot = '.'
}

export enum ArrowBehaviour {
    circular_without_position,
    circular_with_position_and_control,
    limited_with_control,
}