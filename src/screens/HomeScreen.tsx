import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';
import {
    SortEnum,
    FieldEnum,
    TreeHoleType,
    RangeNum,
    QueryParams,
} from '../interface';
import TreeHoleCell from '../components/TreeHoleCell';
import NavigatorBar from '../components/NavigatorBar';
import FilterBar from '../components/FilterBar';
import { debounce } from '../utils';

const PAGE_SIZE = 20;

export const DEFAULT_QUERY: QueryParams = {
    page: 0,
    size: PAGE_SIZE,
    field: FieldEnum.DATE,
    sort: SortEnum.DESC,
    likeRange: RangeNum.NoLimit,
};

type RootStackParamList = {
    HomeTab: {
        page?: number;
        field?: string;
        sort?: string;
        likeRange?: string;
    };
};

const HomeScreen: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'HomeTab'>>();
    const navigation = useNavigation();
    const initialParams = route.params || {};
    
    const [treeHoles, setTreeHoles] = useState<TreeHoleType[]>([]);
    const [page, setPage] = useState(initialParams.page || DEFAULT_QUERY.page);
    const [total, setTotal] = useState(0);
    const [likeRange, setLikeRange] = useState(initialParams.likeRange || DEFAULT_QUERY.likeRange);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const size = PAGE_SIZE;

    const handleQuery = async (
        currentPage: number,
        currentLikeRange: string
    ) => {
        setIsLoading(true);
        try {
            const response = await apiService.fetchAllTreeHole({
                page: currentPage,
                size,
                field: FieldEnum.DATE,
                sort: SortEnum.DESC,
                likeRange: currentLikeRange,
            });
            
            if (response.data.code === 200) {
                setTreeHoles(response.data.data.list || []);
                setTotal(response.data.data.total);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        handleQuery(page, likeRange);
    };

    const handlePageChange = debounce((newPage: number) => {
        setPage(newPage);
    }, 300);

    const handleLikeRangeChange = debounce((newRange: RangeNum) => {
        setLikeRange(newRange);
        setPage(0);
    }, 300);

    const handleAgentPress = () => {
        navigation.navigate('Agent' as never);
    };

    const handleWenXinPress = () => {
        navigation.navigate('WenXin' as never);
    };

    useEffect(() => {
        handleQuery(page, likeRange);
    }, [page, likeRange]);

    const renderItem = ({ item }: { item: TreeHoleType }) => (
        <TreeHoleCell treeHole={item} />
    );

    const renderFooter = () => {
        if (!isLoading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>醇享版</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleAgentPress}>
                        <Text style={styles.icon}>🤖</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={handleWenXinPress}>
                        <Text style={styles.icon}>🧠</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0, paddingHorizontal: 8 }}>
                <NavigatorBar
                    page={page}
                    size={size}
                    total={total}
                    onPageChange={handlePageChange}
                />
                <FilterBar 
                    likeRange={likeRange as RangeNum} 
                    onLikeRangeChange={handleLikeRangeChange} 
                />
            </View>
            
            {isLoading && treeHoles.length === 0 ? (
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            ) : (
                <FlatList
                    data={treeHoles}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#007AFF']}
                        />
                    }
                    ListFooterComponent={renderFooter}
                />
            )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    buttonsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    icon: {
        fontSize: 20,
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
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    },
});

export default HomeScreen;