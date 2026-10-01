// src/pages/Reports.tsx
import React, { useState } from 'react';
import {
  BarChart2, Download, Calendar, TrendingUp, Filter
} from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { SALES_CHART_DATA, TOP_PRODUCTS_DATA } from '../data/mockData';
import { useApp } from '../context/AppContext';

const REPORT_TYPES = [
  { id: 'sales', label: 'Sales Report' },
  { id: 'inventory', label: 'Inventory Report' },
  { id: 'transactions', label: 'Transaction Report' },
  { id: 'performance', label: 'Operational Performance' },
];

function formatPeso(amount: number) {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const SUMMARY_DATA = {
  sales: [
    { label: 'Total Revenue', value: '₱107,400.00', sub: 'This week' },
    { label: 'Avg Daily Sales', value: '₱21,480.00', sub: '5-day average' },
    { label: 'Peak Day', value: 'Friday', sub: '₱24,850.00' },
    { label: 'Total Transactions', value: '553', sub: 'This week' },
  ],
  inventory: [
    { label: 'Total Stock Value', value: '₱284,520.00', sub: 'Current retail value' },
    { label: 'Products Tracked', value: '128', sub: 'Active SKUs' },
    { label: 'Low Stock Alerts', value: '7', sub: 'Need attention' },
    { label: 'Out of Stock', value: '2', sub: 'Immediate restock' },
  ],
  transactions: [
    { label: 'Total Transactions', value: '553', sub: 'This week' },
    { label: 'Completed', value: '549', sub: '99.3% completion rate' },
    { label: 'Voided', value: '3', sub: '0.5% void rate' },
    { label: 'Pending', value: '1', sub: 'Awaiting approval' },
  ],
  performance: [
    { label: 'System Uptime', value: '99.8%', sub: 'Last 30 days' },
    { label: 'Avg Response Time', value: '1.2s', sub: 'System performance' },
    { label: 'Active Users', value: '5', sub: 'This week' },
    { label: 'Audit Logs', value: '2,840', sub: 'Actions recorded' },
  ],
};

const INVENTORY_TREND = [
  { name: 'Beverages', stockIn: 96, stockOut: 60 },
  { name: 'Snacks', stockIn: 72, stockOut: 45 },
  { name: 'Cleaning', stockIn: 48, stockOut: 30 },
  { name: 'Personal Care', stockIn: 60, stockOut: 40 },
  { name: 'Dairy', stockIn: 24, stockOut: 18 },
  { name: 'Condiments', stockIn: 36, stockOut: 25 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3" style={{ fontSize: 13 }}>
        <div className="font-semibold text-gray-700 mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color }}>
            {typeof p.value === 'number' && p.value > 1000 ? formatPeso(p.value) : `${p.value} ${p.name === 'sold' ? 'units' : ''}`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const { addToast } = useApp();
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState('This Week');
  const [generating, setGenerating] = useState(false);

  const handleExport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      addToast('Report generated successfully. Check your downloads.', 'success');
    }, 1800);
  };

  const summaryData = SUMMARY_DATA[activeReport as keyof typeof SUMMARY_DATA];

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <div className="text-sm text-gray-500 mt-1">Data analytics and business reporting</div>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={handleExport}
          disabled={generating}
        >
          {generating ? (
            <>
              <div
                className="spin"
                style={{
                  width: 15,
                  height: 15,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                }}
              />
              Generating...
            </>
          ) : (
            <>
              <Download size={16} />
              Export Report
            </>
          )}
        </button>
      </div>

      {/* Report type tabs */}
      <div className="flex items-center gap-2 mb-6">
        {REPORT_TYPES.map(r => (
          <button
            key={r.id}
            onClick={() => setActiveReport(r.id)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: activeReport === r.id ? '#3b82f6' : 'white',
              color: activeReport === r.id ? 'white' : '#374151',
              border: `1px solid ${activeReport === r.id ? '#3b82f6' : '#e2e8f0'}`,
              boxShadow: activeReport === r.id ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
            }}
          >
            {r.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="rounded-xl text-sm px-3 py-2 outline-none"
            style={{ background: 'white', border: '1px solid #e2e8f0', color: '#374151' }}
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last Quarter</option>
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {summaryData.map(c => (
          <div key={c.label} className="card p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{c.label}</div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-xs text-gray-400 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      {activeReport === 'sales' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="card p-6">
            <div className="font-bold text-gray-900 mb-1">Sales Trend</div>
            <div className="text-sm text-gray-400 mb-4">Daily revenue — this week</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={SALES_CHART_DATA}>
                <defs>
                  <linearGradient id="salesGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={v => v === 0 ? '₱0' : `₱${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2.5} fill="url(#salesGrad2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-6">
            <div className="font-bold text-gray-900 mb-1">Top Products</div>
            <div className="text-sm text-gray-400 mb-4">Units sold this week</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TOP_PRODUCTS_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={140}
                  tickFormatter={v => v.length > 18 ? v.slice(0, 18) + '…' : v}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sold" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeReport === 'inventory' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="card p-6 col-span-2">
            <div className="font-bold text-gray-900 mb-1">Inventory Movement by Category</div>
            <div className="text-sm text-gray-400 mb-4">Stock in vs stock out — this week</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={INVENTORY_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="stockIn" name="Stock In" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stockOut" name="Stock Out" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {(activeReport === 'transactions' || activeReport === 'performance') && (
        <div className="card p-8 text-center">
          <BarChart2 size={40} className="mx-auto mb-3 text-gray-300" />
          <div className="font-bold text-gray-700 text-lg">
            {REPORT_TYPES.find(r => r.id === activeReport)?.label}
          </div>
          <div className="text-gray-500 mt-2 mb-6">
            Detailed report for the selected period is ready. Export to view the full breakdown.
          </div>
          <button className="btn-primary flex items-center gap-2 mx-auto" onClick={handleExport}>
            <Download size={16} />
            Export {REPORT_TYPES.find(r => r.id === activeReport)?.label}
          </button>
        </div>
      )}
    </div>
  );
}
