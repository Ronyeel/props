// src/pages/Groupware.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Hash, Send, Paperclip, Search, Bell, Users,
  Pin, ChevronRight, Info, MessageSquare, CheckCheck
} from 'lucide-react';
import { MOCK_MESSAGES } from '../data/mockData';
import { Message } from '../types';
import { useApp } from '../context/AppContext';

const CHANNELS = [
  { id: 'operations', name: 'operations', label: '# Operations', official: true, unread: 0 },
  { id: 'inventory', name: 'inventory', label: '# Inventory', official: false, unread: 2 },
  { id: 'management', name: 'management', label: '# Management', official: false, unread: 0 },
  { id: 'announcements', name: 'announcements', label: '# Announcements', official: false, unread: 1 },
];

const PINNED = {
  operations: 'Reminder: All end-of-day cash counts must be submitted through LSOIS by 6:30 PM.',
  inventory: 'Template for stock entry attached. Please follow the standard format.',
  management: 'Q3 performance review scheduled for October 15, 2026.',
  announcements: 'LSOIS Training modules are now available. Please complete by October 8.',
};

const MEMBERS = [
  { name: 'Ma. Teresa Soriano', role: 'Manager', online: true },
  { name: 'JP Yaba', role: 'Employee', online: true },
  { name: 'Jose Fernandez', role: 'Employee', online: false },
  { name: 'Ana Bautista', role: 'Employee', online: true },
  { name: 'Ricardo Palma', role: 'Administrator', online: false },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('');
}

