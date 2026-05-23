/**
 * Content Protection Library
 * حماية محتوى الفيديو من الوصول غير المصرح
 */

/**
 * إخفاء الروابط من عناصر الـ iframe
 * Hide video URLs from iframe element inspection
 */
export const protectVideoSources = () => {
  // منع محاولات الوصول إلى الروابط عبر DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // إذا تم إضافة iframe، أضف طبقة حماية
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as Element;
            
            // إخفاء جميع خصائص src
            if (element.tagName === 'IFRAME') {
              // إنشء iframe جديد بدون src مباشر
              element.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
              
              // إزالة أي محاولة للوصول إلى src عبر DevTools
              Object.defineProperty(element, 'src', {
                get() {
                  return '*** محتوى محمي ***';
                },
                set() {
                  // إسكات أي محاولة لتعديل الـ src
                },
                configurable: false,
              });
            }

            // البحث عن عناصر source
            if (element.tagName === 'SOURCE') {
              element.removeAttribute('src');
              element.setAttribute('src', '*** حماية محتوى ***');
            }
          }
        });
      }
    });
  });

  // بدء المراقبة
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });

  return observer;
};

/**
 * منع أي محاولة للوصول إلى localStorage أو sessionStorage
 * Block attempts to access storage
 */
export const protectStorage = () => {
  const blockAccessMessage = '*** المحتوى محمي - لا يمكن الوصول إلى هذه البيانات ***';

  // منع الوصول إلى localStorage
  Object.defineProperty(window, 'localStorage', {
    get() {
      console.warn('محاولة الوصول إلى localStorage مُحظورة');
      return {
        getItem: () => blockAccessMessage,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      };
    },
  });

  // منع الوصول إلى sessionStorage
  Object.defineProperty(window, 'sessionStorage', {
    get() {
      console.warn('محاولة الوصول إلى sessionStorage مُحظورة');
      return {
        getItem: () => blockAccessMessage,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        key: () => null,
        length: 0,
      };
    },
  });
};

/**
 * منع نسخ محتوى الفيديو
 * Prevent content copying
 */
export const protectAgainstCopying = () => {
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    console.warn('نسخ المحتوى مُحظور');
  });

  document.addEventListener('cut', (e) => {
    e.preventDefault();
    console.warn('قص المحتوى مُحظور');
  });

  // منع drag & drop
  document.addEventListener('dragstart', (e) => {
    if ((e.target as HTMLElement).closest('.plyr')) {
      e.preventDefault();
    }
  });
};

/**
 * إضافة كشف التصوير
 * Detect screen recording attempts
 */
export const detectScreenCapture = (onDetected?: () => void) => {
  // محاولة كشف استخدام getDisplayMedia (screen recording)
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);

    navigator.mediaDevices.getDisplayMedia = async function (...args: any[]) {
      console.warn('⚠️ تم كشف محاولة تصوير الشاشة');
      
      // إرسال إشعار للخادم
      try {
        await fetch('/api/log-violation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'screen_capture_attempt',
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {
          // تجاهل أخطاء الشبكة
        });
      } catch {}

      if (onDetected) onDetected();

      // منع عملية التصوير بمحاولة رفضها
      throw new DOMException('الوصول مرفوض', 'NotAllowedError');
    };
  }
};

/**
 * التحقق من DevTools و منعها
 * Prevent DevTools access
 */
export const preventDevTools = () => {
  // منع الفتح بـ F12
  document.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
      console.log('%cالوصول مرفوض ❌', 'color: red; font-size: 20px; font-weight: bold;');
      return false;
    }
    return true;
  };

  // منع الفتح بـ Right Click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // كشف فتح DevTools
  let isDevToolsOpen = false;

  // طريقة 1: كشف عبر حجم الـ window
  window.addEventListener('resize', () => {
    if (window.outerHeight - window.innerHeight > 150 || 
        window.outerWidth - window.innerWidth > 150) {
      if (!isDevToolsOpen) {
        isDevToolsOpen = true;
        console.warn('⚠️ تم كشف DevTools مفتوحة');
        // يمكن إضافة إجراء إضافي هنا مثل إيقاف الفيديو
      }
    } else {
      isDevToolsOpen = false;
    }
  });

  // طريقة 2: كشف عبر console
  const originalLog = console.log;
  console.log = function (...args: any[]) {
    originalLog.apply(console, args);
    console.warn('%c⚠️ استخدام Console مُراقب', 'color: orange;');
  };
};

/**
 * تفعيل جميع طبقات الحماية
 * Enable all protection layers
 */
export const initializeContentProtection = () => {
  // تفعيل حماية المصادر
  const observer = protectVideoSources();

  // تفعيل حماية التخزين (تعطيل اختياري إذا أثر على الوظائف)
  // protectStorage();

  // تفعيل حماية النسخ
  protectAgainstCopying();

  // تفعيل كشف التصوير
  detectScreenCapture(() => {
    console.error('تم كشف محاولة تصوير الشاشة - سيتم إبلاغ المسؤول');
  });

  // تفعيل منع DevTools
  preventDevTools();

  console.log('%c✅ طبقات الحماية مفعلة', 'color: green; font-weight: bold;');

  return { observer };
};
