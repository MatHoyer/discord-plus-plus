import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum DateString {
  full = 'eeee dd MMMM yyyy HH:mm',
  short = 'dd/MM/yyyy',
  day = 'eeee',
  date = 'dd MMMM yyyy',
  lDate = 'dd MMMM',
  month = 'MMMM yyyy',
  year = 'yyyy',
  time = 'HH:mm',
}

export const getDateAsString = (date: Date, type: DateString = DateString.full) => {
  return format(date, type, { locale: fr });
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getShortServerName = (serverName: string) => {
  const formattedServerName = serverName.replace(/[' ]/g, '#');
  const parts = formattedServerName.split('#');
  return parts
    .filter((part) => !!part)
    .map((part) => part[0].toUpperCase())
    .slice(0, 3)
    .join('');
};
