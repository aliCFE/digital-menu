import { useRef, useState } from 'react';
import { uploadImage } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Spinner from './Spinner';
import styles from './ImageUpload.module.css';

export default function ImageUpload({ value, onChange, label, aspect = '4 / 3' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const toast = useToast();

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={styles.wrap}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
        style={{ aspectRatio: aspect }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
      >
        {uploading ? (
          <Spinner />
        ) : value ? (
          <img src={value} alt="" className={styles.preview} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderIcon}>📷</span>
            <span>Click or drag an image here</span>
          </div>
        )}
        {value && !uploading && (
          <button
            type="button"
            className={styles.changeOverlay}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Change
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.hiddenInput}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
