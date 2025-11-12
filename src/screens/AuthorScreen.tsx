import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { apiService } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const AuthorScreen: React.FC = () => {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleTitleChange = (text: string) => {
        setTitle(text);
    };

    const handleContentChange = (text: string) => {
        setContent(text);
    };

    const submitPost = async () => {
        if (!title.trim()) {
            Alert.alert('提示', '请输入标题');
            return;
        }
        
        if (!content.trim()) {
            Alert.alert('提示', '请输入内容');
            return;
        }

        setIsSubmitting(true);
        try {
            // 模拟发送帖子
            // 实际应用中应该调用apiService.createTreeHole或类似方法
            // const response = await apiService.createTreeHole({ title, content });
            
            // 模拟成功响应
            Alert.alert('发布成功', '您的帖子已成功发布！');
            setTitle('');
            setContent('');
            // 刷新我的帖子列表
            fetchMyPosts();
        } catch (error) {
            console.error('发布失败:', error);
            Alert.alert('发布失败', '请稍后再试');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchMyPosts = async () => {
        setLoading(true);
        try {
            // 模拟获取我的帖子
            // const response = await apiService.fetchMyTreeHoles();
            
            // 模拟数据
            setMyPosts([
                {
                    id: 1,
                    title: '我的第一个帖子',
                    content: '这是一个测试帖子内容',
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 2,
                    title: '分享我的经验',
                    content: '今天遇到了一个有趣的问题...',
                    createdAt: new Date(Date.now() - 86400000).toISOString(), // 昨天
                }
            ]);
        } catch (error) {
            console.error('获取帖子失败:', error);
            Alert.alert('获取失败', '无法加载您的帖子');
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = (postId: number) => {
        Alert.alert(
            '确认删除',
            '您确定要删除这篇帖子吗？',
            [
                {
                    text: '取消',
                    style: 'cancel',
                },
                {
                    text: '删除',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // 模拟删除帖子
                            // await apiService.deleteTreeHole(postId);
                            
                            // 更新本地状态
                            setMyPosts(myPosts.filter(post => post.id !== postId));
                            Alert.alert('删除成功', '帖子已删除');
                        } catch (error) {
                            console.error('删除失败:', error);
                            Alert.alert('删除失败', '请稍后再试');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.title}>我的创作</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* 发布新帖子 */}
                <View style={styles.postForm}>
                    <Text style={styles.sectionTitle}>发布新帖子</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="请输入标题"
                        value={title}
                        onChangeText={handleTitleChange}
                        maxLength={100}
                    />
                    <TextInput
                        style={styles.contentInput}
                        placeholder="请输入内容"
                        value={content}
                        onChangeText={handleContentChange}
                        multiline
                        numberOfLines={6}
                        maxLength={1000}
                        textAlignVertical="top"
                    />
                    <TouchableOpacity 
                        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                        onPress={submitPost}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>发布帖子</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* 我的帖子列表 */}
                <View style={styles.myPostsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>我的帖子</Text>
                        <TouchableOpacity onPress={fetchMyPosts}>
                            <Text style={styles.refreshButton}>刷新</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {loading ? (
                        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                    ) : myPosts.length > 0 ? (
                        myPosts.map((post) => (
                            <View key={post.id} style={styles.postItem}>
                                <View style={styles.postInfo}>
                                    <Text style={styles.postTitle}>{post.title}</Text>
                                    <Text style={styles.postDate}>{new Date(post.createdAt).toLocaleString()}</Text>
                                </View>
                                <Text style={styles.postContent} numberOfLines={3}>
                                    {post.content}
                                </Text>
                                <View style={styles.postActions}>
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Text style={styles.editButtonText}>编辑</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.actionButton} 
                                        onPress={() => handleDeletePost(post.id)}
                                    >
                                        <Text style={styles.deleteButtonText}>删除</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>您还没有发布过帖子</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    postForm: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    contentInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 120,
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    myPostsSection: {
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
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    refreshButton: {
        color: '#007AFF',
        fontSize: 16,
    },
    postItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    postInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    postDate: {
        fontSize: 12,
        color: '#8E8E93',
        marginLeft: 8,
    },
    postContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
        lineHeight: 20,
    },
    postActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 12,
    },
    editButtonText: {
        color: '#007AFF',
        fontSize: 14,
    },
    deleteButtonText: {
        color: '#FF3B30',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: '#8E8E93',
        paddingVertical: 40,
    },
    loader: {
        paddingVertical: 40,
    },
});

export default AuthorScreen;