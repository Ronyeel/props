// src/pages/Inventory.tsx
import React, { useState } from 'react';
import { Search, Package, TrendingDown, X, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_STOCK_MOVEMENTS } from '../data/mockData';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

function formatPeso(amount: number) {
  return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getStockStatus(p: Product): 'In Stock' | 'Low Stock' | 'Out of Stock' {
  if (p.stock === 0) return 'Out of Stock';
  if (p.stock <= p.reorderLevel) return 'Low Stock';
  return 'In Stock';
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const status = getStockStatus(product);
  const movements = MOCK_STOCK_MOVEMENTS.filter(m => m.product === product.name);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div className="text-xl font-bold text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500 mt-0.5">
              SKU: <span className="font-mono">{product.sku}</span> &nbsp;·&nbsp; {product.category}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="px-8 py-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">CURRENT STOCK</div>
              <div className="text-2xl font-bold" style={{
                color: status === 'Out of Stock' ? '#ef4444' : status === 'Low Stock' ? '#f59e0b' : '#22c55e'
              }}>
                {product.stock}
              </div>
              <div className="text-xs text-gray-400 mt-1">{product.unit}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">REORDER LEVEL</div>
              <div className="text-2xl font-bold text-gray-700">{product.reorderLevel}</div>
              <div className="text-xs text-gray-400 mt-1">{product.unit}</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">UNIT PRICE</div>
              <div className="text-xl font-bold text-gray-700">{formatPeso(product.price)}</div>
              <div className="text-xs text-gray-400 mt-1">per {product.unit}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">STATUS</div>
              <span className={
                status === 'In Stock' ? 'badge-success' :
                  status === 'Low Stock' ? 'badge-warning' : 'badge-danger'
              }>{status}</span>
            </div>
            <div className="rounded-xl p-4" style={{ background: '#f8fafc' }}>
              <div className="text-xs text-gray-400 font-semibold mb-1">SUPPLIER</div>
              <div className="text-sm font-semibold text-gray-800">{product.supplier}</div>
            </div>
          </div>

          {/* Stock movements */}
          <div className="text-sm font-semibold text-gray-700 mb-3">Recent Stock Movements</div>
          {movements.length === 0 ? (
            <div className="text-sm text-gray-400 py-4 text-center rounded-xl" style={{ background: '#f8fafc' }}>
              No recent movements recorded.
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Notes</th>
                    <th>By</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map(m => (
                    <tr key={m.id}>
                      <td className="text-xs text-gray-500">{m.date}</td>
                      <td>
                        <span className={
                          m.type === 'In' ? 'badge-success' :
                            m.type === 'Out' ? 'badge-danger' : 'badge-warning'
                        }>{m.type}</span>
                      </td>
                      <td className="font-semibold" style={{
                        color: m.quantity < 0 ? '#ef4444' : m.type === 'In' ? '#16a34a' : '#dc2626'
                      }}>
                        {m.quantity > 0 && m.type === 'In' ? '+' : ''}{m.quantity}
                      </td>
                      <td className="text-xs text-gray-500">{m.notes}</td>
                      <td className="text-xs text-gray-500">{m.by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex gap-3 px-8 py-5" style={{ borderTop: '1px solid #f1f5f9' }}>
          <button className="btn-secondary flex-1">Record Stock In</button>
          <button className="btn-primary flex-1">Request Restock</button>
        </div>
      </div>
    </div>
  );
}

export default function Inventory() {
  const { addToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [stockStatus, setStockStatus] = useState('All');
  const [selected, setSelected] = useState<Product | null>(null);

  const categories = ['All', ...new Set(MOCK_PRODUCTS.map(p => p.category))];

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category === category;
    const status = getStockStatus(p);
    const matchStatus = stockStatus === 'All' || status === stockStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const totalValue = MOCK_PRODUCTS.reduce((s, p) => s + p.stock * p.price, 0);
  const lowStock = MOCK_PRODUCTS.filter(p => getStockStatus(p) === 'Low Stock').length;
  const outOfStock = MOCK_PRODUCTS.filter(p => getStockStatus(p) === 'Out of Stock').length;

  return (
    <div className="p-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <div className="text-sm text-gray-500 mt-1">Product stock management</div>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => addToast('Stock adjustment submitted for approval.', 'info')}
        >
          <RefreshCw size={16} />
          Stock Adjustment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Products', value: '128', sub: 'Active SKUs', color: '#3b82f6', icon: <Package size={20} /> },
          { label: 'Low Stock', value: String(lowStock), sub: 'Need restocking', color: '#f59e0b', icon: <TrendingDown size={20} /> },
          { label: 'Out of Stock', value: String(outOfStock), sub: 'Immediate action needed', color: '#ef4444', icon: <X size={20} /> },
          { label: 'Stock Value', value: formatPeso(totalValue), sub: 'Estimated retail value', color: '#22c55e', icon: <Package size={20} /> },
        ].map(c => (
          <div key={c.label} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 40, height: 40, background: `${c.color}18`, color: c.color }}
              >
                {c.icon}
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900">{c.value}</div>
            <div className="text-sm font-semibold text-gray-500 mt-0.5">{c.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-5 mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search product name or SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="rounded-xl text-sm px-3 py-2.5 outline-none"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#374151' }}
        >
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>
        <select
          value={stockStatus}
          onChange={e => setStockStatus(e.target.value)}
          className="rounded-xl text-sm px-3 py-2.5 outline-none"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#374151' }}
        >
          <option value="All">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Reorder Level</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  No products found matching your filters.
                </td>
              </tr>
            ) : filtered.map(p => {
              const status = getStockStatus(p);
              return (
                <tr
                  key={p.sku}
                  className="cursor-pointer"
                  onClick={() => setSelected(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <span className="font-mono text-xs font-semibold text-gray-500">{p.sku}</span>
                  </td>
                  <td>
                    <div className="font-medium text-gray-800">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.supplier}</div>
                  </td>
                  <td>
                    <span className="badge-info">{p.category}</span>
                  </td>
                  <td>
                    <span
                      className="font-bold text-base"
                      style={{
                        color: status === 'Out of Stock' ? '#ef4444' :
                          status === 'Low Stock' ? '#f59e0b' : '#374151'
                      }}
                    >
                      {p.stock}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{p.unit}</span>
                  </td>
                  <td className="text-gray-500 text-sm">{p.reorderLevel} {p.unit}</td>
                  <td className="font-medium text-gray-700">{formatPeso(p.price)}</td>
                  <td>
                    <span className={
                      status === 'In Stock' ? 'badge-success' :
                        status === 'Low Stock' ? 'badge-warning' : 'badge-danger'
                    }>
                      {status}
                    </span>
                  </td>
                  <td className="text-xs text-gray-400">{p.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock Movements section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Stock Movements</h2>
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Product</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Notes</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STOCK_MOVEMENTS.map(m => (
                <tr key={m.id}>
                  <td><span className="font-mono text-xs font-semibold text-gray-500">{m.id}</span></td>
                  <td className="font-medium text-gray-800">{m.product}</td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      {m.type === 'In' ? <ArrowUp size={13} className="text-green-600" /> :
                        m.type === 'Out' ? <ArrowDown size={13} className="text-red-500" /> :
                          <RefreshCw size={13} className="text-amber-500" />}
                      <span className={
                        m.type === 'In' ? 'badge-success' :
                          m.type === 'Out' ? 'badge-danger' : 'badge-warning'
                      }>{m.type}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className="font-bold"
                      style={{
                        color: m.quantity < 0 ? '#ef4444' : m.type === 'In' ? '#16a34a' : '#dc2626'
                      }}
                    >
                      {m.quantity > 0 && m.type === 'In' ? '+' : ''}{m.quantity}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500">{m.date}</td>
                  <td className="text-xs text-gray-500">{m.notes}</td>
                  <td className="text-xs text-gray-600">{m.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
