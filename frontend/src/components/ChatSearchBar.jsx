import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export default function ChatSearchBar({ onSearch, placeholder = "Tìm kiếm tin nhắn..." }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setIsSearching(false);
      onSearch("");
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      onSearch(query.trim());
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
      <Search className="h-4 w-4 text-gray-400" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isSearching && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-indigo-600"></div>
      )}
    </div>
  );
}