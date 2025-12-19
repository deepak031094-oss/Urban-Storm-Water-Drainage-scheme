const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/uploads/dpr');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'dpr-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /xlsx|xls/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only Excel files are allowed!'));
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// DPR Validation Schema
const dprSchema = {
    requiredSheets: ['Project Information', 'Daily Progress Summary', 'Manpower Details', 'Equipment Details', 'Material Details'],
    projectInfo: ['Project Name', 'Location', 'Reporting Period', 'Prepared By', 'Designation', 'Date'],
    progressFields: ['Date', 'Work Description', 'Location', 'Planned Qty', 'Completed Qty', 'Unit', 'Progress (%)', 'Remarks'],
    manpowerFields: ['Date', 'Skilled Workers', 'Unskilled Workers', 'Supervisors', 'Engineers', 'Total'],
    equipmentFields: ['Date', 'Equipment Type', 'Number of Units', 'Hours Worked', 'Status', 'Remarks'],
    materialFields: ['Date', 'Material', 'Unit', 'Planned', 'Used', 'Balance', 'Remarks']
};

// Validate DPR data against schema
const validateDPRData = (workbook) => {
    const errors = [];
    const sheetNames = workbook.SheetNames;
    
    // Check for required sheets
    dprSchema.requiredSheets.forEach(sheet => {
        if (!sheetNames.includes(sheet)) {
            errors.push(`Missing required sheet: ${sheet}`);
        }
    });

    // If required sheets are missing, return early
    if (errors.length > 0) return { isValid: false, errors };

    // Validate Project Information
    const projectInfoSheet = workbook.Sheets['Project Information'];
    const projectInfo = xlsx.utils.sheet_to_json(projectInfoSheet, { header: 1 });
    
    dprSchema.projectInfo.forEach(field => {
        const fieldExists = projectInfo.some(row => row && row[0] && row[0].toString().trim() === field);
        if (!fieldExists) {
            errors.push(`Missing required field in Project Information: ${field}`);
        }
    });

    // Validate Daily Progress Summary
    const progressSheet = workbook.Sheets['Daily Progress Summary'];
    const progressData = xlsx.utils.sheet_to_json(progressSheet, { header: 1 });
    
    if (progressData.length < 2) {
        errors.push('Daily Progress Summary is empty');
    } else {
        const headers = progressData[0].map(h => h && h.toString().trim());
        dprSchema.progressFields.forEach(field => {
            if (!headers.includes(field)) {
                errors.push(`Missing required field in Daily Progress Summary: ${field}`);
            }
        });
    }

    return {
        isValid: errors.length === 0,
        errors,
        sheetNames,
        projectInfo: projectInfo.reduce((acc, [key, value]) => {
            if (key && value) acc[key] = value;
            return acc;
        }, {})
    };
};

// Process DPR data
const processDPRData = (workbook, projectInfo) => {
    const result = { projectInfo };
    
    // Process Daily Progress Summary
    const progressSheet = workbook.Sheets['Daily Progress Summary'];
    result.dailyProgress = xlsx.utils.sheet_to_json(progressSheet, { header: 1 })
        .slice(1) // Skip header
        .filter(row => row && row.length > 0)
        .map(row => {
            const entry = {};
            dprSchema.progressFields.forEach((field, index) => {
                entry[field] = row[index];
            });
            return entry;
        });

    // Process Manpower Details
    const manpowerSheet = workbook.Sheets['Manpower Details'];
    result.manpower = xlsx.utils.sheet_to_json(manpowerSheet, { header: 1 })
        .slice(1)
        .filter(row => row && row.length > 0)
        .map(row => {
            const entry = {};
            dprSchema.manpowerFields.forEach((field, index) => {
                entry[field] = row[index];
            });
            return entry;
        });

    // Process Equipment Details
    const equipmentSheet = workbook.Sheets['Equipment Details'];
    result.equipment = xlsx.utils.sheet_to_json(equipmentSheet, { header: 1 })
        .slice(1)
        .filter(row => row && row.length > 0)
        .map(row => {
            const entry = {};
            dprSchema.equipmentFields.forEach((field, index) => {
                entry[field] = row[index];
            });
            return entry;
        });

    // Process Material Details
    const materialSheet = workbook.Sheets['Material Details'];
    result.materials = xlsx.utils.sheet_to_json(materialSheet, { header: 1 })
        .slice(1)
        .filter(row => row && row.length > 0)
        .map(row => {
            const entry = {};
            dprSchema.materialFields.forEach((field, index) => {
                entry[field] = row[index];
            });
            return entry;
        });

    return result;
};

