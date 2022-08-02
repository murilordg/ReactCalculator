import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '@react-navigation/native';
import { KeyButton } from './KeyButton.component';
import { useAppDispatch } from '../stores/hooks';
import { push, backspace, calculate, pushFn, clean } from '../stores/calculatorSlice';
import { ExpressionsList } from './ExpressionsList';

interface IconProps {
  name: string;
  size?: number;
}
function Icon({ name, size }: IconProps) {
  return (<Text>{name}</Text>)
}

export function Keyboard() {
  const { colors, dark } = useTheme();
  const [ showHistory, setShowHistory ] = useState(false);
  const dispatch = useAppDispatch();
  const pressedKey = (dig: string) => dispatch(push(dig));
  const pressedBS = () => dispatch(backspace());
  const pressEqual = () => { dispatch(calculate()); if(showHistory) toggleHistory(); }
  const pressedFn =(fn: string) => dispatch(pushFn(fn));
  const pressedClean =() => dispatch(clean());  

  const styles = StyleSheet.create({
    buttonsContatiner: {
      height:50,
      padding: 10,
      flexDirection:'row',    
      justifyContent: 'space-between',
    },
    buttonContainer: {
      width: 30,   
      height: 30,
      borderColor: colors.border,
      borderWidth: 1,
      marginLeft: 10,
      borderRadius: 10,
      //elevation: 10,
    },
    buttonText: {
      color: colors.primary,
      textAlign: 'center',
      paddingTop: 6,
      marginRight: 10,
      paddingLeft: 10,
    },
    backspace: {
      color: colors.primary,
      marginRight: 15,
    },   

    keyboardContainer: { 
      flex: 6,
      flexDirection:'column',
  
    },  
    keysContainer: { 
      flexDirection:'row',
      flex: 1,
    },    

    historyExpr: {
     padding: 5,
     fontSize: 20,
     color: colors.primary,
     textAlign: 'right',
   },

   historyResult: {
    padding: 5,
    paddingBottom: 20,
    fontSize: 25,
    color: colors.border,
    textAlign: 'right',
    backgroundColor: 'red'
  },

  });

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  }

  let buttonsSwitch = (
      <View style={styles.buttonsContatiner}>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => toggleHistory()}>
          <Text style={styles.buttonText}>
            {showHistory ? (<Icon name="calculator" size={15}/>) : (<Icon name="clipboard" size={15}/>)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pressedBS()}>
          <Text style={styles.backspace}><Icon name="backspace" size={35}/></Text>
        </TouchableOpacity>
        
      </View>
  );
  
  return (
      <View style={styles.keyboardContainer}>
          
        {buttonsSwitch}

        <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
          { showHistory ? <ExpressionsList exprSelected={() => toggleHistory()} /> : (
            <View style={{backgroundColor: colors.background, flex:7, paddingTop: 10, paddingLeft: 10}}>
              <View style={styles.keysContainer}>
                <KeyButton type={'C'} onPress={() => pressedClean()} />
                <KeyButton type={'('} onPress={() => pressedKey('(')} />
                <KeyButton type={')'} onPress={() => pressedKey(')')} />
              </View>

              <View style={styles.keysContainer}>
                <KeyButton type={'7'} onPress={() => pressedKey('7')} />
                <KeyButton type={'8'} onPress={() => pressedKey('8')} />
                <KeyButton type={'9'} onPress={() => pressedKey('9')} />
              </View>

              <View style={styles.keysContainer}>
                <KeyButton type={'4'} onPress={() => pressedKey('4')} />
                <KeyButton type={'5'} onPress={() => pressedKey('5')} />
                <KeyButton type={'6'} onPress={() => pressedKey('6')} />
              </View>

              <View style={styles.keysContainer}>
                <KeyButton type={'1'} onPress={() => pressedKey('1')} />
                <KeyButton type={'2'} onPress={() => pressedKey('2')} />
                <KeyButton type={'3'} onPress={() => pressedKey('3')} />
              </View>

              <View style={styles.keysContainer}>
                <KeyButton type={'+/-'} onPress={() => pressedFn('+/-')} />
                <KeyButton type={'0'} onPress={() => pressedKey('0')} />
                <KeyButton type={'.'} onPress={() => pressedKey('.')} />
              </View>
            </View>
          )}
          <View style={{backgroundColor: colors.background, flex:2, paddingTop: 10, paddingRight: 10}}>

            <View style={styles.keysContainer}>
              <KeyButton type={'/'} onPress={() => pressedKey('/')} />
            </View>

            <View style={styles.keysContainer}>
              <KeyButton type={'*'} onPress={() => pressedKey('*')} />
            </View>

            <View style={styles.keysContainer}>
              <KeyButton type={'-'} onPress={() => pressedKey('-')} />
            </View>

            <View style={styles.keysContainer}>
              <KeyButton type={'+'} onPress={() => pressedKey('+')} />
            </View>

            <View style={styles.keysContainer}>
              <KeyButton type={'='} onPress={() => pressEqual()} />
            </View>

          </View>
        </View>
      </View>
  )
    
}


