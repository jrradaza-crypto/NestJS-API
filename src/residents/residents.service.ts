import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class ResidentsService {
  constructor (private db: DatabaseService) {}


  private pool = () => this.db.getPool();
                                              
  async createResidents(resident_name: string, zone: string, resident_password: string, role = 'resident') {
    const hashed = await bcrypt.hash(resident_password, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO residents (resident_name, zone, resident_password, role) VALUES (?, ?, ?, ?)',
      [resident_name, zone, hashed, role],
    );
    return { residentId: result.insertId, resident_name, zone, role};
  }

  async findByResidentName(resident_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT residentId, resident_name, zone, resident_password, role, refresh_token FROM residents WHERE resident_name = ?',
      [resident_name],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Resident with name "${resident_name}" not found`);
    } 

    return rows [0];
  }


  async findByResidentId(residentId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT residentId, resident_name, zone, role, created_at FROM residents WHERE residentId = ?',
      [residentId],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Resident with id "${residentId}" not found`);
    }
    return rows[0];
  }          

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT residentId, resident_name, zone, role, created_at FROM residents',
    );
    return rows;
  }

  async updateResidents(residentId: number, partial: {resident_name?: string; zone?: string; resident_password?: string;}) {
    const fields: string[] = [];
    const values: any[] = [];
    if(partial.resident_name) {
      fields.push('resident_name = ?');
      values.push(partial.resident_name);
    }
    if(partial.zone) {
      fields.push('zone = ?');
      values.push(partial.zone);
    }
    if (partial.resident_password) {
      const hashed = await bcrypt.hash(partial.resident_password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }
    if (fields.length ===  0) return await this.findByResidentId(residentId);
    values.push(residentId);
    const sql = `UPDATE residents SET ${fields.join(', ')} WHERE  residentId = ?`;
    await this.pool().execute(sql, values);
    return  this.findByResidentId(residentId);
  }

  async deleteResident(residentId: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM residents WHERE residentId = ?', [residentId]);
    return { message: 'Resident deleted successfully!' };
  }

  async setRefreshToken(residentId: number, refresh_token: string | null) {
    await this.pool().execute('UPDATE residents SET refresh_token = ? WHERE residentId = ?', [refresh_token, residentId]);
  }

  async findByRefreshToken(refresh_token: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT residentId, resident_name, zone, role FROM residents WHERE refresh_token = ?',
      [refresh_token],
    );
    return rows[0];
  }

}