
enum TokenType {
    None,
    Number,
    Signal,
    Operator,
    OpenBracket,
    CloseBracket,
    FN,
}

class Token {
    token: string;
    tokenType: TokenType;

    constructor (_token: string, _tokenType?: TokenType) {
        this.token = _token;
        this.tokenType = (_tokenType) ? _tokenType : Token.getTokenType(_token);

    }

    static getTokenType(token: string): TokenType {
        switch (token) {
            case '+': return TokenType.Operator;
            case '-': return TokenType.Operator;
            case '*': return TokenType.Operator;
            case '/': return TokenType.Operator;
            case '(': return TokenType.OpenBracket;
            case ')': return TokenType.CloseBracket;
            case '%': return TokenType.FN;
            default: return TokenType.Number;
        }
    }
}

class Calculator {
    tokens: Token[];
    numberOfDecimals: number;

    IsValidResult: boolean;

    constructor() {
        this.tokens = [];
        this.numberOfDecimals = 0;
        this.IsValidResult = false;
    }

    clean() {
        this.tokens = [];
        this.numberOfDecimals = 0;
    }

    private applySignalChange() {
        let lastTokenType: TokenType;

        if (this.tokens.length === 0) lastTokenType = TokenType.None;
        else lastTokenType = this.tokens[this.tokens.length-1].tokenType;

        if (lastTokenType === TokenType.Number) {

            const token = this.tokens.pop()!;

            this.tokens.push(new Token('('));

            if (token.token.substring(0, 1) === '-') {
                token.token = token.token.substring(1);
            } else {
                token.token = `-${token.token}`;
            }

            this.tokens.push(token);

            this.tokens.push(new Token(')'));

            return true;

        } else if (lastTokenType === TokenType.CloseBracket) {

            if (this.tokens[this.tokens.length-2].tokenType === TokenType.Number
                && this.tokens[this.tokens.length-3].tokenType === TokenType.OpenBracket) {

                this.tokens.pop()!;
                const token = this.tokens.pop()!;
                
                if (token.token.substring(0, 1) === '-') {
                    token.token = token.token.substring(1);
                } else {
                    token.token = `-${token.token}`;
                }
                
                this.tokens.push(token);

                this.tokens.push(new Token(')'));

                return true;

            }

        }

        return false; 
    }

    pushFn(fn: string): boolean {

        if (fn === '+/-') return this.applySignalChange();
        
        return false;
         
    }

    pushOpenBracket(): boolean {  
        let lastTokenType: TokenType;

        if (this.tokens.length === 0) lastTokenType = TokenType.None;
        else lastTokenType = this.tokens[this.tokens.length-1].tokenType;

        if (lastTokenType === TokenType.None
            || lastTokenType === TokenType.Operator
            || lastTokenType === TokenType.OpenBracket) {

            this.tokens.push(new Token('(', TokenType.OpenBracket));
            return true; 

        } else if (lastTokenType === TokenType.Number
                   || lastTokenType === TokenType.CloseBracket) {

            this.tokens.push(new Token('*', TokenType.Operator));
            this.tokens.push(new Token('(', TokenType.OpenBracket));
            return true; 

        }      
        
        return false; 
    }    

    pushCloseBracket(): boolean {  
        let lastTokenType: TokenType;

        if (this.tokens.length === 0) lastTokenType = TokenType.None;
        else lastTokenType = this.tokens[this.tokens.length-1].tokenType;

        if (lastTokenType === TokenType.CloseBracket
            || lastTokenType === TokenType.Number) {

            const openCount = this.tokens.filter(x => x.tokenType === TokenType.OpenBracket).length;
            const closeCount = this.tokens.filter(x => x.tokenType === TokenType.CloseBracket).length;

            if (openCount > closeCount) {
                this.tokens.push(new Token(')', TokenType.CloseBracket));
                return true; 
            }

        }      
        
        return false; 
    }  

    pushNumber(dig: string): boolean {
        let lastTokenType: TokenType;

        if (this.tokens.length === 0) lastTokenType = TokenType.None;
        else lastTokenType = this.tokens[this.tokens.length-1].tokenType;

        if (lastTokenType === TokenType.None
            || lastTokenType === TokenType.Operator
            || lastTokenType === TokenType.OpenBracket) {

            this.tokens.push(new Token(dig, TokenType.Number));
            return true; 

        } else if (lastTokenType === TokenType.Number) {

            this.tokens[this.tokens.length-1].token = `${this.tokens[this.tokens.length-1].token}${dig}`;

            if (this.numberOfDecimals > 0) this.numberOfDecimals++;
            return true;

        } else if (lastTokenType === TokenType.Signal) {

            const lastToken = this.tokens[this.tokens.length-1];
            lastToken.tokenType = TokenType.Number;
            lastToken.token = `${this.tokens[this.tokens.length-1].token}${dig}`;
            return true; 

        } else if (lastTokenType === TokenType.CloseBracket) {

            this.tokens.push(new Token('*', TokenType.Operator));
            this.tokens.push(new Token(dig, TokenType.Number));
            return true; 

        }
        
        return false;  
    }

    pushDecimalPoint() {
        let lastTokenType: TokenType;

        if (this.tokens.length === 0) lastTokenType = TokenType.None;
        else lastTokenType = this.tokens[this.tokens.length-1].tokenType;

        if (lastTokenType === TokenType.None
            || lastTokenType === TokenType.Operator
            || lastTokenType === TokenType.OpenBracket) {

            if (this.pushNumber('0')) {            
                this.tokens[this.tokens.length-1].token = `${this.tokens[this.tokens.length-1].token}.`;
                this.numberOfDecimals = 1;
                return true;
            }
        } else if (lastTokenType === TokenType.Number) {

            if (this.tokens[this.tokens.length-1].token.indexOf('.') === -1) {
                this.tokens[this.tokens.length-1].token = `${this.tokens[this.tokens.length-1].token}.`;

                this.numberOfDecimals = 1;
                return true;
            }
        }      
        
        return false;
    }
     
