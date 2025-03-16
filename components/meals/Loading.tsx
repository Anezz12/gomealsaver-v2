'use client';
import ClipLoader from 'react-spinners/ClipLoader';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    padding: '20px',
  },
  spinner: {
    display: 'block',
    margin: '20px auto',
  },
  text: {
    marginTop: '15px',
    color: '#666',
    fontSize: '16px',
  },
};

export default function Loading() {
  return (
    <div style={styles.container} data-testid="loading">
      <ClipLoader
        color="#3b82f6"
        cssOverride={styles.spinner}
        size={80}
        aria-label="Loading Spinner"
      />
      <p style={styles.text}>Loading...</p>
    </div>
  );
}
