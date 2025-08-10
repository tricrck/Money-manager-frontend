import fs from 'fs';
import path from 'path';

export function serviceWorkerPlugin() {
  return {
    name: 'service-worker-env',
    generateBundle(options, bundle) {
      // Read the template file
      const templatePath = path.resolve('src/firebase-messaging-sw.template.js');
      let template = fs.readFileSync(templatePath, 'utf-8');
      
      template = template.replace(/__VITE_FIREBASE_API_KEY__/g, process.env.VITE_FIREBASE_API_KEY || '');
      template = template.replace(/__VITE_FIREBASE_AUTH_DOMAIN__/g, process.env.VITE_FIREBASE_AUTH_DOMAIN || '');
      template = template.replace(/__VITE_FIREBASE_PROJECT_ID__/g, process.env.VITE_FIREBASE_PROJECT_ID || '');
      template = template.replace(/__VITE_FIREBASE_STORAGE_BUCKET__/g, process.env.VITE_FIREBASE_STORAGE_BUCKET || '');
      template = template.replace(/__VITE_FIREBASE_MESSAGING_SENDER_ID__/g, process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '');
      template = template.replace(/__VITE_FIREBASE_APP_ID__/g, process.env.VITE_FIREBASE_APP_ID || '');

      
      // Add the processed service worker to the bundle
      this.emitFile({
        type: 'asset',
        fileName: 'firebase-messaging-sw.js',
        source: template
      });
    }
  };
}