import { Wrench, Car, Calendar, Settings, Users, BarChart3, Fuel } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 메인 헤더 */}
      <header className="container px-4 py-8 mx-auto">
        <nav className="flex justify-center items-center">
          <div className="flex items-center space-x-3">
            <Car className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">차렌터카 업무 시스템</h1>
          </div>
        </nav>
      </header>

      {/* 히어로 섹션 */}
      <section className="container px-4 py-16 mx-auto text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12">
            <div className="inline-flex justify-center items-center mb-8 w-24 h-24 bg-blue-100 rounded-full">
              <Wrench className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="mb-6 text-6xl font-bold text-gray-900">
              업무를 <span className="text-blue-600">스마트하게</span>
            </h2>
            <p className="mb-12 text-2xl leading-relaxed text-gray-600">
              회사의 모든 업무를 효율화하는 통합 정보시스템 CIS
            </p>
          </div>

          {/* 섹션 카드들 */}
          <div className="grid grid-cols-1 gap-8 mx-auto mb-12 max-w-4xl md:grid-cols-2">

            {/* Info 섹션 */}
            <Link
              href="/info"
              className="block p-8 bg-white rounded-2xl border border-gray-100 shadow-xl transition-all duration-500 group hover:shadow-2xl hover:border-blue-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl transition-all duration-300 group-hover:from-blue-200 group-hover:to-blue-300">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">📊 Info</h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                회사 정보, 공지사항, 업무 현황 등<br />
                전반적인 정보를 확인하세요
              </p>
              <div className="inline-flex items-center font-semibold text-blue-600">
                <span>정보 확인하기</span>
                <Calendar className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Tool 섹션 */}
            <Link
              href="/tools"
              className="block p-8 bg-white rounded-2xl border border-gray-100 shadow-xl transition-all duration-500 group hover:shadow-2xl hover:border-green-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl transition-all duration-300 group-hover:from-green-200 group-hover:to-green-300">
                <Wrench className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">🛠️ Tool</h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                렌터카 견적 계산, 예약 관리 등<br />
                업무 도구들을 사용하세요
              </p>
              <div className="inline-flex items-center font-semibold text-green-600">
                <span>도구 사용하기</span>
                <Wrench className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>

          {/* 추가 예정 섹션 미리보기 */}
          <div className="grid grid-cols-2 gap-4 mx-auto max-w-2xl opacity-50 md:grid-cols-4">
            <div className="p-4 bg-gray-100 rounded-xl border-2 border-gray-300 border-dashed">
              <div className="flex justify-center items-center mx-auto mb-2 w-8 h-8 bg-gray-200 rounded-lg">
                <BarChart3 className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm font-semibold text-gray-500">📈 Analytics</div>
              <div className="mt-1 text-xs text-gray-400">준비중</div>
            </div>

            <div className="p-4 bg-gray-100 rounded-xl border-2 border-gray-300 border-dashed">
              <div className="flex justify-center items-center mx-auto mb-2 w-8 h-8 bg-gray-200 rounded-lg">
                <Settings className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm font-semibold text-gray-500">⚙️ Admin</div>
              <div className="mt-1 text-xs text-gray-400">준비중</div>
            </div>

            <div className="p-4 bg-gray-100 rounded-xl border-2 border-gray-300 border-dashed">
              <div className="flex justify-center items-center mx-auto mb-2 w-8 h-8 bg-gray-200 rounded-lg">
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm font-semibold text-gray-500">👥 Team</div>
              <div className="mt-1 text-xs text-gray-400">준비중</div>
            </div>

            <div className="p-4 bg-gray-100 rounded-xl border-2 border-gray-300 border-dashed">
              <div className="flex justify-center items-center mx-auto mb-2 w-8 h-8 bg-gray-200 rounded-lg">
                <Fuel className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-sm font-semibold text-gray-500">📋 More</div>
              <div className="mt-1 text-xs text-gray-400">준비중</div>
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-500">더 많은 기능들이 곧 추가됩니다!</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-white bg-gray-900">
        <div className="container px-4 mx-auto text-center">
          <div className="flex justify-center items-center mb-4 space-x-3">
            <Car className="w-6 h-6" />
            <span className="text-lg font-semibold">회사 업무 시스템</span>
          </div>
          <p className="text-sm text-gray-400">모든 업무를 더 스마트하게, 더 효율적으로</p>
        </div>
      </footer>
    </main>
  )
}