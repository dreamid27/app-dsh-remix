export const enum OnboardingStatus {
  LongOnboarding = "long_onboarding",
  Ongoing = "ongoing",
  InCompleted = "incompleted",
  Completed = "completed",

  // New Onboarding
  NeedKickoff = "need_kickoff",
  OnboardingData = "onboarding_data",
  NeedCall = "need_call",
  // -> LongOnboarding, exist on top
  OnboardedData = "onboarded_data",
  OnboardedFull = "onboarded_full",
}
