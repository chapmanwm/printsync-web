'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FilamentUsage {
  user: string;
  filaments: Record<string, number>;
  totalWeight: number;
  totalCost: number;
}

interface UsageData {
  summary: FilamentUsage[];
  allFilaments: string[];
}

// Mock data for UI development
const mockUsageData: UsageData = {
  summary: [
    {
      user: 'Alfonso',
      filaments: { 'PLA - FF5722FF': 145.2, 'PETG - 2196F3FF': 78.5 },
      totalWeight: 223.7,
      totalCost: 4.47,
    },
    {
      user: 'Chapman',
      filaments: { 'PLA - 00AE42FF': 89.3, 'ABS - FFFFFFFF': 32.1 },
      totalWeight: 121.4,
      totalCost: 2.43,
    },
    {
      user: 'Malin',
      filaments: { 'PLA - 9C27B0FF': 156.3, 'PLA - 212121FF': 45.8 },
      totalWeight: 202.1,
      totalCost: 4.04,
    },
  ],
  allFilaments: ['PLA - 00AE42FF', 'PLA - FF5722FF', 'PLA - 9C27B0FF', 'PLA - 212121FF', 'PETG - 2196F3FF', 'ABS - FFFFFFFF'],
};

const USE_MOCK_DATA = false;

function parseFilament(filamentKey: string) {
  const [material, colorHex] = filamentKey.split(' - ');
  return { material, colorHex };
}

