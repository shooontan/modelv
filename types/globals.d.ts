interface Window {
  cv: OpenCVJS;
  gtag: GTag;
}

declare namespace NodeJS {
  interface ProcessEnv {
    APP_URL: string;
    APP_TITLE: string;
    APP_DESCRIPTION: string;

    GOOGLE_ANALYTICS_MEASUREMENT_ID: string;
  }
}
