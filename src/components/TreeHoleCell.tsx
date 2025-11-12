import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TreeHoleType } from '../interface';
import { timeFromNow, removeImgTag, extractImgUrl } from '../utils';

interface TreeHoleCellProps {
    treeHole: TreeHoleType;
}

const TreeHoleCell: React.FC<TreeHoleCellProps> = ({ treeHole }) => {
    const navigation = useNavigation<any>();
    const { author, content, id, vote_negative, vote_positive, sub_comment_count, date_gmt, ip_location } = treeHole;
    const imgUrl = extractImgUrl(content);

    const handleAuthorPress = () => {
        navigation.navigate('Author', { author });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleAuthorPress}>
                    <Text style={styles.author}>{author}</Text>
                </TouchableOpacity>
                <Text style={styles.id}>ID: {id}</Text>
            </View>
            <View style={styles.stats}>
                <Text style={styles.statItem}>{timeFromNow(date_gmt)}</Text>
                <Text style={styles.statItem}>IP: {ip_location}</Text>
                <Text style={styles.statItem}>👍: {vote_positive}</Text>
                <Text style={styles.statItem}>👎: {vote_negative}</Text>
                <Text style={styles.statItem}>💬: {sub_comment_count}</Text>
            </View>
            <Text style={styles.content}>{removeImgTag(content)}</Text>
            {imgUrl && (
                <Image source={{ uri: imgUrl }} style={styles.image} resizeMode="cover" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        marginVertical: 8,
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    author: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    id: {
        fontSize: 12,
        color: '#8E8E93',
    },
    stats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    statItem: {
        fontSize: 12,
        color: '#8E8E93',
        marginRight: 12,
        marginBottom: 4,
    },
    content: {
        fontSize: 16,
        color: '#000',
        lineHeight: 22,
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
    },
});

export default TreeHoleCell;