'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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
    },
    projects: {
      title: '프로젝트',
      hint: '좌우로 넘겨서 5개 프로젝트를 확인해보세요.',
      details: '프로젝트 보기',
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
    },
    projects: {
      title: 'Projects',
      hint: 'Swipe horizontally to explore 5 projects.',
      details: 'Project Details',
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
      title: '차렌터카 정보 시스템 (CIS)',
      description: '렌터카 견적, 예약, 차량 조회, 은행 API 연동까지 통합 관리하는 메인 프로젝트입니다.',
      tags: ['Next.js', 'TypeScript', 'Tailwind'],
      href: '/charentcar',
      theme: 'from-emerald-950/60 to-zinc-900 border-emerald-700/50',
    },
    {
      title: '공항렌트24 웹페이지',
      description: '24시간 인천공항 픽업 중심의 렌터카 서비스 소개 랜딩 페이지입니다.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      href: '/projects/airportrent24',
      theme: 'from-sky-950/60 to-zinc-900 border-sky-700/50',
    },
    {
      title: '차량 운영 대시보드',
      description: '차량 가동률, 회전율, 정비 이력을 시각화하는 운영 분석 대시보드 프로젝트입니다.',
      tags: ['React', 'Charts', 'PostgreSQL'],
      theme: 'from-violet-950/50 to-zinc-900 border-violet-700/50',
    },
    {
      title: '요금 자동화 엔진',
      description: '성수기/비성수기, 기간별 할인, 옵션 가격을 자동 반영하는 요금 계산 엔진입니다.',
      tags: ['Node.js', 'Rules', 'API'],
      theme: 'from-amber-950/50 to-zinc-900 border-amber-700/50',
    },
    {
      title: '고객 전용 예약 포털',
      description: '고객이 예약 조회, 변경, 문의를 직접 처리할 수 있는 셀프서비스 포털입니다.',
      tags: ['Next.js', 'Auth', 'Portal'],
      theme: 'from-zinc-900 to-black border-zinc-700',
    },
  ],
  en: [
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
      title: 'Vehicle Ops Dashboard',
      description: 'Operational analytics dashboard for utilization, turn-rate, and maintenance history.',
      tags: ['React', 'Charts', 'PostgreSQL'],
      theme: 'from-violet-950/50 to-zinc-900 border-violet-700/50',
    },
    {
      title: 'Pricing Automation Engine',
      description: 'Rule-based pricing engine covering seasonality, duration discounts, and options.',
      tags: ['Node.js', 'Rules', 'API'],
      theme: 'from-amber-950/50 to-zinc-900 border-amber-700/50',
    },
    {
      title: 'Customer Reservation Portal',
      description: 'Self-service portal for reservation checks, updates, and support requests.',
      tags: ['Next.js', 'Auth', 'Portal'],
      theme: 'from-zinc-900 to-black border-zinc-700',
    },
  ],
}

const experienceByLanguage = {
  ko: [
    { title: 'Full-Stack Developer', period: '2023 - Present', detail: '내부 운영 도구와 고객용 서비스 페이지를 구축했습니다.' },
    { title: 'Automation Projects', period: '2022 - Present', detail: '자동화로 반복 수작업을 줄이고 업무 속도를 개선했습니다.' },
    { title: 'Cloud & Infra', period: '2021 - Present', detail: '배포, 모니터링, 인프라 안정성 운영을 담당했습니다.' },
    { title: 'Data-driven Features', period: 'Ongoing', detail: '지표 기반 개선으로 제품 의사결정을 고도화했습니다.' },
  ],
  en: [
    { title: 'Full-Stack Developer', period: '2023 - Present', detail: 'Built internal operation tools and customer service pages.' },
    { title: 'Automation Projects', period: '2022 - Present', detail: 'Reduced manual work with scripts and workflow optimization.' },
    { title: 'Cloud & Infra', period: '2021 - Present', detail: 'Managed deployment, monitoring, and system reliability.' },
    { title: 'Data-driven Features', period: 'Ongoing', detail: 'Improved product decisions through measurable indicators.' },
  ],
} as const

