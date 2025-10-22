import { ReactSelect } from "@/components";
import { AddCourseModal } from "@/components/forms/courses";
import { CoursesTable } from "@/components/tables/courses";
import { InputGroup } from "@/components/ui";
import { useReadCourses } from "@/hooks/courses";
import { Box, Card, Heading, Input, SimpleGrid, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export const CoursesAndSchedules = () => {
  const [searchCourseNameOrCode, setSearchCourseNameOrCode] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(null);

  const LevelOptions = [
    { value: 'Maestria', label: 'Maestría' },
    { value: 'Doctorado', label: 'Doctorado' },
  ]
  
  const { 
    data: dataCourses, 
    isLoading: isLoadingCourses, 
    refetch: fetchCourses
  } = useReadCourses();

  const filteredCourses = dataCourses?.results?.filter(course =>
    (searchCourseNameOrCode === '' || (
      course.name.toLowerCase().includes(searchCourseNameOrCode.toLowerCase()) ||
      course.code.toLowerCase().includes(searchCourseNameOrCode.toLowerCase())
    )) &&
    (selectedLevel === null || course.level === selectedLevel.value)
  );

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
          Gestión de Cursos
        </Heading>

        <AddCourseModal data={dataCourses?.results} fetchData={fetchCourses} levelOptions={LevelOptions} />
      </Stack>
      
      <Card.Root>
        <Card.Body>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
            <InputGroup startElement={<FiSearch />}>
              <Input
                ml='1'
                size='sm'
                placeholder='Buscar por nombre o código de curso'
                value={searchCourseNameOrCode}
                onChange={(e) => setSearchCourseNameOrCode(e.target.value)}
              />
            </InputGroup>
            <ReactSelect
              name='level'
              options={LevelOptions}
              placeholder='Filtrar por nivel'
              value={selectedLevel}
              onChange={setSelectedLevel}
              isClearable
              />
          </SimpleGrid>
        </Card.Body>
      </Card.Root>

      <CoursesTable
        data={filteredCourses}
        fetchData={fetchCourses}
        isLoading={isLoadingCourses}
        levelOptions={LevelOptions}
      />
    </Box>
  )
}