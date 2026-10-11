import React from 'react';
import { User, Briefcase, Layers, Cpu, Award, Mail } from 'lucide-react';
import { HomePage } from '../pages/HomePage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { EducationPage } from '../pages/EducationPage';
import { SkillsPage } from '../pages/SkillsPage';
import { ContactPage } from '../pages/ContactPage';

/**
 * Declarative Route Definitions
 * Single source of truth for application routing and navigation menus.
 * Uses dynamic Component references rather than static pre-rendered JSX elements
 * to ensure components re-evaluate fresh profileData upon authentication.
 */
export const routesConfig = [
  {
    path: '/',
    name: 'Overview',
    icon: User,
    Component: HomePage,
    nav: true,
  },
  {
    path: '/projects',
    name: 'Projects',
    icon: Layers,
    Component: ProjectsPage,
    nav: true,
  },
  {
    path: '/experience',
    name: 'Experience',
    icon: Briefcase,
    Component: ExperiencePage,
    nav: true,
  },
  {
    path: '/education',
    name: 'Certifications',
    icon: Award,
    Component: EducationPage,
    nav: true,
  },
  {
    path: '/skills',
    name: 'Skills & Tools',
    icon: Cpu,
    Component: SkillsPage,
    nav: true,
  },
  {
    path: '/contact',
    name: 'Contact Us',
    icon: Mail,
    Component: ContactPage,
    nav: true,
  },
];

export const navRoutes = routesConfig.filter(route => route.nav);
