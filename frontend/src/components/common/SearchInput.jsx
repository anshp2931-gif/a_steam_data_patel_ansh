import { useState, useMemo } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { debounce } from '../../utils/helpers';

const SearchInput = ({
  placeholder = 'Search...',
  onSearch,
  initialValue = '',
  delay = 400,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  if (initialValue !== prevInitialValue) {
    setValue(initialValue);
    setPrevInitialValue(initialValue);
  }

  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        onSearch(val);
      }, delay),
    [onSearch, delay]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setValue(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <TextField
      {...props}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon className="text-gray-400" />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} edge="end" size="small">
              <ClearIcon className="text-gray-400" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      variant="outlined"
    />
  );
};

export default SearchInput;
