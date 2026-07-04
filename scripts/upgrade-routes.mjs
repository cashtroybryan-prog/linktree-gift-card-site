import fs from "fs";
import path from "path";

const root = process.cwd();

const appPagePath = path.join(root, "src", "app", "page.tsx");
const oldPagePath = path.join(root, "src", "app", "page-old.tsx");
const componentsDir = path.join(root, "src", "components");
const giftSitePath = path.join(componentsDir, "GiftSite.tsx");

const appDir = path.join(root, "src", "app");

const homeDir = path.join(appDir, "home");
const homePagePath = path.join(homeDir, "page.tsx");

const shopDir = path.join(appDir, "shop");
const shopPagePath = path.join(shopDir, "page.tsx");

const productDir = path.join(appDir, "product", "[id]");
const productPagePath = path.join(productDir, "page.tsx");

const recipientDir = path.join(productDir, "recipient");
const recipientPagePath = path.join(recipientDir, "page.tsx");

const personalizeDir = path.join(productDir, "personalize", "[type]");
const personalizePagePath = path.join(personalizeDir, "page.tsx");

const checkoutDir = path.join(productDir, "checkout");
const checkoutPagePath = path.join(checkoutDir, "page.tsx");

const countryDir = path.join(appDir, "[country]");
const countryHomeDir = path.join(countryDir, "home");
const countryShopDir = path.join(countryDir, "shop");
const countryProductDir = path.join(countryDir, "product", "[id]");
const countryRecipientDir = path.join(countryProductDir, "recipient");
const countryPersonalizeDir = path.join(
  countryProductDir,
  "personalize",
  "[type]"
);
const countryCheckoutDir = path.join(countryProductDir, "checkout");

const countryHomePagePath = path.join(countryHomeDir, "page.tsx");
const countryShopPagePath = path.join(countryShopDir, "page.tsx");
const countryProductPagePath = path.join(countryProductDir, "page.tsx");
const countryRecipientPagePath = path.join(countryRecipientDir, "page.tsx");
const countryPersonalizePagePath = path.join(
  countryPersonalizeDir,
  "page.tsx"
);
const countryCheckoutPagePath = path.join(countryCheckoutDir, "page.tsx");

/**
 * Previous working source logic.
 * If GiftSite.tsx exists, use that as the source.
 * Otherwise use src/app/page.tsx.
 */
const sourcePath = fs.existsSync(giftSitePath) ? giftSitePath : appPagePath;

if (!fs.existsSync(sourcePath)) {
  console.error("Could not find src/components/GiftSite.tsx or src/app/page.tsx");
  process.exit(1);
}

[
  componentsDir,
  homeDir,
  shopDir,
  productDir,
  recipientDir,
  personalizeDir,
  checkoutDir,
  countryHomeDir,
  countryShopDir,
  countryProductDir,
  countryRecipientDir,
  countryPersonalizeDir,
  countryCheckoutDir,
].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

let code = fs.readFileSync(sourcePath, "utf8");

if (fs.existsSync(appPagePath) && !fs.existsSync(oldPagePath)) {
  fs.writeFileSync(oldPagePath, fs.readFileSync(appPagePath, "utf8"));
}

/**
 * Import router + pathname.
 */
if (code.includes(`import { usePathname, useRouter } from "next/navigation";`)) {
  // already correct
} else if (code.includes(`import { useRouter } from "next/navigation";`)) {
  code = code.replace(
    `import { useRouter } from "next/navigation";`,
    `import { usePathname, useRouter } from "next/navigation";`
  );
} else if (!code.includes(`useRouter`) && !code.includes(`usePathname`)) {
  code = code.replace(
    `import { useEffect, useMemo, useRef, useState } from "react";`,
    `import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";`
  );
}

/**
 * Full GiftSite props.
 */
const fullProps = `type GiftSiteProps = {
  initialPage?: ActivePage;
  initialCountryCode?: string;
  initialProductId?: string;
  initialProductStep?: ProductStep;
  initialRecipientType?: RecipientType;
  initialAmount?: number | null;
  initialCreatorHandle?: string;
  initialRecipientName?: string;
  initialRecipientEmail?: string;
  initialRecipientPhone?: string;
  initialPersonalizeMediaOn?: boolean;
  initialPersonalizeMessageOn?: boolean;
  initialMediaMode?: MediaMode;
  initialSelectedMediaIndex?: number | null;
  initialUploadedMediaName?: string;
  initialPersonalMessage?: string;
};`;

