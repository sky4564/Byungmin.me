'use client'

import { useEffect, useRef, useState } from 'react'
import { Code2, Briefcase, Mail, ExternalLink, ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'

declare global {
  interface Window {
    ChannelIO?: (...args: unknown[]) => void
    ChannelIOInitialized?: boolean
  }
}

const projectCards = [
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
]

export default function PortfolioHome() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)

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

  const updateActiveProjectIndex = () => {
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
  }

  useEffect(() => {
    updateActiveProjectIndex()
    window.addEventListener('resize', updateActiveProjectIndex)
    return () => window.removeEventListener('resize', updateActiveProjectIndex)
  }, [])

  return (
    <main className="flex flex-col min-h-screen text-zinc-100 bg-zinc-950 scroll-smooth">
      <header className="sticky top-0 z-40 border-b backdrop-blur-xl bg-zinc-950/70 border-zinc-900">
        <div className="container flex justify-between items-center px-4 py-4 mx-auto">
          <a href="#home" className="font-mono text-sm text-emerald-400">
            root@byeongmin:~$
          </a>
          <nav className="flex gap-2 text-sm">
            <a href="#home" className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800">Home</a>
            <a href="#projects" className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800">Projects</a>
            <a href="#experience" className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800">Experience</a>
            <a href="#contact" className="px-3 py-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800">Contact</a>
          </nav>
        </div>
      </header>

      <section id="home" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 font-mono text-sm text-emerald-400">&gt;root@byeongmin:~$ build_portfolio --style modern-terminal</p>

          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h1 className="mb-5 text-5xl font-bold leading-tight md:text-7xl">
                Byeongmin
                <span className="block text-emerald-400">Full-Stack Developer</span>
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl">
                I build practical web products with automation, clean UX, and reliable backend architecture.
                From internal operations tooling to customer-facing systems, I focus on speed and stability.
              </p>
            </div>

            <div className="p-6 bg-zinc-900/70 rounded-2xl border border-zinc-800">
              <div className="flex items-center mb-4">
                <Code2 className="w-6 h-6 mr-2 text-emerald-400" />
                <h2 className="text-sm font-semibold tracking-wide text-zinc-300">SYSTEM PROFILE</h2>
              </div>
              <p className="mb-4 text-sm text-zinc-400">Stack focus for current projects</p>
              <div className="flex flex-wrap gap-2">
                {['Next.js', 'React', 'TypeScript', 'Node.js', 'Automation', 'Cloud'].map((skill) => (
                  <span key={skill} className="px-3 py-1 text-xs font-medium rounded-full text-zinc-200 bg-zinc-800 border border-zinc-700">
                    {skill}
                  </span>
                ))}
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
              Contact Me
            </a>
            <button
              type="button"
              onClick={() => scrollProjects('right')}
              className="px-5 py-3 font-semibold rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
            >
              See Projects
            </button>
          </div>
        </div>
      </section>

      <section id="projects" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold md:text-4xl">Projects</h2>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollProjects('left')}
                className="px-3 py-2 text-sm rounded-lg border text-zinc-300 bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollProjects('right')}
                className="px-3 py-2 text-sm rounded-lg border text-zinc-300 bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
              >
                →
              </button>
            </div>
          </div>
          <p className="mb-6 text-sm text-zinc-400">Swipe horizontally. Center card gets focus in 3D.</p>

          <div className="relative [perspective:1600px]">
            <div className="pointer-events-none absolute top-0 left-0 z-10 w-10 h-full bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 z-10 w-10 h-full bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent" />

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
                    className={`h-full min-h-[320px] p-6 bg-gradient-to-br rounded-2xl border-2 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 flex flex-col ${project.theme}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-black/25">
                        {index === 0 ? <Briefcase className="w-6 h-6 text-zinc-100" /> : <Code2 className="w-6 h-6 text-zinc-100" />}
                      </div>
                      <ExternalLink className="w-5 h-5 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>

                    <h3 className="mb-3 text-lg font-bold text-zinc-100">{project.title}</h3>
                    <p className="mb-4 text-sm text-zinc-300">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-auto mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full text-zinc-200 bg-black/30 border border-white/10">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-sm font-semibold text-zinc-100 transition-transform group-hover:translate-x-1">
                      <span>{project.href ? 'Project Details' : 'Coming Soon'}</span>
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
          <h2 className="mb-10 text-3xl font-bold md:text-4xl">Experience</h2>
          <div className="relative pl-6 space-y-6 md:pl-10">
            <div className="absolute top-0 bottom-0 left-2 w-px bg-zinc-800 md:left-4" />
            {[
              { title: 'Full-Stack Developer', period: '2023 - Present', detail: 'Built internal operation tools and customer service pages.' },
              { title: 'Automation Projects', period: '2022 - Present', detail: 'Reduced manual work with scripts and workflow optimization.' },
              { title: 'Cloud & Infra', period: '2021 - Present', detail: 'Managed deployment, monitoring, and system reliability.' },
              { title: 'Data-driven Features', period: 'Ongoing', detail: 'Improved product decisions through measurable indicators.' },
            ].map((item) => (
              <article key={item.title} className="relative p-6 rounded-2xl border bg-zinc-900/70 border-zinc-800">
                <div className="absolute top-7 -left-[1.65rem] w-3 h-3 bg-emerald-400 rounded-full ring-4 ring-zinc-950 md:-left-[2.15rem]" />
                <p className="mb-2 text-xs tracking-wider text-emerald-400 uppercase">{item.period}</p>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="container px-4 py-24 mx-auto scroll-mt-24 md:py-28">
        <div className="mx-auto max-w-5xl p-8 rounded-3xl border bg-zinc-900/70 border-zinc-800">
          <h2 className="mb-2 text-3xl font-bold">Contact</h2>
          <p className="mb-8 text-zinc-400">Open for collaboration, freelance work, and product consulting.</p>
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
            <a href="https://github.com/sky4564" target="_blank" rel="noopener noreferrer" className="flex items-center px-5 py-3 space-x-2 font-medium rounded-xl border bg-zinc-900 border-zinc-700 hover:bg-zinc-800">
              <ExternalLink className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <button
              type="button"
              onClick={openChannelTalk}
              className="flex items-center px-5 py-3 space-x-2 font-medium text-black bg-yellow-300 rounded-xl hover:bg-yellow-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>ChannelTalk</span>
            </button>
          </div>
        </div>
      </section>

      <footer className="py-8 mt-auto border-t bg-zinc-950 border-zinc-900">
        <div className="container px-4 mx-auto text-center">
          <p className="text-zinc-500">© 2026 Byeongmin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
