CREATE DATABASE IF NOT EXISTS `ababilsoft_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ababilsoft_db`;
SET NAMES utf8mb4;
CREATE TABLE IF NOT EXISTS roles(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100),role_key VARCHAR(50) UNIQUE,created_at DATETIME);
CREATE TABLE IF NOT EXISTS permissions(id INT AUTO_INCREMENT PRIMARY KEY,module VARCHAR(100),permission_key VARCHAR(120) UNIQUE,name VARCHAR(180));
CREATE TABLE IF NOT EXISTS role_permissions(role_id INT,permission_id INT,PRIMARY KEY(role_id,permission_id));
CREATE TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY,employee_id INT NULL,full_name VARCHAR(150),username VARCHAR(80) UNIQUE,email VARCHAR(150),phone VARCHAR(50),password_hash VARCHAR(255),role_id INT,branch_name VARCHAR(100) DEFAULT 'الفرع الرئيسي',is_active TINYINT DEFAULT 1,last_login_at DATETIME,created_at DATETIME);
CREATE TABLE IF NOT EXISTS currencies(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(80),code VARCHAR(10),symbol VARCHAR(20),rate_to_yer DECIMAL(18,5) DEFAULT 1,is_active TINYINT DEFAULT 1);
CREATE TABLE IF NOT EXISTS accounts(id INT AUTO_INCREMENT PRIMARY KEY,account_no VARCHAR(50) UNIQUE,name VARCHAR(180),type VARCHAR(80),nature ENUM('debit','credit') DEFAULT 'debit',currency_id INT DEFAULT 1,parent_id INT NULL,is_active TINYINT DEFAULT 1,created_at DATETIME,INDEX(parent_id));
CREATE TABLE IF NOT EXISTS ledger_entries(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,entry_date DATETIME,source_type VARCHAR(80),source_id INT,description TEXT,debit DECIMAL(18,2) DEFAULT 0,credit DECIMAL(18,2) DEFAULT 0,currency_id INT DEFAULT 1,exchange_rate DECIMAL(18,5) DEFAULT 1,created_by INT,INDEX(account_id));
CREATE TABLE IF NOT EXISTS customers(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,name VARCHAR(180),passport_no VARCHAR(100),phone VARCHAR(50),profession VARCHAR(150),doc_type VARCHAR(50) DEFAULT 'جواز',profession_id INT NULL,agent_id INT NULL,customer_source VARCHAR(50) DEFAULT 'مباشر',notes TEXT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS agents(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,name VARCHAR(180),phone VARCHAR(50),default_commission DECIMAL(18,2) DEFAULT 0,notes TEXT,is_active TINYINT DEFAULT 1,created_at DATETIME);
CREATE TABLE IF NOT EXISTS offices(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,name VARCHAR(180),phone VARCHAR(50),notes TEXT,is_active TINYINT DEFAULT 1,created_at DATETIME);
CREATE TABLE IF NOT EXISTS suppliers(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,name VARCHAR(180),phone VARCHAR(50),notes TEXT,is_active TINYINT DEFAULT 1,created_at DATETIME);
CREATE TABLE IF NOT EXISTS employees(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,name VARCHAR(180),phone VARCHAR(50),job_title VARCHAR(120),salary DECIMAL(18,2) DEFAULT 0,notes TEXT,is_active TINYINT DEFAULT 1,created_at DATETIME);
CREATE TABLE IF NOT EXISTS employee_entitlements(id INT AUTO_INCREMENT PRIMARY KEY,employee_id INT,entitlement_type VARCHAR(50),amount DECIMAL(18,2),currency_id INT,entitlement_date DATE,description TEXT,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS banks(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,name VARCHAR(150),bank_account_no VARCHAR(100),owner_name VARCHAR(150),phone VARCHAR(50),notes TEXT,is_active TINYINT DEFAULT 1,created_at DATETIME);
CREATE TABLE IF NOT EXISTS cashboxes(id INT AUTO_INCREMENT PRIMARY KEY,account_id INT,name VARCHAR(150),notes TEXT,is_active TINYINT DEFAULT 1,created_at DATETIME);
CREATE TABLE IF NOT EXISTS services(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(150),regular_price DECIMAL(18,2) DEFAULT 0,individual_price DECIMAL(18,2) DEFAULT 0,currency_id INT DEFAULT 2,activity_type VARCHAR(30) DEFAULT 'أساسي',is_active TINYINT DEFAULT 1,created_at DATETIME);
CREATE TABLE IF NOT EXISTS service_statuses(id INT AUTO_INCREMENT PRIMARY KEY,service_id INT,name VARCHAR(150),sort_order INT DEFAULT 0,is_active TINYINT DEFAULT 1);
CREATE TABLE IF NOT EXISTS visa_batches(id INT AUTO_INCREMENT PRIMARY KEY,supplier_id INT,supplier_name VARCHAR(180),visa_number VARCHAR(100),registry_number VARCHAR(100),company_name VARCHAR(180),visa_type ENUM('عادية','فردية') DEFAULT 'عادية',price DECIMAL(18,2) DEFAULT 0,currency_id INT DEFAULT 2,total_quantity INT DEFAULT 0,notes TEXT,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS visa_professions(id INT AUTO_INCREMENT PRIMARY KEY,batch_id INT,profession_name VARCHAR(180),quantity INT DEFAULT 0,authorized_qty INT DEFAULT 0,used_qty INT DEFAULT 0,created_at DATETIME);
CREATE TABLE IF NOT EXISTS visa_authorizations(id INT AUTO_INCREMENT PRIMARY KEY,batch_id INT,profession_id INT,office_id INT,auth_no VARCHAR(150),quantity INT DEFAULT 0,used_qty INT DEFAULT 0,notes TEXT,is_reversed TINYINT DEFAULT 0,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS transactions(id INT AUTO_INCREMENT PRIMARY KEY,customer_id INT,service_id INT,status_id INT,visa_batch_id INT NULL,visa_profession_id INT NULL,visa_number VARCHAR(100),registry_number VARCHAR(100),company_name VARCHAR(180),visa_type VARCHAR(50),supplier_id INT NULL,office_id INT NULL,agent_id INT NULL,sale_type ENUM('مباشر','تبع وكيل') DEFAULT 'مباشر',agent_commission DECIMAL(18,2) DEFAULT 0,price DECIMAL(18,2) DEFAULT 0,currency_id INT DEFAULT 2,transaction_date DATE,notes TEXT,is_relayed TINYINT DEFAULT 0,is_delivered TINYINT DEFAULT 0,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS office_transfers(id INT AUTO_INCREMENT PRIMARY KEY,office_id INT,transaction_id INT,customer_id INT,price DECIMAL(18,2),currency_id INT,description TEXT,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS vouchers(id INT AUTO_INCREMENT PRIMARY KEY,type ENUM('قبض','صرف','تسليم') NOT NULL,voucher_no VARCHAR(80),voucher_date DATE,voucher_time TIME,amount DECIMAL(18,2),currency_id INT,exchange_rate DECIMAL(18,5) DEFAULT 1,payment_method ENUM('نقداً','حوالة') DEFAULT 'نقداً',cashbox_id INT NULL,bank_id INT NULL,transfer_no VARCHAR(120),party_name VARCHAR(180),description TEXT,red_note TEXT,created_by INT,created_at DATETIME,print_count INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS voucher_lines(id INT AUTO_INCREMENT PRIMARY KEY,voucher_id INT,account_id INT,amount DECIMAL(18,2),description TEXT);
CREATE TABLE IF NOT EXISTS journal_entries(id INT AUTO_INCREMENT PRIMARY KEY,entry_no VARCHAR(80),entry_date DATE,journal_type VARCHAR(120),description TEXT,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS journal_lines(id INT AUTO_INCREMENT PRIMARY KEY,journal_id INT,account_id INT,debit DECIMAL(18,2),credit DECIMAL(18,2),currency_id INT,exchange_rate DECIMAL(18,5),description TEXT);
CREATE TABLE IF NOT EXISTS refunds(id INT AUTO_INCREMENT PRIMARY KEY,transaction_id INT,customer_id INT,office_discount DECIMAL(18,2) DEFAULT 0,clearing_discount DECIMAL(18,2) DEFAULT 0,refund_amount DECIMAL(18,2) DEFAULT 0,description TEXT,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS delivery_receipts(id INT AUTO_INCREMENT PRIMARY KEY,transaction_id INT,customer_id INT,doc_no VARCHAR(80),receiver_name VARCHAR(180),description TEXT,created_by INT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS drafts(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT,draft_type VARCHAR(80),title VARCHAR(180),data LONGTEXT,created_at DATETIME,updated_at DATETIME);
CREATE TABLE IF NOT EXISTS notifications(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NULL,ntype VARCHAR(50),title VARCHAR(180),body TEXT,is_read TINYINT DEFAULT 0,created_at DATETIME);
CREATE TABLE IF NOT EXISTS audit_logs(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NULL,action VARCHAR(100),table_name VARCHAR(80),record_id INT NULL,old_values LONGTEXT,new_values LONGTEXT,created_at DATETIME);
CREATE TABLE IF NOT EXISTS system_settings(id INT AUTO_INCREMENT PRIMARY KEY,setting_key VARCHAR(100) UNIQUE,setting_value LONGTEXT);

CREATE TABLE IF NOT EXISTS professions(id INT AUTO_INCREMENT PRIMARY KEY,profession_no VARCHAR(30) UNIQUE,name VARCHAR(180),notes TEXT,is_active TINYINT DEFAULT 1,created_at DATETIME);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS account_id INT NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS doc_type VARCHAR(50) DEFAULT 'جواز';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS profession_id INT NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS agent_id INT NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS customer_source VARCHAR(50) DEFAULT 'مباشر';
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS parent_id INT NULL;
ALTER TABLE accounts ADD INDEX IF NOT EXISTS idx_accounts_parent_id(parent_id);
INSERT IGNORE INTO professions(id,profession_no,name,created_at) VALUES(1,'001','عامل تحميل وتنزيل',NOW()),(2,'002','سائق',NOW()),(3,'003','عامل نظافة',NOW()),(4,'004','عامل بناء',NOW());

INSERT IGNORE INTO roles(id,name,role_key,created_at) VALUES(1,'مدير النظام','admin',NOW()),(2,'محاسب','accountant',NOW()),(3,'موظف إدخال','data_entry',NOW());
INSERT IGNORE INTO permissions(module,permission_key,name) VALUES
('العملاء','customers.view','عرض العملاء'),('العملاء','customers.manage','إضافة وتعديل العملاء'),('الخدمات','services.manage','إدارة الخدمات والحالات'),('المخزون','visa.manage','مخزون وتفويض التأشيرات'),('المعاملات','transactions.manage','إدارة المعاملات'),('الترحيل','transfer.manage','ترحيل المعاملات'),('السندات','vouchers.manage','السندات والقيود'),('الحسابات','accounts.view','عرض الحسابات وكشف الحساب'),('الإعدادات','settings.manage','الإعدادات والصلاحيات');
INSERT IGNORE INTO role_permissions(role_id,permission_id) SELECT 1,id FROM permissions;
INSERT IGNORE INTO currencies(id,name,code,symbol,rate_to_yer) VALUES(1,'ريال يمني','YER','ر.ي',1),(2,'ريال سعودي','SAR','ر.س',150),(3,'دولار أمريكي','USD','$',525);
INSERT IGNORE INTO users(id,full_name,username,email,phone,password_hash,role_id,is_active,created_at) VALUES(1,'أ. محمد الحاج','admin','admin@ababilsoft.com','778661119','$2y$12$OKLP/GP4rgv7yX1vJKYAWuM6kAR0pENDE/38Qht665Yz15oSN5pA6',1,1,NOW());
INSERT IGNORE INTO accounts(id,account_no,name,type,nature,currency_id,created_at) VALUES(1,'1','الأصول','عام','debit',1,NOW()),(2,'2','الخصوم','عام','credit',1,NOW()),(3,'3','المصروفات','عام','debit',1,NOW()),(4,'4','الإيرادات','عام','credit',1,NOW()),(5,'11110001','الصندوق الرئيسي','صندوق','debit',1,NOW()),(6,'11210001','بنك الكريمي','بنك','debit',1,NOW());
INSERT IGNORE INTO cashboxes(id,account_id,name,created_at) VALUES(1,5,'الصندوق الرئيسي',NOW());
INSERT IGNORE INTO banks(id,account_id,name,bank_account_no,owner_name,created_at) VALUES(1,6,'بنك الكريمي','11210001','شركة أبابيل سوفت',NOW());
INSERT IGNORE INTO services(id,name,regular_price,individual_price,currency_id,is_active,created_at) VALUES(1,'بيع فيزة',0,0,2,1,NOW()),(2,'قطع جواز',0,0,1,1,NOW()),(3,'عمرة',0,0,2,1,NOW()),(4,'حج',0,0,2,1,NOW()),(5,'قطع تذكرة',0,0,1,1,NOW());
INSERT IGNORE INTO service_statuses(service_id,name,sort_order) VALUES(1,'إنزال رقم التأشيرة',1),(1,'في المكتب المخلص',2),(1,'لدى مكتب التعميدات',3),(1,'في السفارة',4),(1,'مؤشر في السفارة',5),(1,'جاهز ومؤشر بالمكتب',6);
INSERT IGNORE INTO suppliers(id,account_id,name,phone,created_at) VALUES(1,NULL,'المورد الرئيسي','770000000',NOW());
INSERT IGNORE INTO offices(id,account_id,name,phone,created_at) VALUES(1,NULL,'مكتب الامتياز','770000000',NOW());
INSERT IGNORE INTO agents(id,account_id,name,phone,created_at) VALUES(1,NULL,'وكيل تجريبي','770000001',NOW());
INSERT IGNORE INTO system_settings(setting_key,setting_value) VALUES
('company_name','شركة أبابيل سوفت'),
('establishment_name','شركة أبابيل سوفت'),
('company_subtitle','إدارة متكاملة لمكاتب السفريات والسياحة'),
('company_phone','778661119'),
('company_address','الجمهورية اليمنية - صنعاء - جوار مركز الخمسين'),
('company_email',''),
('company_website',''),
('commercial_register',''),
('tax_number',''),
('voucher_red_note','تم إنشاء هذا السند إلكترونياً ولا يحتاج إلى توقيع'),
('voucher_receipt_title','سند قبض'),
('voucher_payment_title','سند صرف'),
('voucher_default_payment_method','نقداً'),
('voucher_default_currency_id','2'),
('voucher_signature_receiver','توقيع المستلم'),
('voucher_signature_accountant','توقيع المحاسب'),
('voucher_signature_manager','توقيع المدير'),
('voucher_show_company_info','1'),
('voucher_show_lines','1'),
('voucher_show_signatures','1'),
('voucher_show_print_user','1');

INSERT IGNORE INTO accounts(account_no,name,type,nature,currency_id,parent_id,created_at) VALUES
('11','الأصول الثابتة','عام','debit',1,1,NOW()),
('12','الأصول المتداولة','عام','debit',1,1,NOW()),
('21','حقوق الملكية','عام','credit',1,2,NOW()),
('22','الخصوم المتداولة','عام','credit',1,2,NOW()),
('31','مصروفات تشغيلية','مصروفات','debit',1,3,NOW()),
('41','إيرادات الخدمات','إيرادات','credit',1,4,NOW());

-- تحديثات الربط المحاسبي وأسعار الصرف المعتمدة
UPDATE currencies SET rate_to_yer=1 WHERE id=1;
UPDATE currencies SET rate_to_yer=150 WHERE id=2;
UPDATE currencies SET rate_to_yer=525 WHERE id=3;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS entry_time TIME NULL;

-- حسابات تجميعية تمنع تكدس العملاء/الوكلاء/الموردين داخل الشجرة
INSERT IGNORE INTO accounts(account_no,name,type,nature,currency_id,parent_id,created_at) VALUES
('12','الأصول المتداولة','عام','debit',1,1,NOW()),
('121','الصناديق','عام','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الأصول المتداولة' LIMIT 1) x),NOW()),
('122','البنوك','عام','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الأصول المتداولة' LIMIT 1) x),NOW()),
('123','العملاء','عام','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الأصول المتداولة' LIMIT 1) x),NOW()),
('124','الوكلاء','عام','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الأصول المتداولة' LIMIT 1) x),NOW()),
('126','الموظفين','عام','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الأصول المتداولة' LIMIT 1) x),NOW()),
('125','الموردين','عام','credit',1,2,NOW()),
('127','المكاتب المخلصة','عام','credit',1,2,NOW());

