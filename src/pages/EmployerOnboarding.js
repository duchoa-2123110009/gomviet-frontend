import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerFormWizard from '../components/EmployerFormWizard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const EmployerOnboarding = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Call API to save employer profile
      const response = await api.post('/employers/profile', formData);

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
              Thiết Lập Hồ Sơ Công Ty
            </h1>
            <p className="text-slate-500 font-semibold max-w-2xl mx-auto">
              Hoàn thành hồ sơ công ty để bắt đầu tuyển dụng các ứng viên phù hợp với nhu cầu của bạn.
            </p>
          </div>

          {/* Form */}
          <EmployerFormWizard onSubmit={handleSubmit} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmployerOnboarding;
