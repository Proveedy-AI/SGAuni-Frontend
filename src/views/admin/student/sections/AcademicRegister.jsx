import { useColorModeValue } from '@/components/ui';
import {
	useReadAcademicProgress,
	useReadAcademicTranscript,
	useReadCoursesByPeriod,
} from '@/hooks/students';
import {
	Box,
	Card,
	Flex,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Stack,
	Tabs,
	Text,
	VStack,
} from '@chakra-ui/react';
import { FiBookOpen, FiCalendar } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { ReactSelect } from '@/components';
import { GenerateAcademicTranscriptPdfModal } from '@/components/modals/mycourses';
import {
	AcademicProgressSection,
	CoursesByPeriodSection,
	GradesRecordSection,
} from '../../mycourses/sections';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';

export const AcademicRegister = ({ dataStudent }) => {
	const borderColor = useColorModeValue('gray.200', 'gray.600');
	const [selectProgram, setSelectProgram] = useState(null);
	const [tab, setTab] = useState('courses');
	const { data: dataCoursesByPeriod, isLoading: isLoadingCoursesByPeriod } = useReadCoursesByPeriod(
		dataStudent?.uuid,
		selectProgram?.value
	);

  const { data: dataUser } = useReadUserLogged();
  const roles = dataUser?.roles || [];
  const permissions = roles
    .flatMap((r) => r.permissions || [])
    .map((p) => p.guard_name);

	const {
		data: dataAcademicTranscript,
		isLoading: isLoadingAcademicTranscript,
	} = useReadAcademicTranscript(dataStudent?.uuid, selectProgram?.value);

	const { data: dataAcademicProgress, isLoading: isLoadingAcademicProgress } =
		useReadAcademicProgress(dataStudent?.uuid);

	const ProgramsOptions = useMemo(
		() =>
			dataStudent?.admission_programs
				?.map((program) => ({
					label: program.program_name,
					value: program.program,
					academic_status: program.academic_status,
					academic_status_display: program.academic_status_display,
				}))
				.reverse() || [],
		[dataStudent]
	);

	useEffect(() => {
		if (ProgramsOptions.length > 0 && !selectProgram) {
			setSelectProgram(ProgramsOptions[0]);
		}
	}, [ProgramsOptions, selectProgram]);

	const isDownloadable =
		!isLoadingAcademicTranscript &&
		dataCoursesByPeriod?.total_periods?.length !== 0;

	const filteredAcademicProgressByProgram =
		dataAcademicProgress?.programs?.find(
			(data) => data?.program?.id === selectProgram?.value
		);

	return (
		<Stack gap={4}>
			<Stack bg='blue.100' p={4} borderRadius={6} overflow='hidden'>
				<Flex gap={4} direction={{ base: 'column', lg: 'row' }}>
					<Flex align='center' gap={3} flex={1}>
						<Text
							py={1}
							pr={2}
							color='blue.600'
							fontSize='md'
							fontWeight='bold'
						>
							Programa Académico:
						</Text>
						<Box
							bg='white'
							borderRadius={6}
							flex={1}
							maxW={{ base: 'full', lg: '320px' }}
							fontSize='sm'
						>
							<ReactSelect
								placeholder='Filtrar por programa...'
								value={selectProgram}
								onChange={(value) => setSelectProgram(value)}
								variant='flushed'
								size='xs'
								isSearchable
								isClearable
								options={ProgramsOptions}
							/>
						</Box>
					</Flex>
					<GenerateAcademicTranscriptPdfModal
						data={dataAcademicTranscript}
						isActive={isDownloadable}
					/>
				</Flex>
				<Flex
					justify='space-between'
					border='1px solid'
					borderColor='blue.400'
					borderRadius={8}
					direction={{ base: 'column', lg: 'row' }}
					fontSize={'sm'}
				>
					<SimpleGrid
						p={2}
						borderEndWidth={1}
						borderColor='blue.400'
						flex={1}
						columns={1}
					>
						<Text>
							<b>Programa:</b>{' '}
							{filteredAcademicProgressByProgram?.program?.name}
						</Text>
						<Text>
							<b>Año de admisión:</b>{' '}
							{filteredAcademicProgressByProgram?.admission_year}
						</Text>
					</SimpleGrid>
					<SimpleGrid p={2} flex={1} columns={1}>
						<Text color='gray.500'>
							<b>Inicio de programa:</b>{' '}
							{filteredAcademicProgressByProgram?.program_start_date}
						</Text>
						<Text color='gray.500'>
							<b>Estado:</b> {selectProgram?.academic_status_display}
						</Text>
					</SimpleGrid>
				</Flex>
			</Stack>
			<Tabs.Root
				value={tab}
				onValueChange={(e) => setTab(e.value)}
				variant='plain'
				my={3}
			>
				<Flex justify='space-between' align='center'>
					<Tabs.List bg='blue.100' rounded='l3' p='1'>
						<Tabs.Trigger color='blue.600' fontSize={'sm'} value='courses'>
							Cursos
						</Tabs.Trigger>
						<Tabs.Trigger
							color='blue.600'
							fontSize={'sm'}
							value='academic-summary'
						>
							Resumen Académico
						</Tabs.Trigger>
						<Tabs.Trigger
							color='blue.600'
							fontSize={'sm'}
							value='grades-record'
						>
							Record de notas
						</Tabs.Trigger>
						<Tabs.Indicator rounded='l2' />
					</Tabs.List>
				</Flex>
				<Tabs.Content value='courses'>
					<VStack gap={6} align='stretch'>
						{!dataCoursesByPeriod?.data ||
						dataCoursesByPeriod.data.length === 0 ? (
							<Card.Root p={8} maxW='full' mx='auto' textAlign='center'>
								<VStack spacing={6}>
									<Box
										p={4}
										borderRadius='full'
										bg={{ base: 'blue.50', _dark: 'blue.900' }}
										border='2px solid'
										borderColor={{ base: 'blue.100', _dark: 'blue.700' }}
									>
										<Icon
											as={FiBookOpen}
											boxSize={12}
											color={{ base: 'blue.500', _dark: 'blue.300' }}
										/>
									</Box>

									<VStack spacing={3}>
										<Heading
											size='lg'
											color={{ base: 'gray.700', _dark: 'gray.200' }}
										>
											No tienes cursos registrados
										</Heading>
										<Text
											fontSize='md'
											textAlign={'justify'}
											color='gray.500'
											maxW='md'
											mx='auto'
										>
											Parece que aún no está inscrito en ningún curso.
										</Text>
									</VStack>

									<Box
										p={4}
										bg={{ base: 'gray.50', _dark: 'gray.700' }}
										borderRadius='md'
										border='1px solid'
										borderColor={borderColor}
										maxW='md'
									>
										<HStack spacing={3} justify='center'>
											<Icon as={FiCalendar} color='blue.500' />
											<Text fontSize='sm' color='gray.600'>
												Una vez completada la matrícula, los cursos aparecerán
												aquí
											</Text>
										</HStack>
									</Box>
								</VStack>
							</Card.Root>
						) : (
              <CoursesByPeriodSection
                isLoadingCoursesByPeriod={isLoadingCoursesByPeriod}
                dataCoursesByPeriod={dataCoursesByPeriod}
                permissions={permissions}
              />
						)}
					</VStack>
				</Tabs.Content>
				<Tabs.Content value='academic-summary'>
					<AcademicProgressSection
						academicProgress={filteredAcademicProgressByProgram}
						isLoading={isLoadingAcademicProgress}
					/>
				</Tabs.Content>
				<Tabs.Content value='grades-record'>
					<GradesRecordSection dataCoursesByPeriod={dataCoursesByPeriod} admin={true} />
				</Tabs.Content>
			</Tabs.Root>
		</Stack>
	);
};

AcademicRegister.propTypes = {
	dataStudent: PropTypes.object.isRequired,
};
