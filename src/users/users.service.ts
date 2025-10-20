// I add a address parameter.

import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor (private db: DatabaseService) {}

  private pool = () => this.db.getPool();
                                              
  async createUser(username: string, address: string, password: string, role = 'user') {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO users (username, address, password, role) VALUES (?, ?, ?, ?)',
      [username, address, hashed, role],
    );
    return { userId: result.insertId, username, address, role };
  }

  async findByUsername(username: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT userId, username, address, password, role, refreshToken FROM users WHERE username = ?',
      [username],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`User with username "${username}" not found`);
    } 

    return rows [0];
  }

  async findByAddress(address: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT userId, username, address, role, refreshToken FROM users WHERE address = ?',
      [address],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`User with address "${address}" not found`);
    } 

    return rows[0];
  }

  async findById(userId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT userId, username, address, role, created_at FROM users WHERE userId = ?',
      [userId],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }
    return rows[0];
  }          

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT id, username, address, role, created_at FROM users',
    );
    return rows;
  }

  async updateUser(userId: number, partial: {username?: string; address?: string; password?: string; role?: string}) {
    const fields: string[] = [];
    const values: any[] = [];
    if(partial.username) {
      fields.push('username = ?');
      values.push(partial.username);
    }
     if(partial.address) {
      fields.push('address = ?');
      values.push(partial.address);
    }
    if (partial.password) {
      const hashed = await bcrypt.hash(partial.password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }
    if (partial.role) {
      fields.push('role = ?');
      values.push(partial.role);
    }
    if (fields.length ===  0) return await this.findById(userId);
    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE  userId = ?`;
    await this.pool().execute(sql, values);
    return  this.findById(userId);
  }

  async deleteUser(userId: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM users WHERE userId = ?', [userId]);
    return res.affectedRows > 0;
  }

  async setRefreshToken(userId: number, refreshToken: string | null) {
    await this.pool().execute('UPDATE users SET refreshToken = ? WHERE userId = ?', [refreshToken, userId]);
  }

  async findByRefreshToken(refreshToken: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT userId, username, role FROM users WHERE refresh_token = ?',
      [refreshToken],
    );
    return rows[0];
  }
}