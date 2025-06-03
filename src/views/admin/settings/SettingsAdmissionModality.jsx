import { CreateModality } from "@/components/forms/management/admission/CreateModality"
import { DeleteModality } from "@/components/forms/management/admission/DeleteModality"
import { EditModality } from "@/components/forms/management/admission/EditModality"
import { ViewModality } from "@/components/forms/management/admission/ViewModality"
import { AdmissionMethodTable } from "@/components/tables/AdmissionMethodTable"
import { useReadModalities } from "@/hooks/modalities"
import { Box, Heading, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

export const SettingsAdmissionModality = () => {
  const { data: dataModalities, refetch: fetchModalities } = useReadModalities();
  const [loading, setInitialLoading] = useState(true);

  const [admissionMethods, setAdmissionMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState({
    create: false,
    view: false,
    edit: false,
    delete: false
  });

  useEffect(() => {
    if (loading && dataModalities && dataModalities.results?.length > 0) {
      setInitialLoading(false);
      setAdmissionMethods(dataModalities.results);
    }
  }, [loading, dataModalities]);

  // Funciones para abrir y cerrar modales
  const handleOpenModal = (modalType, method) => {
    if (method) setSelectedMethod(method);
    setIsModalOpen(prev => ({...prev, [modalType]: true }));
  }

  const handleCloseModal = (modalType) => {
    setSelectedMethod(null);
    setIsModalOpen(prev => ({...prev, [modalType]: false }));
  }

  return (
    <Box>
      <Heading size={{ xs: 'xs', sm: 'sm', md: 'md', }}>Modalidades</Heading>
      { loading && <p>Cargando...</p> }


      { !loading && admissionMethods.length && (
        <VStack py='4' align='start' gap='3'>
          <CreateModality setAdmissionMethods={setAdmissionMethods} handleOpenModal={handleOpenModal} isCreateModalOpen={isModalOpen.create} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />

          <AdmissionMethodTable setMethods={setAdmissionMethods} methods={admissionMethods} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal } />

        </VStack>
      )}

      {
        isModalOpen.view && selectedMethod &&
        <ViewModality selectedMethod={selectedMethod} isViewModalOpen={isModalOpen.view} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />
      }
      {
        isModalOpen.edit && selectedMethod &&
        <EditModality setMethods={setAdmissionMethods} selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} isEditModalOpen={isModalOpen.edit} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />
      }
      {
        isModalOpen.delete && selectedMethod &&
        <DeleteModality selectedMethod={selectedMethod} setMethods={setAdmissionMethods} isDeleteModalOpen={isModalOpen.delete} setIsModalOpen={setIsModalOpen} handleCloseModal={handleCloseModal} />
      }
    </Box>
  )
}