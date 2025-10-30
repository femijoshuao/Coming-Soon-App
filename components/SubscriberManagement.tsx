import React, { useState } from 'react';
import { useSubscribers } from '../hooks/usePageContent';
import Icon from './Icon';

/**
 * Component for viewing and managing subscribers
 */
const SubscriberManagement: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { subscribers, loading, error, deleteSubscriber } = useSubscribers();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (subscriberId: string, email: string) => {
    if (!confirm(`Delete subscriber: ${email}?`)) return;

    setDeletingId(subscriberId);
    const result = await deleteSubscriber(subscriberId);
    
    if (!result.success) {
      alert(result.message);
    }
    setDeletingId(null);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Subscribed At'],
      ...subscribers.map(sub => [
        sub.name,
        sub.email,
        sub.phone || '',
        sub.subscribedAt?.toDate?.()?.toLocaleString() || 'N/A'
      ])
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter(
    sub =>
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.phone && sub.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Subscriber Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subscribers.length} total subscriber{subscribers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Icon name="close" className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Search and Export */}
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleExportCSV}
            disabled={subscribers.length === 0}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600 dark:text-red-400">
              <p>Error loading subscribers: {error}</p>
            </div>
          ) : filteredSubscribers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-lg font-medium">
                {searchTerm ? 'No subscribers found' : 'No subscribers yet'}
              </p>
              <p className="text-sm mt-1">
                {searchTerm ? 'Try a different search term' : 'Subscribers will appear here when they sign up'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-white truncate">
                      {subscriber.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {subscriber.email}
                    </p>
                    {subscriber.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        📱 {subscriber.phone}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {subscriber.subscribedAt?.toDate?.()?.toLocaleString() || 'Date unavailable'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(subscriber.id, subscriber.email)}
                    disabled={deletingId === subscriber.id}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete subscriber"
                  >
                    {deletingId === subscriber.id ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <Icon name="trash" className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriberManagement;
