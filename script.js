document.addEventListener("DOMContentLoaded", function() {
    const trackerBody = document.getElementById("trackerBody");
    
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

        trackerBody.innerHTML = "";
        let startDate = new Date(data[0].date);
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
    }

    window.addVisit = function() {
        const visitDetails = document.getElementById("visitDetails").value.trim();
        const visitRemarks = document.getElementById("visitRemarks").value.trim();
        const visitDate = document.getElementById("visitDate").value;

        if (visitDetails !== "") {
            // Create an object with the new visit data
            const newVisit = {
                date: visitDate,
                details: visitDetails,
                remarks: visitRemarks
            };

            // Send a POST request to the server to add the new visit data
            fetch('/add-visit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newVisit)
            })
            .then(response => {
                if (response.ok) {
                    console.log('Visit data added successfully');
                    // Refresh the page to update the displayed data
                    location.reload();
                } else {
                    console.error('Failed to add visit data:', response.statusText);
                    alert('Failed to add visit data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error adding visit data:', error);
                alert('Error adding visit data. Please try again.');
            });
        } else {
            alert("Please enter visit details.");
        }
    };

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
