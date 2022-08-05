import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './src/stores';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Display } from './src/components/Display.component';
import { Keyboard } from './src/components/Keyboard.component';
import { ThemeOptions } from './src/components/ThemeOptions.components';

const MyDarkTheme = {
  dark: true,
  colors: {
    primary: '#A0A5A3',
    background: '#171817',
    card: 'black',
    text: '#E5ECE9',
    border: '#B7BDBA',
    notification: 'white',
  },
};

const MyLightTheme = { 
  dark: false,
  colors: {
    primary: '#A9B4C7',
    background: '#FAFBFB',
    card: 'white',
    text: '#274472',
    border: '#7D8FAA',
    notification: '#454746',
  },
};

export default function App() {
  const [ dark, setDark ] = useState(true);
  const { height, width } = useWindowDimensions();

  const isPortrait = (height >= width);

  const toggleTheme = () => {
    setDark((dark) => !dark);
  };

  const theme = (dark ? MyDarkTheme : MyLightTheme);

  const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: theme.colors.card,
        flex: 1,
    },
  });

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          <View style={styles.appContainer}>
            <ThemeOptions toggleTheme={toggleTheme} />
            
            {
            (isPortrait) ? 
              (<><Display /><Keyboard /></>) : 
              (
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Display />
                  <Keyboard />
                </View>
              )
            }
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}