    pushOperator(op: string): boolean {
        let lastTokenType: TokenType;

        if (this.tokens.length === 0) lastTokenType = TokenType.None;
        else lastTokenType = this.tokens[this.tokens.length-1].tokenType;
        
        if ((lastTokenType === TokenType.None || lastTokenType === TokenType.OpenBracket) 
            && op === '-') {

            this.tokens.push(new Token(op, TokenType.Signal));
            return true; 

        } else if (lastTokenType === TokenType.Signal && op === '+') {

            this.tokens.pop();
            return true; 

        } else if (lastTokenType === TokenType.Number
            || lastTokenType === TokenType.CloseBracket) {

            this.tokens.push(new Token(op, TokenType.Operator));
            
            return true; 

        } else if (lastTokenType === TokenType.Operator) {

            this.tokens[this.tokens.length-1].token = op;
            return true;

        }

        return false;  
  
    }


    push(ch: string): boolean {

        if (ch === '.') {
            return this.pushDecimalPoint();

        } else {
            switch(Token.getTokenType(ch)) {
                case TokenType.Number: return this.pushNumber(ch);
                case TokenType.Operator: return this.pushOperator(ch);
                case TokenType.OpenBracket: return this.pushOpenBracket();
                case TokenType.CloseBracket: return this.pushCloseBracket();
                case TokenType.FN: return this.pushFn(ch);
            }

        }

        return false;
    }

    pushExpression(expr: string): boolean {

        for(let idx=0; idx < expr.length; idx++) {
            this.push(expr[idx]);
        }
        
        return true;
    }

    formatNumber(num: string): string {
        let aux = num.split('.');

        const n1 = aux[0].replace(/\d(?=(?:\d{3})+(?:\.|$))/g, (m) => `${m}.`);

        if (aux.length > 1) return `${n1},${aux[1]}`;
        else return n1;
    }

    getRawExpression() {
        return this.tokens.map(x => x.token).join('');
    }

    getExpression(): string {
        let r: string[] = [];

        this.tokens.forEach(token => {

            if (token.tokenType === TokenType.Number) r.push(this.formatNumber(token.token))
            else r.push(token.token);

        });

        const res = r.join(' ');

        if (res.length > 50) {
            this.IsValidResult = true;
            return '(err)';

        } else {
            return r.join(' ');

        }
    }

    getResult(): string {
        let lastTokenType: TokenType;

        if (this.tokens.length === 0) lastTokenType = TokenType.None;
        else lastTokenType = this.tokens[this.tokens.length-1].tokenType;

        if (lastTokenType === TokenType.None
            || lastTokenType === TokenType.Operator
            || lastTokenType === TokenType.OpenBracket) return '';


        try {
            const myResult = this.myevaluate();

            if (myResult !== null) {
                this.IsValidResult = true;
                return this.formatNumber(
                    myResult.toFixed(
                        (this.numberOfDecimals > 6) ? 6 :
                            (this.numberOfDecimals <= 1) ? this.numberOfDecimals : this.numberOfDecimals-1));
            }
            
        } catch(err) {
            console.error(err);
        }

        this.IsValidResult = false;
        return '';
    }

    rpnOperatorPriority(op1: string, op2: string): boolean {
        let w1=0, w2=0;

        if (op2.length === 0) return true;

        if (op1 === '*' || op1 === '/') w1 = 2; else w1 = 1;

        if (op2 === '*' || op2 === '/') w2 = 2; else w2 = 1;

        return w1 > w2;
    }

    toRPN(): string[] {
        const stack: string[] = [];
        const stackOper: string[] = [];

        this.tokens.forEach(token => {

            if (token.tokenType === TokenType.Number) {
                stack.push(token.token);

            } else if (token.tokenType === TokenType.Operator) {

                if (stackOper.length > 0 && !this.rpnOperatorPriority(token.token, stackOper[stackOper.length-1])) {

                    stack.push(stackOper.pop()!);

                }
                
                stackOper.push(token.token);

            } else if (token.tokenType === TokenType.OpenBracket) {

                stackOper.push('');

            } else if (token.tokenType === TokenType.CloseBracket) {

                while (true) {
                    const tk = stackOper.pop();

                    if (tk === undefined || tk.length === 0) break;

                    stack.push(tk!);
                } 

            }
        });

        stackOper.reverse().forEach(op => op.length > 0 && stack.push(op));

        return stack;

    }

    myevaluate(): number | null {
        const rpn = this.toRPN();
        const stack: number[] = [];

        let idx = 0;

        while(rpn.length > 0) {

            const v = rpn.splice(0, 1)[0];

            if ('/*-+'.indexOf(v) >= 0) {

                const v1 = stack.pop()!;
                const v2 = stack.pop()!;
                let res;

                if (v === '/') {
                    if (v1 === 0) return null;
                    res = v2 / v1;

                } else if (v === '*') res = v2 * v1;
                else if (v === '-') res = v2 - v1;
                else res = v2 + v1;

                if (res == Infinity || res == NaN) return null;

                stack.push(res);

            } else {

                stack.push(+v);

            }

        }

        return stack.length === 0 ? 0 : stack[0];

    }

}

const calculator = new Calculator();

export default calculator;

