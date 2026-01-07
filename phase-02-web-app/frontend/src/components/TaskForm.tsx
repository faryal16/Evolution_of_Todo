import React, { useState } from 'react';
import { TaskRequest } from '@/types';
import { taskAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface TaskFormProps {
  onTaskCreated?: (newTask: any) => void;
  editingTask?: any;
  onTaskUpdated?: (updatedTask: any) => void;
  onCancelEdit?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onTaskCreated,
  editingTask,
  onTaskUpdated,
  onCancelEdit
}) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await taskAPI.updateTask(editingTask.id, {
          title,
          description
        });
        onTaskUpdated?.(updatedTask);
      } else {
        // Create new task
        const newTask = await taskAPI.createTask({
          title,
          description
        });
        onTaskCreated?.(newTask);
        // Reset form
        setTitle('');
        setDescription('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-3">
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </h3>

      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Task title (1-200 characters)"
        />
        <p className="mt-1 text-xs text-gray-500">{title.length}/200 characters</p>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Task description (optional, max 1000 characters)"
        ></textarea>
        <p className="mt-1 text-xs text-gray-500">{description.length}/1000 characters</p>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading || title.trim().length === 0}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="text-white mr-2" />
              {editingTask ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            editingTask ? 'Update Task' : 'Create Task'
          )}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;