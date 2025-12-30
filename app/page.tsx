'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Print {
  id: string;
  title: string;
  cover: string | null;
  status: string;
  start_time: string | null;
  end_time: string | null;
  total_weight: number | null;
  filament_1_material: string | null;
  filament_1_colour: string | null;
  filament_1_weight: number | null;
  filament_2_material: string | null;
  filament_2_colour: string | null;
  filament_2_weight: number | null;
  filament_3_material: string | null;
  filament_3_colour: string | null;
  filament_3_weight: number | null;
  filament_4_material: string | null;
  filament_4_colour: string | null;
  filament_4_weight: number | null;
  claimed_by: string | null;
  created_at: string;
}

const users = ['Alfonso', 'Chapman', 'Malin', 'Other'];

export default function Home() {
  const [prints, setPrints] = useState<Print[]>([]);
  const [filter, setFilter] = useState<'unclaimed' | 'all' | 'claimed'>('unclaimed');
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  const fetchPrints = async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? '/api/prints'
        : `/api/prints?claimed=${filter === 'claimed'}`;
      const res = await fetch(url);
      const data = await res.json();
      setPrints(data);
    } catch (error) {
      console.error('Error fetching prints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrints();
  }, [filter]);

  const claimPrint = async (printId: string, user: string) => {
    try {
      const res = await fetch(`/api/prints/${printId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });

      if (res.ok) {
        fetchPrints();
      }
    } catch (error) {
      console.error('Error claiming print:', error);
    }
  };

  const unclaimPrint = async (printId: string) => {
    try {
      const res = await fetch(`/api/prints/${printId}/unclaim`, {
        method: 'POST',
      });

      if (res.ok) {
        fetchPrints();
      }
    } catch (error) {
      console.error('Error unclaiming print:', error);
    }
  };

  const formatDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return 'Unknown';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'printing': return 'text-blue-600 bg-blue-50';
      case 'canceled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">PrintSync</h1>
            <p className="text-gray-600">3D printer filament tracking</p>
          </div>
          <a
            href="/filaments"
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            View Filament Usage
          </a>
        </div>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('unclaimed')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'unclaimed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Unclaimed ({prints.filter(p => !p.claimed_by).length})
          </button>
          <button
            onClick={() => setFilter('claimed')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'claimed'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Claimed
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : prints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No prints found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prints.map((print) => (
              <div key={print.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {print.cover && !brokenImages.has(print.id) ? (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={print.cover}
                      alt={print.title}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={() => {
                        setBrokenImages(prev => new Set([...prev, print.id]));
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{print.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(print.status)}`}>
                      {print.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    {print.total_weight && (
                      <div className="flex justify-between">
                        <span>Filament:</span>
                        <span className="font-medium">{print.total_weight}g</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{formatDuration(print.start_time, print.end_time)}</span>
                    </div>
                    {print.end_time && (
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-medium">{new Date(print.end_time).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {print.claimed_by ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Claimed by <span className="font-medium text-gray-900">{print.claimed_by}</span>
                      </span>
                      <button
                        onClick={() => unclaimPrint(print.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Unclaim
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {users.map((user) => (
                        <button
                          key={user}
                          onClick={() => claimPrint(print.id, user)}
                          className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {user}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
