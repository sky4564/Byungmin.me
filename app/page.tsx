'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Code2, Briefcase, Mail, ExternalLink, ArrowRight, MessageCircle, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

declare global {
  interface Window {
    ChannelIO?: (...args: unknown[]) => void
    ChannelIOInitialized?: boolean
  }
}

type Language = 'ko' | 'en'
type BackgroundTheme = 'dark' | 'light'
type ProjectCard = {
  title: string
  description: string
  tags: string[]
  theme: string
  href?: string
}

const uiText = {
  ko: {
    nav: { home: '홈', projects: '프로젝트', experience: '경험', contact: '연락처' },
    hero: {
      subtitle: '풀스택 개발자',
      description:
        '자동화, 깔끔한 UX, 안정적인 백엔드 아키텍처를 바탕으로 실무형 웹 제품을 만듭니다. 내부 운영 도구부터 고객용 서비스까지 속도와 안정성에 집중합니다.',
      contact: '문의하기',
      projects: '프로젝트 보기',
      profileTitle: '시스템 프로필',
      profileDesc: '현재 프로젝트 중심 기술 스택',
      qualifiedTitle: '자격사항',
      qualifiedItem: '정보처리기사',
    },
    projects: {
      title: '프로젝트',
      hint: '좌우로 넘겨서 프로젝트를 확인해보세요.',
      details: '프로젝트 링크',
      comingSoon: '준비중',
    },
    experience: { title: '경험' },
    contact: {
      title: '연락하기',
      description: '협업, 프리랜스, 제품 컨설팅 관련 문의를 환영합니다.',
      channelTalk: '채널톡',
    },
  },
  en: {
    nav: { home: 'Home', projects: 'Projects', experience: 'Experience', contact: 'Contact' },
    hero: {
      subtitle: 'Full-Stack Developer',
      description:
        'I build practical web products with automation, clean UX, and reliable backend architecture. From internal operations tooling to customer-facing systems, I focus on speed and stability.',
      contact: 'Contact Me',
      projects: 'See Projects',
      profileTitle: 'SYSTEM PROFILE',
      profileDesc: 'Stack focus for current projects',
      qualifiedTitle: 'QUALIFIED',
      qualifiedItem: 'Engineer Information Processing',
    },
    projects: {
      title: 'Projects',
      hint: 'Swipe horizontally to explore projects.',
      details: 'Project Link',
      comingSoon: 'Coming Soon',
    },
    experience: { title: 'Experience' },
    contact: {
      title: 'Contact',
      description: 'Open for collaboration, freelance work, and product consulting.',
      channelTalk: 'ChannelTalk',
    },
  },
} as const

