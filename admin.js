const CMS_STORAGE_KEY = "koolMateCmsContent";
const AIRCON_BRANDS = ["Midea", "Carrier", "American Home", "TCL", "Daikin", "LG", "Haier", "Samsung", "Chiq", "Hisense"];
const UNIT_TAGS = {
  mostPopular: "Most Popular",
  bestPrice: "Best Price"
};
const PRICE_LIST_ROWS = 8;
const DEFAULT_PRICE_LIST_URL = "https://docs.google.com/spreadsheets/d/1t9oEcAhR5lvyBxgxYIsHW0f5cveyAD5-xFc74SUX4Lg/edit?gid=0#gid=0";

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
const sectionManuals = {
  en: {
    about: {
      title: "About Us Manual",
      lead: "Edit only the text content of the About Us page.",
      items: [
        "Use short headings so the layout stays clean on mobile.",
        "Services, audience cards, and commitment items are editable text only.",
        "Do not paste long paragraphs into title fields.",
        "Images, layout, and styling are developer locked."
      ]
    },
    work: {
      title: "Our Work Manual",
      lead: "Use this section only when real project proof is ready.",
      items: [
        "Choose Empty if there is no public work sample yet.",
        "Choose Photo to upload an installation, cleaning, repair, or maintenance photo.",
        "Choose Link if the proof is already posted on Facebook or another page.",
        "Use only one source for the photo: upload a file OR paste a Photo URL."
      ]
    },
    units: {
      title: "Aircon Units Manual",
      lead: "Use this section for the units the client wants to highlight.",
      items: [
        "Each brand has 1-2 featured slots only: best sellers, best price, or most popular.",
        "Upload any photo file. The CMS will optimize it for the website automatically.",
        "Fill Model No., Capacity, and Price when available.",
        "Use the Full Price List upload for the complete list image/PDF."
      ]
    },
    promos: {
      title: "Featured Promos Manual",
      lead: "These are the floating ad cards on the public website.",
      items: [
        "Upload square or vertical promo posters for best display.",
        "Use the Show Ad checkbox to hide or show each promo.",
        "Click Link can be #quote, #services, a Facebook post, or Messenger.",
        "Upload any promo photo/poster. The CMS will optimize it for the website automatically."
      ]
    },
    inquiries: {
      title: "Inquiries Manual",
      lead: "This section is for checking customer messages sent through the website form.",
      items: [
        "Click Refresh to check new inquiries.",
        "Mark done after the customer has been contacted.",
        "Messenger and SMS buttons on the public site are still the fastest customer contact options."
      ]
    }
  },
  fil: {
    about: {
      title: "Manual Para sa About Us",
      lead: "Text content lang ng About Us page ang i-edit dito.",
      items: [
        "Panatilihing maikli ang headings para maayos sa mobile.",
        "Editable ang text ng services, audience cards, at commitment items.",
        "Huwag maglagay ng sobrang habang paragraph sa title fields.",
        "Images, layout, at styling ay developer locked."
      ]
    },
    work: {
      title: "Manual Para sa Our Work",
      lead: "Gamitin lang ito kapag may totoong project proof na ready ipakita.",
      items: [
        "Piliin ang Empty kung wala pang public work sample.",
        "Piliin ang Photo para mag-upload ng installation, cleaning, repair, o maintenance photo.",
        "Piliin ang Link kung naka-post na ang proof sa Facebook o ibang page.",
        "Isa lang ang gamitin sa photo source: file upload O Photo URL."
      ]
    },
    units: {
      title: "Manual Para sa Aircon Units",
      lead: "Gamitin ito para sa units na gustong i-highlight ng client.",
      items: [
        "Bawat brand ay may 1-2 featured slots lang: best sellers, best price, o most popular.",
        "Mag-upload ng kahit anong photo file. I-o-optimize ito ng CMS para gumana sa website.",
        "Ilagay ang Model No., Capacity, at Price kapag available.",
        "Gamitin ang Full Price List upload para sa kumpletong list image/PDF."
      ]
    },
    promos: {
      title: "Manual Para sa Featured Promos",
      lead: "Ito ang floating ad cards sa public website.",
      items: [
        "Square o vertical promo posters ang pinaka-ok tingnan.",
        "Gamitin ang Show Ad checkbox para itago o ipakita ang promo.",
        "Ang Click Link puwedeng #quote, #services, Facebook post, o Messenger.",
        "Mag-upload ng kahit anong promo photo/poster. I-o-optimize ito ng CMS para gumana sa website."
      ]
    },
    inquiries: {
      title: "Manual Para sa Inquiries",
      lead: "Dito makikita ang customer messages mula sa website form.",
      items: [
        "Pindutin ang Refresh para makita ang bagong inquiries.",
        "I-mark as done kapag nakausap na ang customer.",
        "Messenger at SMS buttons sa public site pa rin ang pinakamabilis na contact option."
      ]
    }
  }
};
const API_BASE = location.hostname === "localhost" ? "/api" : "/.netlify/functions";
const API_CONTENT = `${API_BASE}/content`;
const API_SESSION = `${API_BASE}/session`;
const API_LOGIN = `${API_BASE}/login`;
const API_LOGOUT = `${API_BASE}/logout`;
const API_UPLOAD = `${API_BASE}/upload`;
const API_INQUIRIES = `${API_BASE}/inquiries`;

