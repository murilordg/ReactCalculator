import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useAppSelector } from '../stores/hooks';

interface DisplayProps {
    
}

export function Display() {
  const { colors, dark } = useTheme();
  const [caret, setCaret] = useState(true);

  const line1 = useAppSelector((state) => state.calculator.line1);
  const line2 = useAppSelector((state) => state.calculator.line2);

  //console.log('line1:', line1);
  //console.log('line2:', line2);
  
  const styles = StyleSheet.create({
    displayContainer: {  
      flex: 3,
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    displayTextLine1: {
      textAlign: 'right',
      paddingRight: 20,
      color: colors.text,
      backgroundColor: colors.card,
      fontSize: 45,
    },
    displayTextLine2: {
      textAlign: 'right',
      paddingRight: 20,

      color: colors.border,
      backgroundColor: colors.card,
      fontSize: 35,
    },
  
  });

  useEffect(() => {
    const interval = setInterval(() => setCaret((prev) => !prev), 700);
    return () => clearInterval(interval);
  },[])

  return (
      <View style={styles.displayContainer}>
        
        <Text style={styles.displayTextLine1}>{line1}{caret ? (<Text>|</Text>) : (<Text style={{color:colors.card}}>|</Text>)}</Text>
          

        <Text style={styles.displayTextLine2}>{line2}</Text>        
      </View>
  );
    
}


