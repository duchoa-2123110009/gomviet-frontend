import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Plus, Trash2, AlertCircle, Loader } from 'lucide-react';
import AutocompleteDropdown from './AutocompleteDropdown';
import FormField from './FormField';
import FormStep from './FormStep';
import {
  validatePersonalInfo,
  validateLocation,
  validateCareerPreferences
} from '../utils/validation';

import { getCvSmartSuggestions, applyCvSmartSuggestions } from '../utils/cvSmartSuggestions';

const ApplicantFormWizard = ({ onSubmit, initialData = null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const vietnamCities = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Bình Dương', 'Đồng Nai', 'Quảng Ninh', 'Hà Tây', 'Vĩnh Phúc'
  ];

  const [formData, setFormData] = useState(initialData || {
    // Step 1: Personal Info
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'other',
      avatar: null
    },
    // Step 2: Location
    location: {
      address: '',
      ward: '',
      district: '',
      city: '',
      country: 'Việt Nam'
    },
    // Step 3: Career Preferences
    careerPreferences: {
      targetPositions: [],
      targetLocations: [],
      jobTypes: [],
      salaryExpectation: { min: '', max: '' }
    },
    // Step 4: Experience
    experience: [],
    // Step 5: Education
    education: [],
    // Step 6: Skills
    skills: [],
    // Step 7: Certificates
    certificates: [],
    // Step 8: Projects
    projects: [],
    // Step 9: Languages
    languages: [],
    // Step 10: Review
    agreedToTerms: false
  });

  const steps = [
    'Thông Tin Cá Nhân',
    'Địa Chỉ',
    'Ngành Nghề Quan Tâm',
    'Kinh Nghiệm',
    'Học Vấn',
    'Kỹ Năng',
    'Chứng Chỉ',
    'Dự Án',
    'Ngôn Ngữ',
    'Xem Lại'
  ];

  const [smartSuggestions, setSmartSuggestions] = useState(null);


  // Update nested form data
  const updateFormData = (path, value) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) current[key] = {};
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Validation for each step
  const validateStep = (step) => {
    const stepErrors = {};

    switch (step) {
      case 0:
        return validatePersonalInfo(formData.personalInfo);
      case 1:
        return validateLocation(formData.location);
      case 2:
        return validateCareerPreferences(formData.careerPreferences);
      default:
        return {};
    }
  };

  // Next step handler
  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous step handler
  const handlePrevStep = () => {
    setErrors({});
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Add item to array fields
  const addItem = (field, item) => {
    updateFormData(field, [...(formData[field] || []), item]);
  };

  // Remove item from array fields
  const removeItem = (field, index) => {
    const items = [...formData[field]];
    items.splice(index, 1);
    updateFormData(field, items);
  };

  // Update item in array fields
  const updateItem = (field, index, updates) => {
    const items = [...formData[field]];
    items[index] = { ...items[index], ...updates };
    updateFormData(field, items);
  };

  // Update smart suggestions based on current form data
  React.useEffect(() => {
    const payload = getCvSmartSuggestions(formData);
    setSmartSuggestions(payload || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.education, formData.experience, formData.skills, formData.careerPreferences, formData.certificates, formData.projects, formData.languages]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.agreedToTerms) {
      setErrors({ agreedToTerms: 'Vui lòng đồng ý với điều khoản' });
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
        setSuccessMessage('Hồ sơ được lưu thành công!');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Lỗi khi gửi dữ liệu' });
    } finally {
      setLoading(false);
    }
  };

  // Render steps
  const renderStep = () => {
    switch (currentStep) {
      // Step 1: Personal Info
      case 0:
        return (
          <FormStep
            title="Thông Tin Cá Nhân"
            subtitle="Vui lòng cung cấp thông tin cá nhân của bạn"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Họ và Tên"
                value={formData.personalInfo.fullName}
                onChange={(val) => updateFormData('personalInfo.fullName', val)}
                placeholder="Nhập họ và tên"
                error={errors.fullName}
                required
              />
              <FormField
                label="Email"
                type="email"
                value={formData.personalInfo.email}
                onChange={(val) => updateFormData('personalInfo.email', val)}
                placeholder="email@example.com"
                error={errors.email}
                required
              />
              <FormField
                label="Số Điện Thoại"
                value={formData.personalInfo.phone}
                onChange={(val) => updateFormData('personalInfo.phone', val)}
                placeholder="0912345678"
                error={errors.phone}
                required
              />
              <FormField
                label="Ngày Sinh"
                type="date"
                value={formData.personalInfo.dateOfBirth}
                onChange={(val) => updateFormData('personalInfo.dateOfBirth', val)}
                error={errors.dateOfBirth}
                required
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Giới Tính
                </label>
                <div className="flex gap-6">
                  {['male', 'female', 'other'].map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={formData.personalInfo.gender === option}
                        onChange={(e) => updateFormData('personalInfo.gender', e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {option === 'male' ? 'Nam' : option === 'female' ? 'Nữ' : 'Khác'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </FormStep>
        );

      // Step 2: Location
      case 1:
        return (
          <FormStep
            title="Địa Chỉ"
            subtitle="Thêm địa chỉ hiện tại của bạn"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tỉnh/Thành Phố"
                as="select"
                value={formData.location.city}
                onChange={(val) => updateFormData('location.city', val)}
                error={errors.city}
                required
              >
                <option value="">-- Chọn Tỉnh/Thành Phố --</option>
                {vietnamCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </FormField>
              <FormField
                label="Quận/Huyện"
                value={formData.location.district}
                onChange={(val) => updateFormData('location.district', val)}
                placeholder="Nhập quận/huyện"
              />
              <FormField
                label="Phường/Xã"
                value={formData.location.ward}
                onChange={(val) => updateFormData('location.ward', val)}
                placeholder="Nhập phường/xã"
              />
              <FormField
                label="Quốc Gia"
                value={formData.location.country}
                onChange={(val) => updateFormData('location.country', val)}
                placeholder="Nhập quốc gia"
              />
              <div className="md:col-span-2">
                <FormField
                  label="Địa Chỉ Chi Tiết"
                  as="textarea"
                  value={formData.location.address}
                  onChange={(val) => updateFormData('location.address', val)}
                  placeholder="Nhập địa chỉ chi tiết"
                  error={errors.address}
                  required
                  rows={3}
                />
              </div>
            </div>
          </FormStep>
        );

      // Step 3: Career Preferences
      case 2:
        return (
          <FormStep
            title="Ngành Nghề Quan Tâm"
            subtitle="Lựa chọn vị trí và địa điểm bạn mong muốn"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Vị Trí Mong Muốn <span className="text-red-500">*</span>
                </label>
                <AutocompleteDropdown
                  value=""
                  placeholder="Gõ để tìm vị trí"
                  onSelect={(cat) => {
                    if (!formData.careerPreferences.targetPositions.includes(cat.slug)) {
                      updateFormData('careerPreferences.targetPositions', [
                        ...formData.careerPreferences.targetPositions,
                        cat.slug
                      ]);
                    }
                  }}
                  error={errors.targetPositions}
                />
                {formData.careerPreferences.targetPositions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.careerPreferences.targetPositions.map((pos, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg">
                        {pos}
                        <button
                          onClick={() => {
                            const updated = formData.careerPreferences.targetPositions.filter((_, i) => i !== idx);
                            updateFormData('careerPreferences.targetPositions', updated);
                          }}
                          className="hover:text-indigo-900"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Địa Điểm Mong Muốn <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {vietnamCities.map(city => (
                    <label key={city} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.careerPreferences.targetLocations.includes(city)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('careerPreferences.targetLocations', [
                              ...formData.careerPreferences.targetLocations,
                              city
                            ]);
                          } else {
                            const updated = formData.careerPreferences.targetLocations.filter(loc => loc !== city);
                            updateFormData('careerPreferences.targetLocations', updated);
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-slate-700">{city}</span>
                    </label>
                  ))}
                </div>
                {errors.targetLocations && (
                  <p className="mt-2 text-xs text-red-600">{errors.targetLocations}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Lương Tối Thiểu (Triệu VNĐ)"
                  type="number"
                  value={formData.careerPreferences.salaryExpectation.min}
                  onChange={(val) => updateFormData('careerPreferences.salaryExpectation.min', val)}
                  placeholder="Ví dụ: 15"
                  error={errors.salaryMin}
                />
                <FormField
                  label="Lương Tối Đa (Triệu VNĐ)"
                  type="number"
                  value={formData.careerPreferences.salaryExpectation.max}
                  onChange={(val) => updateFormData('careerPreferences.salaryExpectation.max', val)}
                  placeholder="Ví dụ: 30"
                  error={errors.salaryMax}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Loại Công Việc
                </label>
                <div className="space-y-2">
                  {['full-time', 'part-time', 'freelance', 'contract'].map(type => (
                    <label key={type} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.careerPreferences.jobTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('careerPreferences.jobTypes', [
                              ...formData.careerPreferences.jobTypes,
                              type
                            ]);
                          } else {
                            const updated = formData.careerPreferences.jobTypes.filter(t => t !== type);
                            updateFormData('careerPreferences.jobTypes', updated);
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {type === 'full-time' ? 'Toàn Thời Gian' :
                         type === 'part-time' ? 'Bán Thời Gian' :
                         type === 'freelance' ? 'Freelance' : 'Hợp Đồng'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </FormStep>
        );

      // Step 4: Experience
      case 3:
        return (
          <FormStep
            title="Kinh Nghiệm Làm Việc"
            subtitle="Thêm lịch sử công việc của bạn"
          >
            <div className="space-y-6">
              {formData.experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Công Việc #{idx + 1}</h4>
                    <button
                      onClick={() => removeItem('experience', idx)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <FormField
                    label="Tên Công Ty"
                    value={exp.companyName}
                    onChange={(val) => updateItem('experience', idx, { companyName: val })}
                    placeholder="Tên công ty"
                  />
                  <FormField
                    label="Vị Trí"
                    value={exp.position}
                    onChange={(val) => updateItem('experience', idx, { position: val })}
                    placeholder="Vị trí"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Ngày Bắt Đầu"
                      type="date"
                      value={exp.startDate}
                      onChange={(val) => updateItem('experience', idx, { startDate: val })}
                    />
                    <FormField
                      label="Ngày Kết Thúc"
                      type="date"
                      value={exp.endDate}
                      onChange={(val) => updateItem('experience', idx, { endDate: val })}
                      disabled={exp.isCurrent}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.isCurrent}
                      onChange={(e) => updateItem('experience', idx, { isCurrent: e.target.checked, endDate: '' })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-slate-700">Công việc hiện tại</span>
                  </label>
                  <FormField
                    label="Mô Tả"
                    as="textarea"
                    value={exp.description}
                    onChange={(val) => updateItem('experience', idx, { description: val })}
                    placeholder="Mô tả công việc, trách nhiệm..."
                    rows={3}
                  />
                </div>
              ))}
              <button
                onClick={() => addItem('experience', {
                  companyName: '',
                  position: '',
                  startDate: '',
                  endDate: '',
                  isCurrent: false,
                  description: ''
                })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Công Việc
              </button>
            </div>
          </FormStep>
        );

      // Step 5: Education
      case 4:
        return (
          <FormStep
            title="Học Vấn"
            subtitle="Thêm lịch sử giáo dục của bạn"
          >
            <div className="space-y-6">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Học Tập #{idx + 1}</h4>
                    <button
                      onClick={() => removeItem('education', idx)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <FormField
                    label="Tên Trường"
                    value={edu.schoolName}
                    onChange={(val) => updateItem('education', idx, { schoolName: val })}
                    placeholder="Tên trường"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Bằng Cấp"
                      as="select"
                      value={edu.degree}
                      onChange={(val) => updateItem('education', idx, { degree: val })}
                    >
                      <option value="">-- Chọn Bằng Cấp --</option>
                      <option value="high-school">Trung Học Phổ Thông</option>
                      <option value="associate">Cao Đẳng</option>
                      <option value="bachelor">Đại Học</option>
                      <option value="master">Thạc Sĩ</option>
                      <option value="phd">Tiến Sĩ</option>
                    </FormField>
                    <FormField
                      label="Chuyên Ngành"
                      value={edu.field}
                      onChange={(val) => updateItem('education', idx, { field: val })}
                      placeholder="Chuyên ngành"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Ngày Bắt Đầu"
                      type="date"
                      value={edu.startDate}
                      onChange={(val) => updateItem('education', idx, { startDate: val })}
                    />
                    <FormField
                      label="Ngày Tốt Nghiệp"
                      type="date"
                      value={edu.endDate}
                      onChange={(val) => updateItem('education', idx, { endDate: val })}
                    />
                  </div>
                  <FormField
                    label="Điểm Trung Bình (GPA)"
                    type="number"
                    value={edu.gpa}
                    onChange={(val) => updateItem('education', idx, { gpa: val })}
                    placeholder="Ví dụ: 3.5"
                    min="0"
                    max="4"
                    step="0.1"
                  />
                </div>
              ))}
              <button
                onClick={() => addItem('education', {
                  schoolName: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  gpa: ''
                })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Học Vấn
              </button>
            </div>
          </FormStep>
        );

      // Step 6: Skills
      case 5:
        return (
          <FormStep
            title="Kỹ Năng"
            subtitle="Liệt kê các kỹ năng chuyên môn của bạn"
          >
            <div className="space-y-6">
              {formData.skills.map((skill, idx) => (
                <div key={idx} className="flex items-end gap-4">
                  <FormField
                    label={idx === 0 ? "Tên Kỹ Năng" : ""}
                    value={skill.name}
                    onChange={(val) => updateItem('skills', idx, { name: val })}
                    placeholder="Ví dụ: React, Python, Photoshop"
                    containerClassName="flex-1"
                  />
                  <FormField
                    label={idx === 0 ? "Mức Độ" : ""}
                    as="select"
                    value={skill.level}
                    onChange={(val) => updateItem('skills', idx, { level: val })}
                    containerClassName="w-40"
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="beginner">Sơ Cấp</option>
                    <option value="intermediate">Trung Bình</option>
                    <option value="advanced">Nâng Cao</option>
                    <option value="expert">Chuyên Gia</option>
                  </FormField>
                  <button
                    onClick={() => removeItem('skills', idx)}
                    className="text-red-600 hover:text-red-700 p-2.5 bg-red-50 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem('skills', { name: '', level: '' })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Kỹ Năng
              </button>
            </div>
          </FormStep>
        );

      // Step 7: Certificates
      case 6:
        return (
          <FormStep
            title="Chứng Chỉ & Giấy Chứng Nhận"
            subtitle="Thêm các chứng chỉ chuyên môn của bạn"
          >
            <div className="space-y-6">
              {formData.certificates.map((cert, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Chứng Chỉ #{idx + 1}</h4>
                    <button
                      onClick={() => removeItem('certificates', idx)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <FormField
                    label="Tên Chứng Chỉ"
                    value={cert.name}
                    onChange={(val) => updateItem('certificates', idx, { name: val })}
                    placeholder="Ví dụ: AWS Solutions Architect"
                  />
                  <FormField
                    label="Cơ Quan Cấp"
                    value={cert.issuer}
                    onChange={(val) => updateItem('certificates', idx, { issuer: val })}
                    placeholder="Ví dụ: Amazon Web Services"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Ngày Cấp"
                      type="date"
                      value={cert.issueDate}
                      onChange={(val) => updateItem('certificates', idx, { issueDate: val })}
                    />
                    <FormField
                      label="Ngày Hết Hạn"
                      type="date"
                      value={cert.expiryDate}
                      onChange={(val) => updateItem('certificates', idx, { expiryDate: val })}
                    />
                  </div>
                  <FormField
                    label="URL Chứng Thực"
                    type="url"
                    value={cert.credentialUrl}
                    onChange={(val) => updateItem('certificates', idx, { credentialUrl: val })}
                    placeholder="https://..."
                  />
                </div>
              ))}
              <button
                onClick={() => addItem('certificates', {
                  name: '',
                  issuer: '',
                  issueDate: '',
                  expiryDate: '',
                  credentialUrl: ''
                })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Chứng Chỉ
              </button>
            </div>
          </FormStep>
        );

      // Step 8: Projects
      case 7:
        return (
          <FormStep
            title="Dự Án & Portfolio"
            subtitle="Thêm các dự án bạn đã thực hiện"
          >
            <div className="space-y-6">
              {formData.projects.map((project, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800">Dự Án #{idx + 1}</h4>
                    <button
                      onClick={() => removeItem('projects', idx)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <FormField
                    label="Tên Dự Án"
                    value={project.name}
                    onChange={(val) => updateItem('projects', idx, { name: val })}
                    placeholder="Tên dự án"
                  />
                  <FormField
                    label="Mô Tả"
                    as="textarea"
                    value={project.description}
                    onChange={(val) => updateItem('projects', idx, { description: val })}
                    placeholder="Mô tả dự án"
                    rows={3}
                  />
                  <FormField
                    label="Vai Trò"
                    value={project.role}
                    onChange={(val) => updateItem('projects', idx, { role: val })}
                    placeholder="Ví dụ: Backend Developer"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Ngày Bắt Đầu"
                      type="date"
                      value={project.startDate}
                      onChange={(val) => updateItem('projects', idx, { startDate: val })}
                    />
                    <FormField
                      label="Ngày Kết Thúc"
                      type="date"
                      value={project.endDate}
                      onChange={(val) => updateItem('projects', idx, { endDate: val })}
                    />
                  </div>
                  <FormField
                    label="Công Nghệ Sử Dụng"
                    value={project.technologies?.join(', ') || ''}
                    onChange={(val) => updateItem('projects', idx, { technologies: val.split(',').map(t => t.trim()) })}
                    placeholder="React, Node.js, MongoDB"
                  />
                  <FormField
                    label="Liên Kết Dự Án"
                    type="url"
                    value={project.link}
                    onChange={(val) => updateItem('projects', idx, { link: val })}
                    placeholder="https://..."
                  />
                </div>
              ))}
              <button
                onClick={() => addItem('projects', {
                  name: '',
                  description: '',
                  role: '',
                  startDate: '',
                  endDate: '',
                  technologies: [],
                  link: ''
                })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Dự Án
              </button>
            </div>
          </FormStep>
        );

      // Step 9: Languages
      case 8:
        return (
          <FormStep
            title="Ngôn Ngữ"
            subtitle="Kỹ năng ngôn ngữ của bạn"
          >
            <div className="space-y-6">
              {formData.languages.map((lang, idx) => (
                <div key={idx} className="flex items-end gap-4">
                  <FormField
                    label={idx === 0 ? "Ngôn Ngữ" : ""}
                    value={lang.language}
                    onChange={(val) => updateItem('languages', idx, { language: val })}
                    placeholder="Ví dụ: Tiếng Anh, Tiếng Trung"
                    containerClassName="flex-1"
                  />
                  <FormField
                    label={idx === 0 ? "Mức Độ" : ""}
                    as="select"
                    value={lang.level}
                    onChange={(val) => updateItem('languages', idx, { level: val })}
                    containerClassName="w-40"
                  >
                    <option value="">Chọn mức độ</option>
                    <option value="beginner">Sơ Cấp</option>
                    <option value="intermediate">Trung Bình</option>
                    <option value="advanced">Nâng Cao</option>
                    <option value="fluent">Thành Thạo</option>
                  </FormField>
                  <button
                    onClick={() => removeItem('languages', idx)}
                    className="text-red-600 hover:text-red-700 p-2.5 bg-red-50 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem('languages', { language: '', level: '' })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Ngôn Ngữ
              </button>
            </div>
          </FormStep>
        );

      // Step 10: Review
      case 9:
        return (
          <FormStep
            title="Xem Lại Hồ Sơ"
            subtitle="Vui lòng kiểm tra lại toàn bộ thông tin trước khi gửi"
          >
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold">Đảm bảo tất cả thông tin chính xác trước khi gửi. Bạn có thể cập nhật hồ sơ sau đó.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Thông Tin Cá Nhân</h3>
                  <p className="text-sm text-slate-600">{formData.personalInfo.fullName}</p>
                  <p className="text-xs text-slate-400">{formData.personalInfo.email}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Số Điều Tra</h3>
                  <p className="text-sm text-slate-600">{formData.experience.length} công việc</p>
                  <p className="text-sm text-slate-600">{formData.education.length} học tập</p>
                </div>
              <div className="md:col-span-2">
                  <h3 className="font-bold text-slate-800 mb-2">Kỹ Năng ({formData.skills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                {smartSuggestions && smartSuggestions.suggestions && smartSuggestions.suggestions.length > 0 && (
                  <div className="md:col-span-2 pt-4 border-t border-slate-200 mt-2">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      Gợi ý thông minh cho CV
                    </h3>
                    <div className="space-y-4">
                      {smartSuggestions.suggestions.map((block, idx) => (
                        <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4">
                          <div className="text-sm font-bold text-slate-800 mb-2">{block.title}</div>
                          <div className="flex flex-wrap gap-2">
                            {block.items.map((it, i2) => {
                              const label = it.label || it.name || it.language || it.slug || 'Item';
                              return (
                                <span key={i2} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded">
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const next = applyCvSmartSuggestions(formData, smartSuggestions);
                        setFormData(next);
                      }}
                      className="mt-4 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all"
                    >
                      Áp dụng gợi ý
                    </button>
                    <p className="text-xs text-slate-500 mt-2">
                      Hệ thống đề xuất dựa trên dữ liệu bạn đã nhập (rule-based). Bạn có thể chỉnh sửa trước khi gửi.
                    </p>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Tôi đồng ý với <span className="text-indigo-600 hover:underline">Điều Khoản Dịch Vụ</span> và <span className="text-indigo-600 hover:underline">Chính Sách Bảo Mật</span>
                </span>
              </label>

              {errors.agreedToTerms && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.agreedToTerms}
                </p>
              )}

              {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-700 font-semibold">{successMessage}</p>
                </div>
              )}

              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-semibold">{errors.submit}</p>
                </div>
              )}
            </div>
          </FormStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-slate-700">
            Bước {currentStep + 1}/{steps.length}
          </span>
          <span className="text-sm font-bold text-slate-700">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <button
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                idx === currentStep
                  ? 'bg-indigo-600 text-white'
                  : idx < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              {idx < currentStep ? <CheckCircle2 className="w-3 h-3 inline mr-1" /> : null}
              {step}
            </button>
            {idx < steps.length - 1 && (
              <div className="h-1 bg-slate-200 flex-grow mx-2 flex-shrink-0 max-w-32" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form content */}
      <div className="bg-white border-2 border-slate-100 rounded-2xl p-8 mb-8">
        {renderStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-4 justify-between">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Quay Lại
        </button>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {loading ? 'Đang Gửi...' : 'Hoàn Thành'}
          </button>
        ) : (
          <button
            onClick={handleNextStep}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            Tiếp Tục <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicantFormWizard;