INSERT IGNORE INTO accounts(account_no,name,type,nature,currency_id,parent_id,created_at) VALUES
('12101','صناديق المركز الرئيسي','صندوق','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الصناديق' LIMIT 1) x),NOW()),
('12201','بنوك المركز الرئيسي','بنك','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='البنوك' LIMIT 1) x),NOW()),
('12301','عملاء المركز الرئيسي','عميل','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='العملاء' LIMIT 1) x),NOW()),
('12401','وكلاء المركز الرئيسي','وكيل','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الوكلاء' LIMIT 1) x),NOW()),
('12501','موردين المركز الرئيسي','مورد','credit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الموردين' LIMIT 1) x),NOW()),
('12601','موظفين المركز الرئيسي','موظف','debit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='الموظفين' LIMIT 1) x),NOW()),
('12701','مكاتب مخلصة المركز الرئيسي','مكتب مخلص','credit',1,(SELECT id FROM (SELECT id FROM accounts WHERE name='المكاتب المخلصة' LIMIT 1) x),NOW());


-- تحديث v9 للسندات والقيود وكشف الحساب
UPDATE currencies SET rate_to_yer=1 WHERE id=1;
UPDATE currencies SET rate_to_yer=150 WHERE id=2;
UPDATE currencies SET rate_to_yer=525 WHERE id=3;
ALTER TABLE voucher_lines ADD COLUMN IF NOT EXISTS currency_id INT DEFAULT 2;
ALTER TABLE voucher_lines ADD COLUMN IF NOT EXISTS exchange_rate DECIMAL(18,8) DEFAULT 1;
ALTER TABLE voucher_lines ADD COLUMN IF NOT EXISTS result_amount DECIMAL(18,2) DEFAULT 0;
ALTER TABLE voucher_lines ADD COLUMN IF NOT EXISTS difference_amount DECIMAL(18,2) DEFAULT 0;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS entry_time TIME NULL;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS review_currency_id INT DEFAULT 1;
ALTER TABLE journal_lines ADD COLUMN IF NOT EXISTS target_currency_id INT DEFAULT 1;
ALTER TABLE journal_lines ADD COLUMN IF NOT EXISTS result_amount DECIMAL(18,2) DEFAULT 0;

-- V13: support reversing office transfers
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS is_reversed TINYINT DEFAULT 0;

-- تحديثات V14 لإلغاء الترحيل وربط القيد العكسي
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS reverse_journal_id INT NULL;
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS reverse_discount DECIMAL(18,2) DEFAULT 0;
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS reverse_currency_id INT DEFAULT 1;
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS reverse_note TEXT NULL;

ALTER TABLE agents ADD COLUMN IF NOT EXISTS account_id INT NULL;
ALTER TABLE offices ADD COLUMN IF NOT EXISTS account_id INT NULL;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS account_id INT NULL;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS account_id INT NULL;
ALTER TABLE banks ADD COLUMN IF NOT EXISTS account_id INT NULL;
ALTER TABLE cashboxes ADD COLUMN IF NOT EXISTS account_id INT NULL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS activity_type VARCHAR(30) DEFAULT 'أساسي';

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS supplier_journal_id INT NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS agent_journal_id INT NULL;


CREATE TABLE IF NOT EXISTS user_permissions(user_id INT NOT NULL, permission_key VARCHAR(160) NOT NULL, granted TINYINT DEFAULT 1, created_at DATETIME, PRIMARY KEY(user_id,permission_key));
CREATE TABLE IF NOT EXISTS activity_logs(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NULL,user_name VARCHAR(180),action_key VARCHAR(120),action_name VARCHAR(220),section_name VARCHAR(150),target_type VARCHAR(120),target_id VARCHAR(80),target_label VARCHAR(220),description TEXT,result_status VARCHAR(50) DEFAULT 'ناجح',importance VARCHAR(50) DEFAULT 'عادي',is_read TINYINT DEFAULT 0,ip_address VARCHAR(80),user_agent TEXT,created_at DATETIME,read_at DATETIME,INDEX(user_id),INDEX(is_read),INDEX(created_at));
CREATE TABLE IF NOT EXISTS drafts(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT,page_key VARCHAR(120),draft_type VARCHAR(120),title VARCHAR(220),payload LONGTEXT,status VARCHAR(50) DEFAULT 'غير مكتملة',created_at DATETIME,updated_at DATETIME,INDEX(user_id),INDEX(updated_at));
CREATE TABLE IF NOT EXISTS notifications(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NULL,notification_type VARCHAR(50) DEFAULT 'system',title VARCHAR(220),body TEXT,severity VARCHAR(50) DEFAULT 'info',is_read TINYINT DEFAULT 0,show_at DATETIME NULL,repeat_rule VARCHAR(80),created_by INT NULL,created_at DATETIME,read_at DATETIME,INDEX(user_id),INDEX(is_read),INDEX(show_at));
CREATE TABLE IF NOT EXISTS notification_settings(id INT PRIMARY KEY DEFAULT 1,position VARCHAR(50) DEFAULT 'top-right',duration_seconds INT DEFAULT 5,show_countdown TINYINT DEFAULT 1,show_close TINYINT DEFAULT 1,play_sound TINYINT DEFAULT 0,max_visible INT DEFAULT 3,success_color VARCHAR(30) DEFAULT '#16a34a',warning_color VARCHAR(30) DEFAULT '#f59e0b',error_color VARCHAR(30) DEFAULT '#dc2626',info_color VARCHAR(30) DEFAULT '#0ea5e9');
INSERT IGNORE INTO notification_settings(id) VALUES(1);

ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id INT NULL;


-- V38 compatibility migrations for old databases
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id INT NULL;
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS page_key VARCHAR(120) NULL;
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS draft_type VARCHAR(120) NULL;
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS title VARCHAR(220) NULL;
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS payload LONGTEXT NULL;
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'غير مكتملة';
ALTER TABLE drafts ADD COLUMN IF NOT EXISTS updated_at DATETIME NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50) DEFAULT 'system';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS severity VARCHAR(50) DEFAULT 'info';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS show_at DATETIME NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS repeat_rule VARCHAR(80) NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_by INT NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at DATETIME NULL;
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS position VARCHAR(50) DEFAULT 'top-right';
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS duration_seconds INT DEFAULT 5;
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS show_countdown TINYINT DEFAULT 1;
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS show_close TINYINT DEFAULT 1;
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS play_sound TINYINT DEFAULT 0;
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS max_visible INT DEFAULT 3;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_name VARCHAR(180) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS action_key VARCHAR(120) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS action_name VARCHAR(220) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS section_name VARCHAR(150) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS target_type VARCHAR(120) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS target_id VARCHAR(80) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS target_label VARCHAR(220) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS description TEXT NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS result_status VARCHAR(50) DEFAULT 'ناجح';
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS importance VARCHAR(50) DEFAULT 'عادي';
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS is_read TINYINT DEFAULT 0;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR(80) NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS user_agent TEXT NULL;
ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS read_at DATETIME NULL;

