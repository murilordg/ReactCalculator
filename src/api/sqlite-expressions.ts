import SQLite from 'react-native-sqlite-storage';
import {openDatabase, SQLiteDatabase} from 'react-native-sqlite-storage';
import { IExpression } from './IExpression';

class SqliteExpressions {

    db?:  SQLiteDatabase;
    ready: boolean;

    constructor() {
        this.ready = false;

        SQLite.enablePromise(true);

        SQLite.openDatabase({name: 'oc.db', location: 'default'}).then((db) => {
            this.db = db;

            this.db.transaction(function (txn) {
                txn.executeSql(
                    "CREATE TABLE IF NOT EXISTS expressions (id INTEGER PRIMARY KEY NOT NULL, expression VARCHAR(100), result VARCHAR(100))",
                    []
                );   
            });

        });

        /*
        openDatabase({name: 'database.db', location: 'default'}).then((db) => {
            this.db = db;

            this.db.transaction(function (txn) {
                txn.executeSql(
                    "CREATE TABLE IF NOT EXISTS expressions (id INTEGER PRIMARY KEY NOT NULL, expression VARCHAR(100), result VARCHAR(100))",
                    []
                );   
            });

        });
*/
        

        /*
        this.db = openDatabase(
            {
                name: 'SQLite',
                location: 'default',
                createFromLocation: '~SQLite.db',
            },
            () => { },
                error => {
                console.log("ERROR: " + error);
            }
        );

        this.CreateTable().then(() => {
            this.ready = true;

            console.log('Database ready');
        });
        */

    }


    /*
    async CreateTable() {
        let query = "CREATE TABLE IF NOT EXISTS expressions (id INTEGER PRIMARY KEY NOT NULL, expression VARCHAR(100), result VARCHAR(100))"

        await this.db.executeSql(query);
    }
    */

    List(): Promise<IExpression[]> {        

        return new Promise<IExpression[]>((resolve, reject) => {

            if (!this.db) return [];

            this.db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM expressions',
                    [],
                    (tx, results) => {
                        var exprs: IExpression[] = [];
        
                        for (let i = 0; i < results.rows.length; ++i) {
                            const row = results.rows.item(i);

                            exprs.push({
                                key: row['rowid'],
                                expression: row['expression'],
                                result: row['result'],
                            })
                        }

                        resolve(exprs);
                });
            });
        });
    }

    Add(expr: string, result: string) {

        if (expr == '' || result == '') return;
        if (!this.db) return;

        const exprCleanned = expr.replace(/\s/g,'');
        this.db.transaction((tx) => {

            tx.executeSql(
                'DELETE FROM expressions WHERE expression = ?',
                [exprCleanned], 
                (tx) => {

                    tx.executeSql(
                        'INSERT INTO expressions(expression, result) VALUES(?,?)',
                        [exprCleanned, result]
                    );

                }
            )
        });

    }


    RemoveAll() {

        if (!this.db) return;

        this.db.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM expressions',
                []);
        });

    }

}



const sqliteExpressions = new SqliteExpressions();

export default sqliteExpressions;