const projectCardsByLanguage: Record<Language, ProjectCard[]> = {
  ko: [
    {
      title: 'SK STOA',
      description: '쇼핑몰 유지보수와 기능 개선, 운영 이슈 대응을 수행한 커머스 운영 프로젝트입니다.',
      tags: ['Angular', 'JavaScript (ES6)'],
      href: 'https://www.skstoa.com/index',
      theme: 'from-cyan-950/60 to-zinc-900 border-cyan-700/50',
    },
    {
      title: 'NS 홈쇼핑 커뮤니티 (모바일)',
      description: '모바일 커뮤니티 페이지를 신규 구축하고 UI/UX 최적화를 진행한 프로젝트입니다.',
      tags: ['Vue', 'JavaScript', 'SCSS'],
      href: 'https://m.nsmall.com/store/atypical/home',
      theme: 'from-indigo-950/60 to-zinc-900 border-indigo-700/50',
    },
    {
      title: 'NHN_API COMMERCE',
      description: '샵바이 API 기반으로 상품/주문 플로우를 연동해 신규 쇼핑몰을 구축한 프로젝트입니다.',
      tags: ['Shopby API', 'JavaScript'],
      theme: 'from-teal-950/60 to-zinc-900 border-teal-700/50',
    },
    {
      title: '지니게임 신맞고 · 판다팡',
      description: 'KT에서 BTV로의 마이그레이션과 이벤트 화면 운영 자동화를 수행한 게임 서비스 프로젝트입니다.',
      tags: ['Vanilla JS', 'Canvas'],
      theme: 'from-fuchsia-950/60 to-zinc-900 border-fuchsia-700/50',
    },
    {
      title: '라이브 상담 RTC 프로젝트',
      description: '실시간 음성/화상 기능이 포함된 라이브 상담 앱을 구축한 RTC 프로젝트입니다.',
      tags: ['React', 'Agora SDK', 'RTC'],
      theme: 'from-emerald-950/70 to-zinc-900 border-emerald-700/60',
    },
    {
      title: '차렌터카 정보 시스템 (CIS)',
      description: '렌터카 견적, 예약, 차량 조회, 은행 API 연동까지 통합 관리하는 메인 프로젝트입니다.',
      tags: ['Next.js', 'TypeScript', 'Tailwind'],
      href: '/charentcar',
      theme: 'from-emerald-950/60 to-zinc-900 border-emerald-700/50',
    },
    {
      title: '공항렌트24 웹페이지',
      description: '24시간 인천공항 픽업 중심의 렌터카 서비스 소개 랜딩 페이지입니다.',
      tags: ['React', 'TypeScript', 'Tailwind'],
      href: '/projects/airportrent24',
      theme: 'from-sky-950/60 to-zinc-900 border-sky-700/50',
    },
    {
      title: '워드프레스 기반 모금·결제·보안 통합 프로젝트',
      description:
        'WooCommerce, Wordfence, Gravity Forms, Elementor를 활용해 모금 랜딩 구조부터 결제/검증/보안 운영 정책까지 1인으로 설계·개발·배포한 통합 프로젝트입니다. 로컬 Ubuntu VM에서 Nginx·PHP-FPM·MySQL로 WordPress를 구동하며 스택을 검증한 경험을 바탕으로 진행했습니다.',
      tags: ['WooCommerce', 'Wordfence', 'Gravity Forms', 'Elementor'],
      href: 'https://donation.softbuilder.kr/',
      theme: 'from-lime-950/60 to-zinc-900 border-lime-700/50',
    },
  ],
  en: [
    {
      title: 'SK STOA',
      description: 'Commerce operations project focused on maintenance, feature enhancements, and live issue response.',
      tags: ['Angular', 'JavaScript (ES6)'],
      href: 'https://www.skstoa.com/index',
      theme: 'from-cyan-950/60 to-zinc-900 border-cyan-700/50',
    },
    {
      title: 'NS Home Shopping Community (Mobile)',
      description: 'Built new mobile community pages and optimized the UI/UX experience.',
      tags: ['Vue', 'JavaScript', 'SCSS'],
      href: 'https://m.nsmall.com/store/atypical/home',
      theme: 'from-indigo-950/60 to-zinc-900 border-indigo-700/50',
    },
    {
      title: 'NHN_API COMMERCE',
      description: 'Built a new storefront with Shopby API integration across product and order flows.',
      tags: ['Shopby API', 'JavaScript'],
      theme: 'from-teal-950/60 to-zinc-900 border-teal-700/50',
    },
    {
      title: 'Genie Game Sin Matgo · Panda Pang',
      description: 'Game service project covering KT → BTV migration and event operations automation.',
      tags: ['Vanilla JS', 'Canvas'],
      theme: 'from-fuchsia-950/60 to-zinc-900 border-fuchsia-700/50',
    },
    {
      title: 'Live Consultation RTC Project',
      description: 'Delivered a live consultation app with real-time voice and video capabilities.',
      tags: ['React', 'Agora SDK', 'RTC'],
      theme: 'from-emerald-950/70 to-zinc-900 border-emerald-700/60',
    },
    {
      title: 'Charentcar Information System (CIS)',
      description: 'Core platform integrating quotes, reservations, vehicle lookup, and bank API workflows.',
      tags: ['Next.js', 'TypeScript', 'Tailwind'],
      href: '/charentcar',
      theme: 'from-emerald-950/60 to-zinc-900 border-emerald-700/50',
    },
    {
      title: 'AirportRent24 Website',
      description: 'Landing page focused on 24-hour Incheon Airport pickup rental service.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      href: '/projects/airportrent24',
      theme: 'from-sky-950/60 to-zinc-900 border-sky-700/50',
    },
    {
      title: 'WordPress-Based Donation, Payment, and Security Integration Project',
      description:
        'Single-handedly planned, built, and deployed an integrated donation platform using WooCommerce, Wordfence, Gravity Forms, and Elementor, covering campaign landing structure, checkout validation, and production security operations. Validated the hosting stack on a local Ubuntu VM with Nginx, PHP-FPM, MySQL, and WordPress.',
      tags: ['WooCommerce', 'Wordfence', 'Gravity Forms', 'Elementor'],
      theme: 'from-lime-950/60 to-zinc-900 border-lime-700/50',
      href: 'https://donation.softbuilder.kr/',
    },
  ],
}

