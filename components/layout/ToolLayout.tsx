import { Wrench, Car } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface ToolLayoutProps {
  children: ReactNode
  toolName: string
}

export default function ToolLayout({ children, toolName }: ToolLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Wrench className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">렌터카 업무툴</h1>
              <span className="text-sm text-gray-500">/ {toolName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/tools"
                className="px-3 py-1 text-sm text-gray-600 rounded transition-colors hover:text-green-600 hover:bg-green-50"
              >
                도구목록
              </Link>
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
      </div>

      {/* 도구 사용 영역 */}
      <div className="container px-4 py-6 mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {children}
        </div>
      </div>
    </main>
  )
}
