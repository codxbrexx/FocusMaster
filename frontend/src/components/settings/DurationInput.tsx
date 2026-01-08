import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DurationInputProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export const DurationInput = ({ label, value, onChange, min = 1, max = 60 }: DurationInputProps) => (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-secondary/20 border border-border/50">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {label}
        </Label>
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
            >
                <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 flex justify-center items-center gap-1">
                <Input
                    type="number"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                            if (val > max) onChange(max);
                            else if (val < min && val !== 0)
                                onChange(min);
                            else onChange(val);
                        } else if (e.target.value === '') {
                            onChange(min);
                        }
                    }}
                    onBlur={(e) => {
                        let val = parseInt(e.target.value);
                        if (isNaN(val) || val < min) val = min;
                        if (val > max) val = max;
                        if (val !== value) onChange(val);
                    }}
                    className="w-16 h-10 text-2xl font-bold font-mono text-center p-0 border-none bg-transparent focus-visible:ring-0 shadow-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs text-muted-foreground pt-1.5 font-medium">
                    min
                </span>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                onClick={() => onChange(Math.min(max, Number(value) + 1))}
                disabled={value >= max}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    </div>
);
