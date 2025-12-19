import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/dpr.css';
import * as XLSX from 'xlsx';

function Dpr() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileDataPreview, setFileDataPreview] = useState(null);
  const [recentUploads, setRecentUploads] = useState([]);
  
  const fileInputRef = React.useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls'].includes(ext)) {
      alert('Please select an Excel file (.xlsx or .xls)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB');
      return;
    }

    setSelectedFile(file);
    readExcelFile(file);
  };

  const readExcelFile = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const preview = {};

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      preview[sheetName] = {
        headers: rows[0] || [],
        data: rows.slice(1),
      };
    });

    setFileDataPreview(preview);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('dprFile', selectedFile);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload/dpr', true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const resp = JSON.parse(xhr.responseText);
        alert('Upload successful');
        setRecentUploads((prev) => [resp, ...prev]);
        resetUploader();
      } else {
        alert('Upload failed');
      }
    };

    xhr.onerror = () => alert('Upload error');
    xhr.send(formData);
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setFileDataPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      ['Date', 'Project ID', 'Work Description', 'Location', 'Work Completed (%)'],
      ['2024-01-01', 'PRJ-001', 'Excavation', 'Site A', '25'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'DPR');
    XLSX.writeFile(wb, 'DPR_Template.xlsx');
  };

  return (
    <>
      <Header />
      <div className="container py-4">
        <div className="dpr-upload-container">
          <h2 className="mb-4"><i className="fas fa-file-excel me-2"></i>Daily Progress Report (DPR) Upload</h2>

          <div
            className="upload-area"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            <i className="fas fa-cloud-upload-alt fa-3x mb-3" style={{ color: '#1a5276' }}></i>
            <h5>Drag & Drop your DPR Excel file here</h5>
            <p className="text-muted">or</p>
            <button className="btn btn-outline-primary">Browse Files</button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .xls"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="file-info mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="fas fa-file-excel me-2"></i>
                  <span>{selectedFile.name}</span>
                  <small className="text-muted ms-2">{(selectedFile.size / 1024).toFixed(2)} KB</small>
                </div>
                <button className="btn btn-sm btn-outline-danger" onClick={resetUploader}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="progress mt-2" style={{ height: '5px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              className="btn-upload me-2"
              disabled={!selectedFile}
              onClick={handleUpload}
            >
              <i className="fas fa-upload me-2"></i>Upload DPR
            </button>
            <button className="btn btn-outline-secondary" onClick={downloadTemplate}>
              <i className="fas fa-download me-2"></i>Download Template
            </button>
          </div>

          {fileDataPreview && (
            <div className="mt-4">
              {Object.entries(fileDataPreview).map(([sheetName, sheet]) => (
                <div key={sheetName} className="card mb-3">
                  <div className="card-header d-flex justify-content-between">
                    <span>{sheetName}</span>
                    <span className="badge bg-secondary">{sheet.data.length} rows</span>
                  </div>
                  <div className="card-body">
                    <table className="table table-sm table-bordered table-hover">
                      <thead>
                        <tr>
                          {sheet.headers.map((h, idx) => (
                            <th key={idx}>{h || '[Empty]'}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.data.slice(0, 5).map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {sheet.data.length > 5 && <p className="text-muted small">Showing 5 of {sheet.data.length} rows</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="recent-uploads mt-4">
            <h5><i className="fas fa-history me-2"></i>Recent DPR Uploads</h5>
            <div className="list-group">
              {recentUploads.length === 0 ? (
                <div className="text-muted text-center py-4">No recent uploads</div>
              ) : (
                recentUploads.map((upload, idx) => (
                  <div key={idx} className="list-group-item d-flex justify-content-between">
                    <div>
                      <i className="fas fa-file-excel text-success me-2"></i>
                      {upload.originalname}
                    </div>
                    <div className="text-muted small">{new Date(upload.uploadedAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dpr;