const experienceByLanguage = {
  ko: [
    { title: '42서울 라피신 수료', period: '초기 경험', detail: '집중 몰입형 코딩 부트캠프(La Piscine) 과정을 수료하며 C 기반 문제 해결, 협업, 코드 리뷰 문화의 기초를 체득했습니다.' },
    {
      title: '한국소프트웨어산업협회 SW개발자 양성과정 수료 및 팀 프로젝트 최우수상',
      period: '교육/수상',
      detail: '한국소프트웨어산업협회(KOSA) SW개발자 양성과정을 수료하고 팀 프로젝트 최우수상을 수상했습니다. (sw.or.kr 교육과정)',
    },
    { title: '지니프릭스 재직', period: '2021/12/27 - 2024/05', detail: '지니프릭스에서 프론트엔드 개발자로 근무하며 실무 프로젝트 기반의 웹 서비스 개발/운영 경험을 쌓았습니다.' },
    { title: '풀스택 전환 준비 기간', period: '2024/06 - 2025/03', detail: '프론트엔드에서 풀스택으로 역할 확장을 목표로 정보처리기사 취득과 쿠팡 해커톤(애자일 스크럼 기반 24시간 협업) 참여를 통해 실전형 전환 역량을 강화했습니다.' },
    { title: '차렌터카 풀스택 개발 총괄', period: '2025/04 - 2025/10', detail: '차렌터카 서비스에서 도메인 준비부터 개발 환경설정, 예약/운영 기능 구현까지 풀스택 개발 전반을 총괄했습니다.' },
    { title: '소프트빌더 사업자 운영 (프리랜서)', period: '2025/11 - Present', detail: '소프트빌더를 운영하며 외주 프로젝트를 수행하고, 고객 요구사항에 맞춘 웹/업무 시스템을 프리랜서로 개발·납품하고 있습니다.' },
  ],
  en: [
    { title: 'Completed 42 Seoul La Piscine', period: 'Early Experience', detail: 'Completed the immersive La Piscine program, strengthening fundamentals in C-based problem solving, peer collaboration, and code-review culture.' },
    {
      title: 'Completed KOSA SW Developer Training, Team Project Grand Prize',
      period: 'Education / Award',
      detail: 'Completed the KOSA (Korea Software Industry Association) SW developer training program and received the top award in the team project.',
    },
    { title: 'Geniefreaks (Frontend Developer)', period: '2021/12/27 - 2024/05', detail: 'Worked as a frontend developer at Geniefreaks, building and operating production web services.' },
    { title: 'Full-Stack Transition Phase', period: '2024/06 - 2025/03', detail: 'Focused on expanding from frontend into full-stack responsibilities by earning the Engineer Information Processing certification and joining the Coupang hackathon for hands-on 24-hour Agile Scrum collaboration.' },
    { title: 'Charentcar Full-Stack Lead', period: '2025/04 - 2025/10', detail: 'Led end-to-end full-stack development at Charentcar, from domain setup and environment configuration to reservation/operations feature delivery.' },
    { title: 'SoftBuilder Owner (Freelancer)', period: '2025/11 - Present', detail: 'Operating SoftBuilder while delivering outsourced projects as a freelancer, building and shipping custom web and business systems for clients.' },
  ],
} as const

