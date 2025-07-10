import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Clock, Play, Pause, Square, Calendar, BarChart3, Timer, TrendingUp } from 'lucide-react';

interface TimeEntry {
  id: string;
  project: string;
  task: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  description?: string;
  isActive: boolean;
  date: string;
}

export const TimeTracking: React.FC = () => {
  const { isDark } = useTheme();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      id: '1',
      project: 'CRM System Upgrade',
      task: 'Frontend Development',
      startTime: '2024-01-08T09:00:00Z',
      endTime: '2024-01-08T12:30:00Z',
      duration: 210,
      description: 'Working on task management components',
      isActive: false,
      date: '2024-01-08'
    },
    {
      id: '2',
      project: 'Mobile App Development',
      task: 'UI Design',
      startTime: '2024-01-08T14:00:00Z',
      endTime: '2024-01-08T16:45:00Z',
      duration: 165,
      description: 'Designing user interface mockups',
      isActive: false,
      date: '2024-01-08'
    }
  ]);

  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newEntry, setNewEntry] = useState({
    project: '',
    task: '',
    description: ''
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const startTimer = () => {
    if (newEntry.project && newEntry.task) {
      const entry: TimeEntry = {
        id: Date.now().toString(),
        project: newEntry.project,
        task: newEntry.task,
        startTime: new Date().toISOString(),
        duration: 0,
        description: newEntry.description,
        isActive: true,
        date: new Date().toISOString().split('T')[0]
      };
      setTimeEntries([...timeEntries, entry]);
      setActiveTimer(entry);
      setNewEntry({ project: '', task: '', description: '' });
    }
  };

  const stopTimer = () => {
    if (activeTimer) {
      const endTime = new Date().toISOString();
      const duration = Math.round((new Date(endTime).getTime() - new Date(activeTimer.startTime).getTime()) / 60000);
      
      setTimeEntries(entries =>
        entries.map(entry =>
          entry.id === activeTimer.id
            ? { ...entry, endTime, duration, isActive: false }
            : entry
        )
      );
      setActiveTimer(null);
    }
  };

  const pauseTimer = () => {
    if (activeTimer) {
      stopTimer();
    }
  };

  const deleteEntry = (id: string) => {
    setTimeEntries(entries => entries.filter(entry => entry.id !== id));
    if (activeTimer?.id === id) {
      setActiveTimer(null);
    }
  };

  const getActiveTimerDuration = () => {
    if (!activeTimer) return 0;
    return Math.round((currentTime.getTime() - new Date(activeTimer.startTime).getTime()) / 60000);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = timeEntries.filter(entry => entry.date === today);
    const totalTime = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    const activeTime = activeTimer ? getActiveTimerDuration() : 0;
    
    return {
      totalTime: totalTime + activeTime,
      entriesCount: todayEntries.length + (activeTimer ? 1 : 0),
      projects: new Set(todayEntries.map(e => e.project)).size
    };
  };

  const getWeekStats = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekEntries = timeEntries.filter(entry => new Date(entry.date) >= weekAgo);
    const totalTime = weekEntries.reduce((sum, entry) => sum + entry.duration, 0);
    
    return {
      totalTime,
      entriesCount: weekEntries.length,
      avgPerDay: Math.round(totalTime / 7)
    };
  };

  const todayStats = getTodayStats();
  const weekStats = getWeekStats();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Time Tracking
              </h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                Track your time across projects and tasks
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Today</p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDuration(todayStats.totalTime)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Today's Time</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDuration(todayStats.totalTime)}
                </p>
              </div>
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Entries Today</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {todayStats.entriesCount}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Week Total</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDuration(weekStats.totalTime)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Daily Avg</p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatDuration(weekStats.avgPerDay)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Active Timer / New Entry */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 mb-6`}>
          {activeTimer ? (
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {activeTimer.project} - {activeTimer.task}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Started at {formatTime(activeTimer.startTime)}
                </p>
                {activeTimer.description && (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                    {activeTimer.description}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatDuration(getActiveTimerDuration())}
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Running...
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={pauseTimer}
                    className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    <Pause size={16} />
                    <span>Pause</span>
                  </button>
                  <button
                    onClick={stopTimer}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Square size={16} />
                    <span>Stop</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                Start New Timer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Project
                  </label>
                  <input
                    type="text"
                    value={newEntry.project}
                    onChange={(e) => setNewEntry({...newEntry, project: e.target.value})}
                    className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Project name..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Task
                  </label>
                  <input
                    type="text"
                    value={newEntry.task}
                    onChange={(e) => setNewEntry({...newEntry, task: e.target.value})}
                    className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Task name..."
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Description (optional)
                  </label>
                  <input
                    type="text"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                    className={`w-full px-3 py-2 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="What are you working on?"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={startTimer}
                  disabled={!newEntry.project || !newEntry.task}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={16} />
                  <span>Start Timer</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Time Entries */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Recent Entries
          </h3>
          <div className="space-y-4">
            {timeEntries.map((entry) => (
              <div
                key={entry.id}
                className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {entry.project}
                      </h4>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        •
                      </span>
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {entry.task}
                      </span>
                    </div>
                    {entry.description && (
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                        {entry.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTime(entry.startTime)}
                        {entry.endTime && ` - ${formatTime(entry.endTime)}`}
                      </span>
                      <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatDuration(entry.duration)}
                      </p>
                      <p className={`text-xs ${entry.isActive ? 'text-green-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {entry.isActive ? 'Active' : 'Completed'}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {timeEntries.length === 0 && (
            <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p>No time entries yet. Start your first timer!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeTracking;