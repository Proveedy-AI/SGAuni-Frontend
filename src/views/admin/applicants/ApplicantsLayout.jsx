'use client';

import {
	Box,
	Button,
	Flex,
	Heading,
	Progress,
	Steps,
	Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { PersonalDataApplicants } from '@/components/forms/admissions/MyApplicants';
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { DocumentsApplicant } from './DocumentsApplicant';
import { WorkApplicant } from './WorkApplicant';
import { PaymentApplicant } from './PaymentApplicant';

export const ApplicantsLayout = () => {
	const [step, setStep] = useState(0);
	const [isStepValid, setIsStepValid] = useState(false);
	const [isDocumentsStepValid, setIsDocumentsStepValid] = useState(false);
	const [allWorksCompleted, setAllWorksCompleted] = useState(false);
	const [isPaymentStepValid, setIsPaymentStepValid] = useState(false);

	const {
		data: dataUser,
		isLoading: isLoadingDataUser,
		refetch: fetchDataUser,
	} = useReadUserLogged();

	const handleCompleteProcess = () => {
		// Aquí puedes hacer una llamada a la API o actualizar el estado final
		console.log('Proceso finalizado');
		setStep(step + 1); // esto muestra Steps.CompletedContent
	};

	useEffect(() => {
		const validateStep = async () => {
			switch (step) {
				case 0: {
					// validación para Datos Personales
					const isValid = Boolean(dataUser?.document_path?.trim());
					setIsStepValid(isValid);
					break;
				}
				case 1: {
					setIsStepValid(isPaymentStepValid);
					break;
				}
				case 2: {
					setIsStepValid(isDocumentsStepValid);
					break;
				}
				case 3: {
					setIsStepValid(allWorksCompleted);
					break;
				}
			}
		};

		validateStep();
	}, [
		step,
		dataUser,
		isDocumentsStepValid,
		allWorksCompleted,
		isPaymentStepValid,
	]);

	const steps = [
		{
			title: 'Datos Personales',
			component: (
				<PersonalDataApplicants
					loading={isLoadingDataUser}
					fetchUser={fetchDataUser}
					data={dataUser}
				/>
			),
		},
		{
			title: 'Solicitudes',
			component: (
				<PaymentApplicant
					onValidationChange={(valid) => setIsPaymentStepValid(valid)}
				/>
			),
		},
		{
			title: 'Documentación',
			component: (
				<DocumentsApplicant
					onValidationChange={(valid) => setIsDocumentsStepValid(valid)}
				/>
			),
		},
		{
			title: 'Trabajos',
			component: <WorkApplicant onAllCompleted={setAllWorksCompleted} />,
		},
	];

	const progress = ((step + 1) / steps.length) * 100;

	return (
		<Steps.Root
			step={step}
			onStepChange={(e) => setStep(e.step)}
			count={steps.length}
			colorPalette='green'
		>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Mis Postulaciones', to: '/admissions/myapplicants' },
					{ label: 'Proceso' },
				]}
			/>

			<Flex w='100%' direction='column' align='stretch'>
				{/* Botones de navegación arriba */}
				<Flex w='full' justify='space-between' align='center' mb={2}>
					<Steps.PrevTrigger asChild>
						<Button colorPalette='gray' variant='ghost'>
							<FaChevronLeft /> Anterior
						</Button>
					</Steps.PrevTrigger>

					{/* Steps list visible solo en pantallas md o mayores */}
					<Box w='50%' mx='auto' display={{ base: 'none', md: 'block' }}>
						<Steps.List>
							{steps.map((step, index) => (
								<Steps.Item key={index} index={index}>
									<Steps.Trigger
										disabled={!isStepValid}
										flexDirection='column'
										textAlign='center'
									>
										<Steps.Indicator />
										<Steps.Title fontSize='xs'>{step.title}</Steps.Title>
									</Steps.Trigger>
									<Steps.Separator />
								</Steps.Item>
							))}
						</Steps.List>
					</Box>

					{/* Botón Siguiente o Completar */}
					{step < steps.length &&
						(step === steps.length - 1 ? (
							<Button
								colorPalette='gray'
								variant='ghost'
								disabled={!isStepValid}
								onClick={handleCompleteProcess}
							>
								Completar <FaChevronRight />
							</Button>
						) : (
							<Steps.NextTrigger asChild disabled={!isStepValid}>
								<Button colorPalette='gray' variant='ghost'>
									Siguiente <FaChevronRight />
								</Button>
							</Steps.NextTrigger>
						))}
				</Flex>

				{/* Barra de progreso solo para móvil (opcional) */}
				<Box w='full' display={{ base: 'block', md: 'none' }} mt={2}>
					<Progress.Root value={progress} max={100} size='md'>
						<Progress.Track
							style={{
								backgroundColor: '#EDF2F7', // gray.200
								borderRadius: '8px',
								overflow: 'hidden',
							}}
						>
							<Progress.Range
								style={{
									backgroundColor: '#000000',
									transition: 'width 0.2s ease',
								}}
							/>
						</Progress.Track>

						<Text fontSize='sm' color='gray.600' mt={2} textAlign='center'>
							{Math.round(progress)}% completado
						</Text>
					</Progress.Root>
				</Box>

				{/* Contenido de cada paso */}
				{steps.map((step, index) => (
					<Steps.Content key={index} index={index}>
						{step.component}
					</Steps.Content>
				))}

				<Steps.CompletedContent>
					<Flex
						direction='column'
						align='center'
						justifyContent='center'
						mx='auto'
						w={{ base: 'full', md: '80%' }}
						mt={10}
						mb={10}
						px={4}
						py={6}
						borderWidth={1}
						borderColor='green.200'
						borderRadius='lg'
						bg='green.50'
						boxShadow='sm'
					>
						<FaCheckCircle
							size='60px'
							color='#38A169'
							style={{ marginBottom: '16px' }}
						/>
						<Heading size='md' color='green.700' mb={2}>
							¡Proceso completado con éxito!
						</Heading>
						<Text
							fontSize='sm'
							color='gray.700'
							textAlign='center'
							maxW='400px'
						>
							Has finalizado todos los pasos de tu postulación. Puedes revisar
							el estado desde el panel de postulaciones.
						</Text>
						<Button
							mt={4}
							colorScheme='green'
							variant='solid'
							onClick={() =>
								(window.location.href = '/admissions/myapplicants')
							}
						>
							Volver al Inicio
						</Button>
					</Flex>
				</Steps.CompletedContent>
			</Flex>
		</Steps.Root>
	);
};
