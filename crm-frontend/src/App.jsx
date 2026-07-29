import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Deals from './pages/Deals';
import Tasks from './pages/Tasks';

// کامپوننت محافظت شده برای صفحاتی که نیاز به احراز هویت دارند
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// لی‌اوت اصلی با نوار ناوبری
const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">CRM System</h1>
        </div>
        
        <nav className="p-4 space-y-2">
          <a
            href="/dashboard"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            📊 داشبورد
          </a>
          <a
            href="/deals"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            💰 معاملات
          </a>
          <a
            href="/tasks"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            ✅ وظایف
          </a>
          <a
            href="/customers"
            className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            👥 مشتریان
          </a>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">CRM</h1>
          <button onClick={logout} className="text-red-600 hover:text-red-700">
            خروج
          </button>
        </header>

        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* صفحات عمومی */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* صفحات محافظت شده */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/deals"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Deals />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Tasks />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* مسیر پیش‌فرض */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* صفحه 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600">صفحه مورد نظر یافت نشد</p>
                  <a href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                    بازگشت به داشبورد
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
