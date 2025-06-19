import { Encryptor } from '@/components/CrytoJS/Encryptor';
import { PaymentOrdersByApplicationTable } from '@/components/tables/payment_orders';
import { useReadAdmissionApplicantById } from '@/hooks/admissions_applicants/useReadAdmissionApplicantById';
import {
	Badge,
	Box,
	Breadcrumb,
	Flex,
	Heading,
	SimpleGrid,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import { LiaSlashSolid } from 'react-icons/lia';
import { useParams } from 'react-router';
import { Link as RouterLink } from 'react-router';

export const AdmissionApplicantDetail = () => {
	const { programId, id } = useParams();
	const decodedProgrma = decodeURIComponent(programId);
	const encodeProgram = encodeURIComponent(decodedProgrma);
	const decoded = decodeURIComponent(id);
	const decrypted = Encryptor.decrypt(decoded);

	const { data: dataApplicant, loading: isApplicantLoading } =
		useReadAdmissionApplicantById(decrypted);

	const statusEnum = [
		{ id: 1, label: 'En Revisión', bg: '#FDD9C6', color: '#F86A1E' },
		{ id: 2, label: 'Aprobado', bg: 'green', color: 'white' },
		{ id: 3, label: 'Rechazado', bg: 'red', color: 'white' },
	];

	const statusEnumSelected = statusEnum.find(
		(item) => item.id === dataApplicant?.status
	);

	return (
		<Box spaceY='5'>
			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Breadcrumb.Root size='lg'>
					<Breadcrumb.List>
						<Breadcrumb.Item>
							<Breadcrumb.Link as={RouterLink} to='/admissions/applicants'>
								Postulantes
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator>
							<LiaSlashSolid />
						</Breadcrumb.Separator>
						<Breadcrumb.Item>
							<Breadcrumb.Link
								as={RouterLink}
								to={`/admissions/applicants/programs/${encodeProgram}`}
							>
								{isApplicantLoading
									? 'Cargando...'
									: dataApplicant?.postgrade_name}
							</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator>
							<LiaSlashSolid />
						</Breadcrumb.Separator>
						<Breadcrumb.Item>
							<Breadcrumb.CurrentLink>
								{dataApplicant?.person_full_name}
							</Breadcrumb.CurrentLink>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</Stack>

			<Stack
				Stack
				direction={{ base: 'column', sm: 'row' }}
				align={{ base: 'start', sm: 'center' }}
				justify='space-between'
			>
				<Heading
					size={{
						xs: 'xs',
						sm: 'md',
						md: 'xl',
					}}
					color={'uni.secondary'}
				>
					<Text color='gray.500'>
						{isApplicantLoading
							? 'Cargando...'
							: dataApplicant?.person_full_name}
					</Text>
				</Heading>
			</Stack>

			{isApplicantLoading && <Spinner />}
			{
				<>
					{!isApplicantLoading && dataApplicant ? (
						<Box maxW='900px' mx='auto'>
							<Flex
								bg={{ base: 'white', _dark: 'its.gray.500' }}
								borderRadius='10px'
								overflow='hidden'
								boxShadow='md'
								mb={6}
								px={6}
								py={8}
								align='center'
								justify='space-between'
								wrap='wrap'
							>
								<Flex align='center' gap={2}>
									<Text fontWeight='semibold'>Estado:</Text>
									<Badge
										bg={statusEnumSelected?.bg}
										color={statusEnumSelected?.color}
										variant='solid'
										fontSize='0.9em'
									>
										{statusEnumSelected?.label}
									</Badge>
								</Flex>
								<Text>
									<Text as='span' fontWeight='semibold'>
										Programa académico:
									</Text>{' '}
									{dataApplicant?.postgrade_name}
								</Text>
								<Text>
									<Text as='span' fontWeight='semibold'>
										Modalidad:
									</Text>{' '}
									{dataApplicant?.modality_display}
								</Text>
							</Flex>
							<Box
								bg={{ base: 'white', _dark: 'its.gray.500' }}
								borderRadius='10px'
								overflow='hidden'
								boxShadow='md'
								p={6}
								mb={6}
							>
								<Text fontWeight='bold' color='red.600' mb={4}>
									Datos del postulante:
								</Text>
								<SimpleGrid columns={[1, 2]} spacing={4}>
									<Box>
										<Text>
											<b>Fecha de Nacimiento:</b>{' '}
											{dataApplicant?.person_details?.birth_date}
										</Text>
										<Text>
											<b>País de Nacimiento:</b>{' '}
											{dataApplicant?.person_details?.country_name}
										</Text>
										<Text>
											<b>Nacionalidad:</b>{' '}
											{dataApplicant?.person_details?.nationality_name}
										</Text>
										<Text>
											<b>Celular:</b> {dataApplicant?.person_details?.phone}
										</Text>
										<Text>
											<b>Correo:</b> {dataApplicant?.person_details?.email}
										</Text>
									</Box>
									<Box>
										<Text>
											<b>Documento de identidad:</b>{' '}
											{dataApplicant?.person_details?.document_number}
										</Text>
										<Text>
											<b>Dirección:</b> {dataApplicant?.person_details?.address}
										</Text>
										<Text>
											<b>Departamento:</b>{' '}
											{dataApplicant?.person_details?.department_name}
										</Text>
										<Text>
											<b>Provincia:</b>{' '}
											{dataApplicant?.person_details?.province_name}
										</Text>
										<Text>
											<b>Distrito:</b>{' '}
											{dataApplicant?.person_details?.district_name}
										</Text>
									</Box>
								</SimpleGrid>
							</Box>
							<Box
								bg={{ base: 'white', _dark: 'its.gray.500' }}
								borderRadius='10px'
								overflow='hidden'
								boxShadow='md'
								p={6}
								mb={6}
							>
								<Text fontWeight='bold' color='red.600' mb={4}>
									Trámites:
								</Text>
								<PaymentOrdersByApplicationTable
									data={dataApplicant?.payment_orders}
								/>
							</Box>
						</Box>
					) : (
						<Heading size='sm' color='gray.500'>
							Postulante no encontrado
						</Heading>
					)}
				</>
			}
		</Box>
	);
};
