import skyMapImage from '../assets/modules/skyMap.png'
import type { Module } from '../types'

type ModuleDefault = Omit<Module, 'id' | 'section_id'>

// ── 共用佔位圖 ────────────────────────────────────────────────────────────────

const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80'

// ── 通用積木預設資料（舊版，保留向下相容）─────────────────────────────────────

/** @deprecated 仍在 Registry，不出現在新增選單 */
export const MODULE_DEFAULTS: Record<string, ModuleDefault> = {
  navbar: {
    module_type: 'navbar',
    order: 1,
    data: {
      logo: '建案名稱',
      links: [
        { label: '建案特色', href: '#features' },
        { label: '地理位置', href: '#location' },
        { label: '立即預約', href: '#contact' },
      ],
    },
  },
  hero_standard: {
    module_type: 'hero_standard',
    order: 1,
    data: {
      title: '在這裡輸入您的建案標題',
      subtitle: '精心打造，讓每一個家都成為夢想的實現。',
      backgroundImage: PLACEHOLDER_IMG,
      ctaLabel: '立即預約',
      ctaHref: '#contact',
    },
  },
  features: {
    module_type: 'features',
    order: 1,
    data: {
      heading: '建案三大特色',
      feature1Icon: '🏠',
      feature1Title: '優質建材',
      feature1Description: '嚴選頂級建材，每一磚一瓦皆經過嚴格把關。',
      feature2Icon: '📍',
      feature2Title: '絕佳地點',
      feature2Description: '鄰近捷運站，生活機能完善，交通四通八達。',
      feature3Icon: '🌿',
      feature3Title: '綠化環境',
      feature3Description: '大面積綠化景觀，讓您的生活更貼近自然。',
    },
  },
  contact_form: {
    module_type: 'contact_form',
    order: 1,
    data: {
      heading: '預約參觀',
      buttonLabel: '送出預約',
      formActionId: '',
      recaptchaEnabled: false,
      recaptchaSiteKey: '',
      fields: [
        { name: 'contact_name',  widget: 'text', label: '姓名', required: true,  placeholder: '請輸入您的姓名',    options: [] },
        { name: 'contact_phone', widget: 'tel',  label: '電話', required: true,  placeholder: '請輸入您的聯絡電話', options: [] },
      ],
    },
  },
}

// ── SJS 主題積木預設資料（舊版，保留向下相容）────────────────────────────────

/** @deprecated 仍在 Registry，不出現在新增選單 */
export const SJS_MODULE_DEFAULTS: Record<string, ModuleDefault> = {
  sjs_banner: {
    module_type: 'sjs_banner',
    order: 1,
    data: {
      backgroundImage: PLACEHOLDER_IMG,
      logoImage: '',
      propertyName: '森鉅旭',
      brandName: '森鉅建築 TED新創品牌',
      tagline: '@林口 遇見更好的自己',
      ctaLabel: '立即預約',
      ctaHref: '#contact',
    },
  },
  sjs_navbar: {
    module_type: 'sjs_navbar',
    order: 1,
    data: {
      logoImage: '',
      logoAlt: '森鉅旭',
      phoneNumber: '02-2609-1616',
      phonePath: 'tel:02-2609-1616',
      facebookUrl: 'https://www.facebook.com/',
      mapsUrl: 'https://maps.google.com/',
      bookingLink: '#contact',
    },
  },
  sjs_content_block: {
    module_type: 'sjs_content_block',
    order: 1,
    data: {
      sectionLabel: 'Facade',
      title: '質感白-引光邀風',
      description1: '水平斜面框體分割，獨特的立面設計語彙。',
      description2: '大面積開窗引入自然光線，讓光影成為最美的裝飾。',
      description3: '嚴選進口石材與金屬板材，打造不褪流行的建築美學。',
      mainImage: PLACEHOLDER_IMG,
      imageCaption: '3D外觀示意圖',
    },
  },
  sjs_gallery3: {
    module_type: 'sjs_gallery3',
    order: 1,
    data: {
      sectionLabel: 'Public',
      title: '蒔綠意-清新植感',
      description1: '門廳營造藝文風格，以植栽點綴生活溫度。',
      description2: '多功能休憩空間，讓鄰里關係自然而然地滋長。',
      description3: '',
      image1: PLACEHOLDER_IMG,
      image2: '',
      image3: '',
      imageCaption: '3D公設示意圖',
    },
  },
  sjs_property_info: {
    module_type: 'sjs_property_info',
    order: 1,
    data: {
      phone: '02-2609-1616',
      receptionAddress: '新北市林口區忠孝路7號',
      projectLocation: '新北市林口區南勢一街',
      investorCompany: '森鉅建設股份有限公司',
      coInvestorCompany: '聯合安豐股份有限公司',
      marketingCompany: '橄欖樹廣告行銷有限公司',
      agentName: '請填入經紀人姓名',
      agentLicense: '',
      permitNumber: '請填入建照號碼',
      mapsEmbedUrl: '',
      copyrightText: 'Copyright © 森鉅旭 Inc.',
    },
  },
}

// ── v2 主力積木預設資料（Registry v2 命名，出現在新增選單）──────────────────

