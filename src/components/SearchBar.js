import React, { useState } from 'react';
import { Search, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import AutocompleteDropdown from './AutocompleteDropdown';
import { getCategoryTree } from '../utils/categoryHelper';

const SearchBar = ({ onSearch, categories = [], showCategoryFilter = true }) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        keyword: searchKeyword,
        category: selectedCategory,
        location: locationFilter
      });
    }
  };

  const handleCategoryClick = (categoryName) => {
    setSearchKeyword(categoryName);
    setSelectedCategory('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Main Search Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-2.5 rounded-3xl shadow-2xl shadow-indigo-950/40 w-full grid grid-cols-1 md:grid-cols-12 gap-2 text-slate-800 border-2 border-slate-100"
      >
        {/* Input 1: Title / Keyword */}
        <div className="md:col-span-5 flex items-center px-3 border-b md:border-b-0 md:border-r border-slate-100 py-2">
          <Search className="w-5 h-5 text-orange-500 shrink-0 mr-2" />
          <input
            type="text"
            placeholder="Nhập vị trí muốn ứng tuyển"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full text-sm focus:outline-none bg-transparent py-1 font-bold text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Input 2: Category/Industry Autocomplete */}
        {showCategoryFilter && (
          <div className="md:col-span-3 px-3 border-b md:border-b-0 md:border-r border-slate-100 py-2 flex items-center">
            <AutocompleteDropdown
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              placeholder="Ngành nghề..."
              onSelect={(cat) => {
                setSelectedCategory(cat.displayText);
              }}
            />
          </div>
        )}

        {/* Input 3: Location Dropdown */}
        <div className={`${showCategoryFilter ? 'md:col-span-2' : 'md:col-span-3'} flex items-center px-3 border-b md:border-b-0 md:border-r border-slate-100 py-2`}>
          <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mr-2" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full text-sm focus:outline-none bg-transparent py-1 font-bold text-slate-700 appearance-none cursor-pointer"
          >
            <option value="">Địa điểm</option>
            <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Cần Thơ">Cần Thơ</option>
            <option value="Bình Dương">Bình Dương</option>
            <option value="Đồng Nai">Đồng Nai</option>
          </select>
        </div>

        {/* Search Button */}
        <div className={`${showCategoryFilter ? 'md:col-span-2' : 'md:col-span-2'}`}>
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5 shrink-0 transform hover:scale-102"
          >
            Tìm việc <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Popular Keywords Section */}
      <div className="text-center max-w-4xl mx-auto">
        <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider block mb-3">
          💡 Từ khóa phổ biến
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Kế Toán',
            'Nhân Viên Văn Phòng',
            'Hành Chính Nhân Sự',
            'Chăm Sóc Khách Hàng',
            'Nhân Viên Bán Hàng'
          ].map((keyword, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(keyword)}
              className="px-4 py-2 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 hover:text-orange-600 text-xs font-bold rounded-xl transition-all"
            >
              ⭐ {keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
