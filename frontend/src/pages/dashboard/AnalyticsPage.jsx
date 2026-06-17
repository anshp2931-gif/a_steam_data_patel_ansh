import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ShowChart as ChartIcon,
  StarBorder as StarIcon,
  QueryStats as QueryStatsIcon,
} from '@mui/icons-material';
import statsService from '../../services/statsService';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice, formatNumber } from '../../utils/helpers';


const AnalyticsPage = () => {
  const { theme } = useSelector((state) => state.ui);
  const [loading, setLoading] = useState(true);
  
  const [userActivity, setUserActivity] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [genreDist, setGenreDist] = useState([]);
  const [platformDist, setPlatformDist] = useState([]);
  const [releaseTrends, setReleaseTrends] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [
          activityRes,
          revenueRes,
          genreDistRes,
          platformDistRes,
          releaseTrendsRes,
          wishlistRes,
          reviewRes,
        ] = await Promise.all([
          statsService.getUserActivityAnalytics(),
          statsService.getRevenueAnalytics(),
          statsService.getGenreDistributionAnalytics(),
          statsService.getPlatformDistributionAnalytics(),
          statsService.getReleaseTrendsAnalytics(),
          statsService.getWishlistAnalytics(),
          statsService.getReviewAnalytics(),
        ]);

        if (activityRes.success) setUserActivity(activityRes.data);
        if (revenueRes.success) setRevenueData(revenueRes.data);
        if (genreDistRes.success) setGenreDist(genreDistRes.data);
        if (platformDistRes.success) setPlatformDist(platformDistRes.data);
        if (releaseTrendsRes.success) {
          // Sort release year trends chronologically
          const sorted = [...releaseTrendsRes.data].sort((a, b) => Number(a.year) - Number(b.year));
          setReleaseTrends(sorted);
        }
        if (wishlistRes.success) setWishlistData(wishlistRes.data);
        if (reviewRes.success) setReviewData(reviewRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load advanced analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl p-4 sm:p-6 shadow-glow-dark'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6';

  const tableHeaderStyle = theme === 'dark'
    ? 'text-left text-xs font-semibold text-dark-400 uppercase tracking-wider pb-3 border-b border-dark-800'
    : 'text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100';

  const rowStyle = theme === 'dark'
    ? 'border-b border-dark-800/50 hover:bg-dark-900/30 transition text-dark-100 text-sm'
    : 'border-b border-gray-100 hover:bg-gray-50/50 transition text-gray-800 text-sm';

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-dark-700/20 dark:bg-dark-800/40 rounded skeleton-shimmer mb-2" />
          <div className="h-4 w-72 bg-dark-700/20 dark:bg-dark-800/40 rounded skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <SkeletonLoader type="card" count={4} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="chart" count={4} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Advanced Analytics | Admin Dashboard</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Advanced Database Insights
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
            Admin panel for database stats, estimates, distributions, and platform demographics.
          </p>
        </div>

        {/* User Activity Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`${cardStyle} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Active Users Today</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{formatNumber(userActivity.activeUsersToday)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500">
              <PeopleIcon />
            </div>
          </div>
          <div className={`${cardStyle} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Peak Concurrent</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{formatNumber(userActivity.peakConcurrentPlayers)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
              <TrendingUpIcon />
            </div>
          </div>
          <div className={`${cardStyle} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Games Played Today</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{formatNumber(userActivity.gamesPlayedToday)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <QueryStatsIcon />
            </div>
          </div>
          <div className={`${cardStyle} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Hours Streamed</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{formatNumber(userActivity.hoursStreamed)}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ChartIcon />
            </div>
          </div>
        </div>

        {/* First Row Charts: Estimated Revenue & Release Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Revenue chart */}
          <div className={cardStyle}>
            <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Top 10 Estimated Revenue Games (Base Price &times; Downloads)
            </h3>
            {revenueData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }}
                      angle={-30}
                      textAnchor="end"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `$${formatNumber(val)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1f35' : '#fff',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      }}
                      formatter={(value) => [formatPrice(value), 'Est. Revenue']}
                    />
                    <Bar dataKey="estimatedRevenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No Revenue Data" description="Requires pricing and download counts." />
            )}
          </div>

          {/* Release Trends */}
          <div className={cardStyle}>
            <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Release Timelines & Avg Prices
            </h3>
            {releaseTrends.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={releaseTrends} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1f35' : '#fff',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCount)" name="Games Released" />
                    <Line type="monotone" dataKey="averagePrice" stroke="#ec4899" strokeWidth={2} name="Avg Price ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No release year data" description="Populate release dates to visualize trends." />
            )}
          </div>
        </div>

        {/* Second Row Charts: Genre Distribution Avg Price & Platform Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Genre pricing distribution */}
          <div className={cardStyle}>
            <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Genre Density & Pricing Metrics
            </h3>
            {genreDist.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreDist} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis
                      dataKey="genre"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 10 }}
                      angle={-30}
                      textAnchor="end"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1f35' : '#fff',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="#10b981" name="Games Count" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="averagePrice" fill="#f59e0b" name="Avg Price ($)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No Genre Info" description="Empty database distribution." />
            )}
          </div>

          {/* Platform Distribution & Pricing */}
          <div className={cardStyle}>
            <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Platform Count vs Average Price
            </h3>
            {platformDist.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformDist} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis
                      dataKey="platform"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1f35' : '#fff',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" fill="#8b5cf6" name="Games Count" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="averagePrice" fill="#06b6d4" name="Avg Price ($)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No Platform Info" description="Empty platform metrics." />
            )}
          </div>
        </div>

        {/* Third Row: Tables for wishlist popularity & review volume */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Wishlist analysis */}
          <div className={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <StarIcon className="text-amber-500" />
              <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Wishlist & Recommendation Stats
              </h3>
            </div>
            {wishlistData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className={tableHeaderStyle}>Game</th>
                      <th className={tableHeaderStyle}>Recommendations</th>
                      <th className={tableHeaderStyle}>Wishlist Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlistData.map((game) => (
                      <tr key={game.appid} className={rowStyle}>
                        <td className="py-3 font-semibold text-gray-900 dark:text-white">{game.name}</td>
                        <td className="py-3">{formatNumber(game.recommendations)}</td>
                        <td className="py-3 font-bold text-primary-500">{formatNumber(game.mockWishlistCount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No Wishlist Data" description="Wishlist analysis results empty." />
            )}
          </div>

          {/* Review volume analysis */}
          <div className={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <QueryStatsIcon className="text-indigo-500" />
              <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Review Densities & Ratings
              </h3>
            </div>
            {reviewData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className={tableHeaderStyle}>Game</th>
                      <th className={tableHeaderStyle}>Total Reviews</th>
                      <th className={tableHeaderStyle}>Rating Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewData.map((game) => (
                      <tr key={game.appid} className={rowStyle}>
                        <td className="py-3 font-semibold text-gray-900 dark:text-white">{game.name}</td>
                        <td className="py-3">{formatNumber(game.totalReviewsCount)}</td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            game.rating >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {game.rating}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No Review Data" description="Reviews metrics analysis results empty." />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;
