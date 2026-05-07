import { Plane, ShieldCheck, Car, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    title: '24시간 공항 픽업/반납',
    description: '비행 일정에 맞춰 인천공항에서 24시간 픽업 및 반납을 지원합니다.',
    icon: Plane,
  },
  {
    title: '보험 포함 합리적 요금',
    description: '모든 차량 기본 보험 포함으로 숨은 비용 부담을 줄였습니다.',
    icon: ShieldCheck,
  },
  {
    title: '다양한 차종 선택',
    description: '경차, SUV, 대형차, 수입차 등 목적에 맞는 차량을 선택할 수 있습니다.',
    icon: Car,
  },
]

export default function AirportRent24ProjectPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <section className="container px-4 py-16 mx-auto">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-sky-600">
            ← 포트폴리오로 돌아가기
          </Link>

          <div className="p-8 mb-10 bg-white rounded-2xl border border-sky-100 shadow-lg">
            <h1 className="mb-3 text-4xl font-bold text-gray-900">공항렌트24 웹페이지</h1>
            <p className="mb-6 text-lg text-gray-600">
              인천공항 중심의 24시간 렌터카 픽업 서비스를 소개하는 프로젝트입니다.
              핵심 서비스와 예약 유도 정보를 직관적으로 전달하도록 구성했습니다.
            </p>
            <a
              href="https://airportrent24.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3 font-semibold text-white bg-sky-600 rounded-xl transition-colors hover:bg-sky-700"
            >
              실사이트 열기
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <article key={service.title} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex justify-center items-center mb-4 w-12 h-12 bg-sky-100 rounded-xl">
                    <Icon className="w-6 h-6 text-sky-600" />
                  </div>
                  <h2 className="mb-2 text-lg font-bold text-gray-900">{service.title}</h2>
                  <p className="text-sm leading-relaxed text-gray-600">{service.description}</p>
                </article>
              )
            })}
          </div>

          <section className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">연락처 / 운영 정보</h2>
            <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
              <div className="flex items-start">
                <Phone className="mt-0.5 mr-2 w-4 h-4 text-sky-600" />
                <span>대표번호: 032-427-5500 / 휴대전화: 010-8426-3821</span>
              </div>
              <div className="flex items-start">
                <Mail className="mt-0.5 mr-2 w-4 h-4 text-sky-600" />
                <span>이메일: charent@charentcar.com</span>
              </div>
              <div className="flex items-start md:col-span-2">
                <MapPin className="mt-0.5 mr-2 w-4 h-4 text-sky-600" />
                <span>주소: 인천광역시 중구 공항로 272</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
