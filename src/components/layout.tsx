import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout" data-oid="-67fhzd">
      {children}
    </div>
  );
};

export default Layout;
