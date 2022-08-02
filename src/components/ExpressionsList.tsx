import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, FlatList, Button } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useAppDispatch } from '../stores/hooks';
import { pushExpression } from '../stores/calculatorSlice';

import sqliteExpressions from '../api/sqlite-expressions'
import { IExpression } from '../api/IExpression';

interface ExpressionsListProps {
    exprSelected: () => void
}

export function ExpressionsList({ exprSelected }: ExpressionsListProps) {
    const { colors, dark } = useTheme();
    const [ epressions, setEpressions ] = useState<IExpression[]>([]);
    const dispatch = useAppDispatch();

    useEffect(() => {
        sqliteExpressions.List().then((exprs) => {
            
            setEpressions(exprs.reverse());

        });

    }, []);

    const pressedExpr = (expr: string) => {
        dispatch(pushExpression(expr));
        exprSelected();
    }

    const cleanExpressions = () => {
        sqliteExpressions.RemoveAll();
        exprSelected();
    }

    const styles = StyleSheet.create({
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
        },

    });

    return (
        <View style={{backgroundColor: colors.background, flex:7, paddingTop: 10, marginRight: 1}}>
            <FlatList
            data={epressions}
            renderItem={({item}) => (
                <View style={{flexDirection:'column', justifyContent: 'flex-end'}}>
                    <TouchableOpacity onPress={() => pressedExpr(item.expression)}>
                    <Text style={styles.historyExpr}>{item.expression}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pressedExpr(item.result)}>
                    <Text style={styles.historyResult}>={item.result}</Text>
                    </TouchableOpacity>
                </View>
            )}
            />

            <Button color={colors.border} onPress={()=>cleanExpressions()} title='Limpar histórico' />
        </View>
    )
    
}


