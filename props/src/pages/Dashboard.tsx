// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import {
  TrendingUp, ShoppingCart, Package, Clock,
  Bell, AlertTriangle, CheckCircle2, Info,
  ArrowUpRight, ArrowDownRight, ChevronRight, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MOCK_TRANSACTIONS, SALES_CHART_DATA, INVENTORY_CHART_DATA, TOP_PRODUCTS_DATA } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const RECENT_ACTIVITIES = [
  { id: 1, text: 'Inventory updated — Bear Brand Powdered Milk out of stock', time: '9:22 AM', type: 'warning', icon: <Package size={14} /> },
  { id: 2, text: 'Transaction TRX-10482 completed — ₱521.00', time: '9:18 AM', type: 'success', icon: <CheckCircle2 size={14} /> },
  { id: 3, text: 'New announcement posted by Ma. Teresa Soriano', time: '9:00 AM', type: 'info', icon: <Bell size={14} /> },
  { id: 4, text: 'Stock adjustment approved — Regent Cheese Rings (−3)', time: '8:50 AM', type: 'warning', icon: <AlertTriangle size={14} /> },
  { id: 5, text: 'Supplier delivery logged — Lucky Me! Pancit Canton (24 packs)', time: '8:12 AM', type: 'success', icon: <CheckCircle2 size={14} /> },
  { id: 6, text: 'User JP Yaba signed in', time: '8:02 AM', type: 'info', icon: <Info size={14} /> },
];

const NOTIFICATIONS = [
  { id: 1, text: '7 products are at or below reorder level', type: 'warning', time: '10 min ago' },
  { id: 2, text: 'Pending transaction TRX-10471 awaiting approval', type: 'info', time: '25 min ago' },
  { id: 3, text: 'Monthly inventory count scheduled for Oct 5', type: 'info', time: '1 hr ago' },
  { id: 4, text: 'Bear Brand Powdered Milk is out of stock', type: 'danger', time: '2 hrs ago' },
];

function formatPeso(amount: number) {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function StatCard({
  icon, label, value, sub, color, trend
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  trend?: 'up' | 'down';
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 44, height: 44, background: `${color}18` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-1"
            style={{
              background: trend === 'up' ? '#dcfce7' : '#fee2e2',
              color: trend === 'up' ? '#16a34a' : '#dc2626',
            }}
          >
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend === 'up' ? '+12%' : '−3%'}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-semibold text-gray-500">{label}</div>
      <div className="text-xs text-gray-400 mt-1">{sub}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3" style={{ fontSize: 13 }}>
        <div className="font-semibold text-gray-700 mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color }}>
            {p.name === 'sales' ? formatPeso(p.value) : `${p.value} transactions`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const recentTrx = MOCK_TRANSACTIONS.slice(0, 5);

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {currentUser?.name?.split(' ')[0]}.
          </h1>
          <div className="text-sm text-gray-500 mt-1">
            Friday, October 1, 2026 &nbsp;·&nbsp; Store Operations Dashboard
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshCw size={15} className={refreshing ? 'spin' : ''} />
            Refresh
          </button>
          <div className="relative">
            <button
              className="relative btn-secondary p-2.5"
              onClick={() => setShowNotif(p => !p)}
            >
              <Bell size={18} />
              <span
                className="absolute -top-1 -right-1 text-white text-xs font-bold flex items-center justify-center rounded-full"
                style={{ width: 18, height: 18, background: '#ef4444', fontSize: 10 }}
              >
                4
              </span>
            </button>
            {showNotif && (
              <div
                className="absolute right-0 top-12 rounded-2xl shadow-2xl overflow-hidden z-20"
                style={{ width: 340, background: 'white', border: '1px solid #e2e8f0' }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">Notifications</span>
                    <span className="text-xs text-blue-600 cursor-pointer font-medium">Mark all read</span>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div
                          className="mt-0.5 flex-shrink-0 rounded-full"
                          style={{
                            width: 8,
                            height: 8,
                            background: n.type === 'warning' ? '#f59e0b' : n.type === 'danger' ? '#ef4444' : '#3b82f6',
                            marginTop: 6,
                          }}
                        />
                        <div>
                          <div className="text-sm text-gray-700">{n.text}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<TrendingUp size={22} />}
          label="Today's Sales"
          value="₱24,850.00"
          sub="vs ₱23,100 yesterday"
          color="#3b82f6"
          trend="up"
        />
        <StatCard
          icon={<ShoppingCart size={22} />}
          label="Transactions"
          value="128"
          sub="5 pending review"
          color="#8b5cf6"
          trend="up"
        />
        <StatCard
          icon={<Package size={22} />}
          label="Low Stock Items"
          value="7"
          sub="2 out of stock"
          color="#f59e0b"
          trend="down"
        />
        <StatCard
          icon={<Clock size={22} />}
          label="Pending Tasks"
          value="4"
          sub="3 due today"
          color="#ef4444"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        {/* Sales chart */}
        <div className="card p-6 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-bold text-gray-900 text-base">Sales Overview</div>
              <div className="text-sm text-gray-400 mt-0.5">Daily revenue — this week</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
              <ArrowUpRight size={16} />
              +12% vs last week
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SALES_CHART_DATA}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={v => v === 0 ? '0' : `₱${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#salesGradient)"
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: '#2563eb' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory pie */}
        <div className="card p-6">
          <div className="font-bold text-gray-900 text-base mb-1">Inventory Status</div>
          <div className="text-sm text-gray-400 mb-4">128 products total</div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={INVENTORY_CHART_DATA}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={68}
                dataKey="value"
                strokeWidth={0}
              >
                {INVENTORY_CHART_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v, name) => [`${v} products`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {INVENTORY_CHART_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.fill }} />
                  <span className="text-gray-600">{d.name}</span>
                </div>
                <span className="font-semibold text-gray-800">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Recent Transactions */}
        <div className="card col-span-2">
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="font-bold text-gray-900">Recent Transactions</div>
            <button
              onClick={() => navigate('/transactions')}
              className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTrx.map(trx => (
                <tr key={trx.id}>
                  <td>
                    <span className="font-mono text-sm font-semibold text-blue-700">{trx.id}</span>
                  </td>
                  <td className="text-gray-600">{trx.customer}</td>
                  <td className="font-semibold text-gray-800">{formatPeso(trx.total)}</td>
                  <td>
                    <span className="badge-gray">{trx.payment}</span>
                  </td>
                  <td>
                    <span className={
                      trx.status === 'Completed' ? 'badge-success' :
                        trx.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }>
                      {trx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Activity feed */}
        <div className="card">
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
            <div className="font-bold text-gray-900">Activity Feed</div>
            <div className="text-xs text-gray-400 mt-0.5">Today's system events</div>
          </div>
          <div className="px-6 py-4 flex flex-col gap-4">
            {RECENT_ACTIVITIES.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div
                  className="flex items-center justify-center rounded-lg flex-shrink-0 mt-0.5"
                  style={{
                    width: 28,
                    height: 28,
                    background: a.type === 'success' ? '#dcfce7' : a.type === 'warning' ? '#fef3c7' : '#dbeafe',
                    color: a.type === 'success' ? '#16a34a' : a.type === 'warning' ? '#d97706' : '#2563eb',
                  }}
                >
                  {a.icon}
                </div>
                <div>
                  <div className="text-xs text-gray-700 leading-snug">{a.text}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
