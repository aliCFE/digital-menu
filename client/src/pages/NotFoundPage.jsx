import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', background: '#18201d', color: '#f4f1ec', gap: 10, textAlign: 'center', padding: 20,
    }}
    >
      <h1 style={{ fontSize: 56, fontWeight: 800, color: '#c65332', margin: 0 }}>404</h1>
      <p style={{ margin: 0 }}>Page not found.</p>
      <Link to="/" style={{ color: '#e07a3f', marginTop: 8, fontWeight: 700 }}>Go home</Link>
    </div>
  );
}
