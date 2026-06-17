import { Button, Typography } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

const ErrorState = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section. Please try again.',
  onRetry,
  retryLabel = 'Retry Request',
}) => {

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm mx-auto my-6 animate-fade-in select-none">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4 animate-pulse">
        <ErrorIcon sx={{ fontSize: 36 }} />
      </div>
      <Typography
        variant="h6"
        className="font-bold mb-1 text-gray-900 dark:text-white"
        style={{ fontWeight: 700 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        className="text-gray-500 dark:text-dark-400 mb-6 leading-relaxed"
      >
        {description}
      </Typography>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outlined"
          color="error"
          startIcon={<RefreshIcon />}
          className="px-5 py-2 rounded-xl font-semibold border-red-500 text-red-500 hover:bg-red-500/10 transition"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
