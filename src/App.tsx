import React, { useState } from 'react';
import { Layout, BarChart3, Vote, Users, Clock, ArrowUpDown, Loader2, Coins, Scale } from 'lucide-react';
import { useGovernanceData } from './hooks/useGovernanceData';
import type { ChainType } from './services/polkadot';

function App() {
  const [activeChain, setActiveChain] = useState<ChainType>('polkadot');
  const { data, isLoading, error } = useGovernanceData(activeChain);

  const chains = {
    polkadot: {
      color: 'rgb(230, 0, 122)',
      name: 'Polkadot',
    },
    kusama: {
      color: 'rgb(0, 0, 0)',
      name: 'Kusama',
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">Error Loading Data</h2>
          <p className="mt-2 text-gray-600">{error.message || 'Please try again later'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Layout className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Governance Dashboard</h1>
            </div>
            <div className="flex space-x-2">
              {Object.entries(chains).map(([chain, info]) => (
                <button
                  key={chain}
                  onClick={() => setActiveChain(chain as ChainType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeChain === chain
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {info.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : data ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Vote className="h-6 w-6 text-indigo-600" />}
                title="Active Referenda"
                value={data.activeReferenda}
                subtitle="Open for voting"
              />
              <StatCard
                icon={<Users className="h-6 w-6 text-indigo-600" />}
                title="Council Members"
                value={data.councilMembers}
                subtitle="Current council size"
              />
              <StatCard
                icon={<ArrowUpDown className="h-6 w-6 text-indigo-600" />}
                title="Active Delegations"
                value={data.delegations}
                subtitle="Total delegates"
              />
              <StatCard
                icon={<BarChart3 className="h-6 w-6 text-indigo-600" />}
                title="Participation Rate"
                value={data.participation}
                subtitle="Current referenda"
              />
            </div>

            {/* Treasury and Chain Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow px-6 py-5">
                <div className="flex items-center space-x-3 mb-4">
                  <Coins className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-lg font-medium text-gray-900">Treasury Balance</h3>
                </div>
                <p className="text-3xl font-semibold text-gray-900">{data.treasuryBalance}</p>
                <p className="mt-1 text-sm text-gray-500">Available for proposals</p>
              </div>
              <div className="bg-white rounded-lg shadow px-6 py-5">
                <div className="flex items-center space-x-3 mb-4">
                  <Scale className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-lg font-medium text-gray-900">Total Issuance</h3>
                </div>
                <p className="text-3xl font-semibold text-gray-900">{data.totalIssuance}</p>
                <p className="mt-1 text-sm text-gray-500">Total supply</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Governance Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                          {activity.hash && (
                            <p className="text-xs text-gray-400 mt-1">
                              Hash: {activity.hash.slice(0, 10)}...
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-3">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default App;