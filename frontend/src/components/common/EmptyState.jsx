import { useSelector } from 'react-redux';

const EmptyState = ({
  icon = '📭',
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
  actionLabel = 'Create New',
}) => {
  const { theme } = useSelector((state) => state.ui);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div
        className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
          theme === 'dark' ? 'bg-dark-800/50' : 'bg-gray-100'
        }`}
      >
        <span className="text-4xl">{icon}</span>
      </div>
      <h3
        className={`text-lg font-semibold mb-2 ${
          theme === 'dark' ? 'text-dark-200' : 'text-gray-700'
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-sm text-center max-w-sm mb-6 ${
          theme === 'dark' ? 'text-dark-400' : 'text-gray-500'
        }`}
      >
        {description}
      </p>
      {action && (
        <button
          onClick={action}
          className="px-5 py-2.5 rounded-lg bg-gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
