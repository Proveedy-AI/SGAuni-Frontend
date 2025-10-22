// src/hooks/countries/useCreateCountry.jsx
import { useMutation } from '@tanstack/react-query';
import axios from '@/api/axios';

export const useCreatePersonWithAdmission = () => {
	
	return useMutation({
		mutationFn: async (payload) => {
			const res = await axios.post(
				'/api/v1/admission-applications/create-with-person/',
				payload
			);
			return res.data;
		},
	});
};
