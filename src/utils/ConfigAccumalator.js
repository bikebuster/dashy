/**
 * Reads the users config from `conf.yml`, and combines it with any local preferences
 * Also ensures that any missing attributes are populated with defaults, and the
 * object is structurally sound, to avoid any error if the user is missing something
 * The main config object is make up of three parts: appConfig, pageInfo and sections
 */
import Defaults, { localStorageKeys } from '@/utils/defaults';
import conf from '../../public/conf.yml';

export const appConfig = (() => {
  if (localStorage[localStorageKeys.APP_CONFIG]) {
    return JSON.parse(localStorage[localStorageKeys.APP_CONFIG]);
  } else if (conf.appConfig) {
    return conf.appConfig;
  } else {
    return Defaults.appConfig;
  }
})();

export const pageInfo = (() => {
  const defaults = Defaults.pageInfo;
  let localPageInfo;
  try {
    localPageInfo = JSON.parse(localStorage[localStorageKeys.PAGE_INFO]);
  } catch (e) {
    localPageInfo = {};
  }
  const pi = conf.pageInfo || defaults; // The page info object to return
  pi.title = localPageInfo.title || conf.pageInfo.title || defaults.title;
  pi.description = localPageInfo.description || conf.pageInfo.description || defaults.description;
  pi.navLinks = localPageInfo.navLinks || conf.pageInfo.navLinks || defaults.navLinks;
  pi.footerText = localPageInfo.footerText || conf.pageInfo.footerText || defaults.footerText;
  return pi;
})();

export const sections = (() => {
  // If the user has stored sections in local storage, return those
  const localSections = localStorage[localStorageKeys.CONF_SECTIONS];
  if (localSections) {
    try {
      const json = JSON.parse(localSections);
      if (json.length >= 1) return json;
    } catch (e) {
      // The data in local storage has been malformed, will return conf.sections instead
    }
  }
  // If the function hasn't yet returned, then return the config file sections
  return conf.sections;
})();

export const config = (() => {
  const result = {
    appConfig,
    pageInfo,
    sections,
  };
  return result;
})();
