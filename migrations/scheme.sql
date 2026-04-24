CREATE TABLE residents (
  residentId INT AUTO_INCREMENT PRIMARY KEY,
  resident_name VARCHAR(100) NOT NULL UNIQUE,
  zone VARCHAR(20) NOT NULL,
  resident_password VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'resident',
  refresh_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_officer (
  adminId INT AUTO_INCREMENT PRIMARY KEY,
  admin_name VARCHAR(100) NOT NULL UNIQUE,
  admin_password VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  refresh_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE residents_complaints (
  complaintId INT AUTO_INCREMENT PRIMARY KEY,
  residentId INT,
  resident_name VARCHAR(100) NOT NULL,
  zone VARCHAR(20) NOT NULL,
  complaintCategory VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status ENUM('Pending', 'In Progress', 'Resolved', 'Rejected') DEFAULT 'Pending',
  resolution VARCHAR(255) NOT NULL DEFAULT "Not yet resolved.",
  handled_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT  ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (residentId) REFERENCES residents(residentId) ON DELETE CASCADE,
  FOREIGN KEY (handled_by) REFERENCES admin_officer(adminId) ON DELETE SET NULL,
);


CREATE TABLE residents_complaints_archive (
	archiveId INT AUTO_INCREMENT PRIMARY KEY,
    complaintId INT,
    residentId INT,
    resident_name VARCHAR(100),
    zone VARCHAR(20),
    complaintCategory VARCHAR(255),
    description VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50),
    resolution VARCHAR(255),
    created_at TIMESTAMP,
    achived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_complaints_archive (
	archiveId INT AUTO_INCREMENT PRIMARY KEY,
    complaintId INT,
    residentId INT,
    resident_name VARCHAR(100),
    zone VARCHAR(20),
    complaintCategory VARCHAR(255),
    description VARCHAR(255),
    location VARCHAR(255),
    status VARCHAR(50),
    resolution VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    achived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archive_reason VARCHAR(255) DEFAULT 'Deleted by Admin'
);