import React from 'react';

const FormStep = ({ title, subtitle, children }) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-800">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-400 font-semibold">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
};

export default FormStep;
