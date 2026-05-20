export default function LoadingSpinner({ size = 40, fullPage = false }) {
  if (fullPage) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        minHeight: '60vh', gap: '1rem',
      }}>
        <div style={{
          width: size, height: size,
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent-light)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
  return (
    <>
      <div style={{
        width: size, height: size,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--accent-light)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        display: 'inline-block',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
