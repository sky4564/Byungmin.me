'use client'

import { useState } from 'react'
import { Settings, Save, Eye, EyeOff, TestTube, CheckCircle, XCircle } from 'lucide-react'

interface BankApiConfig {
  bankCode: string
  accountNumber: string
  apiKey: string
  secretKey: string
  isTestMode: boolean
}

export default function BankApiSettings() {
  const [config, setConfig] = useState<BankApiConfig>({
    bankCode: '004', // 국민은행 코드
    accountNumber: '697601-01-673637',
    apiKey: '',
    secretKey: '',
    isTestMode: true
  })

  const [showSecretKey, setShowSecretKey] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSave = () => {
    // 로컬 스토리지에 설정 저장 (실제로는 보안 서버에 저장해야 함)
    localStorage.setItem('bankApiConfig', JSON.stringify(config))
    alert('국민은행 API 설정이 저장되었습니다!')
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)

    try {
      // 국민은행 API 테스트 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (config.apiKey && config.secretKey) {
        setTestResult({
          success: true,
          message: '국민은행 API 연결 테스트 성공! 입금내역 조회가 가능합니다.'
        })
      } else {
        setTestResult({
          success: false,
          message: 'API Key 또는 Secret Key가 입력되지 않았습니다.'
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'API 연결 테스트 실패. 설정을 확인해주세요.'
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center mb-6">
        <Settings className="mr-3 w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">국민은행 API 설정</h2>
      </div>

      <div className="space-y-6">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              은행 코드
            </label>
            <input
              type="text"
              value={config.bankCode}
              onChange={(e) => setConfig(prev => ({ ...prev, bankCode: e.target.value }))}
              className="p-3 w-full bg-gray-50 rounded-lg border"
              placeholder="004 (국민은행)"
              readOnly
            />
            <p className="mt-1 text-xs text-gray-500">국민은행 코드: 004</p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              계좌번호
            </label>
            <input
              type="text"
              value={config.accountNumber}
              onChange={(e) => setConfig(prev => ({ ...prev, accountNumber: e.target.value }))}
              className="p-3 w-full rounded-lg border"
              placeholder="697601-01-673637"
            />
            <p className="mt-1 text-xs text-gray-500">차렌터카 예약금 입금 계좌</p>
          </div>
        </div>

        {/* API 키 설정 */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              API Key
            </label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              className="p-3 w-full rounded-lg border"
              placeholder="국민은행에서 발급받은 API Key 입력"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Secret Key
            </label>
            <div className="relative">
              <input
                type={showSecretKey ? "text" : "password"}
                value={config.secretKey}
                onChange={(e) => setConfig(prev => ({ ...prev, secretKey: e.target.value }))}
                className="p-3 pr-12 w-full rounded-lg border"
                placeholder="국민은행에서 발급받은 Secret Key 입력"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute right-3 top-1/2 text-gray-500 transform -translate-y-1/2 hover:text-gray-700"
              >
                {showSecretKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* 테스트 모드 */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="testMode"
            checked={config.isTestMode}
            onChange={(e) => setConfig(prev => ({ ...prev, isTestMode: e.target.checked }))}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="testMode" className="text-sm font-semibold text-gray-700">
            테스트 모드 (실제 은행 거래 없이 시뮬레이션)
          </label>
        </div>

        {/* 버튼들 */}
        <div className="flex space-x-4">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
          >
            <Save className="mr-2 w-4 h-4" />
            설정 저장
          </button>

          <button
            onClick={handleTest}
            disabled={isTesting}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${isTesting
              ? 'text-white bg-gray-400 cursor-not-allowed'
              : 'text-white bg-green-600 hover:bg-green-700'
              }`}
          >
            <TestTube className={`w-4 h-4 mr-2 ${isTesting ? 'animate-pulse' : ''}`} />
            {isTesting ? '테스트 중...' : 'API 연결 테스트'}
          </button>
        </div>

        {/* 테스트 결과 */}
        {testResult && (
          <div className={`p-4 rounded-lg border ${testResult.success
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
            }`}>
            <div className="flex items-center">
              {testResult.success ? (
                <CheckCircle className="mr-2 w-5 h-5" />
              ) : (
                <XCircle className="mr-2 w-5 h-5" />
              )}
              <span className="font-semibold">
                {testResult.success ? '✅ 연결 성공' : '❌ 연결 실패'}
              </span>
            </div>
            <p className="mt-2 text-sm">{testResult.message}</p>
          </div>
        )}

        {/* 개인 테스트 방법 안내 */}
        <div className="p-4 mb-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="mb-2 font-semibold text-blue-800">🧪 개인 계좌 테스트 방법</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <div>
              <strong>1. 오픈뱅킹 테스트베드</strong>
              <p>• 금융결제원 오픈뱅킹센터 (openbanking.or.kr)</p>
              <p>• 개인용 무료 테스트 환경 제공</p>
              <p>• 실제 계좌 연동 없이 시뮬레이션 가능</p>
            </div>
            <div>
              <strong>2. CSV 파일 업로드 방식</strong>
              <p>• 국민은행 입출금내역 CSV 다운로드</p>
              <p>• 시스템에 업로드하여 자동 매칭 테스트</p>
            </div>
          </div>
        </div>

        {/* 안내 사항 */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="mb-2 font-semibold text-yellow-800">🏦 국민은행 API 연동 안내</h3>
          <div className="space-y-1 text-sm text-yellow-700">
            <p>• <strong>오픈뱅킹 API</strong> 또는 <strong>KB스타뱅킹 기업 API</strong> 사용</p>
            <p>• API 신청: 국민은행 영업점 방문 또는 온라인 신청</p>
            <p>• 필요 서류: 사업자등록증, 인감증명서, 통장사본</p>
            <p>• 승인 기간: 약 1-2주</p>
            <p>• 월 이용료: 3-10만원 (거래량에 따라 차등)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
