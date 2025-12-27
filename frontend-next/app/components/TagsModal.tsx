"use client";

import { Icon } from "@iconify/react";

type TagsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  newTag: string;
  onNewTagChange: (tag: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onSave: () => void;
  title?: string;
};

const TAG_COLORS = [
  "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200",
  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
  "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200",
  "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200",
  "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200",
  "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200",
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200",
];

// Predefined tags suggestions
const COMMON_TAGS = [
  "Urgent",
  "Important",
  "Verified",
  "Review",
  "Completed",
  "Draft",
  "Archive",
];

export default function TagsModal({
  isOpen,
  onClose,
  tags,
  newTag,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onSave,
  title = "Edit Tags",
}: TagsModalProps) {
  if (!isOpen) return null;

  const getColorForTag = (index: number) => {
    return TAG_COLORS[index % TAG_COLORS.length];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTag();
    }
  };

  const suggestedTags = COMMON_TAGS.filter(
    (tag) =>
      !tags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-[#132440] dark:text-white flex items-center gap-2">
            <Icon icon="mdi:tag" />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition text-2xl"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Current Tags */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Tags Aktif:
            </label>
            {tags.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 italic">
                Belum ada tags
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`${getColorForTag(
                      index
                    )} px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2`}
                  >
                    {tag}
                    <button
                      onClick={() => onRemoveTag(tag)}
                      className="hover:opacity-70 transition"
                    >
                      <Icon icon="mdi:close" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Add New Tag */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Tambah Tag Baru:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => onNewTagChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Masukkan tag..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B9797] bg-white dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={onAddTag}
                disabled={!newTag.trim()}
                className={`px-4 py-2 font-semibold rounded-lg transition flex items-center gap-2 ${
                  newTag.trim()
                    ? "bg-[#3B9797] text-white hover:bg-[#2d7575]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Icon icon="mdi:plus" />
                Tambah
              </button>
            </div>

            {/* Suggestions */}
            {suggestedTags.length > 0 && newTag && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Saran:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onNewTagChange(tag);
                        setTimeout(() => onAddTag(), 0);
                      }}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onSave();
              onClose();
            }}
            className="px-6 py-2 bg-[#3B9797] text-white font-semibold rounded-lg hover:bg-[#2d7575] hover:shadow-lg transition flex items-center gap-2"
          >
            <Icon icon="mdi:content-save" />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
