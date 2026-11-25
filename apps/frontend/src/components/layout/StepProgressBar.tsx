import React from 'react';
import {
  Calendar,
  Users,
  Palette,
  Download,
  Check,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Ticket,
} from 'lucide-react';

export type WorkflowStepId = 1 | 2 | 3 | 4;

export interface WorkflowStepItem {
  id: WorkflowStepId;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const WORKFLOW_STEPS: WorkflowStepItem[] = [
  {
    id: 1,
    title: 'Event Details',
    shortTitle: 'Event',
    subtitle: 'Identity & venue',
    icon: Calendar,
  },
  {
    id: 2,
    title: 'Import Attendees',
    shortTitle: 'Attendees',
    subtitle: 'CSV roster & seats',
    icon: Users,
  },
  {
    id: 3,
    title: 'Design Tickets',
    shortTitle: 'Design',
    subtitle: 'Templates & preview',
    icon: Palette,
  },
  {
    id: 4,
    title: 'Generate & Export',
    shortTitle: 'Export',
    subtitle: '4 formats & ZIP',
    icon: Download,
  },
];

interface StepProgressBarProps {
  currentStep: WorkflowStepId;
  completedSteps: WorkflowStepId[];
  onSelectStep: (step: WorkflowStepId) => void;
  canNavigateToStep: (step: WorkflowStepId) => boolean;
  eventName?: string;
  attendeeCount?: number;
  onNavigateHome: () => void;
  onLoadDemo?: () => void;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  completedSteps,
  onSelectStep,
  canNavigateToStep,
  eventName = 'PassForge Event',
  attendeeCount = 0,
  onNavigateHome,
  onLoadDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E9E5DC] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left: Brand Identity & Home Link */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#B86E52] rounded-lg p-1"
              title="Return to Public Website"
            >
              <div className="h-8.5 w-8.5 rounded-xl bg-[#B86E52] text-white flex items-center justify-center shadow-xs group-hover:bg-[#A15D43] transition-colors shrink-0">
                <Ticket className="w-4.5 h-4.5" />
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-[#252525] font-sans">
                    PassForge
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] uppercase">
                    Workflow
                  </span>
                </div>
                <span className="text-[10px] text-[#77736C] truncate max-w-[140px]">
                  {eventName}
                </span>
              </div>
            </button>
          </div>

          {/* Center: 4-Step Progress Indicator (Desktop & Tablet) */}
          <nav
            aria-label="Event Setup Steps"
            className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center max-w-2xl"
          >
            {WORKFLOW_STEPS.map((step, idx) => {
              const isCurrent = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isAccessible = canNavigateToStep(step.id);
              const Icon = step.icon;

              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <div
                      className={`h-0.5 w-4 lg:w-7 rounded-full transition-colors ${
                        completedSteps.includes(step.id) || isCurrent
                          ? 'bg-[#B86E52]'
                          : 'bg-[#E9E5DC]'
                      }`}
                    />
                  )}

                  <button
                    type="button"
                    data-testid={`step-indicator-${step.id}`}
                    onClick={() => isAccessible && onSelectStep(step.id)}
                    disabled={!isAccessible}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                      isCurrent
                        ? 'bg-[#FBF2EE] text-[#B86E52] border border-[#F0D5C9] font-bold shadow-2xs'
                        : isCompleted
                        ? 'bg-[#F4F9F5] text-[#2E683E] hover:bg-[#EAF4EC] border border-[#C6E2CD] font-medium cursor-pointer'
                        : isAccessible
                        ? 'text-[#77736C] hover:text-[#252525] hover:bg-[#FAF8F5] cursor-pointer'
                        : 'text-[#BBB7AE] cursor-not-allowed opacity-60'
                    }`}
                    title={
                      !isAccessible
                        ? `Complete prior steps to unlock ${step.title}`
                        : `${step.title}: ${step.subtitle}`
                    }
                  >
                    {/* Step Icon / Status Badge */}
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#B86E52] text-white'
                          : isCompleted
                          ? 'bg-[#2E683E] text-white'
                          : 'bg-[#FAF8F5] border border-[#E9E5DC] text-[#77736C]'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>

                    <div className="text-left hidden lg:block leading-tight">
                      <div className="font-semibold text-xs leading-none">
                        {step.title}
                      </div>
                      <div className="text-[10px] text-[#77736C] font-normal leading-tight mt-0.5">
                        {step.subtitle}
                      </div>
                    </div>

                    <span className="lg:hidden font-semibold text-xs">
                      {step.shortTitle}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right Section: Status Indicator, Demo Data & Step Count */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {attendeeCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E9E5DC] text-xs">
                <Users className="w-3.5 h-3.5 text-[#2E683E]" />
                <span className="font-bold text-[#252525]">{attendeeCount}</span>
                <span className="text-[#77736C] text-[11px]">Attendees</span>
              </div>
            )}

            {onLoadDemo && currentStep <= 2 && (
              <button
                type="button"
                data-testid="header-load-demo-btn"
                onClick={onLoadDemo}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#B86E52] bg-[#FBF2EE] hover:bg-[#F5E2DA] border border-[#F0D5C9] transition-all cursor-pointer"
                title="Populate demo event & 12 attendees directly to Design Studio"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Demo Data</span>
              </button>
            )}

            {/* Mobile Step Badge */}
            <div className="md:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FBF2EE] border border-[#F0D5C9] text-xs font-bold text-[#B86E52]">
              <span>Step {currentStep} of 4</span>
              <span className="text-[#A15D43] font-medium">• {WORKFLOW_STEPS[currentStep - 1].shortTitle}</span>
            </div>
          </div>
        </div>

        {/* Mobile Stepper Line Bar */}
        <div className="md:hidden grid grid-cols-4 gap-1.5 pb-2.5 pt-1">
          {WORKFLOW_STEPS.map((step) => {
            const isCurrent = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isAccessible = canNavigateToStep(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isAccessible && onSelectStep(step.id)}
                disabled={!isAccessible}
                className={`h-1.5 rounded-full transition-all ${
                  isCurrent
                    ? 'bg-[#B86E52]'
                    : isCompleted
                    ? 'bg-[#2E683E]'
                    : 'bg-[#E9E5DC]'
                }`}
                title={`Step ${step.id}: ${step.title}`}
              />
            );
          })}
        </div>
      </div>
    </header>
  );
};
