"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type WalletCardProps = {
  stripeSessionId: string;
  productTitle: string;
  productImage: string;
  giftValue: string;
  giftCode: string;
  claimedDate: string;
  personalMessage: string | null;
};

export default function WalletCard({
  stripeSessionId,
  productTitle,
  productImage,
  giftValue,
  giftCode,
  claimedDate,
  personalMessage,
}: WalletCardProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [removeConfirmOpen, setRemoveConfirmOpen] =
  useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setMenuOpen(false);
setRemoveConfirmOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleRefresh = () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setRefreshMessage("");

    window.setTimeout(() => {
      setIsRefreshing(false);
      setRefreshMessage("Updated just now");
    }, 750);

    window.setTimeout(() => {
      setRefreshMessage("");
    }, 2600);
  };

  const handleCopy = async () => {
    if (!giftCode) return;

    try {
      await navigator.clipboard.writeText(giftCode);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Could not copy gift card code:",
        error,
      );
    }
  };

const handleRemove = async () => {
  if (isRemoving) return;

  setRemoveConfirmOpen(false);
  setMenuOpen(false);
  setIsRemoving(true);

  try {
    const response = await fetch(
      "/api/wallet/remove",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripeSessionId,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error ?? "Could not remove this card.",
      );
    }

    router.refresh();
  } catch (error) {
    console.error(
      "Wallet card removal failed:",
      error,
    );

    setIsRemoving(false);

    alert(
      "Could not remove this card. Please try again.",
    );
  }
};

  return (
    <div className="lt-wallet-cell">
      <div className="lt-wallet-scene">
        <div
          className={`lt-wallet-flipper ${
            detailsOpen ? "is-flipped" : ""
          } ${isRemoving ? "is-removing" : ""}`}
        >
          <article className="lt-wallet-face lt-wallet-front">
            <div className="lt-wallet-image-wrap">
              <img
                src={productImage}
                alt={productTitle}
                className="lt-wallet-image"
              />
            </div>

            <div className="lt-wallet-front-content">
              <div className="lt-wallet-title-row">
                <h2>{productTitle}</h2>

                <div
                  className="lt-wallet-menu-wrap"
                  ref={menuRef}
                >
                  <button
                    type="button"
                    className="lt-wallet-menu-button"
                    aria-label={`More options for ${productTitle}`}
                    aria-expanded={menuOpen}
onClick={() => {
  setMenuOpen((previous) => !previous);
}}
                  >
                    <span />
                    <span />
                    <span />
                  </button>

{menuOpen && (
  <div
    className={`lt-wallet-menu ${
      removeConfirmOpen ? "is-confirming" : ""
    }`}
  >
    {!removeConfirmOpen ? (
      <button
        type="button"
        className="lt-wallet-remove-option"
        onClick={() => {
          setRemoveConfirmOpen(true);
        }}
        disabled={isRemoving}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M4 7h16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M9 7V4h6v3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M6.5 7l1 13h9l1-13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d="M10 11v5M14 11v5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <span>Remove from wallet</span>
      </button>
    ) : (
      <div className="lt-wallet-inline-confirm">
        <p>Remove from wallet?</p>

        <div className="lt-wallet-inline-actions">
          <button
            type="button"
            className="lt-wallet-inline-cancel"
onClick={() => {
  setRemoveConfirmOpen(false);
}}
          >
            Keep card
          </button>

          <button
            type="button"
            className="lt-wallet-inline-remove"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>
    )}
  </div>
)}
                </div>
              </div>

              <div className="lt-wallet-value">
                <p>Original value</p>

                <div className="lt-wallet-value-row">
                  <strong>{giftValue}</strong>

                  <button
                    type="button"
                    className={`lt-wallet-refresh ${
                      isRefreshing
                        ? "is-refreshing"
                        : ""
                    }`}
                    onClick={handleRefresh}
                    aria-label="Refresh card balance"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        d="M20 11a8 8 0 0 0-14.4-4.8L4 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M4 3v5h5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M4 13a8 8 0 0 0 14.4 4.8L20 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M20 21v-5h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="lt-wallet-refresh-message">
                  {refreshMessage}
                </div>
              </div>

              <p className="lt-wallet-added">
                Added {claimedDate}
              </p>

              <button
                type="button"
                className="lt-wallet-how"
              >
                How to use this card
              </button>

              <button
                type="button"
                className="lt-wallet-reveal"
                onClick={() => setDetailsOpen(true)}
              >
                Reveal card details
              </button>
            </div>
          </article>

          <article className="lt-wallet-face lt-wallet-back">
            <div className="lt-wallet-back-content">
              <div className="lt-wallet-back-heading">
                <div>
                  <p>Gift card details</p>
                  <h2>Spend it</h2>
                </div>

                <div className="lt-wallet-back-mark">
                  ✱
                </div>
              </div>

              <div className="lt-wallet-tabs">
                <span className="is-active">
                  Online
                </span>

                <span>Keep track</span>
              </div>

              <div className="lt-wallet-code-section">
                <p className="lt-wallet-field-label">
                  PIN
                </p>

                <div className="lt-wallet-code-row">
                  <strong>
                    {giftCode || "Code unavailable"}
                  </strong>

                  {giftCode && (
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label="Copy gift card code"
                    >
                      {copied ? (
                        <span className="lt-wallet-copied">
                          ✓
                        </span>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <rect
                            x="8"
                            y="8"
                            width="11"
                            height="11"
                            rx="2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          />

                          <path
                            d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {personalMessage && (
                <div className="lt-wallet-message">
                  <p className="lt-wallet-field-label">
                    Gift message
                  </p>

                  <p>{personalMessage}</p>
                </div>
              )}

              <button
                type="button"
                className="lt-wallet-back-how"
              >
                How to use this card
              </button>

              <button
                type="button"
                className="lt-wallet-hide"
                onClick={() => setDetailsOpen(false)}
              >
                Hide card details
              </button>
            </div>
          </article>
        </div>
      </div>

      <p className="lt-wallet-expiry">
        No expiry
      </p>

      <style jsx>{`
        .lt-wallet-cell {
          min-width: 0;
          perspective: 1400px;
        }

        .lt-wallet-scene {
          width: 100%;
          perspective: 1400px;
        }

        .lt-wallet-flipper {
          position: relative;
          display: grid;
          width: 100%;
          transform-style: preserve-3d;
          transition:
            transform 680ms
              cubic-bezier(0.2, 0.75, 0.2, 1),
            opacity 220ms ease;
          will-change: transform;
        }

        .lt-wallet-flipper.is-flipped {
          transform: rotateY(180deg);
        }

        .lt-wallet-flipper.is-removing {
          opacity: 0.3;
          pointer-events: none;
        }

        .lt-wallet-face {
          grid-area: 1 / 1;
          width: 100%;
          min-height: 448px;
          border-radius: 20px;
          background: #ffffff;
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.04),
            0 10px 18px rgba(0, 0, 0, 0.05),
            0 18px 56px rgba(0, 0, 0, 0.1);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .lt-wallet-front {
          position: relative;
          overflow: visible;
        }

        .lt-wallet-back {
          transform: rotateY(180deg);
          overflow: hidden;
        }

        .lt-wallet-image-wrap {
          width: 100%;
          aspect-ratio: 1.62 / 1;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
          background: #ffffff;
        }

        .lt-wallet-image {
          display: block;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: center;
        }

        .lt-wallet-front-content {
          padding: 20px 18px 16px;
        }

        .lt-wallet-title-row {
          position: relative;
          min-height: 42px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 34px;
          align-items: center;
          gap: 12px;
        }

        .lt-wallet-title-row h2 {
          min-width: 0;
          margin: 0;
          color: #111111;
          font-size: 20px;
          font-weight: 500;
          line-height: 1.08;
          letter-spacing: -0.5px;
          overflow-wrap: anywhere;
        }

        .lt-wallet-menu-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

.lt-wallet-menu-button {
  position: relative;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: #f1f1ef;
  cursor: pointer;
}

.lt-wallet-menu-button span {
  position: absolute;
  left: 50%;
  display: block;
  width: 4px;
  height: 4px;
  border-radius: 999px;
  background: #111111;
  transform: translateX(-50%);
}

.lt-wallet-menu-button span:nth-child(1) {
  top: 8px;
}

.lt-wallet-menu-button span:nth-child(2) {
  top: 15px;
}

.lt-wallet-menu-button span:nth-child(3) {
  top: 22px;
}

.lt-wallet-menu {
  position: absolute;
  right: 0;
  top: 41px;
  z-index: 50;

  width: 188px;
  padding: 7px;

  border: 1px solid #dededb;
  border-radius: 14px;

  background: #ffffff;

  box-shadow:
    0 8px 20px rgba(0, 0, 0, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.04);

  animation: walletMenuIn 160ms ease both;
  transition:
    width 180ms ease,
    padding 180ms ease;
}

.lt-wallet-menu.is-confirming {
  width: 218px;
  padding: 12px;
}

        @keyframes walletMenuIn {
          from {
            opacity: 0;
            transform: translateY(-5px)
              scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .lt-wallet-value {
          margin-top: 20px;
          text-align: center;
        }

        .lt-wallet-value > p {
          margin: 0 0 6px;
          color: #666666;
          font-size: 12px;
          font-weight: 600;
        }

        .lt-wallet-value-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .lt-wallet-value-row strong {
          color: #111111;
          font-size: 28px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1px;
        }

        .lt-wallet-refresh {
          width: 28px;
          height: 28px;
          padding: 5px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: #22451b;
          cursor: pointer;
          transition:
            background-color 160ms ease,
            transform 160ms ease;
        }

        .lt-wallet-refresh:hover {
          background: #edf4e9;
        }

        .lt-wallet-refresh svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .lt-wallet-refresh.is-refreshing {
          animation: walletRefreshSpin 650ms
            linear infinite;
        }

        @keyframes walletRefreshSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .lt-wallet-refresh-message {
          height: 15px;
          margin-top: 5px;
          color: #22451b;
          font-size: 10px;
          font-weight: 800;
        }

        .lt-wallet-added {
          margin: 10px 0 0;
          color: #777777;
          font-size: 11px;
          font-weight: 700;
          text-align: center;
        }

        .lt-wallet-how {
          width: 100%;
          min-height: 40px;
          margin-top: 14px;
          padding: 0 12px;
          border: 0;
          border-radius: 8px;
          background: #f3f3f1;
          color: #111111;
          font-size: 13px;
          font-weight: 800;
          cursor: default;
        }

        .lt-wallet-reveal {
          width: 100%;
          min-height: 48px;
          margin-top: 12px;
          padding: 0 14px;
          border: 0;
          border-radius: 999px;
          background: #111111;
          color: #ffffff;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 170ms ease,
            background-color 170ms ease;
        }

        .lt-wallet-reveal:hover {
          transform: translateY(-1px);
          background: #292929;
        }

        .lt-wallet-back-content {
          min-height: 448px;
          padding: 25px 22px 20px;
          display: flex;
          flex-direction: column;
        }

        .lt-wallet-back-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .lt-wallet-back-heading p {
          margin: 0 0 7px;
          color: #666666;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .lt-wallet-back-heading h2 {
          margin: 0;
          color: #111111;
          font-size: 29px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -1px;
        }

        .lt-wallet-back-mark {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #cbea19;
          color: #111111;
          font-size: 20px;
          font-weight: 900;
        }

        .lt-wallet-tabs {
          margin-top: 24px;
          padding: 4px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          border-radius: 999px;
          background: #f1f1ef;
        }

        .lt-wallet-tabs span {
          min-height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #666666;
          font-size: 13px;
          font-weight: 700;
        }

        .lt-wallet-tabs .is-active {
          background: #cbea19;
          color: #111111;
        }

        .lt-wallet-code-section {
          margin-top: 24px;
        }

        .lt-wallet-field-label {
          margin: 0 0 7px;
          color: #666666;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .lt-wallet-code-row {
          min-height: 50px;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr) 34px;
          align-items: center;
          gap: 10px;
          padding: 0 11px 0 14px;
          border-radius: 9px;
          background: #f3f3f1;
        }

        .lt-wallet-code-row strong {
          min-width: 0;
          color: #111111;
          font-family: monospace;
          font-size: 13px;
          line-height: 1.3;
          overflow-wrap: anywhere;
        }

        .lt-wallet-code-row button {
          width: 34px;
          height: 34px;
          padding: 7px;
          border: 0;
          border-radius: 8px;
          background: #ffffff;
          color: #111111;
          cursor: pointer;
        }

        .lt-wallet-code-row svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .lt-wallet-copied {
          color: #22451b;
          font-size: 18px;
          font-weight: 900;
        }

        .lt-wallet-message {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid #dededb;
        }

        .lt-wallet-message p:last-child {
          margin: 0;
          color: #444444;
          font-size: 13px;
          line-height: 1.4;
        }

        .lt-wallet-back-how {
          margin-top: 19px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #111111;
          font-size: 13px;
          font-weight: 800;
          text-align: left;
          cursor: default;
          text-decoration: underline;
        }

        .lt-wallet-hide {
          width: 100%;
          min-height: 48px;
          margin-top: auto;
          padding: 0 14px;
          border: 1.5px solid #111111;
          border-radius: 999px;
          background: #ffffff;
          color: #111111;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
        }

        .lt-wallet-hide:hover {
          background: #f3f3f1;
        }

        .lt-wallet-expiry {
          margin: 12px 0 0;
          color: #555555;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }
.lt-wallet-menu {
  position: absolute;
  right: 0;
  top: 40px;
  z-index: 50;

  width: 188px;
  padding: 7px;

  border: 1px solid #e2e2de;
  border-radius: 14px;
  background: #ffffff;

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.09),
    0 2px 5px rgba(0, 0, 0, 0.04);

  transform-origin: top right;
  animation: walletMenuIn 160ms
    cubic-bezier(0.22, 1, 0.36, 1) both;

  transition:
    width 180ms ease,
    padding 180ms ease;
}

.lt-wallet-menu.is-confirming {
  width: 198px;
  padding: 11px;
}

.lt-wallet-remove-option {
  display: grid;
  width: 100%;
  min-height: 42px;
  grid-template-columns: 19px minmax(0, 1fr);
  align-items: center;
  gap: 9px;

  padding: 0 10px;
  border: 0;
  border-radius: 10px;

  background: transparent;
  color: #111111;

  font-size: 13px;
  font-weight: 800;
  line-height: 1.1;
  text-align: left;

  cursor: pointer;
}

.lt-wallet-remove-option:hover {
  background: #f1f1ef;
}

.lt-wallet-remove-option svg {
  display: block;
  width: 18px;
  height: 18px;
  color: #111111;
}

.lt-wallet-inline-confirm {
  width: 100%;
  text-align: center;
  animation: walletConfirmIn 160ms ease both;
}

.lt-wallet-inline-confirm > p {
  margin: 2px 0 11px;
  color: #111111;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.15;
  text-align: center;
}

.lt-wallet-inline-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px;
  width: 100%;
}

.lt-wallet-inline-actions button {
  display: flex;
  width: 100%;
  min-width: 0;
  height: 34px;
  min-height: 34px;
  align-items: center;
  justify-content: center;

  margin: 0;
  padding: 0 8px;
  border: 0;
  border-radius: 999px;

  font-size: 11.5px;
  font-weight: 850;
  line-height: 1;
  text-align: center;

  cursor: pointer;
  transition:
    background-color 150ms ease,
    transform 150ms ease;
}

.lt-wallet-inline-actions button:hover {
  transform: translateY(-1px);
}

.lt-wallet-inline-cancel {
  background: #f1f1ef;
  color: #111111;
}

.lt-wallet-inline-cancel:hover {
  background: #e7e7e3;
}

.lt-wallet-inline-remove {
  background: #111111;
  color: #ffffff;
}

.lt-wallet-inline-remove:hover {
  background: #292929;
}

.lt-wallet-inline-remove:disabled {
  opacity: 0.55;
  cursor: wait;
  transform: none;
}

@keyframes walletMenuIn {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes walletConfirmIn {
  from {
    opacity: 0;
    transform: translateY(3px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
  @media (min-width: 1701px) {
  .lt-wallet-title-row h2 {
    font-size: 25px !important;
    line-height: 1.05 !important;
    letter-spacing: -0.7px !important;
  }

  .lt-wallet-value > p {
    font-size: 14px !important;
  }

  .lt-wallet-value-row strong {
    font-size: 36px !important;
    letter-spacing: -1.3px !important;
  }

  .lt-wallet-refresh {
    width: 32px !important;
    height: 32px !important;
  }

  .lt-wallet-refresh-message {
    font-size: 12px !important;
  }

  .lt-wallet-added {
    font-size: 13px !important;
  }

  .lt-wallet-how,
  .lt-wallet-reveal,
  .lt-wallet-back-how,
  .lt-wallet-hide {
    font-size: 15px !important;
  }

  .lt-wallet-field-label,
  .lt-wallet-back-heading p {
    font-size: 13px !important;
  }

  .lt-wallet-back-heading h2 {
    font-size: 36px !important;
  }

  .lt-wallet-tabs span,
  .lt-wallet-code-row strong,
  .lt-wallet-message p:last-child {
    font-size: 15px !important;
  }

  .lt-wallet-expiry {
    font-size: 14px !important;
  }
}
@media (max-width: 768px) {
  .lt-wallet-face,
  .lt-wallet-front,
  .lt-wallet-back {
    box-shadow: none !important;
    filter: none !important;
  }

  .lt-wallet-front-content {
    padding: 20px 16px 16px;
  }

.lt-wallet-title-row {
  position: relative;
  display: grid !important;
  grid-template-columns: 44px minmax(0, 1fr) 44px;
  align-items: center;
  min-height: 50px;
  padding: 0 !important;
}

.lt-wallet-title-row h2 {
  grid-column: 2;
  width: 100%;
  margin: 0;
  color: #111111;
  font-size: 20px !important;
  font-weight: 600 !important;
  line-height: 1.15 !important;
  letter-spacing: -0.4px !important;
  text-align: center !important;
}

.lt-wallet-menu-wrap {
  position: relative;
  grid-column: 3;
  justify-self: end;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.lt-wallet-menu-button {
  position: relative !important;
  right: auto !important;
  top: auto !important;
  transform: none !important;
}
  
  .lt-wallet-value {
    margin-top: 17px;
  }

  .lt-wallet-value > p {
    font-size: 13px !important;
  }

  .lt-wallet-value-row strong {
    font-size: 34px !important;
    letter-spacing: -1.2px !important;
  }

  .lt-wallet-refresh {
    width: 30px !important;
    height: 30px !important;
  }

  .lt-wallet-refresh-message {
    font-size: 11px !important;
  }

  .lt-wallet-added {
    font-size: 11.5px !important;
  }

  .lt-wallet-how,
  .lt-wallet-reveal,
  .lt-wallet-back-how,
  .lt-wallet-hide {
    font-size: 13.5px !important;
  }

  .lt-wallet-field-label,
  .lt-wallet-back-heading p {
    font-size: 12px !important;
  }

  .lt-wallet-back-heading h2 {
    font-size: 32px !important;
  }

  .lt-wallet-tabs span,
  .lt-wallet-code-row strong,
  .lt-wallet-message p:last-child {
    font-size: 14px !important;
  }

  .lt-wallet-expiry {
    font-size: 11.5px !important;
  }
}
      `}</style>
    </div>
  );
}