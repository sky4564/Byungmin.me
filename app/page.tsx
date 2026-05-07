'use client'

import { Code2, Briefcase, User, Mail, ExternalLink, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function PortfolioHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const CORRECT_PASSCODE = '615323'

  useEffect(() => {
    // 쿠키에서 인증 상태 확인
    const authStatus = document.cookie
      .split('; ')
      .find(row => row.startsWith('portfolio_auth='))
      ?.split('=')[1]

    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passcode === CORRECT_PASSCODE) {
      setIsAuthenticated(true)
      setError('')
      // 쿠키에 인증 상태 저장 (24시간)
      const expiryDate = new Date()
      expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000))
      document.cookie = `portfolio_auth=true; expires=${expiryDate.toUTCString()}; path=/`
    } else {
      setError('올바르지 않은 패스코드입니다.')
      setPasscode('')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    document.cookie = 'portfolio_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="w-full max-w-md">
          <div className="p-8 bg-white rounded-2xl shadow-2xl">
            <div className="mb-8 text-center">
              <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">포트폴리오 접근</h1>
              <p className="text-gray-600">패스코드를 입력해주세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="패스코드 입력"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-3 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
              >
                접속하기
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/charentcar" className="text-sm text-gray-500 hover:text-blue-600">
                차렌터카 업무 시스템 바로가기 →
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

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
              className="group block md:col-span-2 lg:col-span-2"
            >
              <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border-2 border-green-200 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-green-300 hover:scale-105">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex justify-center items-center w-16 h-16 bg-green-500 rounded-2xl">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <ExternalLink className="w-6 h-6 text-green-600 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                <h3 className="mb-4 text-2xl font-bold text-gray-900">차렌터카 정보 시스템 (CIS)</h3>
                <p className="mb-6 text-gray-600 leading-relaxed">
                  렌터카 업무의 모든 과정을 디지털화한 통합 관리 시스템입니다.
                  견적 계산, 예약 관리, 차량 조회, 은행 API 연동 등 실무에 필요한
                  모든 기능을 하나의 플랫폼에서 제공합니다.
                </p>

                <div className="flex justify-between items-end">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">Next.js</span>
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">TypeScript</span>
                    <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-200 rounded-full">Tailwind</span>
                  </div>
                  <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>프로젝트 보기</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* 다른 프로젝트들 - 준비중 */}
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gray-100 rounded-lg">
                <Code2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">프로젝트 #2</h3>
              <p className="mb-4 text-sm text-gray-600">다음 프로젝트를 준비중입니다...</p>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">준비중</span>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-gray-100 rounded-lg">
                <Code2 className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">프로젝트 #3</h3>
              <p className="mb-4 text-sm text-gray-600">다음 프로젝트를 준비중입니다...</p>
              <span className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">준비중</span>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container px-4 py-16 mx-auto">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">연락하기</h2>
          <div className="flex justify-center space-x-6">
            <a href="mailto:your.email@example.com" className="flex items-center px-6 py-3 space-x-2 text-blue-600 bg-blue-50 rounded-lg transition-colors hover:bg-blue-100">
              <Mail className="w-5 h-5" />
              <span>이메일</span>
            </a>
            <a href="https://github.com/sky4564" target="_blank" rel="noopener noreferrer" className="flex items-center px-6 py-3 space-x-2 text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200">
              <ExternalLink className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </div>
          
          {/* 로그아웃 버튼 */}
          <div className="mt-8">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-xs text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              로그아웃
            </button>
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