export default function PortfolioHome() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [language, setLanguage] = useState<Language>('en')
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('dark')
  const isDark = backgroundTheme === 'dark'
  const t = uiText[language]
  const projectCards = useMemo(() => projectCardsByLanguage[language], [language])
  const experienceItems = useMemo(() => experienceByLanguage[language], [language])

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

  const scrollProjects = (direction: 'left' | 'right') => {
    if (!projectsRef.current) return
    const amount = direction === 'left' ? -380 : 380
    projectsRef.current.scrollBy({ left: amount, behavior: 'smooth' })
  }

  const toggleBackgroundTheme = () => setBackgroundTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  const updateActiveProjectIndex = useCallback(() => {
    if (!projectsRef.current) return

    const container = projectsRef.current
    const firstCard = container.children.item(0) as HTMLElement | null
    if (!firstCard) return

    const computedStyle = window.getComputedStyle(container)
    const gap = Number.parseFloat(computedStyle.gap || computedStyle.columnGap || '24') || 24
    const stride = firstCard.offsetWidth + gap
    const centerX = container.scrollLeft + container.clientWidth / 2
    const rawIndex = Math.round((centerX - firstCard.offsetWidth / 2) / stride)
    const safeIndex = Math.max(0, Math.min(projectCards.length - 1, rawIndex))
    setActiveProjectIndex(safeIndex)
  }, [projectCards.length])

  useEffect(() => {
    updateActiveProjectIndex()
    window.addEventListener('resize', updateActiveProjectIndex)
    return () => window.removeEventListener('resize', updateActiveProjectIndex)
  }, [updateActiveProjectIndex])

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
              <div className={`overflow-hidden relative rounded-2xl border ${isDark ? 'bg-zinc-900/70 border-emerald-800/60' : 'bg-white/90 border-emerald-300'}`}>
                <div className="relative h-[320px] w-full">
                  <div
                    className={`absolute inset-0 ${
                      isDark
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
                  <div className="absolute inset-0 flex justify-center items-center">
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
                  <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-t from-black/70 via-black/20 to-transparent' : 'bg-gradient-to-t from-black/45 via-black/10 to-transparent'}`} />
                  <div className="absolute right-4 bottom-4 left-4">
                    <p className="font-mono text-xs tracking-wider text-emerald-300">STATUS: AVAILABLE FOR PROJECTS</p>
                    <h2 className="mt-1 text-xl font-bold text-white">Byungmin</h2>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white/90 border-zinc-300'}`}>
                <div className="flex items-center mb-4">
                  <Code2 className="w-6 h-6 mr-2 text-emerald-400" />
                  <h2 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{t.hero.profileTitle}</h2>
                </div>
                <p className={`mb-4 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{t.hero.profileDesc}</p>
                <div className="flex flex-wrap gap-2">
                  {['Next.js', 'React', 'TypeScript', 'Node.js', 'Automation', 'Cloud'].map((skill) => (
                    <span key={skill} className={`px-3 py-1 text-xs font-medium rounded-full border ${isDark ? 'text-zinc-200 bg-zinc-800 border-zinc-700' : 'text-zinc-800 bg-zinc-100 border-zinc-400'}`}>
                      {skill}
                    </span>
                  ))}
                </div>
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
              onClick={() => scrollProjects('right')}
              className={`px-5 py-3 font-semibold rounded-xl border ${isDark ? 'border-zinc-700 bg-zinc-900 hover:bg-zinc-800' : 'border-zinc-400 bg-white hover:bg-zinc-100'}`}
            >
              {t.hero.projects}
            </button>
          </div>
        </div>
      </section>

      <section id="projects" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold md:text-4xl">{t.projects.title}</h2>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollProjects('left')}
                className={`px-3 py-2 text-sm rounded-lg border ${isDark ? 'text-zinc-300 bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'text-zinc-800 bg-white border-zinc-400 hover:bg-zinc-100'}`}
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollProjects('right')}
                className={`px-3 py-2 text-sm rounded-lg border ${isDark ? 'text-zinc-300 bg-zinc-900 border-zinc-700 hover:bg-zinc-800' : 'text-zinc-800 bg-white border-zinc-400 hover:bg-zinc-100'}`}
              >
                →
              </button>
            </div>
          </div>
          <p className={`mb-6 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{t.projects.hint}</p>

          <div className="relative [perspective:1600px]">
            <div className={`pointer-events-none absolute top-0 left-0 z-10 w-10 h-full bg-gradient-to-r ${isDark ? 'from-zinc-950 via-zinc-950/80' : 'from-slate-50 via-slate-50/80'} to-transparent`} />
            <div className={`pointer-events-none absolute top-0 right-0 z-10 w-10 h-full bg-gradient-to-l ${isDark ? 'from-zinc-950 via-zinc-950/80' : 'from-indigo-50 via-indigo-50/80'} to-transparent`} />

            <div
              ref={projectsRef}
              onScroll={updateActiveProjectIndex}
              className="flex gap-6 px-1 pb-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {projectCards.map((project, index) => {
                const distanceFromActive = index - activeProjectIndex
                const absDistance = Math.abs(distanceFromActive)
                const rotateY = distanceFromActive === 0 ? 0 : distanceFromActive > 0 ? -12 : 12
                const translateZ = absDistance === 0 ? 36 : absDistance === 1 ? 6 : -24
                const scale = absDistance === 0 ? 1 : absDistance === 1 ? 0.94 : 0.88
                const opacity = absDistance > 2 ? 0.55 : absDistance === 2 ? 0.72 : absDistance === 1 ? 0.88 : 1

                const card = (
                  <article
                    className={`h-full min-h-[320px] p-6 bg-gradient-to-br rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col ${isDark ? project.theme : 'from-white to-zinc-100 border-zinc-300'}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`flex justify-center items-center w-12 h-12 rounded-xl ${isDark ? 'bg-black/25' : 'bg-zinc-200'}`}>
                        {index === 0 ? <Briefcase className={`w-6 h-6 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`} /> : <Code2 className={`w-6 h-6 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`} />}
                      </div>
                      <ExternalLink className={`w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`} />
                    </div>

                    <h3 className={`mb-3 text-lg font-bold ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>{project.title}</h3>
                    <p className={`mb-4 text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-auto mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className={`px-2 py-1 text-xs font-medium rounded-full border ${isDark ? 'text-zinc-200 bg-black/30 border-white/10' : 'text-zinc-800 bg-zinc-200 border-zinc-400'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={`flex items-center text-sm font-semibold transition-transform group-hover:translate-x-1 ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}>
                      <span>{project.href ? t.projects.details : t.projects.comingSoon}</span>
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </article>
                )

                if (project.href) {
                  return (
                    <Link
                      key={project.title}
                      href={project.href}
                      className="group snap-center shrink-0 w-[300px] md:w-[330px] lg:w-[360px] transition-all duration-500 [transform-style:preserve-3d]"
                      style={{
                        transform: `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity,
                      }}
                    >
                      {card}
                    </Link>
                  )
                }

                return (
                  <div
                    key={project.title}
                    className="group snap-center shrink-0 w-[300px] md:w-[330px] lg:w-[360px] transition-all duration-500 [transform-style:preserve-3d]"
                    style={{
                      transform: `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                    }}
                  >
                    {card}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="experience" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">{t.experience.title}</h2>
          <div className="relative pl-6 space-y-6 md:pl-10">
            <div className={`absolute top-0 bottom-0 left-2 w-px md:left-4 ${isDark ? 'bg-zinc-800' : 'bg-zinc-400'}`} />
            {experienceItems.map((item) => (
              <article key={item.title} className={`relative p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/70 border-zinc-800' : 'bg-white/92 border-zinc-300'}`}>
                <div className={`absolute top-7 -left-[1.65rem] w-3 h-3 bg-emerald-400 rounded-full ring-4 md:-left-[2.15rem] ${isDark ? 'ring-zinc-950' : 'ring-white'}`} />
                <p className="mb-2 text-xs tracking-wider text-emerald-400 uppercase">{item.period}</p>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-700'}`}>{item.detail}</p>
              </article>
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

      <footer className={`py-8 mt-auto border-t ${isDark ? 'bg-zinc-950 border-zinc-900' : 'bg-slate-50 border-zinc-300'}`}>
        <div className="container px-4 mx-auto text-center">
          <p className={isDark ? 'text-zinc-500' : 'text-zinc-600'}>© 2026 Byungmin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
