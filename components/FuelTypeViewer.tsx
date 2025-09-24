'use client'

import { useState, useEffect } from 'react'
import { Car, Fuel, Filter, Search, DollarSign, Gauge, Calendar, ChevronDown, ChevronRight, Grid, List, BarChart3, Edit3, Save, RotateCcw } from 'lucide-react'

interface VehicleInfo {
  id: string
  name: string
  vehicleNumber?: string
  category: string
  fuelType: string
  displacement?: string
  mileage?: string
  fuelLevel?: string
  insurance?: string
  manufacturer?: string
  model?: string
  price_1_2_days?: number
  price_3_4_days?: number
  price_5_plus_days?: number
  monthly_rent?: number
  deposit?: number
  available: boolean
}

export default function FuelTypeViewer() {
  const [vehicles, setVehicles] = useState<VehicleInfo[]>([])
  const [activeTab, setActiveTab] = useState<'가솔린' | '디젤' | 'LPG' | '하이브리드'>('가솔린')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'category' | 'list'>('category')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [editingPrices, setEditingPrices] = useState<Set<string>>(new Set())
  const [customPrices, setCustomPrices] = useState<Record<string, { price_1_2_days?: number, price_3_4_days?: number, price_5_plus_days?: number }>>({})

  useEffect(() => {
    loadVehicleData()
    loadCustomPrices()
  }, [])

  // 커스텀 가격 불러오기
  const loadCustomPrices = () => {
    try {
      const saved = localStorage.getItem('customVehiclePrices')
      if (saved) {
        setCustomPrices(JSON.parse(saved))
      }
    } catch (error) {
      console.error('커스텀 가격 로딩 실패:', error)
    }
  }

  // 커스텀 가격 저장하기
  const saveCustomPrices = (prices: Record<string, { price_1_2_days?: number, price_3_4_days?: number, price_5_plus_days?: number }>) => {
    try {
      localStorage.setItem('customVehiclePrices', JSON.stringify(prices))
      setCustomPrices(prices)
    } catch (error) {
      console.error('커스텀 가격 저장 실패:', error)
    }
  }

  // 차량의 현재 가격 가져오기 (커스텀 가격 우선)
  const getVehiclePrice = (vehicle: VehicleInfo, priceType: 'price_1_2_days' | 'price_3_4_days' | 'price_5_plus_days') => {
    const customPrice = customPrices[vehicle.id]?.[priceType]
    if (customPrice !== undefined) {
      return customPrice
    }
    return vehicle[priceType] || 0
  }

  // 가격 편집 모드 토글
  const toggleEditPrice = (vehicleId: string) => {
    const newEditing = new Set(editingPrices)
    if (newEditing.has(vehicleId)) {
      newEditing.delete(vehicleId)
    } else {
      newEditing.add(vehicleId)
    }
    setEditingPrices(newEditing)
  }

  // 가격 업데이트
  const updatePrice = (vehicleId: string, priceType: 'price_1_2_days' | 'price_3_4_days' | 'price_5_plus_days', newPrice: number) => {
    const newCustomPrices = {
      ...customPrices,
      [vehicleId]: {
        ...customPrices[vehicleId],
        [priceType]: newPrice
      }
    }
    saveCustomPrices(newCustomPrices)
  }

  // 차량 가격 초기화
  const resetVehiclePrice = (vehicleId: string) => {
    const newCustomPrices = { ...customPrices }
    delete newCustomPrices[vehicleId]
    saveCustomPrices(newCustomPrices)

    // 편집 모드 종료
    const newEditing = new Set(editingPrices)
    newEditing.delete(vehicleId)
    setEditingPrices(newEditing)
  }

  const loadVehicleData = async () => {
    try {
      setLoading(true)

      // 현재차량현황.csv 데이터 (실제 보유 차량)
      const currentVehiclesResponse = await fetch('/현재차량현황.csv')
      const currentVehiclesText = await currentVehiclesResponse.text()

      // updated_vehicle_options.csv 데이터 (가격 정보)
      const optionsResponse = await fetch('/updated_vehicle_options.csv')
      const optionsText = await optionsResponse.text()

      // CSV 파싱
      const currentVehicles = parseCurrentVehicles(currentVehiclesText)
      const vehicleOptions = parseVehicleOptions(optionsText)

      // 데이터 병합
      const mergedVehicles = mergeVehicleData(currentVehicles, vehicleOptions)

      setVehicles(mergedVehicles)
    } catch (error) {
      console.error('차량 데이터 로딩 실패:', error)
      // 에러 시 기본 데이터 로드
      loadDefaultData()
    } finally {
      setLoading(false)
    }
  }

  const parseCurrentVehicles = (csvText: string) => {
    const lines = csvText.split('\n')
    const vehicles = []

    // 첫 번째 줄이 헤더인지 "표 1" 같은 제목인지 확인
    let startIndex = 1 // 기본적으로 두 번째 줄부터 시작 (헤더 건너뛰기)
    if (lines[0] && (lines[0].includes('표') || lines[0].includes('Table'))) {
      startIndex = 2 // "표 1" 같은 제목이 있으면 세 번째 줄부터 시작
    }

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const columns = line.split(',')
      if (columns.length >= 5) {
        const [name, vehicleNumber, displacement, , fuelType, mileage, fuelLevel, insurance] = columns

        if (name && fuelType && name !== '차량명') { // 헤더 행 제외
          vehicles.push({
            id: `current-${i}`,
            name: name.trim(),
            vehicleNumber: vehicleNumber?.trim(),
            displacement: displacement?.trim() + (displacement?.trim() ? 'cc' : ''),
            fuelType: fuelType.trim(),
            mileage: mileage?.trim() ? `${mileage.trim()}km` : '',
            fuelLevel: fuelLevel?.trim() ? `${fuelLevel.trim()}L` : '',
            insurance: insurance?.trim(),
            available: true // 기본적으로 사용 가능으로 설정
          })
        }
      }
    }

    return vehicles
  }

  const parseVehicleOptions = (csvText: string) => {
    const lines = csvText.split('\n')
    const options = []

    for (let i = 1; i < lines.length; i++) { // 헤더 건너뛰기
      const line = lines[i].trim()
      if (!line) continue

      const columns = line.split(',')
      if (columns.length >= 9) {
        const [id, name, category, price_1_2, price_3_4, price_5_plus, monthly_rent, deposit, fuel_type] = columns

        options.push({
          id: id?.trim(),
          name: name?.trim(),
          category: category?.trim(),
          price_1_2_days: parseInt(price_1_2) || 0,
          price_3_4_days: parseInt(price_3_4) || 0,
          price_5_plus_days: parseInt(price_5_plus) || 0,
          monthly_rent: parseInt(monthly_rent) || 0,
          deposit: parseInt(deposit) || 0,
          fuel_type: fuel_type?.trim()
        })
      }
    }

    return options
  }

  const mergeVehicleData = (currentVehicles: any[], vehicleOptions: any[]) => {
    const merged: VehicleInfo[] = []

    // 현재 보유 차량에 가격 정보 매칭
    currentVehicles.forEach(current => {
      // 차량명으로 가격 정보 찾기 (부분 일치)
      const option = vehicleOptions.find(opt =>
        current.name.includes(opt.name) || opt.name.includes(current.name)
      )

      merged.push({
        id: current.id,
        name: current.name,
        vehicleNumber: current.vehicleNumber,
        category: option?.category || '미분류',
        fuelType: current.fuelType,
        displacement: current.displacement,
        mileage: current.mileage,
        fuelLevel: current.fuelLevel,
        insurance: current.insurance,
        price_1_2_days: option?.price_1_2_days,
        price_3_4_days: option?.price_3_4_days,
        price_5_plus_days: option?.price_5_plus_days,
        monthly_rent: option?.monthly_rent,
        deposit: option?.deposit,
        available: true
      })
    })

    return merged
  }

  const loadDefaultData = () => {
    // 에러 시 기본 샘플 데이터
    const defaultVehicles: VehicleInfo[] = [
      {
        id: 'sample-1',
        name: '모닝',
        vehicleNumber: '66하1833',
        category: '경차',
        fuelType: '가솔린',
        displacement: '1000cc',
        mileage: '96,842km',
        fuelLevel: '54L',
        price_1_2_days: 70000,
        price_3_4_days: 65000,
        price_5_plus_days: 60000,
        monthly_rent: 550000,
        deposit: 300000,
        available: true
      },
      {
        id: 'sample-2',
        name: '싼타페',
        vehicleNumber: '54호0117',
        category: 'SUV',
        fuelType: '디젤',
        displacement: '2000cc',
        mileage: '104,069km',
        fuelLevel: '24L',
        price_1_2_days: 120000,
        price_3_4_days: 110000,
        price_5_plus_days: 100000,
        deposit: 500000,
        available: true
      },
      {
        id: 'sample-3',
        name: '그랜져',
        vehicleNumber: '10하0200',
        category: '준대형',
        fuelType: 'LPG',
        displacement: '3000cc',
        mileage: '72,769km',
        fuelLevel: '20L',
        price_1_2_days: 110000,
        price_3_4_days: 100000,
        price_5_plus_days: 90000,
        monthly_rent: 900000,
        deposit: 500000,
        available: true
      }
    ]

    setVehicles(defaultVehicles)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR') + '원'
  }

  const getFuelTypeCount = (fuelType: string) => {
    return vehicles.filter(v => v.fuelType === fuelType && v.available).length
  }

  const getFilteredVehicles = () => {
    return vehicles.filter(vehicle =>
      vehicle.fuelType === activeTab &&
      vehicle.available &&
      (vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleNumber?.includes(searchTerm) ||
        vehicle.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }

  // 차종별로 그룹화
  const getVehiclesByCategory = () => {
    const filtered = getFilteredVehicles()
    const grouped = filtered.reduce((acc, vehicle) => {
      const category = vehicle.category || '미분류'
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(vehicle)
      return acc
    }, {} as Record<string, VehicleInfo[]>)

    return grouped
  }

  // 차종별 통계 (커스텀 가격 반영)
  const getCategoryStats = (categoryVehicles: VehicleInfo[]) => {
    const count = categoryVehicles.length
    const prices = categoryVehicles.map(v => getVehiclePrice(v, 'price_1_2_days')).filter(p => p > 0)
    const avgPrice = prices.length > 0 ? prices.reduce((sum, p) => sum + p, 0) / prices.length : 0
    const priceRange = prices.length > 0 ? {
      min: Math.min(...prices),
      max: Math.max(...prices)
    } : { min: 0, max: 0 }
    return { count, avgPrice, priceRange }
  }

  // 차종 펼치기/접기 토글
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const filteredVehicles = getFilteredVehicles()
  const vehiclesByCategory = getVehiclesByCategory()

  return (
    <div className="px-4 mx-auto max-w-full">
      <div className="flex items-center mb-4">
        <Fuel className="mr-3 w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">연료타입별 차량조회</h2>
        <span className="ml-3 text-sm text-gray-500">상담용 차량 확인 툴</span>
      </div>

      {/* 가격 수정 안내 */}
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center mb-2">
          <Edit3 className="w-4 h-4 mr-2 text-blue-600" />
          <h3 className="font-semibold text-blue-800 text-sm">💰 실시간 요금 수정 기능</h3>
        </div>
        <div className="text-xs text-blue-700 space-y-1">
          <p>📝 연필 아이콘 클릭 → 요금 입력 → Enter 또는 다른 곳 클릭으로 저장</p>
          <p>🔄 초기화 아이콘으로 기본 요금으로 되돌리기 가능</p>
          <p>⭐ 수정된 요금은 "*" 표시되며 자동으로 저장됩니다</p>
          <p className="text-orange-600 font-semibold">💡 다른 계산기에서도 수정된 요금이 자동 적용됩니다!</p>
        </div>
      </div>

      {/* 연료타입 탭 */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          {(['가솔린', '디젤', 'LPG', '하이브리드'] as const).map((fuelType) => (
            <button
              key={fuelType}
              onClick={() => setActiveTab(fuelType)}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === fuelType
                ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {fuelType}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${activeTab === fuelType
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
                }`}>
                {getFuelTypeCount(fuelType)}대
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 검색바 및 뷰 모드 토글 */}
      <div className="mb-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="차량명, 차량번호, 차종으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('category')}
              className={`px-3 py-1 text-sm font-semibold rounded flex items-center transition-colors ${viewMode === 'category'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Grid className="w-4 h-4 mr-1" />
              차종별
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm font-semibold rounded flex items-center transition-colors ${viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <List className="w-4 h-4 mr-1" />
              차량별
            </button>
          </div>
        </div>
      </div>

      {/* 통계 정보 */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-semibold">총 {activeTab} 차량</div>
          <div className="text-2xl font-bold text-blue-800">{getFuelTypeCount(activeTab)}대</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-green-600 font-semibold">사용 가능</div>
          <div className="text-2xl font-bold text-green-800">
            {filteredVehicles.length}대
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-sm text-purple-600 font-semibold">평균 일일요금</div>
          <div className="text-2xl font-bold text-purple-800">
            {filteredVehicles.length > 0
              ? (() => {
                const prices = filteredVehicles.map(v => getVehiclePrice(v, 'price_1_2_days')).filter(p => p > 0)
                return prices.length > 0
                  ? formatPrice(Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length))
                  : '문의'
              })()
              : '0원'
            }
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <div className="text-sm text-orange-600 font-semibold">차종 구성</div>
          <div className="text-sm text-orange-800 font-semibold">
            {Array.from(new Set(filteredVehicles.map(v => v.category))).join(', ')}
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">차량 데이터를 불러오는 중...</p>
        </div>
      )}

      {/* 차량 목록 */}
      {!loading && (
        <div className="space-y-4">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` : `사용 가능한 ${activeTab} 차량이 없습니다.`}
              </p>
              <p className="text-gray-400 text-sm">
                다른 연료타입 탭을 확인해보세요.
              </p>
            </div>
          ) : viewMode === 'category' ? (
            // 차종별 뷰
            <div className="space-y-3">
              {Object.entries(vehiclesByCategory).map(([category, categoryVehicles]) => {
                const stats = getCategoryStats(categoryVehicles)
                const isExpanded = expandedCategories.has(category)

                return (
                  <div key={category} className="border rounded-lg overflow-hidden">
                    {/* 차종 헤더 */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        )}
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-bold text-gray-900">{category}</h3>
                          <span className="px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                            {stats.count}대
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-600">평균 가격</div>
                        <div className="font-bold text-blue-600">
                          {stats.avgPrice > 0 ? formatPrice(Math.round(stats.avgPrice)) : '문의'}
                        </div>
                        {stats.priceRange.min !== stats.priceRange.max && stats.priceRange.min > 0 && (
                          <div className="text-xs text-gray-500">
                            {formatPrice(stats.priceRange.min)} ~ {formatPrice(stats.priceRange.max)}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* 차종별 차량 리스트 */}
                    {isExpanded && (
                      <div className="border-t bg-white">
                        <div className="p-4 space-y-3">
                          {categoryVehicles.map((vehicle, idx) => (
                            <div key={vehicle.id} className={`p-3 rounded border-l-4 border-blue-200 bg-blue-50/30 ${idx !== categoryVehicles.length - 1 ? 'border-b border-gray-200' : ''}`}>
                              <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-3">
                                  <Car className="w-5 h-5 text-blue-600" />
                                  <div>
                                    <h4 className="font-bold text-gray-900">{vehicle.name}</h4>
                                    <p className="text-sm text-gray-600">{vehicle.vehicleNumber}</p>
                                  </div>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded ${vehicle.fuelType === '가솔린' ? 'bg-red-100 text-red-700' :
                                    vehicle.fuelType === '디젤' ? 'bg-blue-100 text-blue-700' :
                                      vehicle.fuelType === '하이브리드' ? 'bg-purple-100 text-purple-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    {vehicle.fuelType}
                                  </span>
                                </div>
                                <div className="text-right flex items-center space-x-2">
                                  <div>
                                    <div className="text-sm text-gray-500">1-2일</div>
                                    {editingPrices.has(vehicle.id) ? (
                                      <input
                                        type="number"
                                        defaultValue={getVehiclePrice(vehicle, 'price_1_2_days')}
                                        onBlur={(e) => {
                                          const newPrice = parseInt(e.target.value)
                                          if (!isNaN(newPrice) && newPrice > 0) {
                                            updatePrice(vehicle.id, 'price_1_2_days', newPrice)
                                          }
                                        }}
                                        className="w-20 text-sm font-bold text-blue-600 bg-white border rounded px-2 py-1 text-right"
                                        placeholder="요금"
                                        autoFocus
                                      />
                                    ) : (
                                      <div className="font-bold text-blue-600">
                                        {getVehiclePrice(vehicle, 'price_1_2_days') > 0
                                          ? formatPrice(getVehiclePrice(vehicle, 'price_1_2_days'))
                                          : '문의'}
                                        {customPrices[vehicle.id]?.price_1_2_days && (
                                          <span className="ml-1 text-xs text-orange-500">*</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex flex-col space-y-1">
                                    <button
                                      onClick={() => toggleEditPrice(vehicle.id)}
                                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                      title={editingPrices.has(vehicle.id) ? "편집 완료" : "가격 수정"}
                                    >
                                      {editingPrices.has(vehicle.id) ? (
                                        <Save className="w-3 h-3" />
                                      ) : (
                                        <Edit3 className="w-3 h-3" />
                                      )}
                                    </button>
                                    {customPrices[vehicle.id] && (
                                      <button
                                        onClick={() => resetVehiclePrice(vehicle.id)}
                                        className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
                                        title="기본 가격으로 초기화"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
                                {vehicle.displacement && (
                                  <div className="flex items-center">
                                    <Gauge className="w-3 h-3 mr-1" />
                                    {vehicle.displacement}
                                  </div>
                                )}
                                {vehicle.mileage && (
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {vehicle.mileage}
                                  </div>
                                )}
                                {vehicle.fuelLevel && (
                                  <div className="flex items-center">
                                    <Fuel className="w-3 h-3 mr-1" />
                                    {vehicle.fuelLevel}
                                  </div>
                                )}
                                <div className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-1 ${vehicle.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  {vehicle.available ? '대여가능' : '대여중'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            // 기존 차량별 리스트 뷰
            filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <Car className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-600">{vehicle.vehicleNumber}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${vehicle.fuelType === '가솔린' ? 'bg-red-100 text-red-800' :
                      vehicle.fuelType === '디젤' ? 'bg-blue-100 text-blue-800' :
                        vehicle.fuelType === '하이브리드' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                      }`}>
                      {vehicle.fuelType}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                      {vehicle.category}
                    </span>
                  </div>
                  <div className="text-right flex items-center space-x-2">
                    <div>
                      <div className="text-sm text-gray-500">1-2일</div>
                      {editingPrices.has(vehicle.id) ? (
                        <input
                          type="number"
                          defaultValue={getVehiclePrice(vehicle, 'price_1_2_days')}
                          onBlur={(e) => {
                            const newPrice = parseInt(e.target.value)
                            if (!isNaN(newPrice) && newPrice > 0) {
                              updatePrice(vehicle.id, 'price_1_2_days', newPrice)
                            }
                          }}
                          className="w-24 text-xl font-bold text-blue-600 bg-white border rounded px-2 py-1 text-right"
                          placeholder="요금"
                          autoFocus
                        />
                      ) : (
                        <div className="text-xl font-bold text-blue-600">
                          {getVehiclePrice(vehicle, 'price_1_2_days') > 0
                            ? formatPrice(getVehiclePrice(vehicle, 'price_1_2_days'))
                            : '문의'}
                          {customPrices[vehicle.id]?.price_1_2_days && (
                            <span className="ml-1 text-sm text-orange-500">*</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => toggleEditPrice(vehicle.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title={editingPrices.has(vehicle.id) ? "편집 완료" : "가격 수정"}
                      >
                        {editingPrices.has(vehicle.id) ? (
                          <Save className="w-4 h-4" />
                        ) : (
                          <Edit3 className="w-4 h-4" />
                        )}
                      </button>
                      {customPrices[vehicle.id] && (
                        <button
                          onClick={() => resetVehiclePrice(vehicle.id)}
                          className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded"
                          title="기본 가격으로 초기화"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-sm">
                  {/* 차량 정보 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">차량 정보</h4>
                    {vehicle.displacement && (
                      <div className="flex items-center text-gray-600">
                        <Gauge className="w-4 h-4 mr-2" />
                        <span>배기량: {vehicle.displacement}</span>
                      </div>
                    )}
                    {vehicle.mileage && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>주행거리: {vehicle.mileage}</span>
                      </div>
                    )}
                    {vehicle.fuelLevel && (
                      <div className="flex items-center text-gray-600">
                        <Fuel className="w-4 h-4 mr-2" />
                        <span>연료량: {vehicle.fuelLevel}</span>
                      </div>
                    )}
                  </div>

                  {/* 요금 정보 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 flex items-center">
                      일일 요금
                      {customPrices[vehicle.id] && (
                        <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">수정됨</span>
                      )}
                    </h4>
                    {/* 1-2일 요금 */}
                    <div className="text-gray-600 flex items-center justify-between">
                      <span>1-2일:</span>
                      <div className="flex items-center space-x-2">
                        {editingPrices.has(vehicle.id) ? (
                          <input
                            type="number"
                            defaultValue={getVehiclePrice(vehicle, 'price_1_2_days')}
                            onBlur={(e) => {
                              const newPrice = parseInt(e.target.value)
                              if (!isNaN(newPrice) && newPrice > 0) {
                                updatePrice(vehicle.id, 'price_1_2_days', newPrice)
                              }
                            }}
                            className="w-20 text-sm font-semibold text-blue-600 bg-white border rounded px-2 py-1 text-right"
                            placeholder="0"
                          />
                        ) : (
                          <span className="font-semibold text-blue-600">
                            {getVehiclePrice(vehicle, 'price_1_2_days') > 0
                              ? formatPrice(getVehiclePrice(vehicle, 'price_1_2_days'))
                              : '문의'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 3-4일 요금 */}
                    <div className="text-gray-600 flex items-center justify-between">
                      <span>3-4일:</span>
                      <div className="flex items-center space-x-2">
                        {editingPrices.has(vehicle.id) ? (
                          <input
                            type="number"
                            defaultValue={getVehiclePrice(vehicle, 'price_3_4_days')}
                            onBlur={(e) => {
                              const newPrice = parseInt(e.target.value)
                              if (!isNaN(newPrice) && newPrice > 0) {
                                updatePrice(vehicle.id, 'price_3_4_days', newPrice)
                              }
                            }}
                            className="w-20 text-sm font-semibold text-green-600 bg-white border rounded px-2 py-1 text-right"
                            placeholder="0"
                          />
                        ) : (
                          <span className="font-semibold text-green-600">
                            {getVehiclePrice(vehicle, 'price_3_4_days') > 0
                              ? formatPrice(getVehiclePrice(vehicle, 'price_3_4_days'))
                              : '문의'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 5일+ 요금 */}
                    <div className="text-gray-600 flex items-center justify-between">
                      <span>5일+:</span>
                      <div className="flex items-center space-x-2">
                        {editingPrices.has(vehicle.id) ? (
                          <input
                            type="number"
                            defaultValue={getVehiclePrice(vehicle, 'price_5_plus_days')}
                            onBlur={(e) => {
                              const newPrice = parseInt(e.target.value)
                              if (!isNaN(newPrice) && newPrice > 0) {
                                updatePrice(vehicle.id, 'price_5_plus_days', newPrice)
                              }
                            }}
                            className="w-20 text-sm font-semibold text-purple-600 bg-white border rounded px-2 py-1 text-right"
                            placeholder="0"
                          />
                        ) : (
                          <span className="font-semibold text-purple-600">
                            {getVehiclePrice(vehicle, 'price_5_plus_days') > 0
                              ? formatPrice(getVehiclePrice(vehicle, 'price_5_plus_days'))
                              : '문의'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 기타 요금 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">기타 요금</h4>
                    {vehicle.monthly_rent && vehicle.monthly_rent > 0 && (
                      <div className="text-gray-600">
                        월렌트: <span className="font-semibold text-orange-600">{formatPrice(vehicle.monthly_rent)}</span>
                      </div>
                    )}
                    {vehicle.deposit && (
                      <div className="text-gray-600">
                        보증금: <span className="font-semibold text-gray-700">{formatPrice(vehicle.deposit)}</span>
                      </div>
                    )}
                  </div>

                  {/* 상태 */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700">차량 상태</h4>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${vehicle.available ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                      <span className={`font-semibold ${vehicle.available ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {vehicle.available ? '대여 가능' : '대여중'}
                      </span>
                    </div>
                    {vehicle.insurance && (
                      <div className="text-xs text-gray-500">
                        IMS연결: {vehicle.insurance}
                      </div>
                    )}
                  </div>
                </div>

                {/* 빠른 예약 버튼 */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors">
                      일반렌트카 예약
                    </button>
                    <button className="flex-1 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700 transition-colors">
                      YC탁송 예약
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200 transition-colors">
                      자세히
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
