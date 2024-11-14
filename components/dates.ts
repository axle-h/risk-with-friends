import {
    format,
} from "date-fns"
import { enGB } from 'date-fns/locale/en-GB'

export function formatDateTimeLong(date: Date) {
    return format(date, 'PPpp', { locale: enGB })
}

export function formatDateTimeShort(date: Date) {

    return format(date, 'PPpp', { locale: enGB })
}

export function formatDateLong(date: Date) {
    return format(date, 'PP', { locale: enGB })
}

export function formatDateShort(date: Date) {
    let formatStr: string
    if (date.getFullYear() === new Date().getFullYear()) {
        formatStr = 'dd MMM'
    } else {
        formatStr = 'dd MMM yy'
    }
    return format(date, formatStr + ' HH:mm', { locale: enGB })
}