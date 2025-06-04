import { AddProgramType, CreateProgram } from "@/components/forms/management/programs/CreateProgram";
import { DeleteProgram } from "@/components/forms/management/programs/DeleteProgram";
import { EditProgram } from "@/components/forms/management/programs/EditProgram";
import { ViewProgram } from "@/components/forms/management/programs/ViewProgram";
import { ProgramTable } from "@/components/tables/ProgramTable";
import { InputGroup } from "@/components/ui";
import { PROGRAMS, COORDINADORES } from "@/data/LocalPrograms"
import { useReadPrograms, useReadProgramTypes } from "@/hooks";
import { useReadUsers } from "@/hooks/users";
import { Box, Heading, HStack, Input, Stack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export const SettingsPrograms = () => {
  const { data: dataPrograms, refetch: fetchPrograms } = useReadPrograms();
  const { data: dataProgramTypes } = useReadProgramTypes();
  const { data: dataCoordinators } = useReadUsers();

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

  const filteredPrograms = dataPrograms?.results.filter((item) => 
    item?.name?.toLowerCase().includes(searchProgramValue.toLowerCase())
  );

  const [programs, setPrograms] = useState(PROGRAMS);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState({
    create: false,
    view: false,
    edit: false,
    delete: false,
  });

  // Abre un modal y, opcionalmente, establece el programa seleccionado
  const handleOpenModal = (modalType, program) => {
    if (program) setSelectedProgram(program);
    setIsModalOpen((prev) => ({ ...prev, [modalType]: true }));
  };

  // Cierra un modal y limpia el programa seleccionado
  const handleCloseModal = (modalType) => {
    setIsModalOpen((prev) => ({ ...prev, [modalType]: false }));
    setSelectedProgram(null);
  };

  return (
     <Box spaceY='5'>
      <Stack
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'start', sm: 'center' }}
        justify='space-between'
      >
        <Heading 
          size={{
						xs: 'xs',
						sm: 'sm',
						md: 'md',
				  }}
        >
          Programas de Postgrado
        </Heading>
      </Stack>

      <Stack direction={{ base: 'column', sm: 'row' }} justify='space-between'>
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

      <Stack>

        <ProgramTable
          data={filteredPrograms}
          fetchData={fetchPrograms}
        />
      </Stack>

      {/* <ViewProgram selectedProgram={selectedProgram} isViewModalOpen={isModalOpen.view} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal}/>
      <EditProgram setPrograms={setPrograms} selectedProgram={selectedProgram} setSelectedProgram={setSelectedProgram} isEditModalOpen={isModalOpen.edit} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />
      <DeleteProgram selectedProgram={selectedProgram} setPrograms={setPrograms} isDeleteModalOpen={isModalOpen.delete} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal}/> */}
    </Box>
  );
}
