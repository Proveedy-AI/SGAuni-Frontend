import { CreateModality } from '@/components/forms/management/admission/CreateModality';
import { DeleteModality } from '@/components/forms/management/admission/DeleteModality';
import { EditModality } from '@/components/forms/management/admission/EditModality';
import { ViewModality } from '@/components/forms/management/admission/ViewModality';
import { AdmissionMethodTable } from '@/components/tables/AdmissionMethodTable';
import { useReadModalities } from '@/hooks/modalities';
import { Box, Heading, VStack, Spinner, Text } from '@chakra-ui/react';
import { useState } from 'react';

export const SettingsAdmissionModality = () => {
	const { data: dataModalities, refetch: fetchModalities, isLoading } = useReadModalities();

	const [selectedMethod, setSelectedMethod] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState({
		create: false,
		view: false,
		edit: false,
		delete: false,
	});

	const handleOpenModal = (modalType, method) => {
		if (method) setSelectedMethod(method);
		setIsModalOpen((prev) => ({ ...prev, [modalType]: true }));
	};

	const handleCloseModal = (modalType) => {
		setSelectedMethod(null);
		setIsModalOpen((prev) => ({ ...prev, [modalType]: false }));
	};

	const modalities = dataModalities?.results ?? [];

	return (
		<Box>
			<Heading size={{ xs: 'xs', sm: 'sm', md: 'md' }}>Modalidades</Heading>

			{isLoading && <Spinner mt={4} />}

			{!isLoading && (
				<VStack py='4' align='start' gap='3'>
					<CreateModality
						setAdmissionMethods={fetchModalities}
						handleOpenModal={handleOpenModal}
						isCreateModalOpen={isModalOpen.create}
						setIsModalOpen={setIsModalOpen}
						handleCloseModal={handleCloseModal}
					/>

					{modalities.length > 0 ? (
						<AdmissionMethodTable
							setMethods={fetchModalities}
							methods={modalities}
							handleOpenModal={handleOpenModal}
							handleCloseModal={handleCloseModal}
						/>
					) : (
						<Text>No hay modalidades registradas.</Text>
					)}
				</VStack>
			)}

			{isModalOpen.view && selectedMethod && (
				<ViewModality
					selectedMethod={selectedMethod}
					isViewModalOpen={isModalOpen.view}
					setIsModalOpen={setIsModalOpen}
					handleCloseModal={handleCloseModal}
				/>
			)}

			{isModalOpen.edit && selectedMethod && (
				<EditModality
					setMethods={fetchModalities}
					selectedMethod={selectedMethod}
					setSelectedMethod={setSelectedMethod}
					isEditModalOpen={isModalOpen.edit}
					setIsModalOpen={setIsModalOpen}
					handleCloseModal={handleCloseModal}
				/>
			)}

			{isModalOpen.delete && selectedMethod && (
				<DeleteModality
					selectedMethod={selectedMethod}
					setMethods={fetchModalities}
					isDeleteModalOpen={isModalOpen.delete}
					setIsModalOpen={setIsModalOpen}
					handleCloseModal={handleCloseModal}
				/>
			)}
		</Box>
	);
};
