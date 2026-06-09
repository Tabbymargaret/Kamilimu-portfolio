tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Titillium Web"', 'system-ui', 'sans-serif'],
                racing: ['"Titillium Web"', 'system-ui', 'sans-serif'],
                body: ['"Titillium Web"', 'system-ui', 'sans-serif'],
            },
            colors: {
                'f1-red': '#E10600',
                'f1-red-glow': '#FF1A1A',
                'papaya': '#FF8700',
                'papaya-glow': '#FFA033',
                'carbon': '#0c0c0e',
                'carbon-mid': '#1a1a1f',
                'race-yellow': '#FDE100',
                'neon-yellow': '#FFF01F',
                'neon-white': '#F8FAFC',
            },
            animation: {
                'live-blink': 'live-blink 1.2s ease-in-out infinite',
                'ignition-pulse': 'ignition-pulse 0.6s ease-out infinite',
            },
            keyframes: {
                'live-blink': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.35' },
                },
                'ignition-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(253, 225, 0, 0.4), 0 0 40px rgba(225, 6, 0, 0.3)' },
                    '50%': { boxShadow: '0 0 35px rgba(253, 225, 0, 0.8), 0 0 60px rgba(225, 6, 0, 0.5)' },
                },
            },
        },
    },
};
