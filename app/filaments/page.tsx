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
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Prints
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Filament Usage Tracker</h1>
          <p className="text-gray-600">Track filament consumption and costs per person</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {data.summary.map((userUsage) => (
            <div key={userUsage.user} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{userUsage.user}</h3>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Weight:</span>
                  <span className="text-2xl font-bold text-gray-900">{userUsage.totalWeight}g</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600">Owes:</span>
                  <span className="text-2xl font-bold text-blue-600">£{userUsage.totalCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Filament Cost:</span>
            <span className="text-3xl font-bold text-blue-600">£{totalOwed.toFixed(2)}</span>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Filament Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  {data.allFilaments.map((filament) => (
                    <th key={filament} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {filament}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total (g)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost (£)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.summary.map((userUsage) => (
                  <tr key={userUsage.user}>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 text-right">
                      £{userUsage.totalCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>* Cost calculated at £20 per 1kg spool (£0.02/g)</p>
        </div>
      </div>
    </div>
  );
}
