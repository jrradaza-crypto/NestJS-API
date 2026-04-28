import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ComplaintsService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    const [rows] = await this.db.query('SELECT * FROM residents_complaints');
    return rows;
  }

  async findAllByResident(residentId: number) {
    const [rows] = await this.db.query('SELECT * FROM residents_complaints WHERE residentId = ?', [residentId]);
    return rows;
  }

  async findOne(complaintId: number) {
    const [rows] = await this.db.query('SELECT * FROM residents_complaints WHERE complaintId = ?', [complaintId]);
    return rows;
  }

  async create(residentId: number, resident_name: string, zone: string, complaintCategory: string, description: string, location: string, status = 'Pending') {
    const query = `
      INSERT INTO residents_complaints (residentId, resident_name, zone, complaintCategory, description, location, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await this.db.query(query, [residentId, resident_name, zone, complaintCategory, description, location, status]);
    return { message: 'Complaint posted successfully' };
  }

  async updateComplaintByResident(complaintId: number, residentId: number, updateData: any) {
    const { complaintCategory, description, location} = updateData;
    const query = `
      UPDATE residents_complaints
      SET complaintCategory =  ?, description = ?, location = ?, updated_at = CURRENT_TIMESTAMP
      WHERE complaintId = ? AND residentId = ?
    `;
    await this.db.query(query, [complaintCategory, description, location, complaintId, residentId ]);
    return { message: 'Complaint updated successfully' };
  }

  async removeComplaintByResident(complaintId: number, residentId: number) {
    const [rows]: any = await this.db.query(
      'SELECT * FROM residents_complaints WHERE complaintId = ? AND residentId = ?', [complaintId, residentId]
    );
    
    const complaint = rows[0];

    if (complaint) {
      await this.db.query(
        'INSERT INTO residents_complaints_archive (complaintId, residentId, resident_name, zone, complaintCategory, description, location, status, resolution, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          complaint.complaintId,
          complaint.residentId,
          complaint.resident_name,
          complaint.zone,
          complaint.complaintCategory,
          complaint.description,
          complaint.location,
          complaint.status,
          complaint.resolution,
          complaint.created_at
        ]
      );  

      await this.db.query(
        'DELETE FROM residents_complaints WHERE complaintId = ? AND residentId = ?', [complaintId, residentId]
      );

      return { message: 'Complaint moved to archive' };
    }
      return { message: 'Complaint not found' };
  }

   async updateComplaintByAdmin(complaintId: number, adminId: number, updateData: any) {

    if (!updateData) {
      throw new Error('Update data is missing');
    }
    const { status, resolution} = updateData;
    const query = `
      UPDATE residents_complaints
      SET status =  ?, resolution = ?, handled_by = ?, updated_at = CURRENT_TIMESTAMP
      WHERE complaintId = ?
    `;
    await this.db.query(query, [status, resolution, adminId, complaintId]);
    return { message: 'Complaint updated successfully' };
  }

   async removeComplaintByAdmin(complaintId: number, adminId: number) {
    const [rows]: any = await this.db.query(
      'SELECT * FROM residents_complaints WHERE complaintId = ?', [complaintId]
    );
    
    const complaint = rows[0];

    if (complaint) {
      await this.db.query(
        'INSERT INTO admin_complaints_archive (complaintId, residentId, resident_name, zone, complaintCategory, description, location, status, resolution, archive_reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          complaint.complaintId,
          complaint.residentId,
          complaint.resident_name,
          complaint.zone,
          complaint.complaintCategory,
          complaint.description,
          complaint.location,
          complaint.status,
          complaint.resolution,
          complaint.archive_reason
        ]
      );

      await this.db.query(
        'DELETE FROM residents_complaints WHERE complaintId = ?', [complaintId]
      );

      return { message: 'Complaint moved to archive' };
    }
      return { message: 'Complaint not found' };
  }
}
