'use client'

import { useState, useEffect } from 'react'
import { Calendar, Phone, Car, Clock, User, Trash2, Search, CheckCircle, XCircle, DollarSign, RefreshCw, Banknote, Upload, FileText } from 'lucide-react'

interface Reservation {
  id: string
  customerName: string
  customerPhone: string
  vehicle?: string
  category?: string
  service?: string
  startDate: string
  endDate: string
  rentalDays: number
  pickupTime: string
  returnTime: string
  isOver26?: boolean
  dailyPrice?: number
  totalCost: number
  ageSurcharge?: number
  vehicleSurcharge?: number
  totalHours?: number
  baseHours?: number
  extraHours?: number
  baseCost?: number
  extraHoursCost?: number
  createdAt: string
  reservationStatus?: 'pending' | 'confirmed' | 'cancelled'
  depositReceived?: boolean
  depositAmount?: number
  depositDate?: string
}

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCheckingDeposits, setIsCheckingDeposits] = useState(false)
  const [isUploadingCsv, setIsUploadingCsv] = useState(false)

  // 시간을 일-시간 형태로 표시하는 함수
  const formatDaysAndHours = (totalHours: number) => {
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24

    if (days === 0) {
      return `${hours}시간`
    } else if (hours === 0) {
      return `${days}일`
    } else {
      return `${days}일 ${hours}시간`
    }
  }

  // 일반렌트카의 총 이용시간 계산 (연속 시간)
  const calculateTotalHoursForRegular = (reservation: Reservation) => {
    // 시작 시점: 시작날짜 + 시작시간
    const startDateTime = new Date(`${reservation.startDate}T${reservation.pickupTime}:00`)

    // 종료 시점: 종료날짜 + 종료시간
    const endDateTime = new Date(`${reservation.endDate}T${reservation.returnTime}:00`)

    // 두 시점 사이의 총 밀리초 차이
    const timeDiff = endDateTime.getTime() - startDateTime.getTime()

    // 시간 단위로 변환 (올림 처리)
    const totalHours = Math.ceil(timeDiff / (1000 * 60 * 60))

    return totalHours > 0 ? totalHours : 0
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = () => {
    // 일반렌트카 예약 로드
    const regularReservations = JSON.parse(localStorage.getItem('reservations') || '[]')

    // YC탁송 예약 로드
    const driverReservations = JSON.parse(localStorage.getItem('driverReservations') || '[]')

    // 두 배열을 합치고 최신순으로 정렬
    const allReservations = [...regularReservations, ...driverReservations]
    allReservations.sort((a: Reservation, b: Reservation) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setReservations(allReservations)
  }

  const deleteReservation = (id: string) => {
    if (confirm('이 예약을 삭제하시겠습니까?')) {
      const reservationToDelete = reservations.find(r => r.id === id)

      if (reservationToDelete?.service === 'YC탁송') {
        // YC탁송 예약 삭제
        const driverReservations = JSON.parse(localStorage.getItem('driverReservations') || '[]')
        const updatedDriverReservations = driverReservations.filter((r: Reservation) => r.id !== id)
        localStorage.setItem('driverReservations', JSON.stringify(updatedDriverReservations))
      } else {
        // 일반렌트카 예약 삭제
        const regularReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
        const updatedRegularReservations = regularReservations.filter((r: Reservation) => r.id !== id)
        localStorage.setItem('reservations', JSON.stringify(updatedRegularReservations))
      }

      // 화면 업데이트
      loadReservations()
    }
  }

  const confirmReservation = (id: string) => {
    const depositAmount = prompt('입금액을 입력하세요 (예: 100000):')

    if (depositAmount && !isNaN(Number(depositAmount))) {
      const reservationToUpdate = reservations.find(r => r.id === id)

      if (reservationToUpdate?.service === 'YC탁송') {
        // YC탁송 예약 업데이트
        const driverReservations = JSON.parse(localStorage.getItem('driverReservations') || '[]')
        const updatedDriverReservations = driverReservations.map((r: Reservation) =>
          r.id === id ? {
            ...r,
            reservationStatus: 'confirmed',
            depositReceived: true,
            depositAmount: Number(depositAmount),
            depositDate: new Date().toISOString()
          } : r
        )
        localStorage.setItem('driverReservations', JSON.stringify(updatedDriverReservations))
      } else {
        // 일반렌트카 예약 업데이트
        const regularReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
        const updatedRegularReservations = regularReservations.map((r: Reservation) =>
          r.id === id ? {
            ...r,
            reservationStatus: 'confirmed',
            depositReceived: true,
            depositAmount: Number(depositAmount),
            depositDate: new Date().toISOString()
          } : r
        )
        localStorage.setItem('reservations', JSON.stringify(updatedRegularReservations))
      }

      // 화면 업데이트
      loadReservations()
      alert(`${reservationToUpdate?.customerName}님의 예약이 확정되었습니다!\n입금액: ${formatPrice(Number(depositAmount))}`)
    }
  }

  const cancelReservation = (id: string) => {
    if (confirm('이 예약을 취소하시겠습니까?')) {
      const reservationToUpdate = reservations.find(r => r.id === id)

      if (reservationToUpdate?.service === 'YC탁송') {
        // YC탁송 예약 업데이트
        const driverReservations = JSON.parse(localStorage.getItem('driverReservations') || '[]')
        const updatedDriverReservations = driverReservations.map((r: Reservation) =>
          r.id === id ? { ...r, reservationStatus: 'cancelled' } : r
        )
        localStorage.setItem('driverReservations', JSON.stringify(updatedDriverReservations))
      } else {
        // 일반렌트카 예약 업데이트
        const regularReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
        const updatedRegularReservations = regularReservations.map((r: Reservation) =>
          r.id === id ? { ...r, reservationStatus: 'cancelled' } : r
        )
        localStorage.setItem('reservations', JSON.stringify(updatedRegularReservations))
      }

      // 화면 업데이트
      loadReservations()
      alert(`${reservationToUpdate?.customerName}님의 예약이 취소되었습니다.`)
    }
  }

  // 국민은행 API 입금내역 확인 (시뮬레이션)
  const checkBankDeposits = async () => {
    setIsCheckingDeposits(true)

    try {
      // 실제 국민은행 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2초 대기

      // 시뮬레이션: 입금 내역 데이터
      const mockDeposits = [
        { depositor: '김철수', amount: 100000, date: new Date().toISOString() },
        { depositor: '박영희', amount: 100000, date: new Date().toISOString() },
        // 더 많은 입금 내역...
      ]

      let confirmedCount = 0

      // 대기중인 예약들과 입금내역 매칭
      const pendingReservations = reservations.filter(r =>
        !r.reservationStatus || r.reservationStatus === 'pending'
      )

      for (const reservation of pendingReservations) {
        // 고객명과 입금자명 매칭 (부분 일치)
        const matchingDeposit = mockDeposits.find(deposit =>
          deposit.depositor.includes(reservation.customerName) &&
          deposit.amount >= 100000 // 예약금 10만원 이상
        )

        if (matchingDeposit) {
          // 자동 예약 확정
          const reservationToUpdate = reservations.find(r => r.id === reservation.id)

          if (reservationToUpdate?.service === 'YC탁송') {
            const driverReservations = JSON.parse(localStorage.getItem('driverReservations') || '[]')
            const updatedDriverReservations = driverReservations.map((r: Reservation) =>
              r.id === reservation.id ? {
                ...r,
                reservationStatus: 'confirmed',
                depositReceived: true,
                depositAmount: matchingDeposit.amount,
                depositDate: matchingDeposit.date
              } : r
            )
            localStorage.setItem('driverReservations', JSON.stringify(updatedDriverReservations))
          } else {
            const regularReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
            const updatedRegularReservations = regularReservations.map((r: Reservation) =>
              r.id === reservation.id ? {
                ...r,
                reservationStatus: 'confirmed',
                depositReceived: true,
                depositAmount: matchingDeposit.amount,
                depositDate: matchingDeposit.date
              } : r
            )
            localStorage.setItem('reservations', JSON.stringify(updatedRegularReservations))
          }

          confirmedCount++
        }
      }

      // 화면 업데이트
      loadReservations()

      if (confirmedCount > 0) {
        alert(`🎉 ${confirmedCount}건의 예약이 자동 확정되었습니다!\n\n국민은행 입금내역과 매칭되었습니다.`)
      } else {
        alert('💡 새로운 입금내역이 없습니다.\n\n확인된 예약금 입금이 없습니다.')
      }

    } catch (error) {
      console.error('입금내역 확인 실패:', error)
      alert('❌ 입금내역 확인 중 오류가 발생했습니다.\n\n잠시 후 다시 시도해주세요.')
    } finally {
      setIsCheckingDeposits(false)
    }
  }

  // CSV 파일 업로드로 입금내역 확인 (개인 테스트용)
  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      alert('❌ CSV 파일만 업로드 가능합니다.')
      return
    }

    setIsUploadingCsv(true)

    try {
      const text = await file.text()
      const lines = text.split('\n')

      // CSV 파싱 (국민은행 입출금내역 형식)
      const deposits = []

      for (let i = 1; i < lines.length; i++) { // 첫 번째 줄은 헤더
        const line = lines[i].trim()
        if (!line) continue

        const columns = line.split(',')
        if (columns.length >= 6) {
          const [date, , description, , amount, balance] = columns
          const cleanAmount = parseInt(amount.replace(/[^0-9]/g, ''))

          // 입금(+) 내역만 필터링
          if (cleanAmount > 0 && description) {
            // 입금자명 추출 (보통 "입금 홍길동" 또는 "홍길동" 형태)
            const depositorMatch = description.match(/([가-힣]{2,4})/);
            const depositor = depositorMatch ? depositorMatch[1] : description

            deposits.push({
              depositor: depositor,
              amount: cleanAmount,
              date: new Date().toISOString(), // 실제로는 CSV의 date 파싱
              description: description
            })
          }
        }
      }

      if (deposits.length === 0) {
        alert('💡 CSV 파일에서 입금 내역을 찾을 수 없습니다.\n\n• 국민은행 입출금내역 CSV 파일인지 확인해주세요.\n• 예상 형식: 거래일자, 거래시간, 거래내용, 출금, 입금, 잔액')
        return
      }

      let confirmedCount = 0

      // 대기중인 예약들과 입금내역 매칭
      const pendingReservations = reservations.filter(r =>
        !r.reservationStatus || r.reservationStatus === 'pending'
      )

      for (const reservation of pendingReservations) {
        // 고객명과 입금자명 매칭 (부분 일치)
        const matchingDeposit = deposits.find(deposit =>
          (deposit.depositor.includes(reservation.customerName) ||
            reservation.customerName.includes(deposit.depositor)) &&
          deposit.amount >= 100000 // 예약금 10만원 이상
        )

        if (matchingDeposit) {
          // 자동 예약 확정
          const reservationToUpdate = reservations.find(r => r.id === reservation.id)

          if (reservationToUpdate?.service === 'YC탁송') {
            const driverReservations = JSON.parse(localStorage.getItem('driverReservations') || '[]')
            const updatedDriverReservations = driverReservations.map((r: Reservation) =>
              r.id === reservation.id ? {
                ...r,
                reservationStatus: 'confirmed',
                depositReceived: true,
                depositAmount: matchingDeposit.amount,
                depositDate: matchingDeposit.date
              } : r
            )
            localStorage.setItem('driverReservations', JSON.stringify(updatedDriverReservations))
          } else {
            const regularReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
            const updatedRegularReservations = regularReservations.map((r: Reservation) =>
              r.id === reservation.id ? {
                ...r,
                reservationStatus: 'confirmed',
                depositReceived: true,
                depositAmount: matchingDeposit.amount,
                depositDate: matchingDeposit.date
              } : r
            )
            localStorage.setItem('reservations', JSON.stringify(updatedRegularReservations))
          }

          confirmedCount++
        }
      }

      // 화면 업데이트
      loadReservations()

      if (confirmedCount > 0) {
        alert(`🎉 ${confirmedCount}건의 예약이 자동 확정되었습니다!\n\n총 ${deposits.length}건의 입금내역에서 매칭되었습니다.`)
      } else {
        alert(`💡 매칭된 예약이 없습니다.\n\n• 총 ${deposits.length}건의 입금내역을 확인했습니다.\n• 고객명과 입금자명이 일치하는지 확인해주세요.\n• 예약금이 10만원 이상인지 확인해주세요.`)
      }

    } catch (error) {
      console.error('CSV 파일 처리 실패:', error)
      alert('❌ CSV 파일 처리 중 오류가 발생했습니다.\n\n파일 형식을 확인해주세요.')
    } finally {
      setIsUploadingCsv(false)
      // 파일 입력 초기화
      if (event.target) {
        event.target.value = ''
      }
    }
  }

  // 테스트용 샘플 예약 생성
  const createSampleReservations = () => {
    if (confirm('테스트용 샘플 예약을 생성하시겠습니까?\n\n김철수, 박영희, 이민수, 최지원, 홍길동 고객의 예약이 추가됩니다.')) {
      const sampleReservations = [
        {
          id: `sample-${Date.now()}-1`,
          customerName: '김철수',
          customerPhone: '010-1234-5678',
          startDate: '2024-01-20',
          endDate: '2024-01-22',
          pickupTime: '09:00',
          returnTime: '18:00',
          selectedVehicle: '1',
          vehicleName: 'QM6',
          totalCost: 240000,
          service: '일반렌트카',
          reservationStatus: 'pending' as const
        },
        {
          id: `sample-${Date.now()}-2`,
          customerName: '박영희',
          customerPhone: '010-2345-6789',
          startDate: '2024-01-21',
          endDate: '2024-01-23',
          pickupTime: '10:00',
          returnTime: '17:00',
          selectedVehicle: '2',
          vehicleName: 'XM3',
          totalCost: 180000,
          service: '일반렌트카',
          reservationStatus: 'pending' as const
        },
        {
          id: `sample-${Date.now()}-3`,
          customerName: '이민수',
          customerPhone: '010-3456-7890',
          startDate: '2024-01-22',
          endDate: '2024-01-24',
          pickupTime: '08:00',
          returnTime: '19:00',
          selectedVehicle: '3',
          vehicleName: '팰리세이드',
          totalCost: 420000,
          service: 'YC탁송',
          reservationStatus: 'pending' as const
        },
        {
          id: `sample-${Date.now()}-4`,
          customerName: '최지원',
          customerPhone: '010-4567-8901',
          startDate: '2024-01-23',
          endDate: '2024-01-25',
          pickupTime: '11:00',
          returnTime: '16:00',
          selectedVehicle: '4',
          vehicleName: '쏘렌토',
          totalCost: 320000,
          service: 'YC탁송',
          reservationStatus: 'pending' as const
        },
        {
          id: `sample-${Date.now()}-5`,
          customerName: '홍길동',
          customerPhone: '010-5678-9012',
          startDate: '2024-01-24',
          endDate: '2024-01-26',
          pickupTime: '09:30',
          returnTime: '18:30',
          selectedVehicle: '5',
          vehicleName: 'G90',
          totalCost: 480000,
          service: '일반렌트카',
          reservationStatus: 'pending' as const
        }
      ]

      // 일반렌트카 예약 저장
      const regularReservations = sampleReservations.filter(r => r.service === '일반렌트카')
      const existingRegular = JSON.parse(localStorage.getItem('reservations') || '[]')
      localStorage.setItem('reservations', JSON.stringify([...existingRegular, ...regularReservations]))

      // YC탁송 예약 저장
      const driverReservations = sampleReservations.filter(r => r.service === 'YC탁송')
      const existingDriver = JSON.parse(localStorage.getItem('driverReservations') || '[]')
      localStorage.setItem('driverReservations', JSON.stringify([...existingDriver, ...driverReservations]))

      // 화면 업데이트
      loadReservations()
      alert(`🎉 테스트용 샘플 예약 ${sampleReservations.length}건이 생성되었습니다!\n\n이제 CSV 파일을 업로드하여 자동 매칭을 테스트해보세요.`)
    }
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredReservations = reservations.filter(reservation =>
    reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.customerPhone.includes(searchTerm) ||
    (reservation.vehicle && reservation.vehicle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (reservation.service && reservation.service.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="px-4 mx-auto max-w-full">
      <div className="flex items-center mb-4">
        <Calendar className="mr-3 w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">예약리스트 관리</h2>
      </div>

      {/* Search Bar and Bank Check */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="고객명, 전화번호, 차량명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        {/* CSV 업로드 버튼 */}
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            disabled={isUploadingCsv}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="csvUpload"
          />
          <label
            htmlFor="csvUpload"
            className={`px-3 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center cursor-pointer text-sm ${isUploadingCsv
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
              }`}
          >
            {isUploadingCsv ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                처리중...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                📄 CSV업로드
              </>
            )}
          </label>
        </div>

        <button
          onClick={checkBankDeposits}
          disabled={isCheckingDeposits}
          className={`px-3 py-2 rounded-lg font-semibold text-white transition-all duration-200 flex items-center text-sm ${isCheckingDeposits
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {isCheckingDeposits ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              확인중...
            </>
          ) : (
            <>
              <Banknote className="w-4 h-4 mr-2" />
              🏦 API확인
            </>
          )}
        </button>
      </div>

      {/* CSV 업로드 안내 */}
      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center mb-2">
          <FileText className="w-4 h-4 mr-2 text-green-600" />
          <h3 className="font-semibold text-green-800 text-sm">🧪 개인 테스트 방법</h3>
        </div>
        <div className="text-xs text-green-700 space-y-1">
          <p>1. 국민은행 인터넷뱅킹 → 조회 → 입출금내역 → CSV 다운로드</p>
          <p>2. 위의 "📄 CSV업로드" 버튼으로 파일 업로드</p>
          <p>3. 자동으로 예약과 입금내역 매칭 → 예약 확정</p>
          <p className="text-blue-600 font-semibold">💡 테스트용 샘플 CSV: sample_bank_transactions.csv (프로젝트 폴더)</p>
        </div>
        <button
          onClick={createSampleReservations}
          className="mt-2 px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors"
        >
          🧪 테스트용 샘플 예약 생성
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-semibold">총 예약</div>
          <div className="text-2xl font-bold text-purple-800">{reservations.length}건</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-semibold">오늘 예약</div>
          <div className="text-2xl font-bold text-green-800">
            {reservations.filter(r => r.startDate === new Date().toISOString().split('T')[0]).length}건
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-semibold">총 예상 매출</div>
          <div className="text-2xl font-bold text-blue-800">
            {formatPrice(reservations.reduce((sum, r) => sum + r.totalCost, 0))}
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-semibold">확정된 예약</div>
          <div className="text-2xl font-bold text-green-800">
            {reservations.filter(r => r.reservationStatus === 'confirmed').length}건
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-600 font-semibold">예약금 입금액</div>
          <div className="text-2xl font-bold text-orange-800">
            {formatPrice(reservations.reduce((sum, r) => sum + (r.depositAmount || 0), 0))}
          </div>
        </div>
      </div>

      {/* Reservation List */}
      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? '검색 결과가 없습니다.' : '아직 예약이 없습니다.'}
            </p>
            <p className="text-gray-400 text-sm">
              일반렌트카나 YC탁송에서 예약을 추가해보세요.
            </p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div key={reservation.id} className={`p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${reservation.reservationStatus === 'confirmed'
              ? 'bg-green-50 border-green-200'
              : reservation.reservationStatus === 'cancelled'
                ? 'bg-red-50 border-red-200'
                : 'bg-white border-gray-200'
              }`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">{reservation.customerName}</h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${reservation.service === 'YC탁송'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                    }`}>
                    {reservation.service === 'YC탁송' ? 'YC탁송' : reservation.category}
                  </span>
                  {/* 예약 상태 표시 */}
                  {reservation.reservationStatus === 'confirmed' && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                      ✅ 확정됨
                    </span>
                  )}
                  {reservation.reservationStatus === 'cancelled' && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                      ❌ 취소됨
                    </span>
                  )}
                  {(!reservation.reservationStatus || reservation.reservationStatus === 'pending') && (
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
                      ⏳ 대기중
                    </span>
                  )}
                </div>
                <div className="flex space-x-1">
                  {(!reservation.reservationStatus || reservation.reservationStatus === 'pending') && (
                    <>
                      <button
                        onClick={() => confirmReservation(reservation.id)}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="예약 확정"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => cancelReservation(reservation.id)}
                        className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
                        title="예약 취소"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteReservation(reservation.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                    title="예약 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                {/* 고객 정보 */}
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{reservation.customerPhone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Car className="w-4 h-4 mr-2" />
                    <span>{reservation.service === 'YC탁송' ? `YC탁송 - ${reservation.vehicle || '차량미선택'}` : reservation.vehicle}</span>
                  </div>
                </div>

                {/* 예약 정보 */}
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(reservation.startDate)} ~ {formatDate(reservation.endDate)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{reservation.pickupTime} ~ {reservation.returnTime}</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-semibold">{reservation.rentalDays}일</span>
                    {reservation.service === 'YC탁송' ? (
                      <span className="ml-1">· {formatDaysAndHours(reservation.totalHours || 0)}</span>
                    ) : (
                      <span className="ml-1">· {formatDaysAndHours(calculateTotalHoursForRegular(reservation))}</span>
                    )}
                    {reservation.service !== 'YC탁송' && (
                      <span className="ml-1 text-xs">({reservation.isOver26 ? '26세+' : '26세- 할증'})</span>
                    )}
                  </div>
                </div>

                {/* 요금 정보 */}
                <div className="space-y-2">
                  {reservation.service === 'YC탁송' ? (
                    <>
                      <div className="text-gray-600">
                        기본요금: <span className="font-semibold text-green-700">{formatPrice(reservation.baseCost || 0)}</span>
                      </div>
                      {reservation.vehicleSurcharge && reservation.vehicleSurcharge > 0 && (
                        <div className="text-gray-600">
                          차량할증료: <span className="font-semibold text-purple-600">{formatPrice(reservation.vehicleSurcharge)}</span>
                        </div>
                      )}
                      {reservation.extraHoursCost && reservation.extraHoursCost > 0 && (
                        <div className="text-gray-600">
                          추가시간료: <span className="font-semibold text-orange-600">{formatPrice(reservation.extraHoursCost)}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="text-gray-600">
                        일일요금: <span className="font-semibold text-green-700">{formatPrice(reservation.dailyPrice || 0)}</span>
                      </div>
                      {reservation.ageSurcharge && reservation.ageSurcharge > 0 && (
                        <div className="text-gray-600">
                          할증료: <span className="font-semibold text-orange-600">{formatPrice(reservation.ageSurcharge)}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="text-gray-900">
                    총액: <span className={`font-bold text-lg ${reservation.service === 'YC탁송' ? 'text-blue-700' : 'text-purple-700'
                      }`}>{formatPrice(reservation.totalCost)}</span>
                  </div>
                  {reservation.depositReceived && (
                    <div className="text-green-700 flex items-center mt-1">
                      <DollarSign className="w-4 h-4 mr-1" />
                      예약금: <span className="font-bold">{formatPrice(reservation.depositAmount || 0)}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({new Date(reservation.depositDate || '').toLocaleDateString('ko-KR')})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                등록일시: {formatDateTime(reservation.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clear All Button */}
      {reservations.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              if (confirm('모든 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                localStorage.removeItem('reservations')
                localStorage.removeItem('driverReservations')
                setReservations([])
              }
            }}
            className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            모든 예약 삭제
          </button>
        </div>
      )}
    </div>
  )
}
