type LoadingOverlayProps = {
  message?: string;
};

export default function LoadingOverlay({
  message = "Loading...",
}: LoadingOverlayProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        width: "100%",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.96)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        fontFamily:
          '"Link Sans", Arial, Helvetica, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "18px",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            boxSizing: "border-box",
            width: "46px",
            height: "46px",
            flex: "0 0 46px",
            border: "4px solid #ddddda",
            borderTopColor: "#111111",
            borderRadius: "50%",
            animation:
              "globalLoadingSpinner 700ms linear infinite",
          }}
        />

        <p
          style={{
            margin: 0,
            color: "#111111",
            fontSize: "17px",
            fontWeight: 800,
            lineHeight: 1.2,
            textAlign: "center",
          }}
        >
          {message}
        </p>
      </div>

      <style>{`
        @keyframes globalLoadingSpinner {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
