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

	return (
		<>
			<style>
				{`
					.rdrCalendarWrapper {
						display: block;
						padding: 0 16px;
						overflow: hidden;
					}
				`}
			</style>

			<Popover.Root
				open={openPopover}
				onOpenChange={(details) => setOpenPopover(details.open)}
			>
				<Popover.Trigger style={{ width: '100%' }}>
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
						position='relative'
						rounded='md'
						fontWeight='400'
						style={{
							border: openPopover ? '1px solid #000' : '',
							boxShadow: openPopover ? '0 0 0 1px #000' : 'none',
						}}
					>
						<Box>
							{selectedDate
								? format(parseISO(selectedDate), 'dd/MM/yyyy', { locale: es })
								: 'dd/mm/aaaa'}
						</Box>
						<Box
							roundedRight='md'
							style={{
								position: 'absolute',
								top: 0,
								right: 0,
								bottom: 0,
								padding: '0 11px',
								display: 'flex',
								alignItems: 'center',
								backgroundColor: '#F5F5F5',
								borderLeft: '1px solid #e4e4e7',
								color: openPopover ? '#000' : '#9A999D',
							}}
						>
							<FiCalendar style={{ width: '18px', height: '18px' }} />
						</Box>
					</Button>
				</Popover.Trigger>

				<Portal>
					<Popover.Positioner>
						<Popover.Content style={{ padding: 0, overflow: 'hidden', borderRadius: 20 }}>
							<Popover.Body style={{ padding: 0 }}>
								<Box
									// mt='-8'
									// ml={'-2'}
									// transform='scale(0.90)'
									// transformOrigin='top left'
								>
									<Calendar
										date={selectedDate ? parseISO(selectedDate) : new Date()}
										onChange={(date) => {
											onDateChange(date);
											setOpenPopover(false);
										}}
										locale={es}
										color='#711610'
										style={{ width: '100%' }}
									/>
								</Box>
							</Popover.Body>
							<Popover.CloseTrigger />
						</Popover.Content>
					</Popover.Positioner>
				</Portal>
			</Popover.Root>
		</>
	);
}

CustomDatePicker.propTypes = {
	selectedDate: PropTypes.string,
	onDateChange: PropTypes.func,
	buttonSize: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
