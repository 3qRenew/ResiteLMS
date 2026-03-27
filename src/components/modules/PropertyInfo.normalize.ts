// Normalize — PropertyInfo (module_type: property_info)
// Pure function; no React / UI imports → safe for static import in MODULE_REGISTRY.

export interface PropertyInfoItem {
  label: string
  value: string
}

export interface PropertyInfoData {
  phone:             string
  receptionAddress:  string
  projectLocation:   string
  investorCompany:   string
  coInvestorCompany: string
  marketingCompany:  string
  agentName:         string
  agentLicense:      string
  permitNumber:      string
  mapsEmbedUrl:      string
  copyrightText:     string
  items:             PropertyInfoItem[]
  columns:           1 | 2
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function normalizeColumns(value: unknown): 1 | 2 {
  return value === 1 ? 1 : 2
}

function normalizeItems(raw: unknown): PropertyInfoItem[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      label: asString(item.label).trim(),
      value: asString(item.value).trim(),
    }))
    .filter((item) => item.label && item.value)
}

function buildFallbackItems(data: Omit<PropertyInfoData, 'items' | 'columns'>): PropertyInfoItem[] {
  return [
    { label: '投資興建', value: [data.investorCompany, data.coInvestorCompany].filter(Boolean).join('\n') },
    { label: '企劃銷售', value: data.marketingCompany },
    { label: '接待會館', value: data.receptionAddress },
    { label: '基地位置', value: data.projectLocation },
    { label: '貴賓專線', value: data.phone },
    { label: '建照號碼', value: data.permitNumber },
    { label: '經紀人',   value: data.agentName ? `${data.agentName} ${data.agentLicense || ''}`.trim() : '' },
  ].filter((item) => item.label && item.value)
}

export function normalizePropertyInfo(raw: Record<string, unknown>): PropertyInfoData {
  const baseData = {
    phone:             asString(raw.phone),
    receptionAddress:  asString(raw.receptionAddress),
    projectLocation:   asString(raw.projectLocation),
    investorCompany:   asString(raw.investorCompany),
    coInvestorCompany: asString(raw.coInvestorCompany),
    marketingCompany:  asString(raw.marketingCompany),
    agentName:         asString(raw.agentName),
    agentLicense:      asString(raw.agentLicense),
    permitNumber:      asString(raw.permitNumber),
    mapsEmbedUrl:      asString(raw.mapsEmbedUrl),
    copyrightText:     asString(raw.copyrightText),
  }

  const items = normalizeItems(raw.items)

  return {
    ...baseData,
    items: items.length > 0 ? items : buildFallbackItems(baseData),
    columns: normalizeColumns(raw.columns),
  }
}
