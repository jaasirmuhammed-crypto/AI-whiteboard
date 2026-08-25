import React, { useState } from 'react';
import { UserGrowthDataPoint, ConversionFunnelStage, FeatureUsageMetric } from '../../types/analytics';

interface LineChartProps {
  data: { label: string; value: number; secondaryValue?: number }[];
  height?: number;
  primaryColor?: string;
  secondaryColor?: string;
  primaryLegend?: string;
  secondaryLegend?: string;
  unit?: string;
}

export const DynamicLineChart: React.FC<LineChartProps> = ({
  data,
  height = 240,
  primaryColor = '#6366f1',
  secondaryColor = '#10b981',
  primaryLegend = 'Metric 1',
  secondaryLegend,
  unit = '',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center text-slate-400 text-sm">
        No chart data available for the selected period.
      </div>
    );
  }

  const width = 800;
  const paddingX = 40;
  const paddingY = 30;

  const maxVal = Math.max(
    1,
    ...data.map((d) => Math.max(d.value, d.secondaryValue || 0))
  );

  const getY = (val: number) => {
    return height - paddingY - (val / maxVal) * (height - paddingY * 2);
  };

  const getX = (index: number) => {
    if (data.length <= 1) return width / 2;
    return paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
  };

  const points1 = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const area1 = `${points1} ${getX(data.length - 1)},${height - paddingY} ${getX(0)},${height - paddingY}`;

  const hasSecondary = data.some((d) => d.secondaryValue !== undefined);
  const points2 = hasSecondary ? data.map((d, i) => `${getX(i)},${getY(d.secondaryValue || 0)}`).join(' ') : '';

  return (
    <div className="w-full space-y-2">
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
          <span className="text-slate-600 dark:text-slate-300">{primaryLegend}</span>
        </div>
        {hasSecondary && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }} />
            <span className="text-slate-600 dark:text-slate-300">{secondaryLegend}</span>
          </div>
        )}
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`grad_${primaryColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = height - paddingY - pct * (height - paddingY * 2);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {Math.round(pct * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Primary Area Fill */}
          <polygon points={area1} fill={`url(#grad_${primaryColor.replace('#', '')})`} />

          {/* Primary Stroke Line */}
          <polyline
            points={points1}
            fill="none"
            stroke={primaryColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Secondary Stroke Line */}
          {hasSecondary && (
            <polyline
              points={points2}
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2.5"
              strokeDasharray="5 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Data points */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.value);
            const isHover = hoverIndex === i;
            return (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHover ? 6 : 4}
                  fill={primaryColor}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
                {/* X Axis Labels */}
                {(data.length <= 10 || i % Math.ceil(data.length / 8) === 0) && (
                  <text
                    x={cx}
                    y={height - 8}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoverIndex !== null && data[hoverIndex] && (
          <div
            className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-slate-900 text-white shadow-xl text-xs space-y-1 transform -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${(getX(hoverIndex) / width) * 100}%`,
              top: `${(getY(data[hoverIndex].value) / height) * 100}%`,
            }}
          >
            <div className="font-bold text-[11px] text-slate-300">{data[hoverIndex].label}</div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span>{primaryLegend}: {unit}{data[hoverIndex].value}</span>
            </div>
            {data[hoverIndex].secondaryValue !== undefined && (
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
                <span>{secondaryLegend}: {unit}{data[hoverIndex].secondaryValue}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const FunnelBarChart: React.FC<{ stages: ConversionFunnelStage[] }> = ({ stages }) => {
  return (
    <div className="space-y-3">
      {stages.map((st, idx) => {
        return (
          <div key={st.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{st.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 dark:text-white">{st.count}</span>
                <span className="text-slate-400 text-[11px]">({st.conversionFromFirst}%)</span>
                {idx > 0 && st.dropOffRate > 0 && (
                  <span className="text-[10px] text-rose-500 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded">
                    -{st.dropOffRate}% drop
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, st.conversionFromFirst)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureDistributionBars: React.FC<{ features: FeatureUsageMetric[] }> = ({ features }) => {
  const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b'];

  return (
    <div className="space-y-3">
      {features.map((f, i) => {
        const color = colors[i % colors.length];
        return (
          <div key={f.featureId} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{f.featureName}</span>
                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                  {f.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 dark:text-white">{f.count} actions</span>
                <span className="text-slate-400 text-[11px]">({f.percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(2, f.percentage)}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
