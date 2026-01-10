export type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string;
};

export function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-3 rounded-lg shadow-lg">
        <p className="font-medium text-popover-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="capitalize">{entry.name}:</span>
            <span className="font-mono font-medium text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
