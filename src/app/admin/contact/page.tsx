/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "UNREAD" | "READ" | "RESOLVED" | "CLOSED";
  createdAt: string;
}

interface ContactStats {
  total: number;
  unread: number;
  read: number;
  resolved: number;
  closed: number;
}

type StatusFilter = "all" | "unread" | "read" | "resolved" | "closed";

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set()
  );
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [stats, setStats] = useState<ContactStats>({
    total: 0,
    unread: 0,
    read: 0,
    resolved: 0,
    closed: 0,
  });

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter]);

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter === "all" ? "" : statusFilter,
      });

      const response = await fetch(`/api/admin/contact?${params}`);
      const data = await response.json();
      setMessages(data.data || []);
      setStats(data.stats || stats);
    } catch (error) {
      console.error("Failed to fetch contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchMessages();
        // Update selected message if it's currently viewed
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: status as any });
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update message status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("Failed to update message status");
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMessages();
        setSelectedMessages((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
        if (selectedMessage?.id === messageId) {
          setShowMessageModal(false);
        }
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete message");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete message");
    }
  };

  const bulkUpdateStatus = async (status: string) => {
    if (selectedMessages.size === 0) return;

    try {
      const response = await fetch("/api/admin/contact/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageIds: Array.from(selectedMessages),
          status,
        }),
      });

      if (response.ok) {
        fetchMessages();
        setSelectedMessages(new Set());
        setBulkActionMode(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update messages");
      }
    } catch (error) {
      console.error("Bulk update error:", error);
      alert("Failed to update messages");
    }
  };

  const bulkDeleteMessages = async () => {
    if (selectedMessages.size === 0) return;

    if (!confirm(`Delete ${selectedMessages.size} selected messages?`)) return;

    try {
      const response = await fetch("/api/admin/contact/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageIds: Array.from(selectedMessages),
        }),
      });

      if (response.ok) {
        fetchMessages();
        setSelectedMessages(new Set());
        setBulkActionMode(false);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete messages");
      }
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete messages");
    }
  };

  const toggleMessageSelection = (messageId: string) => {
    const newSet = new Set(selectedMessages);
    if (newSet.has(messageId)) {
      newSet.delete(messageId);
    } else {
      newSet.add(messageId);
    }
    setSelectedMessages(newSet);
  };

  const selectAllMessages = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map((msg) => msg.id)));
    }
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowMessageModal(true);

    // Mark as read if unread
    if (message.status === "UNREAD") {
      await updateMessageStatus(message.id, "READ");
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Contact Messages
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage contact form submissions from your website.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          {bulkActionMode && selectedMessages.size > 0 && (
            <>
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => bulkUpdateStatus("READ")}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-l-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EnvelopeOpenIcon className="h-4 w-4 mr-1" />
                  Read
                </button>
                <button
                  onClick={() => bulkUpdateStatus("resolved")}
                  className="inline-flex items-center px-3 py-2 border-t border-b border-gray-300 text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Resolved
                </button>
                <button
                  onClick={() => bulkUpdateStatus("closed")}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <XCircleIcon className="h-4 w-4 mr-1" />
                  Closed
                </button>
              </div>
              <button
                onClick={bulkDeleteMessages}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete ({selectedMessages.size})
              </button>
              <button
                onClick={() => {
                  setBulkActionMode(false);
                  setSelectedMessages(new Set());
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          )}

          {!bulkActionMode && (
            <button
              onClick={() => setBulkActionMode(true)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <CheckIcon className="h-4 w-4 mr-2" />
              Bulk Actions
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Messages</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
          <div className="text-sm text-gray-600">Unread</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.read}</div>
          <div className="text-sm text-gray-600">Read</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-green-600">
            {stats.resolved}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
          <div className="text-sm text-gray-600">Closed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex space-x-2">
            {(
              [
                {
                  key: "all",
                  label: "All Messages",
                  icon: ChatBubbleLeftRightIcon,
                },
                { key: "unread", label: "Unread", icon: EnvelopeIcon },
                { key: "read", label: "Read", icon: EnvelopeOpenIcon },
                { key: "resolved", label: "Resolved", icon: CheckCircleIcon },
                { key: "closed", label: "Closed", icon: XCircleIcon },
              ] as const
            ).map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setStatusFilter(filterOption.key)}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  statusFilter === filterOption.key
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <filterOption.icon className="h-4 w-4 mr-1" />
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Selection Header */}
      {bulkActionMode && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={
                  selectedMessages.size === messages.length &&
                  messages.length > 0
                }
                onChange={selectAllMessages}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-blue-900">
                Select All ({messages.length} messages)
              </span>
            </div>
            <span className="text-sm text-blue-700">
              {selectedMessages.size} selected
            </span>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="mt-6">
        {messages.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {messages.map((message) => (
                <MessageRow
                  key={message.id}
                  message={message}
                  selected={selectedMessages.has(message.id)}
                  bulkMode={bulkActionMode}
                  onSelect={() => toggleMessageSelection(message.id)}
                  onOpen={() => openMessage(message)}
                  onUpdateStatus={(status) =>
                    updateMessageStatus(message.id, status)
                  }
                  onDelete={() => deleteMessage(message.id)}
                />
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              {search || statusFilter !== "all"
                ? "No messages found"
                : "No contact messages"}
            </h2>
            <p className="text-gray-500 mb-6">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filters."
                : "Contact form submissions will appear here."}
            </p>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setShowMessageModal(false)}
          onUpdateStatus={(status) =>
            updateMessageStatus(selectedMessage.id, status)
          }
          onDelete={() => deleteMessage(selectedMessage.id)}
        />
      )}
    </div>
  );
}

// Message Row Component
function MessageRow({
  message,
  selected,
  bulkMode,
  onSelect,
  onOpen,
  onUpdateStatus,
  onDelete,
}: {
  message: ContactMessage;
  selected: boolean;
  bulkMode: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onUpdateStatus: (status: string) => void;
  onDelete: () => void;
}) {
  const StatusIcon = getStatusIcon(message.status);
  const isUnread = message.status === "UNREAD";

  return (
    <li
      className={`hover:bg-gray-50 ${selected ? "bg-blue-50" : ""} ${
        isUnread ? "border-l-4 border-l-red-500" : ""
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {bulkMode && (
              <input
                type="checkbox"
                checked={selected}
                onChange={onSelect}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            )}

            <div className="flex-shrink-0">
              <StatusIcon
                className={`h-5 w-5 ${
                  isUnread ? "text-red-500" : "text-gray-400"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpen}>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      isUnread
                        ? "font-semibold text-gray-900"
                        : "font-medium text-gray-900"
                    }`}
                  >
                    {message.name}
                  </p>
                  <p className="text-sm text-gray-500">{message.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString()} at{" "}
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                      message.status
                    )}`}
                  >
                    {message.status.toLowerCase()}
                  </span>
                </div>
              </div>
              <p
                className={`mt-1 text-sm ${
                  isUnread ? "text-gray-900" : "text-gray-600"
                } truncate`}
              >
                {message.message}
              </p>
            </div>
          </div>

          {!bulkMode && (
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={onOpen}
                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                title="View message"
              >
                <EyeIcon className="h-4 w-4" />
              </button>

              {/* Quick status buttons */}
              {message.status === "UNREAD" && (
                <button
                  onClick={() => onUpdateStatus("read")}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                  title="Mark as read"
                >
                  <EnvelopeOpenIcon className="h-4 w-4" />
                </button>
              )}

              {(message.status === "READ" || message.status === "UNREAD") && (
                <button
                  onClick={() => onUpdateStatus("resolved")}
                  className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                  title="Mark as resolved"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={onDelete}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                title="Delete message"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

// Message Detail Modal
function MessageModal({
  message,
  onClose,
  onUpdateStatus,
  onDelete,
}: {
  message: ContactMessage;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  onDelete: () => void;
}) {
  const StatusIcon = getStatusIcon(message.status);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-6 w-6 text-gray-400" />
              <h2 className="text-lg font-medium text-gray-900">
                Contact Message
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                  message.status
                )}`}
              >
                {message.status.toLowerCase()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Message Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <p className="text-sm text-gray-900">{message.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <a
                href={`mailto:${message.email}`}
                className="text-sm text-blue-600 hover:text-blue-800"
                aria-label={`Send email to ${message.email}`}
              >
                {message.email}
              </a>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Received
              </label>
              <p className="text-sm text-gray-900">
                {new Date(message.createdAt).toLocaleDateString()} at{" "}
                {new Date(message.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Message Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              {message.status !== "READ" && (
                <button
                  onClick={() => onUpdateStatus("read")}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap"
                >
                  <EnvelopeOpenIcon className="h-4 w-4 mr-2" />
                  Mark as Read
                </button>
              )}

              {(message.status === "READ" || message.status === "UNREAD") && (
                <button
                  onClick={() => onUpdateStatus("resolved")}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 whitespace-nowrap"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </button>
              )}

              {message.status !== "CLOSED" && (
                <button
                  onClick={() => onUpdateStatus("closed")}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 whitespace-nowrap"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Close
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <a
                href={`mailto:${message.email}?subject=Re: Contact Form Submission&body=Hello ${message.name},%0D%0A%0D%0AThank you for contacting us.%0D%0A%0D%0ABest regards`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                aria-label={`Reply to ${message.email}`}
              >
                Reply via Email
              </a>
              <button
                onClick={onDelete}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 whitespace-nowrap"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusBadge(status: string) {
  const badges = {
    UNREAD: "bg-red-100 text-red-800",
    READ: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };
  return badges[status as keyof typeof badges] || badges.UNREAD;
}

function getStatusIcon(status: string) {
  const icons = {
    UNREAD: EnvelopeIcon,
    READ: EnvelopeOpenIcon,
    RESOLVED: CheckCircleIcon,
    CLOSED: XCircleIcon,
  };
  return icons[status as keyof typeof icons] || EnvelopeIcon;
}
