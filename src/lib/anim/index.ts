import type { TransitionConfig } from 'svelte/transition';

export interface TypewriterParams {
    delay?: number;
    speed?: number;
    scrollContainer?: HTMLElement;
}

export function typewriter(node: Element, params?: TypewriterParams): TransitionConfig {
    const { childNodes } = node;
    const isAnimatable = childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE;

    if (!isAnimatable) {
        throw new Error(`Typewriter transition only works on elements with a single text node child`);
    }

    // Svelte passes an empty object when params is unused and Destructuring is not allowed on optional parameter
    const delay = params?.delay ?? 0;
    const speed = params?.speed ?? 1;
    const scrollContainer = params?.scrollContainer;

    const text = node.textContent!;
    const duration = text.length / (speed * 0.01);

    return {
        duration,
        delay,
        tick: (t: number) => {
            const charIndex = Math.trunc(text.length * t);
            node.textContent = text.slice(0, charIndex);
            if (scrollContainer !== undefined) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };
}