export default function PortfolioHome() {
  const experienceSectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const experienceItemRefs = useRef<(HTMLElement | null)[]>([])
  const experienceDotRefs = useRef<(HTMLDivElement | null)[]>([])
  const [activeExperienceIndex, setActiveExperienceIndex] = useState<number | null>(null)
  const [laserPosition, setLaserPosition] = useState(0)
  const [language, setLanguage] = useState<Language>('en')
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('dark')
  const isDark = backgroundTheme === 'dark'
  const t = uiText[language]
  const projectCards = useMemo(() => projectCardsByLanguage[language], [language])
  const experienceItems = useMemo(() => experienceByLanguage[language], [language])
  const stackSkills = [
    { name: 'Angular', tone: 'frontend' },
    { name: 'Next.js', tone: 'frontend' },
    { name: 'React', tone: 'frontend' },
    { name: 'Vue', tone: 'frontend' },
    { name: 'TypeScript', tone: 'language' },
    { name: 'JavaScript (ES6)', tone: 'language' },
    { name: 'Node.js', tone: 'backend' },
    { name: 'WordPress', tone: 'backend' },
    { name: 'PHP', tone: 'backend' },
    { name: 'PHP-FPM', tone: 'backend' },
    { name: 'MySQL', tone: 'database' },
    { name: 'Docker', tone: 'devops' },
    { name: 'Nginx', tone: 'devops' },
    { name: 'Jenkins', tone: 'devops' },
    { name: 'Vercel', tone: 'devops' },
    { name: 'Cloudflare', tone: 'devops' },
    { name: 'Notion', tone: 'collab' },
    { name: 'Slack', tone: 'collab' },
    { name: 'Jira', tone: 'collab' },
    { name: 'Confluence', tone: 'collab' },
    { name: 'Bitbucket', tone: 'collab' },
    { name: 'Figma', tone: 'tool' },
  ] as const
  const skillToneClass = {
    dark: {
      frontend: 'text-sky-200 bg-sky-500/15 border-sky-400/40',
      language: 'text-violet-200 bg-violet-500/15 border-violet-400/40',
      backend: 'text-emerald-200 bg-emerald-500/15 border-emerald-400/40',
      database: 'text-amber-200 bg-amber-500/15 border-amber-400/40',
      devops: 'text-cyan-200 bg-cyan-500/15 border-cyan-400/40',
      collab: 'text-rose-200 bg-rose-500/15 border-rose-400/40',
      tool: 'text-zinc-200 bg-zinc-700/40 border-zinc-500/50',
    },
    light: {
      frontend: 'text-sky-800 bg-sky-100 border-sky-300',
      language: 'text-violet-800 bg-violet-100 border-violet-300',
      backend: 'text-emerald-800 bg-emerald-100 border-emerald-300',
      database: 'text-amber-800 bg-amber-100 border-amber-300',
      devops: 'text-cyan-800 bg-cyan-100 border-cyan-300',
      collab: 'text-rose-800 bg-rose-100 border-rose-300',
      tool: 'text-zinc-800 bg-zinc-100 border-zinc-300',
    },
  } as const

  useEffect(() => {
    if (!window.ChannelIOInitialized) {
      const ch = function (...args: unknown[]) {
        ch.q.push(args)
      } as ((...args: unknown[]) => void) & { q: unknown[][] }

      ch.q = []
      window.ChannelIO = ch

      const script = document.createElement('script')
      script.async = true
      script.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js'
      script.charset = 'UTF-8'
      document.head.appendChild(script)
      window.ChannelIOInitialized = true
    }

    window.ChannelIO?.('boot', {
      pluginKey: '20ba72a5-991f-47c1-b41a-32b0fed6316c',
      hideChannelButtonOnBoot: false,
    })
  }, [])

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('site-theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setBackgroundTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', backgroundTheme)
    window.localStorage.setItem('site-theme', backgroundTheme)
  }, [backgroundTheme])

  const openChannelTalk = () => {
    if (window.ChannelIO) {
      window.ChannelIO('showMessenger')
      return
    }
    window.open('https://channeltalk.kr/s/ch/20ba72a5-991f-47c1-b41a-32b0fed6316c', '_blank', 'noopener,noreferrer')
  }

  const toggleBackgroundTheme = () => setBackgroundTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    const syncExperienceLaser = () => {
      const section = experienceSectionRef.current
      const timeline = timelineRef.current
      if (!section || !timeline) return

      const viewportHeight = window.innerHeight
      const timelineRect = timeline.getBoundingClientRect()
      const viewportCenterY = viewportHeight * 0.48
      const rawLaserY = viewportCenterY - timelineRect.top
      const dotCenters = experienceDotRefs.current
        .map((dot) => {
          if (!dot) return null
          const rect = dot.getBoundingClientRect()
          return rect.top - timelineRect.top + rect.height / 2
        })
        .filter((value): value is number => value !== null)

      if (dotCenters.length === 0) return

      const lastDotCenter = dotCenters[dotCenters.length - 1] + 5
      const clampedLaserY = Math.max(0, Math.min(lastDotCenter, rawLaserY))
      setLaserPosition(clampedLaserY)

      // 마지막 도트 이후 스크롤에서는 마지막 상태로 고정
      if (rawLaserY >= lastDotCenter) {
        setActiveExperienceIndex(dotCenters.length - 1)
        return
      }

      let closestIndex: number | null = null
      let closestDistance = Number.POSITIVE_INFINITY
      dotCenters.forEach((dotCenterOnTimeline, index) => {
        const distance = Math.abs(dotCenterOnTimeline - clampedLaserY)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })
      // 시작 지점에서는 첫 카드 점등, 이후에는 레이저 근처의 가장 가까운 도트를 점등
      if (clampedLaserY <= 20) {
        setActiveExperienceIndex(0)
      } else {
        // 근처 범위를 넉넉히 잡아 UX 개선, 그래도 없으면 가장 가까운 도트 fallback
        if (closestDistance <= 58) {
          setActiveExperienceIndex(closestIndex)
        } else {
          setActiveExperienceIndex(closestIndex ?? 0)
        }
      }
    }

    syncExperienceLaser()
    window.addEventListener('scroll', syncExperienceLaser, { passive: true })
    window.addEventListener('resize', syncExperienceLaser)
    return () => {
      window.removeEventListener('scroll', syncExperienceLaser)
      window.removeEventListener('resize', syncExperienceLaser)
    }
  }, [experienceItems.length])

  const backgroundStyles: Record<BackgroundTheme, CSSProperties> = {
    dark: {
      background:
        'radial-gradient(1200px 600px at 12% 0%, rgba(16,185,129,0.16), transparent 55%), radial-gradient(900px 520px at 88% 0%, rgba(59,130,246,0.14), transparent 55%), #09090b',
    },
    light: {
      background:
        'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
      backgroundSize: '28px 28px, 28px 28px, auto',
    },
  }

  return (
    <main className={`flex flex-col min-h-screen scroll-smooth ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`} style={backgroundStyles[backgroundTheme]}>
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${isDark ? 'bg-zinc-950/70 border-zinc-900' : 'bg-white/85 border-zinc-300'}`}>
        <div className="container flex justify-between items-center px-4 py-4 mx-auto">
          <a href="#home" className="font-mono text-sm text-emerald-400">
            root@byungmin:~$
          </a>
          <nav className="flex gap-2 items-center text-sm">
            <a href="#home" className={`px-3 py-1.5 rounded-lg ${isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-zinc-700 hover:text-black hover:bg-zinc-200'}`}>{t.nav.home}</a>
            <a href="#projects" className={`px-3 py-1.5 rounded-lg ${isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-zinc-700 hover:text-black hover:bg-zinc-200'}`}>{t.nav.projects}</a>
            <a href="#experience" className={`px-3 py-1.5 rounded-lg ${isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-zinc-700 hover:text-black hover:bg-zinc-200'}`}>{t.nav.experience}</a>
            <a href="#contact" className={`px-3 py-1.5 rounded-lg ${isDark ? 'text-zinc-300 hover:text-white hover:bg-zinc-800' : 'text-zinc-700 hover:text-black hover:bg-zinc-200'}`}>{t.nav.contact}</a>
            <button
              type="button"
              onClick={toggleBackgroundTheme}
              className={`p-2 rounded-lg border ${isDark ? 'text-zinc-300 border-zinc-700 hover:bg-zinc-800' : 'text-zinc-800 border-zinc-400 hover:bg-zinc-100'}`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 fill-indigo-500" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setLanguage('ko')}
              className={`px-2 py-1 rounded-lg border ${language === 'ko' ? 'text-black bg-emerald-400 border-emerald-300' : isDark ? 'text-zinc-300 border-zinc-700 hover:bg-zinc-800' : 'text-zinc-800 border-zinc-400 hover:bg-zinc-100'}`}
              aria-label="Switch language to Korean"
            >
              🇰🇷
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-lg border ${language === 'en' ? 'text-black bg-emerald-400 border-emerald-300' : isDark ? 'text-zinc-300 border-zinc-700 hover:bg-zinc-800' : 'text-zinc-800 border-zinc-400 hover:bg-zinc-100'}`}
              aria-label="Switch language to English"
            >
              🇺🇸
            </button>
          </nav>
        </div>
      </header>

      <section id="home" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 font-mono text-sm text-emerald-400">&gt;root@byungmin:~$ build_portfolio --style modern-terminal</p>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="mb-5 text-5xl font-bold leading-tight md:text-7xl">
                Byungmin
                <span className="block text-emerald-400">{t.hero.subtitle}</span>
              </h1>
              <p className={`max-w-2xl text-lg leading-relaxed md:text-xl ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {t.hero.description}
              </p>
            </div>

            <div className="space-y-5">
              <div className={`overflow-hidden relative rounded-2xl border ${isDark ? 'bg-zinc-900/70 border-emerald-800/60' : 'border-emerald-300 bg-white/90'}`}>
                <div className="relative h-[320px] w-full">
                  <div
                    className={`absolute inset-0 ${isDark
                      ? 'bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.25),transparent_40%),linear-gradient(180deg,#052e16_0%,#064e3b_55%,#022c22_100%)]'
                      : 'bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.22),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.18),transparent_40%),linear-gradient(180deg,#dcfce7_0%,#bbf7d0_55%,#86efac_100%)]'
                      }`}
                  />
                  <Image
                    src="/images/배경.png"
                    alt="Byungmin portrait"
                    fill
                    sizes="(min-width: 1024px) 32vw, 100vw"
                    className="object-cover object-center"
                    priority
                  />
                  <div className="flex absolute inset-0 justify-center items-center">
                    <div className={`relative overflow-hidden w-52 aspect-[413/600] rounded-xl border-2 shadow-2xl ${isDark ? 'border-zinc-300/70 bg-zinc-900/40' : 'border-white/90 bg-white/30'}`}>
                      <Image
                        src="/images/증명사진.jpeg"
                        alt="Byungmin profile"
                        fill
                        sizes="176px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t to-transparent from-black/70 via-black/20' : 'bg-gradient-to-t to-transparent from-black/45 via-black/10'}`} />
                  <div className="absolute right-4 bottom-4 left-4">
                    <p className="font-mono text-xs tracking-wider text-emerald-300">STATUS: AVAILABLE FOR PROJECTS</p>
                    <h2 className="mt-1 text-xl font-bold text-white">Byungmin</h2>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white/90 border-zinc-300'}`}>
                <div className="flex items-center mb-4">
                  <Code2 className="mr-2 w-6 h-6 text-emerald-400" />
                  <h2 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{t.hero.profileTitle}</h2>
                </div>
                <p className={`mb-4 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{t.hero.profileDesc}</p>
                <div className="flex flex-wrap gap-2">
                  {stackSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${isDark ? skillToneClass.dark[skill.tone] : skillToneClass.light[skill.tone]
                        }`}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white/90 border-zinc-300'}`}>
                <h3 className={`mb-3 text-sm font-semibold tracking-wide ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{t.hero.qualifiedTitle}</h3>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${isDark ? 'text-zinc-200 bg-zinc-800 border-zinc-700' : 'text-zinc-800 bg-zinc-100 border-zinc-400'}`}>
                  {t.hero.qualifiedItem}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-10">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=qw486512@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 font-semibold text-black bg-emerald-400 rounded-xl hover:bg-emerald-300"
            >
              {t.hero.contact}
            </a>
            <button
              type="button"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className={`px-5 py-3 font-semibold rounded-xl border ${isDark ? 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800' : 'bg-white border-zinc-400 hover:bg-zinc-100'}`}
            >
              {t.hero.projects}
            </button>
          </div>
        </div>
      </section>

      <section id="projects" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <h2 className="text-3xl font-bold md:text-4xl">{t.projects.title}</h2>
          </div>
          <p className={`mb-6 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{t.projects.hint}</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 [perspective:1400px]">
            {projectCards.map((project, index) => {
              const tileOffset = index % 3 === 1 ? 'md:translate-y-3' : index % 3 === 2 ? 'md:-translate-y-1' : ''

              const card = (
                <div className="relative w-full aspect-[6/4] max-w-[360px] [transform-style:preserve-3d] transition-transform duration-500 group-hover:[transform:rotateY(180deg)]">
                  <article
                    className={`absolute inset-0 [backface-visibility:hidden] rounded-2xl border-2 shadow-lg transition-all duration-300 bg-gradient-to-br p-4 flex flex-col items-center justify-center text-center ${isDark ? project.theme : 'from-white to-zinc-100 border-zinc-300'}`}
                  >
                    <div>
                      <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${isDark ? 'bg-black/25' : 'bg-zinc-200'}`}>
                        {index === 0 ? <Briefcase className={`w-4 h-4 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`} /> : <Code2 className={`w-4 h-4 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`} />}
                      </div>
                      <h3 className={`text-base font-bold leading-snug ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{project.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={`${project.title}-front-${tag}`} className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${isDark ? 'text-zinc-200 bg-black/30 border-white/10' : 'text-zinc-800 bg-zinc-200 border-zinc-400'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>

                  <article
                    className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border-2 shadow-lg transition-all duration-300 bg-gradient-to-br p-4 flex flex-col ${isDark ? project.theme : 'from-white to-zinc-100 border-zinc-300'}`}
                  >
                    <h3 className={`mb-2 text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{project.title}</h3>
                    <p className={`mb-3 text-xs leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${isDark ? 'text-zinc-200 bg-black/30 border-white/10' : 'text-zinc-800 bg-zinc-200 border-zinc-400'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={`flex items-center text-xs font-semibold ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                      <span>{project.href ? t.projects.details : t.projects.comingSoon}</span>
                      <ArrowRight className="ml-1 w-3.5 h-3.5" />
                    </div>
                  </article>
                </div>
              )

              if (project.href) {
                return (
                  <Link
                    key={project.title}
                    href={project.href}
                    className={`block justify-self-center w-full transition-transform duration-300 max-w-[360px] group [transform-style:preserve-3d] ${tileOffset}`}
                  >
                    {card}
                  </Link>
                )
              }

              return (
                <div key={project.title} className={`justify-self-center w-full transition-transform duration-300 max-w-[360px] group [transform-style:preserve-3d] ${tileOffset}`}>
                  {card}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="experience" ref={experienceSectionRef} className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">{t.experience.title}</h2>
          <div ref={timelineRef} className="relative space-y-12 md:space-y-16">
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-400'}`} />
            <div
              className="pointer-events-none absolute top-0 z-10 left-1/2 -translate-x-1/2 w-[3px] bg-emerald-400/70 shadow-[0_0_14px_rgba(16,185,129,0.75)] transition-all duration-150"
              style={{ height: `${Math.max(0, laserPosition - 2)}px` }}
            />
            <div
              className="pointer-events-none absolute z-20 w-20 h-20 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.55)_0%,rgba(16,185,129,0.18)_45%,rgba(16,185,129,0)_75%)] blur-sm transition-transform duration-150"
              style={{ left: '50%', top: `${laserPosition}px`, transform: 'translate(-50%, -50%)' }}
            />
            <div
              className="pointer-events-none absolute z-30 w-3.5 h-3.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(16,185,129,1)] transition-transform duration-150"
              style={{ left: '50%', top: `${laserPosition}px`, transform: 'translate(-50%, -50%)' }}
            />
            {experienceItems.map((item, index) => (
              <div key={item.title} className="grid grid-cols-[1fr_56px_1fr] items-center">
                <article
                  ref={(el) => {
                    experienceItemRefs.current[index] = el
                  }}
                  className={`relative z-20 w-[min(100%,20rem)] aspect-square p-6 rounded-2xl border transition-all duration-300 ${index % 2 === 0 ? 'col-start-1 justify-self-end' : 'col-start-3 justify-self-start'
                    } ${index === activeExperienceIndex
                      ? isDark
                        ? 'bg-zinc-900/95 border-emerald-400/70 shadow-[0_0_26px_rgba(16,185,129,0.22)]'
                        : 'bg-white border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                      : isDark
                        ? 'bg-zinc-900/70 border-zinc-800'
                        : 'bg-white/92 border-zinc-300'
                    }`}
                >
                  <p className="mb-2 text-xs tracking-wider text-emerald-400 uppercase">{item.period}</p>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{item.detail}</p>
                </article>

                <div className="flex col-start-2 row-start-1 justify-center">
                  <div
                    ref={(el) => {
                      experienceDotRefs.current[index] = el
                    }}
                    className={`w-3 h-3 rounded-full ring-4 transition-all duration-300 ${index === activeExperienceIndex
                      ? 'bg-emerald-400 scale-125 shadow-[0_0_14px_rgba(16,185,129,0.9)]'
                      : isDark
                        ? 'bg-zinc-600'
                        : 'bg-zinc-400'
                      } ${isDark ? 'ring-zinc-950' : 'ring-white'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className={`mx-auto max-w-5xl p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white/92 border-zinc-300'}`}>
          <h2 className="mb-2 text-3xl font-bold">{t.contact.title}</h2>
          <p className={`mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{t.contact.description}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=qw486512@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-5 py-3 space-x-2 font-medium text-black bg-emerald-400 rounded-xl hover:bg-emerald-300"
            >
              <Mail className="w-5 h-5" />
              <span>Gmail</span>
            </a>
            <a href="https://github.com/sky4564" target="_blank" rel="noopener noreferrer" className={`flex items-center px-5 py-3 space-x-2 font-medium rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'bg-white border-zinc-400 hover:bg-zinc-100'}`}>
              <ExternalLink className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <button
              type="button"
              onClick={openChannelTalk}
              className="flex items-center px-5 py-3 space-x-2 font-medium text-black bg-yellow-300 rounded-xl hover:bg-yellow-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t.contact.channelTalk}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="h-72 md:h-[34rem]" />

      <footer className={`py-8 mt-auto border-t ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-slate-50 border-zinc-300'}`}>
        <div className="container px-4 mx-auto text-center">
          <p className={isDark ? 'text-zinc-500' : 'text-zinc-600'}>© 2026 Byungmin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
