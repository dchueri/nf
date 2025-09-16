/**
 * Utility functions for date calculations, particularly for business days
 * Using Day.js for better date manipulation
 */

import * as dayjs from 'dayjs';

/**
 * Checks if a given date is a working day (Monday to Friday)
 * @param date - The date to check (Date object or Day.js object)
 * @returns true if it's a working day, false otherwise
 */
export function isWorkingDay(date: Date | dayjs.Dayjs): boolean {
  const dayjsDate = dayjs(date);
  const day = dayjsDate.day(); // 0 = Sunday, 6 = Saturday
  return day !== 0 && day !== 6;
}

/**
 * Gets the nth working day from the start of a month
 * @param year - The year
 * @param month - The month (0-11, where 0 = January)
 * @param days - Number of working days from start
 * @returns The date of the nth working day
 */
export function getNthWorkingDayFromStart(year: number, month: number, days: number): Date {
  let currentDate = dayjs().year(year).month(month).date(1);
  let workingDays = 0;

  while (workingDays < days) {
    if (isWorkingDay(currentDate)) {
      workingDays++;
    }
    if (workingDays < days) {
      currentDate = currentDate.add(1, 'day');
    }
  }

  return currentDate.toDate();
}

/**
 * Gets the nth working day from the end of a month
 * @param year - The year
 * @param month - The month (0-11, where 0 = January)
 * @param days - Number of working days from end
 * @returns The date of the nth working day from end
 */
export function getNthWorkingDayFromEnd(year: number, month: number, days: number): Date {
  // Get the last day of the month
  let currentDate = dayjs().year(year).month(month).endOf('month');
  let workingDays = 0;

  while (workingDays < days) {
    if (isWorkingDay(currentDate)) {
      workingDays++;
    }
    if (workingDays < days) {
      currentDate = currentDate.subtract(1, 'day');
    }
  }

  return currentDate.toDate();
}

/**
 * Calculates the deadline date based on strategy and settings
 * @param strategy - The deadline strategy ('fixed_day', 'start_month', 'end_month')
 * @param day - Day of month for fixed_day strategy
 * @param daysFromStart - Working days from start for start_month strategy
 * @param daysFromEnd - Working days from end for end_month strategy
 * @param year - Target year (defaults to current year)
 * @param month - Target month (0-11, defaults to current month)
 * @returns The calculated deadline date
 */
export function calculateDeadlineDate(
  strategy: 'fixed_day' | 'start_month' | 'end_month',
  day: number,
  daysFromStart: number,
  daysFromEnd: number,
  year?: number,
  month?: number
): Date {
  const now = dayjs();
  const targetYear = year ?? now.year();
  const targetMonth = month ?? now.month();

  switch (strategy) {
    case 'fixed_day':
      // Use the specified day of the month
      return dayjs().year(targetYear).month(targetMonth).date(day).toDate();

    case 'start_month':
      // Get the nth working day from the start of the month
      return getNthWorkingDayFromStart(targetYear, targetMonth, daysFromStart);

    case 'end_month':
      // Get the nth working day from the end of the month
      return getNthWorkingDayFromEnd(targetYear, targetMonth, daysFromEnd);

    default:
      // Fallback to fixed_day with day = 5
      return dayjs().year(targetYear).month(targetMonth).date(5).toDate();
  }
}
