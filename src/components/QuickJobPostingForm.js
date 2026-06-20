import React, { useState } from 'react';
import AutocompleteDropdown from './AutocompleteDropdown';
import { searchCategories } from '../utils/categoryHelper';

const QuickJobPostingForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    category: '',
    minSalary: '',
    location: '',
    description: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Chức danh công việc không được để trống';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Vui lòng chọn danh mục ngành nghề';
    }

    if (!formData.minSalary.trim()) {
      newErrors.minSalary = 'Mức lương không được để trống';
    } else if (isNaN(formData.minSalary) || parseFloat(formData.minSalary) <= 0) {
      newErrors.minSalary = 'Mức lương phải là số dương';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Địa điểm tuyển dụng không được để trống';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả công việc không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setFormData(prev => ({
      ...prev,
      category: selectedCategory.name
    }));
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">Đăng mới tin tuyển dụng</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">
              Chức danh / Vị trí việc làm <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Ví dụ: Lập trình viên PHP/Laravel Senior"
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.jobTitle ? 'border-red-300' : 'border-slate-200'
              } focus:outline-none focus:border-indigo-500 transition-colors`}
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">
              Danh mục nhóm ngành nghề tuyển dụng <span className="text-red-500">*</span>
            </label>
            <div className={`rounded-lg border-2 ${
              errors.category ? 'border-red-300' : 'border-slate-200'
            }`}>
              <AutocompleteDropdown
                value={formData.category}
                onChange={handleCategoryChange}
                placeholder="-- Chọn danh mục ngành nghề --"
                categories={[]}
              />
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Salary and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Minimum Salary */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                Mức lương tối thiểu (Triệu VND/tháng) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="minSalary"
                value={formData.minSalary}
                onChange={handleInputChange}
                placeholder="Ví dụ: 15, 20..."
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.minSalary ? 'border-red-300' : 'border-slate-200'
                } focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.minSalary && (
                <p className="text-red-500 text-sm mt-1">{errors.minSalary}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2">
                Địa điểm tuyển dụng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
                className={`w-full px-4 py-3 rounded-lg border-2 ${
                  errors.location ? 'border-red-300' : 'border-slate-200'
                } focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2">
              Mô tả công việc & Yêu cầu tuyển dụng <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Nhập chi tiết nhiệm vụ công việc, yêu cầu kỹ năng, kinh nghiệm và các chế độ đãi ngộ..."
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.description ? 'border-red-300' : 'border-slate-200'
              } focus:outline-none focus:border-indigo-500 transition-colors resize-vertical`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-lg font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickJobPostingForm;
