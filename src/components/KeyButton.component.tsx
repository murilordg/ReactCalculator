import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface KeyButtonProps {
    type: string;
    onPress: () => void;
}

export function KeyButton({ type, onPress }: KeyButtonProps) {
    const { colors, dark } = useTheme();
    
    const styles = StyleSheet.create({
        keys:{
            borderColor: colors.border,
            borderRadius: 10,
            borderWidth: 1,
            height: 40,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: colors.text,
            fontSize: 30,

        },
        keys2:{
            borderColor: colors.notification,
            borderRadius: 10,
            borderWidth: 1,
            backgroundColor: colors.primary,
            height: 40,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: colors.notification,
            fontSize: 30,
            fontWeight: 'bold',
        },
        keys3:{
            borderColor: colors.notification,
            borderRadius: 10,
            borderWidth: 1,
            height: 40,
            textAlign: 'center',
            textAlignVertical: 'center',
            color: colors.notification,
            fontSize: 30,
            fontWeight: 'bold',
        },
        keyNumber: {
            flex: 1,
            margin: 10,
        },
    });

    let buttonComponent;

    if (type === '=') 
        buttonComponent = (<Text style={styles.keys2}>{type}</Text>);

    else if (type === '+' || type === '-' || type === '*' || type === '/') 
        buttonComponent = (<Text style={styles.keys3}>{type}</Text>);
    
    else 
        buttonComponent = (<Text style={styles.keys}>{type}</Text>);

    return (
        <TouchableOpacity   style={styles.keyNumber} onPress={() => onPress()}>
            {buttonComponent}           
        </TouchableOpacity>
    )
    
}

