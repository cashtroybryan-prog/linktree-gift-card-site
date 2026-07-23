"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type BrowserCard = {
  id: string;
  title: string;
  fullTitle: string;
  image: string;
  tileImage: string;
  category: string;
  isNew: boolean;
  description: string;
  checkoutProductId?: string;
};

const categoryImages = [
  { src: "/images/for-gamers.png", scale: 1.14 },
  { src: "/images/for-foodies.png", scale: 0.94 },
  { src: "/images/for-beauty-lovers.png", scale: 1.08 },
  { src: "/images/for-fitness-fans.png", scale: 0.94 },
  { src: "/images/for-last-minute.png", scale: 1 },
  { src: "/images/for-creators.png", scale: 0.94 },
  { src: "/images/for-friends.png", scale: 0.95 },
  { src: "/images/for-anyone.png", scale: 1.11 },
];

const categoryLabels = [
  "for gamers",
  "for foodies",
  "for beauty lovers",
  "for fitness fans",
  "for last-minute gifters",
  "for creators",
  "for friends",
  "for anyone",
];

const homepageGiftCards = [
  { id: "target", src: "/images/target.png" },
  { id: "uber", src: "/images/uber.png" },
  { id: "best-buy", src: "/images/best-buy.png" },
  { id: "ebay", src: "/images/ebay.png" },
  { id: "roblox", src: "/images/roblox.png" },
  { id: "playstation", src: "/images/playstation.png" },
  { id: "amc", src: "/images/amc-theatre.png" },
  { id: "american-eagle", src: "/images/american-eagle.png" },
  { id: "airbnb", src: "/images/airbnb.png" },
];

const defaultLinktreeProduct: BrowserCard = {
  id: "linktree",
  title: "Linktree Smart eGift...",
  fullTitle: "Linktree Smart eGift Card",
  image: "/images/linktree-smart-card-v2.png",
  tileImage: "/images/linktree-smart-card-v2.png",
  category: "Smart Cards",
  isNew: true,
  description:
    "The Linktree Smart Card is the ultimate swap card for modern gifting, giving recipients the freedom to choose from a range of top brands, creators, products and experiences all from one simple gift.",
};

const browserCards: BrowserCard[] = [
  defaultLinktreeProduct,
  {
    id: "uber",
    title: "Uber eGift Card",
    fullTitle: "Uber eGift Card",
    image: "/images/uber-v2.png",
    tileImage: "/images/uber-v2.png",
    category: "Food delivery",
    isNew: false,
    description:
      "Uber eGift Cards make everyday rides, food delivery, and last-minute plans easier, giving recipients flexible credit they can use across Uber and Uber Eats.",
  },
  {
    id: "amc",
    title: "AMC Theatres eGift...",
    fullTitle: "AMC Theatres eGift Card",
    image: "/images/amc-theatre-v2.png",
    tileImage: "/images/amc-theatre-v2.png",
    category: "Entertainment",
    isNew: false,
    description:
      "AMC Theatres eGift Cards are perfect for movie nights, new releases, popcorn runs, and shared entertainment moments on the big screen.",
  },
  {
    id: "target",
    title: "Target eGift Card",
    fullTitle: "Target eGift Card",
    image: "/images/target-v2.png",
    tileImage: "/images/target-v2.png",
    category: "Retail",
    isNew: false,
    description:
      "Target eGift Cards give recipients the freedom to shop everyday essentials, home finds, beauty, fashion, toys, tech, and more.",
  },
  {
    id: "best-buy",
    title: "Best Buy eGift Card",
    fullTitle: "Best Buy eGift Card",
    image: "/images/best-buy-v2.png",
    tileImage: "/images/best-buy-v2.png",
    category: "Retail",
    isNew: false,
    description:
      "Best Buy eGift Cards are perfect for tech, gaming, appliances, entertainment, accessories, and everyday electronics upgrades.",
  },
  {
    id: "ebay",
    title: "eBay eGift Card",
    fullTitle: "eBay eGift Card",
    image: "/images/ebay.png",
    tileImage: "/images/ebay.png",
    category: "Retail",
    isNew: false,
    description:
      "eBay eGift Cards give recipients access to millions of items, from tech and collectibles to fashion, home, hobbies, and hard-to-find gifts.",
  },
  {
    id: "roblox",
    title: "Roblox eGift Card",
    fullTitle: "Roblox eGift Card",
    image: "/images/roblox-v2.png",
    tileImage: "/images/roblox-v2.png",
    category: "Gaming",
    isNew: false,
    description:
      "Roblox eGift Cards let players unlock Robux, avatar items, game experiences, and premium digital fun across Roblox.",
  },
  {
    id: "american-eagle",
    title: "American Eagle eGift...",
    fullTitle: "American Eagle eGift Card",
    image: "/images/american-eagle-v2.png",
    tileImage: "/images/american-eagle-v2.png",
    category: "Fashion",
    isNew: false,
    description:
      "American Eagle eGift Cards are made for denim, everyday style, casual essentials, accessories, and easy fashion gifting.",
  },
  {
    id: "airbnb",
    title: "Airbnb eGift Card",
    fullTitle: "Airbnb eGift Card",
    image: "/images/airbnb-v2.png",
    tileImage: "/images/airbnb-v2.png",
    category: "Travel",
    isNew: false,
    description:
      "Airbnb eGift Cards help recipients book stays, getaways, experiences, and memorable trips almost anywhere.",
  },
  {
    id: "doordash",
    title: "DoorDash eGift Card",
    fullTitle: "DoorDash eGift Card",
    image: "/images/door-dash.png",
    tileImage: "/images/door-dash.png",
    category: "Food delivery",
    isNew: true,
    description:
      "DoorDash eGift Cards are made for easy meals, cravings, groceries, and convenience, delivered straight to the recipient’s door.",
  },
  {
    id: "instacart",
    title: "Instacart eGift Card",
    fullTitle: "Instacart eGift Card",
    image: "/images/instacart.png",
    tileImage: "/images/instacart.png",
    category: "Groceries",
    isNew: true,
    description:
      "Instacart eGift Cards help recipients stock up on groceries, household items, snacks, and everyday essentials from stores near them.",
  },
  {
    id: "cvs",
    title: "CVS Pharmacy eGift...",
    fullTitle: "CVS Pharmacy eGift Card",
    image: "/images/cvs-pharmacy.png",
    tileImage: "/images/cvs-pharmacy.png",
    category: "Health",
    isNew: true,
    description:
      "CVS Pharmacy eGift Cards are practical for wellness, pharmacy needs, personal care, beauty, snacks, and everyday health essentials.",
  },
  {
    id: "macys",
    title: "Macy’s eGift Card",
    fullTitle: "Macy’s eGift Card",
    image: "/images/macys.png",
    tileImage: "/images/macys.png",
    category: "Fashion",
    isNew: true,
    description:
      "Macy’s eGift Cards are ideal for fashion, beauty, home, accessories, and thoughtful gifts across a wide range of classic and modern brands.",
  },
  {
    id: "bath-body-works",
    title: "Bath & Body Works...",
    fullTitle: "Bath & Body Works eGift Card",
    image: "/images/bath-and-body.png",
    tileImage: "/images/bath-and-body.png",
    category: "Beauty",
    isNew: true,
    description:
      "Bath & Body Works eGift Cards are perfect for candles, body care, fragrance, self-care treats, and feel-good gifting moments.",
  },
  {
    id: "albertsons",
    title: "Albertsons eGift Card",
    fullTitle: "Albertsons eGift Card",
    image: "/images/albertsons.png",
    tileImage: "/images/albertsons.png",
    category: "Groceries",
    isNew: false,
    description:
      "Albertsons eGift Cards help recipients shop groceries, fresh food, pantry staples, household items, and everyday essentials.",
  },
  {
    id: "kroger",
    title: "Kroger eGift Card",
    fullTitle: "Kroger eGift Card",
    image: "/images/kroger.png",
    tileImage: "/images/kroger.png",
    category: "Groceries",
    isNew: false,
    description:
      "Kroger eGift Cards are useful for groceries, fresh produce, meals, household basics, and regular everyday shopping.",
  },
  {
    id: "playstation",
    title: "PlayStation eGift Card",
    fullTitle: "PlayStation eGift Card",
    image: "/images/playstation-v2.png",
    tileImage: "/images/playstation-v2.png",
    category: "Gaming",
    isNew: false,
    description:
      "PlayStation eGift Cards let gamers add funds for games, add-ons, subscriptions, movies, and digital entertainment from the PlayStation Store.",
  },
];

const targetMuscleChefProduct: BrowserCard = {
  id: "target-muscle-chef",
  title: "Target eGift Card",
  fullTitle: "Target eGift Card",
  image: "/images/target-muscle-chef-card.png",
  tileImage: "/images/target-muscle-chef-card.png",
  category: "Retail",
  isNew: false,
  checkoutProductId: "target",
  description:
    "Gift anyone a Target eGift Card inspired by one of my current fitness favorites, the My Muscle Chef Chipotle Chicken Burrito Bowl. They can use it on this pick or choose something else they’ll love at Target.",
};

const allProductCards: BrowserCard[] = [
  ...browserCards,
  targetMuscleChefProduct,
];


const browserCategories = [
  "Smart Cards",
  "Groceries",
  "Food delivery",
  "Fashion",
  "Retail",
  "Entertainment",
  "Gaming",
  "Travel",
  "Beauty",
  "Health",
];

const countries = [
  {
    code: "US",
    label: "United States",
    flag: "🇺🇸",
    currency: "US$",
    phoneLabel: "US phone number",
    phoneDigits: 10,
  },
  {
    code: "UK",
    label: "United Kingdom",
    flag: "🇬🇧",
    currency: "£",
    phoneLabel: "UK phone number",
    phoneDigits: 11,
  },
  {
    code: "AU",
    label: "Australia",
    flag: "🇦🇺",
    currency: "AU$",
    phoneLabel: "Australian phone number",
    phoneDigits: 10,
  },
  {
    code: "NZ",
    label: "New Zealand",
    flag: "🇳🇿",
    currency: "NZ$",
    phoneLabel: "New Zealand phone number",
    phoneDigits: 9,
  },
  {
    code: "CA",
    label: "Canada",
    flag: "🇨🇦",
    currency: "CA$",
    phoneLabel: "Canadian phone number",
    phoneDigits: 10,
  },
];

const creators = [
  {
    handle: "@selenagomez",
    subtitle: "Music, beauty, and creator drops",
    image: "/images/selena-gomez.png",
  },
  {
    handle: "@charlidamelio",
    subtitle: "Lifestyle, dance, and fan favourites",
    image: "/images/charli-d-amelio.png",
  },
  {
    handle: "@mrbeast",
    subtitle: "Creator merch, videos, and campaigns",
    image: "/images/mr-beast.png",
  },
  {
    handle: "@emmachamberlain",
    subtitle: "Coffee, style, and creator picks",
    image: "/images/emma-chamberlain.png",
  },
  {
    handle: "@dualipa",
    subtitle: "Music, merch, and exclusive moments",
    image: "/images/dua-lipa.png",
  },
  {
    handle: "@taylorswift",
    subtitle: "Music, eras, merch, and fan moments",
    image: "/images/taylor-swift.png",
  },
  {
    handle: "@billieeilish",
    subtitle: "Music, drops, and creator exclusives",
    image: "/images/billie-eilish.png",
  },
  {
    handle: "@kyliejenner",
    subtitle: "Beauty, lifestyle, and product drops",
    image: "/images/kylie-jenner.png",
  },
  {
    handle: "@khaby.lame",
    subtitle: "Comedy, creator content, and socials",
    image: "/images/khaby-lame.png",
  },
  {
    handle: "@addisonrae",
    subtitle: "Lifestyle, beauty, and creator picks",
    image: "/images/addison-rae.png",
  },
  {
    handle: "@oliviarodrigo",
    subtitle: "Music, merch, and fan gifting",
    image: "/images/olivia-rodrigo.png",
  },
  {
    handle: "@arianagrande",
    subtitle: "Music, beauty, and limited drops",
    image: "/images/ariana-grande.png",
  },
  {
    handle: "@ksi",
    subtitle: "Creator merch, music, and campaigns",
    image: "/images/ksi.png",
  },
  {
    handle: "@ninja",
    subtitle: "Gaming, streaming, and fan rewards",
    image: "/images/ninja.png",
  },
  {
    handle: "@pokimane",
    subtitle: "Gaming, creator drops, and community",
    image: "/images/poki.png",
  },
];

const targetMuscleChefCreator = {
  handle: "@cashtroy.bryan",
  subtitle: "",
  image: "",
};

const allCreators = [
  ...creators,
  targetMuscleChefCreator,
];

const mediaCards = [
  "Season’s Greetings",
  "Dream Big",
  "Root for each other",
  "No prob-llama",
  "Believe in magic",
  "Special delivery",
  "Taco bout a gift",
  "Shake it off",
];

const gifCards = ["🎁", "🐧", "💝", "✨", "🎉", "💌", "🌈", "🪄", "🥳"];

const amounts = [
  { value: 5, left: 715, top: 253.405, width: 154.614, height: 70.97 },
  { value: 10, left: 892.013, top: 253.405, width: 166.43, height: 71.19 },
  { value: 15, left: 1080.57, top: 253.405, width: 166.43, height: 71.19 },
  { value: 20, left: 715, top: 349.376, width: 166.43, height: 71.19 },
  { value: 25, left: 903.43, top: 349.376, width: 166.43, height: 71.19 },
  { value: 30, left: 1091.86, top: 349.376, width: 166.43, height: 71.19 },
  { value: 40, left: 717, top: 446, width: 166.43, height: 71.19 },
  { value: 50, left: 905.43, top: 446, width: 166.43, height: 71.19 },
  { value: 75, left: 1093.86, top: 446, width: 166.43, height: 71.19 },
  { value: 100, left: 717, top: 542, width: 186, height: 71 },
  { value: 150, left: 925, top: 542, width: 186, height: 71 },
  { value: 200, left: 1133, top: 542, width: 186, height: 71 },
  { value: 250, left: 717, top: 638, width: 186, height: 71 },
  { value: 300, left: 925, top: 638, width: 186, height: 71 },
  { value: 350, left: 1133, top: 638, width: 186, height: 71 },
  { value: 400, left: 717, top: 734, width: 186, height: 71 },
  { value: 500, left: 925, top: 734, width: 186, height: 71 },
];

type ActivePage = "home" | "wall" | "product" | "how" | "tracker";
type ProductStep = "value" | "recipient" | "personalize" | "checkout";
type RecipientType = "creator" | "someone" | "myself";
type Creator = (typeof creators)[number];
type MediaMode = "card" | "gif" | "video";
type Country = (typeof countries)[number];

type GiftSiteProps = {
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
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value.trim());
};

const getPhoneDigits = (value: string) => {
  return value.replace(/\D/g, "");
};

const isValidPhoneForCountry = (value: string, country: Country) => {
  const digits = getPhoneDigits(value);
  return digits.length === country.phoneDigits;
};

export default function GiftSite({
  initialPage = "home",
  initialCountryCode = "US",
  initialProductId,
  initialProductStep = "value",
initialRecipientType = "creator",
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

const [isSignedIn, setIsSignedIn] = useState(false);
const [authReady, setAuthReady] = useState(false);
const [isSigningOut, setIsSigningOut] = useState(false);

useEffect(() => {
  const supabase = createClient();
  let isMounted = true;

  const loadSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!isMounted) return;

    setIsSignedIn(Boolean(session));
    setAuthReady(true);
  };

  void loadSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!isMounted) return;

    setIsSignedIn(Boolean(session));
    setAuthReady(true);
  });

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);

  const navigateTo = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    if (!hasMountedRouteAnimationRef.current) {
      hasMountedRouteAnimationRef.current = true;
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.documentElement.classList.add("route-entering");
    });

    const timeout = window.setTimeout(() => {
      document.documentElement.classList.remove("route-entering");
    }, 260);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      document.documentElement.classList.remove("route-entering");
    };
  }, [pathname]);

  const initialProduct =
  allProductCards.find((card) => card.id === initialProductId) ??
  defaultLinktreeProduct;

const initialCreator =
  allCreators.find(
    (creator) => creator.handle === initialCreatorHandle
  ) ?? null;

  const initialCountry =
    countries.find(
      (country) =>
        country.code.toLowerCase() === initialCountryCode.toLowerCase()
    ) ?? countries[0];
  const scrollRef = useRef<HTMLElement | null>(null);
  const lastScrollTopRef = useRef(0);
  const mediaUploadRef = useRef<HTMLInputElement | null>(null);
  const countryToastTimerRef = useRef<number | null>(null);
  const categoryFilterRef = useRef<HTMLDivElement | null>(null);
  const featuredFilterRef = useRef<HTMLDivElement | null>(null);
  const countryAreaRef = useRef<HTMLDivElement | null>(null);

  const [currentWord, setCurrentWord] = useState(0);
  const [previousWord, setPreviousWord] = useState(0);
  const [isChangingWord, setIsChangingWord] = useState(false);

  const [navHidden, setNavHidden] = useState(false);
  const [disableNavTransition, setDisableNavTransition] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [activePage, setActivePage] = useState<ActivePage>(initialPage);
  const [backgroundPage, setBackgroundPage] = useState<ActivePage>(initialPage);
  const [pageTransitioning, setPageTransitioning] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrowserCardId, setSelectedBrowserCardId] = useState<
    string | null
  >(null);
  const [selectedProductCard, setSelectedProductCard] =
    useState<BrowserCard>(initialProduct);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState("Featured");

  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountry);
useEffect(() => {
  const countryFromPath = pathname?.split("/")[1]?.toUpperCase();

  const nextCountry =
    countries.find((country) => country.code === countryFromPath) ??
    countries.find(
      (country) =>
        country.code.toLowerCase() === initialCountryCode.toLowerCase()
    ) ??
    countries[0];

  setSelectedCountry(nextCountry);
}, [pathname, initialCountryCode]);

useEffect(() => {
  if (pathname.includes("/how-it-works")) {
    setActivePage("how");
    setBackgroundPage("how");
    return;
  }

  if (pathname.includes("/gift-tracker")) {
    setActivePage("tracker");
    setBackgroundPage("tracker");
    return;
  }

  if (pathname.includes("/shop")) {
    setActivePage("wall");
    setBackgroundPage("wall");
    return;
  }

  setActivePage(initialPage);
  setBackgroundPage(initialPage);
}, [pathname, initialPage]);
  const [countryToastVisible, setCountryToastVisible] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(
    initialAmount
  );
  const [productStep, setProductStep] =
    useState<ProductStep>(initialProductStep);
  const [recipientType, setRecipientType] =
    useState<RecipientType>(initialRecipientType);
  const [amountDropdownOpen, setAmountDropdownOpen] = useState(false);
const [creatorPickerOpen, setCreatorPickerOpen] = useState(
  initialRecipientType === "creator" && initialCreator === null
);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(
    initialCreator
  );

  const [recipientName, setRecipientName] = useState(initialRecipientName);
  const [recipientEmail, setRecipientEmail] = useState(initialRecipientEmail);
  const [recipientPhone, setRecipientPhone] = useState(initialRecipientPhone);

  const [personalizeMediaOn, setPersonalizeMediaOn] = useState(
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
  const [personalMessage, setPersonalMessage] = useState(initialPersonalMessage);

  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
  setSelectedProductCard(initialProduct);
  setProductStep(initialProductStep);
  setRecipientType(initialRecipientType);
  setSelectedAmount(initialAmount);
  setSelectedCreator(initialCreator);
  setRecipientName(initialRecipientName);
  setRecipientEmail(initialRecipientEmail);
  setRecipientPhone(initialRecipientPhone);
  setPersonalizeMediaOn(initialPersonalizeMediaOn);
  setPersonalizeMessageOn(initialPersonalizeMessageOn);
  setMediaMode(initialMediaMode);
  setSelectedMediaIndex(initialSelectedMediaIndex);
  setUploadedMediaName(initialUploadedMediaName);
  setPersonalMessage(initialPersonalMessage);
  setAmountDropdownOpen(false);
setCreatorPickerOpen(
  initialRecipientType === "creator" && initialCreator === null
);
  resetScroll();
}, [
  pathname,
  initialProductId,
  initialProductStep,
  initialRecipientType,
  initialAmount,
  initialCreatorHandle,
  initialRecipientName,
  initialRecipientEmail,
  initialRecipientPhone,
  initialPersonalizeMediaOn,
  initialPersonalizeMessageOn,
  initialMediaMode,
  initialSelectedMediaIndex,
  initialUploadedMediaName,
  initialPersonalMessage,
]);

  const formatAmount = (value: number) => {
    return `${selectedCountry.currency}${value.toFixed(2)}`;
  };

  const formatCompactAmount = (value: number) => {
    return `${selectedCountry.currency}${value}`;
  };

  const giftCardRange = `${formatCompactAmount(5)} - ${formatCompactAmount(
    500
  )}`;

  const selectedCountrySlug = selectedCountry.code.toLowerCase();

const homePath = `/${selectedCountrySlug}/home`;
const shopPath = `/${selectedCountrySlug}/shop`;
const howPath = `/${selectedCountrySlug}/how-it-works`;
const trackerPath = `/${selectedCountrySlug}/gift-tracker`;
const loginPath = `/${selectedCountrySlug}/login`;
const signupPath = `/${selectedCountrySlug}/signup`;
const walletPath = `/${selectedCountrySlug}/wallet`;


 const getCountryPath = (country: Country) => {
  const countrySlug = country.code.toLowerCase();
  const amount = selectedAmountObject?.value ?? selectedAmount ?? "";

  if (pathname.includes("/how-it-works")) {
    return `/${countrySlug}/how-it-works`;
  }

  if (pathname.includes("/gift-tracker")) {
    return `/${countrySlug}/gift-tracker`;
  }

  if (pathname.includes("/shop") || activePage === "wall") {
    return `/${countrySlug}/shop`;
  }

  if (pathname.includes("/home") || activePage === "home") {
    return `/${countrySlug}/home`;
  }

  if (activePage === "how") {
    return `/${countrySlug}/how-it-works`;
  }

  if (activePage === "tracker") {
    return `/${countrySlug}/gift-tracker`;
  }

  if (productStep === "recipient") {
    return `/${countrySlug}/product/${selectedProductCard.id}/recipient${
      amount ? `?amount=${amount}` : ""
    }`;
  }

  if (productStep === "personalize") {
    return `/${countrySlug}/product/${selectedProductCard.id}/personalize/${recipientType}${
      amount
        ? `?amount=${amount}${creatorQueryParam ?? ""}${
            recipientQueryParam ?? ""
          }`
        : ""
    }`;
  }

  if (productStep === "checkout") {
    return `/${countrySlug}/product/${selectedProductCard.id}/checkout${
      amount
        ? `?amount=${amount}&type=${recipientType}${creatorQueryParam ?? ""}${
            recipientQueryParam ?? ""
          }${personalizeQueryParam ?? ""}`
        : ""
    }`;
  }

  return `/${countrySlug}/product/${selectedProductCard.id}`;
};

  const productHeroImage = selectedProductCard.image;
  const checkoutProductImage = selectedProductCard.image;
  const productTitle = selectedProductCard.fullTitle;
  const productDescription = selectedProductCard.description;

  const categoryButtonLabel =
    selectedCategories.length === 0
      ? "Browse by category"
      : selectedCategories.length === 1
      ? selectedCategories[0]
      : `${selectedCategories.length} categories`;

  const visibleBrowserCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let cards = browserCards.filter((card) => {
      const matchesSearch = query
        ? card.fullTitle.toLowerCase().includes(query)
        : true;

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(card.category);

      return matchesSearch && matchesCategory;
    });

    if (sortMode === "A-Z") {
      cards = [...cards].sort((a, b) => a.fullTitle.localeCompare(b.fullTitle));
    }

    if (sortMode === "Z-A") {
      cards = [...cards].sort((a, b) => b.fullTitle.localeCompare(a.fullTitle));
    }

    if (sortMode === "New Arrivals") {
      cards = [...cards].sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }

    return cards;
  }, [searchQuery, selectedCategories, sortMode]);

  const availableCreators =
  selectedProductCard.id === "target-muscle-chef"
    ? [targetMuscleChefCreator]
    : creators;
  
  const selectedAmountObject =
    amounts.find((amount) => amount.value === selectedAmount) ??
    amounts[amounts.length - 1];

  const selectedAmountLabel = formatAmount(selectedAmountObject.value);
  const selectedCompactAmountLabel = formatCompactAmount(
    selectedAmountObject.value
  );

  const checkoutEmailTouched = checkoutEmail.trim().length > 0;
  const checkoutReady = isValidEmail(checkoutEmail);

  const creatorReady = recipientType !== "creator" || selectedCreator !== null;

  const recipientEmailTouched = recipientEmail.trim().length > 0;
  const recipientPhoneTouched = recipientPhone.trim().length > 0;
  const recipientEmailValid = isValidEmail(recipientEmail);
  const recipientPhoneValid = isValidPhoneForCountry(
    recipientPhone,
    selectedCountry
  );

  const someoneElseReady =
    recipientType !== "someone" || recipientEmailValid || recipientPhoneValid;

  const recipientReady = creatorReady && someoneElseReady;

  const mediaHasSelection =
    mediaMode === "video"
      ? uploadedMediaName.trim().length > 0
      : selectedMediaIndex !== null;

  const messageHasSelection = personalMessage.trim().length > 0;

  const personalizeHasAnyToggle = personalizeMediaOn || personalizeMessageOn;

  const personalizeCanContinue =
    !personalizeHasAnyToggle ||
    ((personalizeMediaOn ? mediaHasSelection : true) &&
      (personalizeMessageOn ? messageHasSelection : true));

  const personalizeButtonIsLime =
    !personalizeHasAnyToggle || personalizeCanContinue;

  const giftDestination =
    recipientType === "creator" && selectedCreator
      ? selectedCreator.handle
      : recipientType === "someone"
      ? recipientEmailValid
        ? recipientEmail.trim()
        : recipientPhoneValid
        ? recipientPhone.trim()
        : "the recipient"
      : checkoutEmail.trim() || "Your email";

  const creatorQueryParam =
    selectedCreator && recipientType === "creator"
      ? `&creator=${encodeURIComponent(selectedCreator.handle)}`
      : "";

  const recipientQueryParam =
    recipientType === "someone"
      ? `${recipientName.trim() ? `&name=${encodeURIComponent(recipientName.trim())}` : ""}${recipientEmail.trim() ? `&email=${encodeURIComponent(recipientEmail.trim())}` : ""}${recipientPhone.trim() ? `&phone=${encodeURIComponent(recipientPhone.trim())}` : ""}`
      : "";

  const personalizeQueryParam =
    `${personalizeMediaOn ? `&media=1&mediaMode=${encodeURIComponent(mediaMode)}` : ""}${personalizeMediaOn && selectedMediaIndex !== null ? `&mediaIndex=${selectedMediaIndex}` : ""}${personalizeMediaOn && uploadedMediaName.trim() ? `&upload=${encodeURIComponent(uploadedMediaName.trim())}` : ""}${personalizeMessageOn ? `&message=1` : ""}${personalizeMessageOn && personalMessage.trim() ? `&text=${encodeURIComponent(personalMessage.trim())}` : ""}`;

  const selectedMediaLabel =
    personalizeMediaOn && mediaMode === "video"
      ? uploadedMediaName || "Uploaded MP3/MP4"
      : personalizeMediaOn && mediaMode === "gif"
      ? selectedMediaIndex !== null
        ? `GIF selected #${selectedMediaIndex + 1}`
        : "GIF selected"
      : personalizeMediaOn && mediaMode === "card"
      ? selectedMediaIndex !== null
        ? mediaCards[selectedMediaIndex]
        : "Greeting card selected"
      : "";

  const hasCheckoutPersonalization =
    personalizeMediaOn || personalizeMessageOn;

  const checkoutGiftMessage =
    recipientType === "creator" && selectedCreator
      ? `Your ${productTitle} will be sent straight to ${selectedCreator.handle}. Receipt will be sent to ${
          checkoutEmail.trim() || "your email"
        }.`
      : recipientType === "someone"
      ? `Your ${productTitle} will be sent to ${giftDestination}. Receipt will be sent to ${
          checkoutEmail.trim() || "your email"
        }.`
      : `Your ${productTitle} and receipt will be sent to ${
          checkoutEmail.trim() || "your email"
        } after checkout.`;

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousWord(currentWord);
      setCurrentWord((prev) => (prev + 1) % categoryImages.length);
      setIsChangingWord(true);

      setTimeout(() => {
        setIsChangingWord(false);
      }, 700);
    }, 2200);

    return () => clearInterval(interval);
  }, [currentWord]);

  useEffect(() => {
    const preloadImages = [
      "/images/starting-page.png",
      "/images/linktree-logo.png",
      "/images/woc-banner.png",
      "/images/search-bar.png",
      "/images/drop-down.png",
      "/images/apple-pay-white.png",
      "/images/google-pay-white.png",
      "/images/last-page.png",
      "/images/final-look-3-page.png",
      ...browserCards.map((card) => card.image),
      ...browserCards.map((card) => card.tileImage),
    ];

    preloadImages.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        categoryOpen &&
        categoryFilterRef.current &&
        !categoryFilterRef.current.contains(target)
      ) {
        setCategoryOpen(false);
      }

      if (
        featuredOpen &&
        featuredFilterRef.current &&
        !featuredFilterRef.current.contains(target)
      ) {
        setFeaturedOpen(false);
      }

      if (
        countryOpen &&
        countryAreaRef.current &&
        !countryAreaRef.current.contains(target)
      ) {
        setCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [categoryOpen, featuredOpen, countryOpen]);

  useEffect(() => {
    if (!selectedAmount || activePage !== "product" || productStep !== "value") {
      return;
    }

    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: 330,
        behavior: "smooth",
      });
    }, 140);

    return () => clearTimeout(timeout);
  }, [selectedAmount, activePage, productStep]);

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const scrollTop = scrollElement.scrollTop;
    const previousScrollTop = lastScrollTopRef.current;

    if (scrollTop < previousScrollTop) {
      setNavHidden(false);
    }

    if (scrollTop > previousScrollTop && scrollTop > 260) {
      setNavHidden(true);
    }

    if (scrollTop < 20) {
      setNavHidden(false);
    }

    lastScrollTopRef.current = scrollTop;
  };

  const resetScroll = () => {
    lastScrollTopRef.current = 0;

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  const resetWallOfCards = () => {
    setSearchQuery("");
    setSelectedBrowserCardId(null);
    setCategoryOpen(false);
    setFeaturedOpen(false);
    setSelectedCategories([]);
    setSortMode("Featured");
  };

  const resetCheckout = () => {
    setCheckoutEmail("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardName("");
  };

  const resetPersonalize = () => {
    setPersonalizeMediaOn(false);
    setPersonalizeMessageOn(false);
    setMediaMode("card");
    setSelectedMediaIndex(null);
    setUploadedMediaName("");
    setPersonalMessage("");

    if (mediaUploadRef.current) {
      mediaUploadRef.current.value = "";
    }
  };

  const resetProductFlow = () => {
    setSelectedAmount(null);
    setProductStep("value");
setRecipientType("creator");
    setAmountDropdownOpen(false);
    setCreatorPickerOpen(false);
    setSelectedCreator(null);
    setRecipientName("");
    setRecipientEmail("");
    setRecipientPhone("");
    resetPersonalize();
    resetCheckout();
  };

const triggerCountryToast = (country: Country = selectedCountry) => {
  if (countryToastTimerRef.current) {
    window.clearTimeout(countryToastTimerRef.current);
  }

  setCountryToastVisible(false);

  const existingToast = document.querySelector(".country-change-toast");
  existingToast?.remove();

  const toast = document.createElement("div");
  toast.className = "country-change-toast";
  toast.textContent = `Updated to ${country.label} ${country.flag}`;
  document.body.appendChild(toast);

  countryToastTimerRef.current = window.setTimeout(() => {
    toast.remove();
  }, 1600);
};

  const transitionToPage = (page: ActivePage) => {
    setNavHidden(false);
    setDisableNavTransition(true);
    setCountryOpen(false);
    setCategoryOpen(false);
    setFeaturedOpen(false);

    if (page !== "wall") {
      resetWallOfCards();
    }

    if (page !== "product") {
      resetProductFlow();
    }

    setBackgroundPage(page);
    setPageTransitioning(true);

    setTimeout(() => {
      setActivePage(page);
      resetScroll();

      requestAnimationFrame(() => {
        setPageTransitioning(false);
      });
    }, 260);

    setTimeout(() => {
      setDisableNavTransition(false);
    }, 420);
  };

  const goToWallOfCards = () => {
    navigateTo(shopPath);
  };

const goToHowItWorks = () => {
  navigateTo(howPath);
};

const goToGiftTracker = () => {
  navigateTo(trackerPath);
};

  const goToProductPage = (card: BrowserCard = defaultLinktreeProduct) => {
    setSelectedProductCard(card);
    resetProductFlow();
    navigateTo(`/${selectedCountrySlug}/product/${card.id}`);
  };

  const goHome = () => {
    navigateTo(homePath);
  };
const handleSignOut = async () => {
  if (isSigningOut) return;

  setIsSigningOut(true);
  setMobileMenuOpen(false);

  const supabase = createClient();

  const [{ error }] = await Promise.all([
    supabase.auth.signOut(),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, 900);
    }),
  ]);

  if (error) {
    console.error("Sign out failed:", error);
    setIsSigningOut(false);
    alert("Could not sign you out. Please try again.");
    return;
  }

  setIsSignedIn(false);

  router.push(homePath);
  router.refresh();

  window.setTimeout(() => {
    setIsSigningOut(false);
  }, 250);
};
  const handleBrowserCardClick = (card: BrowserCard) => {
    goToProductPage(card);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((item) => item !== category);
      }

      return [...prev, category];
    });
  };

