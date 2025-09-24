import { Wrench, Car, Users, Calendar, Settings, Droplets, Fuel, Calculator } from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="container px-4 py-8 mx-auto">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Wrench className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">렌터카 업무툴</h1>
          </div>
          <Link
            href="/charentcar"
            className="flex items-center px-4 py-2 space-x-2 text-gray-600 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50"
          >
            <Car className="w-4 h-4" />
            <span>메인으로</span>
          </Link>
        </nav>
      </header>

      {/* 히어로 섹션 */}
      <section className="container px-4 py-16 mx-auto text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="inline-flex justify-center items-center mb-6 w-20 h-20 bg-green-100 rounded-full">
              <Calculator className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="mb-6 text-5xl font-bold text-gray-900">
              렌터카 업무를 <span className="text-green-600">스마트하게</span>
            </h2>
            <p className="mb-8 text-xl leading-relaxed text-gray-600">
              견적 계산부터 예약 관리까지, 렌터카 업무에 필요한 모든 도구를 한 곳에서
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/charentcar/tools/regular-calculator"
              className="block p-6 text-left bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-green-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-green-100 rounded-lg">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">일반렌트카 계산</h3>
              <p className="text-sm text-gray-600">셀프 렌터카 견적을 빠르고 정확하게 계산하세요</p>
              <div className="flex justify-center items-center mt-4 text-sm font-semibold text-green-600">
                <span>바로 사용하기</span>
                <Calculator className="ml-2 w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/charentcar/tools/rental-calculator"
              className="block p-6 text-left bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">기사포함 계산</h3>
              <p className="text-sm text-gray-600">YC탁송 서비스 견적을 효율적으로 산출하세요</p>
              <div className="flex justify-center items-center mt-4 text-sm font-semibold text-blue-600">
                <span>바로 사용하기</span>
                <Calculator className="ml-2 w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/charentcar/tools/reservations"
              className="block p-6 text-left bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-purple-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">예약 관리</h3>
              <p className="text-sm text-gray-600">예약 현황을 체계적으로 관리하고 추적하세요</p>
              <div className="flex justify-center items-center mt-4 text-sm font-semibold text-purple-600">
                <span>바로 사용하기</span>
                <Calendar className="ml-2 w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/charentcar/tools/fuel-viewer"
              className="block p-6 text-left bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-red-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-red-100 rounded-lg">
                <Fuel className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">연료타입별 조회</h3>
              <p className="text-sm text-gray-600">가솔린, 디젤, LPG 차량을 한눈에 확인하세요</p>
              <div className="flex justify-center items-center mt-4 text-sm font-semibold text-red-600">
                <span>바로 사용하기</span>
                <Fuel className="ml-2 w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/charentcar/tools/bank-settings"
              className="block p-6 text-left bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">은행 API 연동</h3>
              <p className="text-sm text-gray-600">입금 확인을 자동화하여 업무 효율성을 높이세요</p>
              <div className="flex justify-center items-center mt-4 text-sm font-semibold text-blue-600">
                <span>바로 사용하기</span>
                <Settings className="ml-2 w-4 h-4" />
              </div>
            </Link>

            <Link
              href="/charentcar/tools/engine-oil"
              className="block p-6 text-left bg-white rounded-xl border border-gray-100 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-orange-300 hover:scale-105"
            >
              <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-orange-100 rounded-lg">
                <Droplets className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">엔진오일 관리</h3>
              <p className="text-sm text-gray-600">차량별 엔진오일 교체 주기를 체계적으로 관리하세요</p>
              <div className="flex justify-center items-center mt-4 text-sm font-semibold text-orange-600">
                <span>바로 사용하기</span>
                <Droplets className="ml-2 w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