if (code.includes(`type GiftSiteProps = {`)) {
  code = code.replace(/type GiftSiteProps = \{[\s\S]*?\};/, fullProps);
} else {
  code = code.replace(
    `type Country = (typeof countries)[number];`,
    `type Country = (typeof countries)[number];

${fullProps}`
  );
}

/**
 * Full component opening.
 */
const fullFunctionOpening = `export default function GiftSite({
  initialPage = "home",
  initialCountryCode = "US",
  initialProductId,
  initialProductStep = "value",
  initialRecipientType = "someone",
  initialAmount = null,
  initialCreatorHandle,
  initialRecipientName = "",
  initialRecipientEmail = "",
  initialRecipientPhone = "",
  initialPersonalizeMediaOn = false,
  initialPersonalizeMessageOn = false,
  initialMediaMode = "card",
  initialSelectedMediaIndex = null,
  initialUploadedMediaName = "",
  initialPersonalMessage = "",
}: GiftSiteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasMountedRouteAnimationRef = useRef(false);

  const navigateTo = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    if (!hasMountedRouteAnimationRef.current) {
      hasMountedRouteAnimationRef.current = true;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.documentElement.classList.add("route-entering");
    });

    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("route-entering");
    }, 620);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      document.documentElement.classList.remove("route-entering");
    };
  }, [pathname]);

  const initialProduct =
    browserCards.find((card) => card.id === initialProductId) ??
    defaultLinktreeProduct;

  const initialCreator =
    creators.find((creator) => creator.handle === initialCreatorHandle) ?? null;

  const initialCountry =
    countries.find(
      (country) =>
        country.code.toLowerCase() === initialCountryCode.toLowerCase()
    ) ?? countries[0];`;

code = code.replace(`export default function Home() {`, fullFunctionOpening);

