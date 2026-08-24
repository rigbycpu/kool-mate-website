const business = {
  phone: "+63 993 551 5531",
  phoneSms: "+639935515531",
  email: "koolmateadmin070826@gmail.com",
  address: "244 Mikas Street, Real 1, Bacoor, Cavite, Philippines, 4102",
  messenger: "https://m.me/61591997337938",
  facebook: "https://www.facebook.com/profile.php?id=61591997337938",
  maps: "https://www.google.com/maps/place/KOOLMATE+AIR-CONDITIONING+SERVICES+AND+MAINTENANCE,+240+Mikas,+Bacoor,+Cavite/data=!4m2!3m1!1s0x3397d30049c80b31:0xbc7452a11a6e8bd1!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjMyLjYYACCenQoqnwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTY1MzUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODE1NjM1LDEwMDgyMDIzNywxMDA4MjI0ODlCAlBI&skid=4953a404-f13c-484f-ade5-13ce73ac64d2&g_st=afm"
};

const productImages = {
  split: "https://vsprod.vijaysales.com/media/catalog/product/2/5/254535.jpg?fit=bounds&optimize=medium&width=500",
  inverter: "https://static.wixstatic.com/media/3736cd_55e92f1620fc43d2b3be8dd8c863fb9f~mv2.png/v1/fit/w_500%2Ch_500%2Cq_90/file.png",
  lg: "https://jum3a.com/cdn/shop/files/AMPN13T4W_a.jpg?v=1758102186",
  samsung: "https://jetstereo-retail.s3.us-east-2.amazonaws.com/images/cache/catalog/public/products/product_COMBO_AR12TRHQDWKNXL_6871060eb2edc-500x500.webp",
  panasonic: "https://www.bdshop.com/pub/media/catalog/product/cache/0a9842a5e3033a11158d10717601d786/P/a/panasonic-nanoe-g-split-air-conditioner-cs-c18pkh.jpg"
};

const CMS_STORAGE_KEY = "koolMateCmsContent";
const AIRCON_BRANDS = ["Midea", "Carrier", "American Home", "TCL", "Daikin", "LG", "Haier", "Samsung", "Chiq", "Hisense"];
const UNIT_TAGS = {
  mostPopular: "Most Popular",
  bestPrice: "Best Price"
};
const PRICE_LIST_ROWS = 8;
const DEFAULT_PRICE_LIST_URL = "https://docs.google.com/spreadsheets/d/1r9cj5aqoRgck8dTMFpux4ePGYnoENrTQd0F8Gko19uk/edit?gid=0#gid=0";

function blankPriceRow() {
  return {
    brand: "",
    model: "",
    capacity: "",
    srp: "",
    cash: ""
  };
}

