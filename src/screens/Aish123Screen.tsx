import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { apiService } from '../services/api';
import { AishType } from '../interface';

const Aish123Screen: React.FC = () => {
    const [posts, setPosts] = useState<AishType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAish123();
    }, []);

    const fetchAish123 = async () => {
        try {
            const response = await apiService.fetchAish123();
            if (response.data.code === 200) {
                setPosts(response.data.data.list || []);
            }
        } catch (error) {
            console.error('Error fetching Aish123 posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }: { item: AishType }) => (
        <View style={styles.postItem}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text style={styles.postAuthor}>作者: {item.author}</Text>
            <Text style={styles.postPublishTime}>发布时间: {item.publishTime}</Text>
            <Text style={styles.postInfo}>
                回复: {item.replyCount} | 阅读: {item.readCount}
            </Text>
            <Text style={styles.postArea}>地区: {item.area}</Text>
            {item.lastReplier && (
                <Text style={styles.postLastReply}>
                    最后回复: {item.lastReplier} ({item.lastReplyTime})
                </Text>
            )}
        </View>
    );

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Aish123</Text>
            </View>
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.articleId || index.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>暂无内容</Text>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    listContent: {
        paddingVertical: 8,
        flexGrow: 1,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: 50,
    },
    postItem: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
    postAuthor: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    postPublishTime: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    postInfo: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    postArea: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    postLastReply: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 8,
        fontStyle: 'italic',
    },
});

export default Aish123Screen;