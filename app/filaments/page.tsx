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

// Parse material and color from filament key like "PLA - F98C36FF"
function parseFilament(filamentKey: string) {
  const [material, colorHex] = filamentKey.split(' - ');
  return { material, colorHex };
}

// Convert hex color (with alpha) to CSS color
function hexToRgb(hex: string) {
  // Handle 8-character hex (RRGGBBAA)
  if (hex.length === 8) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  // Handle 6-character hex (RRGGBB)
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return '#808080'; // Default gray
}

// Get color name approximation
function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
  if (!match) return 'Unknown';

  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);

  // Simple color naming based on dominant channel
  if (r > 200 && g > 200 && b > 200) return 'White';
  if (r < 50 && g < 50 && b < 50) return 'Black';
  if (r > g && r > b) {
    if (g > 100) return 'Orange';
    return 'Red';
  }
  if (g > r && g > b) return 'Green';
  if (b > r && b > g) return 'Blue';
  if (r > 150 && g > 150) return 'Yellow';
  return 'Gray';
}

export default function FilamentsPage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/filament-usage');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching filament usage:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.summary.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Prints
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Filament Usage</h1>
          <p className="text-gray-600 mb-8">No filament usage data yet. Claim some prints first!</p>
        </div>
      </div>
    );
  }

  const totalOwed = data.summary.reduce((sum, user) => sum + user.totalCost, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Prints
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Filament Cost Tracker</h1>
          <p className="text-gray-600">Monitor shared filament usage and costs</p>
        </div>

        {/* User Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {data.summary.map((userUsage) => (
            <div key={userUsage.user} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  {userUsage.user[0]}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{userUsage.user}</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Weight</div>
                  <div className="text-2xl font-bold text-gray-900">{userUsage.totalWeight}g</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount Owed</div>
                  <div className="text-3xl font-bold text-green-600">£{userUsage.totalCost.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total Cost Banner */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-90 mb-1">Total Shared Filament Cost</div>
              <div className="text-4xl font-bold">£{totalOwed.toFixed(2)}</div>
            </div>
            <svg className="w-16 h-16 opacity-20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Filament Spools Overview */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Filament Spools
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.allFilaments.map((filament) => {
                const { material, colorHex } = parseFilament(filament);
                const color = hexToRgb(colorHex);
                const colorName = getColorName(colorHex);
                const totalUsage = data.summary.reduce((sum, user) => sum + (user.filaments[filament] || 0), 0);

                return (
                  <div key={filament} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div
                      className="w-12 h-12 rounded-full border-4 border-white shadow-md flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900">{material}</div>
                      <div className="text-sm text-gray-600">{colorName}</div>
                      <div className="text-xs text-gray-500">{Math.round(totalUsage * 10) / 10}g total</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Usage Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">Detailed Usage Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  {data.allFilaments.map((filament) => {
                    const { material, colorHex } = parseFilament(filament);
                    const color = hexToRgb(colorHex);
                    return (
                      <th key={filament} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center justify-end gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                          <span>{material}</span>
                        </div>
                      </th>
                    );
                  })}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.summary.map((userUsage) => (
                  <tr key={userUsage.user} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {userUsage.user}
                    </td>
                    {data.allFilaments.map((filament) => (
                      <td key={filament} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {userUsage.filaments[filament]
                          ? `${Math.round(userUsage.filaments[filament] * 10) / 10}g`
                          : '-'}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                      {userUsage.totalWeight}g
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 text-right">
                      £{userUsage.totalCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Cost calculated at £20 per 1kg spool (£0.02/g)</p>
        </div>
      </div>
    </div>
  );
}
