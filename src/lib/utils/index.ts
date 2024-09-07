import { Channeltype } from '@prisma/client';
import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Hash, Volume2 } from 'lucide-react';
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
  ddddMMYYYY = 'MMMM dd, yyyy',
}

export const getDateAsString = (
  date: Date,
  type: DateString = DateString.full
) => {
  return format(date, type, { locale: enUS });
};

export const getCustomDate = (date: Date) => {
  const today = new Date().getDay();
  const messageDay = date.getDay();

  if (today === messageDay) {
    return 'Today ' + format(date, DateString.time);
  } else if (today - messageDay === 1) {
    return 'Yesterday ' + format(date, DateString.time);
  } else {
    return format(date, DateString.short) + ' ' + format(date, DateString.time);
  }
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

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const iconMap = {
  [Channeltype.TEXT]: Hash,
  [Channeltype.AUDIO]: Volume2,
};

export const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
};
