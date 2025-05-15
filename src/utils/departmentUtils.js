// src/utils/departmentUtils.js - VT departman isimleri ile uyumlu düzeltilmiş version
// Departman yönetimi için yardımcı fonksiyonlar

export const ROLE_PERMISSIONS = {
  ADMIN: ['all'],
  Yazilim: ['yazilim.*', 'chat', 'profile'], // "YAZILIM" -> "Yazilim"
  CRM: ['crm.*', 'chat', 'profile'],
  GRAFIK: ['grafik.*', 'chat', 'profile'],
  SOSYAL_MEDYA: ['sosyal-medya.*', 'chat', 'profile'],
  IK: ['ik.*', 'chat', 'profile']
};

/**
 * Kullanıcının belirli bir route'a erişip erişemeyeceğini kontrol eder
 * @param {string} userDepartment - Kullanıcının departmanı
 * @param {boolean} isAdmin - Kullanıcının admin olup olmadığı
 * @param {string} route - Kontrol edilecek route
 * @returns {boolean} - Erişim izni var mı?
 */
export const hasRouteAccess = (userDepartment, isAdmin, route) => {
  if (isAdmin) return true;
  
  const permissions = ROLE_PERMISSIONS[userDepartment] || [];
  
  // Exact match kontrolü
  if (permissions.includes(route)) return true;
  
  // Wildcard kontrolü
  const wildcardPermissions = permissions.filter(p => p.includes('*'));
  for (const permission of wildcardPermissions) {
    const prefix = permission.replace('*', '');
    if (route.startsWith(prefix)) return true;
  }
  
  return false;
};

/**
 * Kullanıcının departmanına göre landing page'i döndürür
 * @param {string} userDepartment - Kullanıcının departmanı
 * @param {boolean} isAdmin - Kullanıcının admin olup olmadığı
 * @returns {string} - Yönlendirilecek route
 */
export const getLandingPage = (userDepartment, isAdmin) => {
  if (isAdmin) return '/admin/dashboard';
  
  // Null/undefined check ekle
  if (!userDepartment) return '/chat';
  
  const landingPages = {
    'Yazilim': '/yazilim/dashboard', // "Yazılım" -> "Yazilim"
    'CRM': '/crm/dashboard',
    'Grafik': '/grafik/dashboard',
    'Sosyal Medya': '/sosyal-medya/dashboard',
    'İk': '/ik/dashboard',
    'Admin': '/admin/dashboard' // Admin departmanı için de mapping ekle
  };
  
  console.log('getLandingPage - userDepartment:', userDepartment); // Debug için
  console.log('getLandingPage - isAdmin:', isAdmin); // Debug için
  const landingPage = landingPages[userDepartment] || '/chat';
  console.log('getLandingPage - returning:', landingPage); // Debug için
  
  return landingPage;
};

/**
 * Departman bazlı feature flag'leri kontrol eder
 * @param {string} userDepartment - Kullanıcının departmanı
 * @param {string} feature - Kontrol edilecek feature
 * @returns {boolean} - Feature aktif mi?
 */
export const hasFeatureAccess = (userDepartment, feature) => {
  if (!userDepartment) return false;
  
  const departmentFeatures = {
    'Yazilim': ['code-test', 'deployment', 'git-integration'], // "Yazılım" -> "Yazilim"
    'CRM': ['customer-analytics', 'lead-scoring'],
    'Grafik': ['asset-library', 'brand-guidelines'],
    'Sosyal Medya': ['campaign-scheduler', 'social-analytics'],
    'İk': ['employee-portal', 'recruitment-pipeline']
  };
  
  const features = departmentFeatures[userDepartment] || [];
  return features.includes(feature);
};

/**
 * Kullanıcı oturumunu başlatır ve departman bilgilerini ayarlar
 * @param {Object} loginResponse - Login API'den gelen yanıt
 */
export const initializeUserSession = (loginResponse) => {
  try {
    const { token, username, isAdmin, userid, department } = loginResponse;
    
    // Null/undefined check
    if (!token || !username) {
      throw new Error('Invalid login response');
    }
    
    console.log('initializeUserSession - department from API:', department); // Debug için
    
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("isAdmin", String(isAdmin)); // Boolean'ı string'e çevir
    localStorage.setItem("userId", String(userid));
    localStorage.setItem("userDepartment", department || "General");
    
    // Debug için localStorage kontrol et
    console.log('initializeUserSession - stored department:', localStorage.getItem("userDepartment"));
    
    // Departman bazlı ek ayarları yükle
    const departmentSettings = getDepartmentSettings(department);
    localStorage.setItem("departmentSettings", JSON.stringify(departmentSettings));
  } catch (error) {
    console.error('Error initializing user session:', error);
    throw error;
  }
};

/**
 * Departman bazlı ayarları döndürür
 * @param {string} department - Departman adı
 * @returns {Object} - Departman ayarları
 */
export const getDepartmentSettings = (department) => {
  if (!department) {
    return {
      theme: 'default',
      defaultLayout: 'standard',
      features: [],
      dashboardWidgets: []
    };
  }
  
  const departmentConfigs = {
    'Yazilim': { // "Yazılım" -> "Yazilim"
      theme: 'developer',
      defaultLayout: 'code-focused',
      features: ['code-test', 'git-integration', 'deployment'],
      dashboardWidgets: ['recent-commits', 'active-branches', 'deployment-status']
    },
    'CRM': {
      theme: 'sales',
      defaultLayout: 'customer-focused',
      features: ['customer-analytics', 'lead-management'],
      dashboardWidgets: ['sales-pipeline', 'customer-insights', 'lead-score']
    },
    'Grafik': {
      theme: 'creative',
      defaultLayout: 'visual-focused',
      features: ['asset-management', 'design-tools'],
      dashboardWidgets: ['recent-designs', 'asset-library', 'brand-colors']
    },
    'Admin': {
      theme: 'admin',
      defaultLayout: 'management-focused',
      features: ['user-management', 'system-analytics', 'reports'],
      dashboardWidgets: ['user-stats', 'system-health', 'activity-logs']
    }
    // Diğer departmanlar...
  };
  
  return departmentConfigs[department] || {
    theme: 'default',
    defaultLayout: 'standard',
    features: [],
    dashboardWidgets: []
  };
};

/**
 * Kullanıcının mevcut departman ayarlarını döndürür
 * @returns {Object} - Departman ayarları
 */
export const getCurrentDepartmentSettings = () => {
  try {
    const settingsStr = localStorage.getItem("departmentSettings");
    return settingsStr ? JSON.parse(settingsStr) : null;
  } catch (error) {
    console.error('Error parsing department settings:', error);
    return null;
  }
};

/**
 * Departman değişikliği durumunda gerekli cleanup işlemlerini yapar
 */
export const cleanupUserSession = () => {
  const keysToRemove = [
    "token", "username", "isAdmin", "userId", 
    "userDepartment", "departmentSettings"
  ];
  
  keysToRemove.forEach(key => localStorage.removeItem(key));
};