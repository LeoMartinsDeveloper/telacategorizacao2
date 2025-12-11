import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface ConfidenceBadgeProps {
  confidence: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ConfidenceBadge({ confidence, size = 'md' }: ConfidenceBadgeProps) {
  const getConfig = () => {
    if (confidence < 50) {
      return {
        label: 'Baixa Confiança',
        icon: AlertTriangle,
        bgClass: 'bg-confidence-low/15',
        textClass: 'text-confidence-low',
        borderClass: 'border-confidence-low/40',
        barClass: 'bg-confidence-low',
      };
    }
    if (confidence < 75) {
      return {
        label: 'Confiança Média',
        icon: Clock,
        textClass: 'text-confidence-medium',
        bgClass: 'bg-confidence-medium/15',
        borderClass: 'border-confidence-medium/40',
        barClass: 'bg-confidence-medium',
      };
    }
    return {
      label: 'Alta Confiança',
      icon: CheckCircle,
      textClass: 'text-confidence-high',
      bgClass: 'bg-confidence-high/15',
      borderClass: 'border-confidence-high/40',
      barClass: 'bg-confidence-high',
    };
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-3 py-2 text-sm gap-2',
    lg: 'px-4 py-3 text-base gap-3',
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-lg border",
      config.bgClass,
      config.borderClass,
      sizeClasses[size]
    )}>
      <Icon className={cn(
        "shrink-0",
        config.textClass,
        size === 'sm' ? 'h-3.5 w-3.5' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
      )} />
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold", config.textClass)}>
            {confidence}%
          </span>
          <span className="text-muted-foreground">
            {config.label}
          </span>
        </div>
        <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", config.barClass)}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}