const handleCountryChange = (country: Country) => {
  const countrySlug = country.code.toLowerCase();
  const currentPath = pathname || `/${selectedCountrySlug}/home`;
  const currentQuery =
    typeof window !== "undefined" ? window.location.search : "";

  const nextPath = currentPath.match(/^\/[a-z]{2}(\/|$)/i)
    ? currentPath.replace(/^\/[a-z]{2}/i, `/${countrySlug}`)
    : getCountryPath(country);

  setSelectedCountry(country);
  setCountryOpen(false);
  setRecipientPhone("");
  router.push(`${nextPath}${currentQuery}`);

  window.setTimeout(() => {
    triggerCountryToast(country);
  }, 200);
};

const handleValueContinue = () => {
  if (!selectedAmount) return;

  navigateTo(
    `/${selectedCountrySlug}/product/${selectedProductCard.id}/recipient?amount=${selectedAmount}`
  );
};

  const handleRecipientTypeChange = (type: RecipientType) => {
    setRecipientType(type);
    setAmountDropdownOpen(false);

    if (type === "creator") {
      setCreatorPickerOpen(true);
      return;
    }

    setCreatorPickerOpen(false);
  };

const handleRecipientBack = () => {
  resetProductFlow();
  navigateTo(`/${selectedCountrySlug}/product/${selectedProductCard.id}`);
};

const handleFinalCTA = async () => {
  if (!recipientReady) return;

  const amount = selectedAmountObject.value;

  if (recipientType === "myself") {
    if (authReady && isSignedIn) {
      await handleCheckoutSubmit();
      return;
    }

    navigateTo(
      `/${selectedCountrySlug}/product/${selectedProductCard.id}/checkout?amount=${amount}&type=myself`
    );
    return;
  }

  navigateTo(
    `/${selectedCountrySlug}/product/${selectedProductCard.id}/personalize/${recipientType}?amount=${amount}${creatorQueryParam}${recipientQueryParam}`
  );
};

  const handlePersonalizeContinue = () => {
    if (!personalizeCanContinue) return;

    navigateTo(
      `/${selectedCountrySlug}/product/${selectedProductCard.id}/checkout?amount=${selectedAmountObject.value}&type=${recipientType}${creatorQueryParam}${recipientQueryParam}${personalizeQueryParam}`
    );
  };

  const isCheckoutView =
  activePage === "product" && productStep === "checkout";
async function handleCheckoutSubmit() {
  const canSubmit =
    checkoutReady ||
    (recipientType === "myself" && authReady && isSignedIn);

  if (!canSubmit) return;

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  returnUrl: window.location.href,
  successUrl: `${window.location.origin}/${selectedCountrySlug}/thank-you`,
  checkoutEmail,
        amount: selectedAmountObject.value,
        currency:
          selectedCountry.code === "UK"
            ? "gbp"
            : selectedCountry.code === "AU"
              ? "aud"
              : selectedCountry.code === "NZ"
                ? "nzd"
                : selectedCountry.code === "CA"
                  ? "cad"
                  : "usd",
        country: selectedCountry.label,
        countryCode: selectedCountrySlug,
productId:
  selectedProductCard.checkoutProductId ??
  selectedProductCard.id,
productTitle: selectedProductCard.fullTitle,
        recipientType,
        recipientName,
        recipientEmail,
        recipientPhone,
        creatorHandle: selectedCreator?.handle ?? "",
        personalMessage,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      console.error("Checkout error:", data.error);
      alert("Could not start checkout.");
      return;
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("Checkout submit failed:", error);
    alert("Something went wrong starting checkout.");
  }
}

  return (
<main
  ref={scrollRef}
  onScroll={handleScroll}
  className={`main-shell w-full overflow-x-hidden ${
    isCheckoutView
      ? "checkout-shell"
      : "h-screen overflow-y-scroll"
  } ${
    backgroundPage === "home"
      ? "bg-[#cbea19]"
      : backgroundPage === "how"
        ? "bg-[#870019]"
        : "bg-[#f3f3f1]"
  }`}
>

{isSigningOut && (
  <div
    className="signout-loading-overlay"
    role="status"
    aria-live="polite"
  >
    <div className="signout-loading-content">
      <div
        className="signout-loading-spinner"
        aria-hidden="true"
      />

      <p>Signing out...</p>
    </div>
  </div>
)}

      {activePage !== "product" && (
        <header
          className={`linktree-nav-shell ${navHidden ? "nav-hidden" : ""} ${
            disableNavTransition ? "nav-no-transition" : ""
          }`}
        >
          <nav className="linktree-nav" aria-label="Main navigation">
          <button
  type="button"
  className={`mobile-menu-button ${mobileMenuOpen ? "is-open" : ""}`}
  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
  aria-expanded={mobileMenuOpen}
  onClick={() => {
    setCountryOpen(false);
    setMobileMenuOpen((previous) => !previous);
  }}
>
  <span />
  <span />
  <span />
</button>

{mobileMenuOpen && (
  <div className="mobile-nav-menu">
    <button
      type="button"
      onClick={() => {
        setMobileMenuOpen(false);
        goToHowItWorks();
      }}
    >
      How it Works
    </button>

    <button
      type="button"
      onClick={() => {
        setMobileMenuOpen(false);
        goToGiftTracker();
      }}
    >
      Gift Tracker
    </button>

{authReady &&
  (isSignedIn ? (
    <>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
      >
        Sign out
      </button>

      <button
        type="button"
        className="mobile-signup-menu-button"
        onClick={() => {
          setMobileMenuOpen(false);
          navigateTo(walletPath);
        }}
      >
        View Wallet
      </button>
    </>
          ) : (
        <>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo(loginPath);
            }}
          >
            Log in
          </button>

          <button
            type="button"
            className="mobile-signup-menu-button"
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo(signupPath);
            }}
          >
            Sign up free
          </button>
        </>
      ))}
  </div>
)}
<a
  className="linktree-logo-link"
  href={homePath}
  onClick={(event) => {
    event.preventDefault();
    goHome();
  }}
  aria-label="Go home"
>
<img
  className="linktree-logo"
  src="/images/linktree-logo.png"
  alt="Linktree"
/>

<img
  className="linktree-mobile-logo"
  src="/images/linktree-icon.png"
  alt=""
  aria-hidden="true"
  draggable={false}
/>
</a>

<a
  className="linktree-nav-item shop-link"
  href={shopPath}
  onClick={(event) => {
    event.preventDefault();
    goToWallOfCards();
  }}
>
  Shop Gift Cards
</a>

<a
  className="linktree-nav-item how-link"
  href={howPath}
  onClick={(event) => {
    event.preventDefault();
    goToHowItWorks();
  }}
>
  How it Works
</a>

<a
  className="linktree-nav-item tracker-link"
  href={trackerPath}
  onClick={(event) => {
    event.preventDefault();
    goToGiftTracker();
  }}
>
  Gift Tracker
