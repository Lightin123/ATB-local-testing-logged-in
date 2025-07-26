import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import styles from './AdminUpload.module.css';

const AdminUpload = () => {
  const role = useSelector(state => state.authSlice.userInfo?.role);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  if (role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/admin/whitelist/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Upload successful');
      } else {
        setMessage(data.message || 'Upload failed');
      }
    } catch (err) {
      setMessage('Upload failed');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.card}>
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={e => setFile(e.target.files[0])}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Upload
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

export default AdminUpload;
