import { invoke } from '@tauri-apps/api/core';

/**
 * Get the application version from Cargo.toml
 */
export async function getAppVersion(): Promise<string> {
  return invoke<string>('get_app_version');
}

export const versionService = {
  getAppVersion,
};
