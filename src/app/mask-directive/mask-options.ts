export type MaskConfigOptions = {
    dateConfiguration?: string,
    timeConfiguration?: string,
    dateSeparator?: Separators,
    timeSeparator?: Separators,
    dateTimeSeparator?: Separators,
    maxYear?: number,
    minYear?: number,
    arrowBehaviours?: ArrowBehaviours,
    ifNoEntryUseActualDate?: boolean
}

export enum Separators {
    colon = ':',
    slash = '/',
    space = ' ',
    dash = '-',
    dot = '.'
}

export enum ArrowBehaviours {
    circular_without_position,
    circular_with_position_and_control,
    limited_with_control,
}