import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Grid,
  Box,
  IconButton,
} from '@mui/material';
import { ArrowBack as BackIcon, Save as SaveIcon } from '@mui/icons-material';
import { createGame, updateGame, fetchGameById, clearCurrentGame } from '../../store/slices/gameSlice';

const GameFormPage = () => {
  const { appid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentGame, loading } = useSelector((state) => state.games);
  const { theme } = useSelector((state) => state.ui);
  
  const isEditMode = Boolean(appid);
  const [initLoading, setInitLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const loadGame = async () => {
        try {
          setInitLoading(true);
          const resultAction = await dispatch(fetchGameById(appid));
          if (fetchGameById.rejected.match(resultAction)) {
            toast.error('Failed to load game data.');
            navigate('/games');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setInitLoading(false);
        }
      };
      loadGame();
    } else {
      dispatch(clearCurrentGame());
    }
    return () => {
      dispatch(clearCurrentGame());
    };
  }, [appid, isEditMode, dispatch, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      appid: currentGame?.appid || '',
      name: currentGame?.name || '',
      release_date: currentGame?.release_date || '',
      release_year: currentGame?.release_year || '',
      price: currentGame?.price || 0,
      discountPercent: currentGame?.discountPercent || 0,
      developer: currentGame?.developer || '',
      publisher: currentGame?.publisher || '',
      description: currentGame?.description || '',
      header_image: currentGame?.header_image || '',
      genres: currentGame?.genres ? currentGame.genres.join(', ') : '',
      categories: currentGame?.categories ? currentGame.categories.join(', ') : '',
      platforms: currentGame?.platforms || ['windows'],
      is_free: currentGame?.is_free || false,
      isEarlyAccess: currentGame?.isEarlyAccess || false,
      isVrOnly: currentGame?.isVrOnly || false,
      screenshots: currentGame?.screenshots ? currentGame.screenshots.join(', ') : '',
      system_requirements: {
        minimum: currentGame?.system_requirements?.minimum || 'OS: Windows 10, Processor: Intel Core i5, Memory: 8 GB RAM, Graphics: GTX 960',
        recommended: currentGame?.system_requirements?.recommended || 'OS: Windows 10/11, Processor: Intel Core i7, Memory: 16 GB RAM, Graphics: GTX 1060 / RTX 3060',
      },
    },
    validationSchema: Yup.object({
      appid: Yup.string().required('App ID is required'),
      name: Yup.string().required('Game name is required'),
      price: Yup.number().min(0, 'Price must be non-negative').required('Price is required'),
      discountPercent: Yup.number().min(0).max(100, 'Discount must be between 0 and 100'),
      developer: Yup.string().required('Developer is required'),
      publisher: Yup.string().required('Publisher is required'),
    }),
    onSubmit: async (values) => {
      // Map comma-separated strings to arrays
      const genresArray = values.genres
        .split(',')
        .map((g) => g.trim())
        .filter((g) => g !== '');
      const categoriesArray = values.categories
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c !== '');
      const screenshotsArray = values.screenshots
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');

      const payload = {
        ...values,
        genres: genresArray,
        categories: categoriesArray,
        screenshots: screenshotsArray,
      };

      try {
        if (isEditMode) {
          const resultAction = await dispatch(updateGame({ appid, gameData: payload }));
          if (updateGame.fulfilled.match(resultAction)) {
            if (resultAction.payload.success) {
              toast.success('Game updated successfully.');
              navigate(`/games/${appid}`);
            } else {
              toast.error(resultAction.payload.message || 'Failed to update game.');
            }
          }
        } else {
          const resultAction = await dispatch(createGame(payload));
          if (createGame.fulfilled.match(resultAction)) {
            if (resultAction.payload.success) {
              toast.success('Game created successfully.');
              navigate('/games');
            } else {
              toast.error(resultAction.payload.message || 'Failed to create game.');
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('An error occurred while saving the game.');
      }
    },
  });

  const handlePlatformCheckbox = (platformName, checked) => {
    const currentPlatforms = [...formik.values.platforms];
    if (checked) {
      if (!currentPlatforms.includes(platformName)) {
        formik.setFieldValue('platforms', [...currentPlatforms, platformName]);
      }
    } else {
      formik.setFieldValue(
        'platforms',
        currentPlatforms.filter((p) => p !== platformName)
      );
    }
  };

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl p-4 sm:p-6 shadow-glow-dark mb-6'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6 mb-6';

  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <CircularProgress />
        <p className="text-sm text-gray-500 dark:text-dark-400">Loading game details...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEditMode ? `Edit Game: ${currentGame?.name}` : 'Add New Game'} | Admin Dashboard</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back link */}
        <div className="flex items-center gap-4">
          <IconButton component={Link} to="/games" className="text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800">
            <BackIcon />
          </IconButton>
          <span className="text-sm text-gray-500 dark:text-dark-400">Cancel & Return to Library</span>
        </div>

        {/* Header */}
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {isEditMode ? 'Edit Game Listing' : 'Add New Game'}
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
            {isEditMode
              ? `Update catalog data for AppID: ${appid}`
              : 'Register a new game entry in the database catalog.'}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Card 1: General Info */}
          <div className={cardStyle}>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              General Information
            </h3>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="appid"
                  name="appid"
                  label="Steam AppID (Unique ID)"
                  disabled={isEditMode}
                  value={formik.values.appid}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.appid && Boolean(formik.errors.appid)}
                  helperText={formik.touched.appid && formik.errors.appid}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Game Title"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="developer"
                  name="developer"
                  label="Developer Company"
                  value={formik.values.developer}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.developer && Boolean(formik.errors.developer)}
                  helperText={formik.touched.developer && formik.errors.developer}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="publisher"
                  name="publisher"
                  label="Publisher Company"
                  value={formik.values.publisher}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                  helperText={formik.touched.publisher && formik.errors.publisher}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="release_date"
                  name="release_date"
                  label="Release Date (e.g. May 2, 2026)"
                  value={formik.values.release_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="release_year"
                  name="release_year"
                  label="Release Year (e.g. 2026)"
                  value={formik.values.release_year}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  id="description"
                  name="description"
                  label="Game Description Summary"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </div>

          {/* Card 2: Pricing & Visual Assets */}
          <div className={cardStyle}>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Pricing & Assets
            </h3>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="price"
                  name="price"
                  label="Base Price (USD)"
                  disabled={formik.values.is_free}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.price && Boolean(formik.errors.price)}
                  helperText={formik.touched.price && formik.errors.price}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  id="discountPercent"
                  name="discountPercent"
                  label="Discount Percentage (0-100)"
                  disabled={formik.values.is_free}
                  value={formik.values.discountPercent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
                  helperText={formik.touched.discountPercent && formik.errors.discountPercent}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="header_image"
                  name="header_image"
                  label="Header Image URL"
                  value={formik.values.header_image}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://..."
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  id="screenshots"
                  name="screenshots"
                  label="Screenshot Image URLs (Comma-separated)"
                  value={formik.values.screenshots}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="https://link1.png, https://link2.png"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </div>

          {/* Card 3: Categorization & Platform Specifications */}
          <div className={cardStyle}>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Compatibility & Metas
            </h3>
            <div className="space-y-6">
              {/* Checkboxes */}
              <div>
                <span className="text-xs text-gray-500 dark:text-dark-400 block mb-2 font-semibold uppercase tracking-wider">Statuses</span>
                <Box className="flex flex-wrap gap-4">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.is_free}
                        onChange={(e) => {
                          formik.setFieldValue('is_free', e.target.checked);
                          if (e.target.checked) {
                            formik.setFieldValue('price', 0);
                            formik.setFieldValue('discountPercent', 0);
                          }
                        }}
                      />
                    }
                    label="Free To Play"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.isEarlyAccess}
                        onChange={(e) => formik.setFieldValue('isEarlyAccess', e.target.checked)}
                      />
                    }
                    label="Early Access"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.isVrOnly}
                        onChange={(e) => formik.setFieldValue('isVrOnly', e.target.checked)}
                      />
                    }
                    label="VR Only"
                  />
                </Box>
              </div>

              {/* Platforms */}
              <div>
                <span className="text-xs text-gray-500 dark:text-dark-400 block mb-2 font-semibold uppercase tracking-wider">Supported Platforms</span>
                <Box className="flex flex-wrap gap-4">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.platforms.includes('windows')}
                        onChange={(e) => handlePlatformCheckbox('windows', e.target.checked)}
                      />
                    }
                    label="Windows"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.platforms.includes('mac')}
                        onChange={(e) => handlePlatformCheckbox('mac', e.target.checked)}
                      />
                    }
                    label="macOS"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.platforms.includes('linux')}
                        onChange={(e) => handlePlatformCheckbox('linux', e.target.checked)}
                      />
                    }
                    label="Linux"
                  />
                </Box>
              </div>

              {/* Genres & Categories tags */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="genres"
                    name="genres"
                    label="Genres (Comma-separated)"
                    value={formik.values.genres}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Action, RPG, Indie"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="categories"
                    name="categories"
                    label="Categories (Comma-separated)"
                    value={formik.values.categories}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Single-player, Multi-player, Steam Achievements"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </div>
          </div>

          {/* Card 4: Hardware requirements */}
          <div className={cardStyle}>
            <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Hardware Specifications
            </h3>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  id="system_requirements.minimum"
                  name="system_requirements.minimum"
                  label="Minimum System Requirements"
                  value={formik.values.system_requirements.minimum}
                  onChange={formik.handleChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  id="system_requirements.recommended"
                  name="system_requirements.recommended"
                  label="Recommended System Requirements"
                  value={formik.values.system_requirements.recommended}
                  onChange={formik.handleChange}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2 pb-12">
            <Button
              component={Link}
              to="/games"
              variant="outlined"
              color="inherit"
              disabled={loading}
              className="rounded-xl px-5 py-2.5 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
              className="py-2.5 px-6 font-semibold text-white rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition"
            >
              {isEditMode ? 'Save Changes' : 'Create Listing'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default GameFormPage;
