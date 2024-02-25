import { createContext, useContext, useEffect, useRef, useState } from "react";

import { useRouter } from "next/router";
import WatchNow from "../../extensions/watchNow";

const extensionContext = createContext(null);

export const useExtension = () => {
  return useContext(extensionContext);
};

export function ExtensionProvider({ children }) {
  const extensions = useRef([]);
  const router = useRouter();

  const [extensionPageState, setExtensionPageState] = useState(null);

  function loadExtension(...exts) {
    exts.forEach((ext) => {
      if (!extensions.current.find((e) => e.id === ext.id)) {
        extensions.current.push(ext);
      }
    });
  }

  function executeCallbacks() {
    if (window.extensionCallbacksExecuted) return;
    const pageName = router.pathname.split("/")[1];
    const callbacks = window.extensionPageCallbacks?.[pageName] ?? [];
    console.log(callbacks);
    window.extensionCallbacksExecuted = true;
    callbacks.forEach(({ id: extensionId, callback }) => {
      const page = {
        params: router.query,
        addElement: (type, opts) => {
          setExtensionPageState((prev) => {
            return {
              ...prev,
              [pageName]: {
                pageElements: [
                  ...(prev?.[pageName]?.pageElements ?? []),
                  { extensionId, type, opts },
                ],
              },
            };
          });
        },
      };
      callback(page);
    });
  }

  useEffect(() => {
    const watchNowExtension = new WatchNow();
    loadExtension(watchNowExtension);
    executeCallbacks();
  }, []);

  function extensionElements() {
    const pageName = router.pathname.split("/")[1];
    return extensionPageState?.[pageName]?.pageElements ?? [];
  }

  return (
    <extensionContext.Provider value={{ extensionElements }}>
      {children}
    </extensionContext.Provider>
  );
}
