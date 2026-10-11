import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { routesConfig } from './routesConfig';
import { HomePage } from '../pages/HomePage';

/**
 * Application Routing Switch
 * Dynamically renders components from routesConfig definitions fresh on each mount.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {routesConfig.map((route) => {
        const RouteComponent = route.Component || route.element?.type || HomePage;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={<RouteComponent />}
          />
        );
      })}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
