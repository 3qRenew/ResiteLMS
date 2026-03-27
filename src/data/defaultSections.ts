import type { Section } from '../types'
import { SPECIAL_MODULE_DEFAULTS } from './moduleDefaults'

/** 新建專案時使用的預設 sections */
export const defaultSections: Section[] = [
  {
    id: 'section-navbar',
    page_id: '',
    order: 1,
    modules: [
      {
        id: 'module-navbar',
        section_id: 'section-navbar',
        module_type: 're_navbar',
        order: 1,
        data: { ...SPECIAL_MODULE_DEFAULTS.re_navbar.data },
      },
    ],
  },
  {
    id: 'section-hero',
    page_id: '',
    order: 2,
    modules: [
      {
        id: 'module-hero',
        section_id: 'section-hero',
        module_type: 'hero_standard',
        order: 1,
        data: {
          title: '在這裡輸入建案標題',
          subtitle: '在這裡輸入建案副標題，吸引潛在買家的注意。',
          backgroundImage:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80',
          ctaLabel: '立即預約',
          ctaHref: '#contact',
        },
      },
    ],
  },
  {
    id: 'section-aerial-view',
    page_id: '',
    order: 3,
    modules: [
      {
        id: 'module-aerial-view',
        section_id: 'section-aerial-view',
        module_type: 'aerial_view',
        order: 1,
        data: { ...SPECIAL_MODULE_DEFAULTS.aerial_view.data },
      },
    ],
  },
  {
    id: 'section-contact',
    page_id: '',
    order: 4,
    modules: [
      {
        id: 'module-contact',
        section_id: 'section-contact',
        module_type: 'contact_form',
        order: 1,
        data: {
          heading: '預約參觀',
          buttonLabel: '送出預約',
        },
      },
    ],
  },
]
