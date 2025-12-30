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

// Mock data for UI development
const mockPrints: Print[] = [
  {
    id: '1',
    title: 'Benchy 3D Boat',
    cover: null,
    status: 'success',
    start_time: new Date(Date.now() - 3600000 * 2).toISOString(),
    end_time: new Date(Date.now() - 3600000).toISOString(),
    total_weight: 12.5,
    filament_1_material: 'PLA',
    filament_1_colour: '00AE42FF',
    filament_1_weight: 12.5,
    filament_2_material: null, filament_2_colour: null, filament_2_weight: null,
    filament_3_material: null, filament_3_colour: null, filament_3_weight: null,
    filament_4_material: null, filament_4_colour: null, filament_4_weight: null,
    claimed_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Phone Stand v2',
    cover: null,
    status: 'success',
    start_time: new Date(Date.now() - 3600000 * 5).toISOString(),
    end_time: new Date(Date.now() - 3600000 * 3).toISOString(),
    total_weight: 45.2,
    filament_1_material: 'PETG',
    filament_1_colour: 'FF5722FF',
    filament_1_weight: 45.2,
    filament_2_material: null, filament_2_colour: null, filament_2_weight: null,
    filament_3_material: null, filament_3_colour: null, filament_3_weight: null,
    filament_4_material: null, filament_4_colour: null, filament_4_weight: null,
    claimed_by: 'Alfonso',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Cable Management Clip (x10)',
    cover: null,
    status: 'success',
    start_time: new Date(Date.now() - 3600000 * 8).toISOString(),
    end_time: new Date(Date.now() - 3600000 * 6).toISOString(),
    total_weight: 8.7,
    filament_1_material: 'PLA',
    filament_1_colour: '212121FF',
    filament_1_weight: 8.7,
    filament_2_material: null, filament_2_colour: null, filament_2_weight: null,
    filament_3_material: null, filament_3_colour: null, filament_3_weight: null,
    filament_4_material: null, filament_4_colour: null, filament_4_weight: null,
    claimed_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Articulated Dragon',
    cover: null,
    status: 'printing',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: null,
    total_weight: 156.3,
    filament_1_material: 'PLA',
    filament_1_colour: '9C27B0FF',
    filament_1_weight: 156.3,
    filament_2_material: null, filament_2_colour: null, filament_2_weight: null,
    filament_3_material: null, filament_3_colour: null, filament_3_weight: null,
    filament_4_material: null, filament_4_colour: null, filament_4_weight: null,
    claimed_by: null,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Keyboard Keycap Set',
    cover: null,
    status: 'success',
    start_time: new Date(Date.now() - 3600000 * 12).toISOString(),
    end_time: new Date(Date.now() - 3600000 * 10).toISOString(),
    total_weight: 32.1,
    filament_1_material: 'ABS',
    filament_1_colour: 'FFFFFFFF',
    filament_1_weight: 32.1,
    filament_2_material: null, filament_2_colour: null, filament_2_weight: null,
    filament_3_material: null, filament_3_colour: null, filament_3_weight: null,
    filament_4_material: null, filament_4_colour: null, filament_4_weight: null,
    claimed_by: 'Chapman',
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Headphone Hook Wall Mount',
    cover: null,
    status: 'success',
    start_time: new Date(Date.now() - 3600000 * 4).toISOString(),
    end_time: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    total_weight: 28.4,
    filament_1_material: 'PLA',
    filament_1_colour: '2196F3FF',
    filament_1_weight: 28.4,
    filament_2_material: null, filament_2_colour: null, filament_2_weight: null,
    filament_3_material: null, filament_3_colour: null, filament_3_weight: null,
    filament_4_material: null, filament_4_colour: null, filament_4_weight: null,
    claimed_by: null,
    created_at: new Date().toISOString(),
  },
];

// Set to true to use mock data (for UI development without database)
const USE_MOCK_DATA = false;