</a>

            <div className="country-area" ref={countryAreaRef}>
              <button
                type="button"
                className="country-pill"
                onClick={() => {
  setMobileMenuOpen(false);
  setCountryOpen((prev) => !prev);
}}
              >
                You are currently shopping in {selectedCountry.label}{" "}
                {selectedCountry.flag}
              </button>

              {countryOpen && (
                <div className="country-menu">
                  {countries.map((country) => (
                    <button
                      type="button"
                      key={country.code}
                      className={
                        selectedCountry.code === country.code ? "is-active" : ""
                      }
                      onClick={() => handleCountryChange(country)}
                    >
                      <span>{country.label}</span>
                      <span>{country.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

{authReady &&
  (isSignedIn ? (
<>
<button
  className="login-button"
  type="button"
  onClick={handleSignOut}
  disabled={isSigningOut}
>
  Sign out
</button>

  <button
    className="signup-button"
    type="button"
    onClick={() => navigateTo(walletPath)}
  >
    View Wallet
  </button>
</>
  ) : (
    <>
      <button
        className="login-button"
        type="button"
        onClick={() => navigateTo(loginPath)}
      >
        Log in
      </button>

      <button
        className="signup-button"
        type="button"
        onClick={() => navigateTo(signupPath)}
      >
        Sign up free
      </button>
    </>
  ))}
            </nav>
        </header>
      )}

<div
  className={`page-content ${
    isCheckoutView ? "checkout-content" : ""
  } ${
    pageTransitioning ? "page-content-changing" : ""
  }`}
>
        {activePage === "product" ? (
          productStep === "checkout" ? (
            <main className="checkout-page">
              <section className="checkout-header">
<button
  type="button"
  onClick={() => {
    const amount = selectedAmountObject.value;

    if (recipientType === "myself") {
      navigateTo(
        `/${selectedCountrySlug}/product/${selectedProductCard.id}/recipient?amount=${amount}`
      );
      return;
    }

    navigateTo(
      `/${selectedCountrySlug}/product/${selectedProductCard.id}/personalize/${recipientType}?amount=${amount}${creatorQueryParam}${recipientQueryParam}`
    );
  }}
  className="checkout-back-button"
>
  ← Back
</button>

<a
  href={shopPath}
  onClick={(event) => {
    event.preventDefault();
    goToWallOfCards();
  }}
  className="checkout-close-button"
  aria-label="Close and return to wall of cards"
>
  ×
</a>

                <div className="checkout-logo-wrap">
                  <img
                    src="/images/linktree-logo.png"
                    alt="Linktree"
                    draggable={false}
                    className="checkout-logo-image"
                  />
                </div>
              </section>

              <section className="checkout-frame">
                <div className="checkout-form-side">
                  <div className="checkout-section checkout-contact-section">
                    <h2>Contact</h2>

<label className="checkout-input-wrap">
  <span>
    {recipientType === "myself"
      ? "Email for gift card and receipt"
      : "Email for receipt"}
  </span>

<input
  value={checkoutEmail ?? ""}
  onChange={(event) => {
    setCheckoutEmail(event.currentTarget.value);
  }}
  type="email"
  inputMode="email"
  autoComplete="email"
  enterKeyHint="done"
  spellCheck={false}
  autoCapitalize="none"
  placeholder={
    recipientType === "myself"
      ? "Email for gift card and receipt"
      : "Email for receipt"
  }
  required
/>
</label>

                    {!checkoutReady && (
                      <p className="checkout-required-note">
                        {checkoutEmailTouched
                          ? "Enter a valid email like name@example.com."
                          : recipientType === "myself"
                          ? "Email is required for the gift card to be sent and for the receipt."
                          : "Email is required for your receipt."}
                      </p>
                    )}

                    <label className="checkout-checkbox">
                      <input type="checkbox" defaultChecked />
                      <span>Email me with news and offers</span>
                    </label>
                  </div>

<div className="checkout-section checkout-review-section">
  <h2>Order summary</h2>
  <p className="checkout-muted">
    Review your gift details before continuing to payment.
  </p>

  <div className="checkout-review-card">
    <div className="checkout-review-row">
      <span>Gift card</span>
      <strong>{productTitle}</strong>
    </div>

    <div className="checkout-review-row">
      <span>Gift value</span>
      <strong>{selectedAmountLabel}</strong>
    </div>

    <div className="checkout-review-row">
      <span>Delivery</span>
      <strong>{giftDestination}</strong>
    </div>

    <div className="checkout-review-row">
      <span>Receipt</span>
      <strong>{checkoutEmail.trim() || "Your email"}</strong>
    </div>
  </div>

  <div className="checkout-review-stripe-note">
    <span>✓</span>
    <p>Your payment is secure and encrypted on the next screen.</p>
  </div>
</div>

                  <button
                    type="button"
                    className={`checkout-pay-button ${
                      checkoutReady ? "is-ready" : ""
                    }`}
                    onClick={handleCheckoutSubmit}
                    disabled={!checkoutReady}
                  >
                    Pay {selectedAmountLabel}
                  </button>
                </div>

                <aside className="checkout-summary-side">
                  <div className="checkout-summary-card">
                    <div className="checkout-product-row">
                      <div className="checkout-product-thumb">
                        <img
                          src={checkoutProductImage}
                          alt={productTitle}
                          draggable={false}
                        />
                      </div>

                      <div className="checkout-product-copy">
                        <h3>{productTitle}</h3>
                        <p>{selectedCompactAmountLabel}-digital</p>
                      </div>

                      <div className="checkout-product-price">
                        {selectedAmountLabel}
                      </div>
                    </div>

                    <div className="checkout-discount-row">
                      <input placeholder="Discount code" />
                      <button type="button">Apply</button>
                    </div>

                    <div className="checkout-total-row">
                      <span>Total</span>
                      <strong>{selectedAmountLabel}</strong>
                    </div>

                    <div className="checkout-summary-note">
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
                    )}
                  </div>
                </aside>
              </section>
            </main>
          ) : productStep === "personalize" ? (
            <main className="personalize-page">
              <section className="personalize-frame">
<button
  type="button"
  onClick={() => {
    const amount = selectedAmountObject.value;

    setProductStep("recipient");

    navigateTo(
      `/${selectedCountrySlug}/product/${selectedProductCard.id}/recipient?amount=${amount}&type=${recipientType}${creatorQueryParam}${recipientQueryParam}`
    );

    setTimeout(() => resetScroll(), 20);
  }}
  className="personalize-back-button"
>
  ← Back
</button>

<a
  href={shopPath}
  onClick={(event) => {
    event.preventDefault();
    goToWallOfCards();
  }}
  className="personalize-close-button"
  aria-label="Close and return to wall of cards"
>
  ×
</a>

                <div className="personalize-card">
                  <h1>Personalize</h1>
                  <p className="personalize-subtitle">
                    Add a personal touch to your gift.
                  </p>

                  <div className="personalize-option">
                    <div>
                      <h2>Add gift media</h2>
                      <p>
                        Add a greeting card, GIF, or video to make it feel more
                        personal.
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`personalize-toggle ${
                        personalizeMediaOn ? "is-on" : ""
                      }`}
                      onClick={() => setPersonalizeMediaOn((prev) => !prev)}
                      aria-label="Toggle gift media"
                    >
                      <span />
                    </button>
                  </div>

                  {personalizeMediaOn && (
                    <div className="personalize-media-panel">
                      <div className="personalize-tabs">
                        <button
                          type="button"
                          className={mediaMode === "card" ? "is-active" : ""}
                          onClick={() => {
                            setMediaMode("card");
                            setUploadedMediaName("");
                          }}
                        >
                          Greeting card
                        </button>

                        <button
                          type="button"
                          className={mediaMode === "gif" ? "is-active" : ""}
                          onClick={() => {
                            setMediaMode("gif");
                            setUploadedMediaName("");
                          }}
                        >
                          GIF
                        </button>

                        <button
                          type="button"
                          className={mediaMode === "video" ? "is-active" : ""}
                          onClick={() => {
                            setMediaMode("video");
                            setSelectedMediaIndex(null);
                          }}
                        >
                          Video
                        </button>
                      </div>

                      {mediaMode === "card" && (
                        <div className="media-card-grid">
                          {mediaCards.map((label, index) => (
                            <button
                              type="button"
                              key={label}
                              className={`media-card-tile media-card-${index} ${
                                selectedMediaIndex === index ? "is-selected" : ""
                              }`}
                              onClick={() => setSelectedMediaIndex(index)}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      )}

                      {mediaMode === "gif" && (
                        <>
                          <div className="gif-search">
                            <span>⌕</span>
                            <input placeholder="Search GIPHY" />
                          </div>

                          <div className="gif-grid">
                            {gifCards.map((gif, index) => (
                              <button
                                type="button"
                                key={`${gif}-${index}`}
                                className={`gif-tile ${
                                  selectedMediaIndex === index
                                    ? "is-selected"
                                    : ""
                                }`}
                                onClick={() => setSelectedMediaIndex(index)}
                              >
                                {gif}
                              </button>
                            ))}
                          </div>

                          <div className="giphy-footer">
                            POWERED BY <strong>GIPHY</strong>
                          </div>
                        </>
                      )}

                      {mediaMode === "video" && (
                        <div className="video-upload-panel">
                          <p>
                            Add an MP3 or MP4. Keep your video or audio file under 30 seconds and
                            up to 300MB.
                          </p>

                          <input
                            ref={mediaUploadRef}
                            type="file"
                            accept=".mp3,.mp4,.mov,.m4a,audio/*,video/*"
                            className="media-file-input"
                            onChange={(event) => {
                              const file = event.target.files?.[0];

                              if (!file) {
                                setUploadedMediaName("");
                                return;
                              }

                              setUploadedMediaName(file.name);
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => mediaUploadRef.current?.click()}
                            className={
                              uploadedMediaName ? "has-uploaded-file" : ""
                            }
                          >
                            {uploadedMediaName
                              ? `Selected: ${uploadedMediaName}`
                              : "Upload MP3 or MP4"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="personalize-divider" />

                  <div className="personalize-option">
                    <div>
                      <h2>Write a personal message</h2>
                      <p>Add a note for the recipient before checkout.</p>
                    </div>

                    <button
                      type="button"
                      className={`personalize-toggle ${
                        personalizeMessageOn ? "is-on" : ""
                      }`}
                      onClick={() => setPersonalizeMessageOn((prev) => !prev)}
                      aria-label="Toggle personal message"
                    >
                      <span />
                    </button>
                  </div>

                  {personalizeMessageOn && (
                    <div className="message-panel">
                      <textarea
                        value={personalMessage}
                        onChange={(event) =>
                          setPersonalMessage(event.target.value.slice(0, 1000))
                        }
                        placeholder="Write your message..."
                      />

                      <div className="message-count">
                        {personalMessage.length}/1000
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    className={`personalize-continue-button ${
                      personalizeButtonIsLime ? "is-lime" : "is-grey"
                    }`}
                    onClick={handlePersonalizeContinue}
                    disabled={!personalizeCanContinue}
                  >
                    {!personalizeHasAnyToggle
                      ? "Skip to checkout"
                      : "Continue to checkout"}
                  </button>
                </div>
              </section>
            </main>
          ) : productStep === "recipient" ? (
            <main className="recipient-page">
<section className="recipient-frame">
  <button
    type="button"
    onClick={handleRecipientBack}
    className="recipient-back-button"
  >
                 ← Back
                </button>

<a
  href={shopPath}
  onClick={(event) => {
    event.preventDefault();
    goToWallOfCards();
  }}
  className="recipient-close-button"
  aria-label="Close and return to wall of cards"
>
  ×
</a>

                <div className="recipient-left product-info-column">
                  <div className="product-info-image-wrap">
                    <img
                      src={productHeroImage}
                      alt={productTitle}
                      draggable={false}
                      className="product-info-image"
                    />
                  </div>

                  <h1 className="product-info-title">{productTitle}</h1>

                  <p className="product-info-copy">{productDescription}</p>

                  {selectedProductCard.id === "linktree" && (
                    <a className="product-info-link" href="#">
                      View available brands and retailers
                    </a>
                  )}

                  <p className="product-info-expiry">No Expiry</p>
                  <a className="product-info-link" href="#">
  Terms &amp; Conditions
</a>
                </div>

                <div className="recipient-right">
                  <div className="recipient-value-row">
                    <h2>Gift value</h2>

                    <div className="recipient-value-actions">
                      <button
                        type="button"
                        className="recipient-value-pill"
                        onClick={() => setAmountDropdownOpen((prev) => !prev)}
                      >
                        {selectedCompactAmountLabel}
                      </button>

                      <button
                        type="button"
                        className={`recipient-dropdown-button ${
                          amountDropdownOpen ? "is-open" : ""
                        }`}
                        onClick={() => setAmountDropdownOpen((prev) => !prev)}
                        aria-label="Change gift value"
                      >
                        <img
                          src="/images/drop-down.png"
                          alt=""
                          draggable={false}
                        />
                      </button>
                    </div>
                  </div>

                  {amountDropdownOpen && (
                    <div className="recipient-amount-dropdown">
                      {amounts.map((amount) => (
                        <button
                          key={amount.value}
                          type="button"
                          className={`recipient-dropdown-amount ${
                            selectedAmountObject.value === amount.value
                              ? "is-selected"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedAmount(amount.value);
                            setAmountDropdownOpen(false);
                          }}
                        >
                          {formatCompactAmount(amount.value)}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="recipient-divider" />

                  <h3 className="recipient-question">
                    Who is this gift for?
                  </h3>

<div className="recipient-toggle">
  <button
    type="button"
    className={recipientType === "myself" ? "is-active" : ""}
    onClick={() => handleRecipientTypeChange("myself")}
  >
    Myself
  </button>

  <button
    type="button"
    className={recipientType === "creator" ? "is-active" : ""}
    onClick={() => handleRecipientTypeChange("creator")}
  >
    Linktree creator
  </button>

  <button
    type="button"
    className={recipientType === "someone" ? "is-active" : ""}
    onClick={() => handleRecipientTypeChange("someone")}
  >
    Someone else
  </button>
</div>

                  {recipientType === "creator" && (
                    <>
                      {selectedCreator && (
                        <button
                          type="button"
                          className="creator-card"
                          onClick={() => setCreatorPickerOpen(true)}
                        >
{selectedCreator.image ? (
  <img
    className="creator-avatar"
    src={selectedCreator.image}
    alt={selectedCreator.handle}
    draggable={false}
  />
) : (
  <span
    className="creator-avatar"
    aria-hidden="true"
  />
)}

                          <div className="creator-copy">
                            <div className="creator-handle">
                              {selectedCreator.handle}
                            </div>

{selectedCreator.handle !== "@cashtroy.bryan" && (
  <div className="creator-subtext">
    Selected creator. Tap to choose a different creator.
  </div>
)}
                          </div>
                        </button>
                      )}
                      {selectedCreator && (
                        <div className="myself-card">
                          This gift card will be sent to {selectedCreator.handle}.
                        </div>
                      )}

                      {creatorPickerOpen && (
                        <div className="creator-picker">
                          <div className="creator-picker-header">
                            <div>
                              <h4>Choose a Linktree creator</h4>
                              <p>Select who this eGift Card is for.</p>
                            </div>
                          </div>

                          <div className="creator-list">
                            {availableCreators.map((creator) => {
                              const isSelected =
                                selectedCreator?.handle === creator.handle;

                              return (
                                <button
                                  key={creator.handle}
                                  type="button"
                                  className={`creator-list-item ${
                                    isSelected ? "is-selected" : ""
                                  }`}
                                  onClick={() => {
                                    setSelectedCreator(creator);
                                    setCreatorPickerOpen(false);
                                  }}
                                >
{creator.image ? (
  <img
    className="creator-list-avatar"
    src={creator.image}
    alt={creator.handle}
    draggable={false}
  />
) : (
  <span
    className="creator-list-avatar"
    aria-hidden="true"
  />
)}

<div className="creator-list-copy">
  <div>{creator.handle}</div>

  {creator.subtitle && (
    <p>{creator.subtitle}</p>
  )}
</div>

<span className="creator-list-action">
  {isSelected ? "Selected" : "Choose"}
</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {recipientType === "someone" && (
                    <div className="recipient-form-card">
                      <input
                        value={recipientName}
                        onChange={(event) =>
                          setRecipientName(event.target.value)
                        }
                        placeholder="Recipient name"
                      />

                      <input
                        value={recipientEmail}
                        onChange={(event) =>
                          setRecipientEmail(event.target.value)
                        }
                        placeholder="Recipient email"
                      />

                      {recipientEmailTouched && !recipientEmailValid && (
                        <p className="recipient-validation-note">
                          Enter a valid email like name@example.com.
                        </p>
                      )}

                      <input
                        value={recipientPhone}
                        onChange={(event) =>
                          setRecipientPhone(event.target.value)
                        }
                        placeholder={`Recipient ${selectedCountry.phoneLabel}`}
                      />

                      {recipientPhoneTouched && !recipientPhoneValid && (
                        <p className="recipient-validation-note">
                          Enter exactly {selectedCountry.phoneDigits} digits for
                          a {selectedCountry.label} phone number.
                        </p>
                      )}

                      <p>
                        Enter a valid recipient email or{" "}
                        {selectedCountry.phoneLabel} so we know where to send
                        the gift card.
                      </p>
                    </div>
                  )}

                  {recipientType === "myself" && (
                    <div className="myself-card">
                      This gift card will be sent to you.
                    </div>
                  )}

                  <button
                    type="button"
                    className={`recipient-final-button ${
                      recipientReady ? "" : "is-disabled"
                    }`}
                    onClick={handleFinalCTA}
                    disabled={!recipientReady}
                  >
                    {recipientType === "myself" ? "Checkout" : "Personalize"} →
                  </button>
                </div>
              </section>
            </main>
          ) : (
            <main className="linktree-smart-page">
              <section
                className={`linktree-smart-frame ${
                  selectedAmount ? "has-continue" : ""
                }`}
              >
<a
  href={shopPath}
  onClick={(event) => {
    event.preventDefault();
    goToWallOfCards();
  }}
  className="linktree-back-button"
>
  ← Back
</a>

                <div className="product-info-column product-info-value">
                  <div className="product-info-image-wrap">
                    <img
                      className="product-info-image"
                      src={productHeroImage}
                      alt={productTitle}
                      draggable={false}
                    />
                  </div>

                  <h1 className="product-info-title">{productTitle}</h1>

                  <p className="product-info-copy">{productDescription}</p>

                  {selectedProductCard.id === "linktree" && (
                    <a className="product-info-link" href="#">
                      View available brands and retailers
                    </a>
                  )}

  <p className="product-info-expiry">No Expiry</p>

<a className="product-info-link" href="#">
  Terms &amp; Conditions
</a>
                </div>

                <h2 className="linktree-purchase-heading">
                  How much would you like to purchase?
                </h2>

                <div className="linktree-amount-panel" />

<div className="denomination-row">
  {amounts.map((amount) => {
    const isSelected = selectedAmount === amount.value;

    return (
      <button
        key={amount.value}
        type="button"
        className={`linktree-amount-button ${
          isSelected ? "is-selected" : ""
        }`}
        style={{
          left: `${amount.left}px`,
          top: `${amount.top}px`,
          width: `${amount.width}px`,
          height: `${amount.height}px`,
        }}
        aria-pressed={isSelected}
        onClick={() => setSelectedAmount(amount.value)}
      >
        {formatAmount(amount.value)}
      </button>
    );
  })}
</div>

                {selectedAmount && (
                  <button
                    type="button"
                    className="linktree-continue-button"
                    onClick={handleValueContinue}
                  >
                    Continue →
                  </button>
                )}
              </section>
            </main>
          )
) : activePage === "tracker" ? (
  <main className="gift-tracker-page">
    <section className="gift-tracker-hero">
      <div className="gift-tracker-chat-card">
        <div className="tracker-chat-topbar">
          <span className="tracker-chat-menu">⋮</span>
          <div className="tracker-chat-name">
            <span className="tracker-chat-avatar">🎁</span>
            <strong>Joy</strong>
          </div>
          <button type="button">End Chat</button>
        </div>

        <div className="tracker-chat-intro">
          <div className="tracker-chat-big-avatar">🎁</div>
          <h2>Joy</h2>
          <p>
            Hi I am Joy. I can help with gift card tracking, delivery, and
            receipt questions.
          </p>
        </div>

        <div className="tracker-chat-date">Today</div>

        <div className="tracker-chat-message-row">
          <span className="tracker-chat-small-avatar">🎁</span>
          <div>
            <p className="tracker-chat-question">
              How can I help you with your gift card today?
            </p>
            <p className="tracker-chat-bubble">
              Hi, I’m Joy. Enter your gift card order number on the right, or
              ask me anything about your gift card.
            </p>
          </div>
        </div>

        <div className="tracker-chat-input-row">
          <input placeholder="Message..." />
          <button type="button">↑</button>
        </div>
      </div>

      <div className="gift-tracker-help-card">
        <p className="tracker-eyebrow">GIFT CARD SUPPORT</p>
        <h1>Search Gift Card</h1>
        <p className="tracker-subtitle">
          Input gift card order number from your receipt and search.
        </p>

        <div className="tracker-search-bar">
          <input placeholder="Input Gift Card Order number" />
          <button type="button">Search</button>
        </div>

        <h2>Quick help topics</h2>

        <div className="tracker-topic-grid">
          <button type="button">Payment Methods</button>
          <button type="button">Cancellations &amp; Refunds</button>
          <button type="button">I Lost My Gift Card</button>
        </div>

        <div className="tracker-complaint-card">
          <h3>Lodging a Complaint</h3>
          <button type="button">Submit a complaint</button>
          <a href="#">Complaints policy</a>
        </div>
      </div>
    </section>
  </main>
) : activePage === "how" ? (
  <main className="how-it-works-page">
    <section className="how-it-works-frame">
      <h1>Questions? Answered</h1>

      <div className="how-faq-list">
        <details className="how-faq-item" open>
          <summary>
            <span>What is a Smart Card?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            A Smart Card lets the recipient choose from a curated range of gift
            card brands instead of being locked into one store.
          </p>
        </details>

        <details className="how-faq-item">
          <summary>
            <span>Will I get a receipt?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            Yes. The checkout email you enter is used for the purchase receipt.
          </p>
        </details>

        <details className="how-faq-item">
          <summary>
            <span>Can I choose the gift card amount?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            Yes. Choose from the available values on the product page before
            continuing to the recipient step.
          </p>
        </details>

        <details className="how-faq-item">
          <summary>
            <span>Can I send a gift card to a Linktree creator?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            Yes. Choose “Linktree creator,” pick the creator profile, then
            complete the gift flow.
          </p>
        </details>

        <details className="how-faq-item">
          <summary>
            <span>What details do I need for someone else?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            You can enter the recipient’s name, email, or phone number depending
            on where you want the gift card sent.
          </p>
        </details>

        <details className="how-faq-item">
          <summary>
            <span>Can I add a video or GIF?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            Yes. In the personalize step, you can add a greeting card, GIF,
            short video, audio file, or written message.
          </p>
        </details>

        <details className="how-faq-item">
          <summary>
            <span>Can I change the country?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            Yes. Use the country selector in the navigation bar to switch the
            shopping country and currency.
          </p>
        </details>

        <details className="how-faq-item">
          <summary>
            <span>When does the recipient get the gift card?</span>
            <span className="how-faq-icon">⌄</span>
          </summary>
          <p>
            The gift card is delivered digitally after checkout using the
            recipient details entered in the gift flow.
          </p>
        </details>
      </div>
    </section>
  </main>
) : activePage === "wall" ? (
          <main className="gift-browser-page">
            <section className="gift-browser-frame">
              <div className="hero-image-wrap">
                <img
                  className="hero-image"
                  src="/images/woc-banner.png"
                  alt="Linktree Smart Card"
                />
              </div>

              <div className="search-control">
                <img
                  className="search-icon-image"
                  src="/images/search-bar.png"
                  alt=""
                  draggable={false}
                />

                <input
                  className="search-input"
                  type="text"
                  value={searchQuery}
                  placeholder="Search for a brand"
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search for a brand"
                />
              </div>

              <div
                className="filter-wrap category-filter"
                ref={categoryFilterRef}
              >
                <button
                  className="category-control"
                  type="button"
                  onClick={() => {
                    setCategoryOpen((prev) => !prev);
                    setFeaturedOpen(false);
                  }}
                >
                  <span>{categoryButtonLabel}</span>
                  <img
                    className={`category-arrow ${
                      categoryOpen ? "is-open" : ""
                    }`}
                    src="/images/drop-down.png"
                    alt=""
                  />
                </button>

                {categoryOpen && (
                  <div className="category-menu">
                    {browserCategories.map((category) => (
                      <label key={category} className="category-option">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <span>{category}</span>
                      </label>
                    ))}

                    <button
                      type="button"
                      className="clear-categories"
                      onClick={() => setSelectedCategories([])}
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              <div
                className="filter-wrap featured-filter"
                ref={featuredFilterRef}
              >
                <button
                  className="featured-control"
                  type="button"
                  onClick={() => {
                    setFeaturedOpen((prev) => !prev);
                    setCategoryOpen(false);
                  }}
                >
                  <span>{sortMode}</span>
                  <img
                    className={`featured-arrow ${
                      featuredOpen ? "is-open" : ""
                    }`}
                    src="/images/drop-down.png"
                    alt=""
                  />
                </button>

                {featuredOpen && (
                  <div className="featured-menu">
                    {["Featured", "A-Z", "New Arrivals", "Z-A"].map(
                      (option) => (
                        <button
                          key={option}
                          type="button"
                          className={sortMode === option ? "is-active" : ""}
                          onClick={() => {
                            setSortMode(option);
                            setFeaturedOpen(false);
                          }}
                        >
                          {option}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>

              <h1 className="browser-title">Choose an eGift Card</h1>

              <p className="browser-subtitle">
                For a special occasion or just because, choose an eGift Card and
                make someone&apos;s day (maybe even yours).
              </p>

              {visibleBrowserCards.length === 0 && (
                <div className="browser-no-results">No results found</div>
              )}

              <div className="browser-card-grid">
{visibleBrowserCards.map((card) => {
  const isSelected = selectedBrowserCardId === card.id;
  const productPath = `/${selectedCountrySlug}/product/${card.id}`;

  return (
    <a
      key={card.id}
      href={productPath}
      className={`gift-card-tile ${
        isSelected ? "is-selected" : ""
      }`}
      onClick={(event) => {
        event.preventDefault();
        handleBrowserCardClick(card);
      }}
      aria-label={`Shop ${card.fullTitle}`}
    >
      <div className="gift-card-image-wrap">
        <img
          className={`gift-card-image gift-card-image-${card.id}`}
          src={card.tileImage}
          alt={card.fullTitle}
        />
      </div>

      <p className="gift-card-title">{card.title}</p>
      <p className="gift-card-range">{giftCardRange}</p>
    </a>
  );
})}
              </div>
            </section>
          </main>
        ) : (
          <>
<section className="mobile-home-green-section relative h-screen w-full overflow-hidden bg-[#cbea19]">              <img
                src="/images/starting-page.png"
                alt="Starting page"
                draggable={false}
                className="hero-bg absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
              />
              <div className="mobile-home-hero">
<img
  className="mobile-gifting-made-easy-image"
  src="/images/gifting-made-easy-mobile.png"
  alt="Gifting made easy."
  draggable={false}
/>

<button
  type="button"
  className="mobile-home-start-browsing-button"
  onClick={goToWallOfCards}
  aria-label="Start browsing gift cards"
/>

  <a
    href={shopPath}
    className="mobile-home-composite-cta"
    onClick={(event) => {
      event.preventDefault();
      goToWallOfCards();
    }}
    aria-label="Start browsing gift cards"
  />

<div
  className="mobile-home-campaign-card"
  aria-label="Featured gift card campaigns"
>
  <div className="mobile-home-campaign-viewport">
    <div className="mobile-home-campaign-track">
      {[
        {
          src: "/images/gaming-wishlist.png",
          alt: "Gaming gift cards",
        },
        {
          src: "/images/support-creators.png",
          alt: "Support your favorite creators",
        },
        {
          src: "/images/self-care-sale.png",
          alt: "Self-care gift cards",
        },
        {
          src: "/images/gaming-wishlist.png",
          alt: "",
        },
      ].map((campaign, index) => (
        <a
          key={`${campaign.src}-${index}`}
          href={shopPath}
          className="mobile-home-campaign-slide-link"
          onClick={(event) => {
            event.preventDefault();
            goToWallOfCards();
          }}
          aria-label={
            index === 3 ? undefined : "Shop featured gift cards"
          }
          aria-hidden={index === 3 ? true : undefined}
          tabIndex={index === 3 ? -1 : undefined}
        >
          <img
            className="mobile-home-campaign-slide"
            src={campaign.src}
            alt={campaign.alt}
            draggable={false}
          />
        </a>
      ))}
    </div>
  </div>
</div>
</div>

<a
  href={shopPath}
  onClick={(event) => {
    event.preventDefault();
    goToWallOfCards();
  }}
  aria-label="Start browsing"
  className="start-browsing-button absolute z-[300] cursor-pointer rounded-full bg-transparent"
/>

              <div className="carousel-window absolute z-10 overflow-hidden">
                <div className="carousel-track flex flex-col">
                  {[
                    "/images/support-creators.png",
                    "/images/gaming-wishlist.png",
                    "/images/self-care-sale.png",
                    "/images/support-creators.png",
                    "/images/gaming-wishlist.png",
                    "/images/self-care-sale.png",
                    "/images/support-creators.png",
                  ].map((src, index) => (
<a
  key={`${src}-${index}`}
  href={shopPath}
  className="carousel-card-link"
  onClick={(event) => {
    event.preventDefault();
    goToWallOfCards();
  }}
  aria-label="Shop gift cards"
>
  <img
    src={src}
    alt=""
    draggable={false}
    className="carousel-card"
  />
</a>
                  ))}
                </div>
              </div>
            </section>
            <section className="mobile-home-right-gift">
<h2 className="mobile-home-right-gift-heading">
  <span>The gift that</span>
  <span>always gets it right</span>
</h2>

<div
  className="mobile-home-right-gift-word-window"
  aria-live="polite"
>
  {isChangingWord && (
    <span
      className={`mobile-home-right-gift-word word-exit ${
        previousWord === 4 ? "is-last-minute-label" : ""
      }`}
    >
      {categoryLabels[previousWord]}
    </span>
  )}

  <span
    key={`mobile-word-${currentWord}`}
    className={`mobile-home-right-gift-word ${
      isChangingWord ? "word-enter" : ""
    } ${currentWord === 4 ? "is-last-minute-label" : ""}`}
  >
    {categoryLabels[currentWord]}
  </span>
</div>

<div className="mobile-home-right-gift-card-window">
  <div className="gift-card-row mobile-home-right-gift-card-track">
    {[
      ...homepageGiftCards,
      ...homepageGiftCards,
      ...homepageGiftCards,
    ].map((card, index) => {
      const productCard =
        browserCards.find((item) => item.id === card.id) ??
        defaultLinktreeProduct;

      const productPath = `/${selectedCountrySlug}/product/${productCard.id}`;

      return (
        <a
          key={`mobile-${card.id}-${index}`}
          href={productPath}
          className="mobile-home-right-gift-card-link"
          onClick={(event) => {
            event.preventDefault();
            goToProductPage(productCard);
          }}
          aria-label={`Shop ${productCard.fullTitle}`}
        >
          <img
            src={card.src}
            alt=""
            draggable={false}
            className="mobile-home-right-gift-card-image"
          />
        </a>
      );
    })}
  </div>
</div>
            </section>
<section className="desktop-home-right-gift relative h-[76vh] w-full overflow-hidden bg-[#f4f4f2]">              <div className="absolute left-1/2 top-[15%] z-20 flex -translate-x-1/2 flex-col items-center">
                <img
                  src="/images/the-gift-that-always.png"
                  alt=""
                  draggable={false}
                  className="w-[43vw] select-none pointer-events-none"
                />

                <div className="word-window">
                  {isChangingWord && (
                    <img
                      src={categoryImages[previousWord].src}
                      alt=""
                      draggable={false}
                      className="word-image word-exit"
                      style={{ scale: categoryImages[previousWord].scale }}
                    />
                  )}

                  <img
                    key={currentWord}
                    src={categoryImages[currentWord].src}
                    alt=""
                    draggable={false}
                    className={
                      isChangingWord ? "word-image word-enter" : "word-image"
                    }
                    style={{ scale: categoryImages[currentWord].scale }}
                  />
                </div>
              </div>

              <div className="absolute left-0 top-[39%] w-full overflow-hidden">
                <div className="gift-card-row flex w-max gap-[2vw]">
{[
  ...homepageGiftCards,
  ...homepageGiftCards,
  ...homepageGiftCards,
].map((card, index) => {
  const productCard =
    browserCards.find((item) => item.id === card.id) ??
    defaultLinktreeProduct;
  const productPath = `/${selectedCountrySlug}/product/${productCard.id}`;

  return (
    <a
      key={`${card.id}-${index}`}
      href={productPath}
      className="h-[16.2vw] w-[26.1vw] flex-shrink-0 rounded-[1.8vw] bg-transparent p-0 border-0 cursor-pointer overflow-hidden no-underline"
      onClick={(event) => {
        event.preventDefault();
        goToProductPage(productCard);
      }}
      aria-label={`Shop ${productCard.fullTitle}`}
    >
      <img
        src={card.src}
        alt=""
        draggable={false}
        className="h-full w-full object-cover select-none pointer-events-none"
      />
    </a>
  );
})}
                </div>
              </div>
            </section>

<section className="blue-cta-section relative w-full overflow-hidden bg-[#2559CD]">
  <img
    src="/images/final-look-3-page.png"
    alt="Linktree Smart Card section"
    draggable={false}
    className="desktop-blue-cta-image block h-auto w-full select-none pointer-events-none"
  />

  <img
    src="/images/smart-card-mobile.png"
    alt="One Linktree Smart Card, endless picks"
    draggable={false}
    className="mobile-blue-cta-image"
  />

  <a
    href={`/${selectedCountrySlug}/product/${defaultLinktreeProduct.id}`}
    className="blue-start-gifting-button"
    onClick={(event) => {
      event.preventDefault();
      goToProductPage(defaultLinktreeProduct);
    }}
    aria-label="Start gifting now"
  >
    Start gifting now
  </a>
</section>

<section className="landing-claim-section">
  <div className="landing-claim-frame">
    <img
      className="landing-claim-mobile-image"
      src="/images/footer-mobile.png"
      alt=""
      draggable={false}
    />

    <img
      className="landing-blue-dude"
      src="/images/blue-dude.png"
      alt=""
      draggable={false}
    />

    <h2 className="landing-claim-title">
      Jumpstart your corner of the internet today
    </h2>

    <div className="landing-claim-form">
      <input
        className="landing-claim-input"
        type="text"
        placeholder="linktr.ee"
        aria-label="Linktree username"
      />

      <a
        href="https://linktr.ee/"
        aria-label="Claim your Linktree"
        className="landing-claim-button"
      >
        Claim your Linktree
      </a>
    </div>

    <img
      className="landing-purple-shape"
      src="/images/weird-purple.png"
      alt=""
      draggable={false}
    />
  </div>
</section>          </>
        )}
      </div>

      <style>{`
        @font-face {
          font-family: "Link Sans";
          src: url("/font/b60b5cf113571e47217d4fffd51bd8ed.woff2") format("woff2");
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Link Sans";
          src: url("/font/90fc7c5e1633bace7675c76b94f742eb.woff2") format("woff2");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Link Sans";
          src: url("/font/f1b774b595cc6c615b11d7299b2eda05.woff2") format("woff2");
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Link Sans";
          src: url("/font/030bed0195cd98cd301bdd3e3a59f234.woff2") format("woff2");
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Link Sans";
          src: url("/font/9d531e5a6699f77596117500c5d35c20.woff2") format("woff2");
          font-weight: 800;
          font-style: normal;
          font-display: swap;
        }

        @font-face {
          font-family: "Link Sans";
          src: url("/font/c26c0c2ba8f7711fba5695569b82cb10.woff2") format("woff2");
          font-weight: 900;
          font-style: normal;
          font-display: swap;
        }

        * {
          box-sizing: border-box;
          font-family: "Link Sans", Arial, sans-serif !important;
        }

        html,
        body {
          overflow-x: hidden;
          font-family: "Link Sans", Arial, sans-serif !important;
        }

        img {
          -webkit-user-drag: none;
          user-select: none;
        }

        button,
        input,
        textarea,
        select,
        a,
        p,
        h1,
        h2,
        h3,
        h4,
        span,
        label,
        div {
          font-family: "Link Sans", Arial, sans-serif !important;
        }

a {

  color: inherit;

  text-decoration: none;

}
  
        .main-shell {
          transition: background-color 360ms ease;
          font-family: "Link Sans", Arial, sans-serif !important;
        }

/* Mobile-only elements hidden on desktop */
.mobile-home-hero,
.mobile-menu-button,
.mobile-nav-menu,
.linktree-mobile-logo {
  display: none;
}

.gift-tracker-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 20%, rgba(255, 255, 255, 0.34), transparent 28%),
    radial-gradient(circle at 82% 18%, rgba(255, 255, 255, 0.24), transparent 30%),
    #e9b6e8;
  padding: 142px 24px 110px;
  color: #1f2333;
}

.gift-tracker-hero {
  width: min(1220px, calc(100vw - 48px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 430px minmax(0, 1fr);
  gap: 34px;
  align-items: stretch;
}

.gift-tracker-chat-card,
.gift-tracker-help-card {
  border-radius: 36px;
  background: #ffffff;
  box-shadow: 0 26px 80px rgba(53, 21, 64, 0.16);
}

.gift-tracker-chat-card {
  min-height: 560px;
  padding: 19px 18px 20px;
  display: flex;
  flex-direction: column;
}

.tracker-chat-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  color: #1f2333;
}

.tracker-chat-menu {
  font-size: 24px;
  line-height: 1;
  color: #777;
}

.tracker-chat-name {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-right: auto;
  font-size: 15px;
}

.tracker-chat-avatar,
.tracker-chat-small-avatar,
.tracker-chat-big-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #ffe1ea;
}

.tracker-chat-avatar {
  width: 27px;
  height: 27px;
  font-size: 14px;
}

.tracker-chat-topbar button {
  height: 34px;
  padding: 0 17px;
  border: 1px solid #e4e4e4;
  border-radius: 10px;
  background: #ffffff;
  color: #9a9a9a;
  font-size: 13px;
  font-weight: 850;
}

.tracker-chat-intro {
  margin: 58px auto 38px;
  max-width: 315px;
  text-align: center;
}

.tracker-chat-big-avatar {
  width: 70px;
  height: 70px;
  margin: 0 auto 17px;
  font-size: 31px;
}

.tracker-chat-intro h2 {
  margin: 0 0 10px;
  font-size: 25px;
  line-height: 1;
  font-weight: 950;
}

.tracker-chat-intro p,
.tracker-chat-question,
.tracker-chat-bubble {
  color: #4f5360;
  font-size: 14px;
  line-height: 1.28;
  font-weight: 750;
}

.tracker-chat-date {
  margin: 0 auto 28px;
  color: #9a9a9a;
  font-size: 12px;
  font-weight: 850;
}

.tracker-chat-message-row {
  display: flex;
  gap: 12px;
  margin: 0 7px;
}

.tracker-chat-small-avatar {
  flex: 0 0 auto;
  width: 25px;
  height: 25px;
  font-size: 12px;
}

.tracker-chat-question {
  margin: 0 0 8px;
  color: #242838;
}

.tracker-chat-bubble {
  margin: 0;
  max-width: 340px;
  color: #242838;
}

.tracker-chat-input-row {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d4d4d4;
  border-radius: 13px;
  padding: 7px 8px 7px 13px;
}

.tracker-chat-input-row input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  font-size: 14px;
  font-weight: 750;
}

.tracker-chat-input-row button {
  width: 31px;
  height: 31px;
  border: 0;
  border-radius: 999px;
  background: #777;
  color: #ffffff;
  font-weight: 900;
}

.gift-tracker-help-card {
  padding: 48px 48px 44px;
  text-align: center;
}

.tracker-eyebrow {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 950;
  letter-spacing: 0.08em;
  color: #1f2333;
}

.gift-tracker-help-card h1 {
  margin: 0;
  font-size: clamp(42px, 4.35vw, 66px);
  line-height: 0.9;
  letter-spacing: -2.4px;
  font-weight: 950;
  color: #1f2333;
}

.tracker-subtitle {
  margin: 18px auto 31px;
  max-width: 600px;
  color: #1f2333;
  font-size: 19px;
  line-height: 1.22;
  font-weight: 750;
}

.tracker-search-bar {
  width: min(620px, 100%);
  min-height: 66px;
  margin: 0 auto 38px;
  padding: 7px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #f6f6f3;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.04);
}

.tracker-search-bar input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 0 18px;
  color: #1f2333;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 850;
  text-overflow: ellipsis;
}

.tracker-search-bar input::placeholder {
  color: #727784;
}

.tracker-search-bar button,
.tracker-complaint-card button {
  border: 0;
  border-radius: 999px;
  background: #1f2333;
  color: #ffffff;
  font-weight: 950;
  cursor: pointer;
  white-space: nowrap;
}

.tracker-search-bar button {
  flex: 0 0 auto;
  height: 52px;
  padding: 0 31px;
}

.gift-tracker-help-card h2,
.tracker-complaint-card h3 {
  margin: 0 0 20px;
  font-size: 25px;
  line-height: 1.05;
  font-weight: 950;
  color: #1f2333;
}

.tracker-topic-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 17px;
  margin-bottom: 36px;
}

.tracker-topic-grid button {
  min-height: 96px;
  padding: 16px 12px;
  border: 0;
  border-radius: 22px;
  background: #ffffff;
  color: #e03d5d;
  box-shadow: 0 18px 34px rgba(44, 22, 54, 0.11);
  font-size: 15px;
  line-height: 1.12;
  font-weight: 950;
  cursor: pointer;
}

.tracker-complaint-card {
  width: min(420px, 100%);
  margin: 0 auto;
  padding-top: 2px;
}

.tracker-complaint-card button {
  height: 42px;
  padding: 0 25px;
  background: #e03d5d;
}

.tracker-complaint-card a {
  display: block;
  margin-top: 17px;
  color: #e03d5d;
  font-size: 15px;
  font-weight: 950;
  text-decoration: underline;
}

.how-it-works-page {
  min-height: 100vh;
  background: #870019;
  padding: 145px 24px 70px;
  color: #f7b9dc;
}

.page-content:has(.how-it-works-page) {
  min-height: 100vh;
  background: #870019 !important;
}

.how-it-works-frame {
  width: min(980px, calc(100vw - 48px));
  margin: 0 auto;
}

.how-it-works-frame h1 {
  margin: 0 0 38px;
  text-align: center;
  font-size: 56px;
  line-height: 0.95;
  font-weight: 900;
  letter-spacing: -2.2px;
  color: #f7b9dc;
}

.how-faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 0;
}

.how-faq-item {
  overflow: hidden;
  border-radius: 27px;
  background: #670014;
  color: #f7b9dc;
}

.how-faq-item summary {
  min-height: 104px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 46px;
  cursor: pointer;
  list-style: none;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.how-faq-item summary::-webkit-details-marker {
  display: none;
}

.how-faq-icon {
  flex: 0 0 auto;
  font-size: 22px;
  font-weight: 800;
  transition: transform 180ms ease;
}

.how-faq-item[open] .how-faq-icon {
  transform: rotate(180deg);
}

.how-faq-item p {
  margin: -12px 0 0;
  padding: 0 46px 34px;
  max-width: 790px;
  color: #ffd6ea;
  font-size: 18px;
  line-height: 1.45;
  font-weight: 600;
}

        .page-content {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 260ms ease,
            transform 360ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .page-content-changing {
          opacity: 0;
          transform: translateY(14px);
          pointer-events: none;
        }

        .country-change-toast {
          position: fixed;
          left: 50%;
          top: 98px;
          z-index: 1200;
          transform: translateX(-50%);
          min-width: 280px;
          height: 48px;
          border-radius: 999px;
          background: #cbe534;
          color: #000000;
          font-size: 16px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 24px;
          box-shadow:
            0px 8px 18px rgba(0, 0, 0, 0.12),
            0px 18px 56px rgba(0, 0, 0, 0.14);
          animation: countryToastIn 1600ms ease both;
          pointer-events: none;
        }

        @keyframes countryToastIn {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-12px) scale(0.96);
          }

          14% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }

          78% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }

          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-8px) scale(0.98);
          }
        }

        .linktree-nav-shell {
          position: fixed;
          left: 50%;
          top: 3.1%;
          z-index: 999;
          width: 1220px;
          height: 76px;
          transform: translateX(-50%) translateY(0);
          transition: transform 700ms ease-in-out;
        }

        .linktree-nav-shell.nav-hidden {
          transform: translateX(-50%) translateY(-160%);
        }

        .linktree-nav-shell.nav-no-transition {
          transition: none;
        }

        .linktree-nav {
          position: relative;
          width: 1220px;
          height: 76px;
          background: #ffffff;
          border: 1px solid #ebebeb;
          border-radius: 38px;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.08);
        }

        .linktree-logo-link {
          position: absolute;
          left: 32px;
          top: 12px;
          width: 104px;
          height: 52px;
          border: 0;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .linktree-logo {
          position: absolute;
          inset: 0;
          width: 104px;
          height: 52px;
          display: block;
          object-fit: contain;
          max-width: none;
        }

        .linktree-nav-item {
          position: absolute;
          top: 17px;
          height: 42px;
          margin: 0;
          padding: 0 14px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #000000;
          font-size: 14.5px;
          font-weight: 500;
          white-space: nowrap;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .linktree-nav-item:hover {
          background: #edeee9;
        }

        .shop-link {
          left: 155px;
          width: 154px;
        }

        .how-link {
          left: 310px;
          width: 136px;
        }

        .tracker-link {
          left: 448px;
          width: 128px;
        }

        .help-link {
          left: 582px;
          width: 62px;
        }

        .country-area {
          position: absolute;
          left: 684px;
          top: 12px;
          width: 232px;
          height: 52px;
        }

        .country-pill {
          width: 232px;
          height: 52px;
          border: 0;
          border-radius: 26px;
          background: #22451b;
          color: #ffffff;
          font-size: 12.8px;
          font-weight: 700;
          line-height: 1.14;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 19px;
          cursor: pointer;
          letter-spacing: -0.1px;
        }

        .country-pill:hover {
          background: #183914;
        }

        .country-menu {
          position: absolute;
          left: 0;
          top: 60px;
          z-index: 40;
          width: 232px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid #ebebeb;
          padding: 8px;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.06),
            0px 18px 56px rgba(0, 0, 0, 0.12);
          animation: menuIn 180ms ease both;
        }

        .country-menu button {
          width: 100%;
          height: 40px;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #111111;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          padding: 0 12px;
        }

        .country-menu button:hover,
        .country-menu button.is-active {
          background: #edeee9;
        }

        .login-button {
          position: absolute;
          left: 936px;
          top: 16px;
          width: 82px;
          height: 44px;
          border: 0;
          border-radius: 8px;
          background: #edeee9;
          color: #000000;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .login-button:hover {
          background: #e0e1dc;
        }

        .signup-button {
          position: absolute;
          left: 1030px;
          top: 15px;
          width: 138px;
          height: 46px;
          border: 0;
          border-radius: 23px;
          background: #000000;
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .signup-button:hover {
          transform: translateY(-1px);
        }

        .linktree-logo-link:focus-visible,
        .linktree-nav-item:focus-visible,
        .login-button:focus-visible,
        .signup-button:focus-visible,
        .country-pill:focus-visible {
          outline: 2px solid #2559cd;
          outline-offset: 3px;
        }

        .start-browsing-button {
          left: 31.85%;
          top: 66.25%;
          height: 3.7%;
          width: 11.6%;
        }

        .blue-start-gifting-button {
          position: absolute;
          left: 52.6%;
          top: 62.5%;
          z-index: 20;
          width: 16%;
          height: 9%;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: transparent;
          cursor: pointer;
        }

.mobile-blue-cta-image,
.landing-claim-mobile-image {
  display: none;
}

        .claim-linktree-button {
          position: absolute;
          left: 50.45%;
          top: 61.9%;
          width: 11.9%;
          height: 6.3%;
          border-radius: 999px;
          background: transparent;
          cursor: pointer;
          z-index: 20;
        }

        .gift-browser-page {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          background: #f1f1ef;
          overflow: visible;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .gift-browser-frame {
          position: relative;
          width: 1440px;
          min-height: 1814px;
          flex-shrink: 0;
          background: #f1f1ef;
          color: #000000;
          transform-origin: top center;
        }

        .hero-image-wrap {
          position: absolute;
          left: 71px;
          top: 88px;
          width: 1297px;
          height: 355px;
          overflow: visible;
          background: transparent;
          border: 0;
          border-radius: 0;
          box-shadow: none;
        }

        .hero-image {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 104%;
          height: auto;
          max-width: none;
          object-fit: contain;
          display: block;
          transform: translate(-50%, -50%);
        }

        .search-control {
          position: absolute;
          left: 71px;
          top: 497px;
          width: 602px;
          height: 73px;
          border: 1px solid #ebebeb;
          border-radius: 36.5px;
          background: #ffffff;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .search-icon-image {
          position: absolute;
          left: 18px;
          top: 7px;
          width: 64px;
          height: 64px;
          object-fit: contain;
          object-position: left center;
          display: block;
          pointer-events: none;
        }

        .search-input {
          position: absolute;
          left: 102px;
          top: 0;
          width: 455px;
          height: 73px;
          margin: 0;
          padding: 0;
          border: 0;
          outline: none !important;
          background: transparent;
          color: #000000;
          font-size: 21.381px;
          font-weight: 500;
          line-height: normal;
          box-shadow: none !important;
        }

        .search-input:focus,
        .search-input:focus-visible,
        .search-input:active {
          outline: none !important;
          border: 0 !important;
          box-shadow: none !important;
        }

        .search-input::placeholder {
          color: #888888;
          opacity: 1;
          font-size: 21.381px;
          font-weight: 500;
        }

        .filter-wrap {
          position: absolute;
          z-index: 50;
        }

        .category-filter {
          left: 699px;
          top: 497px;
          width: 391px;
        }

        .featured-filter {
          left: 1116px;
          top: 497px;
          width: 252px;
        }

        .category-control,
        .featured-control {
          width: 100%;
          height: 73px;
          margin: 0;
          padding: 0;
          border: 1px solid #ebebeb;
          border-radius: 36.5px;
          background: #ffffff;
          color: #888888;
          font-size: 21.381px;
          font-weight: 500;
          line-height: normal;
          text-align: left;
          cursor: pointer;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.1);
          appearance: none;
          -webkit-appearance: none;
        }

        .category-control span {
          position: absolute;
          left: 39.47px;
          top: 23px;
          width: 255px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .featured-control span {
          position: absolute;
          left: 33px;
          top: 22.95px;
          white-space: nowrap;
        }

        .category-arrow,
        .featured-arrow {
          position: absolute;
          top: 25px;
          width: 30px;
          height: 22px;
          object-fit: contain;
          display: block;
          transition: transform 160ms ease;
        }

        .category-arrow {
          left: 332px;
        }

        .featured-arrow {
          left: 198px;
        }

        .category-arrow.is-open,
        .featured-arrow.is-open {
          transform: rotate(180deg);
        }

        .category-menu,
        .featured-menu {
          position: absolute;
          left: 0;
          top: 86px;
          z-index: 80;
          width: 100%;
          border-radius: 26px;
          background: #ffffff;
          border: 1px solid #ebebeb;
          padding: 18px;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.06),
            0px 18px 56px rgba(0, 0, 0, 0.14);
          animation: menuIn 180ms ease both;
        }

        @keyframes menuIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .category-option {
          height: 38px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #111111;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .category-option input {
          width: 18px;
          height: 18px;
          accent-color: #cbe534;
          cursor: pointer;
        }

        .clear-categories {
          width: 100%;
          height: 38px;
          margin-top: 10px;
          border: 0;
          border-radius: 999px;
          background: #f1f1ef;
          color: #111111;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }

        .featured-menu {
          padding: 10px;
        }

        .featured-menu button {
          width: 100%;
          height: 42px;
          border: 0;
          border-radius: 16px;
          background: transparent;
          color: #111111;
          font-size: 16px;
          font-weight: 800;
          text-align: left;
          padding: 0 16px;
          cursor: pointer;
        }

        .featured-menu button:hover,
        .featured-menu button.is-active {
          background: #edeee9;
        }

        .browser-title {
          position: absolute;
          left: 71px;
          top: 624px;
          width: 739.059px;
          margin: 0;
          color: #000000;
          font-size: 34.632px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -1.385px;
          word-break: break-word;
        }

        .browser-subtitle {
          position: absolute;
          left: 71px;
          top: 685px;
          width: 1297px;
          margin: 0;
          color: #000000;
          font-size: 23.71px;
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.474px;
          word-break: break-word;
        }

        .browser-no-results {
          position: absolute;
          left: 71px;
          top: 790px;
          width: 1297px;
          color: #111111;
          font-size: 56px;
          font-weight: 900;
          text-align: center;
          letter-spacing: -1.8px;
        }

        .browser-card-grid {
          position: absolute;
          left: 71px;
          top: 753px;
          width: 1297px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 56px 36px;
          padding-bottom: 100px;
        }

        .gift-card-tile {
          position: relative;
          width: 100%;
          height: 287px;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 12px;
          background: #ffffff;
          color: #000000;
          text-align: left;
          overflow: hidden;
          cursor: pointer;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.1);
          appearance: none;
          -webkit-appearance: none;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease;
            text-decoration: none;
            color: inherit;
        }

        .gift-card-tile:hover {
          transform: translateY(-4px);
          box-shadow:
            0px 5px 8px rgba(0, 0, 0, 0.05),
            0px 16px 30px rgba(0, 0, 0, 0.08),
            0px 24px 68px rgba(0, 0, 0, 0.13);
        }

        .gift-card-tile.is-selected {
          outline: 4px solid #cbe534;
          outline-offset: 4px;
        }

        .gift-card-image-wrap {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 184px;
          border-radius: 12px 12px 0 0;
          overflow: hidden;
          background: #ffffff;
        }

        .gift-card-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .gift-card-title {
          position: absolute;
          left: 25px;
          top: 206px;
          width: 240px;
          margin: 0;
          color: #000000;
          font-size: 21.381px;
          font-weight: 500;
          line-height: normal;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .gift-card-range {
          position: absolute;
          left: 25px;
          top: 240px;
          width: 230px;
          margin: 0;
          color: #888888;
          font-size: 18.538px;
          font-weight: 500;
          line-height: normal;
          white-space: nowrap;
        }

        .category-control:focus-visible,
        .featured-control:focus-visible,
        .gift-card-tile:focus-visible {
          outline: 4px solid #2559cd;
          outline-offset: 4px;
        }

        .linktree-smart-page,
        .recipient-page,
        .personalize-page {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          background: #f3f3f1;
          overflow: visible;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .linktree-smart-frame {
          position: relative;
          width: 1440px;
          height: 900px;
          flex-shrink: 0;
          background: #f3f3f1;
          color: #000000;
          transform-origin: top center;
        }

        .linktree-smart-frame.has-continue {
          height: 1080px;
        }

        .linktree-back-button,
        .recipient-back-button,
        .personalize-back-button {
          position: absolute;
          left: 80px;
          top: 34px;
          z-index: 5;
          border: 0;
          background: transparent;
          color: #8e8e8e;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.2px;
          cursor: pointer;
          opacity: 1;
        }

        .linktree-back-button:hover,
        .recipient-back-button:hover,
        .personalize-back-button:hover {
          color: #000000;
        }

        .product-info-column {
          position: absolute;
          left: 80px;
          top: 88px;
          width: 500px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .product-info-image-wrap {
          width: 500px;
          height: 300px;
          border-radius: 35px;
          overflow: hidden;
          background: transparent;
          box-shadow:
            0px 3.335px 5.003px rgba(0, 0, 0, 0.04),
            0px 8.338px 15.008px rgba(0, 0, 0, 0.05),
            0px 15.008px 46.693px rgba(0, 0, 0, 0.1);
        }

        .product-info-image {
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .product-info-title {
          width: 427px;
          margin: 54px 0 0 0;
          color: #000000;
          font-size: 38.703px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -1.548px;
          word-break: break-word;
        }

        .product-info-copy {
          width: 427px;
          margin: 25px 0 0 0;
          color: #000000;
          font-size: 21.194px;
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -0.636px;
          word-break: break-word;
        }

        .product-info-link {
          width: 434px;
          margin: 34px 0 0 0;
          color: #2559cd;
          font-size: 21.19px;
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.636px;
          text-decoration: none;
          word-break: break-word;
        }

        .product-info-expiry {
          width: 332px;
          margin: 34px 0 0 0;
          color: #000000;
          font-size: 29.207px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -1.168px;
          word-break: break-word;
        }

        .linktree-purchase-heading {
          position: absolute;
          left: 680px;
          top: 78px;
          width: 545px;
          min-height: 96px;
          margin: 0;
          color: #000000;
          font-size: 42px;
          font-weight: 900;
          line-height: 0.92;
          letter-spacing: -1.68px;
          word-break: normal;
        }

        .linktree-amount-panel {
          position: absolute;
          left: 680px;
          top: 208px;
          width: 679px;
          height: 649px;
          background: #ffffff;
          border-radius: 35px;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.1);
        }

        .linktree-amount-button {
          position: absolute;
          z-index: 2;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 35.225px;
          background: #000000;
          color: #ffffff;
          font-size: 20.634px;
          font-weight: 700;
          line-height: normal;
          letter-spacing: -0.413px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          transition:
            background-color 160ms ease,
            color 160ms ease,
            transform 160ms ease,
            box-shadow 160ms ease;
        }

        .linktree-amount-button:hover {
          background: #2a2a2a;
          color: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0px 7px 16px rgba(0, 0, 0, 0.22);
        }

        .linktree-amount-button.is-selected {
          background: #cbe534;
          color: #000000;
          transform: translateY(-1px);
          box-shadow: 0px 7px 16px rgba(0, 0, 0, 0.14);
        }

        .linktree-amount-button.is-selected:hover {
          background: #cbe534;
          color: #000000;
        }

        .linktree-continue-button {
          position: absolute;
          left: 715px;
          top: 911px;
          width: 609.35px;
          height: 77.906px;
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 61.998px;
          background: #cbe534;
          color: #000000;
          font-size: 36.733px;
          font-weight: 500;
          line-height: normal;
          letter-spacing: -0.735px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          animation: continueButtonIn 360ms ease-out both;
        }

        @keyframes continueButtonIn {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .recipient-frame {
          position: relative;
          width: 1440px;
          height: 1040px;
          flex-shrink: 0;
          background: #f3f3f1;
          color: #000000;
          transform-origin: top center;
        }

        .recipient-close-button,
        .personalize-close-button {
          position: absolute;
          right: 80px;
          top: 28px;
          z-index: 8;
          width: 54px;
          height: 54px;
          border: 0;
          border-radius: 999px;
          background: #e2e2df;
          color: #000000;
          font-size: 38px;
          line-height: 1;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 4px;
        }

        .recipient-close-button:hover,
        .personalize-close-button:hover {
          background: #d5d5d2;
        }

        .recipient-right {
          position: absolute;
          left: 680px;
          top: 92px;
          width: 679px;
        }

        .recipient-value-row {
          position: relative;
          width: 679px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .recipient-value-row h2 {
          margin: 0;
          color: #000000;
          font-size: 29.21px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -1.168px;
        }

        .recipient-value-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .recipient-value-pill {
          min-width: 146px;
          height: 62px;
          border: 0;
          border-radius: 999px;
          background: #cbe534;
          color: #000000;
          font-size: 35px;
          font-weight: 800;
          letter-spacing: -1px;
          cursor: pointer;
          padding: 0 28px;
        }

        .recipient-dropdown-button {
          width: 46px;
          height: 46px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: transform 180ms ease;
        }

        .recipient-dropdown-button img {
          width: 46px;
          height: 46px;
          object-fit: contain;
          display: block;
        }

        .recipient-dropdown-button.is-open {
          transform: rotate(180deg);
        }

        .recipient-divider {
          width: 679px;
          height: 1px;
          margin-top: 28px;
          background: #d7d7d4;
        }

        .recipient-amount-dropdown {
          position: absolute;
          right: 0;
          top: 82px;
          z-index: 30;
          width: 679px;
          border-radius: 35px;
          background: #ffffff;
          padding: 34px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.1);
          animation: recipientDropIn 220ms ease both;
        }

        .recipient-dropdown-amount {
          height: 68px;
          border-radius: 999px;
          border: 0;
          background: #000000;
          color: #ffffff;
          font-size: 22px;
          font-weight: 800;
          cursor: pointer;
          letter-spacing: -0.4px;
        }

        .recipient-dropdown-amount.is-selected {
          background: #cbe534;
          color: #000000;
        }

        @keyframes recipientDropIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .recipient-question {
          margin: 34px 0 30px 0;
          color: #000000;
          font-size: 54px;
          font-weight: 400;
          line-height: 1.04;
          letter-spacing: -2px;
        }

.recipient-toggle {
  width: 679px;
  height: 76px;
  border: 2px solid #111111;
  border-radius: 999px;
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  gap: 0;
  background: transparent;
}

.recipient-toggle button {
  width: 100%;
  min-width: 0;
  height: 100%;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #000000;
  font-size: 20px;
  font-weight: 900;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: nowrap;
  letter-spacing: -0.45px;
}

        .recipient-toggle button.is-active {
          background: #cbe534;
          color: #000000;
        }

        .creator-card,
        .myself-card,
        .recipient-form-card {
          width: 679px;
          margin-top: 34px;
          border-radius: 28px;
          background: #ffffff;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.1);
          animation: recipientCardIn 240ms ease both;
        }

        .creator-card {
          min-height: 132px;
          padding: 26px 30px;
          display: flex;
          align-items: center;
          gap: 24px;
          border: 0;
          cursor: pointer;
          text-align: left;
        }

        .creator-card:hover {
          transform: translateY(-2px);
        }

        .creator-avatar {
          width: 82px;
          height: 82px;
          border-radius: 999px;
          background: #ececea;
          border: 2px solid #dededb;
          flex-shrink: 0;
          object-fit: cover;
object-position: center;
display: block;
flex-shrink: 0;
        }

        .creator-copy {
          min-width: 0;
        }

        .creator-handle {
          color: #000000;
          font-size: 34px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .creator-subtext {
          margin-top: 6px;
          color: #777777;
          font-size: 19px;
          font-weight: 700;
        }

        .creator-picker {
          position: absolute;
          left: 0;
          top: 314px;
          z-index: 25;
          width: 679px;
          border-radius: 28px;
          background: #ffffff;
          padding: 26px;
          box-shadow:
            0px 4px 6px rgba(0, 0, 0, 0.04),
            0px 10px 18px rgba(0, 0, 0, 0.05),
            0px 18px 56px rgba(0, 0, 0, 0.14);
          animation: creatorPickerIn 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes creatorPickerIn {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .creator-picker-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .creator-picker-header h4 {
          margin: 0;
          font-size: 30px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -1px;
          color: #000000;
        }

        .creator-picker-header p {
          margin: 8px 0 0 0;
          color: #777777;
          font-size: 18px;
          font-weight: 700;
        }

        .creator-picker-header button {
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 999px;
          background: #f1f1ef;
          color: #000000;
          font-size: 34px;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
        }

        .creator-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .creator-list-item {
          width: 100%;
          min-height: 88px;
          border: 0;
          border-radius: 22px;
          background: #f3f3f1;
          display: grid;
          grid-template-columns: 64px 1fr auto;
          align-items: center;
          gap: 18px;
          padding: 14px 18px;
          cursor: pointer;
          text-align: left;
        }

        .creator-list-item:hover {
          background: #ececea;
        }

        .creator-list-item.is-selected {
          background: #eef8a8;
        }

        .creator-list-avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: #e5e5e2;
          border: 2px solid #d7d7d4;
          object-fit: cover;
object-position: center;
display: block;
flex-shrink: 0;
        }

        .creator-list-copy div {
          color: #000000;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .creator-list-copy p {
          margin: 5px 0 0 0;
          color: #777777;
          font-size: 16px;
          font-weight: 700;
        }

.creator-list-action {
  color: #000000;
  font-size: 16px;
  font-weight: 900;
  border-radius: 999px;
  background: #ffffff;
  padding: 10px 14px;
}

.creator-list-item.is-selected .creator-list-action {
  background: #cbe534;
}

        .creator-list-item.is-selected span {
          background: #cbe534;
        }

        .recipient-form-card {
          padding: 34px;
        }

        .recipient-form-card input {
          width: 100%;
          height: 76px;
          border: 0;
          border-bottom: 1.5px solid #d2d2cf;
          background: transparent;
          color: #000000;
          font-size: 28px;
          font-weight: 500;
          outline: none;
        }

        .recipient-form-card input::placeholder {
          color: #8b8b8b;
        }

        .recipient-form-card p {
          margin: 16px 0 0 0;
          color: #8b8b8b;
          font-size: 21px;
          font-weight: 500;
        }

        .recipient-validation-note {
          margin: 8px 0 6px 0 !important;
          color: #d43d2f !important;
          font-size: 16px !important;
          font-weight: 800 !important;
        }

        .myself-card {
          min-height: 104px;
          padding: 34px;
          display: flex;
          align-items: center;
          color: #000000;
          font-size: 26px;
          font-weight: 800;
        }

        @keyframes recipientCardIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .recipient-final-button {
          width: 679px;
          height: 78px;
          margin-top: 42px;
          border: 0;
          border-radius: 999px;
          background: #cbe534;
          color: #000000;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: -0.7px;
          cursor: pointer;
        }

        .recipient-final-button:hover {
          transform: translateY(-2px);
        }

        .recipient-final-button.is-disabled,
        .recipient-final-button.is-disabled:hover {
          background: #a7a7a7;
          color: #ffffff;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .personalize-frame {
          position: relative;
          width: 1440px;
          min-height: 1120px;
          flex-shrink: 0;
          background: #f3f3f1;
          color: #000000;
          transform-origin: top center;
          padding-top: 92px;
        }

        .personalize-card {
          width: 820px;
          margin: 0 auto 90px auto;
          background: #ffffff;
          border: 1.5px solid #d2d2cf;
          border-radius: 24px;
          padding: 46px 50px 52px 50px;
          box-shadow: 0px 18px 56px rgba(0, 0, 0, 0.08);
        }

        .personalize-card h1 {
          margin: 0;
          font-size: 42px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -1.4px;
          color: #000000;
        }

        .personalize-subtitle {
          margin: 34px 0 44px 0;
          font-size: 28px;
          line-height: 1.1;
          font-weight: 700;
          letter-spacing: -0.8px;
          color: #242424;
        }

        .personalize-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 34px;
        }

        .personalize-option h2 {
          margin: 0;
          font-size: 28px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.75px;
          color: #242424;
        }

        .personalize-option p {
          margin: 10px 0 0 0;
          font-size: 17px;
          line-height: 1.3;
          font-weight: 600;
          color: #777777;
        }

        .personalize-toggle {
          width: 78px;
          height: 44px;
          flex-shrink: 0;
          border: 0;
          border-radius: 999px;
          background: #9d9d9d;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          cursor: pointer;
          transition: background-color 180ms ease;
        }

        .personalize-toggle span {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          background: #ffffff;
          display: block;
          transition: transform 180ms ease;
        }

        .personalize-toggle.is-on {
          background: #2db68f;
        }

        .personalize-toggle.is-on span {
          transform: translateX(34px);
        }

        .personalize-divider {
          width: 100%;
          height: 1px;
          background: #dededb;
          margin: 40px 0;
        }

        .personalize-media-panel,
        .message-panel {
          margin-top: 34px;
          animation: personalizePanelIn 240ms ease both;
        }

        @keyframes personalizePanelIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .personalize-tabs {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }

        .personalize-tabs button {
          height: 66px;
          border: 0;
          border-radius: 999px;
          background: #f5f5f4;
          color: #4b4b4b;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.6px;
          padding: 0 28px;
          cursor: pointer;
        }

        .personalize-tabs button.is-active {
          background: #cbe534;
          color: #000000;
        }

        .media-card-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .media-card-tile {
          height: 118px;
          border: 0;
          border-radius: 12px;
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
          letter-spacing: -0.35px;
          cursor: pointer;
          padding: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition:
            transform 150ms ease,
            outline 150ms ease;
        }

        .media-card-tile:hover {
          transform: translateY(-2px);
        }

        .media-card-tile.is-selected {
          outline: 4px solid #cbe534;
          outline-offset: 3px;
        }

        .media-card-0 {
          background: #0f4c3a;
        }

        .media-card-1 {
          background: #54106e;
        }

        .media-card-2 {
          background: #cbe534;
          color: #000000;
        }

        .media-card-3 {
          background: #f09cd9;
        }

        .media-card-4 {
          background: #121a2a;
        }

        .media-card-5 {
          background: #fff0f8;
          color: #6c2b8e;
        }

        .media-card-6 {
          background: #ffcc00;
          color: #000000;
        }

        .media-card-7 {
          background: #844ca1;
        }

        .gif-search {
          width: 100%;
          height: 72px;
          border: 2px solid #111111;
          border-radius: 999px;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 28px;
          margin-bottom: 30px;
        }

        .gif-search span {
          font-size: 40px;
          line-height: 1;
          color: #111111;
        }

        .gif-search input {
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: #111111;
          font-size: 26px;
          font-weight: 500;
        }

        .gif-search input::placeholder {
          color: #4b4b4b;
        }

        .gif-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .gif-tile {
          height: 120px;
          border: 0;
          border-radius: 10px;
          background: #f3f3f1;
          font-size: 58px;
          cursor: pointer;
          transition: transform 150ms ease;
        }

        .gif-tile:hover {
          transform: translateY(-2px);
        }

        .gif-tile.is-selected {
          outline: 4px solid #cbe534;
          outline-offset: 3px;
        }

        .giphy-footer {
          margin-top: 30px;
          color: #b9b9b9;
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .giphy-footer strong {
          color: #777777;
          font-size: 44px;
          font-weight: 900;
        }

        .video-upload-panel p {
          margin: 0 0 32px 0;
          color: #111111;
          font-size: 24px;
          line-height: 1.45;
          font-weight: 500;
          font-style: italic;
          letter-spacing: -0.3px;
        }

        .media-file-input {
          display: none;
        }

        .video-upload-panel button {
          width: 100%;
          min-height: 72px;
          border-radius: 8px;
          border: 2px solid #111111;
          background: #ffffff;
          color: #111111;
          font-size: 24px;
          font-weight: 900;
          cursor: pointer;
          padding: 18px 24px;
          overflow-wrap: anywhere;
        }

        .video-upload-panel button.has-uploaded-file {
          border-color: #cbe534;
          background: #f6ffd6;
          color: #000000;
        }

        .message-panel {
          position: relative;
        }

        .message-panel textarea {
          width: 100%;
          height: 280px;
          resize: none;
          border: 1.5px solid #c7c7c4;
          border-radius: 8px;
          padding: 34px 34px 56px 34px;
          outline: none;
          color: #111111;
          font-size: 25px;
          line-height: 1.25;
          font-weight: 500;
        }

        .message-panel textarea::placeholder {
          color: #777777;
        }

        .message-panel textarea:focus {
          border-color: #111111;
          box-shadow: 0 0 0 3px rgba(203, 229, 52, 0.35);
        }

        .message-count {
          position: absolute;
          right: 26px;
          bottom: 18px;
          color: #111111;
          font-size: 18px;
          font-weight: 700;
        }

        .personalize-continue-button {
          width: 100%;
          height: 78px;
          margin-top: 46px;
          border: 0;
          border-radius: 999px;
          font-size: 27px;
          font-weight: 900;
          letter-spacing: -0.5px;
          transition:
            background-color 180ms ease,
            color 180ms ease,
            transform 180ms ease,
            opacity 180ms ease;
        }

        .personalize-continue-button.is-lime {
          background: #cbe534;
          color: #000000;
          cursor: pointer;
        }

        .personalize-continue-button.is-grey {
          background: #a7a7a7;
          color: #ffffff;
          cursor: not-allowed;
        }

        .personalize-continue-button.is-lime:hover {
          transform: translateY(-2px);
        }

        .checkout-page {
          min-height: 100vh;
          width: 100%;
          background: #ffffff;
          color: #000000;
        }

        .checkout-header {
          position: relative;
          height: 96px;
          border-bottom: 1px solid #dededb;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkout-logo-wrap {
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkout-logo-image {
          height: 58px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .checkout-back-button {
          position: absolute;
          left: 54px;
          top: 50%;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #8e8e8e;
          font-size: 18px;
          font-weight: 800;
          cursor: pointer;
        }

        .checkout-back-button:hover {
          color: #000000;
        }

        .checkout-close-button {
          position: absolute;
          right: 54px;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border: 0;
          border-radius: 999px;
          background: #f1f1ef;
          color: #000000;
          font-size: 36px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 4px;
        }

        .checkout-close-button:hover {
          background: #e0e0dd;
        }

        .checkout-frame {
          width: 1440px;
          min-height: 930px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 760px 680px;
        }

        .checkout-form-side {
          padding: 58px 76px 80px 76px;
          background: #ffffff;
        }

        .checkout-summary-side {
          padding: 58px 76px;
          background: #f3f3f1;
          border-left: 1px solid #dededb;
        }

        .express-checkout {
          width: 88%;
          margin: 36px auto 0 auto;
        }

        .express-checkout p {
          margin: 0 0 18px 0;
          color: #777777;
          text-align: center;
          font-size: 16px;
          font-weight: 700;
        }

        .express-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .apple-pay-button,
        .google-pay-button {
          height: 70px;
          border: 0;
          border-radius: 12px;
          background: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
        }

        .apple-pay-button img,
        .google-pay-button img {
          width: auto;
          height: 46px;
          max-width: 84%;
          object-fit: contain;
          display: block;
        }

        .checkout-or {
          margin: 30px 0;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
        }

        .checkout-or span {
          height: 1px;
          background: #dededb;
        }

        .checkout-or p {
          margin: 0;
          color: #777777;
          font-size: 15px;
          font-weight: 800;
        }

        .checkout-section {
          margin-top: 34px;
        }

        .checkout-contact-section {
          margin-top: 0;
        }

        .checkout-section h2 {
          margin: 0 0 16px 0;
          font-size: 25px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .checkout-muted {
          margin: -6px 0 18px 0;
          color: #777777;
          font-size: 16px;
          font-weight: 600;
        }

        .checkout-input-wrap {
          display: block;
        }

        .checkout-input-wrap span {
          display: none;
        }

        .checkout-input-wrap input,
        .payment-card-body input,
        .billing-card input,
        .billing-card select,
        .checkout-discount-row input {
          width: 100%;
          height: 58px;
          border: 1.5px solid #d7d7d4;
          border-radius: 13px;
          background: #ffffff;
          color: #000000;
          font-size: 17px;
          font-weight: 600;
          padding: 0 16px;
          outline: none;
        }

        .billing-card select {
          appearance: none;
          -webkit-appearance: none;
          background-image:
            linear-gradient(45deg, transparent 50%, #111111 50%),
            linear-gradient(135deg, #111111 50%, transparent 50%);
          background-position:
            calc(100% - 34px) 50%,
            calc(100% - 24px) 50%;
          background-size:
            10px 10px,
            10px 10px;
          background-repeat: no-repeat;
          padding-right: 58px;
        }

        .checkout-input-wrap input:focus,
        .payment-card-body input:focus,
        .billing-card input:focus,
        .billing-card select:focus,
        .checkout-discount-row input:focus {
          border-color: #000000;
          box-shadow: 0 0 0 3px rgba(203, 229, 52, 0.35);
        }

        .checkout-required-note {
          margin: 10px 0 0 0;
          color: #777777;
          font-size: 14px;
          font-weight: 700;
        }

        .checkout-checkbox {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
        }

        .checkout-checkbox input {
          width: 22px;
          height: 22px;
          accent-color: #000000;
        }

        .payment-card {
          border: 1.5px solid #111111;
          border-radius: 14px;
          overflow: hidden;
          background: #f7f7f5;
        }

        .payment-card-header {
          height: 62px;
          border-bottom: 1.5px solid #111111;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px;
          font-size: 17px;
          font-weight: 700;
        }

        .payment-card-icons {
          display: flex;
          gap: 8px;
        }

        .payment-card-icons span {
          border-radius: 5px;
          background: #000000;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          padding: 6px 8px;
        }

        .payment-card-body {
          padding: 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .billing-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

.checkout-page {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.checkout-frame {
  height: calc(100vh - 74px) !important;
  min-height: calc(100vh - 74px) !important;
  overflow: hidden !important;
}

.checkout-form-side,
.checkout-summary-side {
  height: 100% !important;
  overflow: visible !important;
}

.checkout-review-section {
  margin-top: 34px;
}

.checkout-review-section h2 {
  margin-bottom: 8px;
}

.checkout-review-card {
  margin-top: 20px;
  border: 2px solid #171717;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.checkout-review-row {
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e5df;
  color: #171717;
}

.checkout-review-row:last-child {
  border-bottom: 0;
}

.checkout-review-row span {
  color: #777777;
  font-size: 15px;
  line-height: 1.1;
  font-weight: 850;
}

.checkout-review-row strong {
  min-width: 0;
  color: #171717;
  font-size: 17px;
  line-height: 1.15;
  font-weight: 950;
  overflow-wrap: anywhere;
}

.checkout-review-stripe-note {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #5f5f5f;
  font-size: 15px;
  line-height: 1.25;
  font-weight: 800;
}

.checkout-review-stripe-note span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #ccff00;
  color: #171717;
  font-size: 14px;
  font-weight: 950;
}

.main-shell:has(.checkout-page) {
  overflow-y: auto !important;
}

.page-content:has(.checkout-page) {
  min-height: 100vh !important;
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
}

.checkout-page {
  min-height: 100vh !important;
  height: auto !important;
  max-height: none !important;
  overflow: visible !important;
}

.checkout-frame {
  min-height: calc(100vh - 74px) !important;
  height: auto !important;
  overflow: visible !important;
}

.checkout-form-side,
.checkout-summary-side {
  min-height: auto !important;
  height: auto !important;
  overflow: visible !important;
}

        .checkout-pay-button {
          position: relative;
          z-index: 5;
          pointer-events: auto;
          width: 100%;
          height: 66px;
          margin-top: 34px;
          border: 0;
          border-radius: 999px;
          background: #d7d7d4;
          color: #777777;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.5px;
          cursor: not-allowed;
        }

        .checkout-pay-button.is-ready {
          background: #cbe534;
          color: #000000;
          cursor: pointer;
        }

        .checkout-pay-button.is-ready:hover {
          transform: translateY(-2px);
          box-shadow: 0px 12px 28px rgba(0, 0, 0, 0.14);
        }

        .checkout-summary-card {
          position: sticky;
          top: 40px;
        }

        .checkout-product-row {
          display: grid;
          grid-template-columns: 132px 1fr auto;
          align-items: center;
          gap: 22px;
        }

        .checkout-product-thumb {
          position: relative;
          width: 120px;
          height: 72px;
          border-radius: 15px;
          overflow: hidden;
          background: transparent;
          box-shadow: none;
        }

        .checkout-product-thumb img {
          position: static;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .checkout-product-copy h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .checkout-product-copy p {
          margin: 6px 0 0 0;
          color: #777777;
          font-size: 14px;
          font-weight: 700;
        }

        .checkout-product-price {
          font-size: 17px;
          font-weight: 800;
        }

        .checkout-discount-row {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 1fr 82px;
          gap: 12px;
        }

        .checkout-discount-row button {
          border: 1.5px solid #d7d7d4;
          border-radius: 13px;
          background: #eeeeeb;
          color: #777777;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
        }

        .checkout-total-row {
          margin-top: 58px;
          padding-top: 28px;
          border-top: 1px solid #dededb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .checkout-total-row span {
          font-size: 22px;
          font-weight: 700;
        }

        .checkout-total-row strong {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.6px;
        }

        .checkout-summary-note {
          margin-top: 30px;
          border-radius: 20px;
          background: #ffffff;
          padding: 18px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.07);
        }

        .checkout-summary-note span {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          background: #cbe534;
          color: #000000;
          font-size: 15px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .checkout-summary-note p {
          margin: 0;
          color: #555555;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
        }

        .carousel-window {
          --carousel-size: 26.45vw;
          --carousel-gap: 2.2vw;
          left: 52.7%;
          top: 0;
          width: var(--carousel-size);
          height: 100vh;
        }

.carousel-track {
  gap: var(--carousel-gap);
  animation: carouselStep 11s ease-in-out infinite;
  pointer-events: auto;
}

.carousel-card-link {
  width: var(--carousel-size);
  height: var(--carousel-size);
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 2vw;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  display: block;
  overflow: hidden;
  pointer-events: auto;
}

.carousel-card {
  width: var(--carousel-size);
  height: var(--carousel-size);
  object-fit: cover;
  border-radius: 2vw;
  flex-shrink: 0;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

        .word-window {
          position: relative;
          margin-top: 0.15vw;
          height: 3.2vw;
          width: 62vw;
          overflow: hidden;
          background: #f4f4f2;
        }

        .word-image {
          position: absolute;
          left: 50%;
          top: 50%;
          height: 2.35vw;
          width: 55vw;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
          pointer-events: none;
          translate: -50% -50%;
        }

        .word-enter {
          animation: wordEnter 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .word-exit {
          animation: wordExit 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @media (max-width: 1700px) {
          .linktree-nav-shell {
            transform: translateX(-50%) translateY(0) scale(1.02);
            transform-origin: top center;
          }

          .linktree-nav-shell.nav-hidden {
            transform: translateX(-50%) translateY(-160%) scale(1.02);
          }

          .hero-bg {
            width: 112%;
            height: 112%;
            left: -6%;
            top: -6%;
            max-width: none;
          }

          .start-browsing-button {
            left: 28.95%;
            top: 65.9%;
            height: 4.15%;
            width: 12.8%;
          }

          .gift-browser-frame,
          .linktree-smart-frame,
          .recipient-frame,
          .personalize-frame,
          .checkout-frame {
            transform: scale(calc(100vw / 1440));
            transform-origin: top center;
          }

          .carousel-window {
            --carousel-size: 29vw;
            --carousel-gap: 2.2vw;
            left: 52.7%;
            width: var(--carousel-size);
          }
        }

@media (min-width: 1701px) {
  .linktree-nav-shell {
    transform: translateX(-50%) translateY(0) scale(1.5) !important;
    transform-origin: top center !important;
  }

  .linktree-nav-shell.nav-hidden {
    transform: translateX(-50%) translateY(-160%) scale(1.5) !important;
  }

.main-shell:has(.checkout-page) {
  overflow-y: hidden !important;
}

.page-content:has(.checkout-page) {
  height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.checkout-page {
  height: 100vh !important;
  min-height: 100vh !important;
  max-height: 100vh !important;
  overflow: hidden !important;
}

.checkout-frame {
  height: calc(100vh - 74px) !important;
  min-height: calc(100vh - 74px) !important;
  overflow: hidden !important;
}

.gift-tracker-page {
  padding: 202px 24px 42px !important;
}

.gift-tracker-hero {
  width: min(1430px, calc(100vw - 104px)) !important;
  grid-template-columns: 485px minmax(860px, 1fr) !important;
  gap: 51px !important;
  transform: scale(1.17) !important;
  transform-origin: top center !important;
}

.gift-tracker-chat-card {
  min-height: 620px !important;
}

.gift-tracker-help-card {
  padding: 72px 78px 66px !important;
}

.gift-tracker-help-card h1 {
  font-size: 84px !important;
}

.tracker-subtitle {
  font-size: 22.5px !important;
  max-width: 740px !important;
}

.tracker-search-bar {
  width: min(790px, 100%) !important;
  min-height: 74px !important;
}

.tracker-search-bar button {
  height: 58px !important;
  padding: 0 38px !important;
}

.tracker-topic-grid {
  gap: 23px !important;
}

.tracker-topic-grid button {
  min-height: 123px !important;
  font-size: 16.5px !important;
}

.gift-tracker-help-card h2,
.tracker-complaint-card h3 {
  font-size: 28px !important;
}

  .gift-browser-frame,
  .linktree-smart-frame,
  .recipient-frame,
  .personalize-frame {
    transform: scale(1.5) !important;
    transform-origin: top center !important;
  }

.how-it-works-frame {
  transform: scale(1.22) !important;
  transform-origin: top center !important;
}  

.how-it-works-page {
  padding: 185px 24px 260px !important;
}

.how-faq-list {
  padding-bottom: 70px !important;
}

  .checkout-page {
    background: #f3f3f1 !important;
    min-height: 100vh !important;
    overflow: visible !important;
  }

  .checkout-frame {
    position: relative !important;
    transform: none !important;
    zoom: 1.5;
    transform-origin: top center !important;
    background: #f3f3f1 !important;
    align-items: flex-start !important;
    overflow: visible !important;
  }

  .checkout-frame::before {
    content: "" !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 760px !important;
    height: 100% !important;
    min-height: 100vh !important;
    background: #ffffff !important;
    z-index: 0 !important;
    pointer-events: none !important;
  }

  .checkout-frame::after {
    content: "" !important;
    position: absolute !important;
    left: 760px !important;
    top: 0 !important;
    width: 1px !important;
    height: 100% !important;
    min-height: 100vh !important;
    background: #dededb !important;
    z-index: 2 !important;
    pointer-events: none !important;
  }

  .checkout-form-side {
    position: relative !important;
    z-index: 1 !important;
    background: transparent !important;
    min-height: 100vh !important;
  }

  .checkout-summary-side {
    position: relative !important;
    z-index: 1 !important;
    background: #f3f3f1 !important;
    border-left: 0 !important;
    align-self: flex-start !important;
    min-height: 100vh !important;
  }

  .checkout-summary-card {
    position: sticky !important;
    top: 72px !important;
    align-self: flex-start !important;
  }

  .checkout-logo-image {
    transform: scale(1.28) !important;
    transform-origin: center center !important;
  }

  .landing-claim-section {
    height: 46vh !important;
    min-height: 46vh !important;
    overflow: hidden !important;
  }

  .landing-claim-frame {
    transform: translateY(4.5vh) scale(1.28) !important;
    transform-origin: center center !important;
  }

  .landing-claim-title {
    transform: scale(1.18) !important;
    transform-origin: center center !important;
  }

  .landing-claim-form {
    transform: scale(1.12) !important;
    transform-origin: center center !important;
  }

.landing-blue-dude {
  transform: translateX(-30px) translateY(1.2vh) scale(1) !important;
  transform-origin: bottom center !important;
}

  .landing-purple-shape {
    transform: translateY(-1.5vh) scale(1.12) !important;
    transform-origin: center center !important;
  }

  .country-change-toast {
    top: 135px !important;
    font-size: 24px !important;
    padding: 18px 30px !important;
    border-radius: 999px !important;
  }
}

        @keyframes wordEnter {
          0% {
            opacity: 0;
            translate: -50% 85%;
          }

          100% {
            opacity: 1;
            translate: -50% -50%;
          }
        }

        @keyframes wordExit {
          0% {
            opacity: 1;
            translate: -50% -50%;
          }

          100% {
            opacity: 0;
            translate: -50% -185%;
          }
        }

        .gift-card-row {
          animation: giftCardMove 28s linear infinite;
        }

        @keyframes giftCardMove {
          0% {
            transform: translateX(-4vw);
          }

          100% {
            transform: translateX(calc(-33.333% - 1vw));
          }
        }

@keyframes carouselStep {
  0% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 1)));
  }

  22% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 1)));
  }

  32% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 2)));
  }

  54% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 2)));
  }

  64% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 3)));
  }

  86% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 3)));
  }

  96% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 4)));
  }

  100% {
    transform: translateY(calc(50vh - (var(--carousel-size) / 2) - ((var(--carousel-size) + var(--carousel-gap)) * 4)));
  }
}
          .landing-claim-section {
  position: relative;
  width: 100%;
  height: 459px;
  overflow: hidden;
  background: #461f67;
}

.landing-claim-frame {
  position: relative;
  width: 1440px;
  height: 459px;
  margin: 0 auto;
  overflow: visible;
  background: #461f67;
}

.landing-blue-dude {
  position: absolute;
  left: 183px;
  top: 0;
  width: 465px;
  height: auto;
  max-width: none;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
}

.landing-claim-title {
  position: absolute;
  left: 435px;
  top: 142px;
  width: 570px;
  margin: 0;
  color: #e5b8e5;
  font-size: 32.888px;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -1.316px;
  text-align: center;
}

.landing-claim-form {
  position: absolute;
  left: 552px;
  top: 285px;
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 5;
}

.landing-claim-input {
  width: 168px;
  height: 35.043px;
  margin: 0;
  padding: 0 0 0 13px;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  outline: 0;
  background: #ffffff;
  color: #000000;
  font-size: 10.687px;
  font-weight: 500;
}

.landing-claim-input::placeholder {
  color: #888888;
  opacity: 1;
}

.landing-claim-button {
  width: 174px;
  height: 35.392px;
  border-radius: 18.125px;
  background: #cbe534;
  color: #000000;
  font-size: 10.739px;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.landing-purple-shape {
  position: absolute;
  left: 1032px;
  top: 380px;
  width: 185px;
  height: auto;
  max-width: none;
  object-fit: contain;
  display: block;
  pointer-events: none;
  user-select: none;
}
                  /* MOBILE RESPONSIVE FIX */

        @media (max-width: 768px) {
          html,
          body {
            width: 100%;
            overflow-x: hidden;
          }

          .main-shell {
            width: 100%;
            overflow-x: hidden;
          }

          .page-content {
            width: 100%;
          }

          img {
            max-width: 100%;
          }

          .linktree-nav-shell {
            left: 12px;
            right: 12px;
            top: 12px;
            width: auto;
            height: 62px;
            transform: none !important;
          }

          .linktree-nav-shell.nav-hidden {
            transform: translateY(-130%) !important;
          }

          .linktree-nav {
            width: 100%;
            height: 62px;
            border-radius: 999px;
          }

          .linktree-logo-link {
            left: 18px;
            top: 12px;
            width: 86px;
            height: 38px;
          }

          .linktree-logo {
            width: 86px;
            height: 38px;
          }

          .linktree-nav-item,
          .login-button {
            display: none;
          }

          .signup-button {
            left: auto;
            right: 12px;
            top: 10px;
            width: 112px;
            height: 42px;
            border-radius: 999px;
            font-size: 12px;
          }

          .country-area {
            position: fixed;
            left: 12px;
            right: 12px;
            top: 82px;
            width: auto;
            height: 44px;
            z-index: 998;
          }

          .country-pill {
            width: 100%;
            height: 44px;
            font-size: 12px;
            padding: 0 16px;
          }

          .country-menu {
            width: 100%;
            top: 52px;
          }

          .country-change-toast {
            top: 14px;
            width: calc(100vw - 24px);
            min-width: 0;
            height: 44px;
            font-size: 13px;
          }

          .carousel-window {
            display: none;
          }

          .hero-bg {
            width: 100% !important;
            height: 100% !important;
            left: 0 !important;
            top: 0 !important;
            object-fit: cover;
            object-position: center;
          }

          .start-browsing-button {
            left: 50%;
            top: 68%;
            width: 52%;
            height: 54px;
            transform: translateX(-50%);
          }

          .word-window {
            width: 90vw;
            height: 52px;
          }

          .word-image {
            width: 86vw;
            height: 42px;
          }

          .gift-card-row img {
            height: 118px !important;
            width: 190px !important;
            border-radius: 16px !important;
          }

          .blue-start-gifting-button {
            left: 50%;
            top: 64%;
            width: 54%;
            height: 54px;
            transform: translateX(-50%);
          }

          .claim-linktree-button {
            left: 50%;
            top: 61%;
            width: 50%;
            height: 50px;
            transform: translateX(-50%);
          }

          .gift-browser-page {
            display: block;
            padding: 150px 16px 70px;
            min-height: 100vh;
          }

          .gift-browser-frame {
            position: relative;
            width: 100%;
            min-height: auto;
            transform: none !important;
            background: transparent;
          }

          .hero-image-wrap {
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
            height: auto;
          }

          .hero-image {
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
            height: auto;
            transform: none;
          }

          .search-control,
          .category-filter,
          .featured-filter,
          .browser-title,
          .browser-subtitle,
          .browser-no-results,
          .browser-card-grid {
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
          }

          .search-control {
            height: 56px;
            margin-top: 24px;
            border-radius: 999px;
          }

          .search-icon-image {
            left: 14px;
            top: 8px;
            width: 40px;
            height: 40px;
          }

          .search-input {
            left: 64px;
            width: calc(100% - 88px);
            height: 56px;
            font-size: 16px;
          }

          .search-input::placeholder {
            font-size: 16px;
          }

          .category-filter,
          .featured-filter {
            margin-top: 12px;
          }

          .category-control,
          .featured-control {
            height: 54px;
            border-radius: 999px;
            font-size: 16px;
          }

          .category-control span,
          .featured-control span {
            left: 22px;
            top: 17px;
            width: calc(100% - 70px);
          }

          .category-arrow,
          .featured-arrow {
            left: auto;
            right: 22px;
            top: 18px;
            width: 24px;
            height: 18px;
          }

          .category-menu,
          .featured-menu {
            top: 64px;
            border-radius: 22px;
          }

          .browser-title {
            margin-top: 34px;
            font-size: 32px;
            line-height: 1;
          }

          .browser-subtitle {
            margin-top: 12px;
            font-size: 17px;
            line-height: 1.25;
          }

          .browser-card-grid {
            margin-top: 34px;
            grid-template-columns: 1fr;
            gap: 22px;
          }

          .gift-card-tile {
            height: 300px;
            border-radius: 24px;
          }

          .gift-card-image-wrap {
            height: 198px;
            border-radius: 24px 24px 0 0;
          }

          .gift-card-title {
            left: 22px;
            top: 218px;
            width: calc(100% - 44px);
            font-size: 20px;
          }

          .gift-card-range {
            left: 22px;
            top: 252px;
            width: calc(100% - 44px);
            font-size: 17px;
          }

          .linktree-smart-page,
          .recipient-page,
          .personalize-page {
            display: block;
            min-height: 100vh;
            padding: 26px 16px 70px;
          }

          .linktree-smart-frame,
          .recipient-frame,
          .personalize-frame {
            position: relative;
            width: 100%;
            height: auto;
            min-height: auto;
            transform: none !important;
            background: transparent;
          }

          .linktree-smart-frame.has-continue {
            height: auto;
            padding-bottom: 100px;
          }

          .linktree-back-button,
          .recipient-back-button,
          .personalize-back-button {
            position: relative;
            left: auto;
            top: auto;
            display: inline-flex;
            margin-bottom: 24px;
            font-size: 16px;
          }

          .product-info-column,
          .product-info-value,
          .recipient-left,
          .recipient-right {
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
          }

          .product-info-image-wrap {
            width: 100%;
            height: auto;
            aspect-ratio: 5 / 3;
            border-radius: 26px;
          }

          .product-info-title,
          .product-info-copy,
          .product-info-link,
          .product-info-expiry {
            width: 100%;
          }

          .product-info-title {
            margin-top: 26px;
            font-size: 34px;
            line-height: 0.98;
          }

          .product-info-copy {
            margin-top: 18px;
            font-size: 18px;
            line-height: 1.15;
          }

          .product-info-link {
            margin-top: 24px;
            font-size: 17px;
          }

          .product-info-expiry {
            margin-top: 28px;
            font-size: 26px;
          }

          .linktree-purchase-heading {
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
            min-height: auto;
            margin-top: 44px;
            font-size: 34px;
            line-height: 1;
          }

          .linktree-amount-panel {
            display: none;
          }

          .linktree-amount-button {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: calc(50% - 8px) !important;
            height: 56px !important;
            margin: 7px 4px;
            display: inline-flex;
            vertical-align: top;
            border-radius: 999px;
            font-size: 17px;
          }

          .linktree-continue-button {
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
            height: 62px;
            margin-top: 24px;
            font-size: 24px;
          }

          .recipient-close-button,
          .personalize-close-button {
            right: 0;
            top: 0;
            width: 44px;
            height: 44px;
            font-size: 30px;
          }

          .recipient-right {
            margin-top: 44px;
          }

          .recipient-value-row,
          .recipient-divider,
          .recipient-toggle,
          .creator-card,
          .myself-card,
          .recipient-form-card,
          .recipient-final-button {
            width: 100%;
          }

          .recipient-value-row {
            height: auto;
          }

          .recipient-value-row h2 {
            font-size: 24px;
          }

          .recipient-value-pill {
            min-width: 104px;
            height: 50px;
            font-size: 25px;
          }

          .recipient-question {
            margin: 30px 0 18px;
            font-size: 38px;
            line-height: 1;
          }

          .recipient-toggle {
            height: auto;
            border-radius: 28px;
            grid-template-columns: 1fr;
          }

          .recipient-toggle button {
            height: 48px;
            font-size: 16px;
          }

          .creator-picker {
            position: relative;
            left: auto;
            top: auto;
            width: 100%;
            margin-top: 22px;
            padding: 20px;
            border-radius: 24px;
          }

          .creator-picker-header button {
            display: none !important;
          }

          .creator-list-item {
            grid-template-columns: 52px 1fr auto;
            gap: 12px;
            padding: 12px;
          }

          .creator-list-avatar {
            width: 52px;
            height: 52px;
          }

          .creator-list-copy div {
            font-size: 18px;
          }

          .creator-list-copy p {
            font-size: 13px;
          }

          .creator-list-item span {
            font-size: 12px;
            padding: 8px 10px;
          }

          .recipient-form-card {
            padding: 20px;
          }

          .recipient-form-card input {
            height: 58px;
            font-size: 20px;
          }

          .recipient-final-button {
            height: 62px;
            font-size: 24px;
          }

          .personalize-card {
            width: 100%;
            margin: 0 0 40px;
            padding: 28px 20px;
          }

          .personalize-card h1 {
            font-size: 36px;
          }

          .personalize-subtitle {
            margin: 18px 0 32px;
            font-size: 20px;
          }

          .personalize-tabs {
            overflow-x: auto;
          }

          .personalize-tabs button {
            height: 50px;
            font-size: 16px;
            white-space: nowrap;
          }

          .media-card-grid,
          .gif-grid {
            grid-template-columns: 1fr 1fr;
          }

          .checkout-header {
            height: 78px;
          }

          .checkout-logo-image {
            height: 42px;
          }

          .checkout-back-button {
            left: 16px;
            font-size: 15px;
          }

          .checkout-close-button {
            right: 16px;
            width: 42px;
            height: 42px;
            font-size: 30px;
          }

          .checkout-frame {
            width: 100%;
            min-height: auto;
            display: flex;
            flex-direction: column-reverse;
            transform: none !important;
          }

          .checkout-form-side,
          .checkout-summary-side {
            padding: 24px 16px;
          }

          .checkout-summary-side {
            border-left: 0;
            border-bottom: 1px solid #dededb;
          }

          .checkout-summary-card {
            position: relative;
            top: auto;
          }

          .express-buttons,
          .payment-grid {
            grid-template-columns: 1fr;
          }

          .checkout-product-row {
            grid-template-columns: 92px 1fr auto;
            gap: 12px;
          }

          .checkout-product-thumb {
            width: 88px;
            height: 56px;
          }
        }

        /* END MOBILE RESPONSIVE FIX */
                /* MOBILE HERO FIX */

        @media (max-width: 768px) {
          .main-shell {
            background: #cbea19 !important;
          }

          .hero-bg {
            width: 100% !important;
            height: auto !important;
            left: 0 !important;
            top: 150px !important;
            object-fit: contain !important;
            object-position: top center !important;
            max-width: none !important;
          }

          .start-browsing-button {
            left: 50% !important;
            top: 64% !important;
            width: 60% !important;
            height: 54px !important;
            transform: translateX(-50%) !important;
          }

          .country-area {
            top: 94px !important;
          }

          .linktree-nav-shell {
            top: 18px !important;
          }
        }

        
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
          animation: routePageEnter 240ms ease-out both;
          will-change: opacity, transform;
        }

        .route-entering .checkout-page,
        .route-entering .personalize-page,
        .route-entering .recipient-page,
        .route-entering .linktree-smart-page,
        .route-entering .gift-browser-page {
          animation: routePanelEnter 240ms ease-out both;
        }

        @keyframes routePageEnter {
          0% {
            opacity: 0;
            transform: translateY(4px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes routePanelEnter {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
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


        /* END MOBILE HERO FIX */

@media (max-width: 768px) {
  .home-hero {
    height: 182.3009vw !important;
    min-height: 0 !important;
    background: #cbe534 !important;
  }

  .home-hero > .hero-bg,
  .home-hero > .start-browsing-button,
  .home-hero > .carousel-window {
    display: none !important;
  }

  .mobile-home-hero {
    position: absolute;
    inset: 0;
    display: block;
    overflow: hidden;
    background: #cbe534;
  }

  .mobile-home-title-wrap {
    position: absolute;
    left: 1.3274vw;
    top: 28.3186vw;
    width: 93.8053vw;
    height: 40vw;
  }

  .mobile-home-title-image {
    position: absolute;
    left: 16.3717vw;
    top: 5.7522vw;
    width: 73.0088vw;
    height: auto;
    display: block;
    object-fit: contain;
    pointer-events: none;
  }

  .mobile-home-gift-tag {
    position: absolute;
    left: 0;
    top: 0;
    width: 25.2991vw;
    height: 25.2991vw;
    object-fit: contain;
    filter: drop-shadow(
      0 0.9881vw 1.3834vw rgba(0, 0, 0, 0.1)
    );
  }

  .mobile-home-gift-box {
    position: absolute;
    left: 53.7611vw;
    top: 2.7655vw;
    width: 15.0212vw;
    height: 15.0212vw;
    object-fit: contain;
    filter: drop-shadow(
      0 0.9881vw 1.3834vw rgba(0, 0, 0, 0.1)
    );
  }

  .mobile-home-gift-card {
    position: absolute;
    left: 73.1327vw;
    top: 7.5088vw;
    width: 20.5558vw;
    height: 20.5558vw;
    object-fit: contain;
    filter: drop-shadow(
      0 0.9881vw 1.3834vw rgba(0, 0, 0, 0.1)
    );
  }

  .mobile-home-subtitle {
    position: absolute;
    left: 8.8496vw;
    top: 75.2212vw;
    width: 82.3009vw;
    margin: 0;
    color: #22451b;
    font-size: 4.35vw;
    font-weight: 400;
    line-height: 1.22;
    letter-spacing: -0.06vw;
  }

  .mobile-home-input {
    position: absolute;
    left: 8.8496vw;
    top: 99.5575vw;
    width: 81.8584vw;
    height: 12.8319vw;
    padding: 0 3.9823vw;
    border: 0.3774vw solid #ebebeb;
    border-radius: 1.5097vw;
    outline: none;
    background: #ffffff;
    color: #888888;
    font-size: 3.9133vw;
    font-weight: 500;
  }

  .mobile-home-input::placeholder {
    color: #888888;
    opacity: 1;
  }

  .mobile-home-sparkle {
    position: absolute;
    left: -13.2743vw;
    top: 94.6903vw;
    width: 43.8832vw;
    height: 43.8832vw;
    object-fit: contain;
    transform: rotate(-7.48deg);
    pointer-events: none;
  }

  .mobile-home-cta {
    position: absolute;
    left: 13.7168vw;
    top: 116.5177vw;
    width: 72.9951vw;
    height: 12.0212vw;
    border-radius: 6.1562vw;
    background: #22451b;
    color: #ffffff;
    font-size: 3.9vw;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    z-index: 4;
  }

  .mobile-home-heart {
    position: absolute;
    left: 74.7788vw;
    top: 109.4381vw;
    width: 22.5664vw;
    height: 22.5664vw;
    object-fit: contain;
    pointer-events: none;
    z-index: 5;
  }

  .mobile-home-campaign-card {
    position: absolute;
    left: 7.5221vw;
    top: 137.1681vw;
    width: 84.9558vw;
    height: 84.9558vw;
    overflow: hidden;
    border-radius: 5.3097vw;
    background: transparent;
    display: block;
  }

  .mobile-home-campaign-card img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
}

/* Never show mobile-only elements on desktop */
@media (min-width: 769px) {
  .linktree-mobile-logo,
  .mobile-menu-button,
  .mobile-nav-menu,
  .mobile-home-hero {
    display: none !important;
  }
}

/* =========================================================
   FINAL MOBILE OVERRIDE
   This must remain the final CSS in the style block.
   ========================================================= */

@media (max-width: 768px) {
  .main-shell {
    background: #cbe534 !important;
  }

  /* Hide the entire original desktop hero on mobile */
  .home-hero > :not(.mobile-home-hero) {
    display: none !important;
  }

  .home-hero {
    position: relative !important;
    width: 100% !important;
    height: 194vw !important;
    min-height: 0 !important;
    overflow: hidden !important;
    background: #cbe534 !important;
  }

  .mobile-home-hero {
    position: absolute !important;
    inset: 0 !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    background: #cbe534 !important;
  }

  /* MOBILE NAV */

  .linktree-nav-shell {
    position: fixed !important;
    left: 3.5vw !important;
    right: auto !important;
    top: 6vw !important;
    width: 93vw !important;
    height: 16.5vw !important;
    transform: none !important;
    z-index: 999 !important;
  }

  .linktree-nav-shell.nav-hidden {
    transform: translateY(-150%) !important;
  }

  .linktree-nav {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    border: 1px solid #ebebeb !important;
    border-radius: 10vw !important;
    background: #ffffff !important;
    box-shadow: none !important;
    overflow: visible !important;
  }

  /* Mobile Linktree icon */

  .linktree-logo-link {
    position: absolute !important;
    display: block !important;
    left: 5.5vw !important;
    top: 4.2vw !important;
    width: 7.8vw !important;
    height: 7.8vw !important;
    padding: 0 !important;
    z-index: 5 !important;
  }

  .linktree-logo {
    display: none !important;
  }

  .linktree-mobile-logo {
    position: absolute !important;
    display: block !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }

  /* Hide desktop navigation items */

  .linktree-nav-item,
  .login-button,
  .signup-button {
    display: none !important;
  }

  /* Keep Shop Gift Cards visible */

  .linktree-nav-item.shop-link {
    position: absolute !important;
    display: flex !important;
    left: 15.5vw !important;
    top: 5.8vw !important;
    width: 28vw !important;
    height: 5vw !important;
    align-items: center !important;
    justify-content: flex-start !important;
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: #111111 !important;
    font-size: 3.15vw !important;
    font-weight: 700 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    z-index: 5 !important;
  }

  /* Country selector inside the white nav */

  .country-area {
    position: absolute !important;
    left: 43.5vw !important;
    right: auto !important;
    top: 4.2vw !important;
    width: 35vw !important;
    height: 8vw !important;
    z-index: 8 !important;
  }

  .country-pill {
    display: flex !important;
    width: 100% !important;
    height: 100% !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 2.2vw !important;
    border: 0 !important;
    border-radius: 5vw !important;
    background: #22451b !important;
    color: #ffffff !important;
    font-size: 2.05vw !important;
    font-weight: 600 !important;
    line-height: 1.08 !important;
    text-align: center !important;
    letter-spacing: 0 !important;
    overflow: hidden !important;
  }

  .country-menu {
    left: -7vw !important;
    top: 10vw !important;
    width: 49vw !important;
    padding: 2vw !important;
    border-radius: 4vw !important;
    z-index: 40 !important;
  }

  .country-menu button {
    height: 10vw !important;
    border-radius: 2.5vw !important;
    font-size: 3.2vw !important;
  }

  /* Three-line menu button */

  .mobile-menu-button {
    position: absolute !important;
    display: flex !important;
    right: 5vw !important;
    top: 4.2vw !important;
    width: 8vw !important;
    height: 8vw !important;
    padding: 0 !important;
    border: 0 !important;
    background: transparent !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 1.05vw !important;
    cursor: pointer !important;
    z-index: 20 !important;
  }

  .mobile-menu-button span {
    display: block !important;
    width: 5.8vw !important;
    height: 0.48vw !important;
    min-height: 2px !important;
    border-radius: 999px !important;
    background: #111111 !important;
  }

  .mobile-menu-button.is-open span:nth-child(1) {
    transform: translateY(1.52vw) rotate(45deg) !important;
  }

  .mobile-menu-button.is-open span:nth-child(2) {
    opacity: 0 !important;
  }

  .mobile-menu-button.is-open span:nth-child(3) {
    transform: translateY(-1.52vw) rotate(-45deg) !important;
  }

  /* Open menu */

  .mobile-nav-menu {
    position: absolute !important;
    display: grid !important;
    right: 0 !important;
    top: 18.8vw !important;
    width: 58vw !important;
    padding: 2.6vw !important;
    gap: 1.3vw !important;
    border: 1px solid #ebebeb !important;
    border-radius: 4.4vw !important;
    background: #ffffff !important;
    box-shadow: 0 4vw 10vw rgba(0, 0, 0, 0.16) !important;
    z-index: 30 !important;
  }

  .mobile-nav-menu button {
    display: flex !important;
    width: 100% !important;
    height: 10.8vw !important;
    align-items: center !important;
    padding: 0 3.5vw !important;
    border: 0 !important;
    border-radius: 3vw !important;
    background: #f3f3f1 !important;
    color: #111111 !important;
    font-size: 3.55vw !important;
    font-weight: 700 !important;
    text-align: left !important;
  }

  .mobile-nav-menu .mobile-signup-menu-button {
    background: #22451b !important;
    color: #ffffff !important;
  }

  /* MOBILE HERO */

  .mobile-home-title-wrap {
    position: absolute !important;
    left: 2vw !important;
    top: 31vw !important;
    width: 96vw !important;
    height: 42vw !important;
  }

  .mobile-home-title-image {
    position: absolute !important;
    display: block !important;
    left: 15.5vw !important;
    top: 4.5vw !important;
    width: 74vw !important;
    height: auto !important;
    object-fit: contain !important;
  }

  .mobile-home-gift-tag {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 24vw !important;
    height: 24vw !important;
    object-fit: contain !important;
  }

  .mobile-home-gift-box {
    position: absolute !important;
    left: 54vw !important;
    top: 1.5vw !important;
    width: 15vw !important;
    height: 15vw !important;
    object-fit: contain !important;
  }

  .mobile-home-gift-card {
    position: absolute !important;
    left: 74vw !important;
    top: 7vw !important;
    width: 20vw !important;
    height: 20vw !important;
    object-fit: contain !important;
  }

  .mobile-home-subtitle {
    position: absolute !important;
    left: 9vw !important;
    top: 75vw !important;
    width: 82vw !important;
    margin: 0 !important;
    color: #22451b !important;
    font-size: 4.35vw !important;
    font-weight: 400 !important;
    line-height: 1.23 !important;
    letter-spacing: -0.06vw !important;
  }

  .mobile-home-input {
    position: absolute !important;
    left: 9vw !important;
    top: 99.5vw !important;
    width: 82vw !important;
    height: 13vw !important;
    padding: 0 4vw !important;
    border: 0.35vw solid #ebebeb !important;
    border-radius: 1.6vw !important;
    outline: 0 !important;
    background: #ffffff !important;
    color: #888888 !important;
    font-size: 3.9vw !important;
    font-weight: 500 !important;
    box-sizing: border-box !important;
  }

  .mobile-home-input::placeholder {
    color: #888888 !important;
    opacity: 1 !important;
  }

  .mobile-home-sparkle {
    position: absolute !important;
    left: -13vw !important;
    top: 94.5vw !important;
    width: 44vw !important;
    height: 44vw !important;
    object-fit: contain !important;
    transform: rotate(-7deg) !important;
    pointer-events: none !important;
  }

  .mobile-home-cta {
    position: absolute !important;
    left: 13.7vw !important;
    top: 116.5vw !important;
    width: 73vw !important;
    height: 12vw !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 6vw !important;
    background: #22451b !important;
    color: #ffffff !important;
    font-size: 3.75vw !important;
    font-weight: 700 !important;
    text-decoration: none !important;
    z-index: 4 !important;
  }

  .mobile-home-heart {
    position: absolute !important;
    left: 75vw !important;
    top: 109.5vw !important;
    width: 22.5vw !important;
    height: 22.5vw !important;
    object-fit: contain !important;
    pointer-events: none !important;
    z-index: 5 !important;
  }

  .mobile-home-campaign-card {
    position: absolute !important;
    left: 7.5vw !important;
    top: 136.5vw !important;
    width: 85vw !important;
    height: 85vw !important;
    display: block !important;
    overflow: hidden !important;
    border-radius: 5.3vw !important;
  }

  .mobile-home-campaign-card img {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
  }
}

/* Keep all mobile elements off desktop */
@media (min-width: 769px) {
  .mobile-home-hero,
  .mobile-menu-button,
  .mobile-nav-menu,
  .linktree-mobile-logo {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .mobile-home-subtitle {
    display: none !important;
  }
}

/* =========================================================
   MOBILE WHITE NAV ONLY
   Desktop is completely untouched.
   ========================================================= */
@media (max-width: 768px) {
  .linktree-nav-shell {
    position: fixed !important;
    left: 3.5398vw !important;
    right: auto !important;
top: max(
  52px,
  calc(env(safe-area-inset-top, 0px) + 12px)
) !important;    width: 92.9204vw !important;
    max-width: none !important;
    height: 16.8142vw !important;
    transform: none !important;
    z-index: 999 !important;
  }

  .linktree-nav-shell.nav-hidden {
    transform: translateY(-150%) !important;
  }

  .linktree-nav {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 1px solid #ebebeb !important;
    border-radius: 11.0619vw !important;
    background: #ffffff !important;
    box-shadow: none !important;
    overflow: visible !important;
    box-sizing: border-box !important;
  }

  /* Mobile Linktree icon */

  .linktree-logo-link {
    position: absolute !important;
    display: block !important;
    left: 5.3097vw !important;
    top: 50% !important;
    width: 7.0796vw !important;
    height: 7.0796vw !important;
    padding: 0 !important;
    margin: 0 !important;
    overflow: visible !important;
    transform: translateY(-50%) !important;
    z-index: 5 !important;
  }

  .linktree-logo {
    display: none !important;
  }

  .linktree-mobile-logo {
    position: absolute !important;
    display: block !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    object-fit: contain !important;
  }

  /* Hide desktop nav buttons */

  .linktree-nav-item,
  .login-button,
  .signup-button {
    display: none !important;
  }

  /* Shop Gift Cards */

  .linktree-nav-item.shop-link {
    position: absolute !important;
    display: flex !important;
    left: 15.9292vw !important;
    top: 50% !important;
    width: 25.6637vw !important;
    height: 4.4248vw !important;
    align-items: center !important;
    justify-content: flex-start !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: #111111 !important;
    font-size: 3.0181vw !important;
    font-weight: 700 !important;
    line-height: 1 !important;
    letter-spacing: -0.04vw !important;
    white-space: nowrap !important;
    transform: translateY(-50%) !important;
    z-index: 5 !important;
  }

  /* Country pill */

  .country-area {
    position: absolute !important;
    display: block !important;
    left: 43.8053vw !important;
    right: auto !important;
    top: 50% !important;
    bottom: auto !important;
    width: 34.5133vw !important;
    min-width: 0 !important;
    max-width: none !important;
    height: 7.7168vw !important;
    margin: 0 !important;
    transform: translateY(-50%) !important;
    z-index: 8 !important;
  }

  .country-pill {
    display: flex !important;
    width: 100% !important;
    height: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 2.6549vw !important;
    margin: 0 !important;
    border: 0 !important;
    border-radius: 4.7938vw !important;
    background: #22451b !important;
    color: #ffffff !important;
    font-size: 2.0066vw !important;
    font-weight: 600 !important;
    line-height: 1.08 !important;
    letter-spacing: 0 !important;
    text-align: center !important;
    white-space: normal !important;
    overflow: hidden !important;
    box-sizing: border-box !important;
  }

  /* Three-line menu */

  .mobile-menu-button {
    position: absolute !important;
    display: flex !important;
    right: 4.8673vw !important;
    top: 50% !important;
    width: 7.9646vw !important;
    height: 7.9646vw !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    background: transparent !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 0.8849vw !important;
    transform: translateY(-50%) !important;
    cursor: pointer !important;
    z-index: 20 !important;
  }

  .mobile-menu-button span {
    display: block !important;
    width: 5.7522vw !important;
    height: 0.4425vw !important;
    min-height: 1px !important;
    border-radius: 999px !important;
    background: #111111 !important;
    transition:
      transform 180ms ease,
      opacity 180ms ease !important;
  }

  .mobile-menu-button.is-open span:nth-child(1) {
    transform: translateY(1.3274vw) rotate(45deg) !important;
  }

  .mobile-menu-button.is-open span:nth-child(2) {
    opacity: 0 !important;
  }

  .mobile-menu-button.is-open span:nth-child(3) {
    transform: translateY(-1.3274vw) rotate(-45deg) !important;
  }

  /* Country dropdown */

  .country-menu {
    left: auto !important;
    right: 0 !important;
    top: calc(100% + 2vw) !important;
    width: 48vw !important;
    padding: 2vw !important;
    border-radius: 4vw !important;
    z-index: 40 !important;
  }

  .country-menu button {
    height: 10vw !important;
    border-radius: 2.5vw !important;
    font-size: 3.2vw !important;
  }

  /* Three-line menu dropdown */

  .mobile-nav-menu {
    position: absolute !important;
    display: grid !important;
    right: 0 !important;
    top: calc(100% + 2.6549vw) !important;
    width: 56vw !important;
    padding: 2.6549vw !important;
    gap: 1.3274vw !important;
    border: 1px solid #ebebeb !important;
    border-radius: 4.4248vw !important;
    background: #ffffff !important;
    box-shadow: 0 4vw 10vw rgba(0, 0, 0, 0.14) !important;
    z-index: 30 !important;
  }

  .mobile-nav-menu button {
    display: flex !important;
    width: 100% !important;
    height: 10.6195vw !important;
    align-items: center !important;
    padding: 0 3.5398vw !important;
    border: 0 !important;
    border-radius: 3.0973vw !important;
    background: #f3f3f1 !important;
    color: #111111 !important;
    font-size: 3.5398vw !important;
    font-weight: 700 !important;
    text-align: left !important;
  }

  .mobile-nav-menu .mobile-signup-menu-button {
    background: #22451b !important;
    color: #ffffff !important;
  }
}

/* Only hides the added mobile elements on desktop. */
@media (min-width: 769px) {
  .mobile-menu-button,
  .mobile-nav-menu,
  .linktree-mobile-logo {
    display: none !important;
  }
}

.mobile-gifting-made-easy-image {
  display: none;
}

@media (max-width: 768px) {
  .mobile-gifting-made-easy-image {
    position: absolute !important;
    display: block !important;
    left: 43% !important;
    top: 35.3186vw !important;
    width: 112vw !important;
    max-width: none !important;
    height: auto !important;
    object-fit: contain !important;
    transform: translateX(-50%) !important;
    pointer-events: none !important;
    user-select: none !important;
    z-index: 2 !important;
    pointer-events: none !important;
  }
}

@media (max-width: 768px) {
.mobile-home-hero {
  height: 235vw !important;
  min-height: 235vw !important;
  max-height: none !important;
  overflow: visible !important;
}

  .mobile-home-campaign-card {
    overflow: hidden !important;
  }

  .mobile-home-campaign-viewport {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    border-radius: inherit !important;
  }

.mobile-home-campaign-track {
  display: flex !important;
  width: max-content !important;
  height: 100% !important;
  gap: 6vw !important;
  animation: mobileHomeCampaignMovementSpaced 12s ease-in-out infinite !important;
  will-change: transform !important;
}

  .mobile-home-campaign-slide-link {
    display: block !important;
    flex: 0 0 84.9558vw !important;
    width: 84.9558vw !important;
    height: 84.9558vw !important;
    overflow: hidden !important;
    border-radius: 5.3097vw !important;
    text-decoration: none !important;
  }

  .mobile-home-campaign-card .mobile-home-campaign-slide {
    position: static !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    object-fit: cover !important;
    border-radius: inherit !important;
    pointer-events: none !important;
    user-select: none !important;
  }

@keyframes mobileHomeCampaignMovementSpaced {
  0%,
  22% {
    transform: translateX(0);
  }

  30%,
  52% {
    transform: translateX(-90.9558vw);
  }

  60%,
  82% {
    transform: translateX(-181.9116vw);
  }

  100% {
    transform: translateX(-272.8674vw);
  }
}@keyframes mobileHomeCampaignMovementSpaced {
  0%,
  22% {
    transform: translateX(0);
  }

  30%,
  52% {
    transform: translateX(-90.9558vw);
  }

  60%,
  82% {
    transform: translateX(-181.9116vw);
  }

  100% {
    transform: translateX(-272.8674vw);
  }
}
}

@media (max-width: 768px) {
  .mobile-home-hero {
    height: 230vw !important;
    min-height: 230vw !important;
    max-height: none !important;
    overflow: visible !important;
    background: #cbea19 !important;
  }

  .mobile-home-campaign-card {
    overflow: hidden !important;
  }

  .mobile-home-campaign-viewport {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    border-radius: inherit !important;
  }

  .mobile-home-campaign-track {
    display: flex !important;
    width: max-content !important;
    height: 100% !important;
    gap: 5vw !important;
    animation: mobileHomeCampaignConsistent 12s ease-in-out infinite !important;
    will-change: transform !important;
  }

  .mobile-home-campaign-slide-link {
    display: block !important;
    flex: 0 0 84.9558vw !important;
    width: 84.9558vw !important;
    height: 84.9558vw !important;
    overflow: hidden !important;
    border-radius: 5.3097vw !important;
    text-decoration: none !important;
  }

  .mobile-home-campaign-card .mobile-home-campaign-slide {
    position: static !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    object-fit: cover !important;
    border-radius: inherit !important;
    pointer-events: none !important;
    user-select: none !important;
  }

  @keyframes mobileHomeCampaignConsistent {
    0%,
    25% {
      transform: translateX(0);
    }

    33.333%,
    58.333% {
      transform: translateX(-89.9558vw);
    }

    66.666%,
    91.666% {
      transform: translateX(-179.9116vw);
    }

    100% {
      transform: translateX(-269.8674vw);
    }
  }
}

@media (max-width: 768px) {
  .mobile-home-green-section {
    height: 235vw !important;
    min-height: 235vw !important;
    max-height: none !important;
    background: #cbea19 !important;
  }
}

.mobile-home-start-browsing-button {
  display: none;
}

@media (max-width: 768px) {
  .mobile-home-start-browsing-button {
    position: absolute !important;
    display: block !important;
    left: 14.5vw !important;
    top: 111.5vw !important;
    width: 71vw !important;
    height: 13vw !important;
    padding: 0 !important;
    border: 0 !important;
    background: transparent !important;
    z-index: 100 !important;
    cursor: pointer !important;
    touch-action: manipulation !important;
  }
}
  .mobile-home-right-gift {
  display: none;
}

@media (max-width: 768px) {
  .desktop-home-right-gift {
    display: none !important;
  }

  .mobile-home-right-gift {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    height: 133vw !important;
    overflow: hidden !important;
    background: #f4f4f2 !important;
  }

  .mobile-home-right-gift-heading {
    position: absolute !important;
    left: 50% !important;
    top: 14vw !important;
    width: 94vw !important;
    margin: 0 !important;
    transform: translateX(-50%) !important;
    color: #000000 !important;
    font-family: "Link Sans", Arial, sans-serif !important;
    font-size: 8.8vw !important;
    font-weight: 900 !important;
    line-height: 0.98 !important;
    letter-spacing: -0.3vw !important;
    text-align: center !important;
  }

  .mobile-home-right-gift-heading span {
    display: block !important;
    white-space: nowrap !important;
  }

  .mobile-home-right-gift-word-window {
    position: absolute !important;
    left: 50% !important;
    top: 31.5vw !important;
    width: 96vw !important;
    height: 12.5vw !important;
    transform: translateX(-50%) !important;
    overflow: hidden !important;
  }

  .mobile-home-right-gift-word {
    position: absolute !important;
    left: 50% !important;
    top: 50% !important;
    width: 100% !important;
    transform: none !important;
    translate: -50% -50%;
    color: #2559cd !important;
    font-family: "Link Sans", Arial, sans-serif !important;
    font-size: 9.6vw !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    letter-spacing: -0.28vw !important;
    text-align: center !important;
    white-space: nowrap !important;
    pointer-events: none !important;
    user-select: none !important;
  }

  .mobile-home-right-gift-word.is-last-minute-label {
    font-size: 7.35vw !important;
    line-height: 1 !important;
    letter-spacing: -0.2vw !important;
    white-space: nowrap !important;
  }

  .mobile-home-right-gift-card-window {
    position: absolute !important;
    left: 0 !important;
    top: 60vw !important;
    width: 100% !important;
    height: 52vw !important;
    overflow: hidden !important;
    border-radius: 0 !important;
    background: transparent !important;
  }

  .mobile-home-right-gift-card-track {
    display: flex !important;
    align-items: center !important;
    width: max-content !important;
    gap: 2vw !important;
    will-change: transform !important;
  }

  .mobile-home-right-gift-card-link {
    display: block !important;
    flex: 0 0 80vw !important;
    width: 80vw !important;
    height: 49.6vw !important;
    overflow: hidden !important;
    border-radius: 6.8vw !important;
    background: transparent !important;
  }

  .mobile-home-right-gift-card-track
    .mobile-home-right-gift-card-image {
    position: static !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    object-fit: cover !important;
    border-radius: inherit !important;
    pointer-events: none !important;
    user-select: none !important;
  }
}

@media (max-width: 768px) {
.blue-cta-section {
  position: relative !important;
  display: block !important;
  width: 100% !important;
  height: 185vw !important;
  min-height: 185vw !important;
  overflow: hidden !important;
  background: #2559cd !important;
}

  .desktop-blue-cta-image {
    display: none !important;
  }

.mobile-blue-cta-image {
  position: relative !important;
  display: block !important;
  left: 50% !important;
  top: 14vw !important;
  width: 120% !important;
  height: auto !important;
  max-width: none !important;
  transform: translateX(-50%) !important;
  object-fit: contain !important;
  pointer-events: none !important;
  user-select: none !important;
}

.blue-start-gifting-button {
  position: absolute !important;
  left: 15.5vw !important;
  top: 157vw !important;
  width: 69vw !important;
  height: 14.5vw !important;
  display: block !important;
  transform: none !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 999px !important;
  background: transparent !important;
  color: transparent !important;
  font-size: 0 !important;
  z-index: 50 !important;
  cursor: pointer !important;
  pointer-events: auto !important;
  touch-action: manipulation !important;
}
}
@media (max-width: 768px) {
  .landing-claim-section {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    height: 130vw !important;
    min-height: 130vw !important;
    overflow: hidden !important;
    background: #461f67 !important;
  }

  .landing-claim-frame {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    overflow: hidden !important;
    background: #461f67 !important;
    transform: none !important;
  }

  /* Hide original desktop footer content */
  .landing-blue-dude,
  .landing-claim-title,
  .landing-purple-shape {
    display: none !important;
  }

  /* Show the completed mobile footer artwork */
  .landing-claim-mobile-image {
    position: absolute !important;
    display: block !important;
    left: 35% !important;
    top: 18vw !important;
    width: 118% !important;
    height: auto !important;
    max-width: none !important;
    transform: translateX(-50%) !important;
    object-fit: contain !important;
    pointer-events: none !important;
    user-select: none !important;
    z-index: 1 !important;
  }

}

/*
  Keep the real form over the baked-in artwork,
  but make it invisible so there is no duplication.
*/
@media (max-width: 768px) {
  .landing-claim-form {
    position: absolute !important;
    left: 12.5vw !important;
    top: 78.5vw !important;
    width: 75vw !important;
    height: 15vw !important;
    margin: 0 !important;
    transform: none !important;
    z-index: 30 !important;
  }

  .landing-claim-input {
    display: none !important;
  }

  .landing-claim-button {
    position: absolute !important;
    inset: 0 !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    border-radius: 999px !important;
    background: transparent !important;
    color: transparent !important;
    font-size: 0 !important;
    z-index: 31 !important;
    cursor: pointer !important;
    pointer-events: auto !important;
    touch-action: manipulation !important;
  }
}
@media (max-width: 768px) {
  .country-change-toast {
    top: calc(
      max(
          52px,
          calc(env(safe-area-inset-top, 0px) + 12px)
        ) + 19vw
    ) !important;

    width: auto !important;
    min-width: 58vw !important;
    max-width: 84vw !important;
    height: 11vw !important;
    padding: 0 5vw !important;

    border-radius: 999px !important;
    font-size: 3.2vw !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    z-index: 998 !important;
  }
}
  @media (max-width: 768px) {
  .gift-browser-page .browser-title {
    font-size: 27px !important;
    line-height: 0.98 !important;
    letter-spacing: -1px !important;
  }

  .gift-browser-page .browser-subtitle {
    margin-top: 10px !important;
    font-size: 15px !important;
    line-height: 1.18 !important;
    letter-spacing: -0.25px !important;
  }
}
  /* =========================================================
   FINAL MOBILE SHOP CARD SIZE
   Two cards per row. Desktop remains untouched.
   ========================================================= */

@media (max-width: 768px) {
  .browser-card-grid {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    margin-top: 7vw !important;
    padding: 0 0 12vw !important;

    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    column-gap: 3.5vw !important;
    row-gap: 5vw !important;
  }

  .gift-card-tile {
    --mobile-card-image-height: clamp(112px, 28vw, 175px);

    position: relative !important;
    width: 100% !important;
    min-width: 0 !important;
    height: calc(var(--mobile-card-image-height) + 20vw) !important;
    min-height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;

    border-radius: 4.2vw !important;
    overflow: hidden !important;
  }

  .gift-card-image-wrap {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    height: var(--mobile-card-image-height) !important;
    border-radius: 4.2vw 4.2vw 0 0 !important;
    overflow: hidden !important;
  }

  .gift-card-image {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    object-fit: cover !important;
    object-position: center !important;
  }

  .gift-card-title {
    position: absolute !important;
    left: 3.2vw !important;
    top: calc(var(--mobile-card-image-height) + 3.2vw) !important;
    width: calc(100% - 6.4vw) !important;
    margin: 0 !important;

    font-size: clamp(13px, 3.5vw, 18px) !important;
    font-weight: 700 !important;
    line-height: 1.08 !important;
    letter-spacing: -0.08vw !important;

    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .gift-card-range {
    position: absolute !important;
    left: 3.2vw !important;
    top: calc(var(--mobile-card-image-height) + 9.2vw) !important;
    width: calc(100% - 6.4vw) !important;
    margin: 0 !important;

    color: #888888 !important;
    font-size: clamp(12px, 3vw, 16px) !important;
    font-weight: 500 !important;
    line-height: 1 !important;

    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }
}
  /* =========================================================
   FINAL MOBILE PRODUCT PAGE SIZE
   Desktop remains untouched.
   ========================================================= */

@media (max-width: 768px) {
  /* Reduce the overall product-page spacing */

  .linktree-smart-page {
    padding: 7vw 6vw 16vw !important;
  }

  .linktree-smart-page .linktree-back-button {
    margin-bottom: 8vw !important;
    color: #888888 !important;
    font-size: 4.2vw !important;
    font-weight: 800 !important;
  }

  /* Smaller centred gift-card image */

  .linktree-smart-page .product-info-column {
    display: flex !important;
    width: 100% !important;
    align-items: center !important;
    text-align: center !important;
  }

  .linktree-smart-page .product-info-image-wrap {
    width: 64vw !important;
    height: 38.4vw !important;
    aspect-ratio: auto !important;
    margin: 0 auto !important;
    border-radius: 4.5vw !important;
  }

  .linktree-smart-page .product-info-image {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
  }

  /* Smaller, centred product copy */

  .linktree-smart-page .product-info-title {
    width: 88vw !important;
    margin: 7vw auto 0 !important;
    color: #000000 !important;
    font-size: 6.2vw !important;
    font-weight: 900 !important;
    line-height: 1.02 !important;
    letter-spacing: -0.18vw !important;
    text-align: center !important;
  }

  .linktree-smart-page .product-info-copy {
    width: 87vw !important;
    margin: 4.5vw auto 0 !important;
    color: #000000 !important;
    font-size: 3.85vw !important;
    font-weight: 500 !important;
    line-height: 1.22 !important;
    letter-spacing: -0.04vw !important;
    text-align: center !important;
  }

  .linktree-smart-page .product-info-link {
    width: auto !important;
    max-width: 88vw !important;
    margin: 5vw auto 0 !important;
    font-size: 3.65vw !important;
    font-weight: 700 !important;
    line-height: 1.15 !important;
    text-align: center !important;
  }

  .linktree-smart-page .product-info-expiry {
    width: auto !important;
    margin: 6vw auto 0 !important;
    font-size: 5.2vw !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    text-align: center !important;
  }

  /* Smaller purchase heading */

  .linktree-smart-page .linktree-purchase-heading {
    width: 88vw !important;
    margin: 12vw auto 5vw !important;
    color: #000000 !important;
    font-size: 7vw !important;
    font-weight: 900 !important;
    line-height: 0.98 !important;
    letter-spacing: -0.22vw !important;
    text-align: center !important;
  }

  /* Slightly smaller amount buttons */

  .linktree-smart-page .linktree-amount-button {
    width: calc(50% - 2.2vw) !important;
    height: 12.5vw !important;
    margin: 1.1vw !important;
    border-radius: 999px !important;
    font-size: 4.1vw !important;
  }

  .linktree-smart-page .linktree-continue-button {
    width: 100% !important;
    height: 14vw !important;
    margin-top: 5vw !important;
    font-size: 5vw !important;
  }
}
  /* =========================================================
   MOBILE HORIZONTAL DENOMINATIONS
   Desktop remains untouched.
   ========================================================= */

.denomination-row {
  display: contents;
}

@media (max-width: 768px) {
  .linktree-smart-page .denomination-row {
    position: relative !important;
    display: flex !important;
    width: calc(100vw - 12vw) !important;
    margin: 0 auto !important;
    padding: 1vw 1vw 4vw !important;
    gap: 3vw !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scroll-snap-type: x proximity !important;
    overscroll-behavior-x: contain !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
  }

  .linktree-smart-page .denomination-row::-webkit-scrollbar {
    display: none !important;
  }

  .linktree-smart-page
    .denomination-row
    .linktree-amount-button {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    flex: 0 0 30vw !important;
    width: 30vw !important;
    height: 12.5vw !important;
    margin: 0 !important;
    border-radius: 999px !important;
    font-size: 4vw !important;
    scroll-snap-align: start !important;
  }

  .linktree-smart-page .linktree-continue-button {
    display: flex !important;
    width: 88vw !important;
    margin: 5vw auto 0 !important;
  }
}

/* =========================================================
   FINAL MOBILE RECIPIENT PAGE
   Desktop remains completely untouched.
   ========================================================= */

@media (max-width: 768px) {
  /* Close button */

  .recipient-page .recipient-close-button {

  position: absolute !important;
  right: 0 !important;
  top: 0 !important;
  width: 10.5vw !important;
  height: 10.5vw !important;
  padding: 0 0 0.8vw !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 999px !important;
  background: #dededb !important;
  color: #000000 !important;
  font-size: 7vw !important;
  font-weight: 500 !important;
  line-height: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 20 !important;
}

  /* Back button */

.recipient-page .recipient-back-button {
  position: relative !important;
  display: inline-flex !important;
  left: auto !important;
  top: auto !important;
  width: auto !important;
  min-height: 10.5vw !important;
  margin: 0 0 6vw !important;
  padding: 0 !important;
  align-items: center !important;
  border: 0 !important;
  background: transparent !important;
  color: #8e8e8e !important;
  font-size: 4.2vw !important;
  font-weight: 800 !important;
  line-height: 1 !important;
}

  /* Product area */

  .recipient-page .recipient-left {
    position: relative !important;
    display: flex !important;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    margin: 0 !important;
    align-items: center !important;
  }

  .recipient-page .recipient-left .product-info-image-wrap {
    width: 68vw !important;
    max-width: 320px !important;
    height: auto !important;
    aspect-ratio: 5 / 3 !important;
    margin: 0 auto !important;
    overflow: hidden !important;
    border-radius: 4vw !important;
    background: transparent !important;
    box-shadow: 0 4vw 9vw rgba(0, 0, 0, 0.12) !important;
  }

  .recipient-page .recipient-left .product-info-image {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    object-fit: cover !important;
    object-position: center !important;
  }

  .recipient-page .recipient-left .product-info-title {
    width: 100% !important;
    margin: 4.5vw 0 0 !important;
    color: #000000 !important;
    font-size: 6.4vw !important;
    font-weight: 500 !important;
    line-height: 1.05 !important;
    letter-spacing: -0.18vw !important;
    text-align: center !important;
  }

  /* Hide product-page detail copy on the recipient step */

  .recipient-page .recipient-left .product-info-copy,
  .recipient-page .recipient-left .product-info-link,
  .recipient-page .recipient-left .product-info-expiry {
    display: none !important;
  }

  /* Recipient controls */

  .recipient-page .recipient-right {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    margin: 6vw 0 0 !important;
  }

  .recipient-page .recipient-value-row {
    position: relative !important;
    display: flex !important;
    width: 100% !important;
    height: 15vw !important;
    min-height: 0 !important;
    align-items: center !important;
    justify-content: space-between !important;
    padding: 0 !important;
    border-top: 0.3vw solid #d2d2cf !important;
    border-bottom: 0.3vw solid #d2d2cf !important;
  }

  .recipient-page .recipient-value-row h2 {
    margin: 0 !important;
    color: #111111 !important;
    font-size: 4.4vw !important;
    font-weight: 700 !important;
    line-height: 1 !important;
    letter-spacing: -0.08vw !important;
  }

  .recipient-page .recipient-value-actions {
    display: flex !important;
    align-items: center !important;
    gap: 2.3vw !important;
  }

  .recipient-page .recipient-value-pill {
    min-width: 17vw !important;
    width: auto !important;
    height: 8.5vw !important;
    padding: 0 4vw !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: #cbea19 !important;
    color: #000000 !important;
    font-size: 4.1vw !important;
    font-weight: 800 !important;
    line-height: 1 !important;
  }

  .recipient-page .recipient-dropdown-button {
    width: 8.5vw !important;
    height: 8.5vw !important;
    padding: 0 !important;
  }

  .recipient-page .recipient-dropdown-button img {
    display: block !important;
    width: 8.5vw !important;
    height: 8.5vw !important;
    object-fit: contain !important;
  }

  .recipient-page .recipient-divider {
    display: none !important;
  }

  /* Denomination dropdown */

  .recipient-page .recipient-amount-dropdown {
    position: relative !important;
    display: grid !important;
    left: auto !important;
    right: auto !important;
    top: auto !important;
    width: 100% !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 2.8vw 2.2vw !important;
    margin: 3vw 0 5vw !important;
    padding: 4vw !important;
    overflow: hidden !important;
    border-radius: 4vw !important;
    background: #e4e4e1 !important;
    box-shadow: none !important;
  }

  .recipient-page .recipient-dropdown-amount {
    width: 100% !important;
    height: 10.5vw !important;
    padding: 0 !important;
    border: 0.35vw solid #90908d !important;
    border-radius: 999px !important;
    background: transparent !important;
    color: #111111 !important;
    font-size: 3.6vw !important;
    font-weight: 700 !important;
  }

  .recipient-page .recipient-dropdown-amount.is-selected {
    border-color: #cbea19 !important;
    background: #cbea19 !important;
    color: #000000 !important;
  }

  /* Question */

  .recipient-page .recipient-question {
    width: 100% !important;
    margin: 6vw 0 4vw !important;
    color: #000000 !important;
    font-size: 7.2vw !important;
    font-weight: 400 !important;
    line-height: 1 !important;
    letter-spacing: -0.25vw !important;
  }

  /* Three Linktree recipient options */

  .recipient-page .recipient-toggle {
    display: grid !important;
    width: 100% !important;
    height: 13.5vw !important;
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    align-items: center !important;
    gap: 0 !important;
    padding: 1vw !important;
    overflow: hidden !important;
    border: 0.4vw solid #111111 !important;
    border-radius: 999px !important;
    background: transparent !important;
  }

  .recipient-page .recipient-toggle button {
    display: flex !important;
    width: 100% !important;
    min-width: 0 !important;
    height: 100% !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 1vw !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: transparent !important;
    color: #111111 !important;
    font-size: 2.85vw !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    letter-spacing: -0.04vw !important;
    text-align: center !important;
    white-space: nowrap !important;
  }

  .recipient-page .recipient-toggle button.is-active {
    background: #cbea19 !important;
    color: #000000 !important;
  }

  /* Someone else form */

  .recipient-page .recipient-form-card {
    width: 100% !important;
    margin: 4vw 0 0 !important;
    padding: 4vw 5vw 5vw !important;
    overflow: hidden !important;
    border: 0.3vw solid #d2d2cf !important;
    border-radius: 4vw !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .recipient-page .recipient-form-card input {
    width: 100% !important;
    height: 14vw !important;
    padding: 0 !important;
    border: 0 !important;
    border-bottom: 0.3vw solid #b9b9b6 !important;
    border-radius: 0 !important;
    background: transparent !important;
    color: #111111 !important;
    font-size: 4vw !important;
    font-weight: 500 !important;
    outline: none !important;
  }

  .recipient-page .recipient-form-card input::placeholder {
    color: #8c8c89 !important;
    opacity: 1 !important;
  }

  .recipient-page .recipient-form-card > p {
    margin: 3.5vw 0 0 !important;
    color: #7d7d79 !important;
    font-size: 3vw !important;
    font-weight: 500 !important;
    line-height: 1.3 !important;
  }

  .recipient-page .recipient-validation-note {
    margin: 2vw 0 0 !important;
    color: #d43d2f !important;
    font-size: 3vw !important;
    font-weight: 800 !important;
  }

  /* Selected creator */

  .recipient-page .creator-card {
    display: flex !important;
    width: 100% !important;
    min-height: 20vw !important;
    margin: 4vw 0 0 !important;
    padding: 3.5vw 4vw !important;
    align-items: center !important;
    gap: 3.5vw !important;
    border: 0.3vw solid #d2d2cf !important;
    border-radius: 4vw !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .recipient-page .creator-avatar {
    width: 14vw !important;
    height: 14vw !important;
    flex: 0 0 14vw !important;
    border-radius: 999px !important;
    object-fit: cover !important;
  }

  .recipient-page .creator-handle {
    font-size: 4.8vw !important;
    font-weight: 900 !important;
    letter-spacing: -0.12vw !important;
  }

  .recipient-page .creator-subtext {
    margin-top: 1vw !important;
    color: #777777 !important;
    font-size: 3vw !important;
    font-weight: 600 !important;
    line-height: 1.2 !important;
  }

  /* Creator picker */

  .recipient-page .creator-picker {
    position: relative !important;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    max-height: 90vw !important;
    margin: 4vw 0 0 !important;
    padding: 4vw !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    border: 0.3vw solid #d2d2cf !important;
    border-radius: 4vw !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .recipient-page .creator-picker-header {
    margin-bottom: 4vw !important;
  }

  .recipient-page .creator-picker-header h4 {
    font-size: 5.2vw !important;
    line-height: 1 !important;
    letter-spacing: -0.15vw !important;
  }

  .recipient-page .creator-picker-header p {
    margin-top: 1.5vw !important;
    font-size: 3.2vw !important;
    line-height: 1.2 !important;
  }

  .recipient-page .creator-list {
    gap: 2.5vw !important;
  }

  .recipient-page .creator-list-item {
    display: grid !important;
    width: 100% !important;
    min-height: 16vw !important;
    grid-template-columns: 11vw minmax(0, 1fr) auto !important;
    gap: 2.5vw !important;
    padding: 2.5vw !important;
    border-radius: 3.5vw !important;
  }

  .recipient-page .creator-list-avatar {
    width: 11vw !important;
    height: 11vw !important;
  }

  .recipient-page .creator-list-copy div {
    font-size: 3.8vw !important;
  }

  .recipient-page .creator-list-copy p {
    margin-top: 1vw !important;
    font-size: 2.7vw !important;
    line-height: 1.2 !important;
  }

.recipient-page .creator-list-action {
  padding: 2vw 2.5vw !important;
  font-size: 2.6vw !important;
}

  /* Myself and creator delivery notice */

  .recipient-page .myself-card {
    display: flex !important;
    width: 100% !important;
    min-height: 14vw !important;
    margin: 4vw 0 0 !important;
    padding: 3.5vw 4vw !important;
    align-items: center !important;
    border: 0.3vw solid #d2d2cf !important;
    border-radius: 4vw !important;
    background: #ffffff !important;
    color: #111111 !important;
    font-size: 3.8vw !important;
    font-weight: 700 !important;
    line-height: 1.2 !important;
    box-shadow: none !important;
  }

  /* Continue button */

  .recipient-page .recipient-final-button {
    width: 100% !important;
    height: 12.5vw !important;
    margin: 4.5vw 0 0 !important;
    padding: 0 5vw !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: #cbea19 !important;
    color: #000000 !important;
    font-size: 4vw !important;
    font-weight: 800 !important;
    letter-spacing: -0.08vw !important;
  }

  .recipient-page .recipient-final-button.is-disabled {
    background: #d2d2cf !important;
    color: #8b8b88 !important;
}
}
  /* =========================================================
   FINAL MOBILE PERSONALIZE PAGE
   Keep this at the very end of the CSS.
   ========================================================= */

@media (max-width: 768px) {
  .personalize-page {
    display: block !important;
    width: 100% !important;
    min-height: 100vh !important;
    padding: 5vw 5vw 10vw !important;
    background: #f3f3f1 !important;
    overflow: visible !important;
  }

  .personalize-frame {
    position: relative !important;
    width: 100% !important;
    min-height: 100vh !important;
    height: auto !important;
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    transform: none !important;
  }

  /* Top navigation */

  .personalize-back-button {
    position: relative !important;
    display: inline-flex !important;
    left: auto !important;
    top: auto !important;
    width: auto !important;
    min-height: 10vw !important;
    margin: 0 !important;
    padding: 0 !important;
    align-items: center !important;
    border: 0 !important;
    background: transparent !important;
    color: #8e8e8e !important;
    font-size: 4.1vw !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    z-index: 10 !important;
  }

  .personalize-close-button {
    position: absolute !important;
    right: 0 !important;
    top: 0 !important;
    width: 10vw !important;
    height: 10vw !important;
    margin: 0 !important;
    padding: 0 0 0.7vw !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: #dededb !important;
    color: #000000 !important;
    font-size: 6.4vw !important;
    font-weight: 500 !important;
    line-height: 1 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    z-index: 20 !important;
  }

  /* Main white card */

  .personalize-card {
    width: 100% !important;
    margin: 4vw 0 0 !important;
    padding: 6vw 5.5vw 6vw !important;
    border: 0.35vw solid #d2d2cf !important;
    border-radius: 5vw !important;
    background: #ffffff !important;
    box-shadow: 0 4vw 10vw rgba(0, 0, 0, 0.08) !important;
  }

  .personalize-card h1 {
    margin: 0 !important;
    color: #111111 !important;
    font-size: 8vw !important;
    font-weight: 900 !important;
    line-height: 0.95 !important;
    letter-spacing: -0.25vw !important;
  }

  .personalize-subtitle {
    margin: 3.5vw 0 7vw !important;
    color: #292929 !important;
    font-size: 4.3vw !important;
    font-weight: 700 !important;
    line-height: 1.15 !important;
    letter-spacing: -0.08vw !important;
  }

  /* Personalize options */

  .personalize-option {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto !important;
    align-items: center !important;
    gap: 4vw !important;
    width: 100% !important;
  }

  .personalize-option > div {
    min-width: 0 !important;
  }

  .personalize-option h2 {
    margin: 0 !important;
    color: #242424 !important;
    font-size: 6.1vw !important;
    font-weight: 900 !important;
    line-height: 0.98 !important;
    letter-spacing: -0.18vw !important;
  }

  .personalize-option p {
    max-width: 54vw !important;
    margin: 2.2vw 0 0 !important;
    color: #858585 !important;
    font-size: 3.65vw !important;
    font-weight: 700 !important;
    line-height: 1.22 !important;
    letter-spacing: -0.04vw !important;
  }

  /* Smaller toggles */

  .personalize-toggle {
    width: 15vw !important;
    height: 8.5vw !important;
    flex-shrink: 0 !important;
    padding: 0.8vw !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: #a3a3a3 !important;
  }

  .personalize-toggle span {
    width: 6.9vw !important;
    height: 6.9vw !important;
    border-radius: 999px !important;
    background: #ffffff !important;
  }

  .personalize-toggle.is-on {
    background: #2db68f !important;
  }

  .personalize-toggle.is-on span {
    transform: translateX(6.5vw) !important;
  }

  .personalize-divider {
    width: 100% !important;
    height: 1px !important;
    margin: 6.5vw 0 !important;
    background: #dededb !important;
  }

  /* Continue button */

  .personalize-continue-button {
    width: 100% !important;
    height: 13vw !important;
    margin-top: 8vw !important;
    padding: 0 4vw !important;
    border: 0 !important;
    border-radius: 999px !important;
    font-size: 5.2vw !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    letter-spacing: -0.12vw !important;
  }

  /* Opened gift media area */

  .personalize-media-panel,
  .message-panel {
    margin-top: 5vw !important;
  }

  .personalize-tabs {
    display: flex !important;
    width: 100% !important;
    gap: 2vw !important;
    margin-bottom: 4.5vw !important;
    overflow-x: auto !important;
  }

  .personalize-tabs button {
    flex: 0 0 auto !important;
    height: 10vw !important;
    padding: 0 4vw !important;
    border-radius: 999px !important;
    font-size: 3.6vw !important;
    font-weight: 800 !important;
  }

  .media-card-grid,
  .gif-grid {
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 2.5vw !important;
  }

  .media-card-tile,
  .gif-tile {
    height: 24vw !important;
    border-radius: 3vw !important;
    font-size: 3.5vw !important;
  }

  .gif-tile {
    font-size: 10vw !important;
  }

  .gif-search {
    height: 11vw !important;
    margin-bottom: 4vw !important;
    padding: 0 4vw !important;
  }

  .gif-search span {
    font-size: 6vw !important;
  }

  .gif-search input {
    font-size: 4vw !important;
  }

  .giphy-footer {
    margin-top: 4vw !important;
    font-size: 3.5vw !important;
  }

  .giphy-footer strong {
    font-size: 5vw !important;
  }

  .video-upload-panel p {
    margin-bottom: 4vw !important;
    font-size: 3.8vw !important;
    line-height: 1.35 !important;
  }

  .video-upload-panel button {
    min-height: 12vw !important;
    padding: 3vw !important;
    font-size: 3.8vw !important;
  }

  .message-panel textarea {
    width: 100% !important;
    height: 40vw !important;
    padding: 4vw 4vw 9vw !important;
    border-radius: 2.5vw !important;
    font-size: 4vw !important;
  }

  .message-count {
    right: 3.5vw !important;
    bottom: 3vw !important;
    font-size: 3.2vw !important;
  }
}
  @media (max-width: 768px) {
  input,
  textarea,
  select {
    font-size: 16px !important;
  }
}
  /* =========================================================
   MOBILE SHOP DROPDOWN + EMPTY RESULTS FIX
   Keep this at the very end of the CSS.
   ========================================================= */

@media (max-width: 768px) {
  /* Make the category dropdown expand the page vertically */
  .gift-browser-page .category-filter {
    position: relative !important;
    z-index: 100 !important;
    height: auto !important;
    overflow: visible !important;
  }

  .gift-browser-page .category-menu {
    position: relative !important;
    left: auto !important;
    right: auto !important;
    top: auto !important;

    width: 100% !important;
    margin: 3vw 0 0 !important;

    z-index: 100 !important;
  }

  /* Featured now sits underneath the complete category list */
  .gift-browser-page .featured-filter {
    position: relative !important;
    z-index: 50 !important;
    margin-top: 3vw !important;
  }

  /* Smaller empty search result with more space above it */
  .gift-browser-page .browser-no-results {
    position: relative !important;
    left: auto !important;
    top: auto !important;

    width: 100% !important;
    margin: 14vw 0 18vw !important;
    padding: 0 4vw !important;

    color: #111111 !important;
    font-size: 8.2vw !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    letter-spacing: -0.2vw !important;
    text-align: center !important;
    white-space: nowrap !important;
  }
}
  /* =========================================================
   FINAL MOBILE CHECKOUT PAGE
   Desktop remains completely untouched.
   Keep this as the final CSS block.
   ========================================================= */

@media (max-width: 768px) {
  /* Checkout page foundation */

  .checkout-shell {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 100dvh !important;
    max-height: none !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    background: #ffffff !important;
    transform: none !important;
    zoom: 1 !important;
    -webkit-overflow-scrolling: touch !important;
  }

  .checkout-content {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 100dvh !important;
    max-height: none !important;
    overflow: visible !important;
    background: #ffffff !important;
    opacity: 1 !important;
    transform: none !important;
    translate: none !important;
    scale: none !important;
    zoom: 1 !important;
    transition: none !important;
    animation: none !important;
  }

  .checkout-content .checkout-page {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 100dvh !important;
    max-height: none !important;
    margin: 0 !important;
    overflow-x: hidden !important;
    overflow-y: visible !important;
    background: #ffffff !important;
    transform: none !important;
    translate: none !important;
    scale: none !important;
    zoom: 1 !important;
    animation: none !important;
  }

  .route-entering .checkout-content,
  .route-entering .checkout-content .checkout-page {
    opacity: 1 !important;
    transform: none !important;
    animation: none !important;
  }

  /* Checkout header */

  .checkout-content .checkout-header {
    position: relative !important;
    z-index: 100 !important;
    display: flex !important;
    width: 100% !important;
    height: 76px !important;
    min-height: 76px !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 20px !important;
    border-bottom: 1px solid #dededb !important;
    background: #ffffff !important;
    transform: none !important;
    zoom: 1 !important;
  }

  .checkout-content .checkout-logo-wrap {
    display: flex !important;
    height: 100% !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .checkout-content .checkout-logo-image {
    display: block !important;
    width: auto !important;
    height: 37px !important;
    max-width: 132px !important;
    object-fit: contain !important;
    transform: none !important;
  }

  .checkout-content .checkout-back-button {
    position: absolute !important;
    left: 20px !important;
    top: 50% !important;
    display: flex !important;
    min-height: 44px !important;
    align-items: center !important;
    padding: 0 !important;
    border: 0 !important;
    background: transparent !important;
    color: #8b8b8b !important;
    font-size: 16px !important;
    font-weight: 800 !important;
    line-height: 1 !important;
    transform: translateY(-50%) !important;
    cursor: pointer !important;
  }

  .checkout-content .checkout-close-button {
    position: absolute !important;
    right: 20px !important;
    top: 50% !important;
    display: flex !important;
    width: 46px !important;
    height: 46px !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0 0 4px !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: #f0f0ee !important;
    color: #000000 !important;
    font-size: 34px !important;
    font-weight: 500 !important;
    line-height: 1 !important;
    transform: translateY(-50%) !important;
  }

  /* Mobile checkout layout */

  .checkout-content .checkout-frame {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    background: #ffffff !important;
    grid-template-columns: none !important;
    transform: none !important;
    transform-origin: initial !important;
    translate: none !important;
    scale: none !important;
    zoom: 1 !important;
  }

  .checkout-content .checkout-frame::before,
  .checkout-content .checkout-frame::after {
    content: none !important;
    display: none !important;
  }

  /* Product and pricing area */

  .checkout-content .checkout-summary-side {
    position: relative !important;
    order: 1 !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    padding: 30px 20px 34px !important;
    overflow: visible !important;
    border: 0 !important;
    border-bottom: 1px solid #dededb !important;
    background: #f3f3f1 !important;
    transform: none !important;
    zoom: 1 !important;
  }

  .checkout-content .checkout-summary-card {
    position: relative !important;
    top: auto !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    margin: 0 !important;
    transform: none !important;
    zoom: 1 !important;
  }

  .checkout-content .checkout-product-row {
    display: grid !important;
    width: 100% !important;
    grid-template-columns: 104px minmax(0, 1fr) auto !important;
    align-items: center !important;
    gap: 16px !important;
  }

  .checkout-content .checkout-product-thumb {
    position: relative !important;
    display: block !important;
    width: 104px !important;
    height: 64px !important;
    overflow: hidden !important;
    border-radius: 16px !important;
    background: transparent !important;
  }

  .checkout-content .checkout-product-thumb img {
    position: static !important;
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    object-fit: cover !important;
    object-position: center !important;
  }

  .checkout-content .checkout-product-copy {
    min-width: 0 !important;
  }

  .checkout-content .checkout-product-copy h3 {
    margin: 0 !important;
    color: #000000 !important;
    font-size: 19px !important;
    font-weight: 900 !important;
    line-height: 1.05 !important;
    letter-spacing: -0.4px !important;
    overflow-wrap: anywhere !important;
  }

  .checkout-content .checkout-product-copy p {
    margin: 8px 0 0 !important;
    color: #818181 !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    line-height: 1 !important;
  }

  .checkout-content .checkout-product-price {
    align-self: center !important;
    color: #000000 !important;
    font-size: 20px !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
  }

  /* Discount field */

  .checkout-content .checkout-discount-row {
    display: grid !important;
    width: 100% !important;
    grid-template-columns: minmax(0, 1fr) 96px !important;
    gap: 12px !important;
    margin: 30px 0 0 !important;
  }

  .checkout-content .checkout-discount-row input {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    height: 58px !important;
    margin: 0 !important;
    padding: 0 16px !important;
    border: 1.5px solid #d2d2cf !important;
    border-radius: 14px !important;
    background: #ffffff !important;
    color: #111111 !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    outline: none !important;
    transform: none !important;
    zoom: 1 !important;
  }

  .checkout-content .checkout-discount-row input::placeholder {
    color: #858585 !important;
    opacity: 1 !important;
  }

  .checkout-content .checkout-discount-row button {
    width: 96px !important;
    height: 58px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: 1.5px solid #d2d2cf !important;
    border-radius: 14px !important;
    background: #eeeeeb !important;
    color: #777777 !important;
    font-size: 16px !important;
    font-weight: 900 !important;
  }

  /* Total */

  .checkout-content .checkout-total-row {
    display: flex !important;
    width: 100% !important;
    align-items: center !important;
    justify-content: space-between !important;
    margin: 38px 0 0 !important;
    padding: 28px 0 0 !important;
    border-top: 1px solid #d8d8d5 !important;
  }

  .checkout-content .checkout-total-row span {
    color: #000000 !important;
    font-size: 23px !important;
    font-weight: 800 !important;
    line-height: 1 !important;
  }

  .checkout-content .checkout-total-row strong {
    color: #000000 !important;
    font-size: 25px !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    letter-spacing: -0.6px !important;
  }

  /* Delivery notice */

  .checkout-content .checkout-summary-note {
    display: grid !important;
    width: 100% !important;
    grid-template-columns: 28px minmax(0, 1fr) !important;
    align-items: flex-start !important;
    gap: 14px !important;
    margin: 28px 0 0 !important;
    padding: 20px !important;
    border-radius: 22px !important;
    background: #ffffff !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07) !important;
  }

  .checkout-content .checkout-summary-note span {
    display: flex !important;
    width: 28px !important;
    height: 28px !important;
    align-items: center !important;
    justify-content: center !important;
    flex-shrink: 0 !important;
    border-radius: 999px !important;
    background: #cbea19 !important;
    color: #000000 !important;
    font-size: 16px !important;
    font-weight: 900 !important;
  }

  .checkout-content .checkout-summary-note p {
    min-width: 0 !important;
    margin: 1px 0 0 !important;
    color: #5d5d5d !important;
    font-size: 15px !important;
    font-weight: 750 !important;
    line-height: 1.3 !important;
    overflow-wrap: anywhere !important;
  }

  /* Personalization information */

  .checkout-content .checkout-personalization-card {
    width: 100% !important;
    margin: 18px 0 0 !important;
    padding: 20px !important;
    border-radius: 22px !important;
    background: #ffffff !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.07) !important;
  }

  .checkout-content .checkout-personalization-card h4 {
    margin: 0 0 14px !important;
    color: #000000 !important;
    font-size: 18px !important;
    font-weight: 900 !important;
  }

  .checkout-content .checkout-personalization-row {
    display: grid !important;
    grid-template-columns: 72px minmax(0, 1fr) !important;
    gap: 12px !important;
  }

  /* Contact and order review area */

  .checkout-content .checkout-form-side {
    position: relative !important;
    order: 2 !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 0 !important;
    padding: 34px 20px 72px !important;
    overflow: visible !important;
    background: #ffffff !important;
    transform: none !important;
    translate: none !important;
    scale: none !important;
    zoom: 1 !important;
  }

  .checkout-content .checkout-section {
    width: 100% !important;
    margin: 34px 0 0 !important;
  }

  .checkout-content .checkout-contact-section {
    position: relative !important;
    width: 100% !important;
    margin-top: 0 !important;
  }

  .checkout-content .checkout-section h2 {
    margin: 0 0 18px !important;
    color: #000000 !important;
    font-size: 28px !important;
    font-weight: 900 !important;
    line-height: 0.95 !important;
    letter-spacing: -1px !important;
  }

  /* Checkout email input */

  .checkout-content .checkout-input-wrap {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    margin: 0 !important;
    overflow: visible !important;
  }

  .checkout-content .checkout-input-wrap span {
    display: none !important;
  }

  .checkout-content .checkout-input-wrap input {
    position: relative !important;
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    max-width: 100% !important;
    height: 58px !important;
    margin: 0 !important;
    padding: 0 16px !important;
    border: 1.5px solid #d2d2cf !important;
    border-radius: 14px !important;
    background: #ffffff !important;
    color: #111111 !important;
    caret-color: #111111 !important;
    font-size: 16px !important;
    font-weight: 650 !important;
    line-height: normal !important;
    opacity: 1 !important;
    outline: none !important;
    transform: none !important;
    translate: none !important;
    scale: none !important;
    zoom: 1 !important;
    pointer-events: auto !important;
    touch-action: manipulation !important;
    user-select: text !important;
    -webkit-user-select: text !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    -webkit-text-fill-color: #111111 !important;
  }

  .checkout-content .checkout-input-wrap input::placeholder {
    color: #858585 !important;
    opacity: 1 !important;
    -webkit-text-fill-color: #858585 !important;
  }

  .checkout-content .checkout-input-wrap input:focus {
    border-color: #111111 !important;
    box-shadow: 0 0 0 3px rgba(203, 229, 52, 0.35) !important;
    transform: none !important;
    zoom: 1 !important;
  }

  .checkout-content .checkout-required-note {
    margin: 12px 0 0 !important;
    color: #777777 !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    line-height: 1.35 !important;
  }

  .checkout-content .checkout-checkbox {
    display: flex !important;
    width: 100% !important;
    align-items: center !important;
    gap: 12px !important;
    margin: 20px 0 0 !important;
    color: #111111 !important;
    font-size: 16px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
  }

  .checkout-content .checkout-checkbox input {
    position: relative !important;
    display: block !important;
    flex: 0 0 22px !important;
    width: 22px !important;
    height: 22px !important;
    margin: 0 !important;
    accent-color: #000000 !important;
    transform: none !important;
  }

  /* Order summary review card */

  .checkout-content .checkout-review-section {
    width: 100% !important;
    margin-top: 38px !important;
  }

  .checkout-content .checkout-review-section h2 {
    margin-bottom: 12px !important;
  }

  .checkout-content .checkout-muted {
    margin: 0 0 20px !important;
    color: #777777 !important;
    font-size: 15px !important;
    font-weight: 650 !important;
    line-height: 1.35 !important;
  }

  .checkout-content .checkout-review-card {
    width: 100% !important;
    margin: 0 !important;
    overflow: hidden !important;
    border: 1.5px solid #1b1b1b !important;
    border-radius: 20px !important;
    background: #ffffff !important;
    box-shadow: none !important;
  }

  .checkout-content .checkout-review-row {
    display: grid !important;
    width: 100% !important;
    grid-template-columns: 92px minmax(0, 1fr) !important;
    align-items: start !important;
    gap: 14px !important;
    padding: 17px 18px !important;
    border-bottom: 1px solid #e5e5e1 !important;
  }

  .checkout-content .checkout-review-row:last-child {
    border-bottom: 0 !important;
  }

  .checkout-content .checkout-review-row span {
    color: #777777 !important;
    font-size: 13px !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
  }

  .checkout-content .checkout-review-row strong {
    min-width: 0 !important;
    color: #111111 !important;
    font-size: 14px !important;
    font-weight: 900 !important;
    line-height: 1.25 !important;
    text-align: right !important;
    overflow-wrap: anywhere !important;
  }

  .checkout-content .checkout-review-stripe-note {
    display: grid !important;
    grid-template-columns: 24px minmax(0, 1fr) !important;
    align-items: flex-start !important;
    gap: 10px !important;
    margin: 16px 0 0 !important;
    color: #626262 !important;
  }

  .checkout-content .checkout-review-stripe-note span {
    display: flex !important;
    width: 24px !important;
    height: 24px !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 999px !important;
    background: #cbea19 !important;
    color: #111111 !important;
    font-size: 14px !important;
    font-weight: 900 !important;
  }

  .checkout-content .checkout-review-stripe-note p {
    margin: 2px 0 0 !important;
    color: #626262 !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    line-height: 1.3 !important;
  }

  /* Payment button */

  .checkout-content .checkout-pay-button {
    position: relative !important;
    display: flex !important;
    width: 100% !important;
    height: 58px !important;
    align-items: center !important;
    justify-content: center !important;
    margin: 30px 0 0 !important;
    padding: 0 20px !important;
    border: 0 !important;
    border-radius: 999px !important;
    background: #d7d7d4 !important;
    color: #777777 !important;
    font-size: 20px !important;
    font-weight: 900 !important;
    letter-spacing: -0.4px !important;
    transform: none !important;
    pointer-events: auto !important;
  }

  .checkout-content .checkout-pay-button.is-ready {
    background: #cbea19 !important;
    color: #000000 !important;
    cursor: pointer !important;
  }

  .checkout-content .checkout-pay-button.is-ready:hover {
    transform: none !important;
    box-shadow: none !important;
  }
}
  /* =========================================================
   FINAL MOBILE HOW IT WORKS PAGE
   Desktop remains untouched.
   ========================================================= */

@media (max-width: 768px) {
  .main-shell:has(.how-it-works-page) {
    width: 100% !important;
    height: auto !important;
    min-height: 100dvh !important;
    max-height: none !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
    background: #870019 !important;
  }

  .page-content:has(.how-it-works-page) {
    width: 100% !important;
    height: auto !important;
    min-height: 100dvh !important;
    max-height: none !important;
    overflow: visible !important;
    background: #870019 !important;
  }

  .how-it-works-page {
    display: block !important;
    width: 100% !important;
    min-height: 100dvh !important;

    padding:
      calc(
        max(
            52px,
            calc(env(safe-area-inset-top, 0px) + 12px)
          ) + 24vw
      )
      5vw
      18vw !important;

    margin: 0 !important;
    overflow: visible !important;
    background: #870019 !important;
    color: #f7b9dc !important;
  }

  .how-it-works-frame {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    transform: none !important;
  }

  .how-it-works-frame h1 {
    width: 100% !important;
    margin: 0 0 10vw !important;

    color: #f7b9dc !important;
    font-size: 13vw !important;
    font-weight: 900 !important;
    line-height: 0.92 !important;
    letter-spacing: -0.5vw !important;
    text-align: center !important;
  }

  .how-faq-list {
    display: flex !important;
    width: 100% !important;
    flex-direction: column !important;
    gap: 4vw !important;

    margin: 0 !important;
    padding: 0 !important;
  }

  .how-faq-item {
    width: 100% !important;
    margin: 0 !important;

    border: 0 !important;
    border-radius: 7vw !important;

    background: #680014 !important;
    color: #f7b9dc !important;

    overflow: hidden !important;
    box-shadow: none !important;
  }

  .how-faq-item summary {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) auto !important;
    align-items: center !important;
    gap: 4vw !important;

    width: 100% !important;
    min-height: 0 !important;

    margin: 0 !important;
    padding: 6.5vw 7vw !important;

    color: #f7b9dc !important;
    font-size: 6.2vw !important;
    font-weight: 900 !important;
    line-height: 1.15 !important;
    letter-spacing: -0.15vw !important;

    cursor: pointer !important;
    list-style: none !important;
  }

  .how-faq-item summary::-webkit-details-marker {
    display: none !important;
  }

  .how-faq-item summary > span:first-child {
    min-width: 0 !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
  }

  .how-faq-icon {
    display: flex !important;
    width: 7vw !important;
    height: 7vw !important;
    flex: 0 0 7vw !important;

    align-items: center !important;
    justify-content: center !important;

    color: #f7b9dc !important;
    font-size: 5vw !important;
    font-weight: 900 !important;
    line-height: 1 !important;

    transition: transform 180ms ease !important;
  }

  .how-faq-item[open] .how-faq-icon {
    transform: rotate(180deg) !important;
  }

  .how-faq-item[open] summary {
    padding-bottom: 3.5vw !important;
  }

  .how-faq-item p {
    width: 100% !important;
    max-width: none !important;

    margin: 0 !important;
    padding: 0 7vw 7vw !important;

    color: #ffd6ea !important;
    font-size: 4.35vw !important;
    font-weight: 650 !important;
    line-height: 1.42 !important;
    letter-spacing: -0.04vw !important;

    overflow-wrap: normal !important;
    word-break: normal !important;
  }
}
  /* =========================================================
   FINAL MOBILE GIFT TRACKER PAGE
   Desktop remains completely untouched.
   ========================================================= */

@media (max-width: 768px) {
  .gift-tracker-page {
    display: block !important;
    width: 100% !important;
    min-height: 100dvh !important;
    margin: 0 !important;

    padding:
      calc(
        max(
            52px,
            calc(env(safe-area-inset-top, 0px) + 12px)
          ) + 22vw
      )
      5vw
      16vw !important;

    overflow-x: hidden !important;
    overflow-y: visible !important;

    background:
      radial-gradient(
        circle at 15% 18%,
        rgba(255, 255, 255, 0.34),
        transparent 30%
      ),
      radial-gradient(
        circle at 85% 15%,
        rgba(255, 255, 255, 0.24),
        transparent 32%
      ),
      #e9b6e8 !important;

    color: #1f2333 !important;
  }

  .gift-tracker-hero {
    display: flex !important;
    flex-direction: column !important;

    width: 100% !important;
    max-width: none !important;

    margin: 0 !important;
    padding: 0 !important;
    gap: 6vw !important;

    transform: none !important;
  }

  /* CHAT CARD */

  .gift-tracker-chat-card {
    display: flex !important;
    flex-direction: column !important;

    width: 100% !important;
    min-width: 0 !important;
    min-height: 0 !important;

    margin: 0 !important;
    padding: 4.5vw 4vw 5vw !important;

    border-radius: 7vw !important;
    background: #ffffff !important;

    box-shadow: 0 5vw 14vw rgba(53, 21, 64, 0.14) !important;

    overflow: hidden !important;
  }

  .tracker-chat-topbar {
    display: grid !important;
    grid-template-columns: auto minmax(0, 1fr) auto !important;
    align-items: center !important;

    width: 100% !important;
    min-width: 0 !important;
    gap: 2.5vw !important;
  }

  .tracker-chat-menu {
    font-size: 6vw !important;
    line-height: 1 !important;
  }

  .tracker-chat-name {
    display: flex !important;
    min-width: 0 !important;
    align-items: center !important;
    gap: 2vw !important;
    margin: 0 !important;

    font-size: 4vw !important;
    font-weight: 900 !important;
  }

  .tracker-chat-avatar {
    width: 8vw !important;
    height: 8vw !important;
    flex: 0 0 8vw !important;
    font-size: 4vw !important;
  }

  .tracker-chat-topbar button {
    width: auto !important;
    max-width: 25vw !important;
    height: 9vw !important;
    min-width: 0 !important;

    padding: 0 3vw !important;

    border: 0.3vw solid #e4e4e4 !important;
    border-radius: 2.5vw !important;

    background: #ffffff !important;
    color: #8d8d8d !important;

    font-size: 3vw !important;
    font-weight: 850 !important;
    line-height: 1 !important;
    white-space: nowrap !important;
  }

  .tracker-chat-intro {
    width: 100% !important;
    max-width: none !important;

    margin: 12vw auto 9vw !important;
    padding: 0 3vw !important;

    text-align: center !important;
  }

  .tracker-chat-big-avatar {
    width: 18vw !important;
    height: 18vw !important;

    margin: 0 auto 4vw !important;

    font-size: 8vw !important;
  }

  .tracker-chat-intro h2 {
    margin: 0 0 3vw !important;

    color: #1f2333 !important;
    font-size: 8vw !important;
    font-weight: 950 !important;
    line-height: 1 !important;
    letter-spacing: -0.2vw !important;
  }

  .tracker-chat-intro p {
    width: 100% !important;
    margin: 0 !important;

    color: #515563 !important;
    font-size: 4vw !important;
    font-weight: 750 !important;
    line-height: 1.3 !important;

    overflow-wrap: anywhere !important;
  }

  .tracker-chat-date {
    margin: 0 auto 8vw !important;

    color: #999999 !important;
    font-size: 3.5vw !important;
    font-weight: 850 !important;
  }

  .tracker-chat-message-row {
    display: grid !important;
    grid-template-columns: 8vw minmax(0, 1fr) !important;
    align-items: start !important;

    width: 100% !important;
    min-width: 0 !important;

    gap: 3vw !important;
    margin: 0 !important;
    padding: 0 1vw !important;
  }

  .tracker-chat-message-row > div {
    width: 100% !important;
    min-width: 0 !important;
  }

  .tracker-chat-small-avatar {
    width: 8vw !important;
    height: 8vw !important;
    flex: 0 0 8vw !important;

    font-size: 4vw !important;
  }

  .tracker-chat-question {
    width: 100% !important;
    margin: 0 0 2.5vw !important;

    color: #242838 !important;
    font-size: 4vw !important;
    font-weight: 900 !important;
    line-height: 1.25 !important;

    white-space: normal !important;
    overflow-wrap: anywhere !important;
  }

  .tracker-chat-bubble {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;

    color: #242838 !important;
    font-size: 3.8vw !important;
    font-weight: 750 !important;
    line-height: 1.35 !important;

    white-space: normal !important;
    overflow-wrap: anywhere !important;
  }

  .tracker-chat-input-row {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) 10vw !important;
    align-items: center !important;

    width: 100% !important;
    min-width: 0 !important;
    min-height: 13vw !important;

    margin: 10vw 0 0 !important;
    padding: 1.5vw 1.5vw 1.5vw 4vw !important;

    border: 0.3vw solid #d4d4d4 !important;
    border-radius: 4vw !important;

    background: #ffffff !important;
  }

  .tracker-chat-input-row input {
    width: 100% !important;
    min-width: 0 !important;
    height: 10vw !important;

    padding: 0 !important;
    border: 0 !important;
    outline: 0 !important;

    background: transparent !important;
    color: #1f2333 !important;

    font-size: 16px !important;
    font-weight: 750 !important;
  }

  .tracker-chat-input-row button {
    width: 9vw !important;
    height: 9vw !important;

    border: 0 !important;
    border-radius: 999px !important;

    background: #777777 !important;
    color: #ffffff !important;

    font-size: 4vw !important;
    font-weight: 900 !important;
  }

  /* SEARCH AND SUPPORT CARD */

  .gift-tracker-help-card {
    width: 100% !important;
    min-width: 0 !important;

    margin: 0 !important;
    padding: 8vw 5vw !important;

    border-radius: 7vw !important;
    background: #ffffff !important;

    text-align: center !important;

    box-shadow: 0 5vw 14vw rgba(53, 21, 64, 0.14) !important;
  }

  .tracker-eyebrow {
    margin: 0 0 3vw !important;

    font-size: 3.1vw !important;
    font-weight: 950 !important;
    letter-spacing: 0.08em !important;
  }

  .gift-tracker-help-card h1 {
    margin: 0 !important;

    color: #1f2333 !important;
    font-size: 10vw !important;
    font-weight: 950 !important;
    line-height: 0.95 !important;
    letter-spacing: -0.3vw !important;
  }

  .tracker-subtitle {
    width: 100% !important;
    max-width: none !important;

    margin: 4vw auto 6vw !important;

    color: #1f2333 !important;
    font-size: 4vw !important;
    font-weight: 750 !important;
    line-height: 1.3 !important;
  }

.tracker-search-bar {
  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  justify-content: center !important;

  width: 100% !important;
  min-height: 0 !important;
  height: auto !important;

  margin: 0 auto 8vw !important;
  padding: 4vw !important;
  gap: 3vw !important;

  border-radius: 6vw !important;
  background: #f6f6f3 !important;
  box-sizing: border-box !important;
}

.tracker-search-bar button {
  display: flex !important;
  width: 100% !important;
  height: 13vw !important;
  min-height: 52px !important;

  align-items: center !important;
  justify-content: center !important;

  margin: 0 !important;
  padding: 0 5vw !important;

  border: 0 !important;
  border-radius: 999px !important;

  background: #1f2333 !important;
  color: #ffffff !important;

  font-size: 4vw !important;
  font-weight: 950 !important;
  line-height: 1 !important;
  box-sizing: border-box !important;
}

  .tracker-search-bar button {
    width: 100% !important;
    height: 12vw !important;

    padding: 0 5vw !important;

    border: 0 !important;
    border-radius: 999px !important;

    background: #1f2333 !important;
    color: #ffffff !important;

    font-size: 4vw !important;
    font-weight: 950 !important;
  }

  .gift-tracker-help-card h2,
  .tracker-complaint-card h3 {
    margin: 0 0 5vw !important;

    color: #1f2333 !important;
    font-size: 6vw !important;
    font-weight: 950 !important;
    line-height: 1.05 !important;
  }

  .tracker-topic-grid {
    display: grid !important;
    grid-template-columns: 1fr !important;

    width: 100% !important;
    gap: 3vw !important;
    margin: 0 0 8vw !important;
  }

  .tracker-topic-grid button {
    width: 100% !important;
    min-height: 18vw !important;

    padding: 4vw !important;

    border: 0 !important;
    border-radius: 5vw !important;

    background: #ffffff !important;
    color: #e03d5d !important;

    box-shadow: 0 3vw 8vw rgba(44, 22, 54, 0.11) !important;

    font-size: 4vw !important;
    font-weight: 950 !important;
    line-height: 1.15 !important;
  }

  .tracker-complaint-card {
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .tracker-complaint-card button {
    width: 100% !important;
    height: 12vw !important;

    padding: 0 5vw !important;
    border-radius: 999px !important;

    font-size: 4vw !important;
  }

  .tracker-complaint-card a {
    display: block !important;
    margin-top: 4vw !important;

    font-size: 3.8vw !important;
    font-weight: 950 !important;
  }
}
  /* =========================================================
   MOBILE CARD TITLE DESCENDER FIX
   Prevents g, y, p, q and j from being clipped.
   ========================================================= */

@media (max-width: 768px) {
  .gift-browser-page .gift-card-title {
    height: 1.55em !important;
    padding-bottom: 0.3em !important;

    font-size: clamp(13px, 3.5vw, 18px) !important;
    line-height: 1.25 !important;

    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  .gift-browser-page .gift-card-range {
    top: calc(
      var(--mobile-card-image-height) + 10.2vw
    ) !important;
  }
}
  .signout-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: signoutOverlayIn 180ms ease both;
}

.signout-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.signout-loading-spinner {
  width: 46px;
  height: 46px;
  border: 4px solid #ddddda;
  border-top-color: #111111;
  border-radius: 50%;
  animation: signoutLoadingSpin 700ms linear infinite;
}

.signout-loading-content p {
  margin: 0;
  color: #111111;
  font-size: 17px;
  font-weight: 800;
}

@keyframes signoutLoadingSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes signoutOverlayIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
      `}</style>
    </main>
  );
}