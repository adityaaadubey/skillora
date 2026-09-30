'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Sparkles,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Trophy,
  Code2,
  Briefcase,
  GraduationCap,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  X,
  Share2,
  Calendar,
  Lock,
} from 'lucide-react'

interface Squad {
  id: string
  title: string
  eventName: string
  category: 'hackathon' | 'opensource' | 'competition' | 'startup'
  leaderName: string
  leaderCollege: string
  rolesNeeded: string[]
  skillsRequired: string[]
  currentMembers: number
  maxMembers: number
  description: string
  contactType: 'whatsapp' | 'discord' | 'linkedin' | 'email'
  contactValue: string
  isVerified?: boolean
  createdAt: string
}

const DEFAULT_SQUADS: Squad[] = [
  {
    id: 'squad-1',
    title: 'Autonomous Drone Navigation & Disaster Mapping',
    eventName: 'Smart India Hackathon 2026',
    category: 'hackathon',
    leaderName: 'Aditya Dubey',
    leaderCollege: 'Computer Engineering',
    rolesNeeded: ['AI/Computer Vision Engineer', 'Embedded IoT Builder'],
    skillsRequired: ['PyTorch', 'OpenCV', 'ROS', 'Python', 'C++'],
    currentMembers: 3,
    maxMembers: 5,
    description: 'Developing an edge-AI computer vision system for real-time flood & landslide survivor tracking without cellular infrastructure.',
    contactType: 'whatsapp',
    contactValue: 'https://chat.whatsapp.com/sample-squad-invite',
    isVerified: true,
    createdAt: '1 day ago',
  },
  {
    id: 'squad-2',
    title: 'Decentralized Micro-Scholarships & Proof-of-Skill',
    eventName: 'ETHIndia Global Hackathon',
    category: 'hackathon',
    leaderName: 'Rhea Sen',
    leaderCollege: 'IIT Bombay',
    rolesNeeded: ['Solidity / Smart Contract Dev', 'UI/UX Designer'],
    skillsRequired: ['Solidity', 'Foundry', 'Next.js', 'Figma'],
    currentMembers: 2,
    maxMembers: 4,
    description: 'Creating zero-knowledge skill verification that allows Web3 protocols to auto-fund high-performing students without bureaucratic friction.',
    contactType: 'discord',
    contactValue: 'https://discord.gg/skillora-hackers',
    isVerified: true,
    createdAt: '2 days ago',
  },
  {
    id: 'squad-3',
    title: 'Distributed Vector Engine for Medical Imaging',
    eventName: 'Google Summer of Code / Open Source',
    category: 'opensource',
    leaderName: 'Tanmay Saxena',
    leaderCollege: 'BITS Pilani',
    rolesNeeded: ['Backend Rust Developer', 'Data Infrastructure'],
    skillsRequired: ['Rust', 'gRPC', 'Distributed Systems', 'PostgreSQL'],
    currentMembers: 2,
    maxMembers: 3,
    description: 'Contributing a SIMD-accelerated similarity search crate for high-resolution DICOM CT scans to mainstream open-source health registries.',
    contactType: 'linkedin',
    contactValue: 'https://linkedin.com/in/adityaomprakashdubey',
    isVerified: false,
    createdAt: '3 days ago',
  },
  {
    id: 'squad-4',
    title: 'High-Frequency FinTech Trading Algorithm',
    eventName: 'National Quantitative Finance Challenge',
    category: 'competition',
    leaderName: 'Kavya Murthy',
    leaderCollege: 'Delhi Technological University',
    rolesNeeded: ['Quant Analyst', 'Python Data Engineer'],
    skillsRequired: ['NumPy', 'Pandas', 'Backtesting', 'Statistical Arbitrage'],
    currentMembers: 1,
    maxMembers: 3,
    description: 'Backtesting statistical mean-reversion algorithms using real-time NSE orderbook ticks with zero slippage execution models.',
    contactType: 'email',
    contactValue: 'kavya.finquant@gmail.com',
    isVerified: true,
    createdAt: '4 days ago',
  },
  {
    id: 'squad-5',
    title: 'AI Agent for Campus Peer Tutoring & Notes Sync',
    eventName: 'Student Startup Incubator Demo Day',
    category: 'startup',
    leaderName: 'Arjun Mehta',
    leaderCollege: 'IIIT Hyderabad',
    rolesNeeded: ['Fullstack Engineer (Next.js)', 'Growth Marketer'],
    skillsRequired: ['Next.js', 'Tailwind', 'Supabase', 'LangChain'],
    currentMembers: 2,
    maxMembers: 4,
    description: 'Early-stage prototype already used by 450+ campus students to convert professor slides into interactive flashcards and quizzes.',
    contactType: 'whatsapp',
    contactValue: 'https://chat.whatsapp.com/sample-squad-invite',
    isVerified: true,
    createdAt: '5 days ago',
  },
]

