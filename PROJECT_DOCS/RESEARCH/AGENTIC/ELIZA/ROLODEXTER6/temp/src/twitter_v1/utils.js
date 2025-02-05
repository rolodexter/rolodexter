// // utils.js
// import fs from 'fs';
// import Logger from './Logger.js';

// export async function loadCookies(cookiesPath) {
//   try {
//     if (fs.existsSync(cookiesPath)) {
//       const cookiesData = fs.readFileSync(cookiesPath, 'utf8');
//       return JSON.parse(cookiesData);
//     }
//   } catch (error) {
//     Logger.warn(`⚠️ Error loading cookies: ${error.message}`);
//   }
//   return null;
// }

// export async function saveCookies(cookiesPath, cookies) {
//   try {
//     fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 2));
//     Logger.success('✅ Cookies saved successfully');
//   } catch (error) {
//     Logger.error(`❌ Error saving cookies: ${error.message}`);
//   }
// }
