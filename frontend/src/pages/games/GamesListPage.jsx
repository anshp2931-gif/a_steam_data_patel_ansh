import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { fetchGames, deleteGame, setFilters, clearFilters } from '../../store/slices/gameSlice';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice, formatDate, debounce } from '../../utils/helpers';
import { GAME_GENRES, GAME_PLATFORMS, ROLES } from '../../utils/constants';

const GamesListPage = () => {
  const dispatch = useDispatch();
  const { games, pagination, filters, loading, error } = useSelector((state) => state.games);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const [searchParams] = useSearchParams();
  const searchParamVal = searchParams.get('search') || '';

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Local state for debounced search to prevent lagging UI
  const [searchTerm, setSearchTerm] = useState(searchParamVal || filters.search);

  // Sync URL search parameter to Redux filters
  useEffect(() => {
    if (searchParamVal !== filters.search) {
      dispatch(setFilters({ search: searchParamVal }));
      setSearchTerm(searchParamVal);
    }
  }, [searchParamVal, dispatch, filters.search]);

  const isAdmin = user?.role === ROLES.ADMIN;

  const loadData = useCallback(() => {
    dispatch(
      fetchGames({
        page: pagination.currentPage,
        limit: pagination.limit,
        ...filters,
      })
    );
  }, [dispatch, pagination.currentPage, pagination.limit, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Debounced filter dispatch
  const debouncedSetSearch = useMemo(
    () =>
      debounce((val) => {
        dispatch(setFilters({ search: val }));
      }, 500),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSetSearch(e.target.value);
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handlePageChange = (event, newPage) => {
    dispatch(
      fetchGames({
        page: newPage,
        limit: pagination.limit,
        ...filters,
      })
    );
  };

  const handleLimitChange = (e) => {
    dispatch(
      fetchGames({
        page: 1,
        limit: e.target.value,
        ...filters,
      })
    );
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    dispatch(clearFilters());
  };

  const handleDeleteClick = (appid) => {
    setDeleteId(appid);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleteLoading(true);
      const actionResult = await dispatch(deleteGame(deleteId));
      if (deleteGame.fulfilled.match(actionResult)) {
        if (actionResult.payload.success) {
          toast.success('Game deleted successfully.');
          loadData();
        } else {
          toast.error(actionResult.payload.message || 'Failed to delete game.');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting the game.');
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl shadow-glow-dark p-4 sm:p-6'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6';

  const tableHeaderStyle = theme === 'dark'
    ? 'text-left text-xs font-semibold text-dark-400 uppercase tracking-wider p-4 border-b border-dark-800 bg-dark-900/40'
    : 'text-left text-xs font-semibold text-gray-500 uppercase tracking-wider p-4 border-b border-gray-100 bg-gray-50/50';

  const rowStyle = theme === 'dark'
    ? 'border-b border-dark-800/50 hover:bg-dark-900/30 transition text-dark-100'
    : 'border-b border-gray-100 hover:bg-gray-50/50 transition text-gray-800';

  return (
    <>
      <Helmet>
        <title>Games Library | Steam Games Dashboard</title>
      </Helmet>

      <div className="space-y-6">
        {/* Title & Top Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Steam Library
            </h1>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
              Browse, search, filter, and manage Steam game listings.
            </p>
          </div>
          {isAdmin && (
            <Button
              component={Link}
              to="/games/new"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className="py-2.5 px-5 font-semibold rounded-xl text-white shadow-lg bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700"
            >
              Add New Game
            </Button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className={cardStyle}>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <TextField
                fullWidth
                placeholder="Search games by name or AppID..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                className="rounded-xl px-4 py-2 border-gray-300 dark:border-dark-700 hover:bg-gray-100 dark:hover:bg-dark-800"
              >
                Filters
              </Button>
              {(filters.search || filters.genre || filters.platform || filters.isFree || filters.sort) && (
                <IconButton onClick={handleClearFilters} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20">
                  <ClearIcon />
                </IconButton>
              )}
            </div>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-dark-800">
              {/* Genre Filter */}
              <FormControl fullWidth>
                <InputLabel id="genre-label">Genre</InputLabel>
                <Select
                  labelId="genre-label"
                  id="genre-select"
                  value={filters.genre}
                  label="Genre"
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                >
                  <MenuItem value="">All Genres</MenuItem>
                  {GAME_GENRES.map((g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Platform Filter */}
              <FormControl fullWidth>
                <InputLabel id="platform-label">Platform</InputLabel>
                <Select
                  labelId="platform-label"
                  id="platform-select"
                  value={filters.platform}
                  label="Platform"
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                >
                  <MenuItem value="">All Platforms</MenuItem>
                  {GAME_PLATFORMS.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort Order */}
              <FormControl fullWidth>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  id="sort-select"
                  value={filters.sort}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="rating-desc">Rating: High to Low</MenuItem>
                  <MenuItem value="release-desc">Release: Newest First</MenuItem>
                </Select>
              </FormControl>

              {/* Free to Play Checkbox */}
              <div className="flex items-center justify-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.isFree === 'true'}
                      onChange={(e) => handleFilterChange('isFree', e.target.checked ? 'true' : '')}
                    />
                  }
                  label="Free to Play Only"
                />
              </div>
            </div>
          )}
        </div>

        {/* Main List Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-dark-800 bg-white dark:bg-surface-dark-card shadow-lg">
          {loading ? (
            <div className="p-6">
              <SkeletonLoader type="table" count={1} />
            </div>
          ) : games.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className={`${tableHeaderStyle} hidden md:table-cell`}>AppID</th>
                    <th className={tableHeaderStyle}>Game</th>
                    <th className={`${tableHeaderStyle} hidden sm:table-cell`}>Release Date</th>
                    <th className={tableHeaderStyle}>Price</th>
                    <th className={tableHeaderStyle}>Rating</th>
                    <th className={`${tableHeaderStyle} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game) => (
                    <tr key={game.appid} className={rowStyle}>
                      <td className="p-4 font-mono text-xs text-gray-500 dark:text-dark-400 hidden md:table-cell">
                        {game.appid}
                      </td>
                      <td className="p-4 font-semibold text-sm">
                        <Link to={`/games/${game.appid}`} className="flex items-center gap-3 group">
                          {game.header_image ? (
                            <img
                              src={game.header_image}
                              alt={game.name}
                              className="w-16 h-8 object-cover rounded shadow"
                            />
                          ) : (
                            <div className="w-16 h-8 bg-dark-800 rounded flex items-center justify-center text-xs">
                              🎮
                            </div>
                          )}
                          <span className="group-hover:text-primary-400 transition truncate max-w-[200px]">
                            {game.name}
                          </span>
                        </Link>
                      </td>
                      <td className="p-4 text-sm text-gray-500 dark:text-dark-400 hidden sm:table-cell">
                        {formatDate(game.release_date)}
                      </td>
                      <td className="p-4 text-sm font-semibold">
                        {formatPrice(game.price)}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          game.rating >= 80
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : game.rating >= 60
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {game.rating}%
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <IconButton
                            component={Link}
                            to={`/games/${game.appid}`}
                            className="text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800"
                            size="small"
                          >
                            <ViewIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          {isAdmin && (
                            <>
                              <IconButton
                                component={Link}
                                to={`/games/${game.appid}/edit`}
                                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                size="small"
                              >
                                <EditIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                              <IconButton
                                onClick={() => handleDeleteClick(game.appid)}
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                size="small"
                              >
                                <DeleteIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <EmptyState
                title="No Games Found"
                description="Try clearing filters or adjusting search queries."
                action={handleClearFilters}
                actionLabel="Reset Filters"
              />
            </div>
          )}
        </div>

        {/* Pagination & Footer controls */}
        {games.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-dark-400">
              <span>Rows per page:</span>
              <select
                value={pagination.limit}
                onChange={handleLimitChange}
                className="bg-transparent border border-gray-300 dark:border-dark-700 rounded-lg p-1 text-sm font-semibold"
              >
                <option value="5" className="dark:bg-dark-900">5</option>
                <option value="10" className="dark:bg-dark-900">10</option>
                <option value="25" className="dark:bg-dark-900">25</option>
                <option value="50" className="dark:bg-dark-900">50</option>
              </select>
              <span className="ml-4">
                Total: <strong>{pagination.totalItems}</strong> entries
              </span>
            </div>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </div>
        )}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Game listing"
        message="Are you sure you want to permanently delete this game from the Steam library? This action is irreversible."
        confirmText="Delete"
        loading={deleteLoading}
        type="danger"
      />
    </>
  );
};

export default GamesListPage;
