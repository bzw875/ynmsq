import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RangeNum } from '../interface';

interface FilterBarProps {
    likeRange: RangeNum;
    onLikeRangeChange: (range: RangeNum) => void;
}

const nameList = [
    RangeNum.NoLimit,
    RangeNum.TwentyFive,
    RangeNum.Fifty,
    RangeNum.OneHundred,
    RangeNum.TwoHundred,
    RangeNum.FourHundred,
    RangeNum.Infinity
];

const FilterBar: React.FC<FilterBarProps> = ({ likeRange, onLikeRangeChange }) => {
    if (Platform.OS === 'ios') {
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={likeRange}
                    onValueChange={(itemValue) => onLikeRangeChange(itemValue as RangeNum)}
                    style={styles.picker}
                    mode="dropdown"
                >
                    {nameList.map((range) => (
                        <Picker.Item key={range} label={range} value={range} />
                    ))}
                </Picker>
            </View>
        );
    }

    // Android implementation
    return (
        <View style={styles.container}>
            <Picker
                selectedValue={likeRange}
                onValueChange={(itemValue) => onLikeRangeChange(itemValue as RangeNum)}
                style={styles.picker}
            >
                {nameList.map((range) => (
                    <Picker.Item key={range} label={range} value={range} />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 16,
    },
    picker: {
        width: 120,
        height: 40,
    },
});

export default FilterBar;