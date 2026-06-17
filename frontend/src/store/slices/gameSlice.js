import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gameService from '../../services/gameService';

// Thunks
export const fetchGames = createAsyncThunk(
  'games/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await gameService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch games');
    }
  }
);

export const fetchGameById = createAsyncThunk(
  'games/fetchById',
  async (appid, { rejectWithValue }) => {
    try {
      const response = await gameService.getById(appid);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch game');
    }
  }
);

export const createGame = createAsyncThunk(
  'games/create',
  async (gameData, { rejectWithValue }) => {
    try {
      const response = await gameService.create(gameData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create game');
    }
  }
);

export const updateGame = createAsyncThunk(
  'games/update',
  async ({ appid, gameData }, { rejectWithValue }) => {
    try {
      const response = await gameService.update(appid, gameData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update game');
    }
  }
);

export const deleteGame = createAsyncThunk(
  'games/delete',
  async (appid, { rejectWithValue }) => {
    try {
      const response = await gameService.delete(appid);
      return { ...response, appid };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete game');
    }
  }
);

const initialState = {
  games: [],
  currentGame: null,
  pagination: {
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  },
  filters: {
    search: '',
    genre: '',
    minPrice: '',
    maxPrice: '',
    platform: '',
    sort: '',
    isFree: '',
  },
  loading: false,
  detailLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentGame: (state) => {
      state.currentGame = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all games
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchGameById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentGame = action.payload.data;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createGame.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.games.unshift(action.payload.data);
        }
      })
      // Update
      .addCase(updateGame.fulfilled, (state, action) => {
        if (action.payload.success) {
          const index = state.games.findIndex((g) => g.appid === action.payload.data.appid);
          if (index !== -1) {
            state.games[index] = action.payload.data;
          }
          state.currentGame = action.payload.data;
        }
      })
      // Delete
      .addCase(deleteGame.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.games = state.games.filter((g) => g.appid !== action.payload.appid);
        }
      });
  },
});

export const { setFilters, clearFilters, clearCurrentGame, clearError } = gameSlice.actions;
export default gameSlice.reducer;
