export interface SiteSharedSocialLink {
  label: string
  href: string
}

export interface SiteSharedInfo {
  projectName: string
  projectLogoUrl: string
  phone: string
  receptionAddress: string
  mapLink: string
  mapEmbedUrl: string
  formAnchorId: string
  brandName: string
  brandUrl: string
  copyrightText: string
  socialLinks: SiteSharedSocialLink[]
}
