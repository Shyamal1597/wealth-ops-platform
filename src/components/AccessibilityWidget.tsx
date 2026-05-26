'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * Extracts the best human-readable text from a focused DOM element.
 * Priority: aria-label → aria-labelledby → associated label → innerText → placeholder → title
 */
function getReadableText(el: HTMLElement): string {
    // 1. aria-label
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    // 2. aria-labelledby
    const labelledBy = el.getAttribute('aria-labelledby');
    if (labelledBy) {
        const labelEl = document.getElementById(labelledBy);
        if (labelEl?.textContent) return labelEl.textContent.trim();
    }

    // 3. For inputs, find associated <label>
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        const id = el.id;
        if (id) {
            const label = document.querySelector(`label[for="${id}"]`);
            if (label?.textContent) return `${label.textContent.trim()}: ${el.value || el.getAttribute('placeholder') || ''}`;
        }
        // Fallback to placeholder
        const placeholder = el.getAttribute('placeholder');
        if (placeholder) return placeholder;
    }

    // 4. innerText (trim and limit length)
    const innerText = el.innerText?.trim();
    if (innerText) {
        // Only read the first 200 characters to avoid reading enormous blocks
        return innerText.length > 200 ? innerText.substring(0, 200) + '...' : innerText;
    }

    // 5. title attribute
    const title = el.getAttribute('title');
    if (title) return title;

    // 6. alt text for images
    if (el instanceof HTMLImageElement && el.alt) return el.alt;

    return '';
}

/**
 * Gets a human-friendly role descriptor for the element.
 */
