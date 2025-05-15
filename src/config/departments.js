// src/config/departments.js - Düzeltilmiş version (departman isimleri VT ile uyumlu)
// Bu dosya her departmanın sidebar menu ve route yapılandırmalarını içerir

export const DEPARTMENTS = {
  ADMIN: 'Admin',
  CRM: 'CRM',
  YAZILIM: 'Yazilim', // Değişiklik: "Yazılım" -> "Yazilim" (VT'deki ile aynı)
  GRAFIK: 'Grafik',
  SOSYAL_MEDYA: 'Sosyal Medya',
  IK: 'İk',
  // Yeni departmanlar buraya eklenebilir
};

// Her departman için sidebar menu yapılandırması
export const departmentMenus = {
  [DEPARTMENTS.ADMIN]: [
    {
      section: 'Yönetim',
      items: [
        {
          path: '/admin/dashboard',
          label: 'Admin Dashboard',
          icon: '📊',
          component: 'AdminDashboard'
        },
        {
          path: '/chat',
          label: 'AI Chat',
          icon: '💬',
          component: 'Chat'
        },
        {
          path: '/admin/users',
          label: 'Kullanıcı Yönetimi',
          icon: '👥',
          component: 'UserManagement'
        },
        {
          path: '/admin/reports',
          label: 'Raporlar',
          icon: '📈',
          component: 'Reports'
        }
      ]
    },
    {
      section: 'Sistem',
      items: [
        {
          path: '/admin/settings',
          label: 'Sistem Ayarları',
          icon: '⚙️',
          component: 'SystemSettings'
        }
      ]
    }
  ],

  // Değişiklik: Key "Yazılım" -> "Yazilim" olarak güncellendi
  [DEPARTMENTS.YAZILIM]: [
    {
      section: 'Geliştirme',
      items: [
        {
          path: '/yazilim/dashboard',
          label: 'Yazılım Dashboard',
          icon: '📊',
          component: 'YazilimDashboard'
        },
        {
          path: '/chat',
          label: 'AI Chat',
          icon: '💬',
          component: 'Chat'
        },
        {
          path: '/yazilim/code-test',
          label: 'AI Kod Testi',
          icon: '🧪',
          component: 'CodeTest'
        },
        {
          path: '/yazilim/projects',
          label: 'Projeler',
          icon: '📁',
          component: 'Projects'
        }
      ]
    },
    {
      section: 'Araçlar',
      items: [
        {
          path: '/yazilim/deployment',
          label: 'Deployment',
          icon: '🚀',
          component: 'Deployment'
        }
      ]
    }
  ],

  [DEPARTMENTS.CRM]: [
    {
      section: 'Müşteri Yönetimi',
      items: [
        {
          path: '/crm/dashboard',
          label: 'CRM Dashboard',
          icon: '📊',
          component: 'CrmDashboard'
        },
        {
          path: '/chat',
          label: 'AI Chat',
          icon: '💬',
          component: 'Chat'
        },
        {
          path: '/crm/customers',
          label: 'Müşteriler',
          icon: '👥',
          component: 'Customers'
        },
        {
          path: '/crm/leads',
          label: 'Potansiyel Müşteriler',
          icon: '🎯',
          component: 'Leads'
        }
      ]
    },
    {
      section: 'Analiz',
      items: [
        {
          path: '/crm/analytics',
          label: 'Müşteri Analitiği',
          icon: '📈',
          component: 'CrmAnalytics'
        }
      ]
    }
  ],

  [DEPARTMENTS.GRAFIK]: [
    {
      section: 'Tasarım',
      items: [
        {
          path: '/grafik/dashboard',
          label: 'Grafik Dashboard',
          icon: '📊',
          component: 'GrafikDashboard'
        },
        {
          path: '/chat',
          label: 'AI Chat',
          icon: '💬',
          component: 'Chat'
        },
        {
          path: '/grafik/projects',
          label: 'Tasarım Projeleri',
          icon: '🎨',
          component: 'DesignProjects'
        },
        {
          path: '/grafik/assets',
          label: 'Görsel Arşivi',
          icon: '🖼️',
          component: 'AssetLibrary'
        }
      ]
    }
  ],

  [DEPARTMENTS.SOSYAL_MEDYA]: [
    {
      section: 'Sosyal Medya',
      items: [
        {
          path: '/sosyal-medya/dashboard',
          label: 'Sosyal Medya Dashboard',
          icon: '📊',
          component: 'SocialMediaDashboard'
        },
        {
          path: '/chat',
          label: 'AI Chat',
          icon: '💬',
          component: 'Chat'
        },
        {
          path: '/sosyal-medya/campaigns',
          label: 'Kampanyalar',
          icon: '📢',
          component: 'Campaigns'
        },
        {
          path: '/sosyal-medya/analytics',
          label: 'Analitik',
          icon: '📈',
          component: 'SocialAnalytics'
        }
      ]
    }
  ],

  [DEPARTMENTS.IK]: [
    {
      section: 'İnsan Kaynakları',
      items: [
        {
          path: '/ik/dashboard',
          label: 'İK Dashboard',
          icon: '📊',
          component: 'IkDashboard'
        },
        {
          path: '/chat',
          label: 'AI Chat',
          icon: '💬',
          component: 'Chat'
        },
        {
          path: '/ik/employees',
          label: 'Çalışanlar',
          icon: '👥',
          component: 'Employees'
        },
        {
          path: '/ik/recruitment',
          label: 'İşe Alım',
          icon: '📝',
          component: 'Recruitment'
        }
      ]
    }
  ]
};

// Default yönlendirmeler (kullanıcı departmanına göre)
export const defaultRedirects = {
  [DEPARTMENTS.ADMIN]: '/admin/dashboard',
  [DEPARTMENTS.YAZILIM]: '/yazilim/dashboard', // Burada da güncellendi
  [DEPARTMENTS.CRM]: '/crm/dashboard',
  [DEPARTMENTS.GRAFIK]: '/grafik/dashboard',
  [DEPARTMENTS.SOSYAL_MEDYA]: '/sosyal-medya/dashboard',
  [DEPARTMENTS.IK]: '/ik/dashboard'
};

// Yardımcı fonksiyonlar
export const getDepartmentMenu = (department) => {
  console.log('getDepartmentMenu called with:', department); // Debug için
  const menu = departmentMenus[department] || [];
  console.log('Returned menu:', menu); // Debug için
  return menu;
};

export const getDefaultRedirect = (department) => {
  console.log('getDefaultRedirect called with:', department); // Debug için
  const redirect = defaultRedirects[department] || '/chat';
  console.log('Returned redirect:', redirect); // Debug için
  return redirect;
};

export const getDepartmentIcon = (department) => {
  const icons = {
    [DEPARTMENTS.ADMIN]: '👑',
    [DEPARTMENTS.YAZILIM]: '💻', // Burada da güncellendi
    [DEPARTMENTS.CRM]: '🤝',
    [DEPARTMENTS.GRAFIK]: '🎨',
    [DEPARTMENTS.SOSYAL_MEDYA]: '📱',
    [DEPARTMENTS.IK]: '👥'
  };
  console.log('getDepartmentIcon called with:', department); // Debug için
  const icon = icons[department] || '🏢';
  console.log('Returned icon:', icon); // Debug için
  return icon;
};