"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleIconClick = () => {
    if (query.trim().length > 0) {
      // اگه متن داره، جستجو کن
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      // اگه خالیه، input رو focus کن
      inputRef.current?.focus();
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-container">
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="جستجو در اخبار..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        required
      />
      <div className="search-icon" onClick={handleIconClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
        </svg>
      </div>
    </form>
  );
}
