export default function Loading({ label = "Loading..." }: { label?: string }) {
  return (
    <div style={{ padding: 16, textAlign: "center", opacity: 0.8 }}>
      <div style={{ fontSize: 14, marginBottom: 8 }}>{label}</div>
      <div
        style={{
          width: 48,
          height: 48,
          border: "4px solid rgba(255,255,255,0.2)",
          borderTop: "4px solid rgba(255,255,255,0.9)",
          borderRadius: "50%",
          margin: "0 auto",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg);} }`}</style>
    </div>
  );
}
