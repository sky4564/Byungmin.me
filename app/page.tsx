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
    theme: 'from-green-50 to-emerald-100 border-green-200',
  },
  {
    title: '공항렌트24 웹페이지',
    description: '24시간 인천공항 픽업 중심의 렌터카 서비스 소개 랜딩 페이지입니다.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    href: '/projects/airportrent24',
    theme: 'from-sky-50 to-blue-100 border-sky-200',
  },
  {
    title: '차량 운영 대시보드',
    description: '차량 가동률, 회전율, 정비 이력을 시각화하는 운영 분석 대시보드 프로젝트입니다.',
    tags: ['React', 'Charts', 'PostgreSQL'],
    theme: 'from-violet-50 to-purple-100 border-purple-200',
  },
  {
    title: '요금 자동화 엔진',
    description: '성수기/비성수기, 기간별 할인, 옵션 가격을 자동 반영하는 요금 계산 엔진입니다.',
    tags: ['Node.js', 'Rules', 'API'],
    theme: 'from-amber-50 to-orange-100 border-orange-200',
  },
  {
    title: '고객 전용 예약 포털',
    description: '고객이 예약 조회, 변경, 문의를 직접 처리할 수 있는 셀프서비스 포털입니다.',
    tags: ['Next.js', 'Auth', 'Portal'],
    theme: 'from-slate-50 to-gray-100 border-gray-300',
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
    <main className="flex flex-col min-h-screen bg-gradient-to-br via-blue-50 to-indigo-100 from-slate-50">
      {/* Hero Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex justify-center items-center mb-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Code2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="mb-6 text-6xl font-bold text-gray-900">
              안녕하세요, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">병민</span>입니다
            </h1>
            <p className="mb-8 text-2xl leading-relaxed text-gray-600">
              풀스택 개발자 | 효율적인 솔루션을 만드는 것을 좋아합니다
            </p>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {['Next.js', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill) => (
              <span key={skill} className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-4xl font-bold text-gray-900">프로젝트</h2>
            <div className="hidden gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollProjects('left')}
                className="px-3 py-2 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollProjects('right')}
                className="px-3 py-2 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                →
              </button>
            </div>
          </div>
          <p className="mb-6 text-sm text-gray-500">좌우로 넘겨서 5개 프로젝트를 확인해보세요.</p>

          <div className="relative [perspective:1600px]">
            <div className="pointer-events-none absolute top-0 left-0 z-10 w-10 h-full bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 z-10 w-10 h-full bg-gradient-to-l from-indigo-100 via-indigo-100/80 to-transparent" />

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
                      <div className="flex justify-center items-center w-12 h-12 rounded-xl bg-black/10">
                        {index === 0 ? <Briefcase className="w-6 h-6 text-gray-900" /> : <Code2 className="w-6 h-6 text-gray-900" />}
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-700 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>

                    <h3 className="mb-3 text-lg font-bold text-gray-900">{project.title}</h3>
                    <p className="mb-4 text-sm text-gray-700">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mt-auto mb-4">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 text-xs font-medium text-gray-700 rounded-full bg-black/10">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center text-sm font-semibold text-gray-800 transition-transform group-hover:translate-x-1">
                      <span>{project.href ? '프로젝트 보기' : '준비중'}</span>
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

      {/* Contact Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">연락하기</h2>
          <div className="flex justify-center space-x-6">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=qw486512@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-6 py-3 space-x-2 text-blue-600 bg-blue-50 rounded-lg transition-colors hover:bg-blue-100"
            >
              <Mail className="w-5 h-5" />
              <span>qw486512@gmail.com</span>
            </a>
            <a href="https://github.com/sky4564" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-3 space-x-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200">
              <ExternalLink className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <button
              type="button"
              onClick={openChannelTalk}
              className="flex items-center px-6 py-3 space-x-2 text-yellow-700 bg-yellow-100 rounded-lg transition-colors hover:bg-yellow-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>채널톡 문의하기</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 mt-auto text-white bg-gray-900">
        <div className="container px-4 mx-auto text-center">
          <p className="text-gray-400">© 2026 Byeongmin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
