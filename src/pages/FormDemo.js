import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ApplicantFormWizard from '../components/ApplicantFormWizard';
import EmployerFormWizard from '../components/EmployerFormWizard';
import JobPostingForm from '../components/JobPostingForm';
import QuickJobPostingForm from '../components/QuickJobPostingForm';

const FormDemo = () => {
  const [activeTab, setActiveTab] = useState('applicant');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-slate-800 mb-3">
              Demo Forms - Tuyển Dụng Hoàn Chỉnh
            </h1>
            <p className="text-slate-500 font-semibold">
              Test các form điền thông tin ứng viên, doanh nghiệp & tạo tin tuyển dụng
            </p>
          </div>

          {/* Tabs */}
          <div className="space-y-6">
            <div className="flex border-b-2 border-slate-200 gap-1 bg-white rounded-t-lg p-1">
              <button
                onClick={() => setActiveTab('applicant')}
                className={`px-6 py-3 font-bold rounded-t-lg transition-all ${
                  activeTab === 'applicant'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                👤 Ứng Viên (10 Steps)
              </button>
              <button
                onClick={() => setActiveTab('employer')}
                className={`px-6 py-3 font-bold rounded-t-lg transition-all ${
                  activeTab === 'employer'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                🏢 Doanh Nghiệp (6 Steps)
              </button>
              <button
                onClick={() => setActiveTab('job')}
                className={`px-6 py-3 font-bold rounded-t-lg transition-all ${
                  activeTab === 'job'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                📝 Tin Tuyển Dụng (11 Steps)
              </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-b-lg p-8 border-2 border-slate-100 border-t-0">
              {activeTab === 'applicant' && (
                <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    Form Điền Thông Tin Ứng Viên
                  </h2>
                  <p className="text-slate-500 mb-6">
                    10 bước: Cá nhân → Địa chỉ → Ngành nghề → Kinh nghiệm → Học vấn → Kỹ năng → Chứng chỉ → Dự án → Ngôn ngữ → Review
                  </p>
                  <ApplicantFormWizard
                    onSubmit={async (data) => {
                      console.log('Applicant Form Data:', data);
                      alert('✅ Form submitted! Check console for data');
                    }}
                  />
                </div>
              )}

              {activeTab === 'employer' && (
                <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    Form Điền Thông Tin Doanh Nghiệp
                  </h2>
                  <p className="text-slate-500 mb-6">
                    6 bước: Công ty → Chi tiết → Địa chỉ → Mô tả & Liên hệ → Người liên hệ → Review
                  </p>
                  <EmployerFormWizard
                    onSubmit={async (data) => {
                      console.log('Employer Form Data:', data);
                      alert('✅ Form submitted! Check console for data');
                    }}
                  />
                </div>
              )}

              {activeTab === 'job' && (
                <div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">
                    Form Đăng Tin Tuyển Dụng
                  </h2>
                  <p className="text-slate-500 mb-6">
                    11 bước: Cơ bản → Lương → Địa điểm → Mô tả → Kỹ năng → Kinh nghiệm → Ngôn ngữ → Phúc lợi → Điều kiện → Liên hệ → Review
                  </p>
                  <JobPostingForm
                    onSubmit={async (data) => {
                      console.log('Job Posting Form Data:', data);
                      alert('✅ Form submitted! Check console for data');
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
              <h3 className="font-black text-indigo-800 mb-2">👤 Ứng Viên</h3>
              <p className="text-sm text-slate-600">
                Điền hồ sơ cá nhân, kinh nghiệm, kỹ năng, chứng chỉ, dự án
              </p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
              <h3 className="font-black text-purple-800 mb-2">🏢 Doanh Nghiệp</h3>
              <p className="text-sm text-slate-600">
                Điền thông tin công ty, ngành nghề, quy mô, địa chỉ, liên hệ
              </p>
            </div>
            <div className="bg-rose-50 border-2 border-rose-200 rounded-lg p-6">
              <h3 className="font-black text-rose-800 mb-2">📝 Tin Tuyển Dụng</h3>
              <p className="text-sm text-slate-600">
                Đăng tin tuyển dụng với tiêu đề, lương, kỹ năng, phúc lợi, điều kiện
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FormDemo;
