export interface AvatarPreset {
  id: string
  name: string
  emoji: string
  role: string
  gradient: string
  border: string
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'cyber-hacker',
    name: 'Cyberpunk Hacker',
    emoji: '⚡',
    role: 'Fullstack & Systems',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
    border: '#6366f1',
  },
  {
    id: 'ai-researcher',
    name: 'AI & ML Researcher',
    emoji: '🧠',
    role: 'LLMs & Deep Learning',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
    border: '#38bdf8',
  },
  {
    id: 'quantum-architect',
    name: 'Quantum Architect',
    emoji: '⚛️',
    role: 'Distributed Cloud',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #db2777 100%)',
    border: '#a855f7',
  },
  {
    id: 'os-wizard',
    name: 'Open Source Wizard',
    emoji: '🧙‍♂️',
    role: 'Kernel & Tooling',
    gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 50%, #0284c7 100%)',
    border: '#10b981',
  },
  {
    id: 'quant-trader',
    name: 'Quant Algorithmic Trader',
    emoji: '📈',
    role: 'High-Frequency FinTech',
    gradient: 'linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%)',
    border: '#f59e0b',
  },
  {
    id: 'ui-alchemist',
    name: 'UI/UX Alchemist',
    emoji: '🎨',
    role: 'Design Engineering',
    gradient: 'linear-gradient(135deg, #db2777 0%, #e11d48 50%, #f43f5e 100%)',
    border: '#fb7185',
  },
  {
    id: 'cyber-sentinel',
    name: 'Cyber Sentinel',
    emoji: '🛡️',
    role: 'Security & Forensics',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 50%, #1e1b4b 100%)',
    border: '#38bdf8',
  },
  {
    id: 'astro-engineer',
    name: 'Astro Engineer',
    emoji: '🚀',
    role: 'Aerospace & Robotics',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #eab308 100%)',
    border: '#f97316',
  },
  {
    id: 'unicorn-founder',
    name: 'Unicorn Founder',
    emoji: '🦄',
    role: 'Zero to One Builder',
    gradient: 'linear-gradient(135deg, #c026d3 0%, #9333ea 50%, #4f46e5 100%)',
    border: '#e879f9',
  },
  {
    id: 'cloud-architect',
    name: 'Cloud Infrastructure Architect',
    emoji: '🌐',
    role: 'Kubernetes & Multi-Cloud',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0d9488 50%, #059669 100%)',
    border: '#60a5fa',
  },
  {
    id: 'comp-coder',
    name: 'Competitive Coder',
    emoji: '🏆',
    role: 'Algorithms & Olympiad',
    gradient: 'linear-gradient(135deg, #ca8a04 0%, #ea580c 50%, #e11d48 100%)',
    border: '#facc15',
  },
  {
    id: 'robotics-maker',
    name: 'Robotics Pioneer',
    emoji: '🤖',
    role: 'Hardware & Embedded IoT',
    gradient: 'linear-gradient(135deg, #059669 0%, #2563eb 50%, #7c3aed 100%)',
    border: '#34d399',
  },
  {
    id: 'bio-scientist',
    name: 'BioTech Computational Scientist',
    emoji: '🧬',
    role: 'Genomics & Discovery',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #059669 50%, #16a34a 100%)',
    border: '#2dd4bf',
  },
  {
    id: 'blockchain-core',
    name: 'Web3 Core Developer',
    emoji: '💎',
    role: 'Solidity & ZK-Proofs',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 50%, #06b6d4 100%)',
    border: '#818cf8',
  },
  {
    id: 'deans-scholar',
    name: "Dean's List Scholar",
    emoji: '🎓',
    role: 'Academic Research Fellow',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #0284c7 100%)',
    border: '#c084fc',
  },
  {
    id: 'terminal-ninja',
    name: 'Terminal Ninja',
    emoji: '🥷',
    role: 'Low-Level Rust & C',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    border: '#94a3b8',
  },
  {
    id: 'product-maverick',
    name: 'Product Maverick',
    emoji: '💡',
    role: 'Product Strategy & Growth',
    gradient: 'linear-gradient(135deg, #e11d48 0%, #f59e0b 50%, #10b981 100%)',
    border: '#f43f5e',
  },
  {
    id: 'super-starlight',
    name: 'Supernova Prodigy',
    emoji: '✨',
    role: 'All-Round Tech Leader',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%)',
    border: '#f472b6',
  },
]

export interface ScoreboardTier {
  level: number
  title: string
  badge: string
  color: string
  minXP: number
  maxXP: number
}

export const TIERS: ScoreboardTier[] = [
  { level: 1, title: 'Novice Explorer', badge: '🥉', color: '#94a3b8', minXP: 0, maxXP: 99 },
  { level: 2, title: 'Ambitious Contender', badge: '🥈', color: '#38bdf8', minXP: 100, maxXP: 249 },
  { level: 3, title: 'Verified Prodigy', badge: '🥇', color: '#818cf8', minXP: 250, maxXP: 499 },
  { level: 4, title: 'Elite Fellow', badge: '💎', color: '#34d399', minXP: 500, maxXP: 999 },
  { level: 5, title: 'Grandmaster Builder', badge: '👑', color: '#fbbf24', minXP: 1000, maxXP: 5000 },
]

export interface ScoreboardStats {
  appliedCount: number
  savedCount: number
  skillsCount: number
  profileCompletionPct: number
}

export interface ScoreboardResult {
  totalXP: number
  currentTier: ScoreboardTier
  nextTier: ScoreboardTier | null
  progressToNext: number
  breakdown: {
    appliedXP: number
    savedXP: number
    skillsXP: number
    profileXP: number
  }
}

export function calculateScoreboard(stats: ScoreboardStats): ScoreboardResult {
  const appliedXP = (stats.appliedCount || 0) * 50 // +50 per direct apply
  const savedXP = (stats.savedCount || 0) * 15 // +15 per bookmark
  const skillsXP = (stats.skillsCount || 0) * 10 // +10 per verified skill
  const profileXP = Math.round(stats.profileCompletionPct || 0) // Up to +100 for complete profile

  const totalXP = appliedXP + savedXP + skillsXP + profileXP

  let currentTier = TIERS[0]
  let nextTier: ScoreboardTier | null = TIERS[1]

  for (let i = 0; i < TIERS.length; i++) {
    if (totalXP >= TIERS[i].minXP) {
      currentTier = TIERS[i]
      nextTier = TIERS[i + 1] || null
    }
  }

  let progressToNext = 100
  if (nextTier) {
    const range = nextTier.minXP - currentTier.minXP
    const progressInCurrent = totalXP - currentTier.minXP
    progressToNext = Math.min(100, Math.max(0, Math.round((progressInCurrent / range) * 100)))
  }

  return {
    totalXP,
    currentTier,
    nextTier,
    progressToNext,
    breakdown: {
      appliedXP,
      savedXP,
      skillsXP,
      profileXP,
    },
  }
}
