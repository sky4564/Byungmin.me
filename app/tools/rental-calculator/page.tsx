import RentalCarCalculator from '@/components/RentalCarCalculator'
import ToolLayout from '@/components/layout/ToolLayout'

export default function RentalCalculatorPage() {
  return (
    <ToolLayout toolName="기사포함 계산">
      <RentalCarCalculator />
    </ToolLayout>
  )
}
