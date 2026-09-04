/* =========================
   AUDIT DATA
========================= */

const auditData = [

    {
        audit: "AUD001",
        transaction: "TXN1001",
        user: "T102",
        role: "Teller",
        activity: "Money Transfer",
        amount: "₹10,000",
        date: "01/09/2026",
        time: "10:30 AM",
        device: "Branch Terminal 01",
        ip: "192.168.1.20",
        previousHash: "A82F91D7C9",
        currentHash: "A82F91D7C9",
        status: "Verified"
    },

    {
        audit: "AUD002",
        transaction: "TXN1002",
        user: "T105",
        role: "Manager",
        activity: "Login",
        amount: "--",
        date: "01/09/2026",
        time: "10:45 AM",
        device: "Branch Terminal 02",
        ip: "192.168.1.21",
        previousHash: "B72D31E8F1",
        currentHash: "B72D31E8F1",
        status: "Verified"
    },

    {
        audit: "AUD003",
        transaction: "TXN1003",
        user: "T102",
        role: "Teller",
        activity: "Profile Update",
        amount: "--",
        date: "01/09/2026",
        time: "11:05 AM",
        device: "Branch Terminal 01",
        ip: "192.168.1.20",
        previousHash: "C71A92D8F4",
        currentHash: "D91B42E7F5",
        status: "Suspicious"
    },

    {
        audit: "AUD004",
        transaction: "TXN1004",
        user: "T108",
        role: "Teller",
        activity: "Withdrawal",
        amount: "₹5,000",
        date: "01/09/2026",
        time: "11:20 AM",
        device: "Branch Terminal 03",
        ip: "192.168.1.25",
        previousHash: "E82F72D1C9",
        currentHash: "E82F72D1C9",
        status: "Verified"
    },

    {
        audit: "AUD005",
        transaction: "TXN1005",
        user: "T108",
        role: "Teller",
        activity: "Money Transfer",
        amount: "₹50,000",
        date: "01/09/2026",
        time: "11:45 AM",
        device: "Branch Terminal 03",
        ip: "192.168.1.25",
        previousHash: "A82F91D7C9",
        currentHash: "B91F42D8E1",
        status: "Tampered"
    },

    {
        audit: "AUD006",
        transaction: "TXN1006",
        user: "T110",
        role: "Manager",
        activity: "Password Change",
        amount: "--",
        date: "01/09/2026",
        time: "12:10 PM",
        device: "Admin Terminal",
        ip: "192.168.1.30",
        previousHash: "F72A31D8C5",
        currentHash: "F72A31D8C5",
        status: "Verified"
    },

    {
        audit: "AUD007",
        transaction: "TXN1007",
        user: "T111",
        role: "Teller",
        activity: "Money Transfer",
        amount: "₹75,000",
        date: "01/09/2026",
        time: "12:30 PM",
        device: "Branch Terminal 04",
        ip: "192.168.1.31",
        previousHash: "K82F91D7C9",
        currentHash: "K82F91D7C9",
        status: "Failed"
    }

];


/* =========================
   PAGE ELEMENTS
========================= */

const dashboardPage =
    document.getElementById("dashboardPage");

const auditPage =
    document.getElementById("auditPage");

const dashboardBtn =
    document.getElementById("dashboardBtn");

const auditBtn =
    document.getElementById("auditBtn");

const openAudit =
    document.getElementById("openAudit");


/* =========================
   PAGE NAVIGATION
========================= */

function showDashboard() {

    dashboardPage.classList.remove("hidden");

    auditPage.classList.add("hidden");

    dashboardBtn.classList.add("active");

    auditBtn.classList.remove("active");
}


function showAudit() {

    dashboardPage.classList.add("hidden");

    auditPage.classList.remove("hidden");

    dashboardBtn.classList.remove("active");

    auditBtn.classList.add("active");

    displayTable();
}


dashboardBtn.addEventListener("click", showDashboard);

auditBtn.addEventListener("click", showAudit);

openAudit.addEventListener("click", showAudit);


/* =========================
   DISPLAY TABLE
========================= */

