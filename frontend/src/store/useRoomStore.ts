import { create } from 'zustand';
import { getSocket, connectSocket } from '@/services/socket';
import api from '@/services/api';

export interface Participant {
  user: {
    _id: string;
    name: string;
    picture?: string;
  };
  status?: 'focusing' | 'break' | 'idle' | 'away';
  isMuted?: boolean;
}

export interface FocusRoom {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  host: {
    _id: string;
    name: string;
    picture?: string;
  };
  maxParticipants: number;
  visibility: 'public' | 'private' | 'stream';
  stream?: string | null;
  ambientPreset: 'none' | 'lofi' | 'rain' | 'binaural' | 'cafe' | 'fireplace' | 'forest';
  status: 'waiting' | 'focusing' | 'break' | 'closed';
  participants: Participant[];
  totalFocusMinutes: number;
  totalSessions: number;
}

export interface ChatMessage {
  id: string;
  user: {
    _id: string;
    name: string;
    picture?: string;
  };
  text: string;
  timestamp: string;
}

interface RoomState {
  rooms: FocusRoom[];
  activeRoom: FocusRoom | null;
  isLoading: boolean;
  error: string | null;
  timer: {
    timeLeft: number;
    totalDuration: number;
    mode: 'focus' | 'shortBreak' | 'longBreak';
    isActive: boolean;
  };
  messages: ChatMessage[];

  // Actions
  fetchRooms: (stream?: string) => Promise<void>;
  createRoom: (roomData: Partial<FocusRoom>) => Promise<FocusRoom>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: () => void;
  startRoomTimer: (durationMinutes?: number) => void;
  pauseRoomTimer: () => void;
  sendChatMessage: (text: string) => void;
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  activeRoom: null,
  isLoading: false,
  error: null,
  timer: {
    timeLeft: 25 * 60,
    totalDuration: 25 * 60,
    mode: 'focus',
    isActive: false,
  },
  messages: [],

  fetchRooms: async (stream) => {
    set({ isLoading: true, error: null });
    try {
      const query = stream && stream !== 'all' ? `?stream=${stream}` : '';
      const response = await api.get(`/rooms${query}`);
      set({ rooms: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to load rooms', isLoading: false });
    }
  },

  createRoom: async (roomData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/rooms', roomData);
      const newRoom = response.data;
      set((state) => ({
        rooms: [newRoom, ...state.rooms],
        isLoading: false,
      }));
      return newRoom;
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to create room', isLoading: false });
      throw err;
    }
  },

  joinRoom: async (roomId) => {
    set({ isLoading: true, error: null, messages: [] });
    try {
      const response = await api.get(`/rooms/${roomId}`);
      const room = response.data;

      const socket = connectSocket();
      socket.emit('room:join', { roomId: room._id });

      // Socket Listeners
      socket.off('room:timer-sync');
      socket.on('room:timer-sync', (data) => {
        set((state) => ({
          timer: {
            ...state.timer,
            timeLeft: data.timeLeft,
            totalDuration: data.totalDuration,
            mode: data.mode,
            isActive: data.isActive,
          },
        }));
      });

      socket.off('room:user-joined');
      socket.on('room:user-joined', (data) => {
        set((state) => {
          if (!state.activeRoom) return state;
          const exists = state.activeRoom.participants.some(
            (p) => p.user._id === data.user._id
          );
          if (exists) return state;
          return {
            activeRoom: {
              ...state.activeRoom,
              participants: [...state.activeRoom.participants, { user: data.user, status: 'idle' }],
            },
          };
        });
      });

      socket.off('room:user-left');
      socket.on('room:user-left', (data) => {
        set((state) => {
          if (!state.activeRoom) return state;
          return {
            activeRoom: {
              ...state.activeRoom,
              participants: state.activeRoom.participants.filter(
                (p) => p.user._id !== data.userId
              ),
            },
          };
        });
      });

      socket.off('room:chat-message');
      socket.on('room:chat-message', (msg: ChatMessage) => {
        set((state) => ({
          messages: [...state.messages, msg],
        }));
      });

      set({ activeRoom: room, isLoading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to join room', isLoading: false });
    }
  },

  leaveRoom: () => {
    const { activeRoom } = get();
    if (activeRoom) {
      const socket = getSocket();
      socket.emit('room:leave');
      socket.off('room:timer-sync');
      socket.off('room:user-joined');
      socket.off('room:user-left');
      socket.off('room:chat-message');
    }
    set({ activeRoom: null, messages: [] });
  },

  startRoomTimer: (durationMinutes = 25) => {
    const { activeRoom } = get();
    if (activeRoom) {
      const socket = getSocket();
      socket.emit('room:start-timer', { roomId: activeRoom._id, durationMinutes });
    }
  },

  pauseRoomTimer: () => {
    const { activeRoom } = get();
    if (activeRoom) {
      const socket = getSocket();
      socket.emit('room:pause-timer', { roomId: activeRoom._id });
    }
  },

  sendChatMessage: (text: string) => {
    const { activeRoom } = get();
    if (activeRoom && text.trim()) {
      const socket = getSocket();
      socket.emit('room:chat-message', { roomId: activeRoom._id, text });
    }
  },
}));
