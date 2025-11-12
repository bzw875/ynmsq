import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { apiService } from '../services/api';
import { StatisticsType } from '../interface';

const StatisticsScreen: React.FC = () => {
    const [statistics, setStatistics] = useState<StatisticsType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const response = await apiService.fetchStatistics();
            if (response.data.code === 200) {
                setStatistics(response.data.data.list || []);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>统计信息</Text>
                {statistics.length > 0 ? (
                    statistics.map((stat, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.author}>{stat.author}</Text>
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>发布文章</Text>
                                    <Text style={styles.statValue}>{stat.articles_posted}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>收到评论</Text>
                                    <Text style={styles.statValue}>{stat.comments_received}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>获得点赞</Text>
                                    <Text style={styles.statValue}>{stat.total_likes}</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <Text style={styles.statLabel}>获得点踩</Text>
                                    <Text style={styles.statValue}>{stat.total_dislikes}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>暂无统计数据</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 16,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    author: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    statItem: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    statLabel: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: 50,
    },
});

export default StatisticsScreen;