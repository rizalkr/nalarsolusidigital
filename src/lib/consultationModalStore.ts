type Listener = () => void;

let isOpen = false;
let triggerElement: HTMLElement | null = null;
const listeners = new Set<Listener>();

function emitChange(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Safe guard against listener errors
    }
  });
}

export const consultationModalStore = {
  getIsOpen(): boolean {
    return isOpen;
  },

  getTriggerElement(): HTMLElement | null {
    return triggerElement;
  },

  open(trigger?: HTMLElement | null): void {
    if (trigger) {
      triggerElement = trigger;
    }
    isOpen = true;
    emitChange();
  },

  close(): void {
    isOpen = false;
    emitChange();

    if (triggerElement) {
      const el = triggerElement;
      triggerElement = null;
      requestAnimationFrame(() => {
        el.focus();
      });
    }
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  reset(): void {
    isOpen = false;
    triggerElement = null;
    emitChange();
  },
};

