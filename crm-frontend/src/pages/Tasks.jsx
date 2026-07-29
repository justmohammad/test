import { useEffect, useState } from 'react';
import { taskService } from '../services/index.js';
import { CheckSquare, Plus, Calendar, Clock, Filter } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filterStatus);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    overdue: tasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      return dueDate < new Date() && t.status !== 'completed';
    }).length,
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'انجام شده';
      case 'pending': return 'در انتظار';
      case 'in_progress': return 'در حال انجام';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">مدیریت وظایف</h1>
            <p className="text-gray-600 mt-2">پیگیری و مدیریت کارها و فعالیت‌ها</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center shadow-lg">
            <Plus className="w-5 h-5 ml-2" />
            وظیفه جدید
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">کل وظایف</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <CheckSquare className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">انجام شده</p>
                <p className="text-2xl font-bold text-green-600 mt-2">{stats.completed}</p>
              </div>
              <CheckSquare className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">در انتظار</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">سررسید گذشته</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{stats.overdue}</p>
              </div>
              <Calendar className="w-10 h-10 text-red-500 opacity-20" />
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
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="in_progress">در حال انجام</option>
              <option value="completed">انجام شده</option>
            </select>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">لیست وظایف</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-6 hover:bg-gray-50 transition ${
                    task.status === 'completed' ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 space-x-reverse flex-1">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => {
                          // TODO: Implement toggle status
                        }}
                        className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h3 className={`text-lg font-medium ${
                          task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                        
                        <div className="flex items-center space-x-4 space-x-reverse mt-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority === 'high' ? 'اولویت بالا' : 
                             task.priority === 'medium' ? 'اولویت متوسط' : 'اولویت پایین'}
                          </span>
                          
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 ml-1" />
                            {new Date(task.dueDate).toLocaleDateString('fa-IR')}
                          </span>
                          
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 ml-1" />
                            {getStatusLabel(task.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <button className="text-blue-600 hover:text-blue-900 p-2">
                        ویرایش
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-2">
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredTasks.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  هیچ وظیفه‌ای یافت نشد.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