CREATE TABLE IF NOT EXISTS user_employee_links(user_id INT NOT NULL PRIMARY KEY, employee_id INT NOT NULL, created_at DATETIME, INDEX(employee_id));


-- V41 Branches: full branch/account isolation baseline
CREATE TABLE IF NOT EXISTS branches(id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(180) NOT NULL,code VARCHAR(50),city VARCHAR(100),address VARCHAR(220),phone VARCHAR(80),manager_employee_id INT NULL,is_main TINYINT DEFAULT 0,is_active TINYINT DEFAULT 1,created_by INT NULL,created_at DATETIME,UNIQUE KEY uniq_branch_code(code));
CREATE TABLE IF NOT EXISTS branch_accounts(id INT AUTO_INCREMENT PRIMARY KEY,branch_id INT NOT NULL,account_key VARCHAR(80) NOT NULL,account_id INT NOT NULL,created_at DATETIME,UNIQUE KEY uniq_branch_account(branch_id,account_key));
CREATE TABLE IF NOT EXISTS branch_permissions(branch_id INT NOT NULL,permission_key VARCHAR(160) NOT NULL,granted TINYINT DEFAULT 1,created_at DATETIME,PRIMARY KEY(branch_id,permission_key));
CREATE TABLE IF NOT EXISTS branch_inventory_transfers(id INT AUTO_INCREMENT PRIMARY KEY,from_branch_id INT,to_branch_id INT,visa_profession_id INT NULL,quantity INT DEFAULT 0,description TEXT,created_by INT,created_at DATETIME);
INSERT IGNORE INTO branches(id,name,code,city,address,phone,is_main,is_active,created_by,created_at) VALUES(1,'الفرع الرئيسي','MAIN','','','',1,1,1,NOW());
ALTER TABLE users ADD COLUMN IF NOT EXISTS default_branch_id INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_branch_id INT NULL;
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_by INT NULL;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE offices ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE banks ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE cashboxes ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE visa_batches ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE visa_professions ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE vouchers ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE voucher_lines ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE journal_lines ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE delivery_receipts ADD COLUMN IF NOT EXISTS branch_id INT NULL;

