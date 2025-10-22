import useAxiosPrivate from '@/hooks/axios/useAxiosPrivate';
import { useMutation } from '@tanstack/react-query';

export const useReadPaymentOrdersTemplateByProgram = () => {
	const axiosPrivate = useAxiosPrivate();

	return useMutation({
		mutationFn: async (uuid) => {
			if (!uuid) throw new Error('UUID requerido');
			const res = await axiosPrivate.get(
				`/api/v1/enrollment-programs/payment-orders/template/${uuid}/`,
				{
					responseType: 'blob', // ✅ Muy importante para archivos
				}
			);
			return res.data;
		},
	});
};
