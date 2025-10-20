import {Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    pool!: mysql.Pool;

async onModuleInit() {
    this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'mysql-2792c657-gbox-6475.l.aivencloud.com',
        port: +(process.env.DB_PORT || 21430),
        user: process.env.DB_USER || 'avnadmin',
        password: process.env.DB_PASSWORD || 'AVNS_2637HQ958StxA8Jjisa',
        database: process.env.DB_NAME || 'defaultdb',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    const conn = await this.pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Mysql pool created');
}

async query(sql: string, params?: any[]){
    const [rows] = await this.pool.query(sql, params);
    return [rows];
}

    async onModuleDestroy() {
    await this.pool.end();
    }

    getPool() {
        return this.pool;
    }
}



