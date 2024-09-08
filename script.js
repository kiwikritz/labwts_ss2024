document.addEventListener('DOMContentLoaded', () => {
    // Load the default language (English) when the page loads
    setLanguage('en');

    // Set up event listeners for language buttons
    document.querySelector('#languageSwitcher button[onclick="setLanguage(\'en\')"]').addEventListener('click', () => setLanguage('en'));
    document.querySelector('#languageSwitcher button[onclick="setLanguage(\'de\')"]').addEventListener('click', () => setLanguage('de'));

    // Set up event listeners for other buttons
    const donateButton = document.getElementById("donateButton");
    const mainHeading = document.getElementById("mainHeading");

    if (donateButton) {
        // Event listener for the donate button
        donateButton.addEventListener("click", () => {
            const message = "Donate your spare limb";

            // Original popup functionality
            displayPopup(message);

            // Fetch and display model names
            fetchModelNames().then(models => {
                displayModelPopup(models);
            });

            // Update heading style
            if (mainHeading) {
                mainHeading.style.color = "#301934";
                mainHeading.style.fontSize = "67px";
            }
        });
    }
});

// Function to set the language of the page
function setLanguage(lang) {
    // Construct the path to the JSON file
    const filePath = `./${lang}.json`;

    // Fetch the corresponding language JSON file
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${response.statusText}`);
            }
            return response.json();
        })
        .then(translations => {
            // List of elements to translate
            const elementsToTranslate = {
                headerTitle: 'header',
                searchTitle: 'search-container h2',
                searchInput: 'searchInput',
                searchButton: 'search-container button',
                introText1: 'info-box p:nth-of-type(1)',
                introText2: 'info-box p:nth-of-type(2)',
                introText3: 'info-box p:nth-of-type(3)',
                introductionTitle: '#main-content h2:nth-of-type(1)',
                introductionText: '#main-content p',
                advantagesTitle: '#main-content h2:nth-of-type(2)',
                increasedFunctionalityLink: '#main-content ul li:nth-of-type(1) a',
                naturalMovementLink: '#main-content ul li:nth-of-type(2) a',
                sensoryFeedbackLink: '#main-content ul li:nth-of-type(3) a',
                sensoryFeedbackText: '#sensory-feedback .info-box p:nth-of-type(1)',
                sensoryFeedbackDetails: '#sensory-feedback .info-box p:nth-of-type(2)',
                cyberFuture: '#main-content h2:nth-of-type(4)',
                donateButton: 'donateButton',
                footerText: 'footer',
                modelSubmissionTitle: '#modelSubmission h2',
                modelNameLabel: 'label[for="modelName"]',
                manufacturerLabel: 'label[for="manufacturer"]',
                featuresLabel: 'label[for="features"]',
                weightLabel: 'label[for="weight"]',
                batteryLifeLabel: 'label[for="batteryLife"]',
                maxLoadCapacityLabel: 'label[for="maxLoadCapacity"]',
                areaOfExploitationLabel: 'label[for="areaOfExploitation"]',
                keywordsLabel: 'label[for="keywords"]',
                submitModelButton: '#modelForm button[type="submit"]'
            };

            // Update text content based on the selected language translations
            for (let key in elementsToTranslate) {
                const element = document.querySelector(`#${elementsToTranslate[key]}`);
                if (element) {
                    if (key === 'searchInput') {
                        element.placeholder = translations[key];
                    } else if (key === 'footerText') {
                        element.innerHTML = translations[key];
                    } else {
                        element.textContent = translations[key];
                    }
                }
            }
        })
        .catch(error => console.error('Error loading language file:', error));
}

// Original popup function for the donate button
function displayPopup(message) {
    const popupResult = window.confirm(message);
    if (popupResult) {
        alert("Thank you for your generosity! Repomen are on their way to take your donation ;)");
    }
}

// Function to fetch model names from a JSON file
function fetchModelNames() {
    return fetch('data.json')
        .then(response => response.json())
        .then(data => data);
}

// Function to display a custom popup with model choices
function displayModelPopup(models) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'gray';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
    popup.style.zIndex = '1000';
    popup.style.color = 'black';

    const header = document.createElement('h2');
    header.textContent = 'Choose a Model';
    header.style.color = 'black';
    popup.appendChild(header);

    const list = document.createElement('ul');
    list.style.listStyleType = 'none';
    list.style.padding = '0';

    models.forEach(model => {
        const item = document.createElement('li');
        item.style.marginBottom = '10px';

        const button = document.createElement('button');
        button.textContent = model.Model;
        button.style.backgroundColor = 'white';
        button.style.color = 'black';
        button.style.border = '1px solid black';
        button.style.padding = '10px 20px';
        button.style.cursor = 'pointer';
        button.onclick = () => {
            alert(`You chose ${model.Model}. Thank you for your donation!`);
            document.body.removeChild(popup);
        };

        item.appendChild(button);
        list.appendChild(item);
    });

    popup.appendChild(list);
    document.body.appendChild(popup);
}

// Function to submit model data
function submitModel(event) {
    event.preventDefault();

    const modelName = document.getElementById('modelName').value;
    const manufacturer = document.getElementById('manufacturer').value;
    const features = document.getElementById('features').value.split(',').map(feature => feature.trim());

    const weight = document.getElementById('weight').value;
    const batteryLife = document.getElementById('batteryLife').value;
    const maxLoadCapacity = document.getElementById('maxLoadCapacity').value;

    const specifications = {
        Weight: weight,
        BatteryLife: batteryLife,
        MaximumLoadCapacity: maxLoadCapacity
    };

    const areaOfExploitation = document.getElementById('areaOfExploitation').value;
    const keywords = document.getElementById('keywords').value.split(',').map(keyword => keyword.trim());

    const newModel = {
        Model: modelName,
        Manufacturer: manufacturer,
        Features: features,
        Specifications: specifications,
        AreaOfExploitation: areaOfExploitation,
        Keywords: keywords
    };

    fetch('/add-model', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newModel)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Network response was not ok. Status: ${response.status}. Response: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Model added successfully!');
            document.getElementById('modelForm').reset();
        } else {
            alert('Failed to add model: ' + (data.message || 'Unknown error.'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add model.');
    });
}
