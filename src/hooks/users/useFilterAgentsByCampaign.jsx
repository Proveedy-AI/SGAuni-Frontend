import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/auth';

export const useFilterAgentsByCampaign = () => {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [campaignId, setCampaignId] = useState('');
	const { getToken } = useAuth();

	const filterAgentsByCampaign = useCallback(
		async (id) => {
			setLoading(true);
			setError(null);

			try {
				const token = getToken();
				if (!token) throw new Error('El usuario no está autenticado.');
				if (!id) throw new Error('El ID de la campaña es inválido.');
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/omnileads/campaigns/${id}/agents`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setData(response.data.agentsCampaign);

				return response.data.agentsCampaign;
			} catch (err) {
				setData([]);
				setError(
					err.response?.data?.message ||
						err.response?.data?.error ||
						err.message ||
						'Ocurrió un error al obtener los agentes de la campaña.'
				);
			} finally {
				setLoading(false);
			}
		},
		[getToken]
	);

	useEffect(() => {
		if (campaignId) filterAgentsByCampaign(campaignId);
	}, [campaignId, filterAgentsByCampaign]);

	return {
		loading,
		data,
		error,
		setCampaignId,
		filterAgentsByCampaign,
	};
};
