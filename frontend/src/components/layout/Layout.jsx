import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { GraduationCap, LogOut, Home, UserCircle, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  // Determine dashboard link based on role
  const getDashboardLink = () => {
    if (user?.role === 'company') return '/company/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/student/home';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <GraduationCap className="h-6 w-6" />
            <span>SkillGate</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {user.role === 'student' && (
                  <div className="hidden md:flex items-center gap-1 mr-4">
                    <Link to="/student/home">
                      <Button variant="ghost" size="sm" className={location.pathname.includes('/home') ? 'bg-slate-100' : ''}>
                        <Home className="h-4 w-4 mr-2" /> Home
                      </Button>
                    </Link>
                    <Link to="/student/profile">
                      <Button variant="ghost" size="sm" className={location.pathname.includes('/profile') ? 'bg-slate-100' : ''}>
                        <UserCircle className="h-4 w-4 mr-2" /> Profile
                      </Button>
                    </Link>
                    <Link to="/student/apply">
                      <Button variant="ghost" size="sm" className={location.pathname.includes('/apply') ? 'bg-slate-100' : ''}>
                        <Briefcase className="h-4 w-4 mr-2" /> Apply
                      </Button>
                    </Link>
                  </div>
                )}

                {user.role === 'company' && (
                  <div className="hidden md:flex items-center gap-1 mr-4">
                    <Link to="/company/dashboard">
                      <Button variant="ghost" size="sm" className={location.pathname.endsWith('/dashboard') ? 'bg-slate-100' : ''}>
                        <Home className="h-4 w-4 mr-2" /> Dashboard
                      </Button>
                    </Link>
                    <Link to="/company/drives">
                      <Button variant="ghost" size="sm" className={location.pathname.includes('/drives') ? 'bg-slate-100' : ''}>
                        <Briefcase className="h-4 w-4 mr-2" /> My Drives
                      </Button>
                    </Link>
                    <Link to="/company/create-drive">
                      <Button variant="ghost" size="sm" className={location.pathname.includes('/create-drive') ? 'bg-slate-100' : ''}>
                        <Briefcase className="h-4 w-4 mr-2" /> Post Job
                      </Button>
                    </Link>
                    <Link to="/company/profile">
                      <Button variant="ghost" size="sm" className={location.pathname.includes('/profile') ? 'bg-slate-100' : ''}>
                        <UserCircle className="h-4 w-4 mr-2" /> Profile
                      </Button>
                    </Link>
                  </div>
                )}

                {user.role === 'admin' && (
                  <Link to={getDashboardLink()} className="text-sm font-medium hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                )}
                
                <div className="text-sm text-slate-500 hidden md:block border-l pl-4">
                  {user.name} 
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    user.status === 'approved' ? 'bg-green-100 text-green-700' : 
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100'
                  }`}>
                    {user.status || 'Active'}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 container px-4 md:px-8 py-6">
        {children}
      </main>

      <footer className="border-t bg-white py-6 md:py-8">
        <div className="container px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 SkillGate. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
