import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import TaskCard from './TaskCard';
import LoadingSpinner from '@/components/LoadingSpinner';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate?: (updatedTask: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  filter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggle,
  filter,
  onFilterChange
}) => {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    // Apply filter based on status
    let result = tasks;
    if (filter === 'pending') {
      result = tasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
      result = tasks.filter(task => task.completed);
    }
    setFilteredTasks(result);
  }, [tasks, filter]);

  const getFilterCounts = () => {
    const all = tasks.length;
    const pending = tasks.filter(task => !task.completed).length;
    const completed = tasks.filter(task => task.completed).length;

    return { all, pending, completed };
  };

  const counts = getFilterCounts();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>

        {/* Filter buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => onFilterChange('pending')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending ({counts.pending})
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1 rounded-md text-sm ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({counts.completed})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <LoadingSpinner />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {filter === 'completed'
            ? 'No completed tasks yet.'
            : filter === 'pending'
              ? 'No pending tasks. Great job!'
              : 'No tasks yet. Add one to get started!'}
        </div>
      ) : (
        <div>
          {filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
              onTaskToggle={onTaskToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;