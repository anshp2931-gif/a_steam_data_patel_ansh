import { useSelector } from 'react-redux';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const { theme } = useSelector((state) => state.ui);
  const baseClass = theme === 'dark' ? 'bg-dark-800/50' : 'bg-gray-200';

  const skeletons = {
    card: () => (
      <div
        className={`rounded-xl p-6 ${
          theme === 'dark' ? 'bg-surface-dark-card border border-dark-700/30' : 'bg-white border border-gray-100'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className={`h-4 w-24 rounded ${baseClass} skeleton-shimmer`} />
            <div className={`h-8 w-20 rounded ${baseClass} skeleton-shimmer`} />
            <div className={`h-3 w-32 rounded ${baseClass} skeleton-shimmer`} />
          </div>
          <div className={`w-12 h-12 rounded-xl ${baseClass} skeleton-shimmer`} />
        </div>
      </div>
    ),
    table: () => (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-14 rounded-lg ${baseClass} skeleton-shimmer`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    ),
    chart: () => (
      <div
        className={`rounded-xl p-6 h-80 ${
          theme === 'dark' ? 'bg-surface-dark-card border border-dark-700/30' : 'bg-white border border-gray-100'
        }`}
      >
        <div className={`h-5 w-32 rounded mb-6 ${baseClass} skeleton-shimmer`} />
        <div className={`h-full rounded ${baseClass} skeleton-shimmer`} />
      </div>
    ),
    detail: () => (
      <div className="space-y-4">
        <div className={`h-48 rounded-xl ${baseClass} skeleton-shimmer`} />
        <div className={`h-6 w-48 rounded ${baseClass} skeleton-shimmer`} />
        <div className={`h-4 w-full rounded ${baseClass} skeleton-shimmer`} />
        <div className={`h-4 w-3/4 rounded ${baseClass} skeleton-shimmer`} />
      </div>
    ),
  };

  const SkeletonComponent = skeletons[type] || skeletons.card;

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          <SkeletonComponent />
        </div>
      ))}
    </>
  );
};

export default SkeletonLoader;
