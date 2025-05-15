// src/Routes/DepartmentRouter.js - Düzeltilmiş version
import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { getDefaultRedirect, DEPARTMENTS } from '../config/departments';

// Import department-specific components
import AdminDashboard from '../Pages/Dashboard'; // Mevcut dashboard admin içindir
import YazilimDashboard from '../Pages/Departments/Yazilim/Dashboard';
// import CrmDashboard from '../Pages/Departments/CRM/Dashboard';
// import GrafikDashboard from '../Pages/Departments/Grafik/Dashboard';
// import SocialMediaDashboard from '../Pages/Departments/SocialMedia/Dashboard';
// import IkDashboard from '../Pages/Departments/IK/Dashboard';

// İleride eklenecek componentler için placeholder
import CodeTest from '../Pages/Departments/Yazilim/CodeTest';
// import Projects from '../Pages/Departments/Yazilim/Projects';
// import Deployment from '../Pages/Departments/Yazilim/Deployment';

// Chat component (ortak kullanım)
import Chat from '../Pages/Chat/Chat';

// Department Router - kullanıcının departmanına göre yönlendirme yapar
const DepartmentRouter = () => {
  // useMemo ile değerleri memoize et
  const { userDepartment, isAdmin, defaultPath } = useMemo(() => {
    const dept = localStorage.getItem("userDepartment");
    const admin = localStorage.getItem("isAdmin") === "true";
    const path = admin ? "/admin/dashboard" : getDefaultRedirect(dept);
    
    return {
      userDepartment: dept,
      isAdmin: admin,
      defaultPath: path
    };
  }, []);

  // Admin kullanıcıyı her zaman admin dashboard'a yönlendir
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Normal kullanıcıları departmanlarına göre yönlendir
  return <Navigate to={defaultPath} replace />;
};

// Protected Route Wrapper - departman bazlı erişim kontrolü
export const DepartmentProtectedRoute = ({ children, allowedDepartments = [], requireAdmin = false }) => {
  // useMemo ile permission check'i optimize et
  const hasAccess = useMemo(() => {
    const token = localStorage.getItem("token");
    const userDepartment = localStorage.getItem("userDepartment");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    
    // Token yoksa erişim yok
    if (!token) return { access: false, redirect: "/login" };
    
    // Admin gerekiyorsa ve kullanıcı admin değilse
    if (requireAdmin && !isAdmin) {
      return { access: false, redirect: "/chat" };
    }
    
    // Belirli departmanlar gerekiyorsa ve kullanıcı o departmanda değilse
    if (allowedDepartments.length > 0 && !allowedDepartments.includes(userDepartment) && !isAdmin) {
      const defaultPath = getDefaultRedirect(userDepartment);
      return { access: false, redirect: defaultPath };
    }
    
    return { access: true };
  }, [allowedDepartments, requireAdmin]);

  if (!hasAccess.access) {
    return <Navigate to={hasAccess.redirect} replace />;
  }
  
  return children;
};

// Component mapping - ileride dynamic import için kullanılabilir
export const componentMap = {
  AdminDashboard,
  YazilimDashboard,
  // CrmDashboard,
  // GrafikDashboard,
  // SocialMediaDashboard,
  // IkDashboard,
  Chat,
  CodeTest,
  // Projects,
  // Deployment,
  // Yeni componentler buraya eklenecek...
};

export default DepartmentRouter;