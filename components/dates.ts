import {
    format,
} from "date-fns"
import { enGB } from 'date-fns/locale/en-GB'

export function formatDateTimeLong(date: Date) {
    return format(date, 'PPpp', { locale: enGB })
}

export function formatDateLong(date: Date) {
    return format(date, 'PP', { locale: enGB })
}

export function formatDateShort(date: Date) {
    return format(date, 'dd MMM yy', { locale: enGB })
}