-- V42 branch accounting isolation repairs
ALTER TABLE journal_lines ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE voucher_lines ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE delivery_receipts ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE refunds ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE ledger_entries ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS default_branch_id INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_branch_id INT NULL;


-- V43 branch/accounting review fixes
ALTER TABLE visa_authorizations ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE employee_entitlements ADD COLUMN IF NOT EXISTS branch_id INT NULL;
UPDATE visa_professions p JOIN visa_batches b ON b.id=p.batch_id SET p.branch_id=b.branch_id WHERE p.branch_id IS NULL OR p.branch_id=0;
UPDATE visa_authorizations va JOIN visa_professions p ON p.id=va.profession_id SET va.branch_id=p.branch_id WHERE va.branch_id IS NULL OR va.branch_id=0;
UPDATE employee_entitlements ee JOIN employees e ON e.id=ee.employee_id SET ee.branch_id=e.branch_id WHERE ee.branch_id IS NULL OR ee.branch_id=0;
UPDATE agents SET branch_id=1 WHERE branch_id IS NULL OR branch_id=0;
UPDATE offices SET branch_id=1 WHERE branch_id IS NULL OR branch_id=0;
UPDATE suppliers SET branch_id=1 WHERE branch_id IS NULL OR branch_id=0;

-- V45: system settings, licensing, notification responses, device reports
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS color_scheme VARCHAR(50) DEFAULT 'info';
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS custom_bg VARCHAR(30) DEFAULT '';
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS custom_text VARCHAR(30) DEFAULT '';
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS require_ack_default TINYINT DEFAULT 0;
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS system_center_enabled TINYINT DEFAULT 1;
ALTER TABLE notification_settings ADD COLUMN IF NOT EXISTS browser_leave_only TINYINT DEFAULT 1;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS delivery_status VARCHAR(50) DEFAULT 'لم يصله';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS response_status VARCHAR(50) DEFAULT '';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS delivered_at DATETIME NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS responded_at DATETIME NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS requires_ack TINYINT DEFAULT 0;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS target_branch_id INT NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS device_label VARCHAR(220) NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS position VARCHAR(50) NULL;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS color_scheme VARCHAR(50) NULL;
CREATE TABLE IF NOT EXISTS login_device_logs(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NULL,username VARCHAR(120),login_status VARCHAR(50),device_type VARCHAR(80),os_name VARCHAR(120),browser_name VARCHAR(120),ip_address VARCHAR(80),user_agent TEXT,is_new_device TINYINT DEFAULT 0,created_at DATETIME,INDEX(user_id),INDEX(created_at),INDEX(login_status));
CREATE TABLE IF NOT EXISTS known_user_devices(id INT AUTO_INCREMENT PRIMARY KEY,user_id INT NOT NULL,device_hash VARCHAR(80) NOT NULL,device_type VARCHAR(80),os_name VARCHAR(120),browser_name VARCHAR(120),ip_address VARCHAR(80),first_seen DATETIME,last_seen DATETIME,login_count INT DEFAULT 1,is_blocked TINYINT DEFAULT 0,UNIQUE KEY uniq_user_device(user_id,device_hash));
INSERT IGNORE INTO system_settings(setting_key,setting_value) VALUES
('establishment_name','شركة أبابيل سوفت'),
('company_subtitle','إدارة متكاملة لمكاتب السفريات والسياحة'),
('company_email',''),
('company_website',''),
('commercial_register',''),
('tax_number',''),
('voucher_red_note','تم إنشاء هذا السند إلكترونياً ولا يحتاج إلى توقيع'),
('voucher_receipt_title','سند قبض'),
('voucher_payment_title','سند صرف'),
('voucher_default_payment_method','نقداً'),
('voucher_default_currency_id','2'),
('voucher_signature_receiver','توقيع المستلم'),
('voucher_signature_accountant','توقيع المحاسب'),
('voucher_signature_manager','توقيع المدير'),
('voucher_show_company_info','1'),
('voucher_show_lines','1'),
('voucher_show_signatures','1'),
('voucher_show_print_user','1'),
('company_phone','778661119'),
('branches_enabled','1'),
('license_status','trial'),
('license_type','trial'),
('license_attempts','0'),
('license_screen_locked','0'),
('system_center_enabled','1'),
('browser_leave_only','1');
INSERT IGNORE INTO permissions(module,permission_key,name) VALUES
('الإدارة والرقابة','settings.system','إعدادات المنشأة والسندات'),
('الإدارة والرقابة','license.view','عرض إعدادات الترخيص'),
('الإدارة والرقابة','license.activate','تفعيل أو تغيير الترخيص'),
('الإدارة والرقابة','license.extra','منح صلاحيات أكثر'),
('الإدارة والرقابة','notification.settings','إعدادات الإشعارات'),
('الإدارة والرقابة','notifications.manage','إنشاء وإدارة الإشعارات'),
('الإدارة والرقابة','activity_logs.view','عرض سجل النشاط والأجهزة'),
('الإدارة والرقابة','activity_logs.mark','تعليم سجل النشاط كمقروء'),
('الفروع','branches.view','عرض الفروع'),
('الفروع','branches.manage','إدارة الفروع');
INSERT IGNORE INTO role_permissions(role_id,permission_id) SELECT 1,id FROM permissions;

