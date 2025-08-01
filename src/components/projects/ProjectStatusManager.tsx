import React, { useState, useCallback } from "react";
import { useProjectStatusWorkflow } from "../../shared/hooks/useProjectManagement";
import {
  ProjectStatus,
  UpdateProjectStatusRequest,
  ProjectStatusHistoryEntry,
} from "../../shared/types/project";

interface ProjectStatusManagerProps {
  projectId: string;
  currentStatus: ProjectStatus;
  onStatusUpdated?: (newStatus: ProjectStatus) => void;
  className?: string;
}

const ProjectStatusManager: React.FC<ProjectStatusManagerProps> = ({
  projectId,
  currentStatus,
  onStatusUpdated,
  className = "",
}) => {
  const { workflow, loading, error, updateStatus } =
    useProjectStatusWorkflow(projectId);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | null>(
    null
  );
  const [reason, setReason] = useState("");
  const [notifyStakeholders, setNotifyStakeholders] = useState(true);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = useCallback((newStatus: ProjectStatus) => {
    setSelectedStatus(newStatus);
    setShowModal(true);
    setReason("");
  }, []);

  const handleConfirmStatusChange = useCallback(async () => {
    if (!selectedStatus || !reason.trim()) return;

    setUpdating(true);
    try {
      const updateRequest: UpdateProjectStatusRequest = {
        status: selectedStatus,
        reason: reason.trim(),
        effectiveDate: new Date().toISOString(),
        notifyStakeholders,
      };

      const result = await updateStatus(updateRequest);
      if (result) {
        setShowModal(false);
        setSelectedStatus(null);
        setReason("");
        onStatusUpdated?.(selectedStatus);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(false);
    }
  }, [
    selectedStatus,
    reason,
    notifyStakeholders,
    updateStatus,
    onStatusUpdated,
  ]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case ProjectStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case ProjectStatus.ON_HOLD:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case ProjectStatus.COMPLETED:
        return "bg-green-100 text-green-800 border-green-300";
      case ProjectStatus.CANCELLED:
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING:
        return "📋";
      case ProjectStatus.IN_PROGRESS:
        return "🚀";
      case ProjectStatus.ON_HOLD:
        return "⏸️";
      case ProjectStatus.COMPLETED:
        return "✅";
      case ProjectStatus.CANCELLED:
        return "❌";
      default:
        return "📋";
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-500">Loading workflow...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 ${className}`}>Error: {error}</div>
    );
  }

  return (
    <div className={className}>
      {/* Current Status Display */}
      <div className="flex items-center space-x-3">
        <div
          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(currentStatus)} `}
        >
          <span className="mr-2">{getStatusIcon(currentStatus)}</span>
          {currentStatus}
        </div>

        {/* Status Actions */}
        {workflow?.allowedTransitions &&
          workflow.allowedTransitions.length > 0 && (
            <div className="relative">
              <select
                onChange={(e) =>
                  e.target.value &&
                  handleStatusChange(e.target.value as ProjectStatus)
                }
                value=""
                className="appearance-none rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Change Status...</option>
                {workflow.allowedTransitions.map((status: ProjectStatus) => (
                  <option key={status} value={status}>
                    {getStatusIcon(status)} {status}
                  </option>
                ))}
              </select>
            </div>
          )}
      </div>

      {/* Status History */}
      {workflow?.statusHistory && workflow.statusHistory.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Status History
          </h4>
          <div className="space-y-2">
            {workflow.statusHistory
              .slice(0, 3)
              .map((entry: ProjectStatusHistoryEntry, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs text-gray-600"
                >
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${getStatusColor(
                        entry.status as ProjectStatus
                      )}`}
                    >
                      {getStatusIcon(entry.status as ProjectStatus)}{" "}
                      {entry.status}
                    </span>
                    <span>{entry.changedBy.fullName}</span>
                  </div>
                  <div className="text-right">
                    <div>{new Date(entry.changedAt).toLocaleDateString()}</div>
                    {entry.duration && (
                      <div className="text-gray-500">{entry.duration} days</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Approval Requirements */}
      {workflow?.requiresApproval && (
        <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-600">
          ⚠️ Status changes require {workflow.approvalLevel} approval
        </div>
      )}

      {/* Status Change Modal */}
      {showModal && selectedStatus && (
        <div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
          <div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
            <div className="mt-3">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Change Status to {selectedStatus}
              </h3>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Reason for change *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why you're changing the status..."
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={notifyStakeholders}
                    onChange={(e) => setNotifyStakeholders(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Notify stakeholders
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={updating}
                  className="rounded-md border border-gray-300 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStatusChange}
                  disabled={updating || !reason.trim()}
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStatusManager;