const defaults = {
  business: {
    phone: "+63 993 551 5531",
    phoneSms: "+639935515531",
    email: "koolmateadmin070826@gmail.com",
    address: "244 Mikas Street, Real 1, Bacoor, Cavite, Philippines, 4102",
    messenger: "https://m.me/61591997337938",
    maps: "https://www.google.com/maps/place/KOOLMATE+AIR-CONDITIONING+SERVICES+AND+MAINTENANCE,+240+Mikas,+Bacoor,+Cavite/data=!4m2!3m1!1s0x3397d30049c80b31:0xbc7452a11a6e8bd1!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjMyLjYYACCenQoqnwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTY1MzUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODE1NjM1LDEwMDgyMDIzNywxMDA4MjI0ODlCAlBI&skid=4953a404-f13c-484f-ade5-13ce73ac64d2&g_st=afm"
  },
  en: {
    heroTitle: "Cooler Air.<br><span>Cleaner Comfort.</span><br>Smarter Savings.",
    heroTagline: "Choose KOOLMATE!",
    heroLead: "Professional air-conditioning service for a cooler, cleaner and more energy-efficient home or business.",
    workText: "Browse real KOOLMATE service highlights featuring aircon installation, cleaning, repair and maintenance work."
  },
  fil: {
    heroTitle: "Mas Malamig.<br><span>Mas Malinis.</span><br>Mas Tipid.",
    heroTagline: "I-KOOLMATE Mo Yan!",
    heroLead: "Propesyonal na aircon service para sa mas malamig, malinis at matipid na tahanan o negosyo.",
    workText: "Tingnan ang totoong KOOLMATE service highlights mula sa aircon installation, cleaning, repair at maintenance work."
  },
  about: {
    overviewEyebrow: "About KOOLMATE",
    overviewTitle: "We Keep You Cool, Comfortable & Productive.",
    overviewParagraph1: "KOOLMATE is an air conditioning services and maintenance company committed to providing quality cooling solutions for residential, commercial, and business establishments.",
    overviewParagraph2: "We specialize in the installation, maintenance, cleaning, repair, and troubleshooting of air conditioning systems. We also offer brand-new air conditioning units from various trusted brands to help our customers find the right cooling solution for their space and budget.",
    visionTitle: "To become a trusted and preferred air conditioning sales and service provider.",
    visionText: "We aim to be known for quality products, professional workmanship, honest service, and customer satisfaction.",
    missionTitle: "To provide reliable air conditioning solutions customers can trust.",
    missionItems: "Quality products and equipment\nHonest recommendations\nProfessional installation\nResponsive customer service\nSkilled and dependable technicians\nAffordable and practical cooling solutions\nProper maintenance and repair",
    servicesTitle: "Air-conditioning support from purchase to long-term care.",
    servicesIntro: "From choosing the right unit to regular maintenance and repairs, we keep your space cool, efficient, and worry-free.",
    service1Title: "Aircon Sales",
    service1Text: "Brand-new air conditioning units suitable for homes, offices, stores, and other establishments.",
    service2Title: "Aircon Installation",
    service2Text: "Professional installation to help ensure proper operation, performance, and efficiency.",
    service3Title: "General Cleaning",
    service3Text: "Regular cleaning to maintain performance and provide a cleaner indoor environment.",
    service4Title: "Aircon Repair",
    service4Text: "Support for poor cooling, unusual sounds, water leaks, and other common issues.",
    service5Title: "Preventive Maintenance",
    service5Text: "Regular service to identify potential problems early and keep systems running properly.",
    service6Title: "Refrigerant Charging",
    service6Text: "Refrigerant-related services after proper system checking and diagnosis.",
    service7Title: "Troubleshooting & Diagnosis",
    service7Text: "System inspection to identify possible causes and recommend appropriate solutions.",
    brandsTitle: "Trusted aircon brands for different spaces and budgets.",
    brandsText: "KOOLMATE helps customers choose an aircon based on room size, usage, number of occupants, heat exposure, and budget - not simply based on price.",
    audienceTitle: "Comfort solutions for everyday living and business operations.",
    audienceIntro: "We provide reliable cooling solutions designed to keep your space comfortable, efficient, and worry-free.",
    audience1Title: "Homeowners & Families",
    audience1Text: "Comfortable cooling solutions for bedrooms, living rooms, and homes.",
    audience2Title: "Offices & Professionals",
    audience2Text: "Reliable air conditioning for productive and comfortable workplaces.",
    audience3Title: "Stores & Businesses",
    audience3Text: "Cooling solutions for shops, restaurants, offices, and other commercial spaces.",
    audience4Title: "Commercial Establishments",
    audience4Text: "Sales and services for various business and commercial requirements.",
    chooseTitle: "Quality service, reliable solutions, better comfort.",
    chooseText: "At KOOLMATE, we understand that an air conditioner is an investment. We do not simply sell an aircon - we help customers find the right cooling solution for their needs.",
    chooseItems: "Quality air conditioning products\nProfessional installation and service\nSkilled technicians\nComplete aircon solutions\nReliable after-sales service\nPractical recommendations\nCustomer-focused approach\nDTI & BIR registered",
    commitmentQuality: "We value quality products and proper workmanship.",
    commitmentHonesty: "We provide practical recommendations based on actual needs.",
    commitmentProfessionalism: "We strive to deliver dependable and courteous service.",
    commitmentSatisfaction: "Your comfort and satisfaction remain our priority."
  },
  workItems: [
    { type: "empty", title: { en: "Installation Work", fil: "Installation Work" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Aircon Cleaning", fil: "Aircon Cleaning" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Repair Service", fil: "Repair Service" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Maintenance Visit", fil: "Maintenance Visit" }, status: { en: "", fil: "" }, image: "", url: "" },
    { type: "empty", title: { en: "Commercial Service", fil: "Commercial Service" }, status: { en: "", fil: "" }, image: "", url: "" }
  ],
  promos: [
    { enabled: true, title: { en: "Cooler, cleaner comfort", fil: "Mas malamig at malinis" }, image: "assets/promo-cool-home.jpg", url: "#quote" },
    { enabled: true, title: { en: "Aircon not cooling?", fil: "Hindi nagpapalamig ang aircon?" }, image: "assets/promo-aircon-solution.jpg", url: "#services" },
    { enabled: true, title: { en: "Cool comfort every day", fil: "Komportableng lamig araw-araw" }, image: "assets/promo-comfort-everyday.jpg", url: "#quote" },
    { enabled: true, title: { en: "Fast maintenance service", fil: "Mabilis na maintenance service" }, image: "assets/promo-lamig-solusyon.jpg", url: "#services" }
  ],
  priceList: {
    url: DEFAULT_PRICE_LIST_URL,
    source: "",
    rows: normalizePriceListRows([]),
    label: { en: "View Full Price List", fil: "Tingnan ang Full Price List" },
    note: {
      en: "Prices and availability may change. Please message us to confirm the latest stock and final quote.",
      fil: "Maaaring magbago ang presyo at availability. Mag-message para ma-confirm ang latest stock at final quote."
    }
  },
  airconUnits: AIRCON_BRANDS.flatMap((brand) => [1, 2].map((slot) => ({
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
  })))
};

const uiText = {
  en: {
    cmsLabel: "Self-Edit CMS",
    title: "KOOLMATE Website Editor",
    viewSite: "View Site",
    manualEyebrow: "Manual",
    manualTitle: "How to edit",
    manualOne: "Update the fields you want to change.",
    manualTwo: "For Our Work, choose Empty, Photo, or Link.",
    manualThree: "Check the live preview beside the editor, then click Save Changes.",
    noteTitle: "Note",
    noteText: "This CMS saves edits to the live website server. Use Export Backup before large content changes.",
    editorEyebrow: "Website Content",
    editorTitle: "Edit public content",
    importBtn: "Import",
    exportBtn: "Export Backup",
    resetBtn: "Reset",
    tabBusiness: "Business",
    tabHome: "Home Text",
    tabAbout: "About Us",
    tabWork: "Our Work",
    tabUnits: "Aircon Units",
    tabPromos: "Promos",
    tabInquiries: "Inquiries",
    phone: "Phone",
    smsPhone: "SMS Phone",
    email: "Email",
    messenger: "Messenger Link",
    maps: "Google Maps Link",
    address: "Address",
    languageNote: "Edit English and Filipino public text separately.",
    aboutHelp: "Edit the About Us page text. Layout and styling are locked.",
    lockedTitle: "Developer locked fields",
    lockedNote: "Locked fields control layout or formatting and should be edited by a developer.",
    lockedBadge: "Developer locked",
    saveBtn: "Save Changes",
    saved: "Saved to the live website.",
    resetDone: "Reset complete.",
    imported: "Imported and saved.",
    workType: "Type",
    workEmpty: "Empty",
    workPhoto: "Photo",
    workLink: "Link",
    workImage: "Photo URL",
    workUpload: "Upload Photo",
    workUrl: "Link URL",
    workTitleEn: "Title English",
    workTitleFil: "Title Filipino",
    workStatusEn: "Custom status English",
    workStatusFil: "Custom status Filipino",
    promoHelp: "Control the floating featured ads shown on the public website.",
    promoShow: "Show ad",
    promoTitleEn: "Promo title English",
    promoTitleFil: "Promo title Filipino",
    promoImage: "Poster image URL",
    promoUrl: "Promo destination link",
    unitsHelp: "Edit 1-2 featured units per brand. Use the Full Price List table below for the complete available aircon list.",
    priceListTitle: "Full price list",
    priceListHelp: "Build the public pricelist table row by row. Each row becomes one line in the website modal.",
    priceListAddRow: "Add row",
    priceListRemoveRow: "Remove",
    priceRowBrand: "Brand",
    priceRowModel: "Model No.",
    priceRowCapacity: "Capacity",
    priceRowSrp: "SRP",
    priceRowCash: "Cash",
    priceListLabelEn: "Button label English",
    priceListLabelFil: "Button label Filipino",
    priceListNoteEn: "Small note English",
    priceListNoteFil: "Small note Filipino",
    unitShow: "Show featured unit",
    unitBrand: "Brand",
    unitTag: "Tag",
    unitTagMostPopular: "Most Popular",
    unitTagBestPrice: "Best Price",
    unitModel: "Model No.",
    unitCapacity: "Capacity",
    unitNameEn: "Unit name English",
    unitNameFil: "Unit name Filipino",
    unitTypeEn: "Unit type English",
    unitTypeFil: "Unit type Filipino",
    unitPrice: "Price label",
    unitImage: "Unit image URL",
    unitUrl: "Inquire button destination",
    previewLabel: "Live Look",
    inquiriesTitle: "Customer inquiries",
    inquiriesHelp: "New quote requests from the website form appear here.",
    refreshInquiries: "Refresh",
    noInquiries: "No inquiries yet.",
    markDone: "Mark done",
    markNew: "Mark new"
  },
  fil: {
    cmsLabel: "Self-Edit CMS",
    title: "KOOLMATE Website Editor",
    viewSite: "Tingnan ang Site",
    manualEyebrow: "Manual",
    manualTitle: "Paano mag-edit",
    manualOne: "Palitan ang fields na gusto mong baguhin.",
    manualTwo: "Sa Our Work, pumili ng Empty, Photo, o Link.",
    manualThree: "Tingnan ang live preview sa tabi ng editor, tapos pindutin ang Save Changes.",
    noteTitle: "Paalala",
    noteText: "Ang CMS na ito ay nagsasave sa live website server. Gumamit ng Export Backup bago malaking content changes.",
    editorEyebrow: "Website Content",
    editorTitle: "I-edit ang public content",
    importBtn: "Import",
    exportBtn: "Export Backup",
    resetBtn: "Reset",
    tabBusiness: "Business",
    tabHome: "Home Text",
    tabAbout: "About Us",
    tabWork: "Our Work",
    tabUnits: "Aircon Units",
    tabPromos: "Promos",
    tabInquiries: "Inquiries",
    phone: "Phone",
    smsPhone: "SMS Phone",
    email: "Email",
    messenger: "Messenger Link",
    maps: "Google Maps Link",
    address: "Address",
    languageNote: "I-edit nang hiwalay ang English at Filipino public text.",
    aboutHelp: "I-edit ang text ng About Us page. Locked ang layout at styling.",
    lockedTitle: "Developer locked fields",
    lockedNote: "Ang locked fields ay may epekto sa layout o formatting. Developer dapat ang mag-edit nito.",
    lockedBadge: "Developer locked",
    saveBtn: "Save Changes",
    saved: "Saved na sa live website.",
    resetDone: "Reset complete.",
    imported: "Imported and saved.",
    workType: "Type",
    workEmpty: "Empty",
    workPhoto: "Photo",
    workLink: "Link",
    workImage: "Photo URL",
    workUpload: "Upload Photo",
    workUrl: "Link URL",
    workTitleEn: "Title English",
    workTitleFil: "Title Filipino",
    workStatusEn: "Custom status English",
    workStatusFil: "Custom status Filipino",
    promoHelp: "Kontrolin ang floating featured ads na makikita sa public website.",
    promoShow: "Ipakita ang ad",
    promoTitleEn: "Promo title English",
    promoTitleFil: "Promo title Filipino",
    promoImage: "Poster image URL",
    promoUrl: "Promo destination link",
    unitsHelp: "Mag-edit ng 1-2 featured units kada brand. Gamitin ang Full Price List table sa ibaba para sa kumpletong available aircon list.",
    priceListTitle: "Full price list",
    priceListHelp: "Buuin ang public pricelist table row by row. Bawat row ay isang linya sa website modal.",
    priceListAddRow: "Magdagdag ng row",
    priceListRemoveRow: "Tanggalin",
    priceRowBrand: "Brand",
    priceRowModel: "Model No.",
    priceRowCapacity: "Capacity",
    priceRowSrp: "SRP",
    priceRowCash: "Cash",
    priceListLabelEn: "Button label English",
    priceListLabelFil: "Button label Filipino",
    priceListNoteEn: "Small note English",
    priceListNoteFil: "Small note Filipino",
    unitShow: "Ipakita ang featured unit",
    unitBrand: "Brand",
    unitTag: "Tag",
    unitTagMostPopular: "Most Popular",
    unitTagBestPrice: "Best Price",
    unitModel: "Model No.",
    unitCapacity: "Capacity",
    unitNameEn: "Unit name English",
    unitNameFil: "Unit name Filipino",
    unitTypeEn: "Unit type English",
    unitTypeFil: "Unit type Filipino",
    unitPrice: "Price label",
    unitImage: "Unit image URL",
    unitUrl: "Inquire button destination",
    previewLabel: "Live Look",
    inquiriesTitle: "Customer inquiries",
    inquiriesHelp: "Dito lalabas ang bagong quote requests mula sa website form.",
    refreshInquiries: "Refresh",
    noInquiries: "Wala pang inquiries.",
    markDone: "Mark done",
    markNew: "Mark new"
  }
};

let cmsLanguage = localStorage.getItem("koolMateCmsLanguage") || "en";
let state = clone(defaults);
let inquiries = [];
let autosaveTimer = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeStateContent(content) {
  const next = { ...clone(defaults), ...(content || {}) };
  next.business = { ...defaults.business, ...(content?.business || {}) };
  next.en = { ...defaults.en, ...(content?.en || {}) };
  next.fil = { ...defaults.fil, ...(content?.fil || {}) };
  next.about = { ...defaults.about, ...(content?.about || {}) };
  if (String(next.en.workText || "").includes("posted soon")) {
    next.en.workText = defaults.en.workText;
  }
  if (String(next.fil.workText || "").includes("Malapit nang maipakita")) {
    next.fil.workText = defaults.fil.workText;
  }
  next.priceList = {
    ...defaults.priceList,
    ...(content?.priceList || {}),
    label: { ...defaults.priceList.label, ...(content?.priceList?.label || {}) },
    note: { ...defaults.priceList.note, ...(content?.priceList?.note || {}) },
    rows: normalizePriceListRows(content?.priceList?.rows)
  };

  const savedUnits = Array.isArray(content?.airconUnits) ? content.airconUnits : [];
  next.airconUnits = AIRCON_BRANDS.flatMap((brand) => {
    const brandUnits = savedUnits.filter((unit) => ((unit.brand || "") === brand) || (brand === "Samsung" && (unit.brand || "") === "Koppel")).slice(0, 2);
    const legacyUnit = savedUnits[AIRCON_BRANDS.indexOf(brand)] || {};
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

  return next;
}

async function loadState() {
  try {
    const response = await fetch(API_CONTENT, { cache: "no-store" });
    if (response.ok) return normalizeStateContent(await response.json());
  } catch {
    // Static preview fallback.
  }
  try {
    return normalizeStateContent(JSON.parse(localStorage.getItem(CMS_STORAGE_KEY)) || {});
  } catch {
    return normalizeStateContent({});
  }
}

async function saveState() {
  localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(state, null, 2));
  const response = await fetch(API_CONTENT, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(state)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Unable to save to server.");
  }
}

function getPath(object, path) {
  return path.split(".").reduce((result, key) => result?.[key], object);
}

function setPath(object, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((result, key) => {
    result[key] = result[key] || {};
    return result[key];
  }, object);
  target[last] = value;
}

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

function getGoogleSheetEditUrl(value) {
  const url = String(value || "").trim() || DEFAULT_PRICE_LIST_URL;
  const match = url.match(/docs\.google\.com\/spreadsheets\/d\/([^/]+)/i);
  if (!match) return url;

  const gidMatch = url.match(/[?&#]gid=([^&#]+)/i);
  const gid = gidMatch ? gidMatch[1] : "0";
  return `https://docs.google.com/spreadsheets/d/${match[1]}/edit?gid=${gid}#gid=${gid}`;
}

function normalizeCmsAssets() {
  state.workItems = (state.workItems || []).map((item) => {
    const image = normalizeAssetUrl(item.image);
    const url = normalizeAssetUrl(item.url);
    const type = image ? "photo" : item.type;
    return { ...item, image, url, type };
  });
  state.promos = (state.promos || []).map((promo) => ({
    ...promo,
    image: normalizeAssetUrl(promo.image),
    url: normalizeAssetUrl(promo.url)
  }));
  state.airconUnits = (state.airconUnits || []).map((unit) => ({
    ...unit,
    brand: unit.brand === "Koppel" ? "Samsung" : unit.brand,
    image: normalizeAssetUrl(unit.image),
    url: normalizeAssetUrl(unit.url)
  }));
  if (state.priceList) {
    const currentPriceListUrl = normalizeAssetUrl(state.priceList.url);
    state.priceList.url = getGoogleSheetEditUrl(currentPriceListUrl).includes("docs.google.com/spreadsheets")
      ? getGoogleSheetEditUrl(currentPriceListUrl)
      : DEFAULT_PRICE_LIST_URL;
    state.priceList.source = "link";
    state.priceList.rows = normalizePriceListRows(state.priceList.rows);
  }
}

function scheduleAutosave() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(async () => {
    try {
      await saveState();
      setStatus("Autosaved to the website.");
    } catch (error) {
      setStatus(error.message || "Autosave failed. Click Save Changes before leaving.");
    }
  }, 900);
}

function applyUiLanguage() {
  const copy = uiText[cmsLanguage];
  document.documentElement.lang = cmsLanguage === "fil" ? "fil" : "en";
  document.querySelectorAll("[data-ui]").forEach((node) => {
    node.textContent = copy[node.dataset.ui] || node.textContent;
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === cmsLanguage);
  });
  renderSectionManuals();
  renderAboutEditor();
  renderWorkEditor();
  renderUnitEditor();
  renderPromoEditor();
}

function renderSectionManuals() {
  const manuals = sectionManuals[cmsLanguage] || sectionManuals.en;
  document.querySelectorAll("[data-manual]").forEach((node) => {
    const manual = manuals[node.dataset.manual];
    if (!manual) return;
    node.innerHTML = `
      <div>
        <strong>${manual.title}</strong>
        <p>${manual.lead}</p>
      </div>
      <ul>
        ${manual.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  });
}

function fillForm() {
  document.querySelectorAll("[name]").forEach((input) => {
    const value = getPath(state, input.name);
    if (input.type === "checkbox") {
      input.checked = Boolean(value);
      return;
    }
    input.value = value || "";
  });
  lockCodeFields();
}

function imagePreview(src, alt, fallbackText) {
  const url = normalizeAssetUrl(src);
  if (!url) return `<span>${fallbackText}</span>`;
  const retryUrl = url.replace(/^\//, "");
  return `<img data-preview-src="${escapeAttribute(url)}" data-retry-src="${escapeAttribute(retryUrl)}" alt="${escapeAttribute(alt)}" data-fallback-text="${escapeAttribute(fallbackText)}">`;
}

function hydratePreviewImages(root = document) {
  root.querySelectorAll("[data-preview-src]").forEach((image) => {
    const primary = image.dataset.previewSrc || "";
    const retry = image.dataset.retrySrc || "";
    image.onerror = () => {
      if (!image.dataset.retried && retry && retry !== primary) {
        image.dataset.retried = "true";
        image.src = retry;
        return;
      }
      const fallback = document.createElement("span");
      fallback.className = "image-blocked-message";
      fallback.textContent = uiText[cmsLanguage].imageBlocked || image.dataset.fallbackText || "Image preview unavailable.";
      image.replaceWith(fallback);
    };
    image.onload = () => image.classList.add("is-loaded");
    image.src = primary;
  });
}

function sourceChoiceNote(source) {
  const copy = uiText[cmsLanguage];
  const message = source === "upload" ? copy.usingUpload : source === "link" ? copy.usingLink : copy.sourceChoiceNote;
  return `<p class="source-choice-note ${source ? "is-active" : ""}">${message}</p>`;
}

function markUrlSourceFromInput(name) {
  if (name === "priceList.url") {
    state.priceList = state.priceList || clone(defaults.priceList);
    state.priceList.source = state.priceList.url ? "link" : "";
    return;
  }

  const workMatch = name.match(/^workItems\.(\d+)\.image$/);
  if (workMatch) {
    const item = state.workItems[Number(workMatch[1])];
    if (item) item.imageSource = item.image ? "link" : "";
    return;
  }

  const promoMatch = name.match(/^promos\.(\d+)\.image$/);
  if (promoMatch) {
    const promo = state.promos[Number(promoMatch[1])];
    if (promo) promo.imageSource = promo.image ? "link" : "";
    return;
  }

  const unitMatch = name.match(/^airconUnits\.(\d+)\.image$/);
  if (unitMatch) {
    const unit = state.airconUnits[Number(unitMatch[1])];
    if (unit) unit.imageSource = unit.image ? "link" : "";
  }
}

function lockCodeFields() {
  document.querySelectorAll("[data-code-lock]").forEach((input) => {
    input.readOnly = true;
    input.setAttribute("aria-readonly", "true");
    input.setAttribute("tabindex", "-1");
  });
}

function placePreviewBesideEditor() {
  const preview = document.querySelector(".mini-site-preview");
  const editorPanel = document.querySelector(".editor-panel");
  if (!preview || !editorPanel || preview.parentElement === editorPanel) return;
  editorPanel.appendChild(preview);
}

const aboutFieldGroups = [
  {
    title: "Main About Area",
    fields: [
      ["overviewEyebrow", "Small label", "input"],
      ["overviewTitle", "Main heading", "input"],
      ["overviewParagraph1", "Paragraph 1", "textarea"],
      ["overviewParagraph2", "Paragraph 2", "textarea"]
    ]
  },
  {
    title: "Vision & Mission",
    fields: [
      ["visionTitle", "Vision headline", "textarea"],
      ["visionText", "Vision supporting text", "textarea"],
      ["missionTitle", "Mission headline", "textarea"],
      ["missionItems", "Mission checklist - one item per line", "textarea"]
    ]
  },
  {
    title: "Our Services Section",
    fields: [
      ["servicesTitle", "Section heading", "input"],
      ["servicesIntro", "Short intro", "textarea"],
      ["service1Title", "Service 01 title", "input"],
      ["service1Text", "Service 01 description", "textarea"],
      ["service2Title", "Service 02 title", "input"],
      ["service2Text", "Service 02 description", "textarea"],
      ["service3Title", "Service 03 title", "input"],
      ["service3Text", "Service 03 description", "textarea"],
      ["service4Title", "Service 04 title", "input"],
      ["service4Text", "Service 04 description", "textarea"],
      ["service5Title", "Service 05 title", "input"],
      ["service5Text", "Service 05 description", "textarea"],
      ["service6Title", "Service 06 title", "input"],
      ["service6Text", "Service 06 description", "textarea"],
      ["service7Title", "Service 07 title", "input"],
      ["service7Text", "Service 07 description", "textarea"]
    ]
  },
  {
    title: "Brands & Customers",
    fields: [
      ["brandsTitle", "Brands heading", "input"],
      ["brandsText", "Brands description", "textarea"],
      ["audienceTitle", "Who We Serve heading", "input"],
      ["audienceIntro", "Who We Serve intro", "textarea"],
      ["audience1Title", "Audience 01 title", "input"],
      ["audience1Text", "Audience 01 description", "textarea"],
      ["audience2Title", "Audience 02 title", "input"],
      ["audience2Text", "Audience 02 description", "textarea"],
      ["audience3Title", "Audience 03 title", "input"],
      ["audience3Text", "Audience 03 description", "textarea"],
      ["audience4Title", "Audience 04 title", "input"],
      ["audience4Text", "Audience 04 description", "textarea"]
    ]
  },
  {
    title: "Why Choose & Commitment",
    fields: [
      ["chooseTitle", "Why Choose heading", "input"],
      ["chooseText", "Why Choose paragraph", "textarea"],
      ["chooseItems", "Why Choose list - one item per line", "textarea"],
      ["commitmentQuality", "Commitment: Quality", "textarea"],
      ["commitmentHonesty", "Commitment: Honesty", "textarea"],
      ["commitmentProfessionalism", "Commitment: Professionalism", "textarea"],
      ["commitmentSatisfaction", "Commitment: Customer Satisfaction", "textarea"]
    ]
  }
];

function renderAboutEditor() {
  const editor = document.getElementById("aboutEditor");
  if (!editor) return;
  editor.innerHTML = aboutFieldGroups.map((group) => `
    <fieldset class="about-edit-group">
      <legend>${group.title}</legend>
      <div class="field-grid">
        ${group.fields.map(([key, label, type]) => {
          const rows = key.includes("Items") ? 5 : 3;
          return type === "textarea"
            ? `<label class="full"><span>${label}</span><textarea name="about.${key}" rows="${rows}"></textarea></label>`
            : `<label><span>${label}</span><input name="about.${key}"></label>`;
        }).join("")}
      </div>
    </fieldset>
  `).join("");
  fillForm();
}

function renderWorkEditor() {
  const copy = uiText[cmsLanguage];
  const editor = document.getElementById("workEditor");
  editor.innerHTML = state.workItems.map((item, index) => `
    <article class="work-edit-card">
      <div class="work-edit-head">
        <strong>Slot ${String(index + 1).padStart(2, "0")}</strong>
        <select name="workItems.${index}.type" aria-label="${copy.workType}">
          <option value="empty">${copy.workEmpty}</option>
          <option value="photo">${copy.workPhoto}</option>
          <option value="link">${copy.workLink}</option>
        </select>
      </div>
      <div class="work-fields">
        <label><span>${copy.workTitleEn}</span><input name="workItems.${index}.title.en"></label>
        <label><span>${copy.workTitleFil}</span><input name="workItems.${index}.title.fil"></label>
        <label><span>${copy.workImage}</span><input name="workItems.${index}.image" placeholder="assets/work-photo.jpg or https://..."></label>
        <label><span>${copy.workUpload}</span><input type="file" accept="image/*" data-work-upload="${index}"></label>
        <div class="wide">${sourceChoiceNote(item.imageSource)}</div>
        <label><span>${copy.workUrl}</span><input name="workItems.${index}.url" placeholder="https://facebook.com/..."></label>
        <label><span>${copy.workStatusEn}</span><input name="workItems.${index}.status.en" placeholder="Optional"></label>
        <label><span>${copy.workStatusFil}</span><input name="workItems.${index}.status.fil" placeholder="Optional"></label>
      </div>
    </article>
  `).join("");
  fillForm();
  setupUploads();
  hydratePreviewImages(editor);
}

function renderPromoEditor() {
  const copy = uiText[cmsLanguage];
  const editor = document.getElementById("promoEditor");
  if (!editor) return;
  editor.innerHTML = state.promos.map((promo, index) => `
    <article class="promo-edit-card">
      <div class="promo-edit-preview">
        ${imagePreview(promo.image || "assets/promo-cool-home.jpg", "", "Poster image")}
      </div>
      <div class="promo-edit-fields">
        <div class="promo-edit-head">
          <strong>Promo ${String(index + 1).padStart(2, "0")}</strong>
          <label class="toggle-field">
            <input type="checkbox" name="promos.${index}.enabled">
            <span>${copy.promoShow}</span>
          </label>
        </div>
        <div class="work-fields">
          <label><span>${copy.promoTitleEn}</span><input name="promos.${index}.title.en"></label>
          <label><span>${copy.promoTitleFil}</span><input name="promos.${index}.title.fil"></label>
          <label><span>${copy.promoImage}</span><input name="promos.${index}.image" placeholder="assets/promo.jpg or https://..."></label>
          <label><span>${copy.workUpload}</span><input type="file" accept="image/*" data-promo-upload="${index}"></label>
          <div class="wide">${sourceChoiceNote(promo.imageSource)}</div>
          <label class="wide locked-field">
            <span>${copy.promoUrl} <em>${copy.lockedBadge}</em></span>
            <input name="promos.${index}.url" placeholder="#quote or https://..." data-code-lock readonly aria-readonly="true">
          </label>
        </div>
      </div>
    </article>
  `).join("");
  fillForm();
  setupUploads();
  hydratePreviewImages(editor);
}

function renderUnitEditor() {
  const copy = uiText[cmsLanguage];
  const editor = document.getElementById("unitEditor");
  if (!editor) return;
  const priceListEditUrl = getGoogleSheetEditUrl(DEFAULT_PRICE_LIST_URL);
  editor.innerHTML = `
    <article class="price-list-edit-card">
      <div class="promo-edit-head">
        <div>
          <strong>${copy.priceListTitle}</strong>
          <p class="price-list-edit-help">The full price list now uses the connected Google Sheet. Edit prices directly in Google Sheets; the website modal will show the saved sheet.</p>
        </div>
      </div>
      <a class="secondary" href="${escapeAttribute(priceListEditUrl)}" target="_blank" rel="noopener noreferrer">Open Google Sheet</a>
    </article>
    ${state.airconUnits.map((unit, index) => `
    <article class="unit-edit-card">
      <div class="unit-edit-preview">
        ${imagePreview(unit.image, `${unit.brand || "Aircon"} unit preview`, "Unit image")}
      </div>
      <div class="unit-edit-fields">
        <div class="promo-edit-head">
          <strong>${unit.brand || "Aircon"} Featured ${unit.slot || (index % 2) + 1}</strong>
          <label class="toggle-field">
            <input type="checkbox" name="airconUnits.${index}.enabled">
            <span>${copy.unitShow}</span>
          </label>
        </div>
        <div class="work-fields">
          <label>
            <span>${copy.unitBrand}</span>
            <select name="airconUnits.${index}.brand">
              ${AIRCON_BRANDS.map((brand) => `<option value="${brand}">${brand}</option>`).join("")}
            </select>
          </label>
          <label>
            <span>${copy.unitTag}</span>
            <select name="airconUnits.${index}.tag">
              <option value="mostPopular">${copy.unitTagMostPopular}</option>
              <option value="bestPrice">${copy.unitTagBestPrice}</option>
            </select>
          </label>
          <label><span>${copy.unitModel}</span><input name="airconUnits.${index}.model" placeholder="Example: MSAG-09CRN8"></label>
          <label><span>${copy.unitCapacity}</span><input name="airconUnits.${index}.capacity" placeholder="Example: 1.5HP"></label>
          <label><span>${copy.unitPrice}</span><input name="airconUnits.${index}.price" placeholder=""></label>
          <input type="hidden" name="airconUnits.${index}.image">
          <label class="locked-field">
            <span>${copy.unitImage} <em>${copy.lockedBadge}</em></span>
            <input value="${unit.image ? "Uploaded photo saved" : "No photo uploaded yet"}" readonly aria-readonly="true" tabindex="-1">
          </label>
          <label><span>${copy.workUpload}</span><input type="file" accept="image/*" data-unit-upload="${index}"></label>
          <div class="wide">${sourceChoiceNote(unit.imageSource)}</div>
          <label class="locked-field">
            <span>${copy.unitUrl} <em>${copy.lockedBadge}</em></span>
            <input name="airconUnits.${index}.url" placeholder="#quote" data-code-lock readonly aria-readonly="true">
          </label>
        </div>
      </div>
    </article>
  `).join("")}
  `;
  fillForm();
  setupUploads();
  hydratePreviewImages(editor);
}

function setStatus(message) {
  document.getElementById("saveStatus").textContent = message;
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function stripHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = (value || "").replace(/<br\s*\/?>/gi, " ");
  return template.content.textContent || "";
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function collectFormState() {
  document.querySelectorAll("#cmsForm [name]").forEach((input) => {
    if (input.type === "file") return;
    setPath(state, input.name, input.type === "checkbox" ? input.checked : input.value.trim());
  });
  normalizeCmsAssets();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function convertImageFileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("This file could not be read as a photo. Please choose an image file."));
      image.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
        const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
        const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadFile(file, statusMessage) {
  setStatus(statusMessage);
  const dataUrl = file.type.startsWith("image/") ? await convertImageFileToDataUrl(file) : await readFileAsDataUrl(file);
  const response = await fetch(API_UPLOAD, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ filename: file.name, dataUrl })
  });
  if (!response.ok) throw new Error((await response.json()).message || "Upload failed.");
  return response.json();
}

function setupUploads() {
  document.querySelectorAll("[data-price-list-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const payload = await uploadFile(file, "Uploading price list...");
        state.priceList = state.priceList || clone(defaults.priceList);
        const replacedLink = state.priceList.source === "link" && state.priceList.url;
        state.priceList.url = payload.url;
        state.priceList.source = "upload";
        input.value = "";
        await saveState();
        fillForm();
        renderUnitEditor();
        updatePreview();
        setStatus(replacedLink ? "Uploaded file replaced the pasted price list link and saved to the website." : "Price list uploaded and saved to the website.");
      } catch (error) {
        setStatus(error.message || "Upload failed.");
      }
    });
  });
  document.querySelectorAll("[data-work-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const index = Number(input.dataset.workUpload);
      try {
        const payload = await uploadFile(file, "Uploading image...");
        const replacedLink = state.workItems[index].imageSource === "link" && state.workItems[index].image;
        state.workItems[index].image = payload.url;
        state.workItems[index].imageSource = "upload";
        state.workItems[index].type = "photo";
        input.value = "";
        await saveState();
        fillForm();
        renderWorkEditor();
        updatePreview();
        setStatus(replacedLink ? "Uploaded photo replaced the pasted photo URL and saved to the website." : "Image uploaded and saved to the website.");
      } catch (error) {
        setStatus(error.message || "Upload failed.");
      }
    });
  });
  document.querySelectorAll("[data-promo-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const index = Number(input.dataset.promoUpload);
      try {
        const payload = await uploadFile(file, "Uploading promo image...");
        const replacedLink = state.promos[index].imageSource === "link" && state.promos[index].image;
        state.promos[index].image = payload.url;
        state.promos[index].imageSource = "upload";
        state.promos[index].enabled = true;
        input.value = "";
        await saveState();
        fillForm();
        renderPromoEditor();
        updatePreview();
        setStatus(replacedLink ? "Uploaded promo replaced the pasted poster URL and saved to the website." : "Promo image uploaded and saved to the website.");
      } catch (error) {
        setStatus(error.message || "Upload failed.");
      }
    });
  });
  document.querySelectorAll("[data-unit-upload]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      if (!file) return;
      const index = Number(input.dataset.unitUpload);
      try {
        const payload = await uploadFile(file, "Uploading unit image...");
        const replacedLink = state.airconUnits[index].imageSource === "link" && state.airconUnits[index].image;
        state.airconUnits[index].image = payload.url;
        state.airconUnits[index].imageSource = "upload";
        state.airconUnits[index].enabled = true;
        input.value = "";
        await saveState();
        fillForm();
        renderUnitEditor();
        updatePreview();
        setStatus(replacedLink ? "Uploaded unit image replaced the pasted unit image URL and saved to the website." : "Unit image uploaded and saved to the website.");
      } catch (error) {
        setStatus(error.message || "Upload failed.");
      }
    });
  });
}

function setupPriceListEditor() {
  const add = document.querySelector("[data-price-row-add]");
  if (add && !add.dataset.bound) {
    add.dataset.bound = "true";
    add.addEventListener("click", async () => {
      collectFormState();
      const rows = Array.isArray(state.priceList?.rows) ? state.priceList.rows.slice() : [];
      state.priceList = state.priceList || clone(defaults.priceList);
      state.priceList.rows = [...rows, blankPriceRow()];
      await saveState().catch((error) => setStatus(error.message || "Unable to save price row."));
      renderUnitEditor();
      updatePreview();
      setStatus("Price row added and saved.");
    });
  }

  document.querySelectorAll("[data-price-row-remove]").forEach((button) => {
    if (button.dataset.bound) return;
    button.dataset.bound = "true";
    button.addEventListener("click", async () => {
      const index = Number(button.dataset.priceRowRemove);
      collectFormState();
      const rows = Array.isArray(state.priceList?.rows) ? state.priceList.rows.slice() : [];
      rows.splice(index, 1);
      state.priceList = state.priceList || clone(defaults.priceList);
      state.priceList.rows = rows.length ? rows : [blankPriceRow()];
      await saveState().catch((error) => setStatus(error.message || "Unable to save price row."));
      renderUnitEditor();
      updatePreview();
      setStatus("Price row removed and saved.");
    });
  });
}

function updatePreview() {
  document.getElementById("previewHeroTitle").textContent = stripHtml(state.en.heroTitle);
  document.getElementById("previewHeroTagline").textContent = state.en.heroTagline || "Choose KOOLMATE!";
  document.getElementById("previewHeroLead").textContent = state.en.heroLead || "";
  document.getElementById("previewPhone").textContent = state.business.phone || "";
  document.getElementById("previewEmail").textContent = state.business.email || "";

  const visibleWorkItems = state.workItems.slice(0, 5).filter((item) => {
    const type = item.type || "empty";
    return (type === "photo" && item.image) || (type === "link" && item.url);
  });
  document.getElementById("previewWork").innerHTML = visibleWorkItems.length ? visibleWorkItems.map((item, index) => {
    const type = item.type || "empty";
    const title = item.title?.en || `Work ${index + 1}`;
    const isPhoto = type === "photo" && item.image;
    const isLink = type === "link" && item.url;
    const media = isPhoto ? imagePreview(item.image, "", "Image link blocked") : `<span>${String(index + 1).padStart(2, "0")}</span>`;
    const status = item.status?.en || (isPhoto ? "View Photo" : isLink ? "Open Link" : "Unavailable");
    return `<article class="mini-work-card ${isPhoto ? "has-photo" : ""}">${media}<strong>${title}</strong><small>${status}</small></article>`;
  }).join("") : `<p class="mini-work-empty">Work photos or links will appear here after publishing.</p>`;
}

async function loadInquiries() {
  const list = document.getElementById("inquiryList");
  if (!list) return;
  list.innerHTML = `<p class="inquiry-empty">Loading inquiries...</p>`;
  try {
    const response = await fetch(API_INQUIRIES, { cache: "no-store" });
    if (!response.ok) throw new Error((await response.json()).message || "Unable to load inquiries.");
    const payload = await response.json();
    inquiries = payload.inquiries || [];
    renderInquiries();
  } catch (error) {
    list.innerHTML = `<p class="inquiry-empty">${error.message || "Unable to load inquiries."}</p>`;
  }
}

function renderInquiries() {
  const copy = uiText[cmsLanguage];
  const list = document.getElementById("inquiryList");
  if (!list) return;
  if (!inquiries.length) {
    list.innerHTML = `<p class="inquiry-empty">${copy.noInquiries}</p>`;
    return;
  }
  list.innerHTML = inquiries.map((item) => {
    const phoneHref = `tel:${String(item.phone || "").replace(/[^\d+]/g, "")}`;
    const smsHref = `sms:${String(item.phone || "").replace(/[^\d+]/g, "")}`;
    const mailHref = `mailto:${item.email || ""}`;
    return `
      <article class="inquiry-card ${item.status === "done" ? "is-done" : ""}">
        <div class="inquiry-head">
          <div>
            <strong>${item.name || "Customer"}</strong>
            <span>${formatDate(item.createdAt)}</span>
          </div>
          <span class="status-pill">${item.status === "done" ? "Done" : "New"}</span>
        </div>
        <div class="inquiry-meta">
          <a href="${phoneHref}">${item.phone || "No phone"}</a>
          <a href="${mailHref}">${item.email || "No email"}</a>
          <span>${item.service || "Service not set"}</span>
          <span>${item.date || "No preferred date"}</span>
        </div>
        <p>${item.message || ""}</p>
        <div class="inquiry-actions">
          <a class="secondary" href="${phoneHref}">Call</a>
          <a class="secondary" href="${smsHref}">SMS</a>
          <a class="secondary" href="${mailHref}">Email</a>
          <button type="button" class="secondary" data-inquiry-status="${item.status === "done" ? "new" : "done"}" data-inquiry-id="${item.id}">
            ${item.status === "done" ? copy.markNew : copy.markDone}
          </button>
        </div>
      </article>
    `;
  }).join("");
}

async function updateInquiryStatus(id, status) {
  const response = await fetch(API_INQUIRIES, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id, status })
  });
  if (!response.ok) throw new Error((await response.json()).message || "Unable to update inquiry.");
  await loadInquiries();
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    cmsLanguage = button.dataset.lang;
    localStorage.setItem("koolMateCmsLanguage", cmsLanguage);
    applyUiLanguage();
  });
});

document.querySelectorAll("[data-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((node) => node.classList.toggle("active", node === button));
    document.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === button.dataset.tab));
    if (button.dataset.tab === "inquiries") loadInquiries();
  });
});

document.getElementById("refreshInquiriesBtn").addEventListener("click", loadInquiries);

document.getElementById("inquiryList").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-inquiry-id]");
  if (!button) return;
  try {
    button.disabled = true;
    await updateInquiryStatus(button.dataset.inquiryId, button.dataset.inquiryStatus);
  } catch (error) {
    setStatus(error.message || "Unable to update inquiry.");
    button.disabled = false;
  }
});

document.getElementById("cmsForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  collectFormState();
  try {
    await saveState();
    updatePreview();
    setStatus(uiText[cmsLanguage].saved);
  } catch (error) {
    setStatus(error.message || "Unable to save.");
  }
});

document.getElementById("cmsForm").addEventListener("input", (event) => {
  collectFormState();
  if (event.target?.name) markUrlSourceFromInput(event.target.name);
  updatePreview();
  scheduleAutosave();
});

document.getElementById("cmsForm").addEventListener("change", (event) => {
  collectFormState();
  if (event.target?.name) markUrlSourceFromInput(event.target.name);
  updatePreview();
  scheduleAutosave();
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "KOOLMATE-cms-backup.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById("importBtn").addEventListener("click", () => document.getElementById("importFile").click());
document.getElementById("importFile").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  state = normalizeStateContent(JSON.parse(await file.text()));
  await saveState().catch((error) => setStatus(error.message || "Imported locally, but server save failed."));
  fillForm();
  renderAboutEditor();
  renderWorkEditor();
  renderUnitEditor();
  renderPromoEditor();
  updatePreview();
  setStatus(uiText[cmsLanguage].imported);
});

document.getElementById("resetBtn").addEventListener("click", async () => {
  if (!confirm("Reset all CMS edits?")) return;
  state = normalizeStateContent({});
  localStorage.removeItem(CMS_STORAGE_KEY);
  await saveState().catch((error) => setStatus(error.message || "Reset locally, but server save failed."));
  fillForm();
  renderAboutEditor();
  renderWorkEditor();
  renderUnitEditor();
  renderPromoEditor();
  updatePreview();
  setStatus(uiText[cmsLanguage].resetDone);
});

async function checkSession() {
  try {
    const response = await fetch(API_SESSION, { cache: "no-store" });
    const payload = await response.json();
    return Boolean(payload.authenticated);
  } catch {
    return true;
  }
}

function showLogin(show) {
  document.getElementById("loginScreen").hidden = !show;
  document.body.classList.toggle("is-locked", show);
}

function setupLogin() {
  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("loginStatus");
    const password = new FormData(event.currentTarget).get("password");
    status.textContent = "Checking password...";
    try {
      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!response.ok) throw new Error((await response.json()).message || "Login failed.");
      showLogin(false);
      status.textContent = "";
      await initializeEditor();
    } catch (error) {
      status.textContent = error.message || "Login failed.";
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch(API_LOGOUT, { method: "POST" }).catch(() => {});
    showLogin(true);
  });
}

async function initializeEditor() {
  state = await loadState();
  await loadInquiries();
  placePreviewBesideEditor();
  applyUiLanguage();
  fillForm();
  updatePreview();
}

async function boot() {
  setupLogin();
  const authenticated = await checkSession();
  showLogin(!authenticated);
  if (authenticated) await initializeEditor();
}

boot();