-- V49 fourth review: stricter accounting journal links
ALTER TABLE office_transfers ADD COLUMN IF NOT EXISTS journal_id INT NULL;

-- V53 financial periods, closing controls, and database backups
CREATE TABLE IF NOT EXISTS financial_periods(
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NOT NULL,
  fiscal_year INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  closed_by INT NULL,
  closed_at DATETIME NULL,
  reopened_by INT NULL,
  reopened_at DATETIME NULL,
  closing_note TEXT NULL,
  created_by INT NULL,
  created_at DATETIME,
  UNIQUE KEY uniq_fin_period_branch_year(branch_id,fiscal_year),
  INDEX idx_fin_period_branch_dates(branch_id,start_date,end_date,status)
);

CREATE TABLE IF NOT EXISTS accounting_backups(
  id INT AUTO_INCREMENT PRIMARY KEY,
  branch_id INT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT DEFAULT 0,
  backup_type VARCHAR(30) DEFAULT 'full_sql',
  notes TEXT NULL,
  created_by INT NULL,
  created_at DATETIME,
  INDEX idx_accounting_backups_branch(branch_id),
  INDEX idx_accounting_backups_created(created_at)
);
ALTER TABLE accounting_backups ADD COLUMN IF NOT EXISTS branch_id INT NULL;
ALTER TABLE accounting_backups ADD COLUMN IF NOT EXISTS backup_type VARCHAR(30) DEFAULT 'full_sql';

INSERT IGNORE INTO permissions(module,permission_key,name) VALUES
('الإدارة والرقابة','accounting.periods','إدارة الإقفال والفترات المالية'),
('الإدارة والرقابة','accounting.backup','إنشاء وتنزيل النسخ الاحتياطية');

INSERT IGNORE INTO financial_periods(branch_id,fiscal_year,start_date,end_date,status,created_by,created_at)
SELECT id,YEAR(CURDATE()),MAKEDATE(YEAR(CURDATE()),1),DATE(CONCAT(YEAR(CURDATE()),'-12-31')),'open',1,NOW()
FROM branches;

INSERT IGNORE INTO role_permissions(role_id,permission_id)
SELECT 1,id FROM permissions WHERE permission_key IN ('accounting.periods','accounting.backup');
