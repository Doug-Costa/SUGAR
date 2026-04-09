import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'author';
    author_id: string | null;
    author?: {
        name: string;
        show_fee_detail: boolean;
    };
}

export const useAuth = () => {
    const queryClient = useQueryClient();

    const { data: user, isLoading, error } = useQuery<User | null>({
        queryKey: ['auth-user'],
        queryFn: async () => {
            try {
                const response = await api.get('/auth/me');
                return response.data.user;
            } catch (err) {
                return null;
            }
        },
        retry: false,
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            // Requirement for Sanctum SPA: first hit the CSRF cookie endpoint
            await api.get('/../sanctum/csrf-cookie');
            const response = await api.post('/auth/login', credentials);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth-user'] });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await api.post('/auth/logout');
        },
        onSuccess: () => {
            queryClient.setQueryData(['auth-user'], null);
            window.location.href = '/login';
        },
    });

    return {
        user,
        isLoading,
        error,
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isPending,
    };
};
