// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Vietnam format)
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

// Required field
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== null && value !== undefined;
};

// Min length
export const validateMinLength = (value, min) => {
  return value.toString().length >= min;
};

// Max length
export const validateMaxLength = (value, max) => {
  return value.toString().length <= max;
};

// Password validation (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Date validation
export const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// Date not in future
export const validateDateNotFuture = (dateString) => {
  const date = new Date(dateString);
  return date <= new Date();
};

// URL validation
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Tax ID validation (Vietnam)
export const validateTaxId = (taxId) => {
  return /^[0-9]{10}(-[0-9]{3})?$/.test(taxId);
};

// GPA validation (0-4.0 or 0-10)
export const validateGpa = (gpa) => {
  const num = parseFloat(gpa);
  return !isNaN(num) && num >= 0 && num <= 10;
};

// Salary validation
export const validateSalary = (salary) => {
  const num = parseFloat(salary);
  return !isNaN(num) && num > 0;
};

// ===== APPLICANT FORM VALIDATION =====

export const validatePersonalInfo = (data) => {
  const errors = {};

  if (!validateRequired(data.fullName)) {
    errors.fullName = 'Họ tên không được để trống';
  } else if (!validateMinLength(data.fullName, 3)) {
    errors.fullName = 'Họ tên phải ít nhất 3 ký tự';
  } else if (!validateMaxLength(data.fullName, 100)) {
    errors.fullName = 'Họ tên không được quá 100 ký tự';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email không được để trống';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!validateRequired(data.phone)) {
    errors.phone = 'Số điện thoại không được để trống';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  if (!validateRequired(data.dateOfBirth)) {
    errors.dateOfBirth = 'Ngày sinh không được để trống';
  } else if (!validateDate(data.dateOfBirth)) {
    errors.dateOfBirth = 'Ngày sinh không hợp lệ';
  } else if (!validateDateNotFuture(data.dateOfBirth)) {
    errors.dateOfBirth = 'Ngày sinh không được trong tương lai';
  } else {
    const birthDate = new Date(data.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      errors.dateOfBirth = 'Bạn phải ít nhất 18 tuổi';
    }
  }

  if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
    errors.gender = 'Giới tính không hợp lệ';
  }

  return errors;
};

export const validateLocation = (data) => {
  const errors = {};

  if (!validateRequired(data.address)) {
    errors.address = 'Địa chỉ không được để trống';
  } else if (!validateMaxLength(data.address, 200)) {
    errors.address = 'Địa chỉ không được quá 200 ký tự';
  }

  if (!validateRequired(data.city)) {
    errors.city = 'Thành phố không được để trống';
  }

  return errors;
};

export const validateCareerPreferences = (data) => {
  const errors = {};

  if (!validateRequired(data.targetPositions)) {
    errors.targetPositions = 'Vui lòng chọn ít nhất 1 vị trí';
  }

  if (!validateRequired(data.targetLocations)) {
    errors.targetLocations = 'Vui lòng chọn ít nhất 1 địa điểm';
  }

  if (data.salaryExpectation) {
    if (data.salaryExpectation.min && !validateSalary(data.salaryExpectation.min)) {
      errors.salaryMin = 'Lương tối thiểu phải là số dương';
    }
    if (data.salaryExpectation.max && !validateSalary(data.salaryExpectation.max)) {
      errors.salaryMax = 'Lương tối đa phải là số dương';
    }
    if (
      data.salaryExpectation.min &&
      data.salaryExpectation.max &&
      parseFloat(data.salaryExpectation.min) > parseFloat(data.salaryExpectation.max)
    ) {
      errors.salary = 'Lương tối thiểu không được lớn hơn lương tối đa';
    }
  }

  return errors;
};

export const validateExperienceItem = (item) => {
  const errors = {};

  if (!validateRequired(item.companyName)) {
    errors.companyName = 'Tên công ty không được để trống';
  }

  if (!validateRequired(item.position)) {
    errors.position = 'Vị trí không được để trống';
  }

  if (!validateRequired(item.startDate)) {
    errors.startDate = 'Ngày bắt đầu không được để trống';
  } else if (!validateDate(item.startDate)) {
    errors.startDate = 'Ngày bắt đầu không hợp lệ';
  }

  if (!item.isCurrent) {
    if (!validateRequired(item.endDate)) {
      errors.endDate = 'Ngày kết thúc không được để trống';
    } else if (!validateDate(item.endDate)) {
      errors.endDate = 'Ngày kết thúc không hợp lệ';
    }
  }

  return errors;
};

