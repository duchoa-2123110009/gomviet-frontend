import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader, Plus, Trash2 } from 'lucide-react';
import FormField from './FormField';
import FormStep from './FormStep';
import AutocompleteDropdown from './AutocompleteDropdown';
import { validateRequired, validateSalary } from '../utils/validation';

const JobPostingForm = ({ onSubmit, initialData = null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const vietnamCities = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Bình Dương', 'Đồng Nai', 'Quảng Ninh', 'Vĩnh Phúc', 'Toàn Quốc'
  ];

  const [formData, setFormData] = useState(initialData || {
    // Step 1: Basic Info
    basicInfo: {
      jobTitle: '',
      category: '',
      numberOfPositions: '1',
      jobType: 'full-time', // full-time, part-time, contract, freelance
      workLocationType: 'onsite', // onsite, remote, hybrid
      deadline: ''
    },
    // Step 2: Salary & Location
    compensation: {
      minSalary: '',
      maxSalary: '',
      currency: 'VND',
      salaryNegotiable: false
    },
    // Step 3: Location Details
    location: {
      city: '',
      district: '',
      address: '',
      multipleLocations: []
    },
    // Step 4: Job Description
    description: {
      jobDescription: '',
      responsibilities: [],
      requirements: [],
      niceToHave: []
    },
    // Step 5: Required Skills
    skills: [],
    // Step 6: Experience & Education
    experience: {
      experienceLevel: 'any', // entry, mid, senior, any
      yearsRequired: '0',
      educationLevel: 'any' // high-school, associate, bachelor, master, phd, any
    },
    // Step 7: Languages
    languages: [],
    // Step 8: Benefits
    benefits: [],
    // Step 9: Special Conditions
    specialConditions: {
      visaSponsorshipAvailable: false,
      relocationAssistanceAvailable: false,
      remotePossible: false,
      trainingProvided: false,
      certificationRequired: '',
      securityClearanceRequired: false
    },
    // Step 10: Contact & Additional Info
    contactInfo: {
      contactPersonName: '',
      contactPersonTitle: '',
      contactEmail: '',
      contactPhone: '',
      hiringTeamSize: '1',
      applicationMethod: 'direct' // direct, form, external-link
    },
    // Step 11: Review
    agreedToTerms: false
  });

  const steps = [
    'Thông Tin Cơ Bản',
    'Mức Lương',
    'Địa Điểm',
    'Mô Tả Công Việc',
    'Kỹ Năng Cần',
    'Kinh Nghiệm & Học Vấn',
    'Ngôn Ngữ',
    'Phúc Lợi',
    'Điều Kiện Đặc Biệt',
    'Thông Tin Liên Hệ',
    'Xem Lại'
  ];

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

  const addItem = (field, item) => {
    updateFormData(field, [...(formData[field] || []), item]);
  };

  const removeItem = (field, index) => {
    const items = [...formData[field]];
    items.splice(index, 1);
    updateFormData(field, items);
  };

  const updateItem = (field, index, updates) => {
    const items = [...formData[field]];
    items[index] = { ...items[index], ...updates };
    updateFormData(field, items);
  };

  const validateStep = (step) => {
    const stepErrors = {};

    switch (step) {
      case 0: // Basic Info
        if (!validateRequired(formData.basicInfo.jobTitle)) {
          stepErrors.jobTitle = 'Chức danh không được để trống';
        }
        if (!validateRequired(formData.basicInfo.category)) {
          stepErrors.category = 'Ngành nghề không được để trống';
        }
        if (!validateRequired(formData.basicInfo.deadline)) {
          stepErrors.deadline = 'Hạn nộp hồ sơ không được để trống';
        }
        break;

      case 1: // Salary
        if (!formData.compensation.salaryNegotiable) {
          if (!validateRequired(formData.compensation.minSalary)) {
            stepErrors.minSalary = 'Mức lương tối thiểu không được để trống';
          }
          if (!validateRequired(formData.compensation.maxSalary)) {
            stepErrors.maxSalary = 'Mức lương tối đa không được để trống';
          }
        }
        break;

      case 2: // Location
        if (!validateRequired(formData.location.city)) {
          stepErrors.city = 'Thành phố không được để trống';
        }
        break;

      case 3: // Description
        if (!validateRequired(formData.description.jobDescription)) {
          stepErrors.jobDescription = 'Mô tả công việc không được để trống';
        }
        if (formData.description.requirements.length === 0) {
          stepErrors.requirements = 'Phải có ít nhất 1 yêu cầu';
        }
        break;

      case 4: // Skills
        if (formData.skills.length === 0) {
          stepErrors.skills = 'Phải có ít nhất 1 kỹ năng';
        }
        break;

      case 9: // Contact
        if (!validateRequired(formData.contactInfo.contactPersonName)) {
          stepErrors.contactPersonName = 'Tên người liên hệ không được để trống';
        }
        if (!validateRequired(formData.contactInfo.contactEmail)) {
          stepErrors.contactEmail = 'Email liên hệ không được để trống';
        }
        break;

      default:
        break;
    }

    return stepErrors;
  };

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

  const handlePrevStep = () => {
    setErrors({});
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.agreedToTerms) {
      setErrors({ agreedToTerms: 'Vui lòng đồng ý với điều khoản' });
      return;
    }

    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Lỗi khi gửi dữ liệu' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      // Step 1: Basic Info
      case 0:
        return (
          <FormStep
            title="Thông Tin Cơ Bản"
            subtitle="Cung cấp thông tin cơ bản về vị trí công việc"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Chức Danh/Vị Trí"
                value={formData.basicInfo.jobTitle}
                onChange={(val) => updateFormData('basicInfo.jobTitle', val)}
                placeholder="VD: Senior Backend Developer"
                error={errors.jobTitle}
                required
              />
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ngành Nghề <span className="text-red-500">*</span>
                </label>
                <AutocompleteDropdown
                  value={formData.basicInfo.category}
                  onSelect={(cat) => updateFormData('basicInfo.category', cat.displayText)}
                  placeholder="Tìm ngành nghề"
                  error={errors.category}
                />
              </div>

              <FormField
                label="Loại Công Việc"
                as="select"
                value={formData.basicInfo.jobType}
                onChange={(val) => updateFormData('basicInfo.jobType', val)}
              >
                <option value="full-time">Toàn Thời Gian</option>
                <option value="part-time">Bán Thời Gian</option>
                <option value="contract">Hợp Đồng</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Thực Tập</option>
              </FormField>

              <FormField
                label="Nơi Làm Việc"
                as="select"
                value={formData.basicInfo.workLocationType}
                onChange={(val) => updateFormData('basicInfo.workLocationType', val)}
              >
                <option value="onsite">Tại Văn Phòng</option>
                <option value="remote">Làm Việc Từ Xa</option>
                <option value="hybrid">Kết Hợp (Hybrid)</option>
              </FormField>

              <FormField
                label="Số Lượng Vị Trí"
                type="number"
                value={formData.basicInfo.numberOfPositions}
                onChange={(val) => updateFormData('basicInfo.numberOfPositions', val)}
                min="1"
              />

              <FormField
                label="Hạn Nộp Hồ Sơ"
                type="date"
                value={formData.basicInfo.deadline}
                onChange={(val) => updateFormData('basicInfo.deadline', val)}
                error={errors.deadline}
                required
              />
            </div>
          </FormStep>
        );

      // Step 2: Salary
      case 1:
        return (
          <FormStep
            title="Mức Lương"
            subtitle="Thông tin về mức lương và bảo hiểm"
          >
            <div className="space-y-6">
              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-slate-300">
                <input
                  type="checkbox"
                  checked={formData.compensation.salaryNegotiable}
                  onChange={(e) => updateFormData('compensation.salaryNegotiable', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Thỏa thuận lương theo kinh nghiệm</span>
              </label>

              {!formData.compensation.salaryNegotiable && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label="Lương Tối Thiểu"
                    type="number"
                    value={formData.compensation.minSalary}
                    onChange={(val) => updateFormData('compensation.minSalary', val)}
                    placeholder="VD: 15"
                    error={errors.minSalary}
                  />
                  <FormField
                    label="Lương Tối Đa"
                    type="number"
                    value={formData.compensation.maxSalary}
                    onChange={(val) => updateFormData('compensation.maxSalary', val)}
                    placeholder="VD: 30"
                    error={errors.maxSalary}
                  />
                  <FormField
                    label="Đơn Vị Tiền Tệ"
                    as="select"
                    value={formData.compensation.currency}
                    onChange={(val) => updateFormData('compensation.currency', val)}
                  >
                    <option value="VND">Triệu VNĐ</option>
                    <option value="USD">USD</option>
                  </FormField>
                </div>
              )}
            </div>
          </FormStep>
        );

      // Step 3: Location
      case 2:
        return (
          <FormStep
            title="Địa Điểm"
            subtitle="Nơi làm việc"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Thành Phố"
                as="select"
                value={formData.location.city}
                onChange={(val) => updateFormData('location.city', val)}
                error={errors.city}
                required
              >
                <option value="">-- Chọn Thành Phố --</option>
                {vietnamCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </FormField>

              <FormField
                label="Quận/Huyện"
                value={formData.location.district}
                onChange={(val) => updateFormData('location.district', val)}
                placeholder="VD: Quận 1"
              />

              <div className="md:col-span-2">
                <FormField
                  label="Địa Chỉ Chi Tiết"
                  as="textarea"
                  value={formData.location.address}
                  onChange={(val) => updateFormData('location.address', val)}
                  placeholder="Địa chỉ chi tiết của văn phòng"
                  rows={2}
                />
              </div>
            </div>
          </FormStep>
        );

      // Step 4: Job Description
      case 3:
        return (
          <FormStep
            title="Mô Tả Công Việc"
            subtitle="Chi tiết về vị trí và yêu cầu"
          >
            <div className="space-y-6">
              <FormField
                label="Mô Tả Công Việc"
                as="textarea"
                value={formData.description.jobDescription}
                onChange={(val) => updateFormData('description.jobDescription', val)}
                placeholder="Mô tả chi tiết về công việc..."
                error={errors.jobDescription}
                rows={4}
                required
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Trách Nhiệm & Nhiệm Vụ <span className="text-red-500">*</span>
                </label>
                {formData.description.responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => {
                        const items = [...formData.description.responsibilities];
                        items[idx] = e.target.value;
                        updateFormData('description.responsibilities', items);
                      }}
                      placeholder="VD: Phát triển API REST"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const items = formData.description.responsibilities.filter((_, i) => i !== idx);
                        updateFormData('description.responsibilities', items);
                      }}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addItem('description.responsibilities', '')}
                  className="text-sm text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" /> Thêm Trách Nhiệm
                </button>
                {errors.responsibilities && <p className="text-xs text-red-600 mt-1">{errors.responsibilities}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Yêu Cầu <span className="text-red-500">*</span>
                </label>
                {formData.description.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => {
                        const items = [...formData.description.requirements];
                        items[idx] = e.target.value;
                        updateFormData('description.requirements', items);
                      }}
                      placeholder="VD: 3+ năm kinh nghiệm Node.js"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const items = formData.description.requirements.filter((_, i) => i !== idx);
                        updateFormData('description.requirements', items);
                      }}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addItem('description.requirements', '')}
                  className="text-sm text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" /> Thêm Yêu Cầu
                </button>
                {errors.requirements && <p className="text-xs text-red-600 mt-1">{errors.requirements}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Điểm Cộng (Nice to Have)
                </label>
                {formData.description.niceToHave.map((nice, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={nice}
                      onChange={(e) => {
                        const items = [...formData.description.niceToHave];
                        items[idx] = e.target.value;
                        updateFormData('description.niceToHave', items);
                      }}
                      placeholder="VD: Kinh nghiệm AWS"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg"
                    />
                    <button
                      onClick={() => {
                        const items = formData.description.niceToHave.filter((_, i) => i !== idx);
                        updateFormData('description.niceToHave', items);
                      }}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addItem('description.niceToHave', '')}
                  className="text-sm text-indigo-600 font-bold hover:text-indigo-700 flex items-center gap-1 mt-2"
                >
                  <Plus className="w-4 h-4" /> Thêm Điểm Cộng
                </button>
              </div>
            </div>
          </FormStep>
        );

      // Step 5: Skills
      case 4:
        return (
          <FormStep
            title="Kỹ Năng Cần Thiết"
            subtitle="Các kỹ năng bắt buộc cho vị trí"
          >
            <div className="space-y-6">
              {formData.skills.map((skill, idx) => (
                <div key={idx} className="flex items-end gap-4">
                  <FormField
                    label={idx === 0 ? 'Kỹ Năng' : ''}
                    value={skill.name}
                    onChange={(val) => updateItem('skills', idx, { name: val })}
                    placeholder="VD: React"
                    containerClassName="flex-1"
                  />
                  <FormField
                    label={idx === 0 ? 'Mức Độ' : ''}
                    as="select"
                    value={skill.level}
                    onChange={(val) => updateItem('skills', idx, { level: val })}
                    containerClassName="w-40"
                  >
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
                onClick={() => addItem('skills', { name: '', level: 'intermediate' })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Kỹ Năng
              </button>
              {errors.skills && <p className="text-xs text-red-600">{errors.skills}</p>}
            </div>
          </FormStep>
        );

      // Step 6: Experience & Education
      case 5:
        return (
          <FormStep
            title="Kinh Nghiệm & Học Vấn"
            subtitle="Yêu cầu về trình độ"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Mức Kinh Nghiệm"
                as="select"
                value={formData.experience.experienceLevel}
                onChange={(val) => updateFormData('experience.experienceLevel', val)}
              >
                <option value="entry">Fresher/Mới Ra Trường</option>
                <option value="mid">Trung Cấp (2-5 năm)</option>
                <option value="senior">Cao Cấp (5+ năm)</option>
                <option value="any">Không Yêu Cầu</option>
              </FormField>

              <FormField
                label="Năm Kinh Nghiệm Tối Thiểu"
                type="number"
                value={formData.experience.yearsRequired}
                onChange={(val) => updateFormData('experience.yearsRequired', val)}
                min="0"
              />

              <div className="md:col-span-2">
                <FormField
                  label="Trình Độ Học Vấn"
                  as="select"
                  value={formData.experience.educationLevel}
                  onChange={(val) => updateFormData('experience.educationLevel', val)}
                >
                  <option value="high-school">Trung Học Phổ Thông</option>
                  <option value="associate">Cao Đẳng</option>
                  <option value="bachelor">Đại Học</option>
                  <option value="master">Thạc Sĩ</option>
                  <option value="phd">Tiến Sĩ</option>
                  <option value="any">Không Yêu Cầu</option>
                </FormField>
              </div>
            </div>
          </FormStep>
        );

      // Step 7: Languages
      case 6:
        return (
          <FormStep
            title="Ngôn Ngữ"
            subtitle="Ngôn ngữ cần thiết cho vị trí"
          >
            <div className="space-y-6">
              {formData.languages.map((lang, idx) => (
                <div key={idx} className="flex items-end gap-4">
                  <FormField
                    label={idx === 0 ? 'Ngôn Ngữ' : ''}
                    value={lang.name}
                    onChange={(val) => updateItem('languages', idx, { name: val })}
                    placeholder="VD: Tiếng Anh"
                    containerClassName="flex-1"
                  />
                  <FormField
                    label={idx === 0 ? 'Mức Độ' : ''}
                    as="select"
                    value={lang.level}
                    onChange={(val) => updateItem('languages', idx, { level: val })}
                    containerClassName="w-40"
                  >
                    <option value="basic">Cơ Bản</option>
                    <option value="intermediate">Trung Bình</option>
                    <option value="advanced">Nâng Cao</option>
                    <option value="native">Bản Xứ</option>
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
                onClick={() => addItem('languages', { name: '', level: 'intermediate' })}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm Ngôn Ngữ
              </button>
            </div>
          </FormStep>
        );

      // Step 8: Benefits
      case 7:
        return (
          <FormStep
            title="Phúc Lợi"
            subtitle="Các phúc lợi và ưu đãi"
          >
            <div className="space-y-4">
              {formData.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => {
                      const items = [...formData.benefits];
                      items[idx] = e.target.value;
                      updateFormData('benefits', items);
                    }}
                    placeholder="VD: Bảo hiểm y tế"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg"
                  />
                  <button
                    onClick={() => removeItem('benefits', idx)}
                    className="text-red-600 hover:text-red-700 p-2 bg-red-50 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem('benefits', '')}
                className="px-4 py-2 border-2 border-indigo-500 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 flex items-center gap-2 transition-colors w-full justify-center"
              >
                <Plus className="w-4 h-4" /> Thêm Phúc Lợi
              </button>
            </div>
          </FormStep>
        );

      // Step 9: Special Conditions
      case 8:
        return (
          <FormStep
            title="Điều Kiện Đặc Biệt"
            subtitle="Các yêu cầu và điều kiện khác"
          >
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specialConditions.visaSponsorshipAvailable}
                  onChange={(e) => updateFormData('specialConditions.visaSponsorshipAvailable', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Hỗ Trợ Visa</span>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specialConditions.relocationAssistanceAvailable}
                  onChange={(e) => updateFormData('specialConditions.relocationAssistanceAvailable', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Hỗ Trợ Chuyển Địa Phương</span>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specialConditions.remotePossible}
                  onChange={(e) => updateFormData('specialConditions.remotePossible', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Có Thể Làm Việc Từ Xa</span>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specialConditions.trainingProvided}
                  onChange={(e) => updateFormData('specialConditions.trainingProvided', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Cung Cấp Đào Tạo</span>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.specialConditions.securityClearanceRequired}
                  onChange={(e) => updateFormData('specialConditions.securityClearanceRequired', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-700">Yêu Cầu Kiểm Tra An Ninh</span>
              </label>

              <FormField
                label="Chứng Chỉ Bắt Buộc"
                as="textarea"
                value={formData.specialConditions.certificationRequired}
                onChange={(val) => updateFormData('specialConditions.certificationRequired', val)}
                placeholder="VD: AWS Solutions Architect, CISSP"
                rows={2}
              />
            </div>
          </FormStep>
        );

      // Step 10: Contact
      case 9:
        return (
          <FormStep
            title="Thông Tin Liên Hệ"
            subtitle="Thông tin người phụ trách tuyển dụng"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tên Người Liên Hệ"
                value={formData.contactInfo.contactPersonName}
                onChange={(val) => updateFormData('contactInfo.contactPersonName', val)}
                placeholder="Tên người phụ trách HR"
                error={errors.contactPersonName}
                required
              />
              <FormField
                label="Vị Trí"
                value={formData.contactInfo.contactPersonTitle}
                onChange={(val) => updateFormData('contactInfo.contactPersonTitle', val)}
                placeholder="VD: HR Manager"
              />
              <FormField
                label="Email"
                type="email"
                value={formData.contactInfo.contactEmail}
                onChange={(val) => updateFormData('contactInfo.contactEmail', val)}
                placeholder="hr@company.com"
                error={errors.contactEmail}
                required
              />
              <FormField
                label="Số Điện Thoại"
                value={formData.contactInfo.contactPhone}
                onChange={(val) => updateFormData('contactInfo.contactPhone', val)}
                placeholder="0212345678"
              />
            </div>
          </FormStep>
        );

      // Step 11: Review
      case 10:
        return (
          <FormStep
            title="Xem Lại Tin Tuyển Dụng"
            subtitle="Kiểm tra lại toàn bộ thông tin"
          >
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 font-semibold">Kiểm tra lại toàn bộ thông tin trước khi đăng tin</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2">
                  <div>
                    <h4 className="font-bold text-slate-700">Chức Danh</h4>
                    <p className="text-sm text-slate-600">{formData.basicInfo.jobTitle}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">Loại Công Việc</h4>
                    <p className="text-sm text-slate-600">{formData.basicInfo.jobType}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">Mức Lương</h4>
                    <p className="text-sm text-slate-600">
                      {formData.compensation.salaryNegotiable
                        ? 'Thỏa thuận'
                        : `${formData.compensation.minSalary} - ${formData.compensation.maxSalary} ${formData.compensation.currency}`}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">Địa Điểm</h4>
                    <p className="text-sm text-slate-600">{formData.location.city}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">Số Lượng Vị Trí</h4>
                    <p className="text-sm text-slate-600">{formData.basicInfo.numberOfPositions}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">Hạn Nộp</h4>
                    <p className="text-sm text-slate-600">{formData.basicInfo.deadline}</p>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-slate-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.agreedToTerms}
                  onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-slate-700">
                  Tôi xác nhận toàn bộ thông tin đúng và đồng ý với Điều Khoản Dịch Vụ
                </span>
              </label>

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
    <div className="w-full max-w-4xl mx-auto">
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
      <div className="grid grid-cols-6 lg:grid-cols-11 gap-2 mb-8">
        {steps.map((step, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx)}
            className={`px-2 py-1.5 text-[10px] font-bold rounded transition-all ${
              idx === currentStep
                ? 'bg-indigo-600 text-white'
                : idx < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
            title={step}
          >
            {step.split(' ')[0]}
          </button>
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
            {loading ? 'Đang Đăng...' : 'Đăng Tin Tuyển Dụng'}
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

export default JobPostingForm;
