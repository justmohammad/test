import { useEffect, useState } from 'react';
import { dealService } from '../services/index.js';
import { DollarSign, Plus, Filter, TrendingUp } from 'lucide-react';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const response = await dealService.getAll();
      setDeals(response.data);
    } catch (error) {
      console.error('Error loading deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { id: 'lead', name: 'سرنخ', color: 'bg-gray-100 border-gray-300' },
    { id: 'contacted', name: 'تماس گرفته شده', color: 'bg-blue-50 border-blue-300' },
    { id: 'proposal', name: 'ارسال پیشنهاد', color: 'bg-yellow-50 border-yellow-300' },
    { id: 'negotiation', name: 'مذاکره', color: 'bg-purple-50 border-purple-300' },
    { id: 'closed_won', name: 'برنده شده', color: 'bg-green-50 border-green-300' },
    { id: 'closed_lost', name: 'باخته شده', color: 'bg-red-50 border-red-300' },
  ];

  const filteredDeals = filterStatus === 'all' 
    ? deals 
    : deals.filter(deal => deal.stage === filterStatus);

  const totalValue = deals
    .filter(deal => deal.stage === 'closed_won')
    .reduce((sum, deal) => sum + (deal.value || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">مدیریت معاملات</h1>
            <p className="text-gray-600 mt-2">پیگیری و مدیریت فرصت‌های فروش</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center shadow-lg">
            <Plus className="w-5 h-5 ml-2" />
            معامله جدید
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">کل معاملات</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{deals.length}</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">در دست اقدام</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {deals.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">برنده شده</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {deals.filter(d => d.stage === 'closed_won').length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">ارزش کل (برنده شده)</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {totalValue.toLocaleString()} تومان
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-4 space-x-reverse">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه مراحل</option>
              {stages.map(stage => (
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 overflow-x-auto pb-6">
          {stages.map(stage => {
            const stageDeals = filteredDeals.filter(deal => deal.stage === stage.id);
            
            return (
              <div key={stage.id} className={`rounded-lg p-4 border-2 ${stage.color}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">{stage.name}</h3>
                  <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-600">
                    {stageDeals.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageDeals.map(deal => (
                    <div
                      key={deal.id}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                      <h4 className="font-medium text-gray-800 mb-2">{deal.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{deal.customer}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-green-600">
                          {deal.value?.toLocaleString()} تومان
                        </span>
                        <span className="text-xs text-gray-500">
                          {deal.priority === 'high' ? '🔴' : deal.priority === 'medium' ? '🟡' : '🟢'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Deals;
