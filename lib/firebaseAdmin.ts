import admin from 'firebase-admin';

// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK_SA_KEY || '{}');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Firebase Admin initialization error', error.message);
    } else {
      console.error('Firebase Admin initialization error', String(error));
    }
  }
}

const getServerConfig = async () => {
    try {
      const remoteConfig = admin.remoteConfig();
      const template = await remoteConfig.getServerTemplate({
        defaultConfig: {
          model_name: 'gemini-1.5-flash-latest'
        }
      });
      return template.evaluate(); // or the entire template if needed
    } catch (error) {
      console.error('Error fetching Server Config:', error);
      return null;
    }
}

export { admin, getServerConfig };
