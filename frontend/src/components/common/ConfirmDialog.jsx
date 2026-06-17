import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  loading = false,
}) => {
  const { theme } = useSelector((state) => state.ui);

  const typeColors = {
    danger: { icon: '#ef4444', btn: 'error' },
    warning: { icon: '#f59e0b', btn: 'warning' },
    info: { icon: '#6366f1', btn: 'primary' },
  };

  const colors = typeColors[type] || typeColors.danger;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme === 'dark' ? '#1a1f35' : '#fff',
          border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: `${colors.icon}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WarningIcon sx={{ color: colors.icon }} />
        </div>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          sx={{ color: theme === 'dark' ? '#94a3b8' : '#64748b', mt: 0.5 }}
        >
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={colors.btn}
          disabled={loading}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
