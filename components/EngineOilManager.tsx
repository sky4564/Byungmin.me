'use client'

import React, { useState, useEffect } from 'react'

interface OilChangeRecord {
  id: string
  vehicleId: string
  vehicleNumber: string
  vehicleName: string
  changeDate: string
  mileage: number
  oilType: string
  nextChangeDate: string
  nextChangeMileage: number
  currentMileage?: number
  status: 'normal' | 'warning' | 'overdue'
  isNew?: boolean
}

interface VehicleOilSpec {
  vehicleId: string
  vehicleName: string
  vehicleNumber: string
  category: string
  fuelType: string
  engineOilType: string
  oilCapacity: string
  changeInterval: number // 개월
  mileageInterval: number // km
  currentMileage?: number // 현재 주행거리
  isNew?: boolean // 신규 차량 여부
}

const EngineOilManager: React.FC = () => {
  const [oilRecords, setOilRecords] = useState<OilChangeRecord[]>([])
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleOilSpec[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'normal' | 'warning' | 'overdue'>('all')

  // public/vehicle-data/현재차량현황.csv 기반 최신 차량별 엔진오일 사양 데이터
  const vehicleOilSpecs: VehicleOilSpec[] = [
    // 경차
    { vehicleId: '4', vehicleName: '모닝', vehicleNumber: '66하1833', category: '경차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.3L', changeInterval: 6, mileageInterval: 10000, currentMileage: 96842 },
    { vehicleId: '16', vehicleName: '스파크', vehicleNumber: '128하1300', category: '경차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.2L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '17', vehicleName: '스파크', vehicleNumber: '128하1301', category: '경차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.2L', changeInterval: 6, mileageInterval: 10000, currentMileage: 47016 },
    { vehicleId: '18', vehicleName: '레이', vehicleNumber: '128하1312', category: '경차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.0L', changeInterval: 6, mileageInterval: 10000, currentMileage: 58472 },
    { vehicleId: '19', vehicleName: '모닝', vehicleNumber: '128하1311', category: '경차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.3L', changeInterval: 6, mileageInterval: 10000, currentMileage: 65473 },
    { vehicleId: '20', vehicleName: '모닝', vehicleNumber: '128하1308', category: '경차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.3L', changeInterval: 6, mileageInterval: 10000, currentMileage: 39242 },

    // 준중형
    { vehicleId: '14', vehicleName: 'K3', vehicleNumber: '128하1303', category: '준중형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '4.0L', changeInterval: 6, mileageInterval: 10000, currentMileage: 80655 },
    { vehicleId: '15', vehicleName: 'K3', vehicleNumber: '128하1302', category: '준중형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '4.0L', changeInterval: 6, mileageInterval: 10000, currentMileage: 58783 },
    { vehicleId: '30', vehicleName: '아반떼AD', vehicleNumber: '128하1447', category: '준중형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '4.2L', changeInterval: 6, mileageInterval: 10000, currentMileage: 73580 },
    { vehicleId: '31', vehicleName: '아반떼', vehicleNumber: '128하1448', category: '준중형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '4.2L', changeInterval: 6, mileageInterval: 10000, currentMileage: 95738 },
    { vehicleId: '33', vehicleName: '베뉴', vehicleNumber: '128하1305', category: '준중형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.8L', changeInterval: 6, mileageInterval: 10000, currentMileage: 67264 },
    { vehicleId: '34', vehicleName: '베뉴', vehicleNumber: '128하1304', category: '준중형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '3.8L', changeInterval: 6, mileageInterval: 10000, currentMileage: 76420 },
    { vehicleId: '57', vehicleName: '아반떼CN7', vehicleNumber: '125호5862', category: '준중형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '4.2L', changeInterval: 6, mileageInterval: 10000, currentMileage: 35334 },

    // 중형
    { vehicleId: '5', vehicleName: '쏘나타', vehicleNumber: '44하0182', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.6L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '23', vehicleName: 'K5', vehicleNumber: '128하1083', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 86584 },
    { vehicleId: '24', vehicleName: 'K5', vehicleNumber: '128하1084', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 91813 },
    { vehicleId: '27', vehicleName: 'SM6', vehicleNumber: '128하1078', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.3L', changeInterval: 6, mileageInterval: 10000, currentMileage: 66329 },
    { vehicleId: '32', vehicleName: 'K5', vehicleNumber: '128하1086', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 77764 },
    { vehicleId: '35', vehicleName: '쏘나타', vehicleNumber: '128하1306', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.6L', changeInterval: 6, mileageInterval: 10000, currentMileage: 85443 },
    { vehicleId: '36', vehicleName: '쏘나타', vehicleNumber: '128하1307', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.6L', changeInterval: 6, mileageInterval: 10000, currentMileage: 85828 },
    { vehicleId: '60', vehicleName: '싼타페', vehicleNumber: '128하1549', category: '중형', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '5.8L', changeInterval: 12, mileageInterval: 20000, currentMileage: 58250 },
    { vehicleId: '74', vehicleName: '2026 K5', vehicleNumber: '169호6914', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 2381, isNew: true },
    { vehicleId: '75', vehicleName: '쏘나타 디 엣지', vehicleNumber: '169호6916', category: '중형', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.6L', changeInterval: 6, mileageInterval: 10000, currentMileage: 1049, isNew: true },

    // 준대형
    { vehicleId: '6', vehicleName: '그랜져', vehicleNumber: '10하0200', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 72769 },
    { vehicleId: '7', vehicleName: '그랜져', vehicleNumber: '24호5711', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 99465 },
    { vehicleId: '8', vehicleName: '그랜져', vehicleNumber: '24호5688', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 102602 },
    { vehicleId: '12', vehicleName: '그랜저', vehicleNumber: '128하3563', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '13', vehicleName: '그랜저', vehicleNumber: '145하1900', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 63947 },
    { vehicleId: '21', vehicleName: '그랜져', vehicleNumber: '128하1098', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 73298 },
    { vehicleId: '22', vehicleName: '그랜져', vehicleNumber: '128하1097', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 73684 },
    { vehicleId: '52', vehicleName: '그랜저', vehicleNumber: '160호4276', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '53', vehicleName: 'GN7', vehicleNumber: '175호3524', category: '준대형', fuelType: '가솔린', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 27468 },
    { vehicleId: '56', vehicleName: '그랜져GN7', vehicleNumber: '125호5861', category: '준대형', fuelType: '가솔린', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 32472 },
    { vehicleId: '59', vehicleName: '그랜저', vehicleNumber: '128하1546', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 63106 },
    { vehicleId: '65', vehicleName: '그랜저', vehicleNumber: '128하1548', category: '준대형', fuelType: 'LPG', engineOilType: '5W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 67665 },

    // 대형
    { vehicleId: '39', vehicleName: 'G90', vehicleNumber: '128허1518', category: '대형', fuelType: '가솔린', engineOilType: '5W-40', oilCapacity: '7.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 63215 },
    { vehicleId: '49', vehicleName: '벤츠 E250', vehicleNumber: '169호5889', category: '대형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '6.5L', changeInterval: 12, mileageInterval: 15000, currentMileage: 9596 },
    { vehicleId: '54', vehicleName: '벤츠 E250', vehicleNumber: '169호5945', category: '대형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '6.5L', changeInterval: 12, mileageInterval: 15000, currentMileage: 0 },
    { vehicleId: '58', vehicleName: 'E250', vehicleNumber: '160하4260', category: '대형', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '6.5L', changeInterval: 12, mileageInterval: 15000, currentMileage: 66306 },
    { vehicleId: '67', vehicleName: 'G80', vehicleNumber: '169호5781', category: '대형', fuelType: '가솔린', engineOilType: '5W-40', oilCapacity: '6.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 48662 },
    { vehicleId: '44', vehicleName: 'S350', vehicleNumber: '169하6900', category: '대형', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '8.0L', changeInterval: 12, mileageInterval: 15000, currentMileage: 0 },

    // SUV
    { vehicleId: '3', vehicleName: '싼타페', vehicleNumber: '54호0117', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '5.8L', changeInterval: 12, mileageInterval: 20000, currentMileage: 104069 },
    { vehicleId: '9', vehicleName: '쏘렌토', vehicleNumber: '22호1562', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '5.7L', changeInterval: 12, mileageInterval: 20000, currentMileage: 117510 },
    { vehicleId: '10', vehicleName: 'K5', vehicleNumber: '63하6115', category: 'SUV', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '11', vehicleName: '쏘렌토', vehicleNumber: '63하6185', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '5.7L', changeInterval: 12, mileageInterval: 20000, currentMileage: 117969 },
    { vehicleId: '28', vehicleName: 'QM6', vehicleNumber: '128하1077', category: 'SUV', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 56059 },
    { vehicleId: '29', vehicleName: 'QM6', vehicleNumber: '128하1076', category: 'SUV', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 56313 },
    { vehicleId: '40', vehicleName: 'GV80', vehicleNumber: '160하4268', category: 'SUV', fuelType: '가솔린', engineOilType: '5W-40', oilCapacity: '7.0L', changeInterval: 6, mileageInterval: 10000, currentMileage: 64681 },
    { vehicleId: '42', vehicleName: '모하비 더 마스터', vehicleNumber: '146하1419', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.5L', changeInterval: 12, mileageInterval: 20000, currentMileage: 62869 },
    { vehicleId: '43', vehicleName: '싼타페', vehicleNumber: '146하1441', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '5.8L', changeInterval: 12, mileageInterval: 20000, currentMileage: 68375 },
    { vehicleId: '47', vehicleName: '팰리세이드', vehicleNumber: '169하6904', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.2L', changeInterval: 12, mileageInterval: 20000, currentMileage: 0 },
    { vehicleId: '48', vehicleName: '스포티지', vehicleNumber: '160허4164', category: 'SUV', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.7L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '50', vehicleName: '스포티지 하이브리드', vehicleNumber: '169호5891', category: 'SUV', fuelType: '하이브리드', engineOilType: '0W-20', oilCapacity: '4.7L', changeInterval: 12, mileageInterval: 15000, currentMileage: 42162 },
    { vehicleId: '61', vehicleName: 'QM6', vehicleNumber: '169호6972', category: 'SUV', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 316 },
    { vehicleId: '62', vehicleName: 'QM6', vehicleNumber: '169호6971', category: 'SUV', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 90 },
    { vehicleId: '63', vehicleName: 'QM6', vehicleNumber: '169호6970', category: 'SUV', fuelType: 'LPG', engineOilType: '5W-30', oilCapacity: '4.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 40201 },
    { vehicleId: '64', vehicleName: '팰리세이드', vehicleNumber: '169하6983', category: 'SUV', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '6.2L', changeInterval: 6, mileageInterval: 10000, currentMileage: 1438 },
    { vehicleId: '69', vehicleName: '팰리세이드', vehicleNumber: '169호5780', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.2L', changeInterval: 12, mileageInterval: 20000, currentMileage: 0 },
    { vehicleId: '71', vehicleName: '싼타페', vehicleNumber: '160하4261', category: 'SUV', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '5.8L', changeInterval: 6, mileageInterval: 10000, currentMileage: 7645, isNew: true },
    { vehicleId: '72', vehicleName: '스포티지', vehicleNumber: '169호5779', category: 'SUV', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '4.7L', changeInterval: 6, mileageInterval: 10000, currentMileage: 47767, isNew: true },
    { vehicleId: '77', vehicleName: '더 뉴 쏘렌토', vehicleNumber: '신규차량', category: 'SUV', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '5.7L', changeInterval: 12, mileageInterval: 20000, currentMileage: 0, isNew: true },

    // 승합차
    { vehicleId: '25', vehicleName: '카니발', vehicleNumber: '128하1082', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.8L', changeInterval: 12, mileageInterval: 20000, currentMileage: 131219 },
    { vehicleId: '26', vehicleName: '카니발', vehicleNumber: '128하1081', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.8L', changeInterval: 12, mileageInterval: 20000, currentMileage: 130320 },
    { vehicleId: '37', vehicleName: '그랜드스타렉스', vehicleNumber: '74허5262', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.0L', changeInterval: 12, mileageInterval: 20000, currentMileage: 109447 },
    { vehicleId: '38', vehicleName: '그랜드스타렉스', vehicleNumber: '74허5263', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.0L', changeInterval: 12, mileageInterval: 20000, currentMileage: 96441 },
    { vehicleId: '41', vehicleName: '더뉴카니발', vehicleNumber: '145호5214', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.8L', changeInterval: 12, mileageInterval: 20000, currentMileage: 111314 },
    { vehicleId: '51', vehicleName: '카니발', vehicleNumber: '160허4196', category: '승합차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '6.8L', changeInterval: 6, mileageInterval: 10000, currentMileage: 69468 },
    { vehicleId: '55', vehicleName: '쏠라티', vehicleNumber: '703호2150', category: '승합차', fuelType: '디젤', engineOilType: '15W-40', oilCapacity: '12.0L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '66', vehicleName: '스타리아', vehicleNumber: '703호2057', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.0L', changeInterval: 12, mileageInterval: 20000, currentMileage: 30179 },
    { vehicleId: '68', vehicleName: '2025 스타리아 11인승', vehicleNumber: '703호2058', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.0L', changeInterval: 12, mileageInterval: 20000, currentMileage: 42884 },
    { vehicleId: '70', vehicleName: '쏠라티', vehicleNumber: '703호2064', category: '승합차', fuelType: '디젤', engineOilType: '15W-40', oilCapacity: '12.0L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0, isNew: true },
    { vehicleId: '73', vehicleName: '그랜드스타렉스', vehicleNumber: '824머3020', category: '승합차', fuelType: '디젤', engineOilType: '5W-30', oilCapacity: '6.0L', changeInterval: 12, mileageInterval: 20000, currentMileage: 0, isNew: true },
    { vehicleId: '76', vehicleName: 'The new 카니발', vehicleNumber: '169호6918', category: '승합차', fuelType: '가솔린', engineOilType: '5W-30', oilCapacity: '6.8L', changeInterval: 6, mileageInterval: 10000, currentMileage: undefined, isNew: true },

    // 상용차
    { vehicleId: '45', vehicleName: '포터 2', vehicleNumber: '840수5324', category: '상용차', fuelType: '디젤', engineOilType: '15W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 0 },
    { vehicleId: '46', vehicleName: '포터2냉동탑차', vehicleNumber: '826나1489', category: '상용차', fuelType: '디젤', engineOilType: '15W-40', oilCapacity: '5.5L', changeInterval: 6, mileageInterval: 10000, currentMileage: 28291 }
  ]

  // public/vehicle-data/현재차량현황.csv 기반 실제 주행거리 반영 엔진오일 교체 기록
  const sampleOilRecords: OilChangeRecord[] = [
    // 교체가 심각하게 필요한 차량들 (현재 주행거리가 매우 높음)
    {
      id: '1',
      vehicleId: '4',
      vehicleNumber: '66하1833',
      vehicleName: '모닝',
      changeDate: '2023-01-15',
      mileage: 76000,
      oilType: '5W-30',
      nextChangeDate: '2023-07-15',
      nextChangeMileage: 86000,
      currentMileage: 96842,
      status: 'overdue'
    },
    {
      id: '2',
      vehicleId: '9',
      vehicleNumber: '22호1562',
      vehicleName: '쏘렌토',
      changeDate: '2022-12-01',
      mileage: 97000,
      oilType: '5W-30',
      nextChangeDate: '2023-12-01',
      nextChangeMileage: 117000,
      currentMileage: 117510,
      status: 'overdue'
    },
    {
      id: '3',
      vehicleId: '11',
      vehicleNumber: '63하6185',
      vehicleName: '쏘렌토',
      changeDate: '2023-01-01',
      mileage: 97000,
      oilType: '5W-30',
      nextChangeDate: '2024-01-01',
      nextChangeMileage: 117000,
      currentMileage: 117969,
      status: 'overdue'
    },
    {
      id: '4',
      vehicleId: '25',
      vehicleNumber: '128하1082',
      vehicleName: '카니발',
      changeDate: '2023-03-01',
      mileage: 111000,
      oilType: '5W-30',
      nextChangeDate: '2024-03-01',
      nextChangeMileage: 131000,
      currentMileage: 131219,
      status: 'overdue'
    },
    {
      id: '5',
      vehicleId: '26',
      vehicleNumber: '128하1081',
      vehicleName: '카니발',
      changeDate: '2023-02-15',
      mileage: 110000,
      oilType: '5W-30',
      nextChangeDate: '2024-02-15',
      nextChangeMileage: 130000,
      currentMileage: 130320,
      status: 'overdue'
    },
    {
      id: '6',
      vehicleId: '37',
      vehicleNumber: '74허5262',
      vehicleName: '그랜드스타렉스',
      changeDate: '2023-05-01',
      mileage: 89000,
      oilType: '5W-30',
      nextChangeDate: '2024-05-01',
      nextChangeMileage: 109000,
      currentMileage: 109447,
      status: 'overdue'
    },
    {
      id: '7',
      vehicleId: '41',
      vehicleNumber: '145호5214',
      vehicleName: '더뉴카니발',
      changeDate: '2023-04-01',
      mileage: 91000,
      oilType: '5W-30',
      nextChangeDate: '2024-04-01',
      nextChangeMileage: 111000,
      currentMileage: 111314,
      status: 'overdue'
    },

    // 교체가 필요한 차량들 (주의)
    {
      id: '8',
      vehicleId: '8',
      vehicleNumber: '24호5688',
      vehicleName: '그랜져',
      changeDate: '2024-01-01',
      mileage: 92000,
      oilType: '5W-40',
      nextChangeDate: '2024-07-01',
      nextChangeMileage: 102000,
      currentMileage: 102602,
      status: 'warning'
    },
    {
      id: '9',
      vehicleId: '7',
      vehicleNumber: '24호5711',
      vehicleName: '그랜져',
      changeDate: '2024-02-01',
      mileage: 89000,
      oilType: '5W-40',
      nextChangeDate: '2024-08-01',
      nextChangeMileage: 99000,
      currentMileage: 99465,
      status: 'warning'
    },
    {
      id: '10',
      vehicleId: '31',
      vehicleNumber: '128하1448',
      vehicleName: '아반떼',
      changeDate: '2024-05-01',
      mileage: 85000,
      oilType: '5W-30',
      nextChangeDate: '2024-11-01',
      nextChangeMileage: 95000,
      currentMileage: 95738,
      status: 'warning'
    },
    {
      id: '11',
      vehicleId: '38',
      vehicleNumber: '74허5263',
      vehicleName: '그랜드스타렉스',
      changeDate: '2024-03-01',
      mileage: 76000,
      oilType: '5W-30',
      nextChangeDate: '2025-03-01',
      nextChangeMileage: 96000,
      currentMileage: 96441,
      status: 'warning'
    },
    {
      id: '12',
      vehicleId: '24',
      vehicleNumber: '128하1084',
      vehicleName: 'K5',
      changeDate: '2024-06-01',
      mileage: 81000,
      oilType: '5W-30',
      nextChangeDate: '2024-12-01',
      nextChangeMileage: 91000,
      currentMileage: 91813,
      status: 'warning'
    },
    {
      id: '13',
      vehicleId: '23',
      vehicleNumber: '128하1083',
      vehicleName: 'K5',
      changeDate: '2024-07-01',
      mileage: 76000,
      oilType: '5W-30',
      nextChangeDate: '2025-01-01',
      nextChangeMileage: 86000,
      currentMileage: 86584,
      status: 'warning'
    },

    // 정상 상태 차량들
    {
      id: '14',
      vehicleId: '40',
      vehicleNumber: '160하4268',
      vehicleName: 'GV80',
      changeDate: '2024-08-01',
      mileage: 54000,
      oilType: '5W-40',
      nextChangeDate: '2025-02-01',
      nextChangeMileage: 64000,
      currentMileage: 64681,
      status: 'normal'
    },
    {
      id: '15',
      vehicleId: '51',
      vehicleNumber: '160허4196',
      vehicleName: '카니발',
      changeDate: '2024-10-01',
      mileage: 59000,
      oilType: '5W-30',
      nextChangeDate: '2025-04-01',
      nextChangeMileage: 69000,
      currentMileage: 69468,
      status: 'normal'
    },
    {
      id: '16',
      vehicleId: '50',
      vehicleNumber: '169호5891',
      vehicleName: '스포티지 하이브리드',
      changeDate: '2024-09-01',
      mileage: 27000,
      oilType: '0W-20',
      nextChangeDate: '2025-09-01',
      nextChangeMileage: 42000,
      currentMileage: 42162,
      status: 'normal'
    },
    {
      id: '17',
      vehicleId: '67',
      vehicleNumber: '169호5781',
      vehicleName: 'G80',
      changeDate: '2024-08-01',
      mileage: 38000,
      oilType: '5W-40',
      nextChangeDate: '2025-02-01',
      nextChangeMileage: 48000,
      currentMileage: 48662,
      status: 'normal'
    },
    {
      id: '18',
      vehicleId: '72',
      vehicleNumber: '169호5779',
      vehicleName: '스포티지',
      changeDate: '2024-10-01',
      mileage: 37000,
      oilType: '5W-30',
      nextChangeDate: '2025-04-01',
      nextChangeMileage: 47000,
      currentMileage: 47767,
      status: 'normal',
      isNew: true
    },

    // 신규 차량들 (초기 교체 기록)
    {
      id: '19',
      vehicleId: '74',
      vehicleNumber: '169호6914',
      vehicleName: '2026 K5',
      changeDate: '2024-12-01',
      mileage: 0,
      oilType: '5W-30',
      nextChangeDate: '2025-06-01',
      nextChangeMileage: 10000,
      currentMileage: 2381,
      status: 'normal',
      isNew: true
    },
    {
      id: '20',
      vehicleId: '75',
      vehicleNumber: '169호6916',
      vehicleName: '쏘나타 디 엣지',
      changeDate: '2025-01-01',
      mileage: 0,
      oilType: '5W-30',
      nextChangeDate: '2025-07-01',
      nextChangeMileage: 10000,
      currentMileage: 1049,
      status: 'normal',
      isNew: true
    },
    {
      id: '21',
      vehicleId: '70',
      vehicleNumber: '703호2064',
      vehicleName: '쏠라티',
      changeDate: '2024-11-01',
      mileage: 0,
      oilType: '15W-40',
      nextChangeDate: '2025-05-01',
      nextChangeMileage: 10000,
      currentMileage: 0,
      status: 'normal',
      isNew: true
    },
    {
      id: '22',
      vehicleId: '73',
      vehicleNumber: '824머3020',
      vehicleName: '그랜드스타렉스',
      changeDate: '2024-12-01',
      mileage: 0,
      oilType: '5W-30',
      nextChangeDate: '2025-12-01',
      nextChangeMileage: 20000,
      currentMileage: 0,
      status: 'normal',
      isNew: true
    },
    {
      id: '23',
      vehicleId: '76',
      vehicleNumber: '169호6918',
      vehicleName: 'The new 카니발',
      changeDate: '2025-01-01',
      mileage: 0,
      oilType: '5W-30',
      nextChangeDate: '2025-07-01',
      nextChangeMileage: 10000,
      currentMileage: undefined,
      status: 'normal',
      isNew: true
    },
    {
      id: '24',
      vehicleId: '71',
      vehicleNumber: '160하4261',
      vehicleName: '싼타페',
      changeDate: '2024-12-01',
      mileage: 0,
      oilType: '5W-30',
      nextChangeDate: '2025-06-01',
      nextChangeMileage: 10000,
      currentMileage: 7645,
      status: 'normal',
      isNew: true
    }
  ]

  useEffect(() => {
    setVehicleSpecs(vehicleOilSpecs)
    setOilRecords(sampleOilRecords)
  }, [])

  // 상태 계산 함수
  const calculateStatus = (nextChangeDate: string, nextChangeMileage: number, currentMileage: number = 0): 'normal' | 'warning' | 'overdue' => {
    const today = new Date()
    const nextDate = new Date(nextChangeDate)
    const daysUntilChange = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilChange < 0 || currentMileage > nextChangeMileage) {
      return 'overdue'
    } else if (daysUntilChange <= 30 || (nextChangeMileage - currentMileage) <= 1000) {
      return 'warning'
    }
    return 'normal'
  }

  // 새 교체 기록 추가
  const handleAddOilChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const selectedSpec = vehicleSpecs.find(spec => spec.vehicleId === selectedVehicle)
    if (!selectedSpec) return

    const changeDate = new Date(formData.get('changeDate') as string)
    const nextChangeDate = new Date(changeDate)
    nextChangeDate.setMonth(nextChangeDate.getMonth() + selectedSpec.changeInterval)

    const currentMileage = parseInt(formData.get('mileage') as string)
    const nextChangeMileage = currentMileage + selectedSpec.mileageInterval

    const newRecord: OilChangeRecord = {
      id: Date.now().toString(),
      vehicleId: selectedSpec.vehicleId,
      vehicleNumber: selectedSpec.vehicleNumber,
      vehicleName: selectedSpec.vehicleName,
      changeDate: formData.get('changeDate') as string,
      mileage: currentMileage,
      oilType: formData.get('oilType') as string,
      nextChangeDate: nextChangeDate.toISOString().split('T')[0],
      nextChangeMileage,
      status: calculateStatus(nextChangeDate.toISOString().split('T')[0], nextChangeMileage, currentMileage)
    }

    setOilRecords([...oilRecords, newRecord])
    setShowAddForm(false)
    setSelectedVehicle('')
  }

  // 필터링된 기록
  const filteredRecords = oilRecords.filter(record =>
    filterStatus === 'all' || record.status === filterStatus
  )

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return '정상'
      case 'warning': return '주의'
      case 'overdue': return '교체필요'
      default: return '알수없음'
    }
  }

  return (
    <div className="p-6 mx-auto max-w-7xl bg-white">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">엔진오일 관리 시스템</h1>
        <p className="text-gray-600">차종별 엔진오일 교체 주기를 관리하고 추적합니다.</p>
      </div>

      {/* 통계 대시보드 */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">전체 차량</h3>
          <p className="text-2xl font-bold text-blue-600">{vehicleSpecs.length}대</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">정상</h3>
          <p className="text-2xl font-bold text-green-600">
            {oilRecords.filter(r => r.status === 'normal').length}대
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">주의</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {oilRecords.filter(r => r.status === 'warning').length}대
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">교체필요</h3>
          <p className="text-2xl font-bold text-red-600">
            {oilRecords.filter(r => r.status === 'overdue').length}대
          </p>
        </div>
      </div>

      {/* 컨트롤 버튼들 */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
        >
          + 교체 기록 추가
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilterStatus('normal')}
            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'normal' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            정상
          </button>
          <button
            onClick={() => setFilterStatus('warning')}
            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'warning' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            주의
          </button>
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'overdue' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            교체필요
          </button>
        </div>
      </div>

      {/* 교체 기록 추가 폼 */}
      {showAddForm && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 w-full max-w-md bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold">엔진오일 교체 기록 추가</h2>
            <form onSubmit={handleAddOilChange}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">차량 선택</label>
                <select
                  name="vehicleId"
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="px-3 py-2 w-full rounded-lg border border-gray-300"
                  required
                >
                  <option value="">차량을 선택하세요</option>
                  {vehicleSpecs.map(spec => (
                    <option key={spec.vehicleId} value={spec.vehicleId}>
                      {spec.vehicleName} ({spec.vehicleNumber})
                    </option>
                  ))}
                </select>
              </div>

              {selectedVehicle && (
                <>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">교체 날짜</label>
                    <input
                      type="date"
                      name="changeDate"
                      className="px-3 py-2 w-full rounded-lg border border-gray-300"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">주행거리 (km)</label>
                    <input
                      type="number"
                      name="mileage"
                      className="px-3 py-2 w-full rounded-lg border border-gray-300"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">오일 타입</label>
                    <input
                      type="text"
                      name="oilType"
                      defaultValue={vehicleSpecs.find(spec => spec.vehicleId === selectedVehicle)?.engineOilType}
                      className="px-3 py-2 w-full rounded-lg border border-gray-300"
                      required
                    />
                  </div>
                </>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-2 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700"
                >
                  추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setSelectedVehicle('')
                  }}
                  className="flex-1 py-2 text-white bg-gray-600 rounded-lg transition-colors hover:bg-gray-700"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 엔진오일 교체 기록 테이블 */}
      <div className="overflow-hidden bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">엔진오일 교체 기록</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">차량정보</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">교체일</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">교체시 주행거리</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">현재 주행거리</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">오일타입</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">다음교체</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex gap-2 items-center">
                        <span className="text-sm font-medium text-gray-900">{record.vehicleName}</span>
                        {record.isNew && (
                          <span className="inline-flex px-2 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">
                            신규
                          </span>
                        )}
                        {record.currentMileage === 0 && (
                          <span className="inline-flex px-2 py-1 text-xs font-bold text-gray-800 bg-gray-100 rounded-full">
                            고정입고
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{record.vehicleNumber}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(record.changeDate).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {record.mileage.toLocaleString()}km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {record.currentMileage ? record.currentMileage.toLocaleString() : '0'}km
                    </div>
                    {record.currentMileage && record.currentMileage > record.nextChangeMileage && (
                      <div className="text-xs font-medium text-red-600">
                        초과: +{(record.currentMileage - record.nextChangeMileage).toLocaleString()}km
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {record.oilType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(record.nextChangeDate).toLocaleDateString('ko-KR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {record.nextChangeMileage.toLocaleString()}km
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusText(record.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 차량별 오일 사양 테이블 */}
      <div className="overflow-hidden mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">차량별 엔진오일 사양</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">차량명</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">차량번호</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">카테고리</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">현재 주행거리</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">연료</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">오일타입</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">용량</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">교체주기</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicleSpecs.map((spec) => (
                <tr key={spec.vehicleId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 items-center">
                      <span className="text-sm font-medium text-gray-900">{spec.vehicleName}</span>
                      {spec.isNew && (
                        <span className="inline-flex px-2 py-1 text-xs font-bold text-blue-800 bg-blue-100 rounded-full">
                          신규
                        </span>
                      )}
                      {spec.currentMileage === 0 && (
                        <span className="inline-flex px-2 py-1 text-xs font-bold text-gray-800 bg-gray-100 rounded-full">
                          고정입고
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {spec.vehicleNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {spec.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {spec.currentMileage ? spec.currentMileage.toLocaleString() : '0'}km
                    </div>
                    {spec.currentMileage && spec.currentMileage > 100000 && (
                      <div className="text-xs font-medium text-orange-600">
                        고주행
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {spec.fuelType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {spec.engineOilType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {spec.oilCapacity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {spec.changeInterval}개월 / {spec.mileageInterval.toLocaleString()}km
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EngineOilManager
