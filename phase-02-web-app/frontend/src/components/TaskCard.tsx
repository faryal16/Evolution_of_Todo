import React, { useState } from 'react';
import { Task } from '@/types';
import { taskAPI } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface TaskCardProps {
  task: Task;
  onTaskUpdate?: (updatedTask: Task) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskToggle?: (taskId: string, completed: boolean) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggle
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const updatedTask = await taskAPI.updateTask(task.id, {
        title,
        description
      });
      onTaskUpdate?.(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggle = async () => {
    try {
      const updatedTask = await taskAPI.toggleTaskCompletion(task.id, !task.completed);
      onTaskToggle?.(updatedTask.id, updatedTask.completed);
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await taskAPI.deleteTask(task.id);
      onTaskDelete?.(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white shadow rounded-lg p-4 mb-3 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <div className="ml-3 flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={200}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                maxLength={1000}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
                >
                  {isUpdating ? <LoadingSpinner size="sm" className="text-white" /> : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setTitle(task.title);
                    setDescription(task.description);
                  }}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className={`text-lg font-medium ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 mt-1">{task.description}</p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Created: {formatDate(task.createdAt)}
                {task.updatedAt !== task.createdAt && (
                  <span className="ml-2">Updated: {formatDate(task.updatedAt)}</span>
                )}
              </div>
              <div className="flex mt-3 space-x-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
          <p className="text-red-700">Are you sure you want to delete this task?</p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;