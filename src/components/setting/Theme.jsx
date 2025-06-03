import React, { useEffect } from 'react'

const Theme = ({ title }) => {
    const themeGroups = [
        {
            name: "Classiques",
            themes: [
                { label: "Light (défaut)", value: "light" },
                { label: "Dark", value: "dark" },
                { label: "Cupcake", value: "cupcake" },
                { label: "Emerald", value: "emerald" },
            ]
        },
        {
            name: "Rétro/Futuristes",
            themes: [
                { label: "Retro", value: "retro" },
                { label: "Cyberpunk", value: "cyberpunk" },
                { label: "Synthwave", value: "synthwave" },
                { label: "Wireframe", value: "wireframe" },
            ]
        },
        {
            name: "Nature",
            themes: [
                { label: "Garden", value: "garden" },
                { label: "Forest", value: "forest" },
                { label: "Aqua", value: "aqua" },
                { label: "Autumn", value: "autumn" },
            ]
        },
        {
            name: "Spéciaux",
            themes: [
                { label: "Valentine", value: "valentine" },
                { label: "Halloween", value: "halloween" },
                { label: "Winter", value: "winter" },
                { label: "Dracula", value: "dracula" },
            ]
        },
        {
            name: "Autres",
            themes: [
                { label: "Corporate", value: "corporate" },
                { label: "Luxury", value: "luxury" },
                { label: "Business", value: "business" },
                { label: "Coffee", value: "coffee" },
            ]
        }
    ];

    useEffect(() => {
        const savedTheme = localStorage.getItem('themeConf');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const radioBtn = document.querySelector(`input[value="${savedTheme}"]`);
            if (radioBtn) radioBtn.checked = true;
        }
    }, []);

    const handleThemeChange = (e) => {
        const selectedTheme = e.target.value;
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('themeConf', selectedTheme);
    };

    return (
        <div>
            <div className='menu-title text-2xl mb-5'># {title}</div>

            <div className='grid grid-cols-3 gap-4 w-full p-4'>
                {themeGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                        <div className="join join-vertical w-full">
                            {group.themes.map(({ label, value }) => (
                                <input
                                    key={value}
                                    type="radio"
                                    name="theme-buttons"
                                    className="btn theme-controller join-item"
                                    aria-label={label}
                                    value={value}
                                    onChange={handleThemeChange}
                                    defaultChecked={
                                        localStorage.getItem('themeConf') === value ||
                                        (!localStorage.getItem('themeConf') && value === 'light')
                                    }
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Theme