// Upload DPR
router.post('/upload/dpr', upload.single('dprFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false,
                error: 'No file uploaded' 
            });
        }

        // Process the Excel file
        const workbook = xlsx.readFile(req.file.path);
        
        // Validate DPR data
        const { isValid, errors, projectInfo } = validateDPRData(workbook);
        if (!isValid) {
            // Clean up the uploaded file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({
                success: false,
                error: 'DPR validation failed',
                details: errors
            });
        }

        // Process and validate the data
        const processedData = processDPRData(workbook, projectInfo);
        
        // Save the processed data (in a real app, you would save this to a database)
        const dprData = {
            ...processedData,
            filename: req.file.filename,
            originalname: req.file.originalname,
            path: `/uploads/dpr/${req.file.filename}`,
            size: req.file.size,
            uploadedAt: new Date(),
            status: 'pending_review',
            uploadedBy: req.user ? req.user.id : 'anonymous'
        };

        // In a real app, you would save to database here
        // await DPR.create(dprData);

        res.json({
            success: true,
            message: 'DPR uploaded and validated successfully',
            data: {
                filename: dprData.filename,
                originalname: dprData.originalname,
                path: dprData.path,
                size: dprData.size,
                uploadedAt: dprData.uploadedAt,
                projectInfo: dprData.projectInfo,
                stats: {
                    dailyProgress: dprData.dailyProgress.length,
                    manpowerEntries: dprData.manpower.length,
                    equipmentEntries: dprData.equipment.length,
                    materialEntries: dprData.materials.length
                }
            }
        });

    } catch (error) {
        console.error('Error processing DPR:', error);
        // Clean up the uploaded file in case of error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            success: false,
            error: 'Error processing DPR',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// Get recent DPR uploads
router.get('/uploads/dpr', (req, res) => {
    const uploadsDir = path.join(__dirname, '../../public/uploads/dpr');
    
    if (!fs.existsSync(uploadsDir)) {
        return res.json({ uploads: [] });
    }

    const files = fs.readdirSync(uploadsDir)
        .filter(file => file.startsWith('dpr-'))
        .map(file => {
            const filePath = path.join(uploadsDir, file);
            const stats = fs.statSync(filePath);
            return {
                filename: file,
                originalname: file.replace(/^dpr-\d+-/, '').replace(/-\w+(\..+)$/, '$1'),
                path: `/uploads/dpr/${file}`,
                size: stats.size,
                uploadedAt: stats.birthtime
            };
        })
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, 10);

    res.json({ uploads: files });
});

// Download DPR template
router.get('/templates/dpr-template.xlsx', (req, res) => {
    try {
        // Create a sample workbook
        const wb = xlsx.utils.book_new();
        const wsData = [
            ["Date", "Project ID", "Work Description", "Location", "Work Completed (%)", "Labor Count", "Materials Used", "Issues/Remarks"],
            ["2024-01-01", "PRJ-001", "Excavation", "Site A", "25", "10", "Excavator, Shovels", "No issues"],
            ["2024-01-02", "PRJ-001", "Pipe Laying", "Site A", "40", "8", "Pipes, Cement", "Rain delay"],
            ["2024-01-03", "PRJ-001", "Backfilling", "Site A", "60", "6", "Gravel, Sand", "None"]
        ];
        const ws = xlsx.utils.aoa_to_sheet(wsData);
        xlsx.utils.book_append_sheet(wb, ws, "DPR");
        
        // Generate the file
        const tempFilePath = path.join(uploadsDir, 'dpr-template.xlsx');
        xlsx.writeFile(wb, tempFilePath);
        
        // Send the file
        res.download(tempFilePath, 'DPR_Template.xlsx', (err) => {
            // Delete the temporary file after sending
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            if (err) {
                console.error('Error sending template file:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error generating template' });
                }
            }
        });
    } catch (error) {
        console.error('Error generating DPR template:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error generating DPR template',
            details: error.message 
        });
    }
});

module.exports = router;
