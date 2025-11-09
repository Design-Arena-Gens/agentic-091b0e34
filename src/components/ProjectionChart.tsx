import { FutureProjectionPoint } from "@/lib/types";

interface ProjectionChartProps {
  data: FutureProjectionPoint[];
}

const formatNumber = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

export const ProjectionChart = ({ data }: ProjectionChartProps) => {
  if (!data.length) return null;

  const values = data.flatMap((point) => [point.optimistic, point.pessimistic]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const padding = (maxValue - minValue) * 0.12;
  const minY = minValue - padding;
  const maxY = maxValue + padding;

  const scaleX = (index: number) => (index / (data.length - 1)) * 100;
  const scaleY = (value: number) => 100 - ((value - minY) / (maxY - minY)) * 100;

  const optimisticPath = data
    .map((point, index) => `${scaleX(index)},${scaleY(point.optimistic)}`)
    .join(" ");
  const basePath = data.map((point, index) => `${scaleX(index)},${scaleY(point.projectedPrice)}`).join(" ");
  const pessimisticPath = data
    .map((point, index) => `${scaleX(index)},${scaleY(point.pessimistic)}`)
    .join(" ");

  return (
    <div className="relative h-48 w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="projectionGradient" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="rgba(99, 255, 202, 0.18)" />
            <stop offset="100%" stopColor="rgba(33, 141, 245, 0.3)" />
          </linearGradient>
        </defs>
        <polyline
          points={`${pessimisticPath} ${optimisticPath
            .split(" ")
            .reverse()
            .join(" ")}`}
          fill="url(#projectionGradient)"
          stroke="none"
          opacity={0.45}
        />
        <polyline
          points={optimisticPath}
          fill="none"
          stroke="rgba(99, 255, 202, 0.75)"
          strokeWidth={0.7}
          strokeDasharray="2 1.5"
        />
        <polyline
          points={basePath}
          fill="none"
          stroke="rgba(33, 141, 245, 0.95)"
          strokeWidth={1.2}
        />
        <polyline
          points={pessimisticPath}
          fill="none"
          stroke="rgba(252, 165, 165, 0.6)"
          strokeWidth={0.7}
          strokeDasharray="2 1.5"
        />
      </svg>
      <div className="relative flex h-full w-full flex-col justify-between text-xs">
        <div className="flex w-full justify-between text-[11px] uppercase tracking-wide text-slate-300">
          <span>Year</span>
          <span>Projected</span>
        </div>
        <div className="grid grid-cols-4 gap-1 text-[10px] font-semibold text-slate-400">
          {data.slice(0, 4).map((point) => (
            <div key={point.year} className="rounded-lg bg-black/30 px-2 py-1 text-center">
              <p>{point.year}</p>
              <p className="text-[11px] text-brand-200">${formatNumber.format(point.projectedPrice)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectionChart;
