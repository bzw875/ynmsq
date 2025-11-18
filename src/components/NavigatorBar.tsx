import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SortEnum, FieldEnum } from '../interface';

interface NavigatorBarProps {
    page: number;
    size: number;
    total: number;
    onPageChange: (page: number) => void;
}



const NavigatorBar: React.FC<NavigatorBarProps> = ({
    page,
    size,
    total,
    onPageChange,
}) => {
    const pages = Math.ceil(total / size);
    
    const pageList = useMemo(() => {
        if (pages === 0) return [];
        
        const arr = [page];
        const offset = 3;
        
        for (let i = page + 1; i < Math.min(page + offset, pages); i++) {
            arr.push(i);
        }
        
        for (let j = page - 1; j > page - offset; j--) {
            if (j >= 0) {
                arr.unshift(j);
            }
        }

        if (!arr.includes(0)) {
            arr.unshift(0);
        }

        if (!arr.includes(pages - 1)) {
            arr.push(pages - 1);
        }
        
        return arr;
    }, [total, size, page, pages]);


    if (total === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.pagination}>
                {page > 0 && (
                    <TouchableOpacity onPress={() => onPageChange(page - 1)}>
                        <Text style={styles.paginationButton}>上页</Text>
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
                        <Text style={styles.paginationButton}>下页</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f8f8',
        flexWrap: 'wrap',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    paginationButton: {
        paddingHorizontal: 6,
        paddingVertical: 3,
        backgroundColor: '#f2f2f2',
        color: '#007AFF',
    },
    pageButton: {
        paddingHorizontal: 5,
        paddingVertical: 3,
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
        color: '#666',
        height: 40,
    },
    androidPicker: {
        width: 100,
        color: '#666',
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