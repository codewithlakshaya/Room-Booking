let rooms = ["Alpha", "Beta", "Gamma", "Theta"];
let bookings = [];
let bookingCounter = 1;

const roomColors = {
    "Alpha": "#4CAF50",
    "Beta": "#FF9800",
    "Gamma": "#2196F3",
    "Theta": "#9C27B0"
};

// Populate room dropdown
const roomSelect = document.getElementById("room");
rooms.forEach(room => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
});

// Booking form submission
document.getElementById("booking-form").addEventListener("submit", function(e){
    e.preventDefault();
    const room = document.getElementById("room").value;
    const user = document.getElementById("user").value;
    const date = document.getElementById("date").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    if (!date) { showMessage("❌ Please select a date", false); return; }
    if (start >= end) { showMessage("❌ Invalid time range", false); return; }

    const overlap = bookings.some(b => 
        b.room === room && b.date === date && !(end <= b.start || start >= b.end)
    );
    if (overlap) { showMessage("❌ Room already booked.", false); return; }

    bookings.push({id: bookingCounter++, room, user, date, start, end});
    updateBookingsTable();
    showMessage("✅ Room booked successfully!", true);
    this.reset();
});

// Show message
function showMessage(msg, success){
    const el = document.getElementById("booking-msg");
    el.textContent = msg;
    el.style.color = success ? "green" : "red";
}

// Cancel booking
function cancelBooking(id){
    bookings = bookings.filter(b => b.id !== id);
    updateBookingsTable();
    showMessage("✅ Booking cancelled.", true);
}

// Calendar setup
const calendarDiv = document.getElementById("calendar");
const hours = [];
for(let h=9; h<21; h++){
    hours.push(`${h}:00`);
}

// Render calendar
function renderCalendar(){
    calendarDiv.innerHTML = "";

    // Top-left corner
    const topLeft = document.createElement("div");
    topLeft.className = "time-header";
    topLeft.textContent = "Room / Time";
    calendarDiv.appendChild(topLeft);

    // Top row: hours
    hours.forEach(hour => {
        const th = document.createElement("div");
        th.className = "time-header";
        th.textContent = hour;
        calendarDiv.appendChild(th);
    });

    let selectedDate = document.getElementById("date").value;
    if (!selectedDate) selectedDate = new Date().toISOString().split("T")[0];

    rooms.forEach(room => {
        // Room name cell
        const roomCell = document.createElement("div");
        roomCell.className = "room-cell";
        roomCell.textContent = room;
        calendarDiv.appendChild(roomCell);

        // Hour slots
        hours.forEach(hour => {
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.style.position = "relative";
            slot.style.overflow = "visible"; // allow tooltip to appear

            bookings.forEach(b => {
                if(b.room === room && b.date === selectedDate){
                    const startH = parseInt(b.start.split(":")[0]);
                    const startM = parseInt(b.start.split(":")[1]);
                    const endH = parseInt(b.end.split(":")[0]);
                    const endM = parseInt(b.end.split(":")[1]);
                    const currentH = parseInt(hour.split(":")[0]);

                    const hourStartTotal = currentH * 60;
                    const hourEndTotal = hourStartTotal + 60;
                    const bookingStartTotal = startH * 60 + startM;
                    const bookingEndTotal = endH * 60 + endM;

                    const overlapStart = Math.max(hourStartTotal, bookingStartTotal);
                    const overlapEnd = Math.min(hourEndTotal, bookingEndTotal);

                    if(overlapStart < overlapEnd){
                        const bookingDiv = document.createElement("div");
                        bookingDiv.style.position = "absolute";
                        bookingDiv.style.left = ((overlapStart - hourStartTotal)/60)*100 + "%";
                        bookingDiv.style.width = ((overlapEnd - overlapStart)/60)*100 + "%";
                        bookingDiv.style.backgroundColor = roomColors[b.room];
                        bookingDiv.style.height = "100%";
                        bookingDiv.style.color = "white";
                        bookingDiv.style.fontSize = "12px";
                        bookingDiv.style.fontWeight = "bold";
                        bookingDiv.style.display = "flex";
                        bookingDiv.style.alignItems = "center";
                        bookingDiv.style.justifyContent = "center";
                        bookingDiv.style.overflow = "visible";

                        // Tooltip / Cloud
                        bookingDiv.classList.add("tooltip");
                        bookingDiv.setAttribute("data-tooltip", `${b.user} has booked ${b.room} from ${b.start} to ${b.end}`);

                        bookingDiv.textContent = b.user;

                        slot.appendChild(bookingDiv);
                    }
                }
            });

            calendarDiv.appendChild(slot);
        });
    });
}

// Update booking table
function updateBookingsTable(){
    const tbody = document.querySelector("#bookings-table tbody");
    tbody.innerHTML = "";
    bookings.forEach(b=>{
        const row = document.createElement("tr");
        row.innerHTML = `<td>${b.id}</td><td>${b.room}</td><td>${b.date}</td>
        <td>${b.start} - ${b.end}</td><td>${b.user}</td>
        <td><button onclick="cancelBooking(${b.id})">Cancel</button></td>`;
        tbody.appendChild(row);
    });
    renderCalendar();
}

// Refresh calendar on date change
document.getElementById("date").addEventListener("change", renderCalendar);

updateBookingsTable();
renderCalendar();
