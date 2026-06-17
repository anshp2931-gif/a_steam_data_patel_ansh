import { useSelector } from 'react-redux';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

const StatsCard = ({ title, value, icon, trend, trendValue, color = 'primary', subtitle }) => {
  const { theme } = useSelector((state) => state.ui);

  const colorMap = {
    primary: {
      bg: theme === 'dark' ? 'bg-primary-500/10' : 'bg-primary-50',
      icon: 'text-primary-500',
      glow: 'shadow-glow-primary/10',
      gradient: 'from-primary-500/20 to-primary-600/5',
    },
    accent: {
      bg: theme === 'dark' ? 'bg-accent-500/10' : 'bg-cyan-50',
      icon: 'text-accent-500',
      glow: 'shadow-glow-accent/10',
      gradient: 'from-accent-500/20 to-accent-600/5',
    },
    success: {
      bg: theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50',
      icon: 'text-emerald-500',
      glow: 'shadow-glow-success/10',
      gradient: 'from-emerald-500/20 to-emerald-600/5',
    },
    warning: {
      bg: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50',
      icon: 'text-amber-500',
      glow: '',
      gradient: 'from-amber-500/20 to-amber-600/5',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Remove;
  const trendColor =
    trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-dark-400';

  return (
    <div
      className={`stat-card relative overflow-hidden hover-lift ${
        theme === 'dark'
          ? 'bg-surface-dark-card border border-dark-700/30'
          : 'bg-white border border-gray-100 shadow-card-light'
      }`}
    >
      {/* Background gradient decoration */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${colors.gradient} blur-2xl opacity-60 -translate-y-8 translate-x-8`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
            {title}
          </p>
          <h3 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-dark-50' : 'text-gray-900'}`}>
            {value}
          </h3>
          {trendValue && (
            <div className="flex items-center gap-1">
              <TrendIcon sx={{ fontSize: 16 }} className={trendColor} />
              <span className={`text-xs font-medium ${trendColor}`}>{trendValue}</span>
              {subtitle && (
                <span className={`text-xs ${theme === 'dark' ? 'text-dark-500' : 'text-gray-400'}`}>
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={colors.icon}>{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
