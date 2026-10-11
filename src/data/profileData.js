/**
 * Profile Data Export Layer
 * Single Source of Truth: src/data/profileData.json or decrypted vault payload
 * Automatically calculates total career experience dynamically from experiences array.
 * Filters projects based on "visible": true/false (or "show" / "hidden")
 */
import defaultProfileData from './profileData.json';
import avatarSvg from '../assets/avatar.svg';
import bannerSvg from '../assets/banner.svg';

// Dynamic eager glob resolution for the encrypted vault payload
// Allows clean builds even when profileData.enc.json is gitignored in the public repo
const encModules = import.meta.glob('./profileData.enc.json', { eager: true });
export const encryptedProfilePayload = encModules['./profileData.enc.json']?.default || null;

// Public repository contains only the public template; decrypted data is loaded into memory upon unlocking
const initialRawData = defaultProfileData;

const monthMap = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

export const parseDateString = (str) => {
  if (!str || typeof str !== 'string' || str.trim().toLowerCase() === 'present') {
    return new Date();
  }
  const parts = str.trim().split(/\s+/);
  if (parts.length >= 2) {
    const mStr = parts[0].slice(0, 3).toLowerCase();
    const m = monthMap[mStr] ?? 0;
    const y = parseInt(parts[1], 10);
    return new Date(y, m, 1);
  }
  const y = parseInt(str, 10);
  if (!isNaN(y)) {
    return new Date(y, 0, 1);
  }
  return new Date();
};

/**
 * Calculates total career experience dynamically based on all roles in experiences.
 */
export const calculateCareerStats = (experiences = []) => {
  if (!experiences || experiences.length === 0) {
    return {
      years: 0,
      months: 0,
      totalMonths: 0,
      experienceYears: '0+ Years',
      experienceYearsLower: '0+ years',
      specializationBadge: 'Enterprise Delivery',
    };
  }

  let earliest = new Date();
  let hasCurrent = false;
  let latestEnd = new Date(1970, 0, 1);

  experiences.forEach((exp) => {
    if (exp.startDate) {
      const start = parseDateString(exp.startDate);
      if (start < earliest) {
        earliest = start;
      }
    }
    if (exp.current || !exp.endDate || exp.endDate.trim().toLowerCase() === 'present') {
      hasCurrent = true;
    } else if (exp.endDate) {
      const end = parseDateString(exp.endDate);
      if (end > latestEnd) {
        latestEnd = end;
      }
    }
  });

  const endDate = hasCurrent ? new Date() : (latestEnd > earliest ? latestEnd : new Date());

  let totalMonths = (endDate.getFullYear() - earliest.getFullYear()) * 12 + (endDate.getMonth() - earliest.getMonth());
  if (totalMonths < 0) totalMonths = 0;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const experienceYears = `${years}+ Years`;
  const experienceYearsLower = `${years}+ years`;
  const specializationBadge = `${years}+ Years Enterprise Experience`;

  return {
    years,
    months,
    totalMonths,
    experienceYears,
    experienceYearsLower,
    specializationBadge,
    earliestStartDate: earliest,
  };
};

/**
 * Calculates human-readable duration between two date strings (e.g. 'Jul 2026' and 'Present' -> '3 mos')
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate) return '';
  const start = parseDateString(startDate);
  const end = parseDateString(endDate);

  const startParts = String(startDate).trim().split(/\s+/);
  const endParts = String(endDate || '').trim().split(/\s+/);
  const isYearOnly =
    startParts.length === 1 &&
    !isNaN(parseInt(startParts[0], 10)) &&
    (endDate?.toLowerCase() === 'present' || (endParts.length === 1 && !isNaN(parseInt(endParts[0], 10))));

  if (isYearOnly && endDate?.toLowerCase() !== 'present') {
    const diffYears = parseInt(endParts[0], 10) - parseInt(startParts[0], 10);
    if (diffYears <= 0) return '1 yr';
    return diffYears === 1 ? '1 yr' : `${diffYears} yrs`;
  }

  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth()) +
    1;
  if (totalMonths < 1) totalMonths = 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'yr' : 'yrs'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ') || '1 mo';
};

const isProjectVisible = (p) => p.visible !== false && p.show !== false && !p.hidden;

/**
 * Transforms raw profile json data into fully derived display model
 */
export const processProfileData = (rawJson) => {
  if (!rawJson) return {};
  const careerStats = calculateCareerStats(rawJson.experiences || []);

  const dynamicPersonal = {
    ...rawJson.personal,
    avatar: (rawJson.personal?.avatar && rawJson.personal.avatar !== './avatar.svg')
      ? rawJson.personal.avatar
      : avatarSvg,
    coverImage: (rawJson.personal?.coverImage && rawJson.personal.coverImage !== './banner.svg')
      ? rawJson.personal.coverImage
      : bannerSvg,
    email: (rawJson.personal?.email || '').replace(/^mailto:/i, '').trim(),
    experienceYears: rawJson.personal?.experienceYears || careerStats.experienceYears,
    specializationBadge: rawJson.personal?.specializationBadge || careerStats.specializationBadge,
    about: rawJson.personal?.about
      ? rawJson.personal.about.replace(
          /\b\d+\+?\s+years(\s+of\s+experience)?\b/gi,
          (match) => match.toLowerCase().includes('of experience')
            ? `${careerStats.experienceYearsLower} of experience`
            : careerStats.experienceYearsLower
        )
      : '',
  };

  const dynamicStats = (rawJson.stats || []).map((stat) => {
    if (stat.label === 'Industry Experience') {
      return {
        ...stat,
        value: careerStats.experienceYears,
      };
    }
    return stat;
  });

  const dynamicExperiences = (rawJson.experiences || []).map((exp) => ({
    ...exp,
    duration: exp.duration || calculateDuration(exp.startDate, exp.endDate),
  }));

  const dynamicProjects = (rawJson.projects || []).map((proj) => ({
    ...proj,
    duration: proj.duration || (proj.startDate ? calculateDuration(proj.startDate, proj.endDate) : undefined),
  }));

  return {
    ...rawJson,
    security: {
      enableCopyPaste: false,
      ...rawJson.security,
    },
    careerStats,
    personal: dynamicPersonal,
    stats: dynamicStats,
    experiences: dynamicExperiences,
    projects: dynamicProjects.filter(isProjectVisible),
    allProjects: dynamicProjects,
  };
};

// Mutable exported single instance for zero-refactor component compatibility
export const profileData = {
  ...processProfileData(initialRawData)
};

/**
 * In-place mutation when decrypted in browser memory
 */
export const setDecryptedProfileData = (decryptedJson) => {
  const processed = processProfileData(decryptedJson);
  Object.keys(profileData).forEach((key) => delete profileData[key]);
  Object.assign(profileData, processed);
  return profileData;
};

/**
 * Resets profile data back to public template
 */
export const resetToDefaultProfileData = () => {
  const processed = processProfileData(defaultProfileData);
  Object.keys(profileData).forEach((key) => delete profileData[key]);
  Object.assign(profileData, processed);
  return profileData;
};

export default profileData;