export default function SquadsCommunityPage() {
  const [squads, setSquads] = useState<Squad[]>(DEFAULT_SQUADS)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [connectSquad, setConnectSquad] = useState<Squad | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  // Load custom user squads from localStorage if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem('skillora-user-squads')
      if (stored) {
        const custom = JSON.parse(stored)
        setSquads([...custom, ...DEFAULT_SQUADS])
      }
    } catch {}
  }, [])

  // Filter logic
  const filteredSquads = squads.filter((squad) => {
    const matchesCategory = selectedCategory === 'all' || squad.category === selectedCategory
    const matchesRole =
      selectedRole === 'all' ||
      squad.rolesNeeded.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()))

    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      squad.title.toLowerCase().includes(q) ||
      squad.eventName.toLowerCase().includes(q) ||
      squad.skillsRequired.some((s) => s.toLowerCase().includes(q)) ||
      squad.rolesNeeded.some((r) => r.toLowerCase().includes(q))

    return matchesCategory && matchesRole && matchesSearch
  })

  const handleCreateSquad = (newSquad: Squad) => {
    const updated = [newSquad, ...squads]
    setSquads(updated)
    try {
      const stored = localStorage.getItem('skillora-user-squads')
      const custom = stored ? JSON.parse(stored) : []
      localStorage.setItem('skillora-user-squads', JSON.stringify([newSquad, ...custom]))
    } catch {}
    setShowCreateModal(false)
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '6rem' }}>
      {/* Hero Section */}
      <div
        className="glass-panel"
        style={{
          padding: '2.5rem 2rem',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.2)',
            color: 'var(--accent-indigo)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} />
          <span>Skillora Squads • Community Teammate Hub</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            marginBottom: '0.75rem',
            maxWidth: '750px',
            lineHeight: 1.2,
          }}
        >
          Find Complementary Builders for Hackathons & Projects
        </h1>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '620px',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
          }}
        >
          Never build alone again. Connect with verified student developers, designers, and AI researchers across top colleges to form winning hackathon squads.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <PlusCircle size={18} />
            <span>Post a Squad Request</span>
          </button>

          <Link
            href="/opportunities?category=hackathon"
            className="btn btn-secondary"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <Trophy size={16} color="#fbbf24" />
            <span>Explore Active Hackathons</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by hackathon, project idea, or skill (e.g. Next.js, PyTorch, Rust)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                fontSize: '0.875rem',
                height: '44px',
              }}
            />
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="input"
            style={{ width: '180px', height: '44px', fontSize: '0.875rem' }}
          >
            <option value="all">All Roles Needed</option>
            <option value="AI">AI / ML</option>
            <option value="Frontend">Frontend / UI</option>
            <option value="Backend">Backend / Systems</option>
            <option value="Designer">UI/UX Design</option>
            <option value="Solidity">Web3 / Blockchain</option>
            <option value="Data">Data & Quant</option>
          </select>
        </div>

        {/* Category Pill Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'All Squads', value: 'all' },
            { label: '🏆 Hackathons', value: 'hackathon' },
            { label: '⚡ Open Source', value: 'opensource' },
            { label: '🎯 Competitions', value: 'competition' },
            { label: '🚀 Startup Projects', value: 'startup' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedCategory === cat.value ? 'var(--accent-indigo)' : 'var(--border-subtle)',
                background: selectedCategory === cat.value ? 'var(--accent-indigo-subtle)' : 'var(--bg-surface)',
                color: selectedCategory === cat.value ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Squad Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredSquads.length > 0 ? (
          filteredSquads.map((squad) => {
            const spotsRemaining = squad.maxMembers - squad.currentMembers
            return (
              <div
                key={squad.id}
                className="glass-panel"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                }}
              >
                <div>
                  {/* Card Header: Target Event & Member Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--accent-indigo)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {squad.eventName}
                    </span>

                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: spotsRemaining > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: spotsRemaining > 0 ? '#6ee7b7' : '#fca5a5',
                        border: spotsRemaining > 0 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      {squad.currentMembers}/{squad.maxMembers} Members ({spotsRemaining} spot{spotsRemaining === 1 ? '' : 's'} left)
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      lineHeight: 1.35,
                      marginBottom: '0.5rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {squad.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {squad.description}
                  </p>

                  {/* Roles Needed */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.375rem' }}>
                      Looking For:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {squad.rolesNeeded.map((role) => (
                        <span
                          key={role}
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: 'rgba(245, 158, 11, 0.12)',
                            color: '#fcd34d',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          + {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.375rem' }}>
                      Tech Stack:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {squad.skillsRequired.map((skill) => (
                        <span
                          key={skill}
                          style={{
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            background: 'var(--bg-surface)',
                            color: 'var(--text-secondary)',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Leader Info & Connect Action */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>{squad.leaderName}</span>
                      {squad.isVerified && (
                        <span title="Verified Student" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <ShieldCheck size={14} color="#10b981" />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {squad.leaderCollege}
                    </div>
                  </div>

                  <button
                    onClick={() => setConnectSquad(squad)}
                    className="btn btn-primary"
                    style={{
                      padding: '0.45rem 1rem',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <span>Join Squad</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div
            className="glass-panel"
            style={{
              gridColumn: '1 / -1',
              padding: '3rem 2rem',
              textAlign: 'center',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <Users size={36} color="var(--accent-indigo)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No squads found matching your filters</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
              Be the first to create a squad for this domain or broaden your search criteria.
            </p>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create This Squad</span>
            </button>
          </div>
        )}
      </div>

      {/* Connect / Join Squad Modal */}
      {connectSquad && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(5, 7, 13, 0.8)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => setConnectSquad(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-indigo)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <Users size={28} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.375rem' }}>
              Join {connectSquad.leaderName}'s Squad
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Project: <strong style={{ color: 'var(--text-primary)' }}>{connectSquad.title}</strong>
            </p>

            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                Preferred Channel ({connectSquad.contactType.toUpperCase()})
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-all', fontWeight: 600 }}>
                {connectSquad.contactValue}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <a
                href={
                  connectSquad.contactType === 'email'
                    ? `mailto:${connectSquad.contactValue}?subject=Joining your Skillora Squad: ${connectSquad.title}`
                    : connectSquad.contactValue
                }
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                <span>Connect with Squad Lead</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Create Squad Modal */}
      {showCreateModal && (
        <CreateSquadModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSquad}
        />
      )}
    </div>
  )
}

function CreateSquadModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (squad: Squad) => void
}) {
  const [title, setTitle] = useState('')
  const [eventName, setEventName] = useState('')
  const [category, setCategory] = useState<'hackathon' | 'opensource' | 'competition' | 'startup'>('hackathon')
  const [leaderName, setLeaderName] = useState('')
  const [leaderCollege, setLeaderCollege] = useState('')
  const [rolesNeededInput, setRolesNeededInput] = useState('')
  const [skillsRequiredInput, setSkillsRequiredInput] = useState('')
  const [maxMembers, setMaxMembers] = useState(4)
  const [currentMembers, setCurrentMembers] = useState(1)
  const [description, setDescription] = useState('')
  const [contactType, setContactType] = useState<'whatsapp' | 'discord' | 'linkedin' | 'email'>('whatsapp')
  const [contactValue, setContactValue] = useState('')

  // Prefill leader name from profile if available
  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          if (data.profile.full_name) setLeaderName(data.profile.full_name)
          if (data.profile.college) setLeaderCollege(data.profile.college)
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newSquad: Squad = {
      id: `squad-${Date.now()}`,
      title: title.trim(),
      eventName: eventName.trim() || 'General Project',
      category,
      leaderName: leaderName.trim() || 'Student Builder',
      leaderCollege: leaderCollege.trim() || 'Engineering College',
      rolesNeeded: rolesNeededInput.split(',').map((r) => r.trim()).filter(Boolean),
      skillsRequired: skillsRequiredInput.split(',').map((s) => s.trim()).filter(Boolean),
      currentMembers: Number(currentMembers),
      maxMembers: Number(maxMembers),
      description: description.trim(),
      contactType,
      contactValue: contactValue.trim(),
      isVerified: true,
      createdAt: 'Just now',
    }
    onCreate(newSquad)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(5, 7, 13, 0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-cyan))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              Create a Skillora Squad
            </h2>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              Broadcast your hackathon or project idea to thousands of student builders.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Project / Idea Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI-Powered Autonomous Health Diagnostic Agent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Target Event / Hackathon Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart India Hackathon 2026 / ETHIndia"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              >
                <option value="hackathon">Hackathon</option>
                <option value="opensource">Open Source</option>
                <option value="competition">Competition</option>
                <option value="startup">Startup Build</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="Aditya Dubey"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                College / Organization
              </label>
              <input
                type="text"
                placeholder="IIT / BITS / University"
                value={leaderCollege}
                onChange={(e) => setLeaderCollege(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Roles Needed (comma-separated) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Next.js Frontend Dev, PyTorch / ML Engineer, UI/UX Designer"
              value={rolesNeededInput}
              onChange={(e) => setRolesNeededInput(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Required Tech Stack (comma-separated) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TypeScript, React, Python, FastAPI, Docker"
              value={skillsRequiredInput}
              onChange={(e) => setSkillsRequiredInput(e.target.value)}
              className="input"
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Current Members
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={currentMembers}
                onChange={(e) => setCurrentMembers(Number(e.target.value))}
                className="input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Max Squad Size
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Project Brief & Description *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the problem you are solving, your current progress, and what makes your squad stand out..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Contact Channel
              </label>
              <select
                value={contactType}
                onChange={(e: any) => setContactType(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              >
                <option value="whatsapp">WhatsApp Group Link</option>
                <option value="discord">Discord Invite</option>
                <option value="linkedin">LinkedIn Profile</option>
                <option value="email">Email Address</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                Invite Link / Contact Address *
              </label>
              <input
                type="text"
                required
                placeholder="https://chat.whatsapp.com/... or your@email.com"
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={16} />
              <span>Publish Squad Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
