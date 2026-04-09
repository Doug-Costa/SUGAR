import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Painel Administrativo</h1>
            <p>Bem-vindo, {user?.name} (Admin)</p>
            <button 
                onClick={() => logout()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Sair
            </button>
        </div>
    );
};

export default AdminDashboard;
