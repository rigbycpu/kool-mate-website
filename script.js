const business = {
  phone: "+63 993 551 5531",
  phoneSms: "+639935515531",
  email: "koolmateadmin070826@gmail.com",
  address: "244 Mikas Street, Real 1, Bacoor, Cavite, Philippines, 4102",
  messenger: "https://m.me/61591997337938"
};

const productImages = {
  split: "https://vsprod.vijaysales.com/media/catalog/product/2/5/254535.jpg?fit=bounds&optimize=medium&width=500",
  inverter: "https://static.wixstatic.com/media/3736cd_55e92f1620fc43d2b3be8dd8c863fb9f~mv2.png/v1/fit/w_500%2Ch_500%2Cq_90/file.png",
  lg: "https://jum3a.com/cdn/shop/files/AMPN13T4W_a.jpg?v=1758102186",
  samsung: "https://jetstereo-retail.s3.us-east-2.amazonaws.com/images/cache/catalog/public/products/product_COMBO_AR12TRHQDWKNXL_6871060eb2edc-500x500.webp",
  panasonic: "https://www.bdshop.com/pub/media/catalog/product/cache/0a9842a5e3033a11158d10717601d786/P/a/panasonic-nanoe-g-split-air-conditioner-cs-c18pkh.jpg"
};

const CMS_STORAGE_KEY = "koolMateCmsContent";

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

let activePromoIndex = 0;

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
    heroTagline: "Choose Kool Mate!",
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
    servicesTitle: "Complete air-conditioning services for homes and businesses",
    registered: "DTI & BIR Registered",
    whyEyebrow: "Trusted Aircon Service",
    whyTitle: "Why choose Kool Mate?",
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
    brandsEyebrow: "We Service All Major Brands",
    brandsTitle: "Reliable service for leading aircon brands",
    workEyebrow: "Our Work",
    workTitle: "Project gallery coming soon",
    workText: "Real installation, cleaning and repair project photos will be posted soon.",
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
    areaSanMateo: "San Mateo, Rizal",
    areaNearby: "Nearby areas upon inquiry",
    areaSpaces: "Homes, condos, offices and small businesses",
    areaCta: "Ask About Your Area",
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
    quoteSocial: "Kool Mate Air-Con Services",
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
    copyright: "© 2026 Kool Mate Air-Conditioning Services and Maintenance. All Rights Reserved.",
    close: "Close",
    formError: "Please complete all required fields with valid information.",
    formSuccess: "Thank you, {name}. Your inquiry has been received. You may also continue on Messenger, SMS, or call Kool Mate for the fastest response.",
    continueMessenger: "Continue on Messenger",
    sendSms: "Send SMS",
    callNow: "Call Now",
    services: [
      ["install", "Aircon Installation", "Professional installation for reliable and efficient cooling."],
      ["maintenance", "Preventive Maintenance", "Regular maintenance to keep your aircon efficient and extend its lifespan."],
      ["cleaning", "General Cleaning", "Thorough cleaning to remove dirt, dust and buildup."],
      ["charging", "Refrigerant Charging", "Proper refrigerant charging for better cooling performance."],
      ["repair", "Check Up / Repair", "Inspection and repair for air-conditioning problems."],
      ["relocation", "Relocation / Dismantling", "Safe dismantling and relocation of air-conditioning units."],
      ["reprocess", "System Reprocess", "System reprocessing and service to restore proper air-conditioning performance."]
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
      ["Floor Mounted", "Strong airflow for larger rooms and commercial spaces.", "assets/kool-mate-reference.png"],
      ["Cassette Type", "Ceiling-mounted comfort for clean commercial interiors.", "assets/kool-mate-reference.png"],
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
    heroTagline: "I-Kool Mate Mo Yan!",
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
    servicesTitle: "Kumpletong air-conditioning services para sa bahay at negosyo",
    registered: "DTI & BIR Registered",
    whyEyebrow: "Trusted Aircon Service",
    whyTitle: "Bakit Kool Mate ang piliin?",
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
    brandsEyebrow: "Nagseserbisyo Kami ng Major Brands",
    brandsTitle: "Maaasahang serbisyo para sa kilalang aircon brands",
    workEyebrow: "Our Work",
    workTitle: "Malapit nang magkaroon ng project gallery",
    workText: "Malapit nang maipakita ang totoong installation, cleaning at repair project photos.",
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
    areaSanMateo: "San Mateo, Rizal",
    areaNearby: "Kalapit na lugar upon inquiry",
    areaSpaces: "Bahay, condo, opisina at small business",
    areaCta: "Magtanong Tungkol sa Area",
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
    quoteSocial: "Kool Mate Air-Con Services",
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
    copyright: "© 2026 Kool Mate Air-Conditioning Services and Maintenance. All Rights Reserved.",
    close: "Isara",
    formError: "Pakikumpleto ang lahat ng required fields gamit ang tamang impormasyon.",
    formSuccess: "Salamat, {name}. Natanggap na ang inyong inquiry. Maaari rin kayong mag-Messenger, SMS, o tumawag para mas mabilis ang response ng Kool Mate.",
    continueMessenger: "Ituloy sa Messenger",
    sendSms: "Mag-send ng SMS",
    callNow: "Tumawag Ngayon",
    services: [
      ["install", "Aircon Installation", "Propesyonal na installation para sa maaasahan at efficient na pagpapalamig."],
      ["maintenance", "Preventive Maintenance", "Regular na maintenance para mapanatiling efficient ang aircon at humaba ang lifespan nito."],
      ["cleaning", "General Cleaning", "Masusing paglilinis para matanggal ang dumi, alikabok at buildup."],
      ["charging", "Refrigerant Charging", "Tamang refrigerant charging para sa mas maayos na cooling performance."],
      ["repair", "Check Up / Repair", "Inspection at repair para sa air-conditioning problems."],
      ["relocation", "Relocation / Dismantling", "Maingat na dismantling at relocation ng air-conditioning units."],
      ["reprocess", "System Reprocess", "System reprocessing at service para maibalik ang maayos na air-conditioning performance."]
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
      ["Floor Mounted", "Malakas na airflow para sa mas malalaking rooms at commercial spaces.", "assets/kool-mate-reference.png"],
      ["Cassette Type", "Ceiling-mounted comfort para sa malinis na commercial interiors.", "assets/kool-mate-reference.png"],
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

let currentLanguage = "en";

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
      messenger: saved.business.messenger || business.messenger
    });
  }

  ["en", "fil"].forEach((lang) => {
    const languageContent = saved[lang];
    if (!languageContent) return;
    Object.entries(languageContent).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) translations[lang][key] = value;
    });
  });

  if (Array.isArray(saved.workItems)) {
    workItems = workItems.map((item, index) => ({
      ...item,
      ...(saved.workItems[index] || {})
    }));
  }

  if (Array.isArray(saved.promos)) {
    promos = saved.promos.map((item, index) => ({
      ...(promos[index] || {}),
      ...item
    }));
  }
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
}

