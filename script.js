document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('src') || params.get('utm_content');

    const variants = {
        badmove: {
            title: '当てはまった人へ。<br>AI時代に残る経験を積もう。',
            description: '作業をこなすだけの経験ではなく、農業の現場で問いを立て、AIで整理し、発信して改善する経験を積むインターンです。'
        },
        niche: {
            title: '普通のインターンでは<br>物足りない人へ。',
            description: '農業、AI、SNS発信、Discordコミュニティ運営を横断して、まだ役割名のない実務に挑戦できます。'
        },
        future: {
            title: '3年後に効く経験を、<br>今から積む。',
            description: 'AIに聞いて終わらせず、現場の反応を見て改善し、成果物とログとして残す力を身につけます。'
        }
    };

    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    if (source && variants[source] && heroTitle && heroDescription) {
        heroTitle.innerHTML = variants[source].title;
        heroDescription.textContent = variants[source].description;
        document.body.dataset.variant = source;
    }

    const sendEvent = (eventName, label, extra = {}) => {
        if (typeof window.gtag === 'function') {
            window.gtag('event', eventName, {
                event_category: 'instagram_lp',
                event_label: label,
                source_variant: source || 'default',
                ...extra
            });
        }
    };

    sendEvent('lp_view', source || 'default', {
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_content: params.get('utm_content') || ''
    });

    document.querySelectorAll('.js-track').forEach((element) => {
        element.addEventListener('click', () => {
            sendEvent(element.dataset.event || 'cta_click', element.dataset.label || element.textContent.trim());
        });
    });

    const faders = document.querySelectorAll('.section, .experience-card, .evidence-card, .principle-grid article, .flow-steps li, .fit-card, .requirements-grid > div, .faq-item, .link-card');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0,
        rootMargin: '0px 0px -80px 0px'
    });

    faders.forEach((element) => {
        element.classList.add('fade-in');
        fadeObserver.observe(element);
    });

    const viewTargets = document.querySelectorAll('[data-track-view]');
    const viewObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            sendEvent(entry.target.dataset.trackView, entry.target.id || entry.target.dataset.trackView);
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.3
    });

    viewTargets.forEach((element) => viewObserver.observe(element));

    const scrollDepths = [25, 50, 75, 90];
    const sentDepths = new Set();
    const trackScrollDepth = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable <= 0) return;
        const current = Math.round((window.scrollY / scrollable) * 100);
        scrollDepths.forEach((depth) => {
            if (current >= depth && !sentDepths.has(depth)) {
                sentDepths.add(depth);
                sendEvent('scroll_depth', `${depth}%`, { scroll_depth: depth });
            }
        });
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    trackScrollDepth();
});
