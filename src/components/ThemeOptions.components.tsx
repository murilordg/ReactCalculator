import React from 'react';
import { View, Switch, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '@react-navigation/native';
  
interface ThemeOptionsProps {
    toggleTheme: () => void
}   

export function ThemeOptions({ toggleTheme }: ThemeOptionsProps) {
    const { colors, dark } = useTheme();

    const handleToggleTheme = () => {

        toggleTheme();

    }

    return (
        <View style={{
            backgroundColor: colors.card,
            height:30,
            flexDirection: 'row-reverse',
        }}>
            <Icon name="moon" style={{
                color: '#8C8E91',
                textAlignVertical: 'center',
                fontSize: 20,
                paddingRight: 16, 
            }}/>

            <Switch
                value={dark}
                onValueChange={() => handleToggleTheme()}
                thumbColor={'#E5E5E5'}
                trackColor={{
                    false: '#8C8E91',
                    true: '#E9ECF1',
                }}
            />

            <Icon name="sun" style={{
                color: '#E9ECF1',     
                paddingRight: 8, 
                textAlignVertical: 'center',
                fontSize: 20,
            }} />

        </View>
    );
    
}
