import type { Section } from '../types'

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
        module_type: 'navbar',
        order: 1,
        data: {
          logo: '新專案',
          links: [
            { label: '建案特色', href: '#features' },
            { label: '地理位置', href: '#location' },
            { label: '立即預約', href: '#contact' },
          ],
        },
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
    id: 'section-contact',
    page_id: '',
    order: 3,
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