function displayTable() {

    const table =
        document.getElementById("auditTable");

    const search =
        document.getElementById("searchBox")
        .value
        .toLowerCase();

    const status =
        document.getElementById("statusFilter")
        .value;

    const activity =
        document.getElementById("activityFilter")
        .value;


    const filteredData =
        auditData.filter(item => {

            const searchMatch =
                item.audit.toLowerCase().includes(search) ||
                item.transaction.toLowerCase().includes(search) ||
                item.user.toLowerCase().includes(search);

            const statusMatch =
                status === "All" ||
                item.status === status;

            const activityMatch =
                activity === "All" ||
                item.activity === activity;

            return searchMatch &&
                   statusMatch &&
                   activityMatch;

        });


    table.innerHTML = "";


    if (filteredData.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:25px;">
                    No audit records found
                </td>
            </tr>
        `;

        return;
    }


    filteredData.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${item.audit}</td>

            <td>${item.transaction}</td>

            <td>${item.user}</td>

            <td>${item.activity}</td>

            <td>${item.amount}</td>

            <td>
                ${item.date}<br>
                ${item.time}
            </td>

            <td>
                <span class="status ${item.status.toLowerCase()}">
                    ${item.status}
                </span>
            </td>

            <td>
                <button
                    class="view-button"
                    onclick="viewDetails('${item.audit}')">
                    View
                </button>
            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================
   SEARCH + FILTER
========================= */

document
    .getElementById("searchBox")
    .addEventListener("input", displayTable);

document
    .getElementById("statusFilter")
    .addEventListener("change", displayTable);

document
    .getElementById("activityFilter")
    .addEventListener("change", displayTable);


/* =========================
   VIEW DETAILS
========================= */

function viewDetails(id) {

    const item =
        auditData.find(
            data => data.audit === id
        );


    if (!item) {
        return;
    }


    const details =
        document.getElementById("detailsContent");


    details.innerHTML = `

        <div class="detail">
            <label>Audit ID</label>
            <span>${item.audit}</span>
        </div>

        <div class="detail">
            <label>Transaction ID</label>
            <span>${item.transaction}</span>
        </div>

        <div class="detail">
            <label>User ID</label>
            <span>${item.user}</span>
        </div>

        <div class="detail">
            <label>User Role</label>
            <span>${item.role}</span>
        </div>

        <div class="detail">
            <label>Activity</label>
            <span>${item.activity}</span>
        </div>

        <div class="detail">
            <label>Amount</label>
            <span>${item.amount}</span>
        </div>

        <div class="detail">
            <label>Date</label>
            <span>${item.date}</span>
        </div>

        <div class="detail">
            <label>Time</label>
            <span>${item.time}</span>
        </div>

        <div class="detail">
            <label>Device</label>
            <span>${item.device}</span>
        </div>

        <div class="detail">
            <label>IP Address</label>
            <span>${item.ip}</span>
        </div>

        <div class="detail">
            <label>Previous Record Hash</label>
            <span class="hash">
                ${item.previousHash}
            </span>
        </div>

        <div class="detail">
            <label>Current Record Hash</label>
            <span class="hash">
                ${item.currentHash}
            </span>
        </div>

        <div class="detail">
            <label>Integrity Status</label>
            <span class="${getColor(item.status)}">
                ${item.status}
            </span>
        </div>

    `;


    document
        .getElementById("detailsPopup")
        .classList.remove("hidden");
}


function getColor(status) {

    if (status === "Verified") {
        return "green";
    }

    if (status === "Suspicious") {
        return "orange";
    }

    return "red";
}


/* =========================
   CLOSE DETAILS
========================= */

function closeDetails() {

    document
        .getElementById("detailsPopup")
        .classList.add("hidden");
}


document
    .getElementById("closePopup")
    .addEventListener("click", closeDetails);


document
    .getElementById("closeDetails")
    .addEventListener("click", closeDetails);


/* =========================
   VERIFY INTEGRITY
========================= */

document
    .getElementById("verifyButton")
    .addEventListener("click", function () {

        const popup =
            document.getElementById("verifyPopup");

        popup.classList.remove("hidden");


        setTimeout(function () {

            popup.innerHTML = `

                <div class="verify-box">

                    <div
                        style="
                        font-size:45px;
                        color:#42d69b;
                        ">
                        ✓
                    </div>

                    <h2 style="color:#42d69b;">
                        Integrity Verified
                    </h2>

                    <p>
                        Audit records have been checked
                        successfully.
                    </p>

                    <br>

                    <button
                        class="blue-button"
                        onclick="closeVerify()">
                        Done
                    </button>

                </div>

            `;

        }, 1500);

    });


function closeVerify() {

    document
        .getElementById("verifyPopup")
        .classList.add("hidden");

    location.reload();

}


/* =========================
   INTEGRITY ALERTS
========================= */

function displayAlerts() {

    const alertBox =
        document.getElementById("alerts");


    const alerts =
        auditData.filter(
            item => item.status !== "Verified"
        );


    alertBox.innerHTML = "";


    alerts.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "alert " +
            item.status.toLowerCase();


        let icon = "!";

        if (item.status === "Tampered" ||
            item.status === "Failed") {

            icon = "×";
        }


        div.innerHTML = `

            <div class="alert-icon">
                ${icon}
            </div>

            <div>

                <h4>
                    ${item.audit}
                </h4>

                <p>
                    ${item.activity}
                    · User ${item.user}
                </p>

                <small class="${getColor(item.status)}">
                    ${item.status}
                </small>

            </div>

        `;


        div.addEventListener(
            "click",
            function () {
                viewDetails(item.audit);
            }
        );


        alertBox.appendChild(div);

    });

}


/* =========================
   EXPORT CSV
========================= */

document
    .getElementById("exportButton")
    .addEventListener("click", function () {

        let csv =
            "Audit ID,Transaction ID,User ID,Activity,Amount,Date,Time,Status\n";


        auditData.forEach(item => {

            csv +=
                `${item.audit},` +
                `${item.transaction},` +
                `${item.user},` +
                `${item.activity},` +
                `${item.amount},` +
                `${item.date},` +
                `${item.time},` +
                `${item.status}\n`;

        });


        const blob =
            new Blob([csv], {
                type: "text/csv"
            });


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "Audit_Integrity_Report.csv";


        link.click();


        URL.revokeObjectURL(url);

    });


/* =========================
   START APPLICATION
========================= */

displayTable();

displayAlerts();

showDashboard();