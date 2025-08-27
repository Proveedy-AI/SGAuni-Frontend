import { Field, ModalSimple, Tooltip } from '@/components/ui';
import {
	Badge,
	Box,
	Flex,
	IconButton,
	SimpleGrid,
	Stack,
	Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { HiEye } from 'react-icons/hi2';

export const ViewModality = ({ item }) => {
	const [open, setOpen] = useState(false);

	return (
		<Stack css={{ '--field-label-width': '180px' }}>
			<Field orientation={{ base: 'vertical', sm: 'horizontal' }}>
				<ModalSimple
					trigger={
						<Box>
							<Tooltip
								content='Mas información'
								positioning={{ placement: 'bottom-center' }}
								showArrow
								openDelay={0}
							>
								<IconButton colorPalette='blue' size='xs'>
									<HiEye />
								</IconButton>
							</Tooltip>
						</Box>
					}
					title='Ver Modalidad'
					placement='center'
					size='xl'
					open={open}
					onOpenChange={(e) => setOpen(e.open)}
					onSave={() => {}}
					hiddenFooter={true}
				>
					<Stack spacing={4}>
						<Field label='Nombre'>
							<Text
								w='full'
								py={2}
								px={3}
								border='1px solid #E2E8F0'
								borderRadius='md'
							>
								{item.name}
							</Text>
						</Field>
						<Field label='descripcion'>
							<Text
								w='full'
								py={2}
								px={3}
								border='1px solid #E2E8F0'
								borderRadius='md'
							>
								{item.description}
							</Text>
						</Field>
						<Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
							<Field label='Activo'>
								<Badge bg={item.enabled ? 'green' : 'red'} color='white'>
									{item.enabled ? 'Sí' : 'No'}
								</Badge>
							</Field>
							<Field label='Requiere pre-maestría'>
								<Badge
									bg={item.requires_pre_master_exam ? 'green' : 'red'}
									color='white'
								>
									{item.requires_pre_master_exam ? 'Sí' : 'No'}
								</Badge>
							</Field>
						</Flex>
						<Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
							<Field label='Requiere entrevista'>
								<Badge
									bg={item.requires_interview ? 'green' : 'red'}
									color='white'
								>
									{item.requires_interview ? 'Sí' : 'No'}
								</Badge>
							</Field>
							<Field label='Requiere ensayo'>
								<Badge bg={item.requires_essay ? 'green' : 'red'} color='white'>
									{item.requires_essay ? 'Sí' : 'No'}
								</Badge>
							</Field>
						</Flex>

						<Flex gap={6} flexDir={{ base: 'column', sm: 'row' }}>
							{item.interview_weight > 0 && (
								<Field label='Peso entrevista'>
									<Text
										w='full'
										py={2}
										px={3}
										border='1px solid #E2E8F0'
										borderRadius='md'
									>
										{item.interview_weight * 100 || 0}%
									</Text>
								</Field>
							)}
						</Flex>
						{item.pre_master_min_grade && item.requires_pre_master_exam && (
							<Field label='Nota mínima aprobatoria pre-maestría (0 a 20)'>
								<Text
									w='full'
									py={2}
									px={3}
									border='1px solid #E2E8F0'
									borderRadius='md'
								>
									{item.pre_master_min_grade}
								</Text>
							</Field>
						)}

						<Box>
							{/* Reglas */}
							<Box>
								<Text fontSize='sm' fontWeight='medium' color='gray.600' mb={2}>
									Reglas
								</Text>
								<Box p={3} borderWidth='1px' borderRadius='md' bg='gray.50'>
									{item?.rules && item?.rules.length > 0 ? (
										<SimpleGrid columns={{ base: 1, md: 2 }} gap={2}>
											{item.rules
												.sort((a, b) => a.id - b.id) // ordenar por ID
												.map((rule) => (
													<Flex key={rule.id} align='center' color='gray.800'>
														
														<Text>
															{rule.id} - {rule.field_name}
														</Text>
													</Flex>
												))}
										</SimpleGrid>
									) : (
										<Text color='gray.500' fontStyle='italic'>
											Sin reglas específicas
										</Text>
									)}
								</Box>
							</Box>

							{/* Total de reglas */}
							<Box>
								<Text fontSize='sm' fontWeight='medium' color='gray.600' mt={2}>
									Total de reglas
								</Text>
								<Box
									borderWidth='1px'
									borderRadius='md'
									bg='gray.50'
									display='inline-block'
								>
									<Badge
										colorPalette='blue'
										fontSize='md'
										px={3}
										py={1}
										rounded='md'
									>
										{item?.total_rules || 0}
									</Badge>
								</Box>
							</Box>
						</Box>
					</Stack>
				</ModalSimple>
			</Field>
		</Stack>
	);
};

ViewModality.propTypes = {
	item: PropTypes.object,
};
