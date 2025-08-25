import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { useReadPrograms } from '@/hooks';
import {
	Box,
	Text,
	Flex,
	Heading,
	Card,
	Badge,
	Table,
	HStack,
	Group,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import {
	AddTransferRequestModal,
	PreviewDocumentRequestModal,
} from '@/components/modals/procedures';
import { useReadMyTransferRequest } from '@/hooks/transfer_requests';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

export const MyInternalTransferProcessView = () => {
	const { data: dataUserLogged, isLoading: isLoadingUserLogged } =
		useReadUserLogged();
	const { data: dataMyRequests, isLoading: isLoadingMyRequests } = useReadMyTransferRequest();
	console.log('my-requests', dataMyRequests);

	//1: Borrador, 2: En revisión, 3: Rechazado, 4: Aprobado, 5: Completado

	const isEjecutable = !isLoadingMyRequests && !dataMyRequests?.some((req) => req.status === 1);

  const myPrograms = dataUserLogged?.student?.admission_programs || [];
  const myFilteredPrograms = myPrograms.filter(p => p.academic_status === 1);

	const { data: dataPrograms } = useReadPrograms();

	const statusColor = [
		{ id: 1, bg: 'gray.200', color: 'gray.800' },
		{ id: 2, bg: 'gray.200', color: 'gray.800' },
		{ id: 3, bg: 'red.200', color: 'red.600' },
		{ id: 4, bg: 'green.200', color: 'green.600' },
		{ id: 5, bg: 'blue.200', color: 'blue.600' },
	];

	const getStatusBg = (status) =>
		status ? statusColor.find((color) => color.id === status)?.bg : 'gray.200';
	const getStatusColor = (status) =>
		status
			? statusColor.find((color) => color.id === status)?.color
			: 'gray.800';

	// const formatDate = (dateString) => {
	// 	return new Date(dateString).toLocaleDateString('es-ES', {
	// 		year: 'numeric',
	// 		month: 'short',
	// 		day: 'numeric',
	// 	});
	// };

	return (
		<Box spaceY='5' p={{ base: 4, md: 6 }} maxW='8xl' mx='auto'>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Trámites', to: '/myprocedures' },
					{ label: 'Proceso de traslado interno' },
				]}
			/>

			{/* Header */}
			<Flex justify='space-between' align='center' mb={6}>
				<Heading size='lg' color='gray.800'>
					Mis Solicitudes de Traslado
				</Heading>
				<AddTransferRequestModal
          user={dataUserLogged}
          available={isEjecutable}
          loading={isLoadingUserLogged}
          dataMyPrograms={myFilteredPrograms}
          dataPrograms={dataPrograms}
        />
			</Flex>

			{/* Información de estado */}
			{!isEjecutable && (
				<Card.Root mb={6}>
					<Card.Body>
						<HStack spacing={3}>
							<Box p={2} bg='blue.50' borderRadius='md'>
								<FiFileText color='blue.500' size={20} />
							</Box>
							<Box>
								<Text fontSize='sm' fontWeight='medium' color='blue.700'>
									Solicitud en proceso
								</Text>
								<Text fontSize='xs' color='blue.600'>
									Tienes una solicitud pendiente de revisión. No puedes enviar
									nuevas solicitudes hasta que se resuelva.
								</Text>
							</Box>
						</HStack>
					</Card.Body>
				</Card.Root>
			)}

			{/* Tabla de solicitudes */}
			<Card.Root>
				<Card.Header>
					<Card.Title>
						Historial de Solicitudes ({dataMyRequests?.length})
					</Card.Title>
				</Card.Header>
				<Card.Body p={0}>
					{dataMyRequests?.length === 0 ? (
						<Box p={8} textAlign='center'>
							<FiFileText
								size={48}
								color='gray.400'
								style={{ margin: '0 auto 16px' }}
							/>
							<Text fontSize='lg' fontWeight='medium' color='gray.600' mb={2}>
								No tienes solicitudes de traslado
							</Text>
							<Text fontSize='sm' color='gray.500'>
								Cuando envíes una solicitud, aparecerá aquí
							</Text>
						</Box>
					) : (
						<Table.ScrollArea borderWidth='0px' m={6}>
							<Table.Root size='sm' variant='outline'>
								<Table.Header>
									<Table.Row bg='gray.50'>
										<Table.ColumnHeader fontWeight='semibold' color='gray.700'>
											N°
										</Table.ColumnHeader>
										<Table.ColumnHeader fontWeight='semibold' color='gray.700'>
											Programa Origen
										</Table.ColumnHeader>
										<Table.ColumnHeader fontWeight='semibold' color='gray.700'>
											Programa Destino
										</Table.ColumnHeader>
										{/* <Table.ColumnHeader fontWeight='semibold' color='gray.700'>
											Fecha Solicitud
										</Table.ColumnHeader> */}
										<Table.ColumnHeader fontWeight='semibold' color='gray.700'>
											Estado
										</Table.ColumnHeader>
										<Table.ColumnHeader fontWeight='semibold' color='gray.700'>
											Acciones
										</Table.ColumnHeader>
									</Table.Row>
								</Table.Header>
								<Table.Body>
									{dataMyRequests?.map((request, index) => (
										<Table.Row key={request.id} _hover={{ bg: 'gray.50' }}>
											<Table.Cell fontWeight='medium'>{index + 1}</Table.Cell>
											<Table.Cell>
												<Text fontSize='sm' fontWeight='medium'>
													{request.from_program_name}
												</Text>
											</Table.Cell>
											<Table.Cell>
												<Text fontSize='sm' fontWeight='medium'>
													{request.to_program_name}
												</Text>
											</Table.Cell>
											{/* <Table.Cell>
												<Text fontSize='sm' color='gray.600'>
													{formatDate(request.created_at)}
												</Text>
											</Table.Cell> */}
											<Table.Cell>
												<Badge
													bg={getStatusBg(request.status)}
													color={getStatusColor(request.status)}
													size='sm'
												>
													{request.status_display}
												</Badge>
											</Table.Cell>
											<Table.Cell>
												<Group>
													<PreviewDocumentRequestModal
														documentPath={request.request_document_url}
													/>
												</Group>
											</Table.Cell>
										</Table.Row>
									))}
								</Table.Body>
							</Table.Root>
						</Table.ScrollArea>
					)}
				</Card.Body>
			</Card.Root>
		</Box>
	);
};
