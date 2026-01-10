import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { LearningActivityChart } from "@/components/dashboard/LearningActivityChart";
import { SkillMasteryChart } from "@/components/dashboard/SkillMasteryChart";
import { ContinueLearning } from "@/components/dashboard/ContinueLearning";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-[180px] flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <DashboardHeader streak={3} />

          {/* Stats Cards */}
          <div className="mb-6">
            <StatsCards />
          </div>

          {/* Charts Row */}
          <div className="mb-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <LearningActivityChart />
            <SkillMasteryChart />
          </div>

          {/* Continue Learning */}
          <ContinueLearning />
        </div>
      </main>
    </div>
  );
};

export default Index;
