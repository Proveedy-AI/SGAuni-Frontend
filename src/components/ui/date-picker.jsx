import { useState, useMemo } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import {
	subDays,
	addDays,
	startOfWeek,
	endOfWeek,
	startOfMonth,
	endOfMonth,
	subWeeks,
	subMonths,
} from 'date-fns';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import {
	PopoverRoot,
	PopoverTrigger,
	PopoverContent,
	PopoverArrow,
	PopoverBody,
	PopoverPositioner,
	Portal,
	Button,
	Box,
	HStack,
} from '@chakra-ui/react';
import { DateRangePicker, createStaticRanges } from 'react-date-range';

export const DatePicker = ({
	startDate,
	endDate,
	onDateChange,
	buttonSize = 'xs',
	buttonColor,
}) => {
	const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const [openPopover, setOpenPopover] = useState(false);
	const [daysToToday, setDaysToToday] = useState('');
	const [daysFromToday, setDaysFromToday] = useState('');

	// Convertir las fechas al formato correcto antes de mostrar
	const localStartDate = formatInTimeZone(
		new Date(startDate),
		userTimezone,
		"yyyy-MM-dd'T'00:00:00XXX"
	);
	const localEndDate = formatInTimeZone(
		new Date(endDate),
		userTimezone,
		"yyyy-MM-dd'T'23:59:59XXX"
	);

	const handleDateChange = (item) => {
		const formattedStartDate = formatInTimeZone(
			item.selection.startDate,
			userTimezone,
			"yyyy-MM-dd'T'00:00:00XXX"
		);
		const formattedEndDate = formatInTimeZone(
			item.selection.endDate,
			userTimezone,
			"yyyy-MM-dd'T'23:59:59XXX"
		);

		const updatedDateRange = {
			startDate: formattedStartDate,
			endDate: formattedEndDate,
		};

		onDateChange(updatedDateRange);
		localStorage.setItem(
			'opportunitiesFilters',
			JSON.stringify(updatedDateRange)
		);
	};

	// 📌 Rangos predefinidos
	const customStaticRanges = useMemo(
		() =>
			createStaticRanges([
				{
					label: 'Hoy',
					range: () => ({ startDate: new Date(), endDate: new Date() }),
				},
				{
					label: 'Ayer',
					range: () => ({
						startDate: subDays(new Date(), 1),
						endDate: subDays(new Date(), 1),
					}),
				},
				{
					label: 'Esta Semana',
					range: () => ({
						startDate: startOfWeek(new Date(), { weekStartsOn: 1 }),
						endDate: endOfWeek(new Date(), { weekStartsOn: 1 }),
					}),
				},
				{
					label: 'Semana Anterior',
					range: () => ({
						startDate: startOfWeek(subWeeks(new Date(), 1), {
							weekStartsOn: 1,
						}),
						endDate: endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 }),
					}),
				},
				{
					label: 'Últimos 7 Días',
					range: () => ({
						startDate: subDays(new Date(), 6),
						endDate: new Date(),
					}),
				},
				{
					label: 'Este Mes',
					range: () => ({
						startDate: startOfMonth(new Date()),
						endDate: endOfMonth(new Date()),
					}),
				},
				{
					label: 'Mes Anterior',
					range: () => ({
						startDate: startOfMonth(subMonths(new Date(), 1)),
						endDate: endOfMonth(subMonths(new Date(), 1)),
					}),
				},
				{
					label: 'Últimos 30 Días',
					range: () => ({
						startDate: subDays(new Date(), 29),
						endDate: new Date(),
					}),
				},
			]),
		[]
	);

	// 📌 Rangos de entrada personalizados
	const customInputRanges = useMemo(
		() => [
			{
				label: 'Días hasta hoy',
				key: 'daysToToday',
				range: (value) => {
					setDaysToToday(value);
					setDaysFromToday('-');

					const start = subDays(new Date(), value);
					const end = new Date();
					const formattedStart = formatInTimeZone(
						start,
						userTimezone,
						"yyyy-MM-dd'T'00:00:00XXX"
					);
					const formattedEnd = formatInTimeZone(
						end,
						userTimezone,
						"yyyy-MM-dd'T'23:59:59XXX"
					);

					const updatedDateRange = {
						startDate: formattedStart,
						endDate: formattedEnd,
					};

					onDateChange(updatedDateRange);
					localStorage.setItem(
						'opportunitiesFilters',
						JSON.stringify(updatedDateRange)
					);

					return updatedDateRange;
				},
				getCurrentValue: () =>
					daysToToday !== '' && daysToToday !== '-' ? `${daysToToday}` : '',
			},
			{
				label: 'Días desde hoy',
				key: 'daysFromToday',
				range: (value) => {
					setDaysFromToday(value);
					setDaysToToday('-');

					const start = new Date();
					const end = addDays(new Date(), value);
					const formattedStart = formatInTimeZone(
						start,
						userTimezone,
						"yyyy-MM-dd'T'00:00:00XXX"
					);
					const formattedEnd = formatInTimeZone(
						end,
						userTimezone,
						"yyyy-MM-dd'T'23:59:59XXX"
					);

					const updatedDateRange = {
						startDate: formattedStart,
						endDate: formattedEnd,
					};

					onDateChange(updatedDateRange);
					localStorage.setItem(
						'opportunitiesFilters',
						JSON.stringify(updatedDateRange)
					);

					return updatedDateRange;
				},
				getCurrentValue: () =>
					daysFromToday !== '' && daysFromToday !== '-'
						? `${daysFromToday}`
						: '',
			},
		],
		[onDateChange, daysToToday, daysFromToday]
	);

	return (
		<PopoverRoot
			open={openPopover}
			onOpenChange={(e) => setOpenPopover(e.open)}
		>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					bg='transparent'
					size={buttonSize}
					border='1px solid'
					borderColor={buttonColor}
					borderRadius='md'
					_focus={{ ring: 2, ringColor: 'blue.300' }}
					isActive={openPopover}
				>
					<Box color='uni.secondary' cursor='pointer'>
						<FiFilter />
					</Box>
					{startDate && endDate
						? `${format(new Date(localStartDate), 'PP')} - ${format(new Date(localEndDate), 'PP')}`
						: 'Seleccionar rango de fecha'}
					<FiChevronDown color='gray' />
				</Button>
			</PopoverTrigger>
			<Portal>
				<PopoverPositioner>
					<PopoverContent
						css={{
							'--popover-bg': {
								base: 'white',
								_dark: 'uni.gray.500',
							},
						}}
						position='relative'
						bg={{ base: 'white', _dark: 'uni.gray.500' }}
						w='auto'
						boxShadow='lg'
						borderRadius='md'
					>
						<PopoverArrow />
						<PopoverBody p='1'>
							<HStack>
								<DateRangePicker
									onChange={handleDateChange}
									showSelectionPreview
									moveRangeOnFirstSelection={false}
									months={2}
									ranges={[
										{
											startDate: new Date(localStartDate),
											endDate: new Date(localEndDate),
											key: 'selection',
										},
									]}
									locale={es}
									direction='horizontal'
									staticRanges={customStaticRanges}
									inputRanges={customInputRanges}
								/>
							</HStack>
						</PopoverBody>
					</PopoverContent>
				</PopoverPositioner>
			</Portal>
		</PopoverRoot>
	);
};
