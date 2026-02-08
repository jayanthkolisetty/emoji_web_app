'use client'

import React, { useState, useMemo } from 'react'
import { Search, X, Smile, Zap, Coffee, Activity, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface EmojiPickerProps {
    onSelect: (emoji: string, statusMessage?: string) => void
    onClose: () => void
}

const EMOJI_CATEGORIES = [
    {
        id: 'emotions',
        name: 'Emotions',
        icon: Smile,
        emojis: [
            { char: '😀', name: 'Grinning Face' }, { char: '😃', name: 'Grinning Face with Big Eyes' }, { char: '😄', name: 'Grinning Face with Smiling Eyes' }, { char: '😁', name: 'Beaming Face with Smiling Eyes' },
            { char: '😆', name: 'Grinning Squinting Face' }, { char: '😅', name: 'Grinning Face with Sweat' }, { char: '😂', name: 'Face with Tears of Joy' }, { char: '🤣', name: 'Rolling on the Floor Laughing' },
            { char: '🥲', name: 'Smiling Face with Tear' }, { char: '🥹', name: 'Face Holding Back Tears' }, { char: '☺️', name: 'Smiling Face' }, { char: '😊', name: 'Smiling Face with Smiling Eyes' },
            { char: '😇', name: 'Smiling Face with Halo' }, { char: '🙂', name: 'Slightly Smiling Face' }, { char: '🙃', name: 'Upside-Down Face' }, { char: '😉', name: 'Winking Face' },
            { char: '😌', name: 'Relieved Face' }, { char: '😍', name: 'Smiling Face with Heart-Eyes' }, { char: '🥰', name: 'Smiling Face with Hearts' }, { char: '😘', name: 'Face Blowing a Kiss' },
            { char: '😗', name: 'Kissing Face' }, { char: '😙', name: 'Kissing Face with Smiling Eyes' }, { char: '😚', name: 'Kissing Face with Closed Eyes' }, { char: '😋', name: 'Face Savoring Food' },
            { char: '😛', name: 'Face with Tongue' }, { char: '😝', name: 'Squinting Face with Tongue' }, { char: '😜', name: 'Winking Face with Tongue' }, { char: '🤪', name: 'Zany Face' },
            { char: '🤨', name: 'Face with Raised Eyebrow' }, { char: '🧐', name: 'Face with Monocle' }, { char: '🤓', name: 'Nerd Face' }, { char: '😎', name: 'Smiling Face with Sunglasses' },
            { char: '🥸', name: 'Disguised Face' }, { char: '🤩', name: 'Star-Struck' }, { char: '🥳', name: 'Partying Face' }, { char: '😏', name: 'Smirking Face' },
            { char: '😒', name: 'Unamused Face' }, { char: '😞', name: 'Disappointed Face' }, { char: '😔', name: 'Pensive Face' }, { char: '😟', name: 'Worried Face' },
            { char: '😕', name: 'Confused Face' }, { char: '🙁', name: 'Slightly Frowning Face' }, { char: '☹️', name: 'Frowning Face' }, { char: '😣', name: 'Persevering Face' },
            { char: '😖', name: 'Confounded Face' }, { char: '😫', name: 'Tired Face' }, { char: '😩', name: 'Weary Face' }, { char: '🥺', name: 'Pleading Face' },
            { char: '😢', name: 'Crying Face' }, { char: '😭', name: 'Loudly Crying Face' }, { char: '😤', name: 'Face with Steam From Nose' }, { char: '😠', name: 'Angry Face' },
            { char: '😡', name: 'Pouting Face' }, { char: '🤬', name: 'Face with Symbols on Mouth' }, { char: '🤯', name: 'Exploding Head' }, { char: '😳', name: 'Flushed Face' },
            { char: '🥵', name: 'Hot Face' }, { char: '🥶', name: 'Cold Face' }, { char: '😱', name: 'Face Screaming in Fear' }, { char: '😨', name: 'Fearful Face' },
            { char: '😰', name: 'Anxious Face with Sweat' }, { char: '😥', name: 'Sad but Relieved Face' }, { char: '😓', name: 'Downcast Face with Sweat' }, { char: '🤗', name: 'Hugging Face' },
            { char: '🤔', name: 'Thinking Face' }, { char: '🫣', name: 'Face Peeking Under Hand' }, { char: '🤭', name: 'Face with Hand Over Mouth' }, { char: '🫡', name: 'Saluting Face' },
            { char: '🤫', name: 'Shushing Face' }, { char: '🫠', name: 'Melting Face' }, { char: '🤥', name: 'Lying Face' }, { char: '😶', name: 'Face Without Mouth' },
            { char: '🫥', name: 'Dotted Line Face' }, { char: '😐', name: 'Neutral Face' }, { char: '😑', name: 'Expressionless Face' }, { char: '😬', name: 'Grimacing Face' },
            { char: '🙄', name: 'Face with Rolling Eyes' }, { char: '😯', name: 'Hushed Face' }, { char: '😦', name: 'Frowning Face with Open Mouth' }, { char: '😧', name: 'Anguished Face' },
            { char: '😮', name: 'Face with Open Mouth' }, { char: '😲', name: 'Astonished Face' }, { char: '🥱', name: 'Yawning Face' }, { char: '😴', name: 'Sleeping Face' },
            { char: '🤤', name: 'Drooling Face' }, { char: '😪', name: 'Sleepy Face' }, { char: '😵', name: 'Dizzy Face' }, { char: '😵‍💫', name: 'Face with Spiral Eyes' },
            { char: '🫨', name: 'Shaking Face' }, { char: '🤐', name: 'Zipper-Mouth Face' }, { char: '🥴', name: 'Woozy Face' }, { char: '🤢', name: 'Nauseated Face' },
            { char: '🤮', name: 'Face Vomiting' }, { char: '🤧', name: 'Sneezing Face' }, { char: '😷', name: 'Face with Medical Mask' }, { char: '🤒', name: 'Face with Thermometer' },
            { char: '🤕', name: 'Face with Head-Bandage' }, { char: '🤑', name: 'Money-Mouth Face' }, { char: '🤠', name: 'Cowboy Hat Face' }, { char: '😈', name: 'Smiling Face with Horns' },
            { char: '👿', name: 'Angry Face with Horns' }, { char: '🤡', name: 'Clown Face' }, { char: '💩', name: 'Pile of Poo' }, { char: '👻', name: 'Ghost' },
            { char: '💀', name: 'Skull' }, { char: '☠️', name: 'Skull and Crossbones' }, { char: '👽', name: 'Alien' }, { char: '👾', name: 'Alien Monster' },
            { char: '🤖', name: 'Robot' }, { char: '👋', name: 'Waving Hand' }
        ]
    },
    {
        id: 'activites',
        name: 'Activities',
        icon: Zap,
        emojis: [
            { char: '🎉', name: 'Party Popper' }, { char: '🎊', name: 'Confetti Ball' }, { char: '🎈', name: 'Balloon' }, { char: '🎂', name: 'Birthday Cake' },
            { char: '🎁', name: 'Wrapped Gift' }, { char: '🕯️', name: 'Candle' }, { char: '🧨', name: 'Firecracker' }, { char: '🏆', name: 'Trophy' },
            { char: '🏅', name: 'Sports Medal' }, { char: '🥇', name: '1st Place Medal' }, { char: '🥈', name: '2nd Place Medal' }, { char: '🥉', name: '3rd Place Medal' },
            { char: '⚽', name: 'Soccer Ball' }, { char: '🏀', name: 'Basketball' }, { char: '🏈', name: 'American Football' }, { char: '⚾', name: 'Baseball' },
            { char: '🥎', name: 'Softball' }, { char: '🎾', name: 'Tennis' }, { char: '🏐', name: 'Volleyball' }, { char: '🏉', name: 'Rugby Football' },
            { char: '🎱', name: 'Pool 8 Ball' }, { char: '🏓', name: 'Ping Pong' }, { char: '🏸', name: 'Badminton' }, { char: '🏒', name: 'Ice Hockey' },
            { char: '🏑', name: 'Field Hockey' }, { char: '🥍', name: 'Lacrosse' }, { char: '🏏', name: 'Cricket Game' }, { char: '⛳', name: 'Flag in Hole' },
            { char: '🏹', name: 'Bow and Arrow' }, { char: '🎣', name: 'Fishing Pole' }, { char: '🤿', name: 'Diving Mask' }, { char: '🥊', name: 'Boxing Glove' },
            { char: '🥋', name: 'Martial Arts Uniform' }, { char: '🛹', name: 'Skateboard' }, { char: '🛼', name: 'Roller Skate' }, { char: '🛷', name: 'Sled' },
            { char: '⛸️', name: 'Ice Skate' }, { char: '🥌', name: 'Curling Stone' }, { char: '🎿', name: 'Skis' }, { char: '🏂', name: 'Snowboarder' },
            { char: '🏋️', name: 'Person Lifting Weights' }, { char: '🤼', name: 'People Wrestling' }, { char: '🤸', name: 'Person Cartwheeling' }, { char: '⛹️', name: 'Person Bouncing Ball' },
            { char: '🤺', name: 'Person Fencing' }, { char: '🤾', name: 'Person Playing Handball' }, { char: '🏌️', name: 'Person Golfing' }, { char: '🏇', name: 'Horse Racing' },
            { char: '🧘', name: 'Person in Lotus Position' }, { char: '🏄', name: 'Person Surfing' }, { char: '🏊', name: 'Person Swimming' }, { char: '🤽', name: 'Person Playing Water Polo' },
            { char: '🚣', name: 'Person Rowing Boat' }, { char: '🧗', name: 'Person Climbing' }, { char: '🚵', name: 'Person Mountain Biking' }, { char: '🚴', name: 'Person Biking' },
            { char: '🎮', name: 'Video Game' }, { char: '🕹️', name: 'Joystick' }, { char: '🎲', name: 'Game Die' }, { char: '🎻', name: 'Violin' },
            { char: '🎺', name: 'Trumpet' }, { char: '🎸', name: 'Guitar' }, { char: '🎷', name: 'Saxophone' }, { char: '🎹', name: 'Musical Keyboard' },
            { char: '🥁', name: 'Drum' }, { char: '🎧', name: 'Headphone' }, { char: '🎤', name: 'Microphone' }, { char: '🎬', name: 'Clapper Board' },
            { char: '🎨', name: 'Artist Palette' }, { char: '🧶', name: 'Yarn' }, { char: '🚗', name: 'Automobile' }, { char: '✈️', name: 'Airplane' },
            { char: '🚀', name: 'Rocket' }, { char: '🛸', name: 'Flying Saucer' }, { char: '🛶', name: 'Canoe' }, { char: '⛵', name: 'Sailboat' }, { char: '🚤', name: 'Speedboat' }
        ]
    },
    {
        id: 'food',
        name: 'Food & Drink',
        icon: Coffee,
        emojis: [
            { char: '☕', name: 'Hot Beverage' }, { char: '🍵', name: 'Teacup Without Handle' }, { char: '🍶', name: 'Sake' }, { char: '🍼', name: 'Baby Bottle' },
            { char: '🥛', name: 'Glass of Milk' }, { char: '🧃', name: 'Beverage Box' }, { char: '🥤', name: 'Cup with Straw' }, { char: '🧋', name: 'Bubble Tea' },
            { char: '🍺', name: 'Beer Mug' }, { char: '🍻', name: 'Clinking Beer Mugs' }, { char: '🥂', name: 'Clinking Glasses' }, { char: '🍷', name: 'Wine Glass' },
            { char: '🥃', name: 'Tumbler Glass' }, { char: '🍸', name: 'Cocktail Glass' }, { char: '🍹', name: 'Tropical Drink' }, { char: '🧉', name: 'Mate' },
            { char: '🍾', name: 'Bottle with Popping Cork' }, { char: '🧊', name: 'Ice' }, { char: '🥄', name: 'Spoon' }, { char: '🍴', name: 'Fork and Knife' },
            { char: '🍽️', name: 'Fork and Knife with Plate' }, { char: '🥣', name: 'Bowl with Spoon' }, { char: '🥡', name: 'Takeout Box' }, { char: '🥢', name: 'Chopsticks' },
            { char: '🧂', name: 'Salt' }, { char: '🍿', name: 'Popcorn' }, { char: '🍩', name: 'Doughnut' }, { char: '🍪', name: 'Cookie' },
            { char: '🌰', name: 'Chestnut' }, { char: '🥜', name: 'Peanuts' }, { char: '🍯', name: 'Honey Pot' }, { char: '🍰', name: 'Shortcake' },
            { char: '🧁', name: 'Cupcake' }, { char: '🥧', name: 'Pie' }, { char: '🍫', name: 'Chocolate Bar' }, { char: '🍬', name: 'Candy' },
            { char: '🍭', name: 'Lollipop' }, { char: '🍮', name: 'Custard' }, { char: '🥓', name: 'Bacon' }, { char: '🥩', name: 'Cut of Meat' },
            { char: '🍗', name: 'Poultry Leg' }, { char: '🍖', name: 'Meat on Bone' }, { char: '🌭', name: 'Hot Dog' }, { char: '🍔', name: 'Hamburger' },
            { char: '🍟', name: 'French Fries' }, { char: '🍕', name: 'Pizza' }, { char: '🥪', name: 'Sandwich' }, { char: '🥙', name: 'Stuffed Flatbread' },
            { char: '🧆', name: 'Falafel' }, { char: '🌮', name: 'Taco' }, { char: '🌯', name: 'Burrito' }, { char: '🫔', name: 'Tamale' },
            { char: '🥗', name: 'Green Salad' }, { char: '🥘', name: 'Shallow Pan of Food' }, { char: '🫕', name: 'Fondue' }, { char: '🥫', name: 'Canned Food' },
            { char: '🍝', name: 'Spaghetti' }, { char: '🍜', name: 'Steaming Bowl' }, { char: '🍲', name: 'Pot of Food' }, { char: '🍛', name: 'Curry Rice' },
            { char: '🍣', name: 'Sushi' }, { char: '🍱', name: 'Bento Box' }, { char: '🥟', name: 'Dumpling' }, { char: '🦪', name: 'Oyster' },
            { char: '🍤', name: 'Fried Shrimp' }, { char: '🍙', name: 'Rice Ball' }, { char: '🍚', name: 'Cooked Rice' }, { char: '🍘', name: 'Rice Cracker' },
            { char: '🍥', name: 'Fish Cake with Swirl' }, { char: '🍢', name: 'Oden' }, { char: '🍡', name: 'Dango' }, { char: '🍧', name: 'Shaved Ice' },
            { char: '🍨', name: 'Ice Cream' }, { char: '🍦', name: 'Soft Ice Cream' }, { char: '🥝', name: 'Kiwi Fruit' }, { char: '🥥', name: 'Coconut' },
            { char: '🍇', name: 'Grapes' }, { char: '🍈', name: 'Melon' }, { char: '🍉', name: 'Watermelon' }, { char: '🍊', name: 'Tangerine' },
            { char: '🍋', name: 'Lemon' }, { char: '🍌', name: 'Banana' }, { char: '🍍', name: 'Pineapple' }, { char: '🥭', name: 'Mango' },
            { char: '🍎', name: 'Red Apple' }, { char: '🍏', name: 'Green Apple' }, { char: '🍐', name: 'Pear' }, { char: '🍑', name: 'Peach' },
            { char: '🍒', name: 'Cherries' }, { char: '🍓', name: 'Strawberry' }, { char: '🫐', name: 'Blueberries' }, { char: '🍅', name: 'Tomato' },
            { char: '🫒', name: 'Olive' }, { char: '🥑', name: 'Avocado' }, { char: '🍆', name: 'Eggplant' }, { char: '🥔', name: 'Potato' },
            { char: '🥕', name: 'Carrot' }, { char: '🌽', name: 'Ear of Corn' }
        ]
    },
    {
        id: 'objects',
        name: 'Objects',
        icon: Activity,
        emojis: [
            { char: '💡', name: 'Light Bulb' }, { char: '🔦', name: 'Flashlight' }, { char: '🕯️', name: 'Candle' }, { char: '💣', name: 'Bomb' },
            { char: '🔪', name: 'Kitchen Knife' }, { char: '🗡️', name: 'Dagger' }, { char: '🛡️', name: 'Shield' }, { char: '🚬', name: 'Cigarette' },
            { char: '⚰️', name: 'Coffin' }, { char: '🪦', name: 'Headstone' }, { char: '🏺', name: 'Amphora' }, { char: '🔮', name: 'Crystal Ball' },
            { char: '📿', name: 'Prayer Beads' }, { char: '🧿', name: 'Nazar Amulet' }, { char: '💈', name: 'Barber Pole' }, { char: '⚗️', name: 'Alembic' },
            { char: '🔭', name: 'Telescope' }, { char: '🔬', name: 'Microscope' }, { char: '🕳️', name: 'Hole' }, { char: '💊', name: 'Pill' },
            { char: '💉', name: 'Syringe' }, { char: '🩸', name: 'Drop of Blood' }, { char: '🧬', name: 'DNA' }, { char: '🦠', name: 'Microbe' },
            { char: '🩹', name: 'Adhesive Bandage' }, { char: '🩺', name: 'Stethoscope' }, { char: '🌡️', name: 'Thermometer' }, { char: '🪜', name: 'Ladder' },
            { char: '🪝', name: 'Hook' }, { char: '🛗', name: 'Elevator' }, { char: '🪞', name: 'Mirror' }, { char: '🪟', name: 'Window' },
            { char: '🛏️', name: 'Bed' }, { char: '🛋️', name: 'Couch and Lamp' }, { char: '🪑', name: 'Chair' }, { char: '🚽', name: 'Toilet' },
            { char: '🪠', name: 'Plunger' }, { char: '🚿', name: 'Shower' }, { char: '🛁', name: 'Bathtub' }, { char: '🪤', name: 'Mouse Trap' },
            { char: '🪒', name: 'Razor' }, { char: '🧴', name: 'Lotion Bottle' }, { char: '🧷', name: 'Safety Pin' }, { char: '🧹', name: 'Broom' },
            { char: '🧺', name: 'Basket' }, { char: '🧻', name: 'Roll of Paper' }, { char: '🪣', name: 'Bucket' }, { char: '🧼', name: 'Soap' },
            { char: '🪥', name: 'Toothbrush' }, { char: '🧽', name: 'Sponge' }, { char: '🧯', name: 'Fire Extinguisher' }, { char: '🛒', name: 'Shopping Cart' },
            { char: '🧱', name: 'Brick' }, { char: '🪵', name: 'Wood' }, { char: '🪨', name: 'Rock' }, { char: '🛖', name: 'Hut' },
            { char: '🏠', name: 'House' }, { char: '🏡', name: 'House with Garden' }, { char: '🏢', name: 'Office Building' }, { char: '🏣', name: 'Japanese Post Office' },
            { char: '🏤', name: 'Post Office' }, { char: '🏥', name: 'Hospital' }, { char: '🏦', name: 'Bank' }, { char: '🏨', name: 'Hotel' },
            { char: '🏩', name: 'Love Hotel' }, { char: '🏪', name: 'Convenience Store' }, { char: '🏫', name: 'School' }, { char: '🏬', name: 'Department Store' },
            { char: '🏭', name: 'Factory' }, { char: '🏯', name: 'Japanese Castle' }, { char: '🏰', name: 'Castle' }, { char: '💒', name: 'Wedding' },
            { char: '🗼', name: 'Tokyo Tower' }, { char: '🗽', name: 'Statue of Liberty' }, { char: '⛪', name: 'Church' }, { char: '🕌', name: 'Mosque' },
            { char: '🛕', name: 'Hindu Temple' }, { char: '🕍', name: 'Synagogue' }, { char: '⛩️', name: 'Shinto Shrine' }, { char: '🕋', name: 'Kaaba' },
            { char: '⛲', name: 'Fountain' }, { char: '⛺', name: 'Tent' }, { char: '🌁', name: 'Foggy' }, { char: '🌃', name: 'Night with Stars' },
            { char: '🏙️', name: 'Cityscape' }, { char: '🌄', name: 'Sunrise Over Mountains' }
        ]
    },
    {
        id: 'symbols',
        name: 'Symbols',
        icon: Heart,
        emojis: [
            { char: '❤️', name: 'Red Heart' }, { char: '🩷', name: 'Pink Heart' }, { char: '🧡', name: 'Orange Heart' }, { char: '💛', name: 'Yellow Heart' },
            { char: '💚', name: 'Green Heart' }, { char: '💙', name: 'Blue Heart' }, { char: '🩵', name: 'Light Blue Heart' }, { char: '💜', name: 'Purple Heart' },
            { char: '🖤', name: 'Black Heart' }, { char: '🩶', name: 'Grey Heart' }, { char: '🤍', name: 'White Heart' }, { char: '🤎', name: 'Brown Heart' },
            { char: '💔', name: 'Broken Heart' }, { char: '❤️‍🔥', name: 'Heart on Fire' }, { char: '❤️‍🩹', name: 'Mending Heart' }, { char: '❣️', name: 'Heart Exclamation' },
            { char: '💕', name: 'Two Hearts' }, { char: '💞', name: 'Revolving Hearts' }, { char: '💓', name: 'Beating Heart' }, { char: '💗', name: 'Growing Heart' },
            { char: '💖', name: 'Sparkling Heart' }, { char: '💘', name: 'Heart with Arrow' }, { char: '💝', name: 'Heart with Ribbon' }, { char: '💟', name: 'Heart Decoration' },
            { char: '☮️', name: 'Peace Symbol' }, { char: '✝️', name: 'Latin Cross' }, { char: '☪️', name: 'Star and Crescent' }, { char: '🕉️', name: 'Om' },
            { char: '☸️', name: 'Wheel of Dharma' }, { char: '✡️', name: 'Star of David' }, { char: '🔯', name: 'Dotted Six-Pointed Star' }, { char: '🕎', name: 'Menorah' },
            { char: '☯️', name: 'Yin Yang' }, { char: '☦️', name: 'Orthodox Cross' }, { char: '🛐', name: 'Place of Worship' }, { char: '⛎', name: 'Ophiuchus' },
            { char: '♈', name: 'Aries' }, { char: '♉', name: 'Taurus' }, { char: '♊', name: 'Gemini' }, { char: '♋', name: 'Cancer' },
            { char: '♌', name: 'Leo' }, { char: '♍', name: 'Virgo' }, { char: '♎', name: 'Libra' }, { char: '♏', name: 'Scorpio' },
            { char: '♐', name: 'Sagittarius' }, { char: '♑', name: 'Capricorn' }, { char: '♒', name: 'Aquarius' }, { char: '♓', name: 'Pisces' },
            { char: '🆔', name: 'ID Button' }, { char: '⚛️', name: 'Atom Symbol' }, { char: '🉑', name: 'Japanese "Acceptable" Button' }, { char: '☢️', name: 'Radioactive' },
            { char: '☣️', name: 'Biohazard' }, { char: '📴', name: 'Mobile Phone Off' }, { char: '📳', name: 'Vibration Mode' }, { char: '🈶', name: 'Japanese "Not Free of Charge" Button' },
            { char: '🈚', name: 'Japanese "Free of Charge" Button' }, { char: '🈸', name: 'Japanese "Application" Button' }, { char: '🈺', name: 'Japanese "Open for Business" Button' }, { char: '🈷️', name: 'Japanese "Monthly Amount" Button' },
            { char: '✴️', name: 'Eight-Pointed Star' }, { char: '🆚', name: 'VS Button' }, { char: '💮', name: 'White Flower' }, { char: '🉐', name: 'Japanese "Bargain" Button' },
            { char: '㊙️', name: 'Japanese "Secret" Button' }, { char: '㊗️', name: 'Japanese "Congratulations" Button' }, { char: '🈴', name: 'Japanese "Passing Grade" Button' }, { char: '🈵', name: 'Japanese "No Vacancy" Button' },
            { char: '🈹', name: 'Japanese "Discount" Button' }, { char: '🈲', name: 'Japanese "Prohibited" Button' }, { char: '🅰️', name: 'A Button (Blood Type)' }, { char: '🅱️', name: 'B Button (Blood Type)' },
            { char: '🆎', name: 'AB Button (Blood Type)' }, { char: '🆑', name: 'CL Button' }, { char: '🅾️', name: 'O Button (Blood Type)' }, { char: '🆘', name: 'SOS Button' },
            { char: '❌', name: 'Cross Mark' }, { char: '⭕', name: 'Hollow Red Circle' }, { char: '🛑', name: 'Stop Sign' }, { char: '⛔', name: 'No Entry' },
            { char: '📛', name: 'Name Badge' }, { char: '🚫', name: 'Prohibited' }, { char: '💯', name: 'Hundred Points' }, { char: '💢', name: 'Anger Symbol' },
            { char: '♨️', name: 'Hot Springs' }, { char: '🚷', name: 'No Pedestrians' }, { char: '🚯', name: 'No Littering' }, { char: '🚳', name: 'No Bicycles' },
            { char: '🚱', name: 'Non-Potable Water' }, { char: '🔞', name: 'No One Under Eighteen' }, { char: '📵', name: 'No Mobile Phones' }, { char: '🚭', name: 'No Smoking' },
            { char: '❗', name: 'Exclamation Mark' }, { char: '❕', name: 'White Exclamation Mark' }, { char: '❓', name: 'Question Mark' }, { char: '❔', name: 'White Question Mark' },
            { char: '‼️', name: 'Double Exclamation Mark' }, { char: '⁉️', name: 'Exclamation Question Mark' }, { char: '🔅', name: 'Dim Button' }, { char: '🔆', name: 'Bright Button' },
            { char: '〽️', name: 'Part Alternation Mark' }, { char: '⚠️', name: 'Warning' }, { char: '🚸', name: 'Children Crossing' }, { char: '🔱', name: 'Trident Emblem' },
            { char: '⚜️', name: 'Fleur-de-lis' }, { char: '🔰', name: 'Japanese Symbol for Beginner' }, { char: '♻️', name: 'Recycling Symbol' }, { char: '✅', name: 'Check Mark Button' },
            { char: '🈯', name: 'Japanese "Reserved" Button' }, { char: '💹', name: 'Chart Increasing with Yen' }
        ]
    }
]

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
    const [activeCategory, setActiveCategory] = useState('emotions')
    const [searchQuery, setSearchQuery] = useState('')
    const [suggested, setSuggested] = useState<{ char: string, name: string }[]>([])
    const [hoveredEmoji, setHoveredEmoji] = useState<{ char: string, name: string } | null>(null)
    const [selectedEmoji, setSelectedEmoji] = useState<string>('')
    const [statusMessage, setStatusMessage] = useState('')

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        if (query.trim().length > 1) {
            const queryLower = query.toLowerCase()
            const allEmojis = EMOJI_CATEGORIES.flatMap(c => c.emojis)
            const matches = allEmojis.filter(e => e.name.toLowerCase().includes(queryLower))
            setSuggested(matches.slice(0, 50))
        } else {
            setSuggested([])
        }
    }

    const filteredEmojis = useMemo(() => {
        if (!searchQuery) {
            return EMOJI_CATEGORIES.find(c => c.id === activeCategory)?.emojis || []
        }
        return suggested
    }, [activeCategory, searchQuery, suggested])

    const handleEmojiClick = (emoji: string) => {
        setSelectedEmoji(emoji)
    }

    const handleConfirm = () => {
        if (selectedEmoji) {
            onSelect(selectedEmoji, statusMessage.trim() || undefined)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all overflow-hidden">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Set your vibe</h3>
                        <p className="text-sm text-slate-500 font-medium">How are you feeling right now?</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100/50">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            placeholder="Search emojis (e.g. 'happy', 'pizza', 'heart')"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full h-12 pl-12 pr-4 rounded-xl border-none ring-1 ring-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder:text-slate-400 font-medium transition-all"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Sidebar Categories (Desktop) */}
                    <div className="hidden sm:flex flex-col gap-2 p-3 border-r border-slate-100 bg-slate-50/50 w-20 overflow-y-auto shrink-0">
                        {EMOJI_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all gap-1 ${activeCategory === cat.id && !searchQuery
                                        ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5'
                                        : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                    }`}
                                title={cat.name}
                            >
                                <cat.icon size={24} strokeWidth={2.5} />
                            </button>
                        ))}
                    </div>

                    {/* Emoji Grid */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 scroll-smooth">
                        {searchQuery && suggested.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-3xl">🤔</div>
                                <h4 className="text-slate-900 font-bold text-lg">No matches found</h4>
                                <p className="text-slate-500 max-w-xs mt-2">Try searching for something else like "smile" or "cat".</p>
                            </div>
                        ) : (
                            <div>
                                {!searchQuery && (
                                    <h4 className="text-2xl font-bold text-slate-900 mb-6 capitalize px-2">
                                        {EMOJI_CATEGORIES.find(c => c.id === activeCategory)?.name}
                                    </h4>
                                )}
                                <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-2">
                                    {filteredEmojis.map((emoji, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleEmojiClick(emoji.char)}
                                            onMouseEnter={() => setHoveredEmoji(emoji)}
                                            onMouseLeave={() => setHoveredEmoji(null)}
                                            className={`aspect-square flex items-center justify-center text-3xl hover:bg-white hover:scale-110 hover:shadow-lg rounded-2xl transition-all duration-200 cursor-pointer emoji-font ${selectedEmoji === emoji.char ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''
                                                }`}
                                            title={emoji.name}
                                        >
                                            {emoji.char}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer with Custom Status */}
                {selectedEmoji && (
                    <div className="border-t border-slate-100 bg-white p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="text-6xl emoji-font">{selectedEmoji}</div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Add a status message (optional)
                                </label>
                                <input
                                    type="text"
                                    value={statusMessage}
                                    onChange={(e) => setStatusMessage(e.target.value)}
                                    placeholder="e.g., Working from home, At the gym, Feeling great!"
                                    maxLength={100}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleConfirm} className="flex-1">
                                Update Vibe
                            </Button>
                            <Button onClick={() => setSelectedEmoji('')} variant="outline">
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Preview Footer */}
                {!selectedEmoji && (
                    <div className="h-14 bg-white border-t border-slate-100 flex items-center px-6 justify-between">
                        <span className="text-slate-400 text-sm font-medium">
                            {hoveredEmoji ? (
                                <span className="text-indigo-600 animate-in fade-in flex items-center gap-2">
                                    <span className="text-2xl emoji-font">{hoveredEmoji.char}</span>
                                    {hoveredEmoji.name}
                                </span>
                            ) : (
                                "Hover to see emoji name"
                            )}
                        </span>
                        <div className="sm:hidden flex gap-4">
                            {EMOJI_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                                    className={`text-slate-400 hover:text-indigo-600 ${activeCategory === cat.id ? 'text-indigo-600' : ''}`}
                                >
                                    <cat.icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
