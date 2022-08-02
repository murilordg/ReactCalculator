import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '.'
import calculator from '../api/calculator'
import sqliteExpressions from '../api/sqlite-expressions'

// Define a type for the slice state
interface CalculatorState {
  line1: string;
  line2: string;
  history: string[];
}

// Define the initial state using that type
const initialState: CalculatorState = {
  line1: '',
  line2: '',
  history: [],
}

export const calculateSlice = createSlice({
  name: 'calculator',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    push: (state, action: PayloadAction<string>) => {
      if (calculator.push(action.payload)) {
        state.line1 = calculator.getExpression();
        state.line2 = calculator.getResult();

      }
    },
    pushFn: (state, action: PayloadAction<string>) => {
      if (calculator.pushFn(action.payload)) {
        state.line1 = calculator.getExpression();
        state.line2 = calculator.getResult();

      }
    }, 
    pushExpression: (state, action: PayloadAction<string>) => {
      if (calculator.pushExpression(action.payload)) {
        state.line1 = calculator.getExpression();
        state.line2 = calculator.getResult();

      }
    }, 
    clean: (state) => {
      calculator.clean();
      state.line1 = '';
      state.line2 = ' ';

    },
    backspace: (state) => {
      const rawExpr = calculator.getRawExpression();

      if (rawExpr.length > 0) {
        calculator.clean();
        calculator.pushExpression(rawExpr.substring(0, rawExpr.length-1));

        state.line1 = calculator.getExpression();
        state.line2 = calculator.getResult();

      }

    },
    calculate: (state) => {

      if (!calculator.IsValidResult) {
        state.line2 = '(err)';
        return;

      }

      sqliteExpressions.Add(state.line1, state.line2);

      const resultExpr = state.line2.replace(/\./g, '').replace(',', '.');
      
      ////calculateSlice.actions.clean();
      calculator.clean();
      calculator.pushExpression(resultExpr);
      state.line1 = calculator.getExpression();
      state.line2 = ' ';

    }
  },
})

export const { push, pushExpression, backspace, calculate, pushFn, clean } = calculateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const CalculatorHistory = (state: RootState) => state.calculator.history;

export default calculateSlice.reducer