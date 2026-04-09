import './bootstrap.js';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/Auth/LoginPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AuthorDashboard from './pages/Author/AuthorDashboard';

const queryClient = new QueryClient();

const App = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Author Routes */}
            <Route element={<ProtectedRoute allowedRoles={['author']} />}>
                <Route path="/author" element={<AuthorDashboard />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </QueryClientProvider>
        </React.StrictMode>
    );
}
