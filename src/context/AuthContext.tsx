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
                const userData = await AsyncStorage.getItem('userData');
                
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser({
                        id: parsedUser.id,
                        username: parsedUser.username,
                        email: parsedUser.email || '',
                        token: '', // 使用 Cookie 认证，不需要 token
                    });
                    // 注意：认证通过 Cookie 管理，不需要设置 token
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
            
            if (response.data.code === 200 && response.data.data) {
                const userData = response.data.data;
                const userInfo = {
                    id: userData.user_id,
                    username: userData.username,
                    email: '', // 服务器响应中没有 email 字段
                    token: '', // 使用 Cookie 认证，不需要存储 token
                };
                
                // 保存到AsyncStorage（仅保存用户信息，token 通过 Cookie 管理）
                await AsyncStorage.setItem('userData', JSON.stringify({
                    id: userData.user_id,
                    username: userData.username,
                }));
                
                // 设置全局用户状态
                // 注意：认证通过 Cookie 管理，不需要设置 token
                setUser(userInfo);
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
            // 调用服务器登出接口
            try {
                await apiService.logout();
            } catch (error) {
                console.error('Logout API call failed', error);
            }
            
            // 移除存储的认证信息
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            
            // 清除全局状态
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