// Helper to convert hex color to RGB
function hexToRgb(hex: string): string {
  if (!hex) return 'rgb(128, 128, 128)';
  const cleanHex = hex.replace('#', '').substring(0, 6);
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function Home() {
  const [prints, setPrints] = useState<Print[]>([]);
  const [allPrints, setAllPrints] = useState<Print[]>([]); // For accurate counts
  const [filter, setFilter] = useState<'unclaimed' | 'all' | 'claimed'>('unclaimed');
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());

  // Sort prints by end_time or created_at, newest first
  const sortPrints = (data: Print[]) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.end_time || a.created_at).getTime();
      const dateB = new Date(b.end_time || b.created_at).getTime();
      return dateB - dateA; // Descending (newest first)
    });
  };

  // Fetch all prints once on mount for accurate counts
  const fetchAllPrints = async () => {
    if (USE_MOCK_DATA) {
      setAllPrints(mockPrints);
      return;
    }
    try {
      const res = await fetch('/api/prints');
      const data = await res.json();
      setAllPrints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching all prints:', error);
    }
  };

  const fetchPrints = async () => {
    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        let filteredPrints = mockPrints;
        if (filter === 'claimed') {
          filteredPrints = mockPrints.filter(p => p.claimed_by !== null);
        } else if (filter === 'unclaimed') {
          filteredPrints = mockPrints.filter(p => p.claimed_by === null);
        }
        setPrints(sortPrints(filteredPrints));
      } else {
        const url = filter === 'all'
          ? '/api/prints'
          : `/api/prints?claimed=${filter === 'claimed'}`;
        const res = await fetch(url);
        const data = await res.json();
        const printsData = Array.isArray(data) ? data : [];
        setPrints(sortPrints(printsData));
        // Update allPrints when fetching 'all' to keep counts fresh
        if (filter === 'all') {
          setAllPrints(printsData);
        }
      }
    } catch (error) {
      console.error('Error fetching prints:', error);
      setPrints([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all prints on mount for accurate counts
  useEffect(() => {
    fetchAllPrints();
  }, []);

  useEffect(() => {
    fetchPrints();
  }, [filter]);

  const claimPrint = async (printId: string, user: string) => {
    // Optimistically update UI immediately
    const updateClaim = (p: Print) => p.id === printId ? { ...p, claimed_by: user } : p;
    setPrints(prev => prev.map(updateClaim));
    setAllPrints(prev => prev.map(updateClaim));

    if (USE_MOCK_DATA) return;

    try {
      const res = await fetch(`/api/prints/${printId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });
      if (!res.ok) {
        // Revert on failure
        const revert = (p: Print) => p.id === printId ? { ...p, claimed_by: null } : p;
        setPrints(prev => prev.map(revert));
        setAllPrints(prev => prev.map(revert));
      }
    } catch (error) {
      console.error('Error claiming print:', error);
      // Revert on error
      const revert = (p: Print) => p.id === printId ? { ...p, claimed_by: null } : p;
      setPrints(prev => prev.map(revert));
      setAllPrints(prev => prev.map(revert));
    }
  };

  const unclaimPrint = async (printId: string) => {
    // Store previous value for potential revert
    const previousClaim = prints.find(p => p.id === printId)?.claimed_by;

    // Optimistically update UI immediately
    const updateUnclaim = (p: Print) => p.id === printId ? { ...p, claimed_by: null } : p;
    setPrints(prev => prev.map(updateUnclaim));
    setAllPrints(prev => prev.map(updateUnclaim));

    if (USE_MOCK_DATA) return;

    try {
      const res = await fetch(`/api/prints/${printId}/unclaim`, { method: 'POST' });
      if (!res.ok) {
        // Revert on failure
        const revert = (p: Print) => p.id === printId ? { ...p, claimed_by: previousClaim ?? null } : p;
        setPrints(prev => prev.map(revert));
        setAllPrints(prev => prev.map(revert));
      }
    } catch (error) {
      console.error('Error unclaiming print:', error);
      // Revert on error
      const revert = (p: Print) => p.id === printId ? { ...p, claimed_by: previousClaim ?? null } : p;
      setPrints(prev => prev.map(revert));
      setAllPrints(prev => prev.map(revert));
    }
  };

  const formatDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return '--';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return { label: 'Complete', color: 'text-[#00AE42]', bg: 'bg-[#00AE42]/10', dot: 'bg-[#00AE42]' };
      case 'printing':
        return { label: 'Printing', color: 'text-[#00AE42]', bg: 'bg-[#00AE42]/10', dot: 'bg-[#00AE42] animate-pulse' };
      case 'canceled':
        return { label: 'Canceled', color: 'text-[#666]', bg: 'bg-[#666]/10', dot: 'bg-[#666]' };
      case 'failed':
        return { label: 'Failed', color: 'text-[#E53935]', bg: 'bg-[#E53935]/10', dot: 'bg-[#E53935]' };
      default:
        return { label: status, color: 'text-[#666]', bg: 'bg-[#666]/10', dot: 'bg-[#666]' };
    }
  };

  const getImageUrl = (coverUrl: string | null) => {
    if (!coverUrl) return null;
    if (coverUrl.includes('or-cloud-model-prod.s3') && coverUrl.includes('/private/')) {
      return `/api/image-proxy?url=${encodeURIComponent(coverUrl)}`;
    }
    return coverUrl;
  };

  // Calculate counts from allPrints state (fetched on mount)
  const counts = {
    unclaimed: allPrints.filter(p => !p.claimed_by).length,
    claimed: allPrints.filter(p => p.claimed_by).length,
    all: allPrints.length,
  };

  return (
    <div className="min-h-screen" style={{ background: '#0d0d0d' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#2a2a2a', background: '#0d0d0d' }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#00AE42' }}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">PrintSync</h1>
                <p className="text-sm" style={{ color: '#666' }}>Filament Tracking</p>
              </div>
            </div>

            <a
              href="/filaments"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{ background: '#00AE42', color: 'white' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              Usage Stats
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8">
          {(['unclaimed', 'claimed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === tab
                  ? 'text-white'
                  : 'text-[#666] hover:text-white hover:bg-[#1a1a1a]'
              }`}
              style={filter === tab ? { background: '#1a1a1a', borderColor: '#00AE42', borderWidth: '1px' } : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full" style={{ background: filter === tab ? '#00AE42' : '#2a2a2a' }}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#2a2a2a', borderTopColor: '#00AE42' }} />
          </div>
        ) : prints.length === 0 ? (
          <div className="text-center py-20 rounded-xl" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <svg className="w-16 h-16 mx-auto mb-4" style={{ color: '#666' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-lg font-medium text-white mb-2">No prints found</p>
            <p style={{ color: '#666' }}>Prints will appear here once they&apos;re synced from your printer</p>
          </div>
        ) : (
          /* Print Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {prints.map((print) => {
              const imageUrl = getImageUrl(print.cover);
              const status = getStatusConfig(print.status);
              const filamentColor = print.filament_1_colour ? hexToRgb(print.filament_1_colour) : null;

              return (
                <div
                  key={print.id}
                  className="rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                >
                  {/* Image/Placeholder with filament color accent */}
                  <div className="relative h-44" style={{ background: '#141414' }}>
                    {/* Filament color bar */}
                    {filamentColor && (
                      <div
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ background: filamentColor }}
                      />
                    )}

                    {imageUrl && !brokenImages.has(print.id) ? (
                      <Image
                        src={imageUrl}
                        alt={print.title}
                        fill
                        className="object-cover"
                        unoptimized
                        onError={() => setBrokenImages(prev => new Set([...prev, print.id]))}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 mb-2" style={{ color: '#333' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {filamentColor && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: filamentColor }} />
                            <span className="text-xs" style={{ color: '#666' }}>{print.filament_1_material}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-3 line-clamp-1">{print.title}</h3>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <div className="text-xs mb-1" style={{ color: '#666' }}>Weight</div>
                        <div className="text-sm font-medium text-white">
                          {print.total_weight ? `${print.total_weight}g` : '--'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1" style={{ color: '#666' }}>Duration</div>
                        <div className="text-sm font-medium text-white">
                          {formatDuration(print.start_time, print.end_time)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs mb-1" style={{ color: '#666' }}>Cost</div>
                        <div className="text-sm font-medium" style={{ color: '#00AE42' }}>
                          {print.total_weight ? `£${(print.total_weight * 0.02).toFixed(2)}` : '--'}
                        </div>
                      </div>
                    </div>

                    {/* Claim Section */}
                    {print.claimed_by ? (
                      <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#141414' }}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                            style={{ background: '#00AE42', color: 'white' }}
                          >
                            {print.claimed_by[0]}
                          </div>
                          <span className="text-sm text-white">{print.claimed_by}</span>
                        </div>
                        <button
                          onClick={() => unclaimPrint(print.id)}
                          className="text-xs px-3 py-1.5 rounded-md transition-colors"
                          style={{ color: '#666', background: '#1a1a1a' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#E53935';
                            e.currentTarget.style.background = '#E53935' + '15';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#666';
                            e.currentTarget.style.background = '#1a1a1a';
                          }}
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
                            className="px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                            style={{ background: '#252525', color: '#a0a0a0', border: '1px solid #2a2a2a' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#00AE42';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.borderColor = '#00AE42';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#252525';
                              e.currentTarget.style.color = '#a0a0a0';
                              e.currentTarget.style.borderColor = '#2a2a2a';
                            }}
                          >
                            {user}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
