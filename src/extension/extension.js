export function onPage(extensionId, pageName, callback) {
  if (!window.extensionPageCallbacks) window.extensionPageCallbacks = {};

  window.extensionPageCallbacks[pageName] = [
    ...(window?.extensionPageCallbacks?.[pageName] ?? []),
    { id: extensionId, callback },
  ];
}
