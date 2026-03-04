// Mock database (in a real app, this would be a backend)
let projects = [
    { client: 'Acme Inc.', project: 'Brand guidelines', amount: 1200, due: '2026-05-15', status: 'sent', type: 'contract', aiFollowUp: false },
    { client: 'Creative Studio', project: 'Website redesign', amount: 3400, due: '2026-04-30', status: 'overdue', type: 'invoice', aiFollowUp: true },
    { client: 'TechStart', project: 'Logo design', amount: 800, due: '2026-05-22', status: 'draft', type: 'invoice', aiFollowUp: false }
];

let activities = [
    '🤖 AI parsed project details for "Acme Inc."',
    '📧 AI sent follow‑up to Creative Studio (overdue)',
    '✅ Contract signed by TechStart'
];

// ---------- DASHBOARD (index.html) ----------
if (document.querySelector('.dashboard')) {
    const inputEl = document.getElementById('projectInput');
    const generateBtn = document.getElementById('generateBtn');
    const reviewCard = document.getElementById('reviewCard');
    const extractedDiv = document.getElementById('extractedData');
    const approveBtn = document.getElementById('approveBtn');
    const editBtn = document.getElementById('editBtn');
    const projectList = document.getElementById('projectList');
    const activityFeed = document.getElementById('activityFeed');

    // Render active projects
    function renderProjects() {
        projectList.innerHTML = '';
        projects.slice(0, 3).forEach(p => {
            const item = document.createElement('div');
            item.className = 'project-item';
            item.innerHTML = `
                <span class="client">${p.client}</span>
                <span class="status ${p.status}">${p.status}</span>
            `;
            projectList.appendChild(item);
        });
    }

    // Render activity feed
    function renderActivities() {
        activityFeed.innerHTML = activities.map(a => `<li>${a}</li>`).join('');
    }

    // Mock AI parsing
    generateBtn.addEventListener('click', () => {
        const text = inputEl.value.trim();
        if (!text) return;

        // Simulate AI extraction
        // In real app: fetch('/api/parse', { method: 'POST', body: JSON.stringify({ text }) })
        const mockExtracted = {
            client: 'Joe Bloggs',
            project: 'Logo design',
            amount: '$500',
            due: 'in 2 weeks'
        };
        extractedDiv.innerHTML = `
            <p><strong>Client:</strong> ${mockExtracted.client}</p>
            <p><strong>Project:</strong> ${mockExtracted.project}</p>
            <p><strong>Amount:</strong> ${mockExtracted.amount}</p>
            <p><strong>Due:</strong> ${mockExtracted.due}</p>
        `;
        reviewCard.classList.remove('hidden');

        // Simulate AI activity log
        activities.unshift(`🤖 AI parsed project for "${mockExtracted.client}"`);
        renderActivities();
    });

    approveBtn.addEventListener('click', () => {
        // In real app: save to backend, generate PDFs, send emails
        alert('✅ Contract/Invoice sent to client! (mock)');
        // Add to projects
        projects.push({
            client: 'Joe Bloggs',
            project: 'Logo design',
            amount: 500,
            due: '2026-06-01',
            status: 'sent',
            type: 'invoice',
            aiFollowUp: false
        });
        renderProjects();
        reviewCard.classList.add('hidden');
        inputEl.value = '';
    });

    editBtn.addEventListener('click', () => {
        reviewCard.classList.add('hidden');
    });

    // Initial render
    renderProjects();
    renderActivities();
}

// ---------- INBOX (inbox.html) ----------
if (document.getElementById('inboxTableBody')) {
    const tbody = document.getElementById('inboxTableBody');

    function renderInbox() {
        tbody.innerHTML = projects.map((p, index) => {
            const toggleClass = p.aiFollowUp ? 'toggle active' : 'toggle';
            return `
                <tr>
                    <td>${p.client}</td>
                    <td>${p.type}</td>
                    <td><span class="status ${p.status}">${p.status}</span></td>
                    <td>${p.due}</td>
                    <td>
                        <div class="${toggleClass}" data-index="${index}"></div>
                    </td>
                </tr>
            `;
        }).join('');

        // Add toggle click handlers
        document.querySelectorAll('.toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                projects[index].aiFollowUp = !projects[index].aiFollowUp;
                renderInbox(); // re-render to update toggle state
                // Log activity
                const client = projects[index].client;
                const state = projects[index].aiFollowUp ? 'enabled' : 'disabled';
                activities.unshift(`🤖 AI follow‑up ${state} for ${client}`);
            });
        });
    }

    renderInbox();
}