function normalizePriceListRows(rows) {
  const savedRows = Array.isArray(rows) ? rows : [];
  const normalized = savedRows.map((row) => ({
    ...blankPriceRow(),
    ...(row || {}),
    brand: String(row?.brand || "").trim(),
    model: String(row?.model || "").trim(),
    capacity: String(row?.capacity || "").trim(),
    srp: String(row?.srp || "").trim(),
    cash: String(row?.cash || "").trim()
  }));
  if (normalized.length) return normalized;
  return Array.from({ length: PRICE_LIST_ROWS }, () => blankPriceRow());
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

let workItems = [
  { titleKey: "workSlotInstall", type: "empty", image: "", url: "" },
  { titleKey: "workSlotCleaning", type: "empty", image: "", url: "" },
  { titleKey: "workSlotRepair", type: "empty", image: "", url: "" },
  { titleKey: "workSlotMaintenance", type: "empty", image: "", url: "" },
  { titleKey: "workSlotCommercial", type: "empty", image: "", url: "" }
];

let promos = [
  { enabled: true, title: { en: "Cooler, cleaner comfort", fil: "Mas malamig at malinis" }, image: "assets/promo-cool-home.jpg", url: "#quote" },
  { enabled: true, title: { en: "Aircon not cooling?", fil: "Hindi nagpapalamig ang aircon?" }, image: "assets/promo-aircon-solution.jpg", url: "#services" },
  { enabled: true, title: { en: "Cool comfort every day", fil: "Komportableng lamig araw-araw" }, image: "assets/promo-comfort-everyday.jpg", url: "#quote" },
  { enabled: true, title: { en: "Fast maintenance service", fil: "Mabilis na maintenance service" }, image: "assets/promo-lamig-solusyon.jpg", url: "#services" }
];

let priceList = {
  url: DEFAULT_PRICE_LIST_URL,
  label: { en: "View Full Price List", fil: "Tingnan ang Full Price List" },
  note: {
    en: "Prices and availability may change. Please message us to confirm the latest stock and final quote.",
    fil: "Maaaring magbago ang presyo at availability. Mag-message para ma-confirm ang latest stock at final quote."
  },
  rows: normalizePriceListRows([])
};

let airconUnits = AIRCON_BRANDS.flatMap((brand) => [1, 2].map((slot) => ({
  enabled: true,
  brand,
  slot,
  tag: slot === 1 ? "mostPopular" : "bestPrice",
  model: "",
  capacity: "",
  name: { en: "", fil: "" },
  type: { en: "", fil: "" },
  price: "",
  image: "",
  url: "#quote"
})));

let activePromoIndex = 0;

function resetHorizontalScroll() {
  if (window.scrollX) window.scrollTo(0, window.scrollY);
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
}

const icons = {
  install: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="12" width="44" height="18" rx="3"/><path d="M15 37h34"/><path d="M22 30v9M42 30v9"/><path class="accent-fill" d="M23 45l4-7 4 7-4 7zM34 47l3-5 3 5-3 5z"/><path d="M18 19h28"/></svg>',
  maintenance: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8l20 8v14c0 13-8 22-20 27-12-5-20-14-20-27V16z"/><path d="M23 32l6 6 13-16"/><path d="M21 17l11-4 11 4"/></svg>',
  cleaning: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 10h28l-2 17H20z"/><path d="M24 27v22a7 7 0 0 0 14 0V27"/><path d="M18 49h26"/><path class="accent-fill" d="M47 31l3 6 6 3-6 3-3 6-3-6-6-3 6-3zM51 15l2 4 4 2-4 2-2 4-2-4-4-2 4-2z"/></svg>',
  charging: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="21" cy="18" r="10"/><circle cx="43" cy="18" r="10"/><path d="M21 18l5-5M43 18l-5-5"/><path d="M21 28v24M43 28v24M14 52h36"/><path d="M27 34h10"/></svg>',
  repair: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="29" cy="29" r="17"/><path d="M42 42l12 12"/><path d="M22 29h14M29 22v14"/></svg>',
  relocation: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M42 13l12 12-12 12"/><path d="M10 25h43"/><path d="M22 51L10 39l12-12"/><path d="M54 39H11"/></svg>',
  reprocess: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M51 19v16H35"/><path d="M13 45V29h16"/><path d="M48 31A18 18 0 0 0 17 20"/><path d="M16 33a18 18 0 0 0 31 11"/></svg>',
  technician: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M18 28h28l5 26H13z"/><circle cx="32" cy="18" r="10"/><path d="M21 12h22"/><path d="M25 32l7 9 7-9"/><path d="M20 54V42M44 54V42"/></svg>',
  quality: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="25" r="17"/><path d="M32 15l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"/><path d="M22 40l-5 16 15-7 15 7-5-16"/></svg>',
  price: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 20h36v30H14z"/><path d="M22 20v-7h20v7"/><path d="M18 29h28"/><path d="M25 39h14"/><path d="M32 32v14"/></svg>',
  fast: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="35" cy="34" r="18"/><path d="M35 34l10-8"/><path d="M28 9h14"/><path d="M12 24h10M8 34h12M12 44h10"/></svg>',
  satisfaction: '<svg viewBox="0 0 64 64" aria-hidden="true"><path class="accent-fill" d="M18 52h-8V27h8z"/><path d="M18 30l12-20a6 6 0 0 1 9 6l-3 9h12a6 6 0 0 1 6 7l-3 14a8 8 0 0 1-8 6H18"/><path d="M43 9l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></svg>'
};

const translations = {
  en: {
    menu: "Menu",
    navHome: "Home",
    navAbout: "About Us",
    navServices: "Services",
    navUnits: "Aircon Units",
    navWork: "Our Work",
    navContact: "Contact Us",
    quoteBtn: "Get a Quote",
    heroTrust: "Trusted by many homes & businesses",
    heroTitle: "Cooler Air.<br><span>Cleaner Comfort.</span><br>Smarter Savings.",
    heroTagline: "Choose KOOLMATE!",
    heroLead: "Professional air-conditioning service for a cooler, cleaner and more energy-efficient home or business.",
    freeQuote: "Get a Free Quote",
    viewServices: "View Our Services",
    promiseFast: "Fast",
    promiseReliable: "Reliable",
    promiseAffordable: "Affordable",
    miniSales: "Aircon Sales",
    miniInstall: "Installation",
    miniMaintenance: "Maintenance",
    miniRepair: "Repair",
    miniCleaning: "Cleaning",
    servicesEyebrow: "Our Services",
    servicesTitle: "Air-conditioning support from purchase to long-term care.",
    servicesIntro: "From choosing the right unit to regular maintenance and repairs, we keep your space cool, efficient, and worry-free.",
    registered: "DTI & BIR Registered",
    quickCtaTitle: "Not sure which aircon or service you need?",
    quickCtaText: "We'll help you find the right cooling solution for your space and needs.",
    whyEyebrow: "Trusted Aircon Service",
    whyTitle: "Why choose KOOLMATE?",
    sellEyebrow: "We Sell",
    sellTitle: "All types of brand new aircon units",
    sellText: "We offer a wide range of trusted and high-quality air-conditioning brands to suit different home and business needs.",
    unitBadgeTypes: "Split / Window / Commercial",
    unitBadgeTypesText: "Multiple unit types available",
    unitBadgeNew: "Brand-New Units",
    unitBadgeNewText: "Fresh stock for homes and businesses",
    unitBadgeInstall: "Installation Available",
    unitBadgeInstallText: "Sales and service in one team",
    unitBadgeQuote: "Inquiry-Based Pricing",
    unitBadgeQuoteText: "Ask for the right unit for your space",
    unitFreeInstallTitle: "Free installation included",
    unitFreeInstallText: "All brand-new aircon units come with free standard installation.",
    priceRowBrand: "Brand",
    priceRowModel: "Model No.",
    priceRowCapacity: "Capacity",
    priceRowSrp: "SRP",
    priceRowCash: "Cash",
    unitCarouselEyebrow: "Available Brands",
    unitCarouselTitle: "Featured aircon units by brand",
    unitCarouselText: "View our recommended and best-value units below. Open the full price list table for the latest stock and pricing, or message us for details.",
    unitInquireNow: "Inquire Now",
    unitFullList: "View Full Price List",
    unitUnavailable: "Unavailable",
    unitModelLabel: "Model No.",
    unitCapacityLabel: "Capacity",
    unitPriceLabel: "Price",
    unitMostPopular: "Most Popular",
    unitBestPrice: "Best Price",
    unitPriceFallback: "",
    priceListEmpty: "Add full pricelist rows in the CMS to display the public table.",
    brandsEyebrow: "We Service All Major Brands",
    brandsTitle: "Reliable service for leading aircon brands",
    workEyebrow: "Our Work",
    workTitle: "Installation, cleaning and repair work",
    workText: "Browse real KOOLMATE service highlights featuring aircon installation, cleaning, repair and maintenance work.",
    workSlotInstall: "Installation Work",
    workSlotCleaning: "Aircon Cleaning",
    workSlotRepair: "Repair Service",
    workSlotMaintenance: "Maintenance Visit",
    workSlotCommercial: "Commercial Service",
    workUnavailable: "Unavailable for now",
    workViewPhoto: "View Photo",
    workOpenLink: "Open Link",
    areasEyebrow: "Service Areas",
    areasTitle: "Fast aircon service across Cavite & Rizal",
    areasText: "Serving residential and commercial air-conditioning needs across key nearby communities.",
    areaBacoor: "Bacoor, Cavite",
    areaSanMateo: "San Mateo, Rizal & Nearby Areas",
    areaNearby: "Nearby areas upon inquiry",
    areaSpaces: "Homes, condos, offices and small businesses",
    areaCta: "Open KOOLMATE on Google Maps",
    dispatchAvailable: "Dispatch Available",
    quoteEyebrow: "Call / Text / Message",
    quoteTitle: "Get a free quote",
    quoteText: "Tell us what air-conditioning service you need and we'll get back to you as soon as possible.",
    quoteBenefitTech: "Experienced and trusted technicians",
    quoteBenefitParts: "High-quality service and parts",
    quoteBenefitPricing: "Affordable and transparent pricing",
    quoteBenefitResponse: "Fast response and on-time service",
    quoteBenefitSatisfaction: "100% customer satisfaction",
    quoteContactLabel: "Call / Text / Message",
    quoteSocial: "KOOLMATE Air-Con Services",
    quoteRepairAll: "We repair and sell",
    quoteRepairSell: "All types / brands of aircon",
    fieldName: "Full Name",
    fieldPhone: "Phone Number",
    fieldEmail: "Email Address",
    fieldService: "Service Needed",
    selectService: "Select service",
    fieldDate: "Preferred Date",
    fieldMessage: "Message",
    sendMessage: "Send Message",
    footerSub: "Air-Conditioning Services and Maintenance",
    footerDesc: "Reliable air-conditioning services for homes and businesses in Cavite and Rizal.",
    footerTrust: "DTI & BIR Registered Business",
    footerServicesTitle: "Services",
    quickLinks: "Quick Links",
    contactTitle: "Contact",
    copyright: "© 2026 KOOLMATE Air-Conditioning Services and Maintenance. All Rights Reserved.",
    close: "Close",
    formError: "Please complete all required fields with valid information.",
    formSuccess: "Thank you, {name}. Your inquiry has been saved. For the fastest response, please continue through Messenger or visit our Facebook Page below.",
    redirectingMessenger: "Inquiry saved. Redirecting you to Messenger...",
    continueMessenger: "Continue on Messenger",
    openFacebookPage: "Open Facebook Page",
    sendSms: "Send SMS",
    callNow: "Call Now",
    services: [
      ["sales", "Aircon Sales", "Brand-new air conditioning units suitable for homes, offices, stores, and other establishments."],
      ["installation", "Aircon Installation", "Professional installation to help ensure proper operation, performance, and efficiency."],
      ["cleaning", "General Cleaning", "Regular cleaning to maintain performance and provide a cleaner indoor environment."],
      ["repair", "Aircon Repair", "Support for poor cooling, unusual sounds, water leaks, and other common issues."],
      ["maintenance", "Preventive Maintenance", "Regular service to identify potential problems early and keep systems running properly."],
      ["refrigerant", "Refrigerant Charging", "Refrigerant-related services after proper system checking and diagnosis."],
      ["diagnosis", "Troubleshooting & Diagnosis", "System inspection to identify possible causes and recommend appropriate solutions."]
    ],
    features: [
      ["technician", "Experienced Technicians"],
      ["quality", "Quality Workmanship"],
      ["price", "Affordable Price"],
      ["fast", "Fast & Reliable Service"],
      ["satisfaction", "100% Customer Satisfaction"]
    ],
    products: [
      ["Split Type", "Wall-mounted cooling for bedrooms, offices and living spaces.", productImages.split],
      ["Window Type", "Compact brand-new units for practical home cooling.", productImages.panasonic],
      ["Inverter Split Type", "Energy-saving aircon units for efficient daily use.", productImages.inverter],
      ["Non-Inverter", "Dependable cooling options with straightforward operation.", productImages.samsung],
      ["Floor Mounted", "Strong airflow for larger rooms and commercial spaces.", "assets/KOOLMATE-reference.png"],
      ["Cassette Type", "Ceiling-mounted comfort for clean commercial interiors.", "assets/KOOLMATE-reference.png"],
      ["Ceiling / Commercial Units", "Brand-new units for offices, shops and business spaces.", productImages.lg]
    ],
    serviceOptions: {
      install: "Aircon Installation",
      maintenance: "Preventive Maintenance",
      cleaning: "General Cleaning",
      charging: "Refrigerant Charging",
      repair: "Check Up / Repair",
      relocation: "Relocation / Dismantling",
      reprocess: "System Reprocess",
      purchase: "Aircon Unit Purchase",
      other: "Other"
    }
  },
  fil: {
    menu: "Menu",
    navHome: "Home",
    navAbout: "Tungkol Sa Amin",
    navServices: "Serbisyo",
    navUnits: "Aircon Units",
    navWork: "Our Work",
    navContact: "Makipag-ugnayan",
    quoteBtn: "Humingi ng Quote",
    heroTrust: "Pinagkakatiwalaan ng maraming tahanan at negosyo",
    heroTitle: "Mas Malamig.<br><span>Mas Malinis.</span><br>Mas Tipid.",
    heroTagline: "I-KOOLMATE Mo Yan!",
    heroLead: "Propesyonal na aircon service para sa mas malamig, malinis at matipid na tahanan o negosyo.",
    freeQuote: "Kumuha ng Libreng Quote",
    viewServices: "Tingnan ang Serbisyo",
    promiseFast: "Mabilis",
    promiseReliable: "Maaasahan",
    promiseAffordable: "Abot-Kaya",
    miniSales: "Aircon Sales",
    miniInstall: "Installation",
    miniMaintenance: "Maintenance",
    miniRepair: "Repair",
    miniCleaning: "Cleaning",
    servicesEyebrow: "Aming Serbisyo",
    servicesTitle: "Air-conditioning support mula pagbili hanggang long-term care.",
    servicesIntro: "Mula sa pagpili ng tamang unit hanggang regular maintenance at repair, pinapanatili naming malamig, efficient, at hassle-free ang inyong space.",
    registered: "DTI & BIR Registered",
    quickCtaTitle: "Hindi sure kung anong aircon o service ang kailangan?",
    quickCtaText: "Tutulungan namin kayong mahanap ang tamang cooling solution para sa inyong space at pangangailangan.",
    whyEyebrow: "Trusted Aircon Service",
    whyTitle: "Bakit KOOLMATE ang piliin?",
    sellEyebrow: "Nagbebenta Kami",
    sellTitle: "Iba't ibang brand new aircon units",
    sellText: "Nag-aalok kami ng trusted at high-quality air-conditioning brands para sa iba't ibang pangangailangan ng bahay at negosyo.",
    unitBadgeTypes: "Split / Window / Commercial",
    unitBadgeTypesText: "Iba't ibang unit types ang available",
    unitBadgeNew: "Brand-New Units",
    unitBadgeNewText: "Fresh stock para sa bahay at negosyo",
    unitBadgeInstall: "May Installation",
    unitBadgeInstallText: "Sales at service sa iisang team",
    unitBadgeQuote: "Presyo Batay sa Inquiry",
    unitBadgeQuoteText: "Magtanong para sa tamang unit sa inyong space",
    unitFreeInstallTitle: "Kasama ang free installation",
    unitFreeInstallText: "Lahat ng brand-new aircon units ay may kasamang free standard installation.",
    priceRowBrand: "Brand",
    priceRowModel: "Model No.",
    priceRowCapacity: "Capacity",
    priceRowSrp: "SRP",
    priceRowCash: "Cash",
    unitCarouselEyebrow: "Available Brands",
    unitCarouselTitle: "Featured aircon units by brand",
    unitCarouselText: "Tingnan ang recommended at best-value units sa ibaba. Buksan ang full price list table para sa latest stock at presyo, o mag-message para sa details.",
    unitInquireNow: "Inquire Now",
    unitFullList: "Tingnan ang Full Price List",
    unitUnavailable: "Unavailable",
    unitModelLabel: "Model No.",
    unitCapacityLabel: "Capacity",
    unitPriceLabel: "Price",
    unitMostPopular: "Most Popular",
    unitBestPrice: "Best Price",
    unitPriceFallback: "",
    priceListEmpty: "Magdagdag ng full pricelist rows sa CMS para lumabas ang public table.",
    brandsEyebrow: "Nagseserbisyo Kami ng Major Brands",
    brandsTitle: "Maaasahang serbisyo para sa kilalang aircon brands",
    workEyebrow: "Our Work",
    workTitle: "Installation, cleaning at repair work",
    workText: "Tingnan ang totoong KOOLMATE service highlights mula sa aircon installation, cleaning, repair at maintenance work.",
    workSlotInstall: "Installation Work",
    workSlotCleaning: "Aircon Cleaning",
    workSlotRepair: "Repair Service",
    workSlotMaintenance: "Maintenance Visit",
    workSlotCommercial: "Commercial Service",
    workUnavailable: "Unavailable for now",
    workViewPhoto: "Tingnan ang Larawan",
    workOpenLink: "Buksan ang Link",
    areasEyebrow: "Service Areas",
    areasTitle: "Mabilis na aircon service sa Cavite at Rizal",
    areasText: "Nagseserbisyo sa residential at commercial air-conditioning needs sa mga kalapit na komunidad.",
    areaBacoor: "Bacoor, Cavite",
    areaSanMateo: "San Mateo, Rizal & Nearby Areas",
    areaNearby: "Kalapit na lugar upon inquiry",
    areaSpaces: "Bahay, condo, opisina at small business",
    areaCta: "Buksan ang KOOLMATE sa Google Maps",
    dispatchAvailable: "Available ang Dispatch",
    quoteEyebrow: "Call / Text / Message",
    quoteTitle: "Kumuha ng libreng quote",
    quoteText: "Sabihin sa amin ang air-conditioning service na kailangan ninyo at babalikan namin kayo sa lalong madaling panahon.",
    quoteBenefitTech: "Experienced and trusted technicians",
    quoteBenefitParts: "High-quality service and parts",
    quoteBenefitPricing: "Affordable at transparent pricing",
    quoteBenefitResponse: "Mabilis na response at on-time service",
    quoteBenefitSatisfaction: "100% customer satisfaction",
    quoteContactLabel: "Call / Text / Message",
    quoteSocial: "KOOLMATE Air-Con Services",
    quoteRepairAll: "Nag-aayos at nagbebenta kami",
    quoteRepairSell: "Lahat ng types / brands ng aircon",
    fieldName: "Buong Pangalan",
    fieldPhone: "Phone Number",
    fieldEmail: "Email Address",
    fieldService: "Kailangang Serbisyo",
    selectService: "Pumili ng serbisyo",
    fieldDate: "Preferred Date",
    fieldMessage: "Mensahe",
    sendMessage: "Ipadala ang Mensahe",
    footerSub: "Air-Conditioning Services and Maintenance",
    footerDesc: "Maaasahang air-conditioning services para sa bahay at negosyo sa Cavite at Rizal.",
    footerTrust: "DTI & BIR Registered Business",
    footerServicesTitle: "Mga Serbisyo",
    quickLinks: "Quick Links",
    contactTitle: "Contact",
    copyright: "© 2026 KOOLMATE Air-Conditioning Services and Maintenance. All Rights Reserved.",
    close: "Isara",
    formError: "Pakikumpleto ang lahat ng required fields gamit ang tamang impormasyon.",
    formSuccess: "Salamat, {name}. Na-save na ang inyong inquiry. Para sa pinakamabilis na response, ituloy po sa Messenger o buksan ang Facebook Page sa ibaba.",
    redirectingMessenger: "Na-save na ang inquiry. Ililipat kayo sa Messenger...",
    continueMessenger: "Ituloy sa Messenger",
    openFacebookPage: "Buksan ang Facebook Page",
    sendSms: "Mag-send ng SMS",
    callNow: "Tumawag Ngayon",
    services: [
      ["sales", "Aircon Sales", "Brand-new air conditioning units para sa bahay, opisina, tindahan, at iba pang establishments."],
      ["installation", "Aircon Installation", "Professional installation para masigurong tama ang operation, performance, at efficiency."],
      ["cleaning", "General Cleaning", "Regular cleaning para mapanatili ang performance at mas malinis na indoor environment."],
      ["repair", "Aircon Repair", "Tulong para sa mahinang lamig, kakaibang tunog, tagas ng tubig, at iba pang common issues."],
      ["maintenance", "Preventive Maintenance", "Regular service para maagang makita ang potential problems at mapanatiling maayos ang takbo ng system."],
      ["refrigerant", "Refrigerant Charging", "Refrigerant-related services pagkatapos ng proper system checking at diagnosis."],
      ["diagnosis", "Troubleshooting & Diagnosis", "System inspection para matukoy ang possible causes at mairekomenda ang tamang solusyon."]
    ],
    features: [
      ["technician", "Experienced Technicians"],
      ["quality", "Quality Workmanship"],
      ["price", "Affordable Price"],
      ["fast", "Fast & Reliable Service"],
      ["satisfaction", "100% Customer Satisfaction"]
    ],
    products: [
      ["Split Type", "Wall-mounted cooling para sa bedrooms, offices at living spaces.", productImages.split],
      ["Window Type", "Compact brand-new units para sa praktikal na home cooling.", productImages.panasonic],
      ["Inverter Split Type", "Energy-saving aircon units para sa efficient daily use.", productImages.inverter],
      ["Non-Inverter", "Dependable cooling options na madaling gamitin.", productImages.samsung],
      ["Floor Mounted", "Malakas na airflow para sa mas malalaking rooms at commercial spaces.", "assets/KOOLMATE-reference.png"],
      ["Cassette Type", "Ceiling-mounted comfort para sa malinis na commercial interiors.", "assets/KOOLMATE-reference.png"],
      ["Ceiling / Commercial Units", "Brand-new units para sa offices, shops at business spaces.", productImages.lg]
    ],
    serviceOptions: {
      install: "Aircon Installation",
      maintenance: "Preventive Maintenance",
      cleaning: "General Cleaning",
      charging: "Refrigerant Charging",
      repair: "Check Up / Repair",
      relocation: "Relocation / Dismantling",
      reprocess: "System Reprocess",
      purchase: "Aircon Unit Purchase",
      other: "Other"
    }
  }
};

const brandLogos = [
  ["Daikin", "https://commons.wikimedia.org/wiki/Special:Redirect/file/DAIKIN_logo.svg"],
  ["Panasonic", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Panasonic_logo.svg"],
  ["Mitsubishi Electric", "https://cdn.simpleicons.org/mitsubishi/E60012"],
  ["LG", "https://cdn.simpleicons.org/lg/A50034"],
  ["Samsung", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Samsung_wordmark.svg"],
  ["TCL", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_of_the_TCL_Corporation.svg"],
  ["Carrier", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_of_the_Carrier_Corporation.svg"],
  ["Midea", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Midea.svg"],
  ["Haier", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Haier_logo.svg"],
  ["AUX", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Logo_AUX_Air_Conditioner_(China).svg"]
];

const brandLogoMap = new Map([
  ...brandLogos,
  ["Midea", "assets/brand-midea.svg"],
  ["Carrier", "assets/brand-carrier.svg"],
  ["American Home", "assets/brand-american-home.svg"],
  ["TCL", "assets/brand-tcl.svg"],
  ["Daikin", "assets/brand-daikin.svg"],
  ["LG", "assets/brand-lg.svg"],
  ["Haier", "assets/brand-haier.svg"],
  ["Samsung", "https://commons.wikimedia.org/wiki/Special:Redirect/file/Samsung_wordmark.svg"],
  ["Chiq", "assets/brand-chiq.svg"],
  ["Hisense", "assets/brand-hisense.svg"]
]);

const inlineBrandMarks = {
  "Midea": '<svg viewBox="0 0 220 72" aria-hidden="true"><path d="M34 49c-12-8-12-24 0-32 11-8 28-6 39 3-11-4-23-2-31 4-9 7-9 18 0 25 8 6 20 8 31 4-11 9-28 11-39 3z" fill="#12a8e0"/><text x="78" y="47" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#12a8e0">Midea</text></svg>',
  "Carrier": '<svg viewBox="0 0 220 72" aria-hidden="true"><ellipse cx="110" cy="36" rx="86" ry="26" fill="#061b7a"/><ellipse cx="110" cy="36" rx="78" ry="20" fill="none" stroke="#fff" stroke-width="3"/><text x="54" y="46" font-family="Georgia, serif" font-size="32" font-style="italic" fill="#fff">Carrier</text></svg>',
  "American Home": '<svg viewBox="0 0 220 72" aria-hidden="true"><text x="18" y="32" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#132f63">AMERICAN</text><text x="18" y="54" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="900" fill="#d51f2a">HOME</text><path d="M148 50V29l25-16 25 16v21h-14V35h-22v15z" fill="#132f63"/></svg>',
  "TCL": '<svg viewBox="0 0 220 72" aria-hidden="true"><rect x="50" y="17" width="120" height="38" rx="4" fill="#e2231a"/><text x="70" y="46" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" fill="#fff">TCL</text></svg>',
  "Daikin": '<svg viewBox="0 0 220 72" aria-hidden="true"><path d="M24 17h42L24 55z" fill="#00a8df"/><path d="M33 17h54L45 55H24z" fill="#008bd2" opacity=".55"/><text x="73" y="46" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900" font-style="italic" fill="#00a8df">DAIKIN</text></svg>',
  "LG": '<svg viewBox="0 0 220 72" aria-hidden="true"><circle cx="75" cy="36" r="23" fill="#a50034"/><circle cx="67" cy="29" r="3.5" fill="#fff"/><path d="M75 21v30h17" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><text x="111" y="47" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#555">LG</text></svg>',
  "Haier": '<svg viewBox="0 0 220 72" aria-hidden="true"><text x="42" y="48" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" fill="#005baa">Haier</text></svg>',
  "Chiq": '<svg viewBox="0 0 220 72" aria-hidden="true"><text x="52" y="47" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="900" fill="#ec1c24">CHiQ</text></svg>',
  "Hisense": '<svg viewBox="0 0 220 72" aria-hidden="true"><text x="31" y="47" font-family="Arial, Helvetica, sans-serif" font-size="35" font-weight="900" fill="#00a0df">Hisense</text></svg>',
  "Panasonic": '<svg viewBox="0 0 220 72" aria-hidden="true"><text x="30" y="47" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="900" fill="#004b9b">Panasonic</text></svg>',
  "Mitsubishi Electric": '<svg viewBox="0 0 220 72" aria-hidden="true"><path d="M65 14l17 30H48zM48 44l17 30H31zM82 44l17 30H65z" transform="translate(0 -8)" fill="#e60012"/><text x="105" y="34" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#111">MITSUBISHI</text><text x="105" y="52" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="900" fill="#111">ELECTRIC</text></svg>',
  "Samsung": '<svg viewBox="0 0 340 72" aria-hidden="true" preserveAspectRatio="xMinYMid meet"><text x="24" y="48" font-family="Arial, Helvetica, sans-serif" font-size="31" font-weight="900" letter-spacing="2" textLength="245" lengthAdjust="spacingAndGlyphs" fill="#1428a0">SAMSUNG</text></svg>',
  "AUX": '<svg viewBox="0 0 220 72" aria-hidden="true"><text x="55" y="46" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="900" fill="#073f8f">AUX</text><text x="73" y="58" font-family="Arial, Helvetica, sans-serif" font-size="9" font-weight="800" fill="#073f8f">AIR CONDITIONER</text></svg>'
};

let currentLanguage = "en";

function normalizeAssetUrl(value) {
  let url = String(value || "").trim();
  if (!url) return "";
  url = url.replace(/^url\((.*)\)$/i, "$1").trim().replace(/^["']|["']$/g, "");
  url = url.replace(/&amp;/g, "&");
  url = url.replace(/^\/uploads\//i, "uploads/");
  url = url.replace(/^\/assets\//i, "assets/");

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/i) || url.match(/[?&]id=([^&]+)/i);
  if (driveMatch && url.includes("drive.google.com")) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }

  return url;
}

function migrateDefaultWorkText(lang, value) {
  const text = String(value || "");
  if (lang === "en" && text.includes("posted soon")) {
    return "Browse real KOOLMATE service highlights featuring aircon installation, cleaning, repair and maintenance work.";
  }
  if (lang === "fil" && text.includes("Malapit nang maipakita")) {
    return "Tingnan ang totoong KOOLMATE service highlights mula sa aircon installation, cleaning, repair at maintenance work.";
  }
  return value;
}

async function loadCmsContent() {
  const cmsApi = location.hostname === "localhost" ? "/api/content" : "/.netlify/functions/content";
  for (const url of [cmsApi, "data/content.json"]) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) return await response.json();
    } catch {
      // Continue to the next source.
    }
  }
  try {
    return JSON.parse(localStorage.getItem(CMS_STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

async function applyCmsContent() {
  const saved = await loadCmsContent();
  if (!saved || typeof saved !== "object") return;

  if (saved.business) {
    Object.assign(business, {
      phone: saved.business.phone || business.phone,
      phoneSms: saved.business.phoneSms || business.phoneSms,
      email: saved.business.email || business.email,
      address: saved.business.address || business.address,
      messenger: saved.business.messenger || business.messenger,
      facebook: saved.business.facebook || business.facebook,
      maps: saved.business.maps || business.maps
    });
  }

  ["en", "fil"].forEach((lang) => {
    const languageContent = saved[lang];
    if (!languageContent) return;
    Object.entries(languageContent).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) translations[lang][key] = key === "workText" ? migrateDefaultWorkText(lang, value) : value;
    });
  });

  if (Array.isArray(saved.workItems)) {
    workItems = workItems.map((item, index) => ({
      ...item,
      ...(saved.workItems[index] || {})
    })).map((item) => ({
      ...item,
      image: normalizeAssetUrl(item.image),
      url: normalizeAssetUrl(item.url)
    }));
  }

  if (Array.isArray(saved.promos)) {
    promos = saved.promos.map((item, index) => ({
      ...(promos[index] || {}),
      ...item
    })).map((promo) => ({
      ...promo,
      image: normalizeAssetUrl(promo.image),
      url: normalizeAssetUrl(promo.url)
    }));
  }

  if (saved.priceList && typeof saved.priceList === "object") {
    priceList = {
      ...priceList,
      ...saved.priceList,
      label: { ...priceList.label, ...(saved.priceList.label || {}) },
      note: { ...priceList.note, ...(saved.priceList.note || {}) },
      rows: normalizePriceListRows(saved.priceList.rows)
    };
  }

  if (Array.isArray(saved.airconUnits)) {
    airconUnits = AIRCON_BRANDS.flatMap((brand) => {
      const brandUnits = saved.airconUnits.filter((unit) => ((unit.brand || "") === brand) || (brand === "Samsung" && (unit.brand || "") === "Koppel")).slice(0, 2);
      const legacyUnit = saved.airconUnits[AIRCON_BRANDS.indexOf(brand)] || {};
      const slots = brandUnits.length ? brandUnits : [legacyUnit];
      return [0, 1].map((slotIndex) => ({
        enabled: true,
        slot: slotIndex + 1,
        tag: slotIndex === 0 ? "mostPopular" : "bestPrice",
        model: "",
        capacity: "",
        name: { en: "", fil: "" },
        type: { en: "", fil: "" },
        price: "",
        image: "",
        url: "#quote",
        ...(slots[slotIndex] || {}),
        brand
      }));
    });
  }
  airconUnits = airconUnits.map((unit, index) => ({
    ...unit,
    brand: unit.brand === "Koppel" ? "Samsung" : (unit.brand || AIRCON_BRANDS[Math.floor(index / 2)] || "Hisense"),
    slot: unit.slot || (index % 2) + 1,
    tag: unit.tag || (index % 2 === 0 ? "mostPopular" : "bestPrice"),
    image: normalizeAssetUrl(unit.image),
    url: normalizeAssetUrl(unit.url)
  }));
  priceList.url = getGoogleSheetEmbedUrl(priceList.url) ? priceList.url : DEFAULT_PRICE_LIST_URL;
  priceList.rows = normalizePriceListRows(priceList.rows);
}

function phoneHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function updateBusinessContent() {
  document.querySelectorAll("[data-business-phone]").forEach((node) => {
    node.textContent = business.phone;
  });
  document.querySelectorAll("[data-business-phone-compact]").forEach((node) => {
    node.textContent = business.phoneSms.replace(/^\+63/, "0").replace(/(\d{4})(\d{3})(\d{4})/, "$1-$2-$3");
  });
  document.querySelectorAll("[data-business-email]").forEach((node) => {
    node.textContent = business.email;
  });
  document.querySelectorAll("[data-business-address]").forEach((node) => {
    node.textContent = business.address;
  });
  document.querySelectorAll("[data-business-phone-link]").forEach((node) => {
    node.href = phoneHref(business.phoneSms || business.phone);
  });
  document.querySelectorAll("[data-business-sms-link]").forEach((node) => {
    node.href = `sms:${business.phoneSms}`;
  });
  document.querySelectorAll("[data-business-email-link]").forEach((node) => {
    node.href = `mailto:${business.email}`;
  });
  document.querySelectorAll("[data-business-messenger-link]").forEach((node) => {
    node.href = business.messenger;
  });
  document.querySelectorAll("[data-business-facebook-link]").forEach((node) => {
    node.href = business.facebook;
  });
  document.querySelectorAll("[data-business-maps-link]").forEach((node) => {
    node.href = business.maps;
  });
}

function t() {
  return translations[currentLanguage];
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getGoogleSheetEmbedUrl(url) {
  const value = String(url || "").trim();
  const match = value.match(/docs\.google\.com\/spreadsheets\/d\/([^/]+)/i);
  if (!match) return "";
  const gidMatch = value.match(/[?&#]gid=(\d+)/i);
  const gid = gidMatch ? gidMatch[1] : "0";
  return `https://docs.google.com/spreadsheets/d/${match[1]}/preview?gid=${gid}&single=true&widget=true&headers=false`;
}

function renderBrandMark(brand, compact = false) {
  const safeBrand = brand || "Aircon Brand";
  return `
    <span class="brand-mark ${compact ? "compact" : ""}" aria-label="${safeBrand} logo">
      ${inlineBrandMarks[safeBrand] || ""}
      <b>${safeBrand}</b>
    </span>
  `;
}

function renderSafeImage(src, alt, attrs = "") {
  const url = normalizeAssetUrl(src);
  if (!url) return "";
  const retryUrl = url.replace(/^\//, "");
  return `<img data-safe-src="${escapeAttribute(url)}" alt="${escapeAttribute(alt)}" ${attrs} data-retry-src="${escapeAttribute(retryUrl)}">`;
}

function hydrateSafeImages(root = document) {
  root.querySelectorAll("[data-safe-src]").forEach((image) => {
    const primary = image.dataset.safeSrc || "";
    const retry = image.dataset.retrySrc || "";
    image.onerror = () => {
      if (!image.dataset.retried && retry && retry !== primary) {
        image.dataset.retried = "true";
        image.src = retry;
        return;
      }
      image.closest(".unit-image-slot,.work-placeholder,.promo-card")?.classList.add("image-error");
      image.remove();
    };
    image.onload = () => image.classList.add("is-loaded");
    image.src = primary;
  });
}

function applyTranslations() {
  const copy = t();
  document.documentElement.lang = currentLanguage === "fil" ? "fil" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (copy[key]) node.textContent = copy[key];
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const key = node.dataset.i18nHtml;
    if (copy[key]) node.innerHTML = copy[key];
  });
  document.querySelectorAll("[data-service-option]").forEach((option) => {
    option.textContent = copy.serviceOptions[option.dataset.serviceOption];
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    const active = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function renderCards() {
  const copy = t();
  const renderBrandLogo = ([brand, logo], compact = false) => `
    <div class="brand-card ${compact ? "compact" : ""} reveal visible" aria-label="${brand} aircon brand">
      ${renderBrandMark(brand, compact)}
    </div>
  `;
  const renderWorkItem = (item, index) => {
    const title = item.title?.[currentLanguage] || copy[item.titleKey] || item.titleKey;
    const number = String(index + 1).padStart(2, "0");
    const hasPhoto = item.type === "photo" && item.image;
    const hasLink = item.type === "link" && item.url;
    const media = hasPhoto
      ? renderSafeImage(item.image, title, 'loading="lazy"')
      : `<span>${number}</span>`;
    const status = item.status?.[currentLanguage] || (hasPhoto ? copy.workViewPhoto : hasLink ? copy.workOpenLink : copy.workUnavailable);
    const content = `
      <div class="work-placeholder ${hasPhoto ? "has-photo" : ""}" aria-hidden="${hasPhoto ? "false" : "true"}">${media}</div>
      <strong>${title}</strong>
      <p>${status}</p>
    `;
    if (hasPhoto || hasLink) {
      const href = hasPhoto ? item.image : item.url;
      return `<a class="work-slot is-available reveal visible" href="${href}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }
    return `<article class="work-slot reveal visible">${content}</article>`;
  };

  const servicesGrid = document.querySelector('[data-render="services"]');
  const renderHomeService = (service, index) => {
    const title = service[1];
    const text = service[2];
    const number = String(index + 1).padStart(2, "0");
    return `
      <article class="service-card home-service-card reveal visible">
        <span class="service-number">${number}</span>
        <h3>${title}</h3>
        <span class="service-title-accent" aria-hidden="true"></span>
        <p class="service-description">${text}</p>
      </article>
    `;
  };

  if (servicesGrid) {
    servicesGrid.innerHTML = `
      <div class="home-services-row home-services-primary">
        ${copy.services.slice(0, 4).map(renderHomeService).join("")}
      </div>
      <div class="home-services-row home-services-secondary">
        ${copy.services.slice(4).map((service, index) => renderHomeService(service, index + 4)).join("")}
      </div>
    `;
  }

  const featuresGrid = document.querySelector('[data-render="features"]');
  if (featuresGrid) {
    featuresGrid.innerHTML = copy.features.map(([icon, title]) => `
      <article class="feature-card reveal visible">
        <div class="card-icon">${icons[icon] ?? icon}</div>
        <h3>${title}</h3>
      </article>
    `).join("");
  }

  const brandStrip = document.querySelector('[data-render="brands"]');
  if (brandStrip) brandStrip.innerHTML = brandLogos.map((brand) => renderBrandLogo(brand, true)).join("");

  document.querySelector('[data-render="service-brands"]').innerHTML = brandLogos.map((brand) => renderBrandLogo(brand)).join("");

  const workGrid = document.querySelector('[data-render="work"]');
  if (workGrid) {
    workGrid.innerHTML = workItems.map(renderWorkItem).join("");
    hydrateSafeImages(workGrid);
  }
  renderUnitCarousel();
  renderPromos();
}

function renderUnitCarousel() {
  const carousel = document.querySelector('[data-render="unit-carousel"]');
  if (!carousel) return;
  const copy = t();
  const visiblePriceRows = normalizePriceListRows(priceList.rows).filter((row) => [row.brand, row.model, row.capacity, row.srp, row.cash].some((value) => String(value || "").trim()));
  carousel.innerHTML = AIRCON_BRANDS.map((brand, index) => {
    const units = airconUnits.filter((unit) => unit.enabled !== false && (unit.brand || AIRCON_BRANDS[index]) === brand);
    const availableUnits = units.filter((unit) => unit.model || unit.price || unit.image || unit.name?.[currentLanguage] || unit.name?.en);
    const isOpen = index === 0 ? " open" : "";
    return `
      <details class="brand-unit-panel reveal visible"${isOpen}>
        <summary>
          ${renderBrandMark(brand, true)}
          <small>${availableUnits.length ? `${availableUnits.length} unit${availableUnits.length > 1 ? "s" : ""}` : copy.unitUnavailable}</small>
        </summary>
        <div class="brand-unit-body">
          ${availableUnits.length ? availableUnits.map((unit) => {
            const model = unit.model || unit.name?.[currentLanguage] || unit.name?.en || "";
            const capacity = unit.capacity || "";
            const price = unit.price || "";
            const url = unit.url || "#quote";
            const image = unit.image || "";
            const tag = unit.tag === "bestPrice" ? copy.unitBestPrice : copy.unitMostPopular;
            return `
              <article class="brand-unit-row">
                <div class="unit-image-slot ${image ? "" : "is-empty"}">
                  ${image ? renderSafeImage(image, `${brand} ${model || "aircon unit"}`, 'loading="lazy"') : `<span>${copy.unitUnavailable}</span>`}
                </div>
                <div>
                  <span class="unit-tag">${tag}</span>
                  <span>${copy.unitModelLabel}</span>
                  <strong>${model || copy.unitUnavailable}</strong>
                </div>
                <div>
                  <span>${copy.unitCapacityLabel}</span>
                  <strong>${capacity || copy.unitUnavailable}</strong>
                </div>
                <div>
                  <span>${copy.unitPriceLabel}</span>
                  <strong>${price || copy.unitUnavailable}</strong>
                </div>
                <a href="${url}" class="unit-inquire">${copy.unitInquireNow}</a>
              </article>
            `;
          }).join("") : `
            <article class="brand-unit-row is-empty">
              <div class="unit-image-slot is-empty"><span>${copy.unitUnavailable}</span></div>
              <div>
                <span>${copy.unitModelLabel}</span>
                <strong>${copy.unitUnavailable}</strong>
              </div>
              <div>
                <span>${copy.unitCapacityLabel}</span>
                <strong>${copy.unitUnavailable}</strong>
              </div>
              <div>
                <span>${copy.unitPriceLabel}</span>
                <strong>${copy.unitUnavailable}</strong>
              </div>
              <span class="unit-unavailable">${copy.unitUnavailable}</span>
            </article>
          `}
        </div>
      </details>
    `;
  }).join("") + `
    <div class="unit-full-list-card">
      <div>
        <span>${copy.unitCarouselText}</span>
      </div>
      <button class="unit-full-list-btn" type="button" data-price-list-open>
        ${priceList.label?.[currentLanguage] || copy.unitFullList}
      </button>
      <p>${priceList.note?.[currentLanguage] || ""}</p>
    </div>
  `;
  carousel.dataset.priceRows = JSON.stringify(visiblePriceRows);
  hydrateSafeImages(carousel);
  setupPriceListModal();
}

function getActivePromos() {
  return promos.filter((promo) => promo.enabled && promo.image);
}

function renderPromos() {
  const wrapper = document.querySelector("[data-promos]");
  if (!wrapper) return;
  const activePromos = getActivePromos();
  wrapper.hidden = activePromos.length === 0;
  if (!activePromos.length) return;

  if (activePromoIndex >= activePromos.length) activePromoIndex = 0;
  const promo = activePromos[activePromoIndex];
  const title = promo.title?.[currentLanguage] || promo.title?.en || "KOOLMATE Promo";

  wrapper.querySelector("[data-promo-count]").textContent = activePromos.length;
  wrapper.querySelector("[data-promo-link]").href = promo.url || "#quote";
  wrapper.querySelector("[data-promo-title]").textContent = title;
  wrapper.querySelector("[data-promo-image]").src = promo.image;
  wrapper.querySelector("[data-promo-image]").alt = title;
  wrapper.querySelector("[data-promo-position]").textContent = `${activePromoIndex + 1} / ${activePromos.length}`;
}

function setupPriceListModal() {
  const modal = document.querySelector("[data-price-list-modal]");
  const open = document.querySelector("[data-price-list-open]");
  const close = document.querySelector("[data-price-list-close]");
  const viewer = document.querySelector("[data-price-list-viewer]");
  const note = document.querySelector("[data-price-list-note]");
  const inquire = document.querySelector("[data-price-list-inquire]");
  if (!modal || !open || !close || !viewer) return;

  const modalTitle = priceList.label?.[currentLanguage] || t().unitFullList;
  const noteText = priceList.note?.[currentLanguage] || "";
  const sheetEmbedUrl = getGoogleSheetEmbedUrl(priceList.url);
  const visibleRows = normalizePriceListRows(priceList.rows).filter((row) => [row.brand, row.model, row.capacity, row.srp, row.cash].some((value) => String(value || "").trim()));

  note.textContent = noteText;
  inquire.textContent = t().unitInquireNow;
  inquire.href = `${business.messenger}?text=${encodeURIComponent("Hi KOOLMATE, I would like to inquire about the aircon price list.")}`;
  inquire.target = "_blank";
  inquire.rel = "noopener noreferrer";
  document.getElementById("priceListTitle").textContent = modalTitle;
  if (sheetEmbedUrl) {
    viewer.innerHTML = `<iframe class="price-list-sheet-frame" src="${escapeAttribute(sheetEmbedUrl)}" title="${escapeAttribute(modalTitle)}"></iframe>`;
  } else if (priceList.url) {
    viewer.innerHTML = priceList.url.toLowerCase().endsWith(".pdf")
      ? `<iframe src="${escapeAttribute(priceList.url)}" title="${escapeAttribute(modalTitle)}"></iframe>`
      : `<img src="${escapeAttribute(priceList.url)}" alt="${escapeAttribute(modalTitle)}" loading="lazy">`;
  } else if (visibleRows.length) {
    viewer.innerHTML = `
      <div class="price-list-table-wrap">
        <table class="price-list-table">
          <thead>
            <tr>
              <th>${t().priceRowBrand || "Brand"}</th>
              <th>${t().priceRowModel || "Model No."}</th>
              <th>${t().priceRowCapacity || "Capacity"}</th>
              <th>${t().priceRowSrp || "SRP"}</th>
              <th>${t().priceRowCash || "Cash"}</th>
            </tr>
          </thead>
          <tbody>
            ${visibleRows.map((row) => `
              <tr>
                <td data-label="${t().priceRowBrand || "Brand"}">${escapeHtml(row.brand || "—")}</td>
                <td data-label="${t().priceRowModel || "Model No."}">${escapeHtml(row.model || "—")}</td>
                <td data-label="${t().priceRowCapacity || "Capacity"}">${escapeHtml(row.capacity || "—")}</td>
                <td data-label="${t().priceRowSrp || "SRP"}">${escapeHtml(row.srp || "—")}</td>
                <td data-label="${t().priceRowCash || "Cash"}">${escapeHtml(row.cash || "—")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } else {
    viewer.innerHTML = `<div class="price-list-empty">${t().priceListEmpty}</div>`;
  }

  const setOpen = (show) => {
    modal.hidden = !show;
    document.body.classList.toggle("modal-open", show);
    if (show) close.focus();
  };

  open.onclick = () => setOpen(true);
  close.onclick = () => setOpen(false);
  modal.onclick = (event) => {
    if (event.target === modal) setOpen(false);
  };
  document.onkeydown = (event) => {
    if (event.key === "Escape" && !modal.hidden) setOpen(false);
  };
}

function setupPromos() {
  const wrapper = document.querySelector("[data-promos]");
  if (!wrapper) return;
  const toggle = wrapper.querySelector("[data-promo-toggle]");
  const close = wrapper.querySelector("[data-promo-close]");
  const prev = wrapper.querySelector("[data-promo-prev]");
  const next = wrapper.querySelector("[data-promo-next]");
  const setOpen = (open) => {
    wrapper.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => setOpen(!wrapper.classList.contains("is-open")));
  close.addEventListener("click", () => setOpen(false));
  prev.addEventListener("click", () => {
    const activePromos = getActivePromos();
    activePromoIndex = (activePromoIndex - 1 + activePromos.length) % activePromos.length;
    renderPromos();
  });
  next.addEventListener("click", () => {
    const activePromos = getActivePromos();
    activePromoIndex = (activePromoIndex + 1) % activePromos.length;
    renderPromos();
  });

  setTimeout(() => {
    if (getActivePromos().length) setOpen(true);
  }, 1600);
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  links.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function setupLanguageSwitcher() {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      currentLanguage = button.dataset.lang;
      localStorage.setItem("koolMateLanguage", currentLanguage);
      applyTranslations();
      renderCards();
    });
  });
}

function setupUnitCarousel() {
  const carousel = document.querySelector('[data-render="unit-carousel"]');
  if (!carousel) return;
  const scrollAmount = () => Math.max(280, Math.round(carousel.clientWidth * 0.78));
  document.querySelector("[data-unit-prev]")?.addEventListener("click", () => {
    carousel.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
  });
  document.querySelector("[data-unit-next]")?.addEventListener("click", () => {
    carousel.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  });
}

function buildInquiryMessage(data) {
  const dateLine = data.date ? `Preferred Date: ${data.date}` : "Preferred Date: Not specified";
  return [
    "Hi KOOLMATE, I would like to request a quote.",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Service Needed: ${data.service}`,
    dateLine,
    `Message: ${data.message}`,
    "",
    "Thank you."
  ].join("\n");
}

async function submitInquiry(data) {
  const apiUrl = location.hostname === "localhost" ? "/api/inquiries" : "/.netlify/functions/inquiries";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Inquiry save failed.");
}

function setupForm() {
  const form = document.getElementById("quoteForm");
  const status = form.querySelector(".form-status");
  const handoff = form.querySelector(".handoff-actions");
  const messenger = form.querySelector('[data-handoff="messenger"]');
  const page = form.querySelector('[data-handoff="page"]');
  const sms = form.querySelector('[data-handoff="sms"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = t().formError;
      handoff.hidden = true;
      form.reportValidity();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const message = buildInquiryMessage(data);
    const encodedMessage = encodeURIComponent(message);
    status.textContent = "Sending inquiry...";
    let savedToCms = false;
    try {
      await submitInquiry(data);
      savedToCms = true;
      status.textContent = t().redirectingMessenger;
      form.reset();
    } catch {
      status.textContent = "Your message is ready. Please continue through Messenger, SMS, or call KOOLMATE.";
    }
    messenger.href = `${business.messenger}?text=${encodedMessage}`;
    page.href = business.facebook;
    sms.href = `sms:${business.phoneSms}?body=${encodedMessage}`;
    handoff.hidden = false;
    if (savedToCms) {
      window.setTimeout(() => {
        window.location.href = messenger.href;
      }, 850);
    }
  });
}

function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
}

async function bootSite() {
  resetHorizontalScroll();
  const savedLanguage = localStorage.getItem("koolMateLanguage");
  if (savedLanguage && translations[savedLanguage]) currentLanguage = savedLanguage;
  await applyCmsContent();
  applyTranslations();
  updateBusinessContent();
  renderCards();
  setupMenu();
  setupLanguageSwitcher();
  setupUnitCarousel();
  setupForm();
  setupPromos();
  setupReveal();
  window.addEventListener("resize", resetHorizontalScroll);
  window.addEventListener("orientationchange", () => setTimeout(resetHorizontalScroll, 120));
  setTimeout(resetHorizontalScroll, 250);
}

bootSite();
