import {
	Box,
	Card,
	Heading,
	HStack,
	Icon,
	SimpleGrid,
	Stack,
} from '@chakra-ui/react';
import { FiFileText } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { useReadDocuments } from '@/hooks/documents';
import { DocumentCard } from '@/components/card/DocumentCard';
import { ReactSelect } from '@/components';
import { useEffect, useMemo, useState } from 'react';

export const DocumentStudent = ({ dataStudent }) => {
	const [selectProgram, setSelectProgram] = useState(null);
	const { data: dataDocuments } = useReadDocuments(
		{ application: selectProgram?.program },
		{ enabled: !!selectProgram?.program }
	);

	const handleDownload = (filePath) => {
		window.open(filePath, '_blank');
	};

	const ProgramsOptions = useMemo(
		() =>
			dataStudent?.admission_programs
				?.map((program) => ({
					label: program.program_name,
					program: program.application,
					value: program.program,
				}))
				.reverse() || [],
		[dataStudent]
	);

	useEffect(() => {
		if (ProgramsOptions.length > 0 && !selectProgram) {
			setSelectProgram(ProgramsOptions[0]);
		}
	}, [ProgramsOptions, selectProgram]);
	return (
		<Card.Root shadow={'md'}>
			<Card.Header pb={0}>
				<Stack
					direction={{ base: 'column', md: 'row' }}
					justify='space-between'
					align={{ base: 'flex-start', md: 'center' }}
					w='full'
					gap={2}
				>
					<HStack gap={2}>
						<Icon as={FiFileText} boxSize={5} />
						<Heading size='md'>Documentos</Heading>
					</HStack>

					<Box minW={{ base: '100%', md: '550px' }}>
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
				</Stack>
			</Card.Header>

			<Card.Body>
				{dataDocuments?.results?.length === 0 || !dataDocuments ? (
					<Box
						colSpan={{ base: 1, md: 2 }}
						p={6}
						borderWidth='1px'
						borderRadius='lg'
						textAlign='center'
						color='gray.500'
					>
						No hay documentos disponibles.
					</Box>
				) : (
					<SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
						{dataDocuments?.results?.map((doc) => (
							<DocumentCard
								key={doc.id}
								doc={doc}
								handleDownload={handleDownload}
							/>
						))}
					</SimpleGrid>
				)}
			</Card.Body>
		</Card.Root>
	);
};

DocumentStudent.propTypes = {
	dataStudent: PropTypes.object.isRequired,
};
