import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import FormField from './FormField';
import FormStep from './FormStep';
import AutocompleteDropdown from './AutocompleteDropdown';
import {
  validateCompanyInfo,
  validateCompanyDetails,
  validateContactPerson
} from '../utils/validation';
import { getCategoryTree } from '../utils/categoryHelper';

const EmployerFormWizard = ({ onSubmit, initialData = null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const vietnamCities = [
    'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
    'Bình Dương', 'Đồng Nai', 'Quảng Ninh', 'Hà Tây', 'Vĩnh Phúc'
  ];

  const [formData, setFormData] = useState(initialData || {
    // Step 1: Company Info
    companyInfo: {
      companyName: '',
      companyEmail: '',
      phone: '',
      website: '',
      logo: null,
      banner: null,
      description: '',
      foundedYear: new Date().getFullYear(),
      taxId: ''
    },
    // Step 2: Company Details
    companyDetails: {
      industry: [],
      companyType: 'sme',
      employeeCount: '50-200',
      companySize: ''
    },
    // Step 3: Location
    location: {
      address: '',
      ward: '',
      district: '',
      city: '',
      country: 'Việt Nam'
    },
    // Step 4: Social Media
    socialMedia: {
      facebook: '',
      linkedin: '',
      instagram: '',
      twitter: '',
      youtube: ''
    },
    // Step 5: Contact Person
    contactPerson: {
      name: '',
      position: '',
      phone: '',
      email: ''
    },
    // Step 6: Review
    agreedToTerms: false
  });

  const steps = [
    'Thông Tin Công Ty',
    'Chi Tiết Công Ty',
    'Địa Chỉ',
    'Mô Tả & Media',
    'Người Liên Hệ',
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

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return validateCompanyInfo(formData.companyInfo);
      case 1:
        return validateCompanyDetails(formData.companyDetails);
      case 4:
        return validateContactPerson(formData.contactPerson);
      default:
        return {};
    }
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
        setSuccessMessage('Hồ sơ công ty được lưu thành công!');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Lỗi khi gửi dữ liệu' });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      // Step 1: Company Info
      case 0:
        return (
          <FormStep
            title="Thông Tin Công Ty"
            subtitle="Cung cấp thông tin cơ bản về công ty"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tên Công Ty"
                value={formData.companyInfo.companyName}
                onChange={(val) => updateFormData('companyInfo.companyName', val)}
                placeholder="Tên công ty"
                error={errors.companyName}
                required
              />
              <FormField
                label="Mã Số Thuế"
                value={formData.companyInfo.taxId}
                onChange={(val) => updateFormData('companyInfo.taxId', val)}
                placeholder="0123456789"
                error={errors.taxId}
              />
              <FormField
                label="Email Công Ty"
                type="email"
                value={formData.companyInfo.companyEmail}
                onChange={(val) => updateFormData('companyInfo.companyEmail', val)}
                placeholder="company@example.com"
                error={errors.companyEmail}
                required
              />
              <FormField
                label="Số Điện Thoại"
                value={formData.companyInfo.phone}
                onChange={(val) => updateFormData('companyInfo.phone', val)}
                placeholder="0212345678"
                error={errors.phone}
                required
              />
              <FormField
                label="Website"
                type="url"
                value={formData.companyInfo.website}
                onChange={(val) => updateFormData('companyInfo.website', val)}
                placeholder="https://example.com"
                error={errors.website}
              />
              <FormField
                label="Năm Thành Lập"
                type="number"
                value={formData.companyInfo.foundedYear}
                onChange={(val) => updateFormData('companyInfo.foundedYear', val)}
                min="1900"
                max={new Date().getFullYear()}
              />
              <div className="md:col-span-2">
                <FormField
                  label="Mô Tả Công Ty"
                  as="textarea"
                  value={formData.companyInfo.description}
                  onChange={(val) => updateFormData('companyInfo.description', val)}
                  placeholder="Mô tả về công ty của bạn..."
                  rows={4}
                />
              </div>
            </div>
          </FormStep>
        );

      // Step 2: Company Details
      case 1:
        return (
          <FormStep
            title="Chi Tiết Công Ty"
            subtitle="Chọn loại hình và quy mô công ty"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ngành Nghề <span className="text-red-500">*</span>
                </label>
                <AutocompleteDropdown
                  value=""
                  placeholder="Gõ để tìm ngành nghề"
                  onSelect={(cat) => {
                    if (!formData.companyDetails.industry.includes(cat.slug)) {
                      updateFormData('companyDetails.industry', [
                        ...formData.companyDetails.industry,
                        cat.slug
                      ]);
                    }
                  }}
                  error={errors.industry}
                />
                {formData.companyDetails.industry.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.companyDetails.industry.map((ind, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-lg">
                        {ind}
                        <button
                          onClick={() => {
                            const updated = formData.companyDetails.industry.filter((_, i) => i !== idx);
                            updateFormData('companyDetails.industry', updated);
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Loại Hình Doanh Nghiệp"
                  as="select"
                  value={formData.companyDetails.companyType}
                  onChange={(val) => updateFormData('companyDetails.companyType', val)}
                  error={errors.companyType}
                  required
                >
                  <option value="startup">Startup</option>
                  <option value="sme">SME</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="multinational">Multinational</option>
                </FormField>
                <FormField
                  label="Quy Mô Công Ty"
                  as="select"
                  value={formData.companyDetails.employeeCount}
                  onChange={(val) => updateFormData('companyDetails.employeeCount', val)}
                  error={errors.employeeCount}
                  required
                >
                  <option value="under-50">Dưới 50 nhân viên</option>
                  <option value="50-200">50-200 nhân viên</option>
                  <option value="200-500">200-500 nhân viên</option>
                  <option value="500-1000">500-1000 nhân viên</option>
                  <option value="1000+">1000+ nhân viên</option>
                </FormField>
              </div>
            </div>
          </FormStep>
        );

      // Step 3: Location
      case 2:
        return (
          <FormStep
            title="Địa Chỉ Công Ty"
            subtitle="Cung cấp địa chỉ chi tiết"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tỉnh/Thành Phố"
                as="select"
                value={formData.location.city}
                onChange={(val) => updateFormData('location.city', val)}
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
                placeholder="Quốc gia"
              />
              <div className="md:col-span-2">
                <FormField
                  label="Địa Chỉ Chi Tiết"
                  as="textarea"
                  value={formData.location.address}
                  onChange={(val) => updateFormData('location.address', val)}
                  placeholder="Nhập địa chỉ chi tiết"
                  rows={3}
                />
              </div>
            </div>
          </FormStep>
        );

      // Step 4: Media & Social
      case 3:
        return (
          <FormStep
            title="Mô Tả & Thông Tin Liên Lạc"
            subtitle="Thêm mạng xã hội và thông tin liên hệ"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Facebook"
                type="url"
                value={formData.socialMedia.facebook}
                onChange={(val) => updateFormData('socialMedia.facebook', val)}
                placeholder="https://facebook.com/..."
              />
              <FormField
                label="LinkedIn"
                type="url"
                value={formData.socialMedia.linkedin}
                onChange={(val) => updateFormData('socialMedia.linkedin', val)}
                placeholder="https://linkedin.com/..."
              />
              <FormField
                label="Instagram"
                type="url"
                value={formData.socialMedia.instagram}
                onChange={(val) => updateFormData('socialMedia.instagram', val)}
                placeholder="https://instagram.com/..."
              />
              <FormField
                label="Twitter/X"
                type="url"
                value={formData.socialMedia.twitter}
                onChange={(val) => updateFormData('socialMedia.twitter', val)}
                placeholder="https://twitter.com/..."
              />
              <div className="md:col-span-2">
                <FormField
                  label="YouTube"
                  type="url"
                  value={formData.socialMedia.youtube}
                  onChange={(val) => updateFormData('socialMedia.youtube', val)}
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          </FormStep>
        );

      // Step 5: Contact Person
      case 4:
        return (
          <FormStep
            title="Người Liên Hệ"
            subtitle="Thông tin người đại diện công ty"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tên Người Liên Hệ"
                value={formData.contactPerson.name}
                onChange={(val) => updateFormData('contactPerson.name', val)}
                placeholder="Tên người liên hệ"
                error={errors.name}
                required
              />
              <FormField
                label="Vị Trí"
                value={formData.contactPerson.position}
                onChange={(val) => updateFormData('contactPerson.position', val)}
                placeholder="Ví dụ: HR Manager"
                error={errors.position}
                required
              />
              <FormField
                label="Email"
                type="email"
                value={formData.contactPerson.email}
                onChange={(val) => updateFormData('contactPerson.email', val)}
                placeholder="email@example.com"
                error={errors.email}
                required
              />
              <FormField
                label="Số Điện Thoại"
                value={formData.contactPerson.phone}
                onChange={(val) => updateFormData('contactPerson.phone', val)}
                placeholder="0912345678"
                error={errors.phone}
                required
              />
            </div>
          </FormStep>
        );

      // Step 6: Review
      case 5:
        return (
          <FormStep
            title="Xem Lại Hồ Sơ Công Ty"
            subtitle="Kiểm tra lại tất cả thông tin"
          >
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold">Đảm bảo tất cả thông tin chính xác trước khi gửi.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg">
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Tên Công Ty</h3>
                  <p className="text-sm text-slate-600">{formData.companyInfo.companyName}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Email</h3>
                  <p className="text-sm text-slate-600">{formData.companyInfo.companyEmail}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Loại Hình</h3>
                  <p className="text-sm text-slate-600">{formData.companyDetails.companyType}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">Quy Mô</h3>
                  <p className="text-sm text-slate-600">{formData.companyDetails.employeeCount}</p>
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

export default EmployerFormWizard;
