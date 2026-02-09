document.addEventListener("DOMContentLoaded", function () {

    /* ======================
       FORM SUMMARY LOGIC
    ====================== */

    const form = document.getElementById("supportForm");
    const overlay = document.getElementById("success-overlay");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const age = document.getElementById("age").value;
            const contact = document.getElementById("contact").value;
            const issue = document.getElementById("issue").value;
            const description = document.getElementById("description").value;

            const summary =
`A ${age}-year-old patient named ${name} has requested ${issue.toLowerCase()}.
The issue described is: "${description}".
Contact number provided: ${contact}.`;

            document.getElementById("summary").textContent = summary;

            /* ---------- SAVE REPORT ---------- */
            const reports = JSON.parse(localStorage.getItem("reports")) || [];

            reports.unshift({
                text: summary,
                time: new Date().toLocaleString()
            });

            if (reports.length > 5) reports.pop();

            localStorage.setItem("reports", JSON.stringify(reports));
            renderReports();

            /* ---------- SHOW SUCCESS POPUP ---------- */
            overlay.style.display = "flex";

            /* ---------- AUTO CLOSE + RESET ---------- */
            setTimeout(() => {
                overlay.style.display = "none";
                form.reset();
            }, 2500);
        });
    }

    /* ======================
       CHATBOT TOGGLE LOGIC
    ====================== */

    const toggle = document.getElementById("chatbot-toggle");
    const popup = document.getElementById("chatbot-popup");
    const closeBtn = document.getElementById("close-chat");

    if (toggle && popup && closeBtn) {
        toggle.addEventListener("click", () => {
            popup.style.display = "flex";
        });

        closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
        });
    }

    /* ======================
       CHATBOT MESSAGE LOGIC
    ====================== */

    window.sendMessage = function () {
        const input = document.getElementById("userInput");
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        addMessage(text, "user");
        input.value = "";

        setTimeout(() => botReply(text), 600);
    };

    function renderReports() {
        const list = document.getElementById("recentReports");
        if (!list) return;

        const reports = JSON.parse(localStorage.getItem("reports")) || [];
        list.innerHTML = "";

        reports.forEach(report => {
            const li = document.createElement("li");
            li.textContent = `${report.time} — ${report.text.substring(0, 60)}...`;
            list.appendChild(li);
        });
    }

    /* Load reports on page load */
    renderReports();

    function addMessage(text, type) {
        const chatBox = document.getElementById("chatBox");
        if (!chatBox) return;

        const msg = document.createElement("div");
        msg.className = `message ${type}`;

        const bubble = document.createElement("div");
        bubble.className = "bubble";
        bubble.textContent = text;

        msg.appendChild(bubble);
        chatBox.appendChild(msg);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    let lastIntent = null;

    function botReply(text) {
        const t = text.toLowerCase().trim();
        let reply = "";
        let intent = null;

        if (/^(hi|hello|hey|hii|hlo)$/i.test(t)) {
            intent = "greeting";
            reply = "Hello 👋 I’m here to help you with healthcare support. What do you need today?";
        }
        else if (
            t.includes("emergency") ||
            t.includes("urgent") ||
            t.includes("accident") ||
            t.includes("bleeding") ||
            t.includes("serious")
        ) {
            intent = "emergency";
            reply =
                "🚨 This sounds like an emergency.\n\n" +
                "Please submit the form immediately and select Emergency.\n" +
                "Our team will prioritize this case.";
        }
        else if (
            t.includes("medical") ||
            t.includes("doctor") ||
            t.includes("treatment") ||
            t.includes("hospital")
        ) {
            intent = "medical";
            reply =
                "You can request medical help by filling the patient support form.\n\n" +
                "Please describe the issue clearly.";
        }
        else if (
            t.includes("mental") ||
            t.includes("stress") ||
            t.includes("depression") ||
            t.includes("anxiety")
        ) {
            intent = "mental";
            reply =
                "Mental health support is available 💙.\n\n" +
                "Select Mental Health in the form and describe how you feel.";
        }
        else if (
            t.includes("medicine") ||
            t.includes("tablet") ||
            t.includes("drug")
        ) {
            intent = "medicine";
            reply =
                "Medicine support can be requested through the form.\n\n" +
                "Mention the medicine name if known.";
        }
        else if (
            t.includes("contact") ||
            t.includes("ngo") ||
            t.includes("help line")
        ) {
            intent = "contact";
            reply =
                "You can contact the NGO using details provided after submission.";
        }
        else if (lastIntent === "medical") {
            reply = "Is this a new medical issue or an ongoing condition?";
        }
        else if (lastIntent === "mental") {
            reply = "Would you like emotional support or professional guidance?";
        }
        else {
            reply =
                "I need a bit more detail.\n\n" +
                "You can ask about:\n" +
                "• Medical help\n" +
                "• Mental health support\n" +
                "• Emergency assistance";
        }

        lastIntent = intent || lastIntent;
        addMessage(reply, "bot");
    }

});
