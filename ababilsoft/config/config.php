<?php
return [
    'app_name' => 'نظام أبابيل سوفت',
    'company_name' => 'شركة أبابيل سوفت',
    'company_subtitle' => 'لإدارة مكاتب السفريات والسياحة والحج والعمرة والأيدي العاملة',
    'company_phone' => '778661119',
    'company_address' => 'الجمهورية اليمنية - صنعاء - جوار مركز الخمسين',
    'company_email' => 'info@ababilsoft.com',
    'company_website' => 'www.ababilsoft.com',
    'db' => [
        'host' => '127.0.0.1',
        'port' => '3307',
        'name' => 'ababilsoft_db',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4',
    ],
    'master_db' => [
        'name' => 'ababilsoft_master',
    ],
    'tenancy' => [
        'enabled' => true,
        'default_code' => 'main',
        'default_name' => 'المنشأة الرئيسية',
        'db_prefix' => 'ababilsoft_tenant_',
        'auto_select_single' => true,
    ],
    'debug' => false,
    'session_name' => 'ABABILSOFT_SESSION',
];
