'use client';

import { Box, Button, Flex, Heading, Steps, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PaymentApplicant } from './PaymentApplicant';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { PersonalDataApplicants } from '@/components/forms/admissions/MyApplicants';
import { FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { DocumentsApplicant } from './DocumentsApplicant';
import { WorkApplicant } from './WorkApplicant';

export const ApplicantsLayout = () => {
	const [step, setStep] = useState(0);
	const [isStepValid, setIsStepValid] = useState(false);
	const [isDocumentsStepValid, setIsDocumentsStepValid] = useState(false);

	const {
		data: dataUser,
		isLoading: isLoadingDataUser,
		refetch: fetchDataUser,
	} = useReadUserLogged();

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
					setIsStepValid(true);
					break;
				}
				case 2: {
					setIsStepValid(isDocumentsStepValid);
					break;
				}
				case 3: {
					setIsStepValid(true);
					break;
				}
			}
		};

		validateStep();
	}, [step, dataUser, isDocumentsStepValid]);

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
			component: <PaymentApplicant />,
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
			component: <WorkApplicant />,
		},
	];

	return (
		<Steps.Root
			step={step}
			onStepChange={(e) => setStep(e.step)}
			count={steps.length}
			colorPalette='red'
		>
			<ResponsiveBreadcrumb
				items={[
					{ label: 'Mis Postulaciones', to: '/admissions/myapplicants' },
					{ label: 'Proceso' },
				]}
			/>
			<Flex w='100%' align='center'>
				<Steps.PrevTrigger asChild>
					<Button colorPalette='red' variant='ghost'>
						<FaChevronLeft /> Anterior
					</Button>
				</Steps.PrevTrigger>

				<Box w='50%' mx='auto'>
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

				<Steps.NextTrigger asChild disabled={!isStepValid}>
					<Button colorPalette='red' variant='ghost'>
						Siguiente <FaChevronRight />
					</Button>
				</Steps.NextTrigger>
			</Flex>

			{steps.map((step, index) => (
				<Steps.Content key={index} index={index}>
					{step.component}
				</Steps.Content>
			))}

			<Steps.CompletedContent>
				<Flex
					direction='column'
					align='center'
					justify='center'
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
					<FaCheckCircle size="60px" color="#38A169" style={{ marginBottom: '16px' }} />
					<Heading size='md' color='green.700' mb={2}>
						¡Proceso completado con éxito!
					</Heading>
					<Text fontSize='sm' color='gray.700' textAlign='center' maxW='400px'>
						Has finalizado todos los pasos de tu postulación. Puedes revisar el
						estado desde el panel de postulaciones.
					</Text>
				</Flex>
			</Steps.CompletedContent>
		</Steps.Root>
	);
};
