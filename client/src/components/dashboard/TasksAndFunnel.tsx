import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskStore } from '../../store/taskStore';
import { useDealStore } from '../../store/dealStore';
import { useContactStore } from '../../store/contactStore';
import { ChevronLeft, ChevronRight, MoreHorizontal, Users, Info, Settings, Filter, TrendingUp } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { getAvatarByIndex, getInitials } from '../../services/avatarCollection';

const TasksAndFunnel: React.FC = () => {
  const { isDark } = useTheme();
  const { tasks } = useTaskStore();
  const { deals } = useDealStore();
  const { contacts } = useContactStore();
  const [selectedDay, setSelectedDay] = useState(15);

  const taskArray = Object.values(tasks);
  const dealArray = Object.values(deals);

  // Mock calendar data
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Mock task schedule data
  const taskScheduleData = [
    { day: 15, tasks: 5, assignees: [1, 2, 3] },
    { day: 16, tasks: 3, assignees: [1, 2] },
    { day: 17, tasks: 7, assignees: [1, 2, 3, 4] },
    { day: 18, tasks: 2, assignees: [1] },
    { day: 19, tasks: 4, assignees: [2, 3] },
  ];

  // Map for quick lookup of task data by day
  const tasksByDay = taskScheduleData.reduce((acc, task) => {
    acc[task.day] = task;
    return acc;
  }, {} as Record<number, typeof taskScheduleData[0]>);

  // Mock funnel data
  const funnelData = [
    { stage: 'Prospecting', value: '$125,000', color: 'bg-blue-500' },
    { stage: 'Qualification', value: '$98,000', color: 'bg-green-500' },
    { stage: 'Proposal', value: '$65,000', color: 'bg-yellow-500' },
    { stage: 'Negotiation', value: '$45,000', color: 'bg-orange-500' },
  ];

  // Mock team assignments
  const teamAssignments = [
    { contact: contacts[Object.keys(contacts)[0]], taskCount: 3 },
    { contact: contacts[Object.keys(contacts)[1]], taskCount: 5 },
    { contact: contacts[Object.keys(contacts)[2]], taskCount: 2 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Tasks Schedule */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Tasks Schedule</h3>
          <div className="flex space-x-2">
            <button className={`p-2 ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className={`p-2 ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}>
              <Settings className="w-4 h-4" />
            </button>
            <button className={`p-2 ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h4 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>October</h4>
          <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
            {dayHeaders.map((day, index) => (
              <div key={index} className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {calendarDays.map((day) => {
              const dayTasks = tasksByDay[day];
              return (
                <div key={day} className={`p-2 rounded-lg cursor-pointer transition-colors relative ${
                  day === selectedDay 
                    ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600')
                    : (isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100')
                }`} onClick={() => setSelectedDay(day)}>
                  <div className="mb-1">{day}</div>
                  {dayTasks && dayTasks.assignees.length > 0 && (
                    <div className="flex justify-center -space-x-1">
                      {dayTasks.assignees.slice(0, 2).map((assigneeId, index) => (
                        <Avatar
                          key={assigneeId}
                          src={getAvatarByIndex(assigneeId, 'executives')}
                          alt={`Assignee ${assigneeId}`}
                          size="xs"
                          fallback={getInitials(`User ${assigneeId}`)}
                          className="ring-1 ring-white w-3 h-3 text-xs"
                        />
                      ))}
                      {dayTasks.assignees.length > 2 && (
                        <div className="w-3 h-3 rounded-full bg-gray-400 flex items-center justify-center text-xs font-semibold text-white ring-1 ring-white">
                          +{dayTasks.assignees.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {taskScheduleData.map((task) => (
            <div key={task.day} className={`flex items-center justify-between ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'} p-3 rounded-lg transition-colors`}>
              <div className="flex items-center space-x-3">
                <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>{task.day}</div>
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((assigneeId, index) => (
                    <Avatar
                      key={assigneeId}
                      src={getAvatarByIndex(assigneeId, 'executives')}
                      alt={`Assignee ${assigneeId}`}
                      size="xs"
                      fallback={getInitials(`User ${assigneeId}`)}
                      className="ring-2 ring-white"
                    />
                  ))}
                  {task.assignees.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-semibold text-white ring-2 ring-white">
                      +{task.assignees.length - 3}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.tasks} tasks</span>
                <button className={`p-1 ${isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'} rounded transition-colors`}>
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Day Details */}
        <div className={`mt-4 p-4 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'} rounded-lg border`}>
          <div className="flex items-center justify-between mb-2">
            <h5 className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>October {selectedDay}</h5>
            <button className={`p-1 ${isDark ? 'text-blue-400 hover:bg-blue-500/20' : 'text-blue-600 hover:bg-blue-100'} rounded`}>
              <Info className="w-4 h-4" />
            </button>
          </div>
          <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
            5 tasks scheduled for today including follow-up calls and proposal reviews
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((assigneeId) => (
                <Avatar
                  key={assigneeId}
                  src={getAvatarByIndex(assigneeId, 'executives')}
                  alt={`Assignee ${assigneeId}`}
                  size="xs"
                  fallback={getInitials(`User ${assigneeId}`)}
                  className="ring-2 ring-white"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Funnel */}
      <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'} backdrop-blur-xl border rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Stage Funnel</h3>
          <div className="flex space-x-2">
            <button className={`p-2 ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}>
              <Filter className="w-4 h-4" />
            </button>
            <button className={`p-2 ${isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition-colors`}>
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {funnelData.map((stage, index) => (
            <div key={stage.stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{stage.stage}</span>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stage.value}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div 
                  className={`${stage.color} ${isDark ? 'opacity-80' : 'opacity-100'} h-2 rounded-full transition-all duration-300`} 
                  style={{ width: `${(4 - index) * 25}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'} rounded-lg`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Weighted</span>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Total</span>
          </div>
        </div>

        {/* Team Overview */}
        <div className={`mt-4 p-4 ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'} rounded-lg border`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold ${isDark ? 'text-blue-300' : 'text-blue-900'} flex items-center`}>
              <Users className="w-4 h-4 mr-2" />
              Team Assignments
            </h4>
            <button className={`p-1 rounded ${isDark ? 'hover:bg-blue-500/20 text-blue-300' : 'hover:bg-blue-100 text-blue-700'}`}>
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {teamAssignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar
                    src={assignment.contact?.avatarSrc || getAvatarByIndex(index, 'executives')}
                    alt={assignment.contact?.name || `Team Member ${index + 1}`}
                    size="sm"
                    fallback={getInitials(assignment.contact?.name || `Team Member ${index + 1}`)}
                  />
                  <span className={`text-sm font-medium ${isDark ? 'text-blue-100' : 'text-blue-800'}`}>
                    {assignment.contact?.name || `Team Member ${index + 1}`}
                  </span>
                </div>
                <span className={`text-xs ${isDark ? 'text-blue-300 bg-blue-500/30' : 'text-blue-700 bg-blue-100'} px-2 py-1 rounded`}>
                  {assignment.taskCount} days
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksAndFunnel;