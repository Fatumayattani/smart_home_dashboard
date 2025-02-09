import { ApiPromise, WsProvider } from '@polkadot/api';

const POLKADOT_ENDPOINT = 'wss://rpc.polkadot.io';
const KUSAMA_ENDPOINT = 'wss://kusama-rpc.polkadot.io';

export type ChainType = 'polkadot' | 'kusama';

export interface GovernanceData {
  activeReferenda: number;
  councilProposals: number;
  delegations: number;
  participation: string;
  totalIssuance: string;
  recentActivity: Array<{
    title: string;
    description: string;
    time: string;
    hash?: string;
  }>;
  treasuryBalance: string;
  councilMembers: number;
}

let polkadotApi: ApiPromise | null = null;
let kusamaApi: ApiPromise | null = null;

export async function getApi(chain: ChainType): Promise<ApiPromise> {
  const endpoint = chain === 'polkadot' ? POLKADOT_ENDPOINT : KUSAMA_ENDPOINT;
  const api = chain === 'polkadot' ? polkadotApi : kusamaApi;

  if (api?.isConnected) {
    return api;
  }

  try {
    const provider = new WsProvider(endpoint);
    const newApi = await ApiPromise.create({ provider });

    if (chain === 'polkadot') {
      polkadotApi = newApi;
    } else {
      kusamaApi = newApi;
    }

    return newApi;
  } catch (error) {
    console.error(`Failed to connect to ${chain} network:`, error);
    throw new Error(`Connection to ${chain} failed. Please try again later.`);
  }
}

function formatBalance(balance: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const main = balance / divisor;
  const fraction = balance % divisor;
  return `${main}.${fraction.toString().padStart(decimals, '0')}`;
}

export async function fetchGovernanceData(chain: ChainType): Promise<GovernanceData> {
  try {
    const api = await getApi(chain);
    
    // Fetch real governance data
    const [
      referendumCount,
      proposals,
      councilMembers,
      totalIssuance,
      treasuryAccount,
      recentEvents
    ] = await Promise.all([
      api.query.democracy.referendumCount(),
      api.query.democracy.publicProps(),
      api.query.council.members(),
      api.query.balances.totalIssuance(),
      api.query.system.account(api.consts.treasury.palletId),
      api.query.system.events()
    ]);

    // Format balances
    const decimals = api.registry.chainDecimals[0];
    const formattedIssuance = formatBalance(totalIssuance.toBigInt(), decimals);
    const treasuryBalance = formatBalance((treasuryAccount as any).data.free.toBigInt(), decimals);

    // Process recent events for activity feed
    const recentActivity = recentEvents
      .filter((event) => {
        const { section, method } = event.event;
        return ['democracy', 'council', 'treasury'].includes(section);
      })
      .slice(0, 5)
      .map((event) => {
        const { section, method } = event.event;
        const timestamp = new Date().toISOString(); // In production, you'd get this from a block timestamp
        
        return {
          title: `${section} ${method}`,
          description: `New ${section} activity: ${method}`,
          time: '< 1h ago',
          hash: event.hash.toHex()
        };
      });

    // Calculate participation rate based on recent referenda
    const activeReferendaCount = referendumCount.toNumber();
    const councilProposalsCount = proposals.length;
    const councilMembersCount = councilMembers.length;

    return {
      activeReferenda: activeReferendaCount,
      councilProposals: councilProposalsCount,
      delegations: await calculateDelegations(api),
      participation: await calculateParticipation(api),
      totalIssuance: formattedIssuance,
      recentActivity,
      treasuryBalance,
      councilMembers: councilMembersCount
    };
  } catch (error) {
    console.error(`Error fetching ${chain} governance data:`, error);
    throw error;
  }
}

async function calculateDelegations(api: ApiPromise): Promise<number> {
  try {
    const delegations = await api.query.democracy.votingOf.entries();
    return delegations.filter(([_, voting]) => {
      const votingData = voting.toJSON();
      return votingData && votingData.isDelegating;
    }).length;
  } catch (error) {
    console.error('Error calculating delegations:', error);
    return 0;
  }
}

async function calculateParticipation(api: ApiPromise): Promise<string> {
  try {
    const referendums = await api.query.democracy.referendumInfoOf.entries();
    let totalVoters = 0;
    let totalReferenda = 0;

    referendums.forEach(([_, info]) => {
      const referendum = info.unwrapOr(null);
      if (referendum && !referendum.isNone) {
        totalReferenda++;
        if (referendum.asOngoing) {
          const votes = referendum.asOngoing.tally;
          totalVoters += votes.ayes.length + votes.nays.length;
        }
      }
    });

    const participation = totalReferenda > 0 
      ? ((totalVoters / totalReferenda) * 100).toFixed(1)
      : '0.0';
    
    return `${participation}%`;
  } catch (error) {
    console.error('Error calculating participation:', error);
    return '0.0%';
  }
}