export const validateEducationItem = (item) => {
  const errors = {};

  if (!validateRequired(item.schoolName)) {
    errors.schoolName = 'Tên trường không được để trống';
  }

  if (!validateRequired(item.degree)) {
    errors.degree = 'Bằng cấp không được để trống';
  }

  if (!validateRequired(item.field)) {
    errors.field = 'Chuyên ngành không được để trống';
  }

  if (!validateRequired(item.startDate)) {
    errors.startDate = 'Ngày bắt đầu không được để trống';
  } else if (!validateDate(item.startDate)) {
    errors.startDate = 'Ngày bắt đầu không hợp lệ';
  }

  if (!validateRequired(item.endDate)) {
    errors.endDate = 'Ngày kết thúc không được để trống';
  } else if (!validateDate(item.endDate)) {
    errors.endDate = 'Ngày kết thúc không hợp lệ';
  }

  return errors;
};

export const validateSkillItem = (item) => {
  const errors = {};

  if (!validateRequired(item.name)) {
    errors.name = 'Tên kỹ năng không được để trống';
  }

  if (!item.level || !['beginner', 'intermediate', 'advanced', 'expert'].includes(item.level)) {
    errors.level = 'Vui lòng chọn mức độ';
  }

  return errors;
};

export const validateCertificateItem = (item) => {
  const errors = {};

  if (!validateRequired(item.name)) {
    errors.name = 'Tên chứng chỉ không được để trống';
  }

  if (!validateRequired(item.issuer)) {
    errors.issuer = 'Cơ quan cấp không được để trống';
  }

  if (!validateRequired(item.issueDate)) {
    errors.issueDate = 'Ngày cấp không được để trống';
  } else if (!validateDate(item.issueDate)) {
    errors.issueDate = 'Ngày cấp không hợp lệ';
  }

  if (item.expiryDate && !validateDate(item.expiryDate)) {
    errors.expiryDate = 'Ngày hết hạn không hợp lệ';
  }

  if (item.credentialUrl && !validateUrl(item.credentialUrl)) {
    errors.credentialUrl = 'URL không hợp lệ';
  }

  return errors;
};

export const validateProjectItem = (item) => {
  const errors = {};

  if (!validateRequired(item.name)) {
    errors.name = 'Tên dự án không được để trống';
  }

  if (!validateRequired(item.role)) {
    errors.role = 'Vai trò không được để trống';
  }

  if (!validateRequired(item.startDate)) {
    errors.startDate = 'Ngày bắt đầu không được để trống';
  } else if (!validateDate(item.startDate)) {
    errors.startDate = 'Ngày bắt đầu không hợp lệ';
  }

  if (item.link && !validateUrl(item.link)) {
    errors.link = 'URL không hợp lệ';
  }

  return errors;
};

export const validateLanguageItem = (item) => {
  const errors = {};

  if (!validateRequired(item.language)) {
    errors.language = 'Tên ngôn ngữ không được để trống';
  }

  if (!item.level || !['beginner', 'intermediate', 'advanced', 'fluent'].includes(item.level)) {
    errors.level = 'Vui lòng chọn mức độ';
  }

  return errors;
};

// ===== EMPLOYER FORM VALIDATION =====

export const validateCompanyInfo = (data) => {
  const errors = {};

  if (!validateRequired(data.companyName)) {
    errors.companyName = 'Tên công ty không được để trống';
  } else if (!validateMaxLength(data.companyName, 200)) {
    errors.companyName = 'Tên công ty không được quá 200 ký tự';
  }

  if (!validateRequired(data.companyEmail)) {
    errors.companyEmail = 'Email công ty không được để trống';
  } else if (!validateEmail(data.companyEmail)) {
    errors.companyEmail = 'Email công ty không hợp lệ';
  }

  if (!validateRequired(data.phone)) {
    errors.phone = 'Số điện thoại không được để trống';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  if (data.website && !validateUrl(data.website)) {
    errors.website = 'Website không hợp lệ';
  }

  if (data.taxId && !validateTaxId(data.taxId)) {
    errors.taxId = 'Mã số thuế không hợp lệ';
  }

  return errors;
};

export const validateCompanyDetails = (data) => {
  const errors = {};

  if (!validateRequired(data.industry)) {
    errors.industry = 'Vui lòng chọn ngành nghề';
  }

  if (!data.companyType || !['startup', 'sme', 'enterprise', 'multinational'].includes(data.companyType)) {
    errors.companyType = 'Vui lòng chọn loại hình doanh nghiệp';
  }

  if (!data.employeeCount || !['under-50', '50-200', '200-500', '500-1000', '1000+'].includes(data.employeeCount)) {
    errors.employeeCount = 'Vui lòng chọn quy mô công ty';
  }

  return errors;
};

export const validateContactPerson = (data) => {
  const errors = {};

  if (!validateRequired(data.name)) {
    errors.name = 'Tên người liên hệ không được để trống';
  }

  if (!validateRequired(data.position)) {
    errors.position = 'Vị trí không được để trống';
  }

  if (!validateRequired(data.phone)) {
    errors.phone = 'Số điện thoại không được để trống';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email không được để trống';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  return errors;
};

// Combine all errors
export const combineErrors = (errors) => {
  return Object.keys(errors).length > 0 ? errors : null;
};
