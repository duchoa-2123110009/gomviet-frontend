import React from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantFormWizard from '../components/ApplicantFormWizard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const ApplicantOnboarding = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Call API to save applicant profile
      const response = await api.post('/applicants/profile', formData);

      if (response.success || response.data) {
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        return true;
      } else {
        throw new Error(response.message || 'Lỗi khi lưu hồ sơ');
      }
    } catch (error) {
      throw new Error(error.message || 'Lỗi khi gửi hồ sơ');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">
              Hoàn Thành Hồ Sơ
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              Xây Dựng Hồ Sơ Ứng Viên Của Bạn
            </h1>
            <p className="text-slate-500 font-semibold max-w-2xl mx-auto">
              Hoàn thành hồ sơ của bạn để tăng cơ hội nhận được các đề nghị công việc tốt từ các nhà tuyển dụng hàng đầu.
            </p>
          </div>

          {/* Form */}
          <ApplicantFormWizard onSubmit={handleSubmit} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplicantOnboarding;
