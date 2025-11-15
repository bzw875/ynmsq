import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SortEnum, FieldEnum } from '../interface';

interface NavigatorBarProps {
    page: number;
    size: number;
    total: number;
    sort: SortEnum;
    field: FieldEnum;
    onPageChange: (page: number) => void;
    onSizeChange: (size: number) => void;
    onSortChange: (sort: SortEnum) => void;
    onFieldChange: (field: FieldEnum) => void;
}

const sizeList = [10, 25, 50, 100, 200, 400];
const fieldList = [FieldEnum.DATE, FieldEnum.LIKE, FieldEnum.DISLIKE, FieldEnum.COMMENT];
const fieldNameList = ['日期', '喜欢', '不喜欢', '评论'];

const NavigatorBar: React.FC<NavigatorBarProps> = ({
    page,
    size,
    total,
    sort,
    field,
    onPageChange,
    onSizeChange,
    onSortChange,
    onFieldChange,
}) => {
    const pages = Math.ceil(total / size);
    
    const pageList = useMemo(() => {
        if (pages === 0) return [];
        
        const arr = [page];
        const offset = 5;
        
        for (let i = page + 1; i < Math.min(page + offset, pages); i++) {
            arr.push(i);
        }
        
        for (let j = page - 1; j > page - offset; j--) {
            if (j >= 0) {
                arr.unshift(j);
            }
        }
        
        return arr;
    }, [total, size, page, pages]);

    const handleSort = () => {
        onSortChange(sort === SortEnum.ASC ? SortEnum.DESC : SortEnum.ASC);
    };

    if (total === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.pagination}>
                {page > 0 && (
                    <TouchableOpacity onPress={() => onPageChange(page - 1)}>
                        <Text style={styles.paginationButton}>上一页</Text>
                    </TouchableOpacity>
                )}
                
                {pageList.map((index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onPageChange(index)}
                        style={[
                            styles.pageButton,
                            index === page && styles.activePageButton
                        ]}
                    >
                        <Text 
                            style={[
                                styles.pageButtonText,
                                index === page && styles.activePageButtonText
                            ]}
                        >
                            {index + 1}
                        </Text>
                    </TouchableOpacity>
                ))}
                
                {page < pages - 1 && (
                    <TouchableOpacity onPress={() => onPageChange(page + 1)}>
                        <Text style={styles.paginationButton}>下一页</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            <View style={styles.sizeSelector}>
                <Text style={styles.label}>每页条数:</Text>
                <Picker
                    selectedValue={size}
                    onValueChange={(itemValue) => onSizeChange(Number(itemValue))}
                    style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
                >
                    {sizeList.map((itemSize) => (
                        <Picker.Item key={itemSize} label={String(itemSize)} value={itemSize} />
                    ))}
                </Picker>
            </View>
            
            <View style={styles.sortContainer}>
                <TouchableOpacity onPress={handleSort} style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>
                        {sort === SortEnum.ASC ? '↑' : '↓'}
                    </Text>
                </TouchableOpacity>
                
                {fieldList.map((fieldItem, index) => (
                    <TouchableOpacity
                        key={fieldItem}
                        onPress={() => onFieldChange(fieldItem)}
                        style={[
                            styles.fieldButton,
                            field === fieldItem && styles.activeFieldButton
                        ]}
                    >
                        <Text 
                            style={[
                                styles.fieldButtonText,
                                field === fieldItem && styles.activeFieldButtonText
                            ]}
                        >
                            {fieldNameList[index]}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f8f8',
        flexWrap: 'wrap',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    paginationButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 4,
        color: '#007AFF',
    },
    pageButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginHorizontal: 2,
        borderRadius: 4,
    },
    activePageButton: {
        backgroundColor: '#007AFF',
    },
    pageButtonText: {
        color: '#666',
    },
    activePageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sizeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        marginRight: 8,
        color: '#666',
    },
    iosPicker: {
        width: 100,
        height: 40,
    },
    androidPicker: {
        width: 100,
        height: 50,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortButton: {
        padding: 8,
        marginRight: 4,
    },
    sortButtonText: {
        fontSize: 18,
        color: '#007AFF',
    },
    fieldButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 4,
    },
    activeFieldButton: {
        backgroundColor: '#e3f2fd',
        borderRadius: 4,
    },
    fieldButtonText: {
        color: '#666',
    },
    activeFieldButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
});

export default NavigatorBar;