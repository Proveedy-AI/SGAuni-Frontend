import { ReactSelect } from '@/components';
import { AddAcademicDegreeModal } from '@/components/modals/academic_degrees';
import { AcademicDegreeTable } from '@/components/tables/academic_degrees';
import { Button, InputGroup } from '@/components/ui';
import { useReadAcademicDegrees } from '@/hooks/academic_degrees';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { Box, Card, Flex, Heading, Input, SimpleGrid, Stack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiSearch, FiTrash } from 'react-icons/fi';

export const MyAcademicDegreesView = () => {
	const [searchName, setSearchName] = useState('');
	const [searchUniversity, setSearchUniversity] = useState('');
	const [searchTypeDegree, setSearchTypeDegree] = useState(null);

	const { data: dataUser } = useReadUserLogged();

	const {
		data: dataAcademicDegrees,
		isLoading: isLoadingAcademicDegrees,
		refetch: fetchAcademicDegrees,
	} = useReadAcademicDegrees(
		{ person: dataUser?.id },
		{ enabled: !!dataUser?.id }
	);

	const TypeDegreeOptions = [
		{ value: 1, label: 'Bachiller' },
		{ value: 2, label: 'Título' },
		{ value: 3, label: 'Maestría' },
		{ value: 4, label: 'Doctorado' },
		{ value: 5, label: 'Diploma' },
	];

  const filteredAcademicDegrees = dataAcademicDegrees?.results?.filter(degree =>
    (searchName === '' || degree.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (searchUniversity === '' || degree.university.toLowerCase().includes(searchUniversity.toLowerCase())) &&
    (searchTypeDegree === null || degree.type_degree === searchTypeDegree.value)
  );

  const hasFilters = searchName || searchUniversity || searchTypeDegree;

  const handleReset = () => {
    setSearchName('');
    setSearchUniversity('');
    setSearchTypeDegree(null);
  }

	return (
    <Box spaceY='5'>
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'start', sm: 'center' }}
        justify='space-between'
      >
        <Heading
          size={{
            xs: 'sm',
            sm: 'md',
            md: 'lg',
          }}
        >
          Mis Títulos Académicos
        </Heading>

        <AddAcademicDegreeModal dataUser={dataUser} fetchData={fetchAcademicDegrees} options={TypeDegreeOptions} />
      </Stack>

      <Card.Root>
        <Card.Header overflow="hidden">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            alignItems={{ base: 'flex-start', md:'center' }}
            justifyContent={{ base: 'flex-start', md: 'space-between' }}
            width='100%'
            gap="3"
          >
            <Heading size='xl' h='40px'>
              Filtros de búsqueda
            </Heading>
            {hasFilters && (
              <Button
                size='sm'
                bg='red.100'
                color='red.500'
                _hover={{ bg: 'red.200' }}
                onClick={handleReset}
              >
                <FiTrash /> Quitar Filtros
              </Button>
            )}
          </Flex>
        </Card.Header>
        <Card.Body>
          <SimpleGrid
            columns={{ base: 1, lg: 3 }}
            gap={4}
            mb={4}
            alignItems='center'
          >
            <InputGroup startElement={<FiSearch />}>
              <Input
                ml='1'
                size='sm'
                placeholder='Buscar por nombre del título'
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </InputGroup>
            <InputGroup startElement={<FiSearch />}>
              <Input
                ml='1'
                size='sm'
                placeholder='Buscar por nombre de la universidad'
                value={searchUniversity}
                onChange={(e) => setSearchUniversity(e.target.value)}
              />
            </InputGroup>
            <ReactSelect
              label='Tipo de Título'
              size='sm'
              options={TypeDegreeOptions}
              value={searchTypeDegree}
              onChange={setSearchTypeDegree}
              isClearable
              placeholder='Seleccione una opción'
            />
          </SimpleGrid>
        </Card.Body>
      </Card.Root>

      <AcademicDegreeTable
        data={filteredAcademicDegrees}
        fetchData={fetchAcademicDegrees}
        isLoading={isLoadingAcademicDegrees}
        options={TypeDegreeOptions}
      />
    </Box>
  );
};
