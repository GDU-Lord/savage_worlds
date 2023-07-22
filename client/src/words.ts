export enum lang {
    UA = 0,
    EN = 1,
    RD = 2
};
export type language = lang.UA | lang.EN | lang.RD;

export default {
    // home
    "menu": ["Меню", "Main", "Menju"],
    "open_character": ["Відкрити персонажа", "Open a character", "Erjofnn ajn-persa"],
    "open_campaign": ["Відкрити кампанію", "Open a campaign", "Erjofnn ajn-kampaniju"],
    "create_campaign": ["Створити кампанію", "New campaign", "Noe kampanija"],
    // character or master token
    "provide_your_token": ["Введіть ваш токен", "Providde your token", "Gesstorbn vass token"],
    "confirm": ["Підтвердити", "Confirm", "Adabrirn"],
    "back": ["Назад", "Back", "Curjuk"],
    // master
    "campaign": ["Кампанія", "Campaign", "Kampanija"],
    "update": ["Оновити", "Update", "Obnojn"],
    "revoke_token": ["Скинути токен", "Revoke token", "Represirn di-token"],
    "add_character": ["Додати персонажа", "New character", "Noe pers"],
    "delete_character": ["Видалити персонажа", "Delete a character", "Represirn ajn-persa"],
    "provide_character_token": ["Введіть токен персонажа", "Provide the character's token", "Gesstorbn token di-persa"],
    "confirm_delete_character": ["Ви впевнені, що хочете видалити цього персонажа?", "Are you sure that you want to delete this character?", "Vy zixer sso vyxotyt represirn cjoho persa?"],
    "confirm_revoke_token": ["Ви впевнені, що хочете скинути цей токен?", "Are you sure that you want to revoke this token?", "Vy zixer sso vyxotyt represirn di-token?"],
    "copy_token": ["Скопіювати токен", "Copy token", "Kopirn di-token"],
    "characters": ["Персонажі", "Characters", "Persy"],
    // sheet
    // other params
    "copy_link": ["Скопіювати посилання", "Copy link", "Kopirn di-zsylku"],
    "summary": ["Короткий опис", "Summary", "Kurc obgesstorb"],
    "lock": ["Заблокувати", "Lock", "Zablokirn"],
    "edit": ["Редагувати", "Edit", "Redahirn"],
    "player_name": ["Ім'я гравця", "Player name", "Imjja di-sspilera"],
    "name": ["Ім'я", "Name", "Imjja"],
    "description": ["Опис", "Description", "Obgesstorb"],
    "rase": ["Раса", "Rase", "Rasa"],
    "attribute_points": ["Бали атрибутів", "Attribute points", "Baly atrybutiv"],
    "skill_points": ["Бали вмінь", "Skill points", "Baly skiliv"],
    "bonus_points": ["Бонусні бали", "Bonus points", "Bonusisse baly"],
    "additional_spendings": ["Додаткові витрати", "Additional spendings", "Dogebnisse vytraty"],
    "size": ["Розмір", "Size", "Rozmir"],
    "speed": ["Швидкість", "Speed", "Ssnelst"],
    "weight_multiplier": ["Множник ваги", "Weight multiplier", "Mnozzer vahy"],
    "money": ["Гроші", "Money", "Ssyssi"],
    "wounds": ["Рани", "Wounds", "Rany"],
    "fatigue": ["Втома", "Fatigue", "Tilt"],
    "bennies": ["Бені", "Bennies", "Beni"],
    "other_parameters": ["Інші параметри", "Other parameters", "Andere parametry"],
    // tools
    "resources_tools": ["Ресурси та інструменти", "Tools and resourses", "Resursy j instrumenty"],
    "title": ["Назва", "Title", "Xajsung"],
    "weight": ["Вага", "Weight", "Vaha"],
    "quantity": ["Кількість", "Quantity", "Vifilistj"],
    // derived
    "derived_statistics": ["Похідна статистика", "Derived statistics", "Poxidna statystyka"],
    "parry": ["Захист", "Parry", "Zaxyst"],
    "toughness": ["Стійкість", "Toughness", "Stijkistj"],
    "load": ["Навантаження", "Encumbrance", "Navantazzenja"],
    "upgrades": ["Прокачка", "Advancement", "Prokaccka"],
    // armor
    "armor": ["Броня", "Armor", "Bronja"],
    "price": ["Ціна", "Price", "Cina"],
    "min_strength": ["Мін. сила", "Min. strength", "Min. syla"],
    "worn": ["Одягнено", "Worn", "Getragtisse"],
    "h_head": ["Г👩‍🦲", "H👩‍🦲", "K👩‍🦲"],
    "t_torso": ["Т🦺", "T🦺", "T🦺"],
    "a_arms": ["Р💪", "A💪", "R💪"],
    "l_legs": ["Н🦵", "L🦵", "N🦵"],
    // shields
    "bonus": ["Бонус", "Bonus", "Bonus"],
    "cover": ["Укриття", "Cover", "Ukryttja"],
    "shields": ["Щити", "Shields", "Ssit"],
    // weapons
    "damage": ["Ушкодження", "Damage", "Damah"],
    "armor_piercing": ["Проникнення", "Armor piercing", "Prabitie"],
    "range": ["Дистанція", "Range", "Dystancjjon"],
    "rate_of_fire": ["Частота", "Rate of fire", "Ccastota"],
    "blast": ["Вибух", "Blast", "Bavovna"],
    "details": ["Додатково", "Details", "Dogebnisse"],
    "melee": ["Ближня", "Melee", "Priventivna"],
    "ranged": ["Дальня", "Ranged", "Dalnja"],
    "throwable": ["Кидальна", "Throwable", "Ssiknisse"],
    "weapons": ["Зброя", "Weapons", "Vafe"],
    // note, edges & hindrances
    "edges": ["Сильні сторони", "Edges", "Plotni zajte"],
    "hindrances": ["Недоліки", "Hindrances", "Minusy"],
    "notes": ["Нотатки", "Notes", "Notatky"],
    // attributes
    "attributes": ["Атрибути", "Attributes", "Atrybuty"],
    "agility": ["Спритність", "Agility", "Ggynga"],
    "smarts": ["Розум", "Smarts", "Rozum"],
    "spirit": ["Дух", "Spirit", "Dzen"],
    "strength": ["Сила", "Strength", "Syla"],
    "vigor": ["Міцність", "Vigor", "Plotnistj"],
    // skills
    "skills": ["Вміння", "Skills", "Skily"],
    "common_knowledge": ["Загальні Знання", "Common Knowledge", "Alcuzamnisse Gevus"],
    "notice": ["Уважність", "Notice", "Havuzznistj"],
    "persuasion": ["Переконання", "Persuasion", "Perekonanja"],
    "stealth": ["Непомітність", "Stealth", "Myssung"],
    "athletics": ["Атлетика", "Athletics", "Atletyka"],
    "boating": ["Судноплавство", "Boating", "Sudnossvimung"],
    "driving": ["Водіння", "Driving", "Gefarung"],
    "fighting": ["Боротьба", "Fighting", "Zakusj"],
    "thievery": ["Злодійство", "Thievery", "Zlomaxung"],
    "piloting": ["Пілотування", "Piloting", "Pilotirn"],
    "riding": ["Їзда Верхи", "Riding", "Gefarung Verxy"],
    "shooting": ["Стрільба", "Shooting", "Ssisn"],
    "gambling": ["Азартні Ігри", "Gambling", "Azartni Sspily"],
    "healing": ["Лікування", "Healing", "Xilinh"],
    "research": ["Дослідження", "Research", "Dosliggenja"],
    "repair": ["Ремонт", "Repair", "Reparirung"],
    "survival": ["Виживання", "Survival", "Vyzzyvanja"],
    "taunt": ["Насмішка", "Taunt", "Opusk"],
    "guts": ["Сміливість", "Guts", "Smilyvistj"],
    "intimidation": ["Залякування", "Intimidation", "Zallakuvnja"],
    "psionics": ["Псионіка", "Psionics", "Psyonika"],
    "focus": ["Концентрація", "Focus", "Koncentracjjon"],
    "faith": ["Віра", "Faith", "Glaube"],
    "electronics": ["Електроніка", "Electronics", "Elektronika"],
    "battle": ["Тактика", "Battle", "Taktikull"],
    "weird_science": ["Дивна Наука", "Weird Science", "Pevtazzna Nauka"],
    "spellcasting": ["Заклинання", "Spellcasting", "Zaklynanja"],
    "performance": ["Виступ", "Performance", "Performens"],
    "hacking": ["Гакерство", "Hacking", "Xakinh"],
    "academics": ["Академіка", "Academics", "Akademika"],
    "occult": ["Окультизм", "Occult", "Okultizm"],
    // other
    "untitled": ["Без Назви", "Untitled", "One Xajsunga"],
    "character": ["Персонаж", "Character", "Pers"],
    "modifier": ["Модифікатор", "Modifier", "Modyfikator"],
};