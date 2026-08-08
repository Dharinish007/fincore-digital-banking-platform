function filterTable() {

    let searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    let statusFilter = document.getElementById("statusFilter").value;

    let fromDate = document.getElementById("fromDate").value;
    let toDate = document.getElementById("toDate").value;

    let rows = document.querySelectorAll("#auditTable tbody tr");

    rows.forEach(function(row) {

        let auditId = row.cells[0].innerText.toLowerCase().trim();
        let user = row.cells[1].innerText.toLowerCase().trim();
        let customer = row.cells[2].innerText.toLowerCase().trim();

        let date = row.cells[5].innerText.trim();
        let status = row.cells[6].innerText.trim();

        // Search filter
        let matchesSearch =
            auditId.includes(searchInput) ||
            user.includes(searchInput) ||
            customer.includes(searchInput);

        // Status filter
        let matchesStatus =
            statusFilter === "All" ||
            status === statusFilter;

        // Date filter
        let matchesDate = true;

        if (fromDate !== "" && date < fromDate) {
            matchesDate = false;
        }

        if (toDate !== "" && date > toDate) {
            matchesDate = false;
        }

        // Show row only when ALL filters match
        if (matchesSearch && matchesStatus && matchesDate) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }

    });
    updateCounts();
}
            
        

        function updateCounts() {

    let rows = document.querySelectorAll("#auditTable tbody tr");

    let total = 0;
    let success = 0;
    let failed = 0;

    rows.forEach(function(row){

        if(row.style.display !== "none"){

            total++;

            let status = row.cells[6].innerText.trim();

            if(status === "Success"){
                success++;
            }
            else if(status === "Failed"){
                failed++;
            }
        }

    });

    document.getElementById("totalLogs").innerText = total;
    document.getElementById("successLogs").innerText = success;
    document.getElementById("failedLogs").innerText = failed;

      }

      function viewDetails(button) {
    let row = button.parentElement.parentElement;

    let auditId = row.cells[0].innerText;
    let user = row.cells[1].innerText;
    let customer = row.cells[2].innerText;
    let action = row.cells[3].innerText;
    let module = row.cells[4].innerText;
    let date = row.cells[5].innerText;
    let status = row.cells[6].innerText;

    alert(
        "Audit ID : " + auditId +
        "\nUser : " + user +
        "\nCustomer : " + customer +
        "\nAction : " + action +
        "\nModule : " + module +
        "\nDate : " + date +
        "\nStatus : " + status
    );
}
  
function refreshLogs() {

    // Clear search
    document.getElementById("searchInput").value = "";

    // Reset status
    document.getElementById("statusFilter").value = "All";

    // Clear dates
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";

    // Show all rows
    let rows = document.querySelectorAll("#auditTable tbody tr");

    rows.forEach(function(row) {
        row.style.display = "";
    });

    // Update dashboard counts
    updateCounts();
}
