import useSWR from 'swr';
import { fetchGovernanceData, ChainType, GovernanceData } from '../services/polkadot';

export function useGovernanceData(chain: ChainType) {
  const { data, error, isLoading } = useSWR<GovernanceData>(
    ['governance', chain],
    () => fetchGovernanceData(chain),
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    data,
    isLoading,
    error,
  };
}