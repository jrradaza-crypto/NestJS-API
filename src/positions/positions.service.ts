import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class PositionsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM positions');
    return rows;
  }

  async findOne(position_id: number) {
    const [rows] = await this.db.query('SELECT * FROM positions WHERE position_id = ?', [position_id]);
    return rows;
  }

  async create(position_code: string, position_name: string, agency: string, salary: number, location: string, status: string,userId: number) {
    const query = `
      INSERT INTO positions (position_code, position_name,agency, salary, location, status, userId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await this.db.query(query, [position_code, position_name, agency, salary, location, status, userId]);
    return { message: 'Position created successfully' };
  }

  async update(position_id: number, updateData: any) {
    const { position_code, position_name, agency, salary, location, status} = updateData;
    const query = `
      UPDATE positions
      SET position_code = ?, position_name = ?, updated_at = CURRENT_TIMESTAMP, agency = ?, salary = ?, location = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE position_id = ?
    `;
    await this.db.query(query, [position_code, position_name, agency, salary, location, status, position_id]);
    return { message: 'Position updated successfully' };
  }

  async remove(position_id: number) {
    await this.db.query('DELETE FROM positions WHERE position_id = ?', [position_id]);
    return { message: 'Position deleted successfully' };
  }
}
