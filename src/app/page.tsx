"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BrowserCard = {
  id: string;
  title: string;
  fullTitle: string;
  image: string;
  tileImage: string;
  category: string;
  isNew: boolean;
  description: string;
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

const homepageGiftCards = [
  "/images/target.png",
  "/images/uber.png",
  "/images/best-buy.png",
  "/images/ebay.png",
  "/images/roblox.png",
  "/images/playstation.png",
  "/images/amc-theatre.png",
  "/images/american-eagle.png",
  "/images/airbnb.png",
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

const browserCategories = [
  "Smart Cards",
  "Groceries",
  "Food delivery",
  "Fashion",
  "Retail",
  "Entertainment",
  "Gaming",
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
  { handle: "@selenagomez", subtitle: "Music, beauty, and creator drops" },
  { handle: "@charlidamelio", subtitle: "Lifestyle, dance, and fan favourites" },
  { handle: "@mrbeast", subtitle: "Creator merch, videos, and campaigns" },
  { handle: "@emmachamberlain", subtitle: "Coffee, style, and creator picks" },
  { handle: "@dualipa", subtitle: "Music, merch, and exclusive moments" },
  { handle: "@rarebeauty", subtitle: "Beauty, impact, and community" },
  { handle: "@taylorswift", subtitle: "Music, eras, merch, and fan moments" },
  { handle: "@billieeilish", subtitle: "Music, drops, and creator exclusives" },
  { handle: "@kyliejenner", subtitle: "Beauty, lifestyle, and product drops" },
  { handle: "@khaby.lame", subtitle: "Comedy, creator content, and socials" },
  { handle: "@addisonre", subtitle: "Lifestyle, beauty, and creator picks" },
  { handle: "@oliviarodrigo", subtitle: "Music, merch, and fan gifting" },
  { handle: "@arianagrande", subtitle: "Music, beauty, and limited drops" },
  { handle: "@ksi", subtitle: "Creator merch, music, and campaigns" },
  { handle: "@ninja", subtitle: "Gaming, streaming, and fan rewards" },
  { handle: "@pokimane", subtitle: "Gaming, creator drops, and community" },
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

type ActivePage = "home" | "wall" | "product";
type ProductStep = "value" | "recipient" | "personalize" | "checkout";
type RecipientType = "creator" | "someone" | "myself";
type Creator = (typeof creators)[number];
type MediaMode = "card" | "gif" | "video";
type Country = (typeof countries)[number];

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

export default function Home() {
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

  const [activePage, setActivePage] = useState<ActivePage>("home");
  const [backgroundPage, setBackgroundPage] = useState<ActivePage>("home");
  const [pageTransitioning, setPageTransitioning] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrowserCardId, setSelectedBrowserCardId] = useState<
    string | null
  >(null);
  const [selectedProductCard, setSelectedProductCard] =
    useState<BrowserCard>(defaultLinktreeProduct);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState("Featured");

  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [countryToastVisible, setCountryToastVisible] = useState(false);

  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [productStep, setProductStep] = useState<ProductStep>("value");
  const [recipientType, setRecipientType] =
    useState<RecipientType>("someone");
  const [amountDropdownOpen, setAmountDropdownOpen] = useState(false);
  const [creatorPickerOpen, setCreatorPickerOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  const [personalizeMediaOn, setPersonalizeMediaOn] = useState(false);
  const [personalizeMessageOn, setPersonalizeMessageOn] = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>("card");
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null
  );
  const [uploadedMediaName, setUploadedMediaName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  const formatAmount = (value: number) => {
    return `${selectedCountry.currency}${value.toFixed(2)}`;
  };

  const formatCompactAmount = (value: number) => {
    return `${selectedCountry.currency}${value}`;
  };

  const giftCardRange = `${formatCompactAmount(5)} - ${formatCompactAmount(
    500
  )}`;

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
      : checkoutEmail.trim() || "your email";

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
    setRecipientType("someone");
    setAmountDropdownOpen(false);
    setCreatorPickerOpen(false);
    setSelectedCreator(null);
    setRecipientName("");
    setRecipientEmail("");
    setRecipientPhone("");
    resetPersonalize();
    resetCheckout();
  };

  const triggerCountryToast = () => {
    if (countryToastTimerRef.current) {
      window.clearTimeout(countryToastTimerRef.current);
    }

    setCountryToastVisible(true);

    countryToastTimerRef.current = window.setTimeout(() => {
      setCountryToastVisible(false);
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
    resetProductFlow();

    if (activePage === "wall") {
      setNavHidden(false);
      setDisableNavTransition(true);

      scrollRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        setDisableNavTransition(false);
      }, 160);

      return;
    }

    transitionToPage("wall");
  };

  const goToProductPage = (card: BrowserCard = defaultLinktreeProduct) => {
    setSelectedProductCard(card);
    resetProductFlow();
    transitionToPage("product");
  };

  const goHome = () => {
    resetProductFlow();

    if (activePage === "home") {
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    transitionToPage("home");
  };

  const handleBrowserCardClick = (card: BrowserCard) => {
    setSelectedBrowserCardId(card.id);

    setTimeout(() => {
      goToProductPage(card);
    }, 110);
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
    setSelectedCountry(country);
    setCountryOpen(false);
    setRecipientPhone("");
    triggerCountryToast();
  };

  const handleValueContinue = () => {
    if (!selectedAmount) return;

    setProductStep("recipient");
    setAmountDropdownOpen(false);
    setCreatorPickerOpen(false);

    setTimeout(() => {
      resetScroll();
    }, 40);
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
    setTimeout(() => resetScroll(), 20);
  };

  const handleFinalCTA = () => {
    if (!recipientReady) return;

    if (recipientType === "myself") {
      setProductStep("checkout");
      setAmountDropdownOpen(false);
      setCreatorPickerOpen(false);

      setTimeout(() => {
        resetScroll();
      }, 40);

      return;
    }

    setProductStep("personalize");
    setAmountDropdownOpen(false);
    setCreatorPickerOpen(false);

    setTimeout(() => {
      resetScroll();
    }, 40);
  };

  const handlePersonalizeContinue = () => {
    if (!personalizeCanContinue) return;

    setProductStep("checkout");

    setTimeout(() => {
      resetScroll();
    }, 40);
  };

  const handleCheckoutSubmit = () => {
    if (!checkoutReady) return;

    console.log("Checkout submitted:", {
      receiptEmail: checkoutEmail,
      amount: selectedAmountObject.value,
      currency: selectedCountry.currency,
      country: selectedCountry.label,
      cardNumber,
      cardExpiry,
      cardCvc,
      cardName,
      recipientType,
      creator: selectedCreator?.handle ?? null,
      recipientName,
      recipientEmail,
      recipientPhone,
      giftDestination,
      personalizeMediaOn,
      mediaMode,
      selectedMediaIndex,
      uploadedMediaName,
      personalizeMessageOn,
      personalMessage,
      product: selectedProductCard.fullTitle,
    });
  };

  return (
    <main
      ref={scrollRef}
      onScroll={handleScroll}
      className={`main-shell h-screen w-full overflow-y-scroll overflow-x-hidden ${
        backgroundPage === "home" ? "bg-[#cbea19]" : "bg-[#f3f3f1]"
      }`}
    >
      {countryToastVisible && (
        <div className="country-change-toast">
          Updated to {selectedCountry.label} {selectedCountry.flag}
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
              className="linktree-logo-link"
              type="button"
              onClick={goHome}
              aria-label="Go home"
            >
              <img
                className="linktree-logo"
                src="/images/linktree-logo.png"
                alt="Linktree"
              />
            </button>

            <button
              className="linktree-nav-item shop-link"
              type="button"
              onClick={goToWallOfCards}
            >
              Shop Gift Cards
            </button>

            <button className="linktree-nav-item how-link" type="button">
              How it Works
            </button>

            <button className="linktree-nav-item tracker-link" type="button">
              Gift Tracker
            </button>

            <button className="linktree-nav-item help-link" type="button">
              Help
            </button>

            <div className="country-area" ref={countryAreaRef}>
              <button
                type="button"
                className="country-pill"
                onClick={() => setCountryOpen((prev) => !prev)}
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

            <button className="login-button" type="button">
              Log in
            </button>

            <button className="signup-button" type="button">
              Sign up free
            </button>
          </nav>
        </header>
      )}

      <div
        className={`page-content ${
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
                    setProductStep(
                      recipientType === "myself" ? "recipient" : "personalize"
                    );
                    setTimeout(() => resetScroll(), 20);
                  }}
                  className="checkout-back-button"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={goToWallOfCards}
                  className="checkout-close-button"
                  aria-label="Close and return to wall of cards"
                >
                  ×
                </button>

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
                      <span>Email for receipt</span>
                      <input
                        value={checkoutEmail}
                        onChange={(event) =>
                          setCheckoutEmail(event.target.value)
                        }
                        type="email"
                        placeholder="Email for receipt"
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

                  <div className="express-checkout">
                    <p>Express checkout</p>

                    <div className="express-buttons">
                      <button
                        type="button"
                        className="apple-pay-button"
                        aria-label="Apple Pay"
                      >
                        <img
                          src="/images/apple-pay-white.png"
                          alt="Apple Pay"
                          draggable={false}
                        />
                      </button>

                      <button
                        type="button"
                        className="google-pay-button"
                        aria-label="Google Pay"
                      >
                        <img
                          src="/images/google-pay-white.png"
                          alt="Google Pay"
                          draggable={false}
                        />
                      </button>
                    </div>

                    <div className="checkout-or">
                      <span />
                      <p>OR</p>
                      <span />
                    </div>
                  </div>

                  <div className="checkout-section checkout-payment-section">
                    <h2>Payment</h2>
                    <p className="checkout-muted">
                      All transactions are secure and encrypted.
                    </p>

                    <div className="payment-card">
                      <div className="payment-card-header">
                        <span>Credit card</span>

                        <div className="payment-card-icons">
                          <span>VISA</span>
                          <span>MC</span>
                          <span>AMEX</span>
                        </div>
                      </div>

                      <div className="payment-card-body">
                        <input
                          value={cardNumber}
                          onChange={(event) =>
                            setCardNumber(event.target.value)
                          }
                          placeholder="Card number"
                        />

                        <div className="payment-grid">
                          <input
                            value={cardExpiry}
                            onChange={(event) =>
                              setCardExpiry(event.target.value)
                            }
                            placeholder="Expiration date (MM / YY)"
                          />

                          <input
                            value={cardCvc}
                            onChange={(event) =>
                              setCardCvc(event.target.value)
                            }
                            placeholder="Security code"
                          />
                        </div>

                        <input
                          value={cardName}
                          onChange={(event) => setCardName(event.target.value)}
                          placeholder="Name on card"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="checkout-section">
                    <h2>Billing address</h2>

                    <div className="billing-card">
                      <select value={selectedCountry.label} onChange={() => {}}>
                        {countries.map((country) => (
                          <option key={country.code}>{country.label}</option>
                        ))}
                      </select>

                      <input placeholder="First name" />
                      <input placeholder="Last name" />
                      <input placeholder="Address" />
                      <input placeholder="Apartment, suite, etc. (optional)" />

                      <div className="payment-grid">
                        <input placeholder="City" />
                        <input placeholder="Postcode" />
                      </div>
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
                    setProductStep("recipient");
                    setTimeout(() => resetScroll(), 20);
                  }}
                  className="personalize-back-button"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={goToWallOfCards}
                  className="personalize-close-button"
                  aria-label="Close and return to wall of cards"
                >
                  ×
                </button>

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
                            Keep your video or audio file under 30 seconds and
                            up to 300MB.
                          </p>

                          <input
                            ref={mediaUploadRef}
                            type="file"
                            accept=".mp3,.mp4,audio/mpeg,video/mp4"
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

                <button
                  type="button"
                  onClick={goToWallOfCards}
                  className="recipient-close-button"
                  aria-label="Close and return to wall of cards"
                >
                  ×
                </button>

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

                    <button
                      type="button"
                      className={recipientType === "myself" ? "is-active" : ""}
                      onClick={() => handleRecipientTypeChange("myself")}
                    >
                      Myself
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
                          <div className="creator-avatar" />

                          <div className="creator-copy">
                            <div className="creator-handle">
                              {selectedCreator.handle}
                            </div>

                            <div className="creator-subtext">
                              Selected creator. Tap to choose a different
                              creator.
                            </div>
                          </div>
                        </button>
                      )}

                      {creatorPickerOpen && (
                        <div className="creator-picker">
                          <div className="creator-picker-header">
                            <div>
                              <h4>Choose a Linktree creator</h4>
                              <p>Select who this eGift Card is for.</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => setCreatorPickerOpen(false)}
                              aria-label="Close creator picker"
                            >
                              ×
                            </button>
                          </div>

                          <div className="creator-list">
                            {creators.map((creator) => {
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
                                  <div className="creator-list-avatar" />

                                  <div className="creator-list-copy">
                                    <div>{creator.handle}</div>
                                    <p>{creator.subtitle}</p>
                                  </div>

                                  <span>
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
                <button
                  type="button"
                  onClick={goToWallOfCards}
                  className="linktree-back-button"
                >
                  ← Back
                </button>

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
                </div>

                <h2 className="linktree-purchase-heading">
                  How much would you like to purchase?
                </h2>

                <div className="linktree-amount-panel" />

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

                  return (
                    <button
                      key={card.id}
                      type="button"
                      className={`gift-card-tile ${
                        isSelected ? "is-selected" : ""
                      }`}
                      onClick={() => handleBrowserCardClick(card)}
                      aria-pressed={isSelected}
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
                    </button>
                  );
                })}
              </div>
            </section>
          </main>
        ) : (
          <>
            <section className="relative h-screen w-full overflow-hidden bg-[#cbea19]">
              <img
                src="/images/starting-page.png"
                alt="Starting page"
                draggable={false}
                className="hero-bg absolute inset-0 h-full w-full object-cover select-none pointer-events-none"
              />

              <button
                onClick={goToWallOfCards}
                aria-label="Start browsing"
                className="start-browsing-button absolute z-[300] cursor-pointer rounded-full bg-transparent"
              />

              <div className="carousel-window absolute z-10 overflow-hidden pointer-events-none">
                <div className="carousel-track flex flex-col">
                  <img
                    src="/images/support-creators.png"
                    alt=""
                    draggable={false}
                    className="carousel-card"
                  />

                  <img
                    src="/images/gaming-wishlist.png"
                    alt=""
                    draggable={false}
                    className="carousel-card"
                  />

                  <img
                    src="/images/self-care-sale.png"
                    alt=""
                    draggable={false}
                    className="carousel-card"
                  />

                  <img
                    src="/images/support-creators.png"
                    alt=""
                    draggable={false}
                    className="carousel-card"
                  />

                  <img
                    src="/images/gaming-wishlist.png"
                    alt=""
                    draggable={false}
                    className="carousel-card"
                  />

                  <img
                    src="/images/self-care-sale.png"
                    alt=""
                    draggable={false}
                    className="carousel-card"
                  />

                  <img
                    src="/images/support-creators.png"
                    alt=""
                    draggable={false}
                    className="carousel-card"
                  />
                </div>
              </div>
            </section>

            <section className="relative h-[76vh] w-full overflow-hidden bg-[#f4f4f2]">
              <div className="absolute left-1/2 top-[15%] z-20 flex -translate-x-1/2 flex-col items-center">
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
                  ].map((src, index) => (
                    <img
                      key={`${src}-${index}`}
                      src={src}
                      alt=""
                      draggable={false}
                      className="h-[16.2vw] w-[26.1vw] flex-shrink-0 rounded-[1.8vw] object-cover select-none pointer-events-none"
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="blue-cta-section relative w-full overflow-hidden bg-[#2559CD]">
              <img
                src="/images/final-look-3-page.png"
                alt="Linktree Smart Card section"
                draggable={false}
                className="block h-auto w-full select-none pointer-events-none"
              />

              <button
                type="button"
                className="blue-start-gifting-button"
                onClick={() => goToProductPage(defaultLinktreeProduct)}
              >
                Start gifting now
              </button>
            </section>

            <section className="relative w-full overflow-hidden bg-white">
              <img
                src="/images/last-page.png"
                alt="Last page"
                draggable={false}
                className="block h-auto w-full select-none pointer-events-none"
              />

              <a
                href="https://linktr.ee/"
                aria-label="Claim your Linktree"
                className="claim-linktree-button"
              />
            </section>
          </>
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

        .main-shell {
          transition: background-color 360ms ease;
          font-family: "Link Sans", Arial, sans-serif !important;
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
          left: 168px;
          width: 154px;
        }

        .how-link {
          left: 326px;
          width: 136px;
        }

        .tracker-link {
          left: 466px;
          width: 128px;
        }

        .help-link {
          left: 598px;
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
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          background: transparent;
        }

        .recipient-toggle button {
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

        .creator-list-item span {
          color: #000000;
          font-size: 16px;
          font-weight: 900;
          border-radius: 999px;
          background: #ffffff;
          padding: 10px 14px;
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

        .checkout-pay-button {
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
          animation: carouselStep 13s ease-in-out infinite;
          pointer-events: none;
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
          .gift-browser-frame,
          .linktree-smart-frame,
          .recipient-frame,
          .personalize-frame,
          .checkout-frame {
            transform: scale(1);
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
      `}</style>
    </main>
  );
}