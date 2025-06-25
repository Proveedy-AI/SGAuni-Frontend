import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Portal, Box, Popover } from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';
import Calendar from 'react-date-range/dist/components/Calendar'; // importante: import directo
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import PropTypes from 'prop-types';

export function CustomDatePicker({
	selectedDate,
	onDateChange,
	buttonSize = 'xs',
	size = { base: '330px', md: '470px' },
}) {
	const [openPopover, setOpenPopover] = useState(false);
	console.log(selectedDate);
	return (
		<Popover.Root
			open={openPopover}
			onOpenChange={(details) => setOpenPopover(details.open)}
		>
			<Popover.Trigger>
				<Button
					as='div'
					role='textbox'
					cursor='pointer'
					variant='outline'
					size={buttonSize}
					px={3}
					py={2}
					w='full'
					minW={size}
					justifyContent='space-between'
				>
					<Box>
						{selectedDate
							? format(parseISO(selectedDate), 'dd/MM/yyyy', { locale: es })
							: 'dd/mm/aaaa'}
					</Box>
					<Box>
						<FiCalendar />
					</Box>
				</Button>
			</Popover.Trigger>

			<Portal>
				<Popover.Positioner>
					<Popover.Content>
						<Popover.Body>
							<Box
								mt='-8'
								ml={'-2'}
								transform='scale(0.90)'
								transformOrigin='top left'
							>
								<Calendar
									date={selectedDate ? parseISO(selectedDate) : new Date()}
									onChange={(date) => {
										onDateChange(date);
									}}
									locale={es}
								/>
							</Box>
						</Popover.Body>
						<Popover.CloseTrigger />
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}

CustomDatePicker.propTypes = {
	selectedDate: PropTypes.string,
	onDateChange: PropTypes.fuc,
	buttonSize: PropTypes.string,
	size: PropTypes.string,
};