function getAvatarColor(name: string) {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function Groupware() {
  const { currentUser, addToast } = useApp();
  const [activeChannel, setActiveChannel] = useState('operations');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [showMembers, setShowMembers] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  const channelMessages = messages.filter(m => m.channel === activeChannel);
  const channel = CHANNELS.find(c => c.id === activeChannel);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages.length]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      channel: activeChannel,
      sender: currentUser?.name || 'You',
      senderRole: currentUser?.role === 'manager' ? 'Manager' : 'Employee',
      content: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen" style={{ height: 'calc(100vh - 0px)' }}>
      {/* Left sidebar */}
      <div
        className="flex flex-col"
        style={{
          width: 260,
          minWidth: 260,
          background: '#1e293b',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Workspace header */}
        <div
          className="px-4 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-white font-bold text-sm">Operations Workspace</div>
          <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>LSOIS · Store Ops Team</div>
        </div>

        {/* Search */}
        <div className="px-3 py-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748b' }} />
            <input
              type="search"
              placeholder="Search messages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#94a3b8',
              }}
            />
          </div>
        </div>

        {/* Channels */}
        <div className="px-3 py-2 flex-1">
          <div className="text-xs font-semibold uppercase tracking-widest mb-2 px-1" style={{ color: '#475569' }}>
            Channels
          </div>
          {CHANNELS.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-left mb-0.5"
              style={{
                background: activeChannel === ch.id ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: activeChannel === ch.id ? '#60a5fa' : '#94a3b8',
              }}
            >
              <div className="flex items-center gap-2">
                <Hash size={14} />
                <span className="font-medium">{ch.id}</span>
                {ch.official && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-semibold"
                    style={{ background: 'rgba(59,130,246,0.3)', color: '#93c5fd', fontSize: 9 }}
                  >
                    OFFICIAL
                  </span>
                )}
              </div>
              {ch.unread > 0 && (
                <span
                  className="text-white text-xs font-bold flex items-center justify-center rounded-full"
                  style={{ width: 18, height: 18, background: '#3b82f6', fontSize: 10 }}
                >
                  {ch.unread}
                </span>
              )}
            </button>
          ))}

          {/* Members */}
          <div className="text-xs font-semibold uppercase tracking-widest mt-5 mb-2 px-1" style={{ color: '#475569' }}>
            Members ({MEMBERS.filter(m => m.online).length} online)
          </div>
          {MEMBERS.map(m => (
            <div key={m.name} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg mb-0.5">
              <div className="relative">
                <div
                  className="flex items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ width: 24, height: 24, background: getAvatarColor(m.name), fontSize: 10 }}
                >
                  {getInitials(m.name)}
                </div>
                {m.online && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 rounded-full"
                    style={{ width: 8, height: 8, background: '#22c55e', border: '2px solid #1e293b' }}
                  />
                )}
              </div>
              <div>
                <div className="text-xs font-medium" style={{ color: m.online ? '#e2e8f0' : '#64748b' }}>
                  {m.name.split(' ')[0]}
                </div>
                <div className="text-xs" style={{ color: '#475569', fontSize: 10 }}>{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col" style={{ background: 'white' }}>
        {/* Channel header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}
        >
          <div className="flex items-center gap-3">
            <Hash size={18} className="text-gray-400" />
            <div>
              <div className="font-bold text-gray-900 text-base">{activeChannel}</div>
              {channel?.official && (
                <div className="text-xs text-blue-600 font-medium">Official Operations Channel</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><Bell size={18} /></button>
            <button
              onClick={() => setShowMembers(p => !p)}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <Users size={18} />
            </button>
          </div>
        </div>

        {/* Pinned message */}
        {PINNED[activeChannel as keyof typeof PINNED] && (
          <div
            className="mx-6 mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}
          >
            <Pin size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-blue-800 font-medium">
              Pinned: {PINNED[activeChannel as keyof typeof PINNED]}
            </span>
          </div>
        )}

        {/* Official channel notice */}
        {channel?.official && (
          <div
            className="mx-6 mt-3 flex items-start gap-3 rounded-xl px-4 py-3"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
          >
            <Info size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <strong>Official Channel</strong> — Use this channel for all operational announcements, inventory updates, and coordination.
              <div className="text-xs text-green-700 mt-0.5">
                This replaces scattered group chats and paper-based communication.
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {channelMessages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <div className="font-medium">No messages yet</div>
              <div className="text-sm">Be the first to post in #{activeChannel}</div>
            </div>
          )}
          {channelMessages.map((msg, idx) => {
            const isOwn = msg.isOwn || msg.sender === currentUser?.name;
            const showAvatar = idx === 0 || channelMessages[idx - 1].sender !== msg.sender;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end gap-3`}
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full text-white text-xs font-bold flex-shrink-0"
                  style={{
                    width: 34,
                    height: 34,
                    background: getAvatarColor(msg.sender),
                    visibility: showAvatar ? 'visible' : 'hidden',
                  }}
                >
                  {getInitials(msg.sender)}
                </div>

                <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`} style={{ maxWidth: '68%' }}>
                  {showAvatar && (
                    <div className={`flex items-baseline gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm font-semibold text-gray-800">{msg.sender}</span>
                      <span className="text-xs font-medium text-blue-600">{msg.senderRole}</span>
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                  )}
                  <div
                    className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: isOwn ? '#3b82f6' : '#f1f5f9',
                      color: isOwn ? 'white' : '#374151',
                      borderRadius: isOwn ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                    }}
                  >
                    {msg.content}
                  </div>
                  {isOwn && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCheck size={12} className="text-blue-400" />
                      <span className="text-xs text-gray-400">Delivered</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Message input */}
        <div
          className="px-6 py-4"
          style={{ borderTop: '1px solid #f1f5f9', background: 'white' }}
        >
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
          >
            <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <Paperclip size={18} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Message #${activeChannel}...`}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="flex items-center justify-center rounded-xl p-2 flex-shrink-0 transition-all"
              style={{
                background: newMessage.trim() ? '#3b82f6' : '#e2e8f0',
                color: newMessage.trim() ? 'white' : '#94a3b8',
              }}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            All messages in this channel are recorded and monitored.
          </div>
        </div>
      </div>
    </div>
  );
}
