import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';

interface User {
    id: number;
    username: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 初始化时检查存储的认证信息
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const userData = await AsyncStorage.getItem('userData');
                
                if (token && userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser({
                        ...parsedUser,
                        token,
                    });
                    // 设置API服务的默认token
                    apiService.setAuthToken(token);
                }
            } catch (e) {
                console.error('Failed to load auth data from storage', e);
            } finally {
                setIsLoading(false);
            }
        };

        bootstrapAsync();
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);
            const response = await apiService.login(username, password);
            
            if (response.data.code === 200) {
                const userData = response.data.data;
                const userInfo = {
                    id: userData.id,
                    username: userData.username,
                    email: userData.email,
                    token: userData.token,
                };
                
                // 保存到AsyncStorage
                await AsyncStorage.setItem('userToken', userData.token);
                await AsyncStorage.setItem('userData', JSON.stringify({
                    id: userData.id,
                    username: userData.username,
                    email: userData.email,
                }));
                
                // 设置全局用户状态和API token
                setUser(userInfo);
                apiService.setAuthToken(userData.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            // 移除存储的认证信息
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            
            // 清除全局状态和API token
            setUser(null);
            apiService.setAuthToken('');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const value = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};