function t() {
  return translations[currentLanguage];
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
      <img src="${logo}" alt="${brand} logo" loading="lazy" onerror="this.parentElement.classList.add('logo-fallback'); this.remove();">
      <span>${brand}</span>
    </div>
  `;
  const renderWorkItem = (item, index) => {
    const title = item.title?.[currentLanguage] || copy[item.titleKey] || item.titleKey;
    const number = String(index + 1).padStart(2, "0");
    const hasPhoto = item.type === "photo" && item.image;
    const hasLink = item.type === "link" && item.url;
    const media = hasPhoto
      ? `<img src="${item.image}" alt="${title}" loading="lazy">`
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

  document.querySelector('[data-render="services"]').innerHTML = copy.services.map(([icon, title, text]) => `
    <article class="service-card reveal visible">
      <div class="card-icon">${icons[icon] ?? icon}</div>
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");

  document.querySelector('[data-render="features"]').innerHTML = copy.features.map(([icon, title]) => `
    <article class="feature-card reveal visible">
      <div class="card-icon">${icons[icon] ?? icon}</div>
      <h3>${title}</h3>
    </article>
  `).join("");

  const brandStrip = document.querySelector('[data-render="brands"]');
  if (brandStrip) brandStrip.innerHTML = brandLogos.map((brand) => renderBrandLogo(brand, true)).join("");

  document.querySelector('[data-render="service-brands"]').innerHTML = brandLogos.map((brand) => renderBrandLogo(brand)).join("");

  const workGrid = document.querySelector('[data-render="work"]');
  if (workGrid) workGrid.innerHTML = workItems.map(renderWorkItem).join("");
  renderPromos();
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
  const title = promo.title?.[currentLanguage] || promo.title?.en || "Kool Mate Promo";

  wrapper.querySelector("[data-promo-count]").textContent = activePromos.length;
  wrapper.querySelector("[data-promo-link]").href = promo.url || "#quote";
  wrapper.querySelector("[data-promo-title]").textContent = title;
  wrapper.querySelector("[data-promo-image]").src = promo.image;
  wrapper.querySelector("[data-promo-image]").alt = title;
  wrapper.querySelector("[data-promo-position]").textContent = `${activePromoIndex + 1} / ${activePromos.length}`;
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

function buildInquiryMessage(data) {
  const dateLine = data.date ? `Preferred Date: ${data.date}` : "Preferred Date: Not specified";
  return [
    "Hi Kool Mate, I would like to request a quote.",
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
    try {
      await submitInquiry(data);
      status.textContent = t().formSuccess.replace("{name}", data.name);
      form.reset();
    } catch {
      status.textContent = "Your message is ready. Please continue through Messenger, SMS, or call Kool Mate.";
    }
    messenger.href = `${business.messenger}?text=${encodedMessage}`;
    sms.href = `sms:${business.phoneSms}?body=${encodedMessage}`;
    handoff.hidden = false;
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
  const savedLanguage = localStorage.getItem("koolMateLanguage");
  if (savedLanguage && translations[savedLanguage]) currentLanguage = savedLanguage;
  await applyCmsContent();
  applyTranslations();
  updateBusinessContent();
  renderCards();
  setupMenu();
  setupLanguageSwitcher();
  setupForm();
  setupPromos();
  setupReveal();
}

bootSite();
