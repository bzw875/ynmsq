import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

// Mock用户数据类型
interface UserData {
    username: string;
    avatar: string;
    email: string;
}

const AccountScreen: React.FC = () => {
    const navigation = useNavigation();
    const [isLogin, setIsLogin] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 检查用户是否已登录
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            setLoading(true);
            // 检查本地存储的用户信息
            const userDataStr = await AsyncStorage.getItem('userData');
            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                setUserData({
                    username: userData.username || '用户',
                    avatar: '👤',
                    email: userData.email || '',
                });
                setIsLogin(true);
            }
        } catch (error) {
            console.error('检查登录状态失败:', error);
            setIsLogin(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        // 导航到登录页面
        navigation.navigate('Login' as never);
    };

    const handleLogout = async () => {
        Alert.alert(
            '确认退出',
            '您确定要退出登录吗？',
            [
                {
                    text: '取消',
                    style: 'cancel',
                },
                {
                    text: '确定',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await apiService.logout();
                            setUserData(null);
                            setIsLogin(false);
                            Alert.alert('退出成功', '已成功退出登录');
                        } catch (error) {
                            console.error('退出登录失败:', error);
                            Alert.alert('退出失败', '请稍后再试');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleAuthorPage = () => {
        // 导航到作者页面
        navigation.navigate('Author' as never);
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>账户</Text>
            </View>

            <View style={styles.content}>
                {isLogin && userData ? (
                    <View style={styles.userInfoCard}>
                        <Text style={styles.avatar}>{userData.avatar}</Text>
                        <Text style={styles.username}>{userData.username}</Text>
                        <Text style={styles.email}>{userData.email}</Text>
                    </View>
                ) : (
                    <View style={styles.loginPrompt}>
                        <Text style={styles.loginPromptText}>您还未登录</Text>
                    </View>
                )}

                <View style={styles.menuContainer}>
                    {isLogin ? (
                        <>
                            <TouchableOpacity style={styles.menuItem} onPress={handleAuthorPage}>
                                <Text style={styles.menuIcon}>✍️</Text>
                                <Text style={styles.menuText}>我的创作</Text>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.menuItem}>
                                <Text style={styles.menuIcon}>⭐</Text>
                                <Text style={styles.menuText}>我的收藏</Text>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity style={styles.menuItem}>
                                <Text style={styles.menuIcon}>⚙️</Text>
                                <Text style={styles.menuText}>设置</Text>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                        </>
                    ) : null}
                </View>

                <View style={styles.buttonContainer}>
                    {isLogin ? (
                        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                            <Text style={styles.logoutButtonText}>退出登录</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
                            <Text style={styles.loginButtonText}>登录 / 注册</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    userInfoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    avatar: {
        fontSize: 64,
        marginBottom: 12,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 14,
        color: '#8E8E93',
    },
    loginPrompt: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginPromptText: {
        fontSize: 16,
        color: '#8E8E93',
    },
    menuContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    menuArrow: {
        fontSize: 20,
        color: '#8E8E93',
    },
    buttonContainer: {
        paddingHorizontal: 20,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: '#007AFF',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AccountScreen;