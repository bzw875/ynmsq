import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { apiService } from '../services/api';
import { TreeHoleType } from '../interface';
import TreeHoleCell from '../components/TreeHoleCell';

const SearchScreen: React.FC = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<TreeHoleType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!keyword.trim()) {
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        try {
            const response = await apiService.searchTreeHole(keyword);
            if (response.data.code === 200) {
                setResults(response.data.data.list || []);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderItem = ({ item }: { item: TreeHoleType }) => (
        <TreeHoleCell treeHole={item} />
    );

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            );
        }

        if (hasSearched && results.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>没有找到相关内容</Text>
                </View>
            );
        }

        return null;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="搜索内容..."
                    value={keyword}
                    onChangeText={setKeyword}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>搜索</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={results}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginRight: 12,
    },
    searchButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    listContent: {
        paddingVertical: 8,
        flexGrow: 1,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#8E8E93',
    },
});

export default SearchScreen;