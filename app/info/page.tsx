import { Calendar, Car, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'

export default function InfoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Info 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">회사 정보</h1>
            </div>
            <Link
              href="/"
              className="flex items-center px-4 py-2 space-x-2 text-gray-600 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50"
            >
              <Car className="w-4 h-4" />
              <span>메인으로</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Info 콘텐츠 */}
      <div className="container px-4 py-8 mx-auto">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {/* 회사 개요 */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-blue-100 rounded-lg">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">회사 개요</h3>
              <p className="text-sm text-gray-600">
                렌터카 사업을 통해 고객에게 편리하고 안전한 이동 서비스를 제공합니다.
              </p>
            </div>

            {/* 업무 현황 */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">업무 현황</h3>
              <p className="text-sm text-gray-600">
                실시간 예약 현황과 차량 운용 상태를 확인할 수 있습니다.
              </p>
            </div>

            {/* 공지사항 */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex justify-center items-center mb-4 w-12 h-12 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-gray-900">공지사항</h3>
              <p className="text-sm text-gray-600">
                중요한 공지사항과 업데이트 내역을 확인하세요.
              </p>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <div className="inline-flex justify-center items-center mb-4 w-16 h-16 bg-gray-100 rounded-full">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">더 많은 기능 준비중</h3>
            <p className="text-gray-600">회사 운영에 필요한 다양한 정보와 기능들을 계속 추가하고 있습니다.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
