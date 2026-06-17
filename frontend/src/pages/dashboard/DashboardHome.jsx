import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  SportsEsports as SportsEsportsIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Percent as PercentIcon,
  LocalFireDepartment as HotIcon,
} from '@mui/icons-material';
import StatsCard from '../../components/common/StatsCard';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import statsService from '../../services/statsService';
import gameService from '../../services/gameService';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];

const DashboardHome = () => {
  const { theme } = useSelector((state) => state.ui);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGames: 0,
    avgPrice: 0,
    avgRating: 0,
    freeToPlayCount: 0,
  });
  const [genreData, setGenreData] = useState([]);
  const [platformData, setPlatformData] = useState([]);
  const [releaseData, setReleaseData] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);
  const [topRatedGames, setTopRatedGames] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          countRes,
          priceRes,
          ratingRes,
          f2pRes,
          genreRes,
          platformRes,
          releaseRes,
          trendingRes,
          topRatedRes,
        ] = await Promise.all([
          statsService.getGamesCount(),
          statsService.getAveragePrice(),
          statsService.getAverageRating(),
          statsService.getFreeToPlayCount(),
          statsService.getGenreCount(),
          statsService.getPlatformCount(),
          statsService.getMonthlyReleases(),
          gameService.getTrending(),
          statsService.getTopRated(),
        ]);

        setStats({
          totalGames: countRes.data?.totalGames || 0,
          avgPrice: priceRes.data?.averagePrice || 0,
          avgRating: ratingRes.data?.averageRating || 0,
          freeToPlayCount: f2pRes.data?.freeToPlayCount || 0,
        });

        // Map Genre Count
        if (genreRes.success && genreRes.data) {
          // Take top 7 and group the rest into 'Other'
          const sorted = [...genreRes.data].sort((a, b) => b.count - a.count);
          if (sorted.length > 6) {
            const top6 = sorted.slice(0, 6);
            const otherCount = sorted.slice(6).reduce((acc, curr) => acc + curr.count, 0);
            setGenreData([...top6, { genre: 'Other', count: otherCount }]);
          } else {
            setGenreData(sorted);
          }
        }

        // Map Platform Count
        if (platformRes.success && platformRes.data) {
          setPlatformData(platformRes.data.map(p => ({
            name: p.platform.charAt(0).toUpperCase() + p.platform.slice(1),
            Count: p.count
          })));
        }

        // Map Release Data
        if (releaseRes.success && releaseRes.data) {
          setReleaseData(releaseRes.data);
        }

        // Map Trending Games
        if (trendingRes.success && trendingRes.data) {
          setTrendingGames(trendingRes.data.slice(0, 5));
        }

        // Map Top Rated Games
        if (topRatedRes.success && topRatedRes.data) {
          setTopRatedGames(topRatedRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardStyle = theme === 'dark'
    ? 'bg-surface-dark-card border border-dark-700/30 rounded-xl p-4 sm:p-6 shadow-glow-dark'
    : 'bg-white border border-gray-100 shadow-card-light rounded-xl p-4 sm:p-6';

  const tableHeaderStyle = theme === 'dark'
    ? 'text-left text-xs font-semibold text-dark-400 uppercase tracking-wider pb-3 border-b border-dark-800'
    : 'text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-100';

  const rowStyle = theme === 'dark'
    ? 'border-b border-dark-800/50 hover:bg-dark-900/30 transition'
    : 'border-b border-gray-100 hover:bg-gray-50/50 transition';

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-dark-700/20 dark:bg-dark-800/40 rounded skeleton-shimmer mb-2" />
          <div className="h-4 w-72 bg-dark-700/20 dark:bg-dark-800/40 rounded skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader type="card" count={4} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="chart" count={3} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="table" count={2} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | Steam Games Dashboard</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Analytics Overview
          </h1>
          <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-dark-400' : 'text-gray-500'}`}>
            Explore key metrics, genre distributions, and top-rated games.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Steam Games"
            value={stats.totalGames}
            icon={<SportsEsportsIcon />}
            trend="up"
            trendValue="+12%"
            color="primary"
            subtitle="from last month"
          />
          <StatsCard
            title="Average Game Price"
            value={formatPrice(stats.avgPrice)}
            icon={<AttachMoneyIcon />}
            trend="down"
            trendValue="-4%"
            color="accent"
            subtitle="avg base price"
          />
          <StatsCard
            title="Average Rating"
            value={`${stats.avgRating}%`}
            icon={<StarIcon />}
            trend="up"
            trendValue="+2.1%"
            color="success"
            subtitle="overall user ratings"
          />
          <StatsCard
            title="Free to Play Games"
            value={stats.freeToPlayCount}
            icon={<PercentIcon />}
            trend="up"
            trendValue="+15%"
            color="warning"
            subtitle="available free"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Genre Chart */}
          <div className={cardStyle}>
            <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Genre Distribution
            </h3>
            {genreData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreData}
                      dataKey="count"
                      nameKey="genre"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1f35' : '#fff',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                        color: theme === 'dark' ? '#fff' : '#000',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No Genre Info Available" description="Add games to view genre percentages." />
            )}
          </div>

          {/* Platform Distribution Chart */}
          <div className={cardStyle}>
            <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Platform Compatibility
            </h3>
            {platformData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
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
                      cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                      contentStyle={{
                        backgroundColor: theme === 'dark' ? '#1a1f35' : '#fff',
                        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                      }}
                    />
                    <Bar dataKey="Count" fill="#06b6d4" radius={[6, 6, 0, 0]}>
                      {platformData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? '#6366f1' : index === 1 ? '#06b6d4' : '#10b981'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No Platform Info Available" description="Platform compatibility details." />
            )}
          </div>

          {/* Release Trend Chart */}
          <div className={cardStyle}>
            <h3 className={`text-base font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Monthly Release Trends
            </h3>
            {releaseData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={releaseData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="month"
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
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: theme === 'dark' ? '#0a0e1a' : '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No Release Trends Info" description="Releases timeline data." />
            )}
          </div>
        </div>

        {/* Dynamic Games Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Top Rated Games */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StarIcon className="text-amber-500" />
                <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Top Rated Games
                </h3>
              </div>
              <Link to="/games" className="text-xs text-primary-400 hover:underline">
                View All
              </Link>
            </div>
            {topRatedGames.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className={tableHeaderStyle}>Game</th>
                      <th className={tableHeaderStyle}>Rating</th>
                      <th className={tableHeaderStyle}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topRatedGames.map((game) => (
                      <tr key={game.appid} className={rowStyle}>
                        <td className="py-3 pr-2">
                          <Link to={`/games/${game.appid}`} className="flex items-center gap-3 group">
                            {game.header_image ? (
                              <img
                                src={game.header_image}
                                alt={game.name}
                                className="w-12 h-6 object-cover rounded shadow"
                              />
                            ) : (
                              <div className="w-12 h-6 bg-dark-800 rounded flex items-center justify-center text-xs">
                                🎮
                              </div>
                            )}
                            <span className="font-semibold text-sm truncate max-w-[150px] group-hover:text-primary-400 transition">
                              {game.name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-amber-500/10 text-amber-500">
                            ★ {game.rating}%
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500 dark:text-dark-400">
                          {formatPrice(game.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No Rated Games" description="Top rated games list." />
            )}
          </div>

          {/* Trending Games */}
          <div className={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HotIcon className="text-red-500" />
                <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Trending Games
                </h3>
              </div>
              <Link to="/games" className="text-xs text-primary-400 hover:underline">
                View All
              </Link>
            </div>
            {trendingGames.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className={tableHeaderStyle}>Game</th>
                      <th className={tableHeaderStyle}>Rating</th>
                      <th className={tableHeaderStyle}>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingGames.map((game) => (
                      <tr key={game.appid} className={rowStyle}>
                        <td className="py-3 pr-2">
                          <Link to={`/games/${game.appid}`} className="flex items-center gap-3 group">
                            {game.header_image ? (
                              <img
                                src={game.header_image}
                                alt={game.name}
                                className="w-12 h-6 object-cover rounded shadow"
                              />
                            ) : (
                              <div className="w-12 h-6 bg-dark-800 rounded flex items-center justify-center text-xs">
                                🎮
                              </div>
                            )}
                            <span className="font-semibold text-sm truncate max-w-[150px] group-hover:text-primary-400 transition">
                              {game.name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-red-500/10 text-red-500">
                            ★ {game.rating}%
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-500 dark:text-dark-400">
                          {formatPrice(game.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No Trending Games" description="Trending games list is empty." />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
