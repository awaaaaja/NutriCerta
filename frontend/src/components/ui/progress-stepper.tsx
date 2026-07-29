import { Check } from 'lucide-react'

type StepStatus = 'completed' | 'current' | 'upcoming'

interface Step {
  id: string
  label: string
  subtitle?: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
}

function ProgressStepper({ steps, currentStep, onStepClick }: ProgressStepperProps) {
  return (
    <nav aria-label="Progress PAGT" className="w-full">
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const status: StepStatus =
            index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming'

          return (
            <li
              key={step.id}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={status === 'upcoming'}
                className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition
                  ${status === 'upcoming' ? 'text-[var(--color-muted-foreground)] cursor-not-allowed opacity-50' : ''}
                  ${status === 'current' ? 'text-[var(--color-primary)]' : ''}
                  ${status === 'completed' ? 'text-[var(--color-success)] cursor-pointer hover:opacity-80' : ''}
                  ${status !== 'upcoming' && onStepClick ? 'cursor-pointer' : ''}
                `}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 text-xs font-bold shrink-0
                    ${status === 'completed' ? 'bg-[var(--color-success)] border-[var(--color-success)] text-white' : ''}
                    ${status === 'current' ? 'border-[var(--color-primary)] text-[var(--color-primary)]' : ''}
                    ${status === 'upcoming' ? 'border-[var(--color-border)] text-[var(--color-muted-foreground)]' : ''}
                  `}
                >
                  {status === 'completed' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full
                    ${index < currentStep ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}
                  `}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { ProgressStepper, type Step, type StepStatus, type ProgressStepperProps }
