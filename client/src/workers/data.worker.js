/* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
    const { id, type, payload } = e.data || {};
    if (type !== 'normalize') return;

    try {
        const items = Array.isArray(payload?.items) ? payload.items : [];

        const normalized = items
            .filter(Boolean)
            .map((x) => ({
                id: String(x.id ?? ''),
                title: String(x.title ?? '').trim(),
                text: String(x.text ?? '').trim(),
                image: x.image ? String(x.image) : null
            }))
            .slice(0, 20);

        self.postMessage({ id, payload: normalized });
    } catch (err) {
        // worker error -> main will handle
        throw err;
    }
};