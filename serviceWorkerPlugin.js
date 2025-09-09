import fs from 'fs';
import path from 'path';

export function serviceWorkerPlugin() {
  let config = null;
  
  return {
    name: 'service-worker-env',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      // Generate the file for development
      generateServiceWorkerFile(config);
    },
    generateBundle() {
      // Generate the file for production build
      generateServiceWorkerFile(config, this);
    }
  };
}

function generateServiceWorkerFile(config, context = null) {
  try {
    // Read the template file
    const templatePath = path.resolve('src/firebase-messaging-sw.template.js');
    let template = fs.readFileSync(templatePath, 'utf-8');
    
    // Get environment variables from config
    const env = config?.env || {};
    
    // Replace placeholders with environment variables
    const replacements = {
      '__VITE_FIREBASE_API_KEY__': env.VITE_FIREBASE_API_KEY || '',
      '__VITE_FIREBASE_AUTH_DOMAIN__': env.VITE_FIREBASE_AUTH_DOMAIN || '',
      '__VITE_FIREBASE_PROJECT_ID__': env.VITE_FIREBASE_PROJECT_ID || '',
      '__VITE_FIREBASE_STORAGE_BUCKET__': env.VITE_FIREBASE_STORAGE_BUCKET || '',
      '__VITE_FIREBASE_MESSAGING_SENDER_ID__': env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      '__VITE_FIREBASE_APP_ID__': env.VITE_FIREBASE_APP_ID || ''
    };

    Object.entries(replacements).forEach(([placeholder, value]) => {
      template = template.replace(new RegExp(placeholder, 'g'), value);
    });

    // Log for debugging
    console.log('Service Worker Environment Variables:');
    Object.entries(replacements).forEach(([key, value]) => {
      console.log(`${key}: ${value ? 'SET' : 'MISSING'}`);
    });

    if (context) {
      // Production build - emit as asset
      context.emitFile({
        type: 'asset',
        fileName: 'firebase-messaging-sw.js',
        source: template
      });
      console.log('Service worker emitted for production build');
    } else {
      // Development - write to public directory
      const publicDir = path.resolve('public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, 'firebase-messaging-sw.js'), template);
      console.log('Service worker generated in public directory');
    }
  } catch (error) {
    console.error('Error generating service worker:', error);
  }
}