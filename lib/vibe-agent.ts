export type VibeLabel = 'positive' | 'neutral' | 'negative'

interface VibeRule {
    score: number // -1 negative, 0 neutral, 1 positive
    emojis: string[]
}

const VIBE_RULES: VibeRule[] = [
    {
        score: -1,
        emojis: ['😭', '😢', '😩', '😫', '😞', '😡', '🤬', '💀', '🤕', '🤮', '🤢', '🤧', '🤒', '😷', '💔', '👎', '⛈️']
    },
    {
        score: 1,
        emojis: ['😄', '😃', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '😍', '🤩', '😘', '😋', '🤗', '😎', '🥳', '🎉', '🔥', '💪', '💯', '✨', '🚀']
    },
    {
        score: 0,
        emojis: ['😐', '😑', '😶', '🙄', '🤔', '😴', '🥱', '🤷', '👀', '🤐', '🤫', '😬', '🍞', '☕']
    }
]

export function getVibeLabel(emoji: string): VibeLabel {
    for (const rule of VIBE_RULES) {
        if (rule.emojis.includes(emoji)) {
            if (rule.score > 0) return 'positive'
            if (rule.score < 0) return 'negative'
            return 'neutral'
        }
    }
    return 'neutral' // Default
}

// Enhanced keyword matching for "Describe my vibe"
export function suggestEmojis(description: string): string[] {
    const lowerDesc = description.toLowerCase()
    const words = lowerDesc.split(/\s+/)

    const KEYWORD_MAP: Record<string, string[]> = {
        // Essential states
        'hungry': ['😋', '🍔', '🍕', '🌮', '🍗'],
        'food': ['😋', '🍔', '🍕', '🌮', '🍗', '🍜', '🍣'],
        'thirsty': ['🥤', '🧋', '🍺', '🍷', '💧'],
        'tired': ['😴', '🥱', '😫', '💤', '😪'],
        'sleepy': ['😴', '🥱', '💤', '🛌', '🌚'],
        'sick': ['🤒', '🤢', '🤮', '😷', '🤧', '🤕'],
        'cold': ['🥶', '❄️', '🌨️', '⛄', '🧣'],
        'hot': ['🥵', '☀️', '🔥', '🌡️', '🏖️'],

        // Activity & Work
        'work': ['💻', '💼', '👔', '📅', '🧠'],
        'working': ['💻', '⌨️', '🏢', '📝'],
        'busy': ['💻', '⏳', '🏃', '😤', '🚫'],
        'study': ['📚', '📖', '📝', '🎓', '🤓'],
        'school': ['🏫', '🎒', '🚌', '📚'],
        'gym': ['💪', '🏋️', '🏃', '👿', '🥊'],
        'coding': ['💻', '⌨️', '🐛', '🤓', '🔥'],
        'gaming': ['🎮', '🕹️', '👾', '🎧', '📺'],

        // Travel
        'travel': ['✈️', '🌍', '🧳', '🗺️', '🏝️'],
        'driving': ['🚗', '🚘', '🛣️', '🚦'],
        'flying': ['✈️', '🛫', '☁️'],

        // Emotions - Negative
        'sad': ['😢', '😭', '😞', '☹️', '💔'],
        'cry': ['😭', '😢', '😿', '💔'],
        'angry': ['😡', '🤬', '😤', '😠', '👿'],
        'mad': ['😡', '🤬', '👺', '💢'],
        'stressed': ['😫', '🤯', '😓', '😖', '💆'],
        'scared': ['😱', '😨', '😰', '🫣', '👻'],
        'bored': ['😐', '🥱', '😑', '😒', '🫠'],

        // Emotions - Positive
        'happy': ['😄', '😁', '😊', '🥳', '✨'],
        'excited': ['🤩', '🥳', '🎉', '😆', '🚀'],
        'confident': ['😎', '🤠', '💪', '🦁', '👑'],
        'loved': ['🥰', '😍', '❤️', '💕', '🌹'],
        'chill': ['😎', '😌', '🍃', '💆', '🦦'],
        'funny': ['😂', '🤣', '😹', '💀'],
        'cool': ['😎', '🧊', '🕶️', '🥶'],

        // Misc
        'party': ['🎉', '🥳', '👯', '🍾', '🍻'],
        'rich': ['🤑', '💸', '💰', '💎', '💳'],
        'music': ['🎵', '🎧', '🎸', '🎹', '🎶'],
        'movie': ['🎬', '🍿', '🎥', '🎟️'],
        'coffee': ['☕', '🥯', '🥐', '🔋']
    }

    // Direct Match
    for (const [key, emojis] of Object.entries(KEYWORD_MAP)) {
        if (lowerDesc.includes(key)) {
            return emojis
        }
    }

    // Fuzzy Match (check if any word starts with map keys)
    for (const word of words) {
        for (const [key, emojis] of Object.entries(KEYWORD_MAP)) {
            if (key.startsWith(word) || word.startsWith(key)) {
                return emojis
            }
        }
    }

    // Default fallback if no match
    return ['🤔', '🤷', '✨', '👋']
}

interface Assistance {
    label: VibeLabel
    messages: string[]
    actions: string[]
}

export function getAssistance(emoji: string, friendName: string): Assistance {
    const label = getVibeLabel(emoji)

    const suggestions: Record<VibeLabel, { messages: string[], actions: string[] }> = {
        positive: {
            messages: [
                `Yesss! So happy for you ${friendName}! 🎉`,
                `Looking good! Keep crushing it! 🔥`,
                `That's the energy we need! ✨`
            ],
            actions: [
                "Ask for details!",
                "Send a celebration GIF",
                "Plan a hangout to celebrate"
            ]
        },
        negative: {
            messages: [
                `Hey ${friendName}, just checking in. You okay?`,
                `Sending you big hugs right now. ❤️`,
                `Let me know if you need to vent or distract yourself.`
            ],
            actions: [
                "Offer to bring food/coffee",
                "Send a funny/cute distraction",
                "Just listen (call them)"
            ]
        },
        neutral: {
            messages: [
                `Hey ${friendName}, what's up?`,
                `Vibing? 👀`,
                `Thinking of you, hope the day is treating you well.`
            ],
            actions: [
                "Send a random meme",
                "Ask what they are up to",
                "Share a song"
            ]
        }
    }

    return {
        label,
        ...suggestions[label]
    }
}
