export type LuminosityLevel = 'low' | 'medium' | 'high'

export type AssociationType = 'semantic' | 'logical' | 'complementary' | 'conflict'

export interface Insight {
  id: string
  content: string
  rawContent?: string
  summary?: string
  tags: string[]
  luminosity: number
  createdAt: number
  updatedAt: number
  lastWokenAt?: number
  wakeCount: number
  interactionCount: number
  associations: Association[]
  versions: Version[]
}

export interface Association {
  insightId: string
  type: AssociationType
  strength: number
}

export interface Version {
  id: string
  content: string
  createdAt: number
}

export interface DailyBlindBox {
  insight: Insight
  relatedInsights: Insight[]
  type: 'basic' | 'highlight' | 'combo'
}

export interface UserStats {
  totalInsights: number
  totalPoints: number
  todayCount: number
  streak: number
  topTags: string[]
}

export interface NebulaNode {
  id: string
  x: number
  y: number
  luminosity: number
  size: number
  color: string
}

export interface NebulaLink {
  source: string
  target: string
  type: AssociationType
  strength: number
}
