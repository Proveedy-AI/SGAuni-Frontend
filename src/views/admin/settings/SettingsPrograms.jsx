import { AddProgramType, CreateProgram } from "@/components/forms/management/programs/CreateProgram";
import { ProgramTable } from "@/components/tables/ProgramTable";
import { InputGroup } from "@/components/ui";
import { useReadPrograms, useReadProgramTypes } from "@/hooks";
import { useReadUsers } from "@/hooks/users";
import { Box, Heading, Input, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export const SettingsPrograms = () => {
  const { data: dataPrograms, refetch: fetchPrograms, isLoading } = useReadPrograms();
  const { data: dataProgramTypes } = useReadProgramTypes();
  const { data: dataCoordinators } = useReadUsers();

  const programs = dataPrograms?.results ?? [];

  const programTypesOptions = (
  Array.isArray(dataProgramTypes?.results) && dataProgramTypes.results.length > 0
    ? dataProgramTypes.results.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      }))
    : [
        { value: '1', label: "Maestrías" },
        { value: '2', label: "Doctorado" }
      ]
);

  const coordinatorsOptions = dataCoordinators?.results
    ?.filter(
      (item) =>
        item?.is_active === true &&
        Array.isArray(item?.roles) &&
        item.roles.some((role) => role?.name === "Docente")
    )
    ?.map((item) => ({
      value: item.id.toString(),
      label: item.full_name,
    }));

  const [searchProgramValue, setSearchProgramValue] = useState("");

  const filteredPrograms = programs?.filter((item) => 
    item?.name?.toLowerCase().includes(searchProgramValue.toLowerCase())
  );

  return (
     <Box w='100%'>
      <Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>Programas de Postgrado</Heading>

      {isLoading && <Spinner mt={4} />}
      {!isLoading && (
        <VStack w='100%' py='4' align='start' gap='3'>
          <Stack w='100%' direction={{ base: 'column', sm: 'row' }} justify='space-between'>
            <InputGroup startElement={<FiSearch />}>
              <Input
                ml='1'
                size='sm'
                placeholder='Buscar por nombre'
                value={searchProgramValue}
                onChange={(e) => setSearchProgramValue(e.target.value)}
                />
            </InputGroup>

            <CreateProgram 
              fetchData={fetchPrograms}
              programTypesOptions={programTypesOptions}
              coordinatorsOptions={coordinatorsOptions}
              />
          </Stack>

          <Stack w='100%'>
            {programs?.length > 0 ? (
              <ProgramTable
                data={filteredPrograms}
                fetchData={fetchPrograms}
                programTypesOptions={programTypesOptions}
                coordinatorsOptions={coordinatorsOptions}
              />
            ) : (
              <Text>No hay programas registrados.</Text>
            )}
          </Stack>
        </VStack>
      )}
    </Box>
  );
}
