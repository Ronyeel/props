// src/pages/Transactions.tsx
import React, { useState } from 'react';
import { Search, Filter, Eye, Plus, X, ChevronDown } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '../data/mockData';
import { Transaction } from '../types';
import { useApp } from '../context/AppContext';

function formatPeso(amount: number) {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function TransactionModal({ trx, onClose }: { trx: Transaction; onClose: () => void }) {
  const subtotal = trx.items.reduce((s, i) => s + i.qty * i.price, 0);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div className="text-xl font-bold text-gray-900">{trx.id}</div>
            <div className="text-sm text-gray-500 mt-0.5">{trx.date} &nbsp;·&nbsp; Cashier: {trx.cashier}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        <div className="px-8 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">CUSTOMER</div>
              <div className="text-sm font-semibold text-gray-800">{trx.customer}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">PAYMENT</div>
              <div className="text-sm font-semibold text-gray-800">{trx.payment}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">STATUS</div>
              <span className={
                trx.status === 'Completed' ? 'badge-success' :
                  trx.status === 'Pending' ? 'badge-warning' : 'badge-danger'
              }>
                {trx.status}
              </span>
            </div>
          </div>

          <div className="mb-4 text-sm font-semibold text-gray-700">Items</div>
          <div className="rounded-xl overflow-hidden mb-6" style={{ border: '1px solid #e2e8f0' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Unit Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {trx.items.map((item, i) => (
                  <tr key={i}>
                    <td className="font-medium text-gray-800">{item.name}</td>
                    <td className="text-right text-gray-600">{item.qty}</td>
                    <td className="text-right text-gray-600">{formatPeso(item.price)}</td>
                    <td className="text-right font-semibold text-gray-800">{formatPeso(item.qty * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-800 w-28 text-right">{formatPeso(subtotal)}</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-500">Discount</span>
              <span className="font-medium text-gray-800 w-28 text-right">— ₱0.00</span>
            </div>
            <div className="flex items-center gap-6 text-base font-bold" style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10, marginTop: 4 }}>
              <span className="text-gray-800">Total</span>
              <span className="text-blue-700 w-28 text-right">{formatPeso(trx.total)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-8 py-5" style={{ borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-secondary flex-1">Print Receipt</button>
          <button className="btn-primary flex-1">
            {trx.status === 'Pending' ? 'Approve Transaction' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Transactions() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [newTrxOpen, setNewTrxOpen] = useState(false);

  const filtered = MOCK_TRANSACTIONS.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchDate = dateFilter === 'All' || t.date === dateFilter;
    return matchSearch && matchStatus && matchDate;
  });

  const dates = [...new Set(MOCK_TRANSACTIONS.map(t => t.date))];

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <div className="text-sm text-gray-500 mt-1">{filtered.length} records found</div>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => {
            setNewTrxOpen(true);
            setTimeout(() => {
              setNewTrxOpen(false);
              addToast('Transaction processed successfully — TRX-10483', 'success');
            }, 2500);
          }}
        >
          <Plus size={16} />
          New Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card p-5 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search by Transaction ID or Customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-xl text-sm px-3 py-2.5 outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#374151' }}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Voided">Voided</option>
          </select>

          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="rounded-xl text-sm px-3 py-2.5 outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#374151' }}
          >
            <option value="All">All Dates</option>
            {dates.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  No transactions found matching your filters.
                </td>
              </tr>
            ) : filtered.map(trx => (
              <tr key={trx.id}>
                <td>
                  <span className="font-mono font-semibold text-blue-700 text-sm">{trx.id}</span>
                </td>
                <td className="text-gray-600 text-sm">{trx.date}</td>
                <td className="text-gray-700 text-sm">{trx.customer}</td>
                <td className="text-gray-600 text-sm">{trx.items.length} {trx.items.length === 1 ? 'item' : 'items'}</td>
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
                <td>
                  <button
                    className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800"
                    onClick={() => setSelected(trx)}
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
        <span>Completed: <strong className="text-green-700">{MOCK_TRANSACTIONS.filter(t => t.status === 'Completed').length}</strong></span>
        <span>Pending: <strong className="text-amber-600">{MOCK_TRANSACTIONS.filter(t => t.status === 'Pending').length}</strong></span>
        <span>Voided: <strong className="text-red-600">{MOCK_TRANSACTIONS.filter(t => t.status === 'Voided').length}</strong></span>
        <span className="ml-auto">
          Total: <strong className="text-gray-800">{formatPeso(MOCK_TRANSACTIONS.filter(t => t.status === 'Completed').reduce((s, t) => s + t.total, 0))}</strong>
        </span>
      </div>

      {/* Transaction detail modal */}
      {selected && <TransactionModal trx={selected} onClose={() => setSelected(null)} />}

      {/* New transaction loading modal */}
      {newTrxOpen && (
        <div className="modal-overlay">
          <div className="modal-panel p-10 flex flex-col items-center gap-5" style={{ maxWidth: 340 }}>
            <div
              className="spin"
              style={{
                width: 40,
                height: 40,
                border: '3px solid #dbeafe',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
              }}
            />
            <div className="text-center">
              <div className="font-bold text-gray-900 text-lg">Processing Transaction</div>
              <div className="text-sm text-gray-500 mt-1">Please wait...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
