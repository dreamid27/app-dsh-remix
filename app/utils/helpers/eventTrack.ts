import posthog from "posthog-js";

export const eventPosthog = (eventName: string, prop?: any) => {
  posthog.capture(eventName, prop);
};

export const eventPosthogV2 = (eventName: string, prop?: any) => {
  eventPosthog(eventName, {
    ...prop,
    version: 2,
  });
};
