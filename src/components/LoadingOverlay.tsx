"use client";

type LoadingOverlayProps = {
  message?: string;
};

export default function LoadingOverlay({
  message = "Loading...",
}: LoadingOverlayProps) {
  return (
    <div
      className="global-loading-overlay"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="global-loading-content">
        <div
          className="global-loading-spinner"
          aria-hidden="true"
        />

        <p>{message}</p>
      </div>

      <style jsx>{`
        .global-loading-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: loadingOverlayIn 180ms ease both;
        }

        .global-loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }

        .global-loading-spinner {
          width: 46px;
          height: 46px;
          border: 4px solid #ddddda;
          border-top-color: #111111;
          border-radius: 50%;
          animation: loadingSpinner 700ms linear infinite;
        }

        .global-loading-content p {
          margin: 0;
          color: #111111;
          font-family:
            "Link Sans",
            Arial,
            Helvetica,
            sans-serif;
          font-size: 17px;
          font-weight: 800;
        }

        @keyframes loadingSpinner {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loadingOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