export const SPECIAL_MODULE_DEFAULTS: Record<string, ModuleDefault> = {
  // ── 已廢棄（Registry-only，不開放新建）────────────────────────────────────
  // sjs_text_image     → 升級為 content_block
  // sjs_image_carousel → 功能已整合至 content_block
  // sjs_sky_map        → 升級為 aerial_view
  // sjs_text_image_section → 改名為 content_block
  // ─────────────────────────────────────────────────────────────────────────

  // ── 房地產導覽列 ─────────────────────────────────────────────────────────
  re_navbar: {
    module_type: 're_navbar',
    order: 1,
    data: {
      logoImage: '',
      // logoAlt omitted → undefined → normalizeReNavbar ?? falls back to siteInfo.projectName
      // phoneNumber omitted → undefined → normalizeReNavbar ?? falls back to siteInfo.phone
      phonePath: '',
      facebookUrl: 'https://www.facebook.com/',
      mapsUrl: '',         // '' → || falls back to siteInfo.mapLink
      bookingLink: '',     // '' → || falls back to #${siteInfo.formAnchorId}
    },
  },

  // ── 主視覺 Banner ────────────────────────────────────────────────────────
  hero_banner: {
    module_type: 'hero_banner',
    order: 1,
    data: {
      backgroundImage: PLACEHOLDER_IMG,
      logoImage: '',
      propertyName: '建案名稱',
      brandName: '品牌名稱',
      tagline: '在此填入標語',
      ctaLabel: '立即預約',
      ctaHref: '#contact',
    },
  },

  // ── 圖文區塊（輪播 + 燈箱）──────────────────────────────────────────────
  content_block: {
    module_type: 'content_block',
    order: 1,
    data: {
      sectionLabel: 'Feature',
      title: '在此填入區塊標題',
      subtitle: '',
      description: '在此填入說明文字，描述建案的核心賣點或特色。支援換行顯示。',
      images: [
        { url: PLACEHOLDER_IMG, caption: '3D示意圖' },
      ],
      imagePosition: 'left',
      backgroundColor: '#ffffff',
    },
  },

  // ── 三格圖片展示 ─────────────────────────────────────────────────────────
  image_gallery: {
    module_type: 'image_gallery',
    order: 1,
    data: {
      sectionLabel: 'Gallery',
      title: '在此填入區塊標題',
      description1: '在此填入說明文字。',
      description2: '',
      description3: '',
      image1: PLACEHOLDER_IMG,
      image2: '',
      image3: '',
      imageCaption: '3D示意圖',
    },
  },

  // ── 案件資訊表 + Google Maps ─────────────────────────────────────────────
  property_info: {
    module_type: 'property_info',
    order: 1,
    data: {
      phone: '',                 // '' → || falls back to siteInfo.phone
      receptionAddress: '',      // '' → || falls back to siteInfo.receptionAddress
      projectLocation: '請填入基地位置',
      investorCompany: '請填入投資公司',
      coInvestorCompany: '',
      marketingCompany: '請填入行銷公司',
      agentName: '請填入經紀人姓名',
      agentLicense: '',
      permitNumber: '請填入建照號碼',
      mapsEmbedUrl: '',
      copyrightText: '',         // '' → || falls back to siteInfo.copyrightText
    },
  },

  map_section: {
    module_type: 'map_section',
    order: 1,
    data: {
      title: '地圖位置',
      address: '請填入接待中心地址',
      mapLink: 'https://maps.google.com/',
      embedUrl: '',
      heightMode: 'md',
      customHeightPx: 480,
    },
  },

  footer_bar: {
    module_type: 'footer_bar',
    order: 1,
    data: {
      brandName: '',     // '' → || falls back to siteInfo.brandName
      brandUrl: '',      // '' → || falls back to siteInfo.brandUrl
      copyrightText: '',
      socialLinks: [],
    },
  },

  // ── 空拍精準定位地圖 ─────────────────────────────────────────────────────
  aerial_view: {
    module_type: 'aerial_view',
    order: 1,
    data: {
      sectionLabel: 'Location',
      title: '地理位置',
      mapImageUrl: skyMapImage,
      projectAnchorX: 67,
      projectAnchorY: 65.7,
      disclaimer: '空拍示意，實際依現況為準',
      mobileHeight: '560',
      backgroundColor: '#3f90e4',
    },
  },

  // ── 影片區塊 ─────────────────────────────────────────────────────────────
  video_section: {
    module_type: 'video_section',
    order: 1,
    data: {
      videoUrl: '',
      posterUrl: '',
      autoPlay: true,
      muted: true,
    },
  },

  // ── 聯絡導流入口 ─────────────────────────────────────────────────────────
  contact_cta: {
    module_type: 'contact_cta',
    order: 1,
    data: {
      heading: '聯絡導流入口',
      description: '從表單、電話或地圖開始，快速前往你需要的聯絡方式。',
      items: [],
    },
  },
}

// ── 標籤定義（出現在新增區塊選單）────────────────────────────────────────────

export const MODULE_LABELS: Record<string, { label: string; icon: string }> = {
  // 通用積木
  features:     { label: '三欄特色區塊', icon: '⭐' },
  contact_form: { label: '預約聯絡表單', icon: '📝' },
  contact_cta:  { label: '聯絡導流入口', icon: '📞' },
  // v2 主力積木
  re_navbar:     { label: '房地產導覽列', icon: '🔝' },
  hero_banner:   { label: '主視覺 Banner', icon: '🏙' },
  content_block: { label: '圖文區塊（輪播＋燈箱）', icon: '🖼' },
  image_gallery: { label: '三格圖片展示', icon: '🎨' },
  property_info: { label: '案件資訊表', icon: '📋' },
  map_section:   { label: '地圖區塊', icon: '🗺' },
  footer_bar:    { label: '頁尾資訊列', icon: '🔗' },
  aerial_view:   { label: '空拍精準定位地圖', icon: '📍' },
  video_section: { label: '影片區塊', icon: '🎬' },
}
