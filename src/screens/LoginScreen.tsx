import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { apiService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleUsernameChange = (text: string) => {
        setUsername(text);
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        if (!username.trim()) {
            Alert.alert('提示', '请输入用户名');
            return;
        }
        
        if (!password.trim()) {
            Alert.alert('提示', '请输入密码');
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiService.login(username, password);
            if (response.data.code === 200) {
                Alert.alert('登录成功', '欢迎回来！');
                // 导航回上一页或账户页面
                navigation.goBack();
            } else {
                Alert.alert('登录失败', response.data.message || '请检查用户名和密码');
            }
        } catch (error) {
            console.error('登录失败:', error);
            Alert.alert('登录失败', '网络错误，请稍后再试');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        // 简单的注册逻辑，实际应用中可能需要单独的注册页面
        if (!username.trim()) {
            Alert.alert('提示', '请输入用户名');
            return;
        }
        
        if (!password.trim()) {
            Alert.alert('提示', '请输入密码');
            return;
        }

        setIsLoading(true);
        try {
            // 模拟注册逻辑
            // 实际应用中应该调用apiService.register或类似方法
            // const response = await apiService.register(username, password);
            
            // 模拟成功
            Alert.alert('注册成功', '请使用您的用户名和密码登录');
        } catch (error) {
            console.error('注册失败:', error);
            Alert.alert('注册失败', '网络错误，请稍后再试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <TouchableOpacity 
                            style={styles.backButton} 
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backIcon}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>登录</Text>
                        <View style={styles.placeholder} />
                    </View>

                    <View style={styles.formContainer}>
                        <Text style={styles.welcomeText}>欢迎回来</Text>
                        <Text style={styles.subtitleText}>请登录您的账户继续</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>用户名</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="请输入用户名"
                                value={username}
                                onChangeText={handleUsernameChange}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>密码</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="请输入密码"
                                    value={password}
                                    onChangeText={handlePasswordChange}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity 
                                    style={styles.eyeIcon} 
                                    onPress={toggleShowPassword}
                                >
                                    <Text style={styles.eyeIconText}>
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.forgotPassword}>
                            <Text style={styles.forgotPasswordText}>忘记密码？</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginButton, isLoading && styles.disabledButton]}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>登录</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>还没有账户？</Text>
                            <TouchableOpacity onPress={handleRegister}>
                                <Text style={styles.registerLink}>立即注册</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>或</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.socialLoginContainer}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialIcon}>📱</Text>
                                <Text style={styles.socialText}>手机号登录</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton}>
                                <Text style={styles.socialIcon}>🧩</Text>
                                <Text style={styles.socialText}>第三方登录</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 4,
    },
    backIcon: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 32,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    passwordInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 4,
    },
    eyeIconText: {
        fontSize: 20,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    registerText: {
        fontSize: 14,
        color: '#8E8E93',
    },
    registerLink: {
        fontSize: 14,
        color: '#007AFF',
        marginLeft: 4,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#8E8E93',
        fontSize: 14,
    },
    socialLoginContainer: {
        gap: 12,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    socialIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    socialText: {
        fontSize: 16,
        color: '#333',
    },
});

export default LoginScreen;