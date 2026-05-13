/* Header Navigation */
const navbarToggle = document.querySelector('.navbar-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
});

/* Header Navigation Theme Toggle */
const toggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.body.classList.add(currentTheme);
    if (currentTheme === 'night-mode') {
        toggle.checked = true;
    }
}

toggle.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.replace('light-mode', 'night-mode') || document.body.classList.add('night-mode');
        localStorage.setItem('theme', 'night-mode');
    } else {
        document.body.classList.remove('night-mode')
        localStorage.setItem('theme', 'light-mode');
    }
});

/* Header Navigation Scrolling */
const aboutMenuItem = document.querySelector('a[href="#aboutContainer"]');
const aboutContainer = document.querySelector('#aboutContainer');

aboutMenuItem.addEventListener('click', (e) => {
    e.preventDefault();
    aboutContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

const featureMenuItem = document.querySelector('a[href="#featureContainer"]');
const featureContainer = document.querySelector('#featureContainer');

featureMenuItem.addEventListener('click', (e) => {
    e.preventDefault();
    featureContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

const faqMenuItem = document.querySelector('a[href="#faqContainer"]');
const faqContainer = document.querySelector('#faqContainer');

faqMenuItem.addEventListener('click', (e) => {
    e.preventDefault();
    faqContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

/* Drag & Drop Upload */
const chooseFileContainer = document.querySelector('.choose-file-container');
const chooseFileInput = chooseFileContainer.querySelector('input');
const fileUploadButton = chooseFileContainer.querySelector('button');
const selectedFile = document.getElementById('selectedFile');

chooseFileContainer.querySelectorAll('input').forEach((inputElement) => {
    chooseFileContainer.querySelectorAll('.upload-icon').forEach(uploadIcon => {
        uploadIcon.addEventListener('click', (e) => {
            e.preventDefault();
            inputElement.click();
            //console.log('Upload Icon Clicked.');
        });
    });
});

chooseFileInput.addEventListener('change', (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    const file = formData.get('file');
    if (file && file.name) {
        const fileName = file.name;
        selectedFile.style.display = 'block';
        selectedFile.textContent = `Selected file: ${fileName}`;
        fileUploadButton.style.display = 'block';
    }
});

fileUploadButton.addEventListener('click', (e) => {
    e.preventDefault();
    //console.log('Upload Button Clicked.');
    chooseFileContainer.submit();
});

chooseFileContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    chooseFileContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    //console.log('Dragging file over.');
});

chooseFileContainer.addEventListener('dragleave', (e) => {
    e.preventDefault();
    chooseFileContainer.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    //console.log(Dragging file leave.');
});

chooseFileContainer.addEventListener('drop', (e) => {
    //console.log('Dropped file.');
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
        chooseFileInput.files = e.dataTransfer.files;
        chooseFileContainer.submit();
        //console.log('Dropped File Submitted.');
    }
});

/* Upload From URL */
const urlContainer = document.querySelector('.url-container');
const uploadButton = urlContainer.querySelector('button');

uploadButton.addEventListener('click', (e) => {
    e.preventDefault();
    urlContainer.submit();
    //console.log('Upload Button Clicked.');
});

/* Upload Result */
const uploadResultContainer = document.querySelector('.upload-result-container');
const copyUrlButton = uploadResultContainer.querySelector('button');
const resultUrl = uploadResultContainer.querySelector('a');

copyUrlButton.addEventListener('click', async (e) => {
    const resultLink = resultUrl.href;
    try {
        await navigator.clipboard.writeText(resultLink);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
});

/*Feature Cards*/
const cardData = [
    {
        feature_image: "assets/icons/ui/upload-icon.png",
        feature_title: "File Upload",
        feature_description: "Quickly transfer local files to Cloudflare R2 with high-speed, edge-optimized processing."
    },
    {
        feature_image: "assets/icons/ui/url-upload-icon.png",
        feature_title: "Upload From URL",
        feature_description: "Save time by fetching files directly from web links to your storage, bypassing local downloads."
    },
    {
        feature_image: "assets/icons/ui/drag-upload-icon.png",
        feature_title: "Drag & Drop Upload",
        feature_description: "Move files effortlessly from your desktop into the browser for a fluid and modern user experience."
    },
    {
        feature_image: "assets/icons/ui/api-upload-icon.png",
        feature_title: "API Upload",
        feature_description: "Automate workflows by uploading files programmatically via POST requests or cURL."
    },
    {
        feature_image: "assets/icons/ui/file-manage-icon.png",
        feature_title: "Manage Files",
        feature_description: "Rename or delete stored assets directly from the manage files section for effortless organization."
    },
    {
        feature_image: "assets/icons/ui/web-app-icon.png",
        feature_title: "Lightweight Web Application",
        feature_description: "Enjoy a fast, responsive interface hosted entirely on Cloudflare Workers and Pages for near-instant loading."
    }
];

function renderFeatureCards() {
    const featureCardContainer = document.querySelector('.feature-card-container');

    cardData.forEach(item => {
        const featureCard = `<div class="feature-card"> 
        <img class="feature-image" src="${item.feature_image}" alt="${item.feature_title}">
        <h3>${item.feature_title}</h3>
        <span>${item.feature_description}</span>
        </div`;
        featureCardContainer.innerHTML += featureCard;
    });
}

document.addEventListener('DOMContentLoaded', renderFeatureCards);

/* FAQ Accordion */
const workerAPIUrl = window.location.href + 'api/upload';

const faqData = [
    {
        faq_question: "What is CFUpload ?",
        faq_answer: "<b>CFUpload</b> is a web-based tool hosted on <b>Cloudflare Workers</b> that allows you to upload large files to <b>Cloudflare R2</b>. It bypasses standard Worker size limits by using <b>multipart uploading</b>, which splits large files into smaller chunks for successful processing and storage."
    },
    {
        faq_question: "When to use CFUpload ?",
        faq_answer: "Use <b>CFUpload</b> when you need to upload files larger than the standard Cloudflare Worker limit (<b>100MB</b> to <b>500MB</b>) to R2 storage. It is ideal for handling high-resolution media, large backups, or datasets that require <b>multipart uploading</b> to ensure stability and speed."
    },
    {
        faq_question: "Do i need hosting for this tool ?",
        faq_answer: "No separate hosting is required. <b>CFUpload</b> is a serverless application that deploys directly onto <b>Cloudflare Workers</b> and <b>Cloudflare Pages</b>, utilizing Cloudflare's global edge network to handle all processing and storage."
    },
    {
        faq_question: "Is CFUpload free to use ?",
        faq_answer: "Yes, <b>CFUpload</b> is completely free and open-source. However, while the tool itself costs nothing, you may still be subject to usage costs from <b>Cloudflare’s R2</b> and <b>Workers</b> free tier limits depending on your upload volume."
    },
    {
        faq_question: "Can i upload any type of files ?",
        faq_answer: "Yes, <b>CFUpload</b> supports all file types. There are no format restrictions, allowing you to upload anything from documents and images to high-resolution videos and compressed archives directly to your R2 bucket."
    },
    {
        faq_question: "Can I upload via API ?",
        faq_answer: "Yes. You can perform programmatic uploads by sending a <b>POST</b> request to " + `<a href='${workerAPIUrl}'>${workerAPIUrl}</a>` + ". This allows you to integrate <b>CFUpload’s</b> large-file capabilities into your own scripts or external applications."
    },
    {
        faq_question: "How can i manage my files ?",
        faq_answer: "You can easily organize and maintain your Cloudflare R2 bucket through the <b>Manage Files</b> section. Follow these steps to modify or remove your uploaded content: <h3>How to Access File Management</h3>To view and organize your stored data, navigate to the management interface: <ol><li>Log in to your dashboard and select <b>'My Files'</b> from the main navigation menu.</li><li>This will open the <b>'Manage Files'</b> view, displaying a list of all current objects stored in your bucket.</li></ol> <h3>Renaming a File</h3>To change the display name or path of an existing file: <ol><li>Locate the specific file you wish to modify.</li><li>Select the <b>Rename</b> option (typically found in the file's action menu or via an edit icon).</li><li>Enter the new filename, ensuring you keep the correct file extension (e.g., .png, .pdf).</li><li>Confirm the change to update the object key in your R2 bucket.</li></ol> <h3>Deleting a File</h3> If you no longer need a specific file, you can remove it permanently: <ul><li>Find the file within the list and select the <b>Delete</b> button.</li><li>A confirmation prompt will appear to prevent accidental data loss.</li><li><b>Confirm the deletion</b>. Once processed, the file is immediately removed from your Cloudflare R2 storage and will no longer be accessible via its public or private URL.</li></ul> <b>Note:</b> Deletion is permanent. Please ensure you have backups of important data before confirming."
    }
];

function renderFAQAccordion() {

    const faqAccordion = document.querySelector('.faq-accordion');

    faqData.forEach(item => {
        const faqItem = `<div class ="faq-item">
        <button class="faq-question">${item.faq_question}<span class="accordion-action-icon">+</span></button>
        <div class="faq-answer">
        <div class="faq-answer-content">${item.faq_answer}</div>
        </div>
        </div>`;
        faqAccordion.innerHTML += faqItem;
    });
}

document.addEventListener('DOMContentLoaded', renderFAQAccordion);

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(el => {
                el.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
});

/* Rename Function For Worker (R2 Object List) */
async function renameFile(oldName) {
    const newName = prompt("Enter new filename (including extension):", oldName);

    if (!newName || newName === oldName) return;

    const res = await fetch(`/rename/${encodeURIComponent(oldName)}/${encodeURIComponent(newName)}`, { method: 'POST' });
    if (res.ok) {
        alert("File renamed!");
        location.reload();
    } else {
        alert("Rename failed.");
    }
}

/* Delete Function For Worker (R2 Object List) */
async function deleteFile(filename) {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    const res = await fetch(`/delete/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    if (res.ok) {
        alert("File deleted.");
        location.reload();
    } else {
        alert("Delete failed.");
    }
}

/*Footer Copyright Year*/
const currentYear = new Date().getFullYear();
document.getElementById('year').textContent = currentYear;