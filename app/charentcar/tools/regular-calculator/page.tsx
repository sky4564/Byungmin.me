import RegularRentalCalculator from '@/components/RegularRentalCalculator'
import ToolLayout from '@/components/layout/ToolLayout'

export default function RegularCalculatorPage() {
  return (
    <ToolLayout toolName="일반렌트카 계산">
      <RegularRentalCalculator />
    </ToolLayout>
  )
}
