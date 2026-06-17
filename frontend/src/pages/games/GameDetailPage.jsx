import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  Button,
  Chip,
  Rating,
  TextField,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  DesktopWindows as WindowsIcon,
  LaptopMac as MacIcon,
  Computer as LinuxIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  GetApp as DownloadIcon,
  Send as SendIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { fetchGameById, clearCurrentGame } from '../../store/slices/gameSlice';
import gameService from '../../services/gameService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice, formatDate } from '../../utils/helpers';

const GameDetailPage = () => {
  const { appid } = useParams();
  const dispatch = useDispatch();
  const { currentGame, detailLoading, error } = useSelector((state) => state.games);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [relatedGames, setRelatedGames] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // Review submission state
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5); // Out of 10
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadDetails = useCallback(() => {
    dispatch(fetchGameById(appid));
  }, [dispatch, appid]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await gameService.getReviews(appid);
      if (res.success) {
        setReviews(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [appid]);

  const fetchRelated = useCallback(async () => {
    try {
      setRelatedLoading(true);
      const res = await gameService.getRelated(appid);
      if (res.success) {
        setRelatedGames(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load related games:', err);
    } finally {
      setRelatedLoading(false);
    }
  }, [appid]);

  useEffect(() => {
    loadDetails();
    const timer = setTimeout(() => {
      fetchReviews();
      fetchRelated();
    }, 0);
    return () => {
      clearTimeout(timer);
      dispatch(clearCurrentGame());
    };
  }, [loadDetails, fetchReviews, fetchRelated, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      toast.error('Review content cannot be empty.');
      return;
    }
    try {
      setSubmittingReview(true);
      const res = await gameService.addReview(appid, {
        reviewText: newReviewText,
        rating: newRating,
        author: user?.username || 'Anonymous',
      });
      if (res.success) {
        toast.success('Review added successfully!');
        setNewReviewText('');
        setNewRating(5);
        fetchReviews();
        // Reload details to update the avg score
        loadDetails();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl p-4 sm:p-6 shadow-glow-dark'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6';

  const reviewsSectionStyle = theme === 'dark'
    ? 'bg-dark-900/40 rounded-xl p-4 sm:p-6 border border-dark-800'
    : 'bg-gray-50/50 rounded-xl p-4 sm:p-6 border border-gray-100';

  if (detailLoading) {
    return (
      <div className="space-y-6">
        <IconButton component={Link} to="/games" color="inherit">
          <BackIcon />
        </IconButton>
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (!currentGame) {
    return (
      <div className="py-12">
        <EmptyState
          title="Game Not Found"
          description="The requested game listing could not be found."
          action="/games"
          actionLabel="Back to Library"
        />
      </div>
    );
  }

  const isFree = currentGame.price === 0 || currentGame.is_free;
  const discountActive = currentGame.discountPercent > 0;
  const finalPrice = discountActive
    ? currentGame.price * (1 - currentGame.discountPercent / 100)
    : currentGame.price;

  return (
    <>
      <Helmet>
        <title>{`${currentGame.name} - Details | Steam Games Dashboard`}</title>
      </Helmet>

      <div className="space-y-6">
        {/* Back navigation & page title */}
        <div className="flex items-center gap-4">
          <IconButton component={Link} to="/games" className="text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800">
            <BackIcon />
          </IconButton>
          <span className="text-sm text-gray-500 dark:text-dark-400">Back to library</span>
        </div>

        {/* Hero Banner header */}
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] sm:aspect-[25/9] md:aspect-[30/9] w-full shadow-2xl border border-gray-200/10 select-none">
          {currentGame.header_image ? (
            <img
              src={currentGame.header_image}
              alt={currentGame.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-dark-950 to-cyan-950 flex items-center justify-center text-5xl">
              🎮
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="space-y-2">
              {/* AppId Badge */}
              <span className="font-mono text-xs text-primary-400 font-semibold tracking-wider bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-md">
                APPID: {currentGame.appid}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                {currentGame.name}
              </h1>
            </div>
            {/* Rating badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-sm font-extrabold flex items-center gap-1.5 shadow ${
                currentGame.rating >= 80
                  ? 'bg-emerald-500 text-white'
                  : currentGame.rating >= 60
                  ? 'bg-amber-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                ★ {currentGame.rating}%
              </span>
            </div>
          </div>
        </div>

        {/* Content split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Left Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className={cardStyle}>
              <h3 className={`text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                About the Game
              </h3>
              <p className={`text-sm leading-relaxed whitespace-pre-line ${theme === 'dark' ? 'text-dark-300' : 'text-gray-600'}`}>
                {currentGame.description || 'No description provided for this game.'}
              </p>

              {/* Specs & Hardware */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-800">
                <h4 className={`text-sm font-bold mb-4 uppercase tracking-wider ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
                  System Requirements
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Minimum:</h5>
                    <p className="text-xs text-gray-500 dark:text-dark-400 leading-relaxed font-mono">
                      {currentGame.system_requirements?.minimum || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Recommended:</h5>
                    <p className="text-xs text-gray-500 dark:text-dark-400 leading-relaxed font-mono">
                      {currentGame.system_requirements?.recommended || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screenshots Gallery */}
            {currentGame.screenshots?.length > 0 && (
              <div className={cardStyle}>
                <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Screenshots
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentGame.screenshots.map((shot, idx) => (
                    <a
                      key={idx}
                      href={shot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg overflow-hidden border border-gray-100 dark:border-dark-800 shadow hover:opacity-90 transition"
                    >
                      <img src={shot} alt={`screenshot-${idx}`} className="w-full aspect-[16/10] object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews list & submission */}
            <div className={reviewsSectionStyle}>
              <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                User Reviews ({reviews.length})
              </h3>

              {/* Form to submit review */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4 mb-8 pb-8 border-b border-gray-100 dark:border-dark-800">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Write a Review</h4>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-dark-400">Your rating (1-10):</span>
                    <Rating
                      name="review-rating-stars"
                      value={newRating / 2}
                      precision={0.5}
                      onChange={(event, newValue) => setNewRating(newValue * 2)}
                    />
                    <span className="font-semibold text-sm">{newRating} / 10</span>
                  </div>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Tell other players what you think about this game..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    variant="outlined"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={submittingReview}
                      startIcon={submittingReview ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                      className="py-2 px-5 font-semibold text-white rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 shadow-md"
                    >
                      Submit Review
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="mb-6 p-4 rounded-xl border border-dashed border-gray-200 dark:border-dark-800 text-center text-sm text-gray-500 dark:text-dark-400">
                  Please <Link to="/login" className="text-primary-400 font-semibold hover:underline">login</Link> to post a review.
                </div>
              )}

              {/* List of reviews */}
              {reviewsLoading ? (
                <div className="flex justify-center py-6">
                  <CircularProgress size={30} />
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div
                      key={rev._id || rev.username + rev.createdAt}
                      className="p-4 rounded-xl bg-white dark:bg-dark-900/50 border border-gray-100 dark:border-dark-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{rev.username}</span>
                        <span className="text-xs text-gray-500 dark:text-dark-400">{formatDate(rev.createdAt || rev.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-md w-fit">
                        <StarIcon sx={{ fontSize: 14 }} />
                        <span className="text-xs font-bold">{rev.rating} / 10</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-dark-300 leading-relaxed whitespace-pre-wrap">
                        {rev.reviewText}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon="💬" title="No reviews yet" description="Be the first to share your experience!" />
              )}
            </div>
          </div>

          {/* Sidebar Right Info (1/3 width) */}
          <div className="space-y-6">
            {/* Purchase Details */}
            <div className={cardStyle}>
              <h3 className={`text-base font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Purchase Info
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800/50">
                <span className="text-sm text-gray-500 dark:text-dark-400">Base Price:</span>
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {isFree ? 'Free to Play' : formatPrice(currentGame.price)}
                </span>
              </div>

              {discountActive && (
                <>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800/50">
                    <span className="text-sm text-gray-500 dark:text-dark-400">Discount:</span>
                    <span className="text-sm font-semibold text-emerald-500 flex items-center gap-1">
                      <OfferIcon sx={{ fontSize: 16 }} /> -{currentGame.discountPercent}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800/50">
                    <span className="text-sm text-gray-500 dark:text-dark-400">Sale Price:</span>
                    <span className="text-lg font-extrabold text-emerald-500">
                      {formatPrice(finalPrice)}
                    </span>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-dark-800/50">
                <span className="text-sm text-gray-500 dark:text-dark-400">Total Downloads:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <DownloadIcon sx={{ fontSize: 16, color: '#06b6d4' }} /> {currentGame.downloads?.toLocaleString() || '0'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500 dark:text-dark-400">Recommendations:</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                  <PeopleIcon sx={{ fontSize: 16, color: '#6366f1' }} /> {currentGame.recommendations?.toLocaleString() || '0'}
                </span>
              </div>
            </div>

            {/* Meta Details */}
            <div className={cardStyle}>
              <h3 className={`text-base font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Game Specifications
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-gray-500 dark:text-dark-400 block mb-1">Developer</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentGame.developer}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-dark-400 block mb-1">Publisher</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentGame.publisher}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-dark-400 block mb-1">Release Date</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(currentGame.release_date)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-dark-400 block mb-1">Platforms</span>
                  <div className="flex items-center gap-3 mt-1 text-gray-700 dark:text-dark-300">
                    {currentGame.platforms?.includes('windows') && (
                      <div className="flex items-center gap-1" title="Windows Supported">
                        <WindowsIcon sx={{ fontSize: 16 }} />
                        <span className="text-xs font-semibold">Windows</span>
                      </div>
                    )}
                    {currentGame.platforms?.includes('mac') && (
                      <div className="flex items-center gap-1" title="macOS Supported">
                        <MacIcon sx={{ fontSize: 16 }} />
                        <span className="text-xs font-semibold">Mac</span>
                      </div>
                    )}
                    {currentGame.platforms?.includes('linux') && (
                      <div className="flex items-center gap-1" title="Linux Supported">
                        <LinuxIcon sx={{ fontSize: 16 }} />
                        <span className="text-xs font-semibold">Linux</span>
                      </div>
                    )}
                  </div>
                </div>

                {currentGame.genres?.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-dark-400 block mb-1.5">Genres</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentGame.genres.map((g) => (
                        <Chip key={g} label={g} size="small" variant="outlined" />
                      ))}
                    </div>
                  </div>
                )}

                {currentGame.categories?.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500 dark:text-dark-400 block mb-1.5">Categories</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentGame.categories.map((c) => (
                        <Chip key={c} label={c} size="small" className="bg-primary-500/10 text-primary-400 border border-primary-500/20" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Games Carousel Widget */}
            <div className={cardStyle}>
              <h3 className={`text-base font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Related Titles
              </h3>
              {relatedLoading ? (
                <div className="flex justify-center py-4">
                  <CircularProgress size={20} />
                </div>
              ) : relatedGames.length > 0 ? (
                <div className="space-y-4">
                  {relatedGames.slice(0, 3).map((game) => (
                    <Link
                      key={game.appid}
                      to={`/games/${game.appid}`}
                      className="flex items-center gap-3 group border-b border-gray-100 dark:border-dark-800/40 pb-3 last:border-0 last:pb-0"
                    >
                      {game.header_image ? (
                        <img
                          src={game.header_image}
                          alt={game.name}
                          className="w-16 h-10 object-cover rounded shadow"
                        />
                      ) : (
                        <div className="w-16 h-10 bg-dark-800 rounded flex items-center justify-center text-xs">
                          🎮
                        </div>
                      )}
                      <div className="flex-1 truncate">
                        <span className="text-sm font-semibold block group-hover:text-primary-400 transition truncate">
                          {game.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-dark-400">
                          {game.price === 0 ? 'Free' : formatPrice(game.price)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-dark-400">No related titles found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameDetailPage;
