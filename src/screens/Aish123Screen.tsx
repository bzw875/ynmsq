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
import { TreeHoleType } from '../interface';
import TreeHoleCell from '../components/TreeHoleCell';

const Aish123Screen: React.FC = () => {
    const [posts, setPosts] = useState<TreeHoleType[]>([]);
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

    const renderItem = ({ item }: { item: TreeHoleType }) => (
        <TreeHoleCell treeHole={item} />
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
                keyExtractor={(item) => item.id.toString()}
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
});

export default Aish123Screen;