function getRoleDescriptor(el: HTMLElement): string {
    const role = el.getAttribute('role');
    const tag = el.tagName.toLowerCase();
    const type = el.getAttribute('type');

    // Explicit ARIA role
    if (role) {
        const roleMap: Record<string, string> = {
            'menu': 'Menu',
            'menuitem': 'Menu Item',
            'tab': 'Tab',
            'tablist': 'Tab List',
            'button': 'Button',
            'link': 'Link',
            'search': 'Search',
            'navigation': 'Navigation',
            'dialog': 'Dialog',
            'alert': 'Alert',
            'checkbox': 'Checkbox',
            'radio': 'Radio Button',
            'textbox': 'Text Field',
            'combobox': 'Combo Box',
            'listbox': 'List Box',
            'option': 'Option',
            'slider': 'Slider',
            'switch': 'Switch',
            'progressbar': 'Progress Bar',
        };
        if (roleMap[role]) return roleMap[role];
        // Capitalize first letter for unknown roles
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    // Tag-based fallback
    if (tag === 'button') return 'Button';
    if (tag === 'a') return 'Link';
    if (tag === 'input') {
        if (type === 'submit') return 'Submit Button';
        if (type === 'checkbox') return 'Checkbox';
        if (type === 'radio') return 'Radio Button';
        if (type === 'password') return 'Password Field';
        if (type === 'email') return 'Email Field';
        if (type === 'search') return 'Search Field';
        return 'Text Field';
    }
    if (tag === 'textarea') return 'Text Area';
    if (tag === 'select') return 'Dropdown';
    if (tag === 'h1') return 'Heading Level 1';
    if (tag === 'h2') return 'Heading Level 2';
    if (tag === 'h3') return 'Heading Level 3';
    if (tag === 'h4') return 'Heading Level 4';
    if (tag === 'img') return 'Image';
    if (tag === 'nav') return 'Navigation';

    return '';
}

/**
 *  Builds the complete announcement string for a focused element
 */
function buildAnnouncement(el: HTMLElement): string {
    const text = getReadableText(el);
    const role = getRoleDescriptor(el);

    // Extra state context
    const states: string[] = [];
    const expanded = el.getAttribute('aria-expanded');
    if (expanded === 'true') states.push('Expanded');
    if (expanded === 'false') states.push('Collapsed');

    const checked = el.getAttribute('aria-checked');
    if (checked === 'true') states.push('Checked');
    if (checked === 'false') states.push('Not Checked');

    const selected = el.getAttribute('aria-selected');
    if (selected === 'true') states.push('Selected');

    const disabled = el.getAttribute('aria-disabled') === 'true' || (el as HTMLButtonElement).disabled;
    if (disabled) states.push('Disabled');

    const parts: string[] = [];
    if (text) parts.push(text);
    if (role) parts.push(role);
    if (states.length > 0) parts.push(states.join(', '));

    return parts.join(', ');
}

export default function AccessibilityWidget() {
    const [ttsEnabled, setTtsEnabled] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    // Load persisted state OR auto-detect OS accessibility settings
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis;

            // Check if user has explicitly set a preference before
            const saved = localStorage.getItem('sunidhi-tts-enabled');

            if (saved !== null) {
                // Respect the user's explicit choice
                setTtsEnabled(saved === 'true');
            } else {
                // No explicit choice yet — auto-detect OS accessibility settings
                const prefersHighContrast = window.matchMedia('(forced-colors: active)').matches;
                const prefersMoreContrast = window.matchMedia('(prefers-contrast: more)').matches;
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                if (prefersHighContrast || prefersMoreContrast || prefersReducedMotion) {
                    setTtsEnabled(true);
                    // Announce auto-activation after a short delay to let the page load
                    setTimeout(() => {
                        const synth = synthRef.current;
                        if (synth) {
                            const utterance = new SpeechSynthesisUtterance(
                                'Accessibility reader has been automatically enabled based on your system settings. Press Alt+T to toggle.'
                            );
                            utterance.lang = 'en-IN';
                            synth.speak(utterance);
                        }
                    }, 1500);
                }
            }

            // Listen for real-time changes to OS accessibility settings
            const highContrastQuery = window.matchMedia('(forced-colors: active)');
            const contrastQuery = window.matchMedia('(prefers-contrast: more)');

            const handleAccessibilityChange = () => {
                const isAccessibilityOn = highContrastQuery.matches || contrastQuery.matches;
                const userOverride = localStorage.getItem('sunidhi-tts-enabled');
                // Only auto-toggle if user hasn't set an explicit preference
                if (userOverride === null) {
                    setTtsEnabled(isAccessibilityOn);
                }
            };

            highContrastQuery.addEventListener('change', handleAccessibilityChange);
            contrastQuery.addEventListener('change', handleAccessibilityChange);

            setIsLoaded(true);

            return () => {
                highContrastQuery.removeEventListener('change', handleAccessibilityChange);
                contrastQuery.removeEventListener('change', handleAccessibilityChange);
            };
        }
    }, []);

    // Speak function
    const speak = useCallback((text: string) => {
        const synth = synthRef.current;
        if (!synth || !text) return;

        // Cancel any ongoing speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = 'en-IN';

        synth.speak(utterance);
    }, []);

    // Focus listener
    useEffect(() => {
        if (!ttsEnabled) return;

        const handleFocus = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (!target || target === document.body) return;

            // Skip the TTS toggle button itself
            if (target.closest('[data-tts-toggle]')) return;

            const announcement = buildAnnouncement(target);
            if (announcement) {
                speak(announcement);
            }
        };

        document.addEventListener('focusin', handleFocus);
        return () => {
            document.removeEventListener('focusin', handleFocus);
            synthRef.current?.cancel();
        };
    }, [ttsEnabled, speak]);

    // Click listener — for non-focusable elements like text content
    useEffect(() => {
        if (!ttsEnabled) return;

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target || target === document.body) return;
            if (target.closest('[data-tts-toggle]')) return;

            // Only speak on click for elements that don't normally receive focus
            const focusable = target.matches('a, button, input, textarea, select, [tabindex]');
            if (!focusable) {
                const text = getReadableText(target);
                const role = getRoleDescriptor(target);
                const parts = [text, role].filter(Boolean);
                if (parts.length > 0) {
                    speak(parts.join(', '));
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [ttsEnabled, speak]);

    // Global keyboard shortcut: Alt+T
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                setTtsEnabled((prev) => {
                    const next = !prev;
                    localStorage.setItem('sunidhi-tts-enabled', String(next));
                    // Announce state change
                    const synth = synthRef.current;
                    if (synth) {
                        synth.cancel();
                        const utterance = new SpeechSynthesisUtterance(
                            next ? 'Accessibility reader enabled' : 'Accessibility reader disabled'
                        );
                        utterance.lang = 'en-IN';
                        synth.speak(utterance);
                    }
                    return next;
                });
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    const toggleTTS = () => {
        setTtsEnabled((prev) => {
            const next = !prev;
            localStorage.setItem('sunidhi-tts-enabled', String(next));

            const synth = synthRef.current;
            if (synth) {
                synth.cancel();
                const utterance = new SpeechSynthesisUtterance(
                    next ? 'Accessibility reader enabled. All focused elements will now be read aloud.' : 'Accessibility reader disabled.'
                );
                utterance.lang = 'en-IN';
                synth.speak(utterance);
            }

            return next;
        });
    };

    if (!isLoaded) return null;

    return (
        <button
            data-tts-toggle
            onClick={toggleTTS}
            aria-label={ttsEnabled ? 'Disable Accessibility Reader' : 'Enable Accessibility Reader'}
            title={ttsEnabled ? 'Disable Accessibility Reader (Alt+T)' : 'Enable Accessibility Reader (Alt+T)'}
            className={`
        fixed bottom-6 right-6 z-[9999]
        w-14 h-14 rounded-full
        flex items-center justify-center
        shadow-lg border-2
        transition-all duration-300 ease-in-out
        focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-300
        ${ttsEnabled
                    ? 'bg-primary-600 border-primary-700 text-white hover:bg-primary-700 animate-pulse'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-primary-400'
                }
      `}
        >
            {ttsEnabled ? (
                <Volume2 className="h-6 w-6" />
            ) : (
                <VolumeX className="h-6 w-6" />
            )}
        </button>
    );
}
