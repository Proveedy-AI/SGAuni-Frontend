import {
	differenceInYears,
	differenceInMonths,
	differenceInWeeks,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	isToday,
	isTomorrow,
	isYesterday,
	isBefore,
	differenceInSeconds,
} from 'date-fns';

export const useTimeDifference = (date, showExactTime = false) => {
	const now = new Date();
	const targetDate = new Date(date);

	if (isToday(targetDate) && !showExactTime)
		return { formattedTime: 'hoy', isFuture: false };
	if (isTomorrow(targetDate))
		return { formattedTime: 'mañana', isFuture: true };
	if (isYesterday(targetDate) && !showExactTime)
		return { formattedTime: 'ayer', isFuture: false };

	const isFuture = !isBefore(targetDate, now);
	let difference;
	let unit;

	if ((difference = differenceInYears(targetDate, now)) !== 0) {
		unit = Math.abs(difference) === 1 ? 'año' : 'años';
	} else if ((difference = differenceInMonths(targetDate, now)) !== 0) {
		unit = Math.abs(difference) === 1 ? 'mes' : 'meses';
	} else if ((difference = differenceInWeeks(targetDate, now)) !== 0) {
		unit = Math.abs(difference) === 1 ? 'semana' : 'semanas';
	} else if ((difference = differenceInDays(targetDate, now)) !== 0) {
		unit = Math.abs(difference) === 1 ? 'día' : 'días';
	} else if ((difference = differenceInHours(targetDate, now)) !== 0) {
		unit = Math.abs(difference) === 1 ? 'hora' : 'horas';
	} else if ((difference = differenceInMinutes(targetDate, now)) !== 0) {
		unit = Math.abs(difference) === 1 ? 'minuto' : 'minutos';
	} else {
		difference = differenceInSeconds(targetDate, now);
		unit = Math.abs(difference) === 1 ? 'segundo' : 'segundos';
	}

	return {
		formattedTime: `${Math.abs(difference)} ${unit}`,
		isFuture,
	};
};
