import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AdminService {
  constructor (private db: DatabaseService) {}

  private pool = () => this.db.getPool();
                                              
  async createAdmin(admin_name: string, admin_password: string, role = 'admin') {
    const hashed = await bcrypt.hash(admin_password, 10);
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO admin_officer (admin_name, admin_password, role) VALUES (?, ?, ?)',
      [admin_name, hashed, role],
    );
    return { adminId: result.insertId, admin_name, role};
  }

  async findByAdminName(admin_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT adminId, admin_name, admin_password, role refresh_token FROM admin_officer WHERE admin_name = ?',
      [admin_name],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Resident with name "${admin_name}" not found`);
    } 

    return rows [0];
  }


  async findByAdminId(adminId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT adminId, admin_name, role, created_at FROM admin_officer WHERE adminId = ?',
      [adminId],
    );

    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Admin with id "${adminId}" not found`);
    }
    return rows[0];
  }          

  async getAllAdmins() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT adminId, admin_name, role created_at FROM admin_officer',
    );
    return rows;
  }

  async updateAdmins(adminId: number, partial: {admin_name?: string; admin_password?: string;}) {
    const fields: string[] = [];
    const values: any[] = [];
    if(partial.admin_name) {
      fields.push('admin_name = ?');
      values.push(partial.admin_name);
    }
    if (partial.admin_password) {
      const hashed = await bcrypt.hash(partial.admin_password, 10);
      fields.push('password = ?');
      values.push(hashed);
    }
    if (fields.length ===  0) return await this.findByAdminId(adminId);
    values.push(adminId);
    const sql = `UPDATE admin_officer SET ${fields.join(', ')} WHERE adminId = ?`;
    await this.pool().execute(sql, values);
    return  this.findByAdminId(adminId);
  }

  async deleteAdmin(adminId: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM admin_officer WHERE adminId = ?', [adminId]);
    return { message: 'Complaint deleted successfully' };
  }

  async setRefreshToken(residentId: number, refresh_token: string | null) {
    await this.pool().execute('UPDATE residents SET refresh_token = ? WHERE residentId = ?', [refresh_token, residentId]);
  }

  async findByRefreshToken(refresh_token: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT adminId, resident_name, role FROM admin WHERE refresh_token = ?',
      [refresh_token],
    );
    return rows[0];
  }

  async getAllResidents() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT residentId, resident_name, zone, created_at FROM residents',
    );
    return rows;
  }
     

}
