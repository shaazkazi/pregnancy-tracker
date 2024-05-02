document.addEventListener("DOMContentLoaded", function() {
    const trackerBody = document.getElementById("trackerBody");
    const weeksDaysFooter = document.createElement("div");
    weeksDaysFooter.id = "weeksDaysFooter"; // Add id to the footer element
    
    // Fetch data from updates.json
    fetch('updates.json')
        .then(response => response.json())
        .then(jsonData => {
            renderData(jsonData);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    function renderData(data) {
        // Sort the data by date in ascending order
        data.sort((a, b) => new Date(a.date) - new Date(b.date));

        let startDate = new Date(data[0].date);
        trackerBody.innerHTML = "";
        data.forEach((entry, index) => {
            const currentDate = new Date(entry.date);
            const daysDifference = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            const row = document.createElement("tr");

            // Format the date
            const formattedDate = formatDate(currentDate);

            row.innerHTML = `
                <td>${daysDifference}</td>
                <td>${formattedDate}</td>
                <td>${entry.details}</td>
                <td>${entry.remarks}</td>
                <td>${entry.reportLink ? `<a href="${entry.reportLink}" target="_blank">View Report</a>` : ''}</td>
            `;
            trackerBody.appendChild(row);
        });

        // Calculate and display current weeks and days
        const currentDate = new Date();
        const daysDifference = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const weeks = Math.floor(daysDifference / 7);
        const days = daysDifference % 7;
        weeksDaysFooter.textContent = `${weeks} weeks and ${days} days`;
        document.body.appendChild(weeksDaysFooter);
    }

    // Function to format the date as "dd-Mon-yy" (e.g., 02-Apr-24)
    function formatDate(date) {
        const day = ("0" + date.getDate()).slice(-2); // Ensure two digits for the day
        const month = getMonthString(date.getMonth()); // Get the month abbreviation
        const year = date.getFullYear().toString().substring(2); // Get the last two digits of the year
        return `${day}-${month}-${year}`;
    }

    function getMonthString(monthIndex) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months[monthIndex];
    }
});