function hexToRgb(hex: string) {
  if (!hex) return 'rgb(128, 128, 128)';
  const cleanHex = hex.replace('#', '').substring(0, 6);
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function getColorName(hex: string): string {
  if (!hex) return 'Unknown';
  const cleanHex = hex.substring(0, 6);
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (r > 200 && g > 200 && b > 200) return 'White';
  if (r < 50 && g < 50 && b < 50) return 'Black';
  if (r > g && r > b) {
    if (g > 100) return 'Orange';
    return 'Red';
  }
  if (g > r && g > b) return 'Green';
  if (b > r && b > g) return 'Blue';
  if (r > 150 && g > 150) return 'Yellow';
  if (r > 100 && b > 100) return 'Purple';
  return 'Gray';
}

export default function FilamentsPage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_MOCK_DATA) {
          setData(mockUsageData);
        } else {
          const res = await fetch('/api/filament-usage');
          const json = await res.json();
          // Ensure the response has the expected structure
          if (json && json.summary && Array.isArray(json.summary)) {
            setData(json);
          } else {
            setData({ summary: [], allFilaments: [] });
          }
        }
      } catch (error) {
        console.error('Error fetching filament usage:', error);
        setData({ summary: [], allFilaments: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d0d0d' }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#2a2a2a', borderTopColor: '#00AE42' }} />
      </div>
    );
  }

  if (!data || data.summary.length === 0) {
    return (
      <div className="min-h-screen" style={{ background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 transition-colors"
            style={{ color: '#666' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00AE42'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Prints
          </Link>
          <div className="text-center py-20 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#666' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium text-white mb-2">No usage data yet</p>
            <p style={{ color: '#666' }}>Claim some prints first to see filament usage!</p>
          </div>
        </div>
      </div>
    );
  }

  const totalOwed = data.summary.reduce((sum, user) => sum + user.totalCost, 0);
  const totalWeight = data.summary.reduce((sum, user) => sum + user.totalWeight, 0);

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0d' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="p-2 rounded-lg transition-colors"
                style={{ background: '#1a1a1a', color: '#666' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00AE42';
                  e.currentTarget.style.background = '#252525';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#666';
                  e.currentTarget.style.background = '#1a1a1a';
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">Filament Usage</h1>
                <p className="text-sm" style={{ color: '#666' }}>Cost tracking by user</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Total Cost Banner */}
        <div
          className="rounded-xl p-6 mb-8 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #00AE42 0%, #008F36 100%)' }}
        >
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="text-sm text-white/80 mb-1">Total Filament Cost</div>
              <div className="text-4xl font-bold text-white">£{totalOwed.toFixed(2)}</div>
              <div className="text-sm text-white/60 mt-1">{totalWeight.toFixed(1)}g total used</div>
            </div>
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <svg className="w-10 h-10 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <div className="absolute right-20 -top-8 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {data.summary.map((userUsage, index) => (
            <div
              key={userUsage.user}
              className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]"
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{
                    background: index === 0 ? '#00AE42' : index === 1 ? '#2196F3' : '#9C27B0',
                    color: 'white'
                  }}
                >
                  {userUsage.user[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{userUsage.user}</h3>
                  <p className="text-sm" style={{ color: '#666' }}>{Object.keys(userUsage.filaments).length} filaments used</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg" style={{ background: '#141414' }}>
                  <div className="text-xs mb-1" style={{ color: '#666' }}>Total Weight</div>
                  <div className="text-xl font-bold text-white">{userUsage.totalWeight.toFixed(1)}g</div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: '#141414' }}>
                  <div className="text-xs mb-1" style={{ color: '#666' }}>Amount Owed</div>
                  <div className="text-xl font-bold" style={{ color: '#00AE42' }}>£{userUsage.totalCost.toFixed(2)}</div>
                </div>
              </div>

              {/* User's filament breakdown */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #2a2a2a' }}>
                <div className="text-xs mb-2" style={{ color: '#666' }}>Filaments Used</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(userUsage.filaments).map(([filament, weight]) => {
                    const { material, colorHex } = parseFilament(filament);
                    const color = hexToRgb(colorHex);
                    return (
                      <div
                        key={filament}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
                        style={{ background: '#252525' }}
                      >
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                        <span style={{ color: '#a0a0a0' }}>{material}</span>
                        <span className="text-white font-medium">{weight.toFixed(1)}g</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filament Inventory */}
        <div className="rounded-xl overflow-hidden mb-8" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #2a2a2a' }}>
            <svg className="w-5 h-5" style={{ color: '#00AE42' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h2 className="text-lg font-semibold text-white">Filament Spools</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {data.allFilaments.map((filament) => {
                const { material, colorHex } = parseFilament(filament);
                const color = hexToRgb(colorHex);
                const colorName = getColorName(colorHex);
                const totalUsage = data.summary.reduce((sum, user) => sum + (user.filaments[filament] || 0), 0);

                return (
                  <div
                    key={filament}
                    className="p-4 rounded-xl text-center transition-all duration-200 hover:scale-105"
                    style={{ background: '#141414', border: '1px solid #2a2a2a' }}
                  >
                    {/* Spool visualization */}
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(${color} 0deg, ${color} 270deg, #2a2a2a 270deg)`,
                          opacity: 0.3
                        }}
                      />
                      <div
                        className="absolute inset-2 rounded-full"
                        style={{ background: '#141414' }}
                      />
                      <div
                        className="absolute inset-4 rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                    <div className="font-medium text-white text-sm">{material}</div>
                    <div className="text-xs" style={{ color: '#666' }}>{colorName}</div>
                    <div className="text-xs mt-1" style={{ color: '#00AE42' }}>{totalUsage.toFixed(1)}g used</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #2a2a2a' }}>
            <h2 className="text-lg font-semibold text-white">Detailed Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#141414' }}>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#666' }}>
                    User
                  </th>
                  {data.allFilaments.map((filament) => {
                    const { material, colorHex } = parseFilament(filament);
                    const color = hexToRgb(colorHex);
                    return (
                      <th key={filament} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#666' }}>
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                          <span>{material}</span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#666' }}>
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: '#666' }}>
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.summary.map((userUsage, index) => (
                  <tr
                    key={userUsage.user}
                    className="transition-colors"
                    style={{ borderTop: index > 0 ? '1px solid #2a2a2a' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#252525'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                          style={{ background: '#00AE42', color: 'white' }}
                        >
                          {userUsage.user[0]}
                        </div>
                        <span className="font-medium text-white">{userUsage.user}</span>
                      </div>
                    </td>
                    {data.allFilaments.map((filament) => (
                      <td key={filament} className="px-6 py-4 whitespace-nowrap text-sm text-right" style={{ color: '#a0a0a0' }}>
                        {userUsage.filaments[filament]
                          ? `${userUsage.filaments[filament].toFixed(1)}g`
                          : '-'}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white text-right">
                      {userUsage.totalWeight.toFixed(1)}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right" style={{ color: '#00AE42' }}>
                      £{userUsage.totalCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: '#666' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Cost calculated at £20 per 1kg spool (£0.02/g)</p>
        </div>
      </main>
    </div>
  );
}
