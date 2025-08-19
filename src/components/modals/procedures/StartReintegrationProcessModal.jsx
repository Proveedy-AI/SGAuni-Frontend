import PropTypes from 'prop-types';
import { Button, Modal } from '@/components/ui';
import { Stack, Card, Text, Box, Flex, Icon } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { LuCircleAlert } from 'react-icons/lu';
import {
	FiAlertTriangle,
	FiInfo,
	FiCheckCircle,
	FiClock,
  FiX,
} from 'react-icons/fi';
import { useReadCurrentEnrollmentProgram } from '@/hooks/enrollments_programs';

export const StartReintegrationProcessModal = ({
	program,
	onStartEnrollment,
}) => {
  const contentRef = useRef();
	const [open, setOpen] = useState(false);
	const { data: dataEnrollmentDetails, isLoading } =
		useReadCurrentEnrollmentProgram(program.program_id, open);

  const isEligible = new Date() <= new Date(dataEnrollmentDetails?.data?.registration_end_date);

	return (
		<Modal
			placement='center'
			trigger={
				<Button
					bg='transparent'
					disabled={program.status === 5}
					color='blue.600'
					size='sm'
					_hover={{
						color: 'blue.800',
					}}
					ml={4}
				>
					Iniciar Proceso
				</Button>
			}
			open={open}
			onOpenChange={(e) => setOpen(e.open)}
			size='2xl'
      contentRef={contentRef}
			hiddenFooter={true}
		>
			<Stack
				gap={2}
				pb={6}
				maxH={{ base: 'full', md: '65vh' }}
				overflowY='auto'
				sx={{
					'&::-webkit-scrollbar': { width: '6px' },
					'&::-webkit-scrollbar-thumb': {
						background: 'gray.300',
						borderRadius: 'full',
					},
				}}
			>
				<Card.Root py={4}>
					<Card.Header>
						<Text fontSize='xl' fontWeight='semibold' textAlign={'center'}>
							Proceso de Reintegración/Reincorporación
						</Text>
					</Card.Header>
					<Card.Body spaceY={3}>
						<Text fontSize='sm' color='gray.600' textAlign={'justify'}>
							Estás a punto de iniciar el proceso de{' '}
							<strong>reintegración</strong> para el programa{' '}
							<strong>{program.program_name}</strong>.
						</Text>

						{/* Información importante sobre reintegración */}
						<Box
							borderRadius='md'
							p={4}
							mb={4}
							bg={'green.50'}
							border={'1px solid'}
							borderColor={'green.200'}
						>
							<Flex align='center' mb={2} gap={2} color={'green.700'}>
								<Icon as={FiInfo} boxSize={5} />
								<Text fontSize='sm' fontWeight='semibold'>
									¿Qué es la reintegración?
								</Text>
							</Flex>
							<Text fontSize='xs' color='green.700'>
								La reintegración te permite volver a incorporarte al programa
								después de haber postergado tu matrícula. El sistema evaluará si
								cumples las condiciones necesarias.
							</Text>
						</Box>

						<Box
							borderRadius='xl'
							p={{ base: 6, md: 8 }}
							mb={8}
							bg={'blue.100'}
						>
							<Flex
								align='center'
								mb={2}
								gap={2}
								color={'blue.600'}
								fontSize={16}
								fontWeight={'semibold'}
							>
								<Icon as={LuCircleAlert} boxSize={8} /> Proceso de Reintegración
							</Flex>
							<Stack as='ol' gap={2} pb={8}>
								<Text fontSize='sm' color='blue.900'>
									<strong>1.</strong> El sistema verificará si tienes deudas
									pendientes
								</Text>
								<Text fontSize='sm' color='blue.900'>
									<strong>2.</strong> Se evaluará si han pasado más de 5 años
									desde tu ingreso inicial
								</Text>
								<Text fontSize='sm' color='blue.900'>
									<strong>3.</strong> Si cumples los requisitos, podrás
									continuar con tu matrícula
								</Text>
								<Text fontSize='sm' color='blue.900'>
									<strong>4.</strong> Si no cumples, se te cambiará el estado
									según corresponda
								</Text>
							</Stack>

							{/* Condiciones del flujo de reintegración */}
							<Box
								borderRadius='md'
								p={3}
								mb={4}
								bg={'amber.50'}
								border={'1px solid'}
								borderColor={'amber.200'}
							>
								<Flex align='center' mb={2} gap={2} color={'amber.700'}>
									<Icon as={FiClock} boxSize={4} />
									<Text fontSize='xs' fontWeight='semibold'>
										Condiciones para reintegración exitosa
									</Text>
								</Flex>
								<Text fontSize='xs' color='amber.700'>
									• <strong>No tener deudas pendientes</strong> con la
									universidad
									<br />• <strong>No haber excedido los 5 años</strong> desde tu
									ingreso inicial
									<br />• Haber estado en estado de &quot;postergación&quot;
									previamente
								</Text>
							</Box>

							{/* Advertencias importantes */}
							<Box
								borderRadius='md'
								p={3}
								mb={4}
								bg={'red.50'}
								border={'1px solid'}
								borderColor={'red.200'}
							>
								<Flex align='center' mb={2} gap={2} color={'red.600'}>
									<Icon as={FiAlertTriangle} boxSize={4} />
									<Text fontSize='xs' fontWeight='semibold'>
										Posibles resultados si no cumples condiciones
									</Text>
								</Flex>
								<Text fontSize='xs' color='red.600'>
									• <strong>Con deudas:</strong> No podrás reintegrarte hasta
									saldar las deudas
									<br />• <strong>Más de 5 años:</strong> Serás separado
									permanentemente del programa
									<br />• <strong>Otras condiciones:</strong> Se evaluará caso
									por caso
								</Text>
							</Box>

							{/* Resultado exitoso */}
							<Box
								borderRadius='md'
								p={3}
								mb={4}
								bg={'green.50'}
								border={'1px solid'}
								borderColor={'green.200'}
							>
								<Flex align='center' mb={2} gap={2} color={'green.600'}>
									<Icon as={FiCheckCircle} boxSize={4} />
									<Text fontSize='xs' fontWeight='semibold'>
										Si la reintegración es exitosa
									</Text>
								</Flex>
								<Text fontSize='xs' color='green.600'>
									Tu estado cambiará y podrás proceder con el proceso normal de
									matrícula para continuar con tus estudios en el programa.
								</Text>
							</Box>

              {!isEligible && (
                <Box
                  borderRadius='md'
                  p={3}
                  mb={4}
                  bg={'red.50'}
                  border={'1px solid'}
                  borderColor={'red.200'}
                >
                  <Flex align='center' gap={2} color={'red.600'}>
									  <Icon as={FiX} boxSize={4} />
                    <Text fontSize='sm' color='red.600'>
                      El semestre ya no está disponible para reintegración.
                    </Text>
                  </Flex>
                </Box>
              )}

							<Flex justify={'end'}>
								<Button
									bg='#0661D8'
									_hover={{ bg: '#0550B8' }}
									onClick={() => {
										onStartEnrollment(dataEnrollmentDetails?.data);
										setOpen(false);
									}}
                  disabled={!isEligible}
                  loading={isLoading}
                  loadingText={'Cargando...'}
								>
									Continuar con reintegración
								</Button>
							</Flex>
						</Box>
					</Card.Body>
				</Card.Root>
			</Stack>
		</Modal>
	);
};

StartReintegrationProcessModal.propTypes = {
	program: PropTypes.object.isRequired,
	onStartEnrollment: PropTypes.func.isRequired,
};
