'use client'

import { useState, useEffect, useCallback } from 'react'
import { Car, Clock, Calendar, User, Calculator, Copy, Check, ChevronDown, ChevronUp, Zap, RotateCcw } from 'lucide-react'

interface Vehicle {
  id: string
  name: string
  category: string
  price_1_2_days: number
  price_3_4_days: number
  price_5_plus_days: number
  monthly_rent: number | null
  deposit: number
  fuel_type: string
}

interface RegularCalculationResult {
  vehicleCost: number
  ageSurcharge: number
  deliveryCost: number
  total: number
}

export default function RegularRentalCalculator() {
  // 기본값: 오늘부터 내일까지
  const today = new Date().toISOString().split('T')[0]

  // 빠른 기간 설정 함수
  const setQuickPeriod = (days: number) => {
    const start = new Date()
    const end = new Date()
    end.setDate(start.getDate() + days - 1) // days-1 because we include the start date

    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }

  // 빠른 시간 설정 함수
  const setQuickTime = (pickup: string, returnTime: string) => {
    setPickupTime(pickup)
    setReturnTime(returnTime)
  }

  // 시간을 슬라이더 값으로 변환
  const timeToSliderValue = (time: string) => {
    const [hours] = time.split(':').map(Number)
    // 24:00인 경우 슬라이더 값은 24로 설정
    if (hours === 0 && time === '24:00') {
      return '24'
    }
    return hours.toString()
  }

  // 슬라이더 값을 시간으로 변환
  const sliderValueToTime = (value: string) => {
    const hours = parseInt(value)
    if (hours === 24) {
      return '24:00' // 24시는 24:00으로 표시 (자정)
    }
    return `${hours.toString().padStart(2, '0')}:00`
  }

  // 시간대별 라벨
  const getTimeLabel = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    if (hour === 24) return '🌙 자정' // 24:00은 자정
    if (hour >= 4 && hour < 6) return '🌅 새벽'
    if (hour >= 6 && hour < 12) return '🌞 오전'
    if (hour >= 12 && hour < 18) return '☀️ 오후'
    if (hour >= 18 && hour < 22) return '🌆 저녁'
    if (hour >= 22 || hour < 4) return '🌙 야간'
    return ''
  }
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [selectedVehicle, setSelectedVehicle] = useState('1')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(tomorrow)
  const [pickupTime, setPickupTime] = useState('09:00')
  const [returnTime, setReturnTime] = useState('18:00')
  const [isOver26, setIsOver26] = useState(true)
  const [result, setResult] = useState<RegularCalculationResult | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [editableQuoteText, setEditableQuoteText] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]) // 기본적으로 모두 접힘
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryCost, setDeliveryCost] = useState(0)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [distanceInfo, setDistanceInfo] = useState<{ distance: string, duration: string, cost: number } | null>(null)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)

  // 본사 주소
  const COMPANY_ADDRESS = '인천광역시 연수구 경원대로534번길 11'

  // 거리 및 딜리버리 비용 계산 함수
  const calculateDistance = async () => {
    if (!deliveryAddress.trim()) {
      alert('배차 주소를 입력해주세요.')
      return
    }

    setIsCalculatingDistance(true)

    try {
      // Kakao Map 길찾기 API 시뮬레이션 (실제로는 API 키가 필요)
      // 실제 구현시에는 Kakao REST API 또는 Google Maps API 사용

      // 시뮬레이션된 응답 (실제로는 API 호출)
      await new Promise(resolve => setTimeout(resolve, 1500)) // 로딩 시뮬레이션

      // 간단한 거리 추정 로직 (실제로는 정확한 API 사용)
      const mockDistanceData = calculateMockDistance(deliveryAddress)

      // 딜리버리 비용 계산
      const rentalDays = calculateRentalDays()
      let calculatedCost = 0

      if (mockDistanceData.durationMinutes <= 20) {
        // 20분 이내: 1일은 3만원, 2일 이상은 무료
        calculatedCost = rentalDays === 1 ? 30000 : 0
      } else {
        // 20분 초과: 별도 협의 (기본 5만원으로 설정)
        calculatedCost = 50000
      }

      const distanceResult = {
        distance: mockDistanceData.distance,
        duration: mockDistanceData.duration,
        cost: calculatedCost
      }

      setDistanceInfo(distanceResult)
      setDeliveryCost(calculatedCost) // 자동으로 딜리버리 비용 설정

    } catch (error) {
      console.error('거리 계산 실패:', error)
      alert('❌ 거리 계산 중 오류가 발생했습니다.\n주소를 다시 확인해주세요.')
    } finally {
      setIsCalculatingDistance(false)
    }
  }

  // 모의 거리 계산 함수 (실제로는 지도 API 사용)
  const calculateMockDistance = (address: string) => {
    // 간단한 키워드 기반 거리 추정
    const lowerAddress = address.toLowerCase()

    // 인천 지역
    if (lowerAddress.includes('인천') || lowerAddress.includes('연수구') || lowerAddress.includes('남동구') || lowerAddress.includes('미추홀구')) {
      if (lowerAddress.includes('연수구')) {
        return { distance: '5.2km', duration: '12분', durationMinutes: 12 }
      } else {
        return { distance: '8.7km', duration: '18분', durationMinutes: 18 }
      }
    }

    // 서울 지역
    if (lowerAddress.includes('서울') || lowerAddress.includes('강남') || lowerAddress.includes('강서') || lowerAddress.includes('영등포')) {
      return { distance: '45.3km', duration: '52분', durationMinutes: 52 }
    }

    // 부천, 시흥 등 인근 지역
    if (lowerAddress.includes('부천') || lowerAddress.includes('시흥') || lowerAddress.includes('안산')) {
      return { distance: '15.8km', duration: '28분', durationMinutes: 28 }
    }

    // 기타 지역 (기본값)
    return { distance: '25.0km', duration: '35분', durationMinutes: 35 }
  }

  // 실제 Kakao Map API 연동 방법 (참고용 주석)
  /*
  실제 구현시 필요한 설정:
  
  1. Kakao 개발자 센터에서 앱 등록 및 API 키 발급
     - https://developers.kakao.com/
     - Web 플랫폼 도메인 등록
  
  2. HTML에 Kakao Map SDK 추가
     - <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_APP_KEY&libraries=services"></script>
  
  3. 거리 계산 API 호출 예시:
     
     const calculateRealDistance = async (destination: string) => {
       return new Promise((resolve, reject) => {
         const ps = new kakao.maps.services.Places()
         const origin = COMPANY_ADDRESS
         
         // 주소를 좌표로 변환
         ps.keywordSearch(destination, (data, status) => {
           if (status === kakao.maps.services.Status.OK) {
             const coords = new kakao.maps.LatLng(data[0].y, data[0].x)
             
             // 길찾기 서비스 사용
             const directions = new kakao.maps.services.Directions()
             directions.route({
               origin: origin,
               destination: coords,
               waypoints: [],
               priority: 'RECOMMEND'
             }, (result, status) => {
               if (status === kakao.maps.services.Status.OK) {
                 const route = result.routes[0]
                 resolve({
                   distance: (route.summary.distance / 1000).toFixed(1) + 'km',
                   duration: Math.ceil(route.summary.duration / 60) + '분',
                   durationMinutes: Math.ceil(route.summary.duration / 60)
                 })
               } else {
                 reject(new Error('길찾기 실패'))
               }
             })
           } else {
             reject(new Error('주소 검색 실패'))
           }
         })
       })
     }
  */

  // 실제 차량 가격표 데이터
  const vehicleData: Vehicle[] = [
    // 경차
    { id: '1', name: '모닝', category: '경차', price_1_2_days: 70000, price_3_4_days: 65000, price_5_plus_days: 60000, monthly_rent: 550000, deposit: 300000, fuel_type: '가솔린' },
    { id: '2', name: '스파크', category: '경차', price_1_2_days: 70000, price_3_4_days: 65000, price_5_plus_days: 60000, monthly_rent: 550000, deposit: 300000, fuel_type: '가솔린' },
    { id: '3', name: '레이', category: '경차', price_1_2_days: 70000, price_3_4_days: 65000, price_5_plus_days: 60000, monthly_rent: null, deposit: 300000, fuel_type: '가솔린' },

    // 준중형
    { id: '4', name: '베뉴', category: '준중형', price_1_2_days: 80000, price_3_4_days: 75000, price_5_plus_days: 70000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' },
    { id: '5', name: 'K3', category: '준중형', price_1_2_days: 80000, price_3_4_days: 75000, price_5_plus_days: 70000, monthly_rent: 650000, deposit: 500000, fuel_type: '가솔린' },
    { id: '6', name: '아반떼 AD', category: '준중형', price_1_2_days: 80000, price_3_4_days: 75000, price_5_plus_days: 70000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' },
    { id: '7', name: '아반떼 CN7', category: '준중형', price_1_2_days: 90000, price_3_4_days: 85000, price_5_plus_days: 80000, monthly_rent: 700000, deposit: 500000, fuel_type: '가솔린' },

    // 중형
    { id: '8', name: '소나타 뉴라이즈', category: '중형', price_1_2_days: 90000, price_3_4_days: 80000, price_5_plus_days: 70000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' },
    { id: '9', name: 'K5 2세대', category: '중형', price_1_2_days: 90000, price_3_4_days: 80000, price_5_plus_days: 70000, monthly_rent: 700000, deposit: 500000, fuel_type: '가솔린' },
    { id: '10', name: 'SM6', category: '중형', price_1_2_days: 90000, price_3_4_days: 80000, price_5_plus_days: 70000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' },
    { id: '11', name: '소나타 DN8', category: '중형', price_1_2_days: 100000, price_3_4_days: 90000, price_5_plus_days: 80000, monthly_rent: 800000, deposit: 500000, fuel_type: '가솔린' },
    { id: '12', name: 'K5 DL3', category: '중형', price_1_2_days: 100000, price_3_4_days: 90000, price_5_plus_days: 80000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' },
    { id: '13', name: '2026 K5 DL3', category: '중형', price_1_2_days: 110000, price_3_4_days: 100000, price_5_plus_days: 90000, monthly_rent: 900000, deposit: 500000, fuel_type: '가솔린' },
    { id: '14', name: '2026 소나타 the Edge', category: '중형', price_1_2_days: 110000, price_3_4_days: 100000, price_5_plus_days: 90000, monthly_rent: 900000, deposit: 500000, fuel_type: '가솔린' },

    // 준대형
    { id: '15', name: '그랜저 IG', category: '준대형', price_1_2_days: 110000, price_3_4_days: 100000, price_5_plus_days: 90000, monthly_rent: 900000, deposit: 500000, fuel_type: '가솔린' },
    { id: '16', name: '더 뉴 그랜저 IG', category: '준대형', price_1_2_days: 120000, price_3_4_days: 110000, price_5_plus_days: 100000, monthly_rent: 1200000, deposit: 500000, fuel_type: '가솔린' },
    { id: '17', name: 'GN7', category: '준대형', price_1_2_days: 150000, price_3_4_days: 140000, price_5_plus_days: 130000, monthly_rent: 1500000, deposit: 500000, fuel_type: '가솔린' },

    // SUV
    { id: '18', name: 'QM6', category: 'SUV', price_1_2_days: 110000, price_3_4_days: 100000, price_5_plus_days: 90000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' },
    { id: '19', name: '더 뉴 스포티지', category: 'SUV', price_1_2_days: 120000, price_3_4_days: 110000, price_5_plus_days: 100000, monthly_rent: 1000000, deposit: 500000, fuel_type: '가솔린' },
    { id: '19-1', name: '더 뉴 쏘렌토', category: 'SUV', price_1_2_days: 120000, price_3_4_days: 110000, price_5_plus_days: 100000, monthly_rent: 1000000, deposit: 500000, fuel_type: '디젤' },
    { id: '20', name: '싼타페 TM', category: 'SUV', price_1_2_days: 120000, price_3_4_days: 110000, price_5_plus_days: 100000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' },
    { id: '21', name: '싼타페 TM(풀옵션)', category: 'SUV', price_1_2_days: 130000, price_3_4_days: 120000, price_5_plus_days: 110000, monthly_rent: 1300000, deposit: 500000, fuel_type: '가솔린' },
    { id: '22', name: '스포티지 하이브리드', category: 'SUV', price_1_2_days: 130000, price_3_4_days: 120000, price_5_plus_days: 110000, monthly_rent: null, deposit: 500000, fuel_type: '하이브리드' },
    { id: '23', name: 'MX 싼타페', category: 'SUV', price_1_2_days: 150000, price_3_4_days: 140000, price_5_plus_days: 130000, monthly_rent: 1500000, deposit: 500000, fuel_type: '가솔린' },
    { id: '24', name: '팰리세이드', category: 'SUV', price_1_2_days: 150000, price_3_4_days: 140000, price_5_plus_days: 130000, monthly_rent: 1500000, deposit: 500000, fuel_type: '가솔린' },
    { id: '25', name: '2026 팰리세이드', category: 'SUV', price_1_2_days: 170000, price_3_4_days: 160000, price_5_plus_days: 150000, monthly_rent: 1500000, deposit: 500000, fuel_type: '가솔린' },
    { id: '26', name: '모하비 더 마스터', category: 'SUV', price_1_2_days: 150000, price_3_4_days: 140000, price_5_plus_days: 130000, monthly_rent: 1500000, deposit: 500000, fuel_type: '가솔린' },
    { id: '27', name: 'GV80', category: 'SUV', price_1_2_days: 250000, price_3_4_days: 240000, price_5_plus_days: 230000, monthly_rent: 2500000, deposit: 1000000, fuel_type: '가솔린' },

    // 대형
    { id: '28', name: 'G80', category: '대형', price_1_2_days: 200000, price_3_4_days: 190000, price_5_plus_days: 180000, monthly_rent: 2500000, deposit: 1000000, fuel_type: '가솔린' },
    { id: '29', name: 'E250', category: '대형', price_1_2_days: 250000, price_3_4_days: 240000, price_5_plus_days: 230000, monthly_rent: null, deposit: 1000000, fuel_type: '가솔린' },
    { id: '30', name: 'G90', category: '대형', price_1_2_days: 250000, price_3_4_days: 240000, price_5_plus_days: 230000, monthly_rent: 3000000, deposit: 1000000, fuel_type: '가솔린' },
    { id: '31', name: 'S350', category: '대형', price_1_2_days: 500000, price_3_4_days: 490000, price_5_plus_days: 480000, monthly_rent: 6000000, deposit: 2000000, fuel_type: '가솔린' },

    // 승합차
    { id: '32', name: '더 뉴 카니발', category: '승합차', price_1_2_days: 130000, price_3_4_days: 120000, price_5_plus_days: 110000, monthly_rent: 1300000, deposit: 500000, fuel_type: '경유' },
    { id: '33', name: '더 뉴 카니발 4세대', category: '승합차', price_1_2_days: 150000, price_3_4_days: 140000, price_5_plus_days: 130000, monthly_rent: 1400000, deposit: 500000, fuel_type: '가솔린' },
    { id: '34', name: '2026 카니발', category: '승합차', price_1_2_days: 170000, price_3_4_days: 160000, price_5_plus_days: 150000, monthly_rent: 1500000, deposit: 500000, fuel_type: '경유' },
    { id: '35', name: '스타렉스 12인', category: '승합차', price_1_2_days: 130000, price_3_4_days: 120000, price_5_plus_days: 110000, monthly_rent: 1300000, deposit: 500000, fuel_type: '가솔린' },
    { id: '36', name: '스타리아 11인', category: '승합차', price_1_2_days: 170000, price_3_4_days: 160000, price_5_plus_days: 150000, monthly_rent: 1500000, deposit: 500000, fuel_type: '디젤' },
    { id: '37', name: '솔라티 15인승', category: '승합차', price_1_2_days: 300000, price_3_4_days: 250000, price_5_plus_days: 200000, monthly_rent: null, deposit: 500000, fuel_type: '가솔린' }
  ]

  // 카테고리별로 그룹화
  const vehicleCategories = vehicleData.reduce((acc, vehicle) => {
    if (!acc[vehicle.category]) {
      acc[vehicle.category] = []
    }
    acc[vehicle.category].push(vehicle)
    return acc
  }, {} as Record<string, typeof vehicleData>)

  // 대여일수 계산 (시작일과 종료일 모두 포함)
  const calculateRentalDays = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const timeDiff = end.getTime() - start.getTime()
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1 // +1 해서 시작일도 포함
    return dayDiff > 0 ? dayDiff : 0
  }

  // 총 이용시간 계산 (연속 시간 - 시작일시부터 종료일시까지)
  const calculateTotalHours = () => {
    if (!startDate || !endDate) return 0

    // 시작 시점: 시작날짜 + 시작시간
    const startDateTime = new Date(`${startDate}T${pickupTime}:00`)

    // 종료 시점: 종료날짜 + 종료시간
    const endDateTime = new Date(`${endDate}T${returnTime}:00`)

    // 두 시점 사이의 총 밀리초 차이
    const timeDiff = endDateTime.getTime() - startDateTime.getTime()

    // 시간 단위로 변환 (올림 처리)
    const totalHours = Math.ceil(timeDiff / (1000 * 60 * 60))

    return totalHours > 0 ? totalHours : 0
  }

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

  const calculateCost = () => {
    const rentalDays = calculateRentalDays()
    if (rentalDays <= 0) {
      alert('올바른 날짜를 선택해주세요.')
      return
    }

    const vehicle = vehicleData.find(v => v.id === selectedVehicle)
    if (!vehicle) return

    // 새로운 가격 체계 적용
    let vehicleCost = 0
    if (rentalDays <= 2) {
      vehicleCost = vehicle.price_1_2_days * rentalDays
    } else if (rentalDays <= 4) {
      vehicleCost = vehicle.price_3_4_days * rentalDays
    } else {
      vehicleCost = vehicle.price_5_plus_days * rentalDays
    }

    // 나이 할증료 (26세 미만 10%)
    const ageSurcharge = !isOver26 ? vehicleCost * 0.1 : 0

    // 딜리버리 비용: 거리 계산이 있으면 자동 계산값 사용, 없으면 수동 입력값 사용
    const finalDeliveryCost = distanceInfo ? distanceInfo.cost : deliveryCost

    const total = vehicleCost + ageSurcharge + finalDeliveryCost

    setResult({
      vehicleCost,
      ageSurcharge,
      deliveryCost: finalDeliveryCost,
      total
    })
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  // 현재 선택된 기간에 따른 일일 요금 계산
  const getCurrentDailyPrice = () => {
    const vehicle = vehicleData.find(v => v.id === selectedVehicle)
    if (!vehicle) return 0

    const rentalDays = calculateRentalDays()
    if (rentalDays <= 2) {
      return vehicle.price_1_2_days
    } else if (rentalDays <= 4) {
      return vehicle.price_3_4_days
    } else {
      return vehicle.price_5_plus_days
    }
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // 견적서 텍스트 생성 함수
  const generateQuoteText = useCallback(() => {
    if (!result) return ''

    const vehicle = vehicleData.find(v => v.id === selectedVehicle)
    if (!vehicle) return ''

    const rentalDays = calculateRentalDays()

    const text = `일반렌트카 견적서

이용 정보:
- 차량: ${vehicle.name}
- 카테고리: ${vehicle.category}
- 연료: ${vehicle.fuel_type}
- 대여기간: ${startDate} ~ ${endDate} (${formatDaysAndHours(calculateTotalHours())})
- 배차시간: ${pickupTime}
- 반납시간: ${returnTime}
- 운전자: ${isOver26 ? '만 26세 이상' : '만 26세 미만'}

요금 내역:
- 일일 요금: ${formatPrice(getCurrentDailyPrice())}
- 차량 대여료: ${formatPrice(result.vehicleCost)} (${rentalDays}일)${result.ageSurcharge > 0 ? `
- 나이 할증료: ${formatPrice(result.ageSurcharge)}` : ''}
- 딜리버리 비용: ${result.deliveryCost === 0 ? '무료' : formatPrice(result.deliveryCost)}${deliveryAddress && distanceInfo ? ` (${distanceInfo.duration})` : ''}

총 이용요금: ${formatPrice(result.total)}`

    setEditableQuoteText(text)
    return text
  }, [result, selectedVehicle, startDate, endDate, pickupTime, returnTime, isOver26, deliveryCost])

  // 상태 변경 시 견적서 텍스트 자동 갱신
  useEffect(() => {
    if (result) {
      generateQuoteText()
    }
  }, [generateQuoteText, result])

  const copyToClipboard = async () => {
    const text = editableQuoteText || generateQuoteText()
    if (!text) return

    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('복사 실패:', err)
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const addToReservationList = () => {
    if (!result || !customerName.trim() || !customerPhone.trim()) {
      alert('고객 정보를 모두 입력하고 계산을 완료해주세요.')
      return
    }

    const vehicle = vehicleData.find(v => v.id === selectedVehicle)
    if (!vehicle) return

    const reservation = {
      id: Date.now().toString(),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      vehicle: vehicle.name,
      category: vehicle.category,
      startDate,
      endDate,
      rentalDays: calculateRentalDays(),
      pickupTime,
      returnTime,
      isOver26,
      dailyPrice: getCurrentDailyPrice(),
      totalCost: result.total,
      ageSurcharge: result.ageSurcharge,
      deliveryCost: result.deliveryCost,
      createdAt: new Date().toISOString()
    }

    // localStorage에 저장
    const existingReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
    existingReservations.push(reservation)
    localStorage.setItem('reservations', JSON.stringify(existingReservations))

    alert('예약리스트에 추가되었습니다!')

    // 입력 필드 초기화
    setCustomerName('')
    setCustomerPhone('')
  }

  return (
    <div className="px-4 mx-auto max-w-full">
      <div className="flex items-center mb-4">
        <Car className="mr-3 w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900">일반렌트카 금액산정</h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* 1번째 컬럼: 차량 종류만 */}
        <div className="space-y-4">
          {/* Vehicle Type */}
          <div>
            <label className="flex items-center mb-2 text-lg font-bold text-gray-800">
              <Car className="mr-2 w-5 h-5" />
              차량 종류
            </label>
            <div className="space-y-2">
              {Object.entries(vehicleCategories).map(([category, vehicles]) => (
                <div key={category} className="rounded-lg border">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="flex justify-between items-center p-2 w-full text-left rounded-lg hover:bg-gray-50"
                  >
                    <span className="text-sm font-bold text-gray-700">{category}</span>
                    {expandedCategories.includes(category) ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {expandedCategories.includes(category) && (
                    <div className="p-2 border-t">
                      <div className="grid grid-cols-2 gap-2">
                        {vehicles.map((vehicle) => (
                          <label key={vehicle.id} className="flex items-center p-2 min-w-0 text-xs rounded border cursor-pointer hover:bg-green-50 hover:border-green-300">
                            <input
                              type="radio"
                              name="vehicle"
                              value={vehicle.id}
                              checked={selectedVehicle === vehicle.id}
                              onChange={(e) => setSelectedVehicle(e.target.value)}
                              className="flex-shrink-0 mr-2"
                            />
                            <div className="overflow-hidden text-xs font-bold text-gray-900 whitespace-nowrap text-ellipsis">{vehicle.name}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2번째 컬럼: 대여기간부터 끝까지 */}
        <div className="space-y-4">
          {/* Rental Period */}
          <div>
            <label className="flex items-center mb-1 text-sm font-bold text-gray-800">
              <Calendar className="mr-1 w-4 h-4" />
              대여 기간
            </label>

            {/* 프리셋 버튼들 */}
            <div className="grid grid-cols-4 gap-1 mb-2">
              <button
                onClick={() => setQuickPeriod(1)}
                className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded transition-colors hover:bg-blue-200"
              >
                1일
              </button>
              <button
                onClick={() => setQuickPeriod(2)}
                className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded transition-colors hover:bg-blue-200"
              >
                2일
              </button>
              <button
                onClick={() => setQuickPeriod(3)}
                className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded transition-colors hover:bg-blue-200"
              >
                3일
              </button>
              <button
                onClick={() => setQuickPeriod(7)}
                className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded transition-colors hover:bg-blue-200"
              >
                1주일
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || today}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
                />
              </div>
            </div>
            {startDate && endDate && calculateRentalDays() > 0 && (
              <div className="mt-1 text-xs font-bold text-blue-600">
                총 {formatDaysAndHours(calculateTotalHours())} 이용
              </div>
            )}
          </div>

          {/* Pickup and Return Times */}
          <div>
            <label className="flex items-center mb-1 text-sm font-bold text-gray-800">
              <Clock className="mr-1 w-4 h-4" />
              이용 시간
            </label>

            {/* 시간 프리셋 버튼들 */}
            <div className="grid grid-cols-3 gap-1 mb-2">
              <button
                onClick={() => setQuickTime('09:00', '18:00')}
                className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded transition-colors hover:bg-green-200"
              >
                🌅 9-18시
              </button>
              <button
                onClick={() => setQuickTime('10:00', '19:00')}
                className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded transition-colors hover:bg-green-200"
              >
                ☀️ 10-19시
              </button>
              <button
                onClick={() => setQuickTime('08:00', '20:00')}
                className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded transition-colors hover:bg-green-200"
              >
                🌙 8-20시
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="time"

                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
              />
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
              />
            </div>

            {/* 시간 슬라이더 */}
            <div className="p-4 mt-2 rounded-lg border-2 bg-slate-50">
              <div className="flex items-center mb-3 text-xs font-semibold text-gray-700">
                🎚️ 드래그로 시간 조정 (새벽 4시 ~ 자정 24시)
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="slider-container">
                  <label className="block mb-3 text-xs font-semibold text-blue-700">📍 픽업 시간</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="4"
                      max="24"
                      value={timeToSliderValue(pickupTime)}
                      onChange={(e) => setPickupTime(sliderValueToTime(e.target.value))}
                      className="w-full slider"
                    />

                  </div>
                  <div className="py-2 mt-3 text-sm font-bold text-center text-blue-800 bg-blue-100 rounded-lg">
                    {pickupTime} {getTimeLabel(pickupTime)}
                  </div>
                </div>
                <div className="slider-container">
                  <label className="block mb-3 text-xs font-semibold text-green-700">🏁 반납 시간</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="4"
                      max="24"
                      value={timeToSliderValue(returnTime)}
                      onChange={(e) => setReturnTime(sliderValueToTime(e.target.value))}
                      className="w-full slider"
                    />

                  </div>
                  <div className="py-2 mt-3 text-sm font-bold text-center text-green-800 bg-green-100 rounded-lg">
                    {returnTime} {getTimeLabel(returnTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Driver Age */}
          <div>
            <label className="flex items-center mb-1 text-sm font-bold text-gray-800">
              <User className="mr-1 w-4 h-4" />
              만 26세 이상입니까?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center p-2 rounded border cursor-pointer hover:bg-green-50">
                <input
                  type="radio"
                  name="age"
                  checked={isOver26}
                  onChange={() => setIsOver26(true)}
                  className="mr-1"
                />
                <div className="text-xs font-semibold text-gray-900">Yes</div>
              </label>
              <label className="flex items-center p-2 rounded border cursor-pointer hover:bg-red-50">
                <input
                  type="radio"
                  name="age"
                  checked={!isOver26}
                  onChange={() => setIsOver26(false)}
                  className="mr-1"
                />
                <div className="text-xs font-semibold text-gray-900">No</div>
              </label>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <label className="flex items-center mb-1 text-sm font-bold text-gray-800">
              <User className="mr-1 w-4 h-4" />
              고객 정보
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="고객 이름"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
              />
              <input
                type="tel"
                placeholder="전화번호 (010-1234-5678)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
              />
            </div>
          </div>

          {/* Delivery Address & Cost */}
          <div>
            <label className="flex items-center mb-1 text-sm font-bold text-gray-800">
              <Zap className="mr-1 w-4 h-4" />
              딜리버리 주소 및 비용
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="배차 주소를 입력하세요"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
              />
              <button
                onClick={calculateDistance}
                disabled={!deliveryAddress || isCalculatingDistance}
                className={`w-full px-3 py-2 text-xs font-semibold rounded transition-colors ${!deliveryAddress || isCalculatingDistance
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {isCalculatingDistance ? '📍 거리 계산중...' : '📍 거리 및 비용 계산'}
              </button>

              {distanceInfo && (
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">🚗 차량 이동시간:</span>
                      <span className="font-bold text-blue-700">{distanceInfo.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">📏 거리:</span>
                      <span className="font-semibold text-gray-800">{distanceInfo.distance}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="text-gray-600">💰 딜리버리 비용:</span>
                      <span className="font-bold text-green-700">
                        {distanceInfo.cost === 0 ? '무료' : formatPrice(distanceInfo.cost)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2">
                <input
                  type="number"
                  placeholder="수동 입력 (기본: 자동 계산)"
                  value={deliveryCost || ''}
                  onChange={(e) => {
                    setDeliveryCost(parseInt(e.target.value) || 0)
                    // 수동 입력시 거리 정보 초기화 (수동 입력 우선)
                    if (parseInt(e.target.value) !== distanceInfo?.cost) {
                      setDistanceInfo(null)
                    }
                  }}
                  className="p-2 w-full text-xs font-bold text-gray-900 bg-white rounded border"
                />
                <div className="mt-1 text-xs text-gray-600">
                  최종 비용: {(distanceInfo ? distanceInfo.cost : deliveryCost) === 0 ? '무료' : formatPrice(distanceInfo ? distanceInfo.cost : deliveryCost)}
                </div>
              </div>
            </div>

            <div className="mt-2 p-2 bg-yellow-50 rounded border border-yellow-200">
              <div className="text-xs text-yellow-800">
                <div className="font-semibold mb-1">💡 딜리버리 요금 안내</div>
                <div>• 본사 20분 거리 내</div>
                <div className="ml-2">- 1일 이용: 30,000원</div>
                <div className="ml-2">- 2일 이상: 무료</div>
                <div>• 20분 초과 거리: 별도 협의</div>
              </div>
            </div>
          </div>

          <button
            onClick={calculateCost}
            className="flex justify-center items-center px-4 py-2 w-full text-sm font-bold text-white bg-green-600 rounded transition duration-200 hover:bg-green-700"
          >
            <Calculator className="mr-1 w-4 h-4" />
            계산하기
          </button>
        </div>

        {/* 3번째 컬럼: 선택정보 + 요금표 + 견적서 */}
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <h3 className="mb-2 text-sm font-bold text-gray-800">📋 선택 정보</h3>
            <div className="space-y-1 text-xs">
              {(() => {
                const vehicle = vehicleData.find(v => v.id === selectedVehicle)
                return vehicle ? (
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">차량:</span>
                      <span className="font-semibold text-gray-800">{vehicle.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">연료:</span>
                      <span className="font-semibold text-gray-800">{vehicle.fuel_type}</span>
                    </div>
                  </div>
                ) : null
              })()}
              {startDate && endDate && calculateRentalDays() > 0 && (
                <>
                  <div className="flex justify-between pt-1 border-t">
                    <span className="text-gray-600">기간:</span>
                    <span className="font-semibold text-gray-800">{calculateRentalDays()}일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">총시간:</span>
                    <span className="font-bold text-green-700">{formatDaysAndHours(calculateTotalHours())}</span>
                  </div>
                </>
              )}
              {startDate && endDate && calculateRentalDays() > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">일일요금:</span>
                  <span className="font-bold text-green-700">{formatPrice(getCurrentDailyPrice())}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">시간:</span>
                <span className="font-semibold text-gray-800">{pickupTime}~{returnTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">나이:</span>
                <span className="font-semibold text-gray-800">
                  {isOver26 ? '26세+' : '26세- (할증)'}
                </span>
              </div>
            </div>
          </div>

          {/* 상담용 요금표 */}
          {vehicleData.find(v => v.id === selectedVehicle) && (
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <h3 className="mb-2 text-sm font-bold text-gray-800">📊 요금표 (상담용)</h3>
              {(() => {
                const vehicle = vehicleData.find(v => v.id === selectedVehicle)
                return vehicle ? (
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700">1-2일:</span>
                      <span className="font-bold text-blue-700">{formatPrice(vehicle.price_1_2_days)}/일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">3-4일:</span>
                      <span className="font-bold text-blue-700">{formatPrice(vehicle.price_3_4_days)}/일</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">5일 이상:</span>
                      <span className="font-bold text-blue-700">{formatPrice(vehicle.price_5_plus_days)}/일</span>
                    </div>
                    <div className="pt-1 border-t border-blue-300">
                      <div className="flex justify-between">
                        <span className="text-gray-700">보증금:</span>
                        <span className="font-bold text-orange-700">{formatPrice(vehicle.deposit)}</span>
                      </div>
                      {vehicle.monthly_rent && (
                        <div className="flex justify-between">
                          <span className="text-gray-700">월 렌트:</span>
                          <span className="font-bold text-purple-700">{formatPrice(vehicle.monthly_rent)}/월</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null
              })()}
            </div>
          )}

          {result && (
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <h3 className="mb-2 text-sm font-bold text-gray-800">💰 요금</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">일일요금:</span>
                  <span className="font-bold text-green-700">{formatPrice(getCurrentDailyPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">대여료:</span>
                  <span className="font-semibold text-gray-800">{formatPrice(result.vehicleCost)}</span>
                </div>
                {result.ageSurcharge > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">할증료:</span>
                    <span className="font-semibold text-orange-600">{formatPrice(result.ageSurcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">딜리버리:</span>
                  <span className="font-semibold text-blue-600">
                    {result.deliveryCost === 0 ? '무료' : formatPrice(result.deliveryCost)}
                  </span>
                </div>
                <div className="pt-1 mt-2 border-t border-green-300">
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-gray-800">총액:</span>
                    <span className="text-sm font-bold text-green-700">{formatPrice(result.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 견적서 섹션 */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded border border-green-200">
            <h3 className="mb-3 text-lg font-bold text-center text-gray-900">📋 견적서</h3>

            {result ? (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded border border-green-200">
                  <div className="text-center">
                    <div className="mb-1 text-sm font-semibold text-gray-700">총 이용요금</div>
                    <div className="text-2xl font-bold text-green-700">{formatPrice(result.total)}</div>
                    {result.ageSurcharge > 0 && (
                      <div className="mt-1 text-xs text-orange-600">
                        (할증료 {formatPrice(result.ageSurcharge)} 포함)
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={copyToClipboard}
                    className={`w-full px-3 py-2 rounded font-semibold text-xs transition-all duration-200 flex items-center justify-center ${isCopied
                      ? 'text-green-700 bg-green-100 border border-green-300'
                      : 'text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200'
                      }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-1 w-3 h-3" />
                        복사 완료!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 w-3 h-3" />
                        📋 견적서 복사
                      </>
                    )}
                  </button>

                  <button
                    onClick={addToReservationList}
                    className="flex justify-center items-center px-3 py-2 w-full text-xs font-semibold text-white bg-blue-600 rounded border border-blue-600 transition-all duration-200 hover:bg-blue-700"
                  >
                    <User className="mr-1 w-3 h-3" />
                    📋 예약리스트에 추가
                  </button>

                  <button
                    onClick={() => {
                      const reservationInfo = `

────────────────────────

㈜차렌터카입니다.

예약 안내
예약금 10만원 입금 시 예약이 확정됩니다.

운전자 성함으로 입금 부탁드립니다.

요금 안내
상기 견적은 현금가 기준입니다. (VAT 10% 별도)

입금 계좌
국민은행 697601-01-673637
예금주: 주식회사 차렌터카

약정 주행거리
국산차: 1일 300km (초과 시 km당 200원)

수입차: 1일 200km (초과 시 km당 300원)

예약 취소 안내
예약금은 환불되지 않으므로 신중한 입금 부탁드립니다.

사고 시 보험 면책금 안내
대인(인당), 대물, 자차, 자손 각 50만원씩

면책금 입금 후 보험 접수가 진행됩니다.

주소
인천광역시 연수구 경원대로534번길 11 (선학동)

문의
㈜차렌터카 고객센터
032-427-5500

채팅으로 문의
o7511.channel.io

차렌터카 공식 홈페이지
https://www.charentcar.com`

                      const currentText = editableQuoteText || generateQuoteText()
                      const newText = currentText + reservationInfo
                      setEditableQuoteText(newText)
                    }}
                    className="flex justify-center items-center px-3 py-2 w-full text-xs font-semibold text-white bg-purple-600 rounded border border-purple-600 transition-all duration-200 hover:bg-purple-700"
                  >
                    💰 예약금 안내 추가
                  </button>

                  {customerPhone && (
                    <button
                      onClick={async () => {
                        const message = editableQuoteText || generateQuoteText()
                        const phoneNumber = customerPhone.replace(/[^0-9]/g, '') // 숫자만 추출

                        // 견적서 내용을 클립보드에 복사
                        try {
                          await navigator.clipboard.writeText(message)
                          // 알뜰문자 사이트 새 탭으로 열기
                          window.open('https://www.dcsms.co.kr/', '_blank')
                          alert(`📋 견적서가 복사되었습니다!\n받는사람: ${phoneNumber}\n\n알뜰문자 사이트에서 붙여넣기(Ctrl+V)로 전송하세요!`)
                        } catch (err) {
                          // 클립보드 복사 실패 시 대체 방법
                          const textarea = document.createElement('textarea')
                          textarea.value = message
                          document.body.appendChild(textarea)
                          textarea.select()
                          document.execCommand('copy')
                          document.body.removeChild(textarea)
                          window.open('https://www.dcsms.co.kr/', '_blank')
                          alert(`📋 견적서가 복사되었습니다!\n받는사람: ${phoneNumber}\n\n알뜰문자 사이트에서 붙여넣기(Ctrl+V)로 전송하세요!`)
                        }
                      }}
                      className="flex justify-center items-center px-3 py-2 w-full text-xs font-semibold text-white bg-green-600 rounded border border-green-600 transition-all duration-200 hover:bg-green-700"
                    >
                      📱 알뜰문자로 전송
                    </button>
                  )}
                </div>

                {/* Preview */}
                <div className="p-2 bg-gray-50 rounded border">
                  <div className="mb-1 text-xs font-semibold text-gray-700">📄 복사될 내용 (편집 가능):</div>
                  <textarea
                    value={editableQuoteText || generateQuoteText()}
                    onChange={(e) => setEditableQuoteText(e.target.value)}
                    className="p-2 w-full font-mono text-xs text-gray-700 whitespace-pre-line bg-white rounded border resize-none"
                    rows={20}
                    placeholder="견적서 내용이 여기에 표시됩니다..."
                  />
                </div>


              </div>
            ) : (
              <div className="py-6 text-center text-gray-600">
                <div className="mb-2 text-2xl">🚗</div>
                <div className="text-sm font-semibold">
                  차량을 선택하고 <br />
                  계산하기 버튼을 클릭하세요
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
