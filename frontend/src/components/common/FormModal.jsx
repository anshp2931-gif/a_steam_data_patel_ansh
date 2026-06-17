import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const FormModal = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  const { theme } = useSelector((state) => state.ui);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          bgcolor: theme === 'dark' ? '#1a1f35' : '#fff',
          border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
          borderRadius: '16px',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
        <Typography variant="h6" fontWeight={700} className="text-gray-900 dark:text-white flex-1">
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: theme === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.08)', py: 3 }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ p: 2, gap: 1 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FormModal;