code = code.replace(
  /export default function GiftSite\(\{[\s\S]*?\}: GiftSiteProps\) \{\s*(const router = useRouter\(\);\s*)?(const pathname = usePathname\(\);\s*)?(const hasMountedRouteAnimationRef = useRef\(false\);\s*)?([\s\S]*?const initialCountry =[\s\S]*?countries\[0\];)?([\s\S]*?const initialCreator =[\s\S]*?null;)?([\s\S]*?const initialProduct =[\s\S]*?defaultLinktreeProduct;)?/,
  fullFunctionOpening
);

/**
 * Core states.
 */
code = code.replace(
  `const [activePage, setActivePage] = useState<ActivePage>("home");
  const [backgroundPage, setBackgroundPage] = useState<ActivePage>("home");`,
  `const [activePage, setActivePage] = useState<ActivePage>(initialPage);
  const [backgroundPage, setBackgroundPage] = useState<ActivePage>(initialPage);`
);

code = code.replace(
  `const [selectedProductCard, setSelectedProductCard] =
    useState<BrowserCard>(defaultLinktreeProduct);`,
  `const [selectedProductCard, setSelectedProductCard] =
    useState<BrowserCard>(initialProduct);`
);

code = code.replace(
  `const [selectedAmount, setSelectedAmount] = useState<number | null>(null);`,
  `const [selectedAmount, setSelectedAmount] = useState<number | null>(
    initialAmount
  );`
);

code = code.replace(
  `const [productStep, setProductStep] = useState<ProductStep>("value");`,
  `const [productStep, setProductStep] =
    useState<ProductStep>(initialProductStep);`
);

code = code.replace(
  `const [recipientType, setRecipientType] =
    useState<RecipientType>("someone");`,
  `const [recipientType, setRecipientType] =
    useState<RecipientType>(initialRecipientType);`
);

code = code.replace(
  `const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);`,
  `const [selectedCreator, setSelectedCreator] = useState<Creator | null>(
    initialCreator
  );`
);

code = code.replace(
  `const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");`,
  `const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [recipientEmail, setRecipientEmail] = useState(initialRecipientEmail);
  const [recipientPhone, setRecipientPhone] = useState(initialRecipientPhone);`
);

code = code.replace(
  `const [personalizeMediaOn, setPersonalizeMediaOn] = useState(false);
  const [personalizeMessageOn, setPersonalizeMessageOn] = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>("card");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null
  );
  const [uploadedMediaName, setUploadedMediaName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");`,
  `const [personalizeMediaOn, setPersonalizeMediaOn] = useState(
    initialPersonalizeMediaOn
  );
  const [personalizeMessageOn, setPersonalizeMessageOn] = useState(
    initialPersonalizeMessageOn
  );
  const [mediaMode, setMediaMode] = useState<MediaMode>(initialMediaMode);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    initialSelectedMediaIndex
  );
  const [uploadedMediaName, setUploadedMediaName] = useState(
    initialUploadedMediaName
  );
  const [personalMessage, setPersonalMessage] = useState(initialPersonalMessage);`
);

code = code.replace(
  `const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);`,
  `const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountry);`
);

/**
 * Remove older country pill effects if they exist.
 */
code = code.replace(
  /  useEffect\(\(\) => \{\s*const pendingCountryCode = window\.sessionStorage\.getItem\(\s*"giftCountryBannerPending"\s*\);[\s\S]*?  \}, \[pathname, selectedCountry\.code\]\);/g,
  ""
);

code = code.replace(
  /  useEffect\(\(\) => \{\s*const pendingCountryCode = window\.sessionStorage\.getItem\(\s*"giftCountryBannerPending"\s*\);[\s\S]*?  \}, \[pathname, selectedCountry\.code, selectedCountry\.name\]\);/g,
  ""
);

code = code.replace(
  /  useEffect\(\(\) => \{\s*const pendingCountryCode = window\.sessionStorage\.getItem\(\s*"giftCountryToastPending"\s*\);[\s\S]*?  \}, \[pathname, selectedCountry\.code\]\);/g,
  ""
);

code = code.replace(
  /  useEffect\(\(\) => \{\s*const pendingCountryCode = window\.sessionStorage\.getItem\(\s*"giftCountryToastPending"\s*\);[\s\S]*?  \}, \[pathname, selectedCountry\.code, selectedCountry\.name\]\);/g,
  ""
);

code = code.replace(
  /  useEffect\(\(\) => \{\s*const pendingCountryCode = window\.sessionStorage\.getItem\(\s*"giftCountryPillPending"\s*\);[\s\S]*?  \}, \[pathname, selectedCountry\.code\]\);/g,
  ""
);

/**
 * Existing green country pill after route render.
 */
code = code.replace(
  `const [countryToastVisible, setCountryToastVisible] = useState(false);`,
  `const [countryToastVisible, setCountryToastVisible] = useState(false);

  useEffect(() => {
    const pendingCountryCode = window.sessionStorage.getItem(
      "giftCountryPillPending"
    );

    if (!pendingCountryCode) return;

    const isCurrentCountry =
      pendingCountryCode.toLowerCase() === selectedCountry.code.toLowerCase();

    if (!isCurrentCountry) return;

    window.sessionStorage.removeItem("giftCountryPillPending");

    const showTimer = window.setTimeout(() => {
      triggerCountryToast();
    }, 640);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, [pathname, selectedCountry.code]);`
);

/**
 * Query params.
 */
if (!code.includes(`const creatorQueryParam =`)) {
  code = code.replace(
    `const checkoutGiftMessage =`,
    `const creatorQueryParam =
    selectedCreator && recipientType === "creator"
      ? \`&creator=\${encodeURIComponent(selectedCreator.handle)}\`
      : "";

  const recipientQueryParam =
    recipientType === "someone"
      ? \`\${recipientName.trim() ? \`&name=\${encodeURIComponent(recipientName.trim())}\` : ""}\${recipientEmail.trim() ? \`&email=\${encodeURIComponent(recipientEmail.trim())}\` : ""}\${recipientPhone.trim() ? \`&phone=\${encodeURIComponent(recipientPhone.trim())}\` : ""}\`
      : "";

  const personalizeQueryParam =
    \`\${personalizeMediaOn ? \`&media=1&mediaMode=\${encodeURIComponent(mediaMode)}\` : ""}\${personalizeMediaOn && selectedMediaIndex !== null ? \`&mediaIndex=\${selectedMediaIndex}\` : ""}\${personalizeMediaOn && uploadedMediaName.trim() ? \`&upload=\${encodeURIComponent(uploadedMediaName.trim())}\` : ""}\${personalizeMessageOn ? \`&message=1\` : ""}\${personalizeMessageOn && personalMessage.trim() ? \`&text=\${encodeURIComponent(personalMessage.trim())}\` : ""}\`;

  const checkoutGiftMessage =`
  );
}

if (!code.includes(`const recipientQueryParam =`)) {
  code = code.replace(
    `const creatorQueryParam =
    selectedCreator && recipientType === "creator"
      ? \`&creator=\${encodeURIComponent(selectedCreator.handle)}\`
      : "";`,
    `const creatorQueryParam =
    selectedCreator && recipientType === "creator"
      ? \`&creator=\${encodeURIComponent(selectedCreator.handle)}\`
      : "";

  const recipientQueryParam =
    recipientType === "someone"
      ? \`\${recipientName.trim() ? \`&name=\${encodeURIComponent(recipientName.trim())}\` : ""}\${recipientEmail.trim() ? \`&email=\${encodeURIComponent(recipientEmail.trim())}\` : ""}\${recipientPhone.trim() ? \`&phone=\${encodeURIComponent(recipientPhone.trim())}\` : ""}\`
      : "";`
  );
}

if (!code.includes(`const personalizeQueryParam =`)) {
  code = code.replace(
    `const recipientQueryParam =
    recipientType === "someone"
      ? \`\${recipientName.trim() ? \`&name=\${encodeURIComponent(recipientName.trim())}\` : ""}\${recipientEmail.trim() ? \`&email=\${encodeURIComponent(recipientEmail.trim())}\` : ""}\${recipientPhone.trim() ? \`&phone=\${encodeURIComponent(recipientPhone.trim())}\` : ""}\`
      : "";`,
    `const recipientQueryParam =
    recipientType === "someone"
      ? \`\${recipientName.trim() ? \`&name=\${encodeURIComponent(recipientName.trim())}\` : ""}\${recipientEmail.trim() ? \`&email=\${encodeURIComponent(recipientEmail.trim())}\` : ""}\${recipientPhone.trim() ? \`&phone=\${encodeURIComponent(recipientPhone.trim())}\` : ""}\`
      : "";

  const personalizeQueryParam =
    \`\${personalizeMediaOn ? \`&media=1&mediaMode=\${encodeURIComponent(mediaMode)}\` : ""}\${personalizeMediaOn && selectedMediaIndex !== null ? \`&mediaIndex=\${selectedMediaIndex}\` : ""}\${personalizeMediaOn && uploadedMediaName.trim() ? \`&upload=\${encodeURIComponent(uploadedMediaName.trim())}\` : ""}\${personalizeMessageOn ? \`&message=1\` : ""}\${personalizeMessageOn && personalMessage.trim() ? \`&text=\${encodeURIComponent(personalMessage.trim())}\` : ""}\`;`
  );
}

/**
 * Country-aware route helpers.
 */
if (!code.includes(`const selectedCountrySlug = selectedCountry.code.toLowerCase();`)) {
  code = code.replace(
    `const giftCardRange = \`\${formatCompactAmount(5)} - \${formatCompactAmount(
    500
  )}\`;`,
    `const giftCardRange = \`\${formatCompactAmount(5)} - \${formatCompactAmount(
    500
  )}\`;

  const selectedCountrySlug = selectedCountry.code.toLowerCase();

  const homePath = \`/\${selectedCountrySlug}/home\`;
  const shopPath = \`/\${selectedCountrySlug}/shop\`;

  const getCountryPath = (country: Country) => {
    const countrySlug = country.code.toLowerCase();
    const amount = selectedAmountObject?.value ?? selectedAmount ?? "";

    if (activePage === "home") {
      return \`/\${countrySlug}/home\`;
    }

    if (activePage === "wall") {
      return \`/\${countrySlug}/shop\`;
    }

    if (productStep === "recipient") {
      return \`/\${countrySlug}/product/\${selectedProductCard.id}/recipient\${amount ? \`?amount=\${amount}\` : ""}\`;
    }

    if (productStep === "personalize") {
      return \`/\${countrySlug}/product/\${selectedProductCard.id}/personalize/\${recipientType}\${amount ? \`?amount=\${amount}\${creatorQueryParam ?? ""}\${recipientQueryParam ?? ""}\` : ""}\`;
    }

    if (productStep === "checkout") {
      return \`/\${countrySlug}/product/\${selectedProductCard.id}/checkout\${amount ? \`?amount=\${amount}&type=\${recipientType}\${creatorQueryParam ?? ""}\${recipientQueryParam ?? ""}\${personalizeQueryParam ?? ""}\` : ""}\`;
    }

    return \`/\${countrySlug}/product/\${selectedProductCard.id}\`;
  };`
  );
}

/**
 * Navigation functions.
 */
const newNavBlock = `const goToWallOfCards = () => {
    navigateTo(shopPath);
  };

  const goToProductPage = (card: BrowserCard = defaultLinktreeProduct) => {
    setSelectedProductCard(card);
    resetProductFlow();
    navigateTo(\`/\${selectedCountrySlug}/product/\${card.id}\`);
  };

  const goHome = () => {
    navigateTo(homePath);
  };`;

code = code.replace(
  /const goToWallOfCards = \(\) => \{[\s\S]*?const goHome = \(\) => \{[\s\S]*?\n  \};/,
  newNavBlock
);

code = code.replace(
  `const handleBrowserCardClick = (card: BrowserCard) => {
    setSelectedBrowserCardId(card.id);

    setTimeout(() => {
      goToProductPage(card);
    }, 110);
  };`,
  `const handleBrowserCardClick = (card: BrowserCard) => {
    goToProductPage(card);
  };`
);

/**
 * Flow handlers.
 */
code = code.replace(
  /const handleValueContinue = \(\) => \{[\s\S]*?\n  \};/,
  `const handleValueContinue = () => {
    if (!selectedAmount) return;

    navigateTo(
      \`/\${selectedCountrySlug}/product/\${selectedProductCard.id}/recipient?amount=\${selectedAmount}\`
    );
  };`
);

code = code.replace(
  /const handleFinalCTA = \(\) => \{[\s\S]*?\n  \};/,
  `const handleFinalCTA = () => {
    if (!recipientReady) return;

    const amount = selectedAmountObject.value;

    if (recipientType === "myself") {
      navigateTo(
        \`/\${selectedCountrySlug}/product/\${selectedProductCard.id}/checkout?amount=\${amount}&type=myself\`
      );
      return;
    }

    navigateTo(
      \`/\${selectedCountrySlug}/product/\${selectedProductCard.id}/personalize/\${recipientType}?amount=\${amount}\${creatorQueryParam}\${recipientQueryParam}\`
    );
  };`
);

code = code.replace(
  /const handlePersonalizeContinue = \(\) => \{[\s\S]*?\n  \};/,
  `const handlePersonalizeContinue = () => {
    if (!personalizeCanContinue) return;

    navigateTo(
      \`/\${selectedCountrySlug}/product/\${selectedProductCard.id}/checkout?amount=\${selectedAmountObject.value}&type=\${recipientType}\${creatorQueryParam}\${recipientQueryParam}\${personalizeQueryParam}\`
    );
  };`
);

/**
 * Country change.
 */
code = code.replace(
  /const handleCountryChange = \(country: Country\) => \{[\s\S]*?\n  \};/,
  `const handleCountryChange = (country: Country) => {
    window.sessionStorage.setItem("giftCountryPillPending", country.code);
    setSelectedCountry(country);
    setCountryOpen(false);
    setRecipientPhone("");
    navigateTo(getCountryPath(country));
  };`
);

/**
 * Checkout personalization variables.
 */
if (!code.includes(`const selectedMediaLabel =`)) {
  code = code.replace(
    `const checkoutGiftMessage =`,
    `const selectedMediaLabel =
    personalizeMediaOn && mediaMode === "video"
      ? uploadedMediaName || "Uploaded MP3/MP4"
      : personalizeMediaOn && mediaMode === "gif"
      ? selectedMediaIndex !== null
        ? \`GIF selected #\${selectedMediaIndex + 1}\`
        : "GIF selected"
      : personalizeMediaOn && mediaMode === "card"
      ? selectedMediaIndex !== null
        ? mediaCards[selectedMediaIndex]
        : "Greeting card selected"
      : "";

  const hasCheckoutPersonalization =
    personalizeMediaOn || personalizeMessageOn;

  const checkoutGiftMessage =`
  );
}

/**
 * Add checkout personalization card.
 */
if (!code.includes(`checkout-personalization-card`)) {
  code = code.replace(
    `<div className="checkout-summary-note">
                      <span>✓</span>
                      <p>{checkoutGiftMessage}</p>
                    </div>`,
    `<div className="checkout-summary-note">
                      <span>✓</span>
                      <p>{checkoutGiftMessage}</p>
                    </div>

                    {hasCheckoutPersonalization && (
                      <div className="checkout-personalization-card">
                        <h4>Personalization added</h4>

                        {personalizeMediaOn && (
                          <div className="checkout-personalization-row">
                            <span>Media</span>
                            <strong>{selectedMediaLabel}</strong>
                          </div>
                        )}

                        {personalizeMessageOn && (
                          <div className="checkout-personalization-row">
                            <span>Message</span>
                            <strong>
                              {personalMessage.trim()
                                ? personalMessage.trim()
                                : "Personal message added"}
                            </strong>
                          </div>
                        )}
                      </div>
                    )}`
  );
}

/**
 * MP3 / MP4 upload support.
 */
code = code.replace(
  `accept=".mp3,.mp4,audio/mpeg,video/mp4"`,
  `accept=".mp3,.mp4,.mov,.m4a,audio/*,video/*"`
);

code = code.replace(
  `Keep your video or audio file under 30 seconds and
                            up to 300MB.`,
  `Add an MP3 or MP4. Keep your video or audio file under 30 seconds and
                            up to 300MB.`
);

/**
 * CSS.
 * This includes the slower smoother animation.
 */
const animationCss = `
        /* COUNTRY GREEN PILL VISIBILITY FIX */

        .country-toast,
        .country-update-toast,
        .country-change-toast,
        .country-toast-message,
        [class*="country-toast"],
        [class*="countryToast"],
        [class*="CountryToast"] {
          position: fixed !important;
          z-index: 99999 !important;
          pointer-events: none;
        }

        /* END COUNTRY GREEN PILL VISIBILITY FIX */

        /* SMOOTH ROUTE ANIMATION */

        .route-entering .page-content {
          animation: routePageEnter 580ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: opacity, transform;
        }

        .route-entering .checkout-page,
        .route-entering .personalize-page,
        .route-entering .recipient-page,
        .route-entering .linktree-smart-page,
        .route-entering .gift-browser-page {
          animation: routePanelEnter 580ms cubic-bezier(0.22, 1, 0.36, 1) both;
          will-change: opacity, transform;
        }

        @keyframes routePageEnter {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.992);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes routePanelEnter {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.992);
          }

          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .checkout-personalization-card {
          margin-top: 18px;
          border-radius: 20px;
          background: #ffffff;
          padding: 20px;
          box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.07);
        }

        .checkout-personalization-card h4 {
          margin: 0 0 14px 0;
          color: #000000;
          font-size: 18px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .checkout-personalization-row {
          display: grid;
          grid-template-columns: 90px 1fr;
          gap: 12px;
          align-items: start;
          padding-top: 12px;
          border-top: 1px solid #eeeeeb;
        }

        .checkout-personalization-row + .checkout-personalization-row {
          margin-top: 12px;
        }

        .checkout-personalization-row span {
          color: #777777;
          font-size: 14px;
          font-weight: 800;
        }

        .checkout-personalization-row strong {
          color: #111111;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.25;
          overflow-wrap: anywhere;
        }

        /* END SMOOTH ROUTE ANIMATION */
`;

if (code.includes(`/* SMOOTH ROUTE ANIMATION */`)) {
  code = code.replace(
    /\/\* COUNTRY GREEN PILL VISIBILITY FIX \*\/[\s\S]*?\/\* END SMOOTH ROUTE ANIMATION \*\//,
    animationCss.trim()
  );

  code = code.replace(
    /\/\* EXISTING COUNTRY BANNER VISIBILITY FIX \*\/[\s\S]*?\/\* END SMOOTH ROUTE ANIMATION \*\//,
    animationCss.trim()
  );

  code = code.replace(
    /\/\* SMOOTH ROUTE ANIMATION \*\/[\s\S]*?\/\* END SMOOTH ROUTE ANIMATION \*\//,
    animationCss.trim()
  );
} else if (code.includes(`/* END MOBILE HERO FIX */`)) {
  code = code.replace(
    `/* END MOBILE HERO FIX */`,
    `${animationCss}

        /* END MOBILE HERO FIX */`
  );
} else {
  code = code.replace(
    `      \`}</style>`,
    `${animationCss}
      \`}</style>`
  );
}

fs.writeFileSync(giftSitePath, code);

/**
 * Route files.
 */
fs.writeFileSync(
  appPagePath,
  `import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/home");
}
`
);

fs.writeFileSync(
  homePagePath,
  `import GiftSite from "@/components/GiftSite";

export default function HomePage() {
  return <GiftSite key="home-us" initialPage="home" initialCountryCode="US" />;
}
`
);

fs.writeFileSync(
  shopPagePath,
  `import GiftSite from "@/components/GiftSite";

export default function ShopPage() {
  return <GiftSite key="shop-us" initialPage="wall" initialCountryCode="US" />;
}
`
);

fs.writeFileSync(
  productPagePath,
  `import GiftSite from "@/components/GiftSite";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  return (
    <GiftSite
      key={\`us-product-\${id}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode="US"
    />
  );
}
`
);

fs.writeFileSync(
  recipientPagePath,
  `import GiftSite from "@/components/GiftSite";

type RecipientPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    amount?: string;
  }>;
};

export default async function RecipientPage({
  params,
  searchParams,
}: RecipientPageProps) {
  const { id } = await params;
  const { amount } = await searchParams;

  return (
    <GiftSite
      key={\`us-recipient-\${id}-\${amount ?? ""}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode="US"
      initialProductStep="recipient"
      initialAmount={amount ? Number(amount) : null}
    />
  );
}
`
);

fs.writeFileSync(
  personalizePagePath,
  `import GiftSite from "@/components/GiftSite";

type PersonalizePageProps = {
  params: Promise<{
    id: string;
    type: string;
  }>;
  searchParams: Promise<{
    amount?: string;
    creator?: string;
    name?: string;
    email?: string;
    phone?: string;
  }>;
};

export default async function PersonalizePage({
  params,
  searchParams,
}: PersonalizePageProps) {
  const { id, type } = await params;
  const { amount, creator, name, email, phone } = await searchParams;

  const recipientType =
    type === "creator" || type === "someone" || type === "myself"
      ? type
      : "someone";

  return (
    <GiftSite
      key={\`us-personalize-\${id}-\${recipientType}-\${amount ?? ""}-\${creator ?? ""}-\${email ?? ""}-\${phone ?? ""}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode="US"
      initialProductStep="personalize"
      initialRecipientType={recipientType}
      initialAmount={amount ? Number(amount) : null}
      initialCreatorHandle={creator}
      initialRecipientName={name}
      initialRecipientEmail={email}
      initialRecipientPhone={phone}
    />
  );
}
`
);

fs.writeFileSync(
  checkoutPagePath,
  `import GiftSite from "@/components/GiftSite";

type CheckoutPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    amount?: string;
    type?: string;
    creator?: string;
    name?: string;
    email?: string;
    phone?: string;
    media?: string;
    mediaMode?: "card" | "gif" | "video";
    mediaIndex?: string;
    upload?: string;
    message?: string;
    text?: string;
  }>;
};

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { id } = await params;
  const {
    amount,
    type,
    creator,
    name,
    email,
    phone,
    media,
    mediaMode,
    mediaIndex,
    upload,
    message,
    text,
  } = await searchParams;

  const recipientType =
    type === "creator" || type === "someone" || type === "myself"
      ? type
      : "someone";

  const safeMediaMode =
    mediaMode === "card" || mediaMode === "gif" || mediaMode === "video"
      ? mediaMode
      : "card";

  return (
    <GiftSite
      key={\`us-checkout-\${id}-\${recipientType}-\${amount ?? ""}-\${creator ?? ""}-\${email ?? ""}-\${phone ?? ""}-\${media ?? ""}-\${message ?? ""}-\${upload ?? ""}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode="US"
      initialProductStep="checkout"
      initialRecipientType={recipientType}
      initialAmount={amount ? Number(amount) : null}
      initialCreatorHandle={creator}
      initialRecipientName={name}
      initialRecipientEmail={email}
      initialRecipientPhone={phone}
      initialPersonalizeMediaOn={media === "1"}
      initialPersonalizeMessageOn={message === "1"}
      initialMediaMode={safeMediaMode}
      initialSelectedMediaIndex={mediaIndex ? Number(mediaIndex) : null}
      initialUploadedMediaName={upload ?? ""}
      initialPersonalMessage={text ?? ""}
    />
  );
}
`
);

fs.writeFileSync(
  countryHomePagePath,
  `import GiftSite from "@/components/GiftSite";

type CountryHomePageProps = {
  params: Promise<{
    country: string;
  }>;
};

export default async function CountryHomePage({ params }: CountryHomePageProps) {
  const { country } = await params;

  return (
    <GiftSite
      key={\`\${country}-home\`}
      initialPage="home"
      initialCountryCode={country}
    />
  );
}
`
);

fs.writeFileSync(
  countryShopPagePath,
  `import GiftSite from "@/components/GiftSite";

type CountryShopPageProps = {
  params: Promise<{
    country: string;
  }>;
};

export default async function CountryShopPage({ params }: CountryShopPageProps) {
  const { country } = await params;

  return (
    <GiftSite
      key={\`\${country}-shop\`}
      initialPage="wall"
      initialCountryCode={country}
    />
  );
}
`
);

fs.writeFileSync(
  countryProductPagePath,
  `import GiftSite from "@/components/GiftSite";

type CountryProductPageProps = {
  params: Promise<{
    country: string;
    id: string;
  }>;
};

export default async function CountryProductPage({
  params,
}: CountryProductPageProps) {
  const { country, id } = await params;

  return (
    <GiftSite
      key={\`\${country}-product-\${id}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode={country}
    />
  );
}
`
);

fs.writeFileSync(
  countryRecipientPagePath,
  `import GiftSite from "@/components/GiftSite";

type CountryRecipientPageProps = {
  params: Promise<{
    country: string;
    id: string;
  }>;
  searchParams: Promise<{
    amount?: string;
  }>;
};

export default async function CountryRecipientPage({
  params,
  searchParams,
}: CountryRecipientPageProps) {
  const { country, id } = await params;
  const { amount } = await searchParams;

  return (
    <GiftSite
      key={\`\${country}-recipient-\${id}-\${amount ?? ""}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode={country}
      initialProductStep="recipient"
      initialAmount={amount ? Number(amount) : null}
    />
  );
}
`
);

fs.writeFileSync(
  countryPersonalizePagePath,
  `import GiftSite from "@/components/GiftSite";

type CountryPersonalizePageProps = {
  params: Promise<{
    country: string;
    id: string;
    type: string;
  }>;
  searchParams: Promise<{
    amount?: string;
    creator?: string;
    name?: string;
    email?: string;
    phone?: string;
  }>;
};

export default async function CountryPersonalizePage({
  params,
  searchParams,
}: CountryPersonalizePageProps) {
  const { country, id, type } = await params;
  const { amount, creator, name, email, phone } = await searchParams;

  const recipientType =
    type === "creator" || type === "someone" || type === "myself"
      ? type
      : "someone";

  return (
    <GiftSite
      key={\`\${country}-personalize-\${id}-\${recipientType}-\${amount ?? ""}-\${creator ?? ""}-\${email ?? ""}-\${phone ?? ""}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode={country}
      initialProductStep="personalize"
      initialRecipientType={recipientType}
      initialAmount={amount ? Number(amount) : null}
      initialCreatorHandle={creator}
      initialRecipientName={name}
      initialRecipientEmail={email}
      initialRecipientPhone={phone}
    />
  );
}
`
);

fs.writeFileSync(
  countryCheckoutPagePath,
  `import GiftSite from "@/components/GiftSite";

type CountryCheckoutPageProps = {
  params: Promise<{
    country: string;
    id: string;
  }>;
  searchParams: Promise<{
    amount?: string;
    type?: string;
    creator?: string;
    name?: string;
    email?: string;
    phone?: string;
    media?: string;
    mediaMode?: "card" | "gif" | "video";
    mediaIndex?: string;
    upload?: string;
    message?: string;
    text?: string;
  }>;
};

export default async function CountryCheckoutPage({
  params,
  searchParams,
}: CountryCheckoutPageProps) {
  const { country, id } = await params;
  const {
    amount,
    type,
    creator,
    name,
    email,
    phone,
    media,
    mediaMode,
    mediaIndex,
    upload,
    message,
    text,
  } = await searchParams;

  const recipientType =
    type === "creator" || type === "someone" || type === "myself"
      ? type
      : "someone";

  const safeMediaMode =
    mediaMode === "card" || mediaMode === "gif" || mediaMode === "video"
      ? mediaMode
      : "card";

  return (
    <GiftSite
      key={\`\${country}-checkout-\${id}-\${recipientType}-\${amount ?? ""}-\${creator ?? ""}-\${email ?? ""}-\${phone ?? ""}-\${media ?? ""}-\${message ?? ""}-\${upload ?? ""}\`}
      initialPage="product"
      initialProductId={id}
      initialCountryCode={country}
      initialProductStep="checkout"
      initialRecipientType={recipientType}
      initialAmount={amount ? Number(amount) : null}
      initialCreatorHandle={creator}
      initialRecipientName={name}
      initialRecipientEmail={email}
      initialRecipientPhone={phone}
      initialPersonalizeMediaOn={media === "1"}
      initialPersonalizeMessageOn={message === "1"}
      initialMediaMode={safeMediaMode}
      initialSelectedMediaIndex={mediaIndex ? Number(mediaIndex) : null}
      initialUploadedMediaName={upload ?? ""}
      initialPersonalMessage={text ?? ""}
    />
  );
}
`
);

console.log("Done. Full upgrade applied.");
console.log(`Source used: ${sourcePath}`);
console.log("- / redirects to /home");
console.log("- /home");
console.log("- /shop");
console.log("- /product/[id]");
console.log("- /product/[id]/recipient");
console.log("- /product/[id]/personalize/[type]");
console.log("- /product/[id]/checkout");
console.log("- /[country]/home");
console.log("- /[country]/shop");
console.log("- /[country]/product/[id]");
console.log("- /[country]/product/[id]/recipient");
console.log("- /[country]/product/[id]/personalize/[type]");
console.log("- /[country]/product/[id]/checkout");
console.log("- smoother route animation baked in");
console.log("- existing green country pill after route render");
console.log("");
console.log("Now run:");
console.log("Control + C");
console.log("npm run dev");