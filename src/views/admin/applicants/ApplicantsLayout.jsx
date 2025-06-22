'use client';

import { Box, Button, Flex, Steps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PaymentApplicant } from './PaymentApplicant';
import { useReadUserLogged } from '@/hooks/users/useReadUserLogged';
import { PersonalDataApplicants } from '@/components/forms/admissions/MyApplicants';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ResponsiveBreadcrumb from '@/components/ui/ResponsiveBreadcrumb';
import { DocumentsApplicant } from './DocumentsApplicant';

export const ApplicantsLayout = () => {
	const [step, setStep] = useState(1);
	const [isStepValid, setIsStepValid] = useState(false);
	const {
		data: dataUser,
		isLoading: isLoadingDataUser,
		refetch: fetchDataUser,
	} = useReadUserLogged();

	useEffect(() => {
		const validateStep = async () => {
			switch (step) {
				case 1: {
					// validación para Datos Personales
					const isValid = Boolean(dataUser?.document_path?.trim());
					setIsStepValid(isValid);
					break;
				}
				case 2: {
					// validación para Solicitudes
					// función tuya

					break;
				}
				default: {
					setIsStepValid(true); // permitir avance si no hay validación
				}
			}
		};

		validateStep();
	}, [step, dataUser]);

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
			component: <DocumentsApplicant />,
		},
		{
			title: 'Trabajos',
			component: <PaymentApplicant />,
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
				<Box textAlign='center' mt={4}>
					¡Has completado todos los pasos!
				</Box>
			</Steps.CompletedContent>
		</Steps.Root>
	);
};
