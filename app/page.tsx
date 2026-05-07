'use client'

import { Code2, Briefcase, Mail, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PortfolioHome() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex justify-center items-center mb-6 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Code2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="mb-6 text-6xl font-bold text-gray-900">
              안녕하세요, <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">병민</span>입니다
            </h1>
            <p className="mb-8 text-2xl leading-relaxed text-gray-600">
              풀스택 개발자 | 효율적인 솔루션을 만드는 것을 좋아합니다
            </p>
          </div>

          {/* Skills */}
          <div className="flex justify-center flex-wrap gap-3 mb-12">
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
          <h2 className="mb-12 text-4xl font-bold text-center text-gray-900">프로젝트</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

            {/* Charentcar Project - 메인 프로젝트로 강조 */}
            <Link
              href="/charentcar"
              className="group block"
            >
              <div className="h-full min-h-[320px] p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-green-300 hover:scale-105 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex justify-center items-center w-12 h-12 bg-green-500 rounded-xl">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-green-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                <h3 className="mb-3 text-lg font-bold text-gray-900">차렌터카 정보 시스템 (CIS)</h3>
                <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                  렌터카 업무의 모든 과정을 디지털화한 통합 관리 시스템입니다.
                  견적 계산, 예약 관리, 차량 조회, 은행 API 연동 등 실무에 필요한
                  모든 기능을 하나의 플랫폼에서 제공합니다.
                </p>

                <div className="flex justify-between items-end mt-auto">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">Next.js</span>
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">TypeScript</span>
                    <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">Tailwind</span>
                  </div>
                  <div className="flex items-center text-sm text-green-600 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>프로젝트 보기</span>
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* 다른 프로젝트들 - 준비중 */}
            <Link href="/projects/airportrent24" className="group block">
              <div className="h-full min-h-[320px] p-6 bg-gradient-to-br from-sky-50 to-blue-100 rounded-2xl border-2 border-sky-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-sky-300 hover:scale-105 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex justify-center items-center w-12 h-12 bg-sky-500 rounded-xl">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <ExternalLink className="w-5 h-5 text-sky-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">공항렌트24 웹페이지</h3>
                <p className="mb-4 text-sm text-gray-600">24시간 인천공항 픽업 중심의 렌터카 서비스 소개 페이지입니다.</p>
                <div className="flex flex-wrap gap-2 mt-auto mb-4">
                  <span className="px-2 py-1 text-xs font-medium text-sky-700 bg-sky-200 rounded-full">HTML</span>
                  <span className="px-2 py-1 text-xs font-medium text-sky-700 bg-sky-200 rounded-full">CSS</span>
                  <span className="px-2 py-1 text-xs font-medium text-sky-700 bg-sky-200 rounded-full">JavaScript</span>
                </div>
                <div className="flex items-center text-sm font-semibold text-sky-600 group-hover:translate-x-1 transition-transform">
                  <span>프로젝트 보기</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </div>
            </Link>

            <div className="h-full min-h-[320px] p-6 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gray-100 rounded-lg">
                <Code2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">프로젝트 #3</h3>
              <p className="mb-4 text-sm text-gray-600">다음 프로젝트를 준비중입니다...</p>
              <span className="px-3 py-1 mt-auto text-xs text-gray-500 bg-gray-100 rounded-full w-fit">준비중</span>
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-white bg-gray-900">
        <div className="container px-4 mx-auto text-center">
          <p className="text-gray-400">© 2024 병민. 모든 권리 보유.</p>
        </div>
      </footer>
    </main>
  )
}
