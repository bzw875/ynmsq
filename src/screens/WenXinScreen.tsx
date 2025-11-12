import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { apiService } from '../services/api';

// 简单的文本处理函数
const parseMarkdown = (text: string): string => {
    // 在React Native中，我们不能直接使用HTML，所以这里只做基本的文本处理
    return text
        // 移除代码块标记
        .replace(/```([\s\S]*?)```/g, '$1')
        // 移除行内代码标记
        .replace(/`([^`]+)`/g, '$1')
        // 移除链接标记，只保留文本
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
};

const WenXinScreen: React.FC = () => {
    const [promptInput, setPromptInput] = useState('你好，我想了解一些关于AI的知识');
    const [suggestions, setSuggestions] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (text: string) => {
        setPromptInput(text);
    };

    const sendPrompt = async () => {
        if (!promptInput.trim()) {
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.queryWenXin(promptInput);
            if (response.data && response.data.result) {
                setSuggestions(response.data.result);
            }
        } catch (error) {
            console.error('文心一言 请求错误:', error);
        } finally {
            setLoading(false);
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
                        <Text style={styles.icon}>🧠</Text>
                        <Text style={styles.title}>文心一言</Text>
                    </View>

                    {/* 结果展示区域 */}
                    {suggestions ? (
                        <View style={styles.responseCard}>
                            <View style={styles.responseHeader}>
                                <Text style={styles.icon}>🧠</Text>
                                <Text style={styles.responseTitle}>文心一言 回复</Text>
                            </View>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#FF6B6B" />
                                    <Text style={styles.loadingText}>正在生成回复...</Text>
                                </View>
                            ) : (
                                <Text style={styles.responseText}>{parseMarkdown(suggestions)}</Text>
                            )}
                        </View>
                    ) : loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF6B6B" />
                            <Text style={styles.loadingText}>正在生成回复...</Text>
                        </View>
                    ) : null}
                </ScrollView>

                {/* 输入区域 */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="请输入您的问题..."
                        value={promptInput}
                        onChangeText={handleChange}
                        multiline
                        numberOfLines={4}
                        maxLength={500}
                        editable={!loading}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, loading && styles.disabledButton]}
                        onPress={sendPrompt}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.sendButtonText}>发送</Text>
                        )}
                    </TouchableOpacity>
                </View>
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
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    icon: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    responseCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B6B',
    },
    responseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    responseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    responseText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 12,
        color: '#8E8E93',
    },
    inputContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    sendButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default WenXinScreen;