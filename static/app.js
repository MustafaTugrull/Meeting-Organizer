function addMeeting() {
    var form = document.getElementById("meetingForm");
    var formData = new FormData(form);

    fetch('/meetings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        form.reset();
        showMeetingList();
    })
    .catch(error => console.error('Error:', error));
}

function showMeetingForm() {
    document.getElementById("addMeetingSection").style.display = "block";
    document.getElementById("meetingListSection").style.display = "none";
    document.getElementById("updateDeleteSection").style.display = "none";
}

function addDeleteButton(meetingId) {
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Sil";
    deleteButton.classList.add("btn", "btn-outline-danger", "mx-4"); // Bootstrap sınıfları ekleyin
    deleteButton.onclick = function() {
        deleteMeeting(meetingId);
    };
    return deleteButton;
}

function addUpdateButton(meetingId) {
    var updateButton = document.createElement("button");
    updateButton.innerHTML = "Güncelle";
    updateButton.classList.add("btn", "btn-outline-warning", "mx-2"); // Bootstrap sınıfları ekleyin
    updateButton.onclick = function() {
        loadMeetingDetails(meetingId);
    };
    return updateButton;
}

function fillUpdateForm(data) {
    document.getElementById("updateSubject").value = data.subject;
    document.getElementById("updateDate").value = data.date;
    document.getElementById("updateStartTime").value = data.start_time;
    document.getElementById("updateEndTime").value = data.end_time;
    document.getElementById("updateParticipants").value = data.participants.join(', ');
}

function enableForm() {
    var form = document.getElementById("updateDeleteForm");
    for (var i = 0; i < form.elements.length; i++) {
        form.elements[i].removeAttribute("readonly");
    }
}

function showMeetingList() {
    fetch('/meetings')
        .then(response => response.json())
        .then(data => {
            var meetingList = document.getElementById("meetingList");
            meetingList.innerHTML = "";
            data.forEach(meeting => {

                var cardContainer = document.createElement("div");
                cardContainer.classList.add("container", "mb-4");

                var card = document.createElement("div");
                card.classList.add("card");

                var cardBody = document.createElement("div");
                cardBody.classList.add("card-body");

                var cardTitle = document.createElement("h5");
                cardTitle.classList.add("card-title");
                cardTitle.innerHTML = meeting.subject;

                var cardText = document.createElement("p");
                cardText.classList.add("card-text");
                cardText.innerHTML = `<strong>Date:</strong> ${meeting.date}<br>`;
                cardText.innerHTML += `<strong>Time:</strong> ${meeting.start_time} - ${meeting.end_time}<br>`;
                cardText.innerHTML += `<strong>Participants:</strong> ${meeting.participants.join(', ')}`;

                var buttonsDiv = document.createElement("div");
                buttonsDiv.classList.add("mt-3");

                buttonsDiv.appendChild(addUpdateButton(meeting.id));
                buttonsDiv.appendChild(addDeleteButton(meeting.id));

                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(buttonsDiv);

                card.appendChild(cardBody);
                cardContainer.appendChild(card);
                meetingList.appendChild(cardContainer);
            });

            var meetingSelect = document.getElementById("meetingSelect");
            meetingSelect.innerHTML = "<option value=''>Toplantı Seçin</option>";
            data.forEach(meeting => {
                var option = document.createElement("option");
                option.value = meeting.id;
                option.text = meeting.subject;
                meetingSelect.appendChild(option);
            });

            showMeetingListSection();
        })
        .catch(error => console.error('Error:', error));
}

function showMeetingListSection() {
    document.getElementById("addMeetingSection").style.display = "none";
    document.getElementById("meetingListSection").style.display = "block";
    document.getElementById("updateDeleteSection").style.display = "none";
}

function showAddMeetingSection() {
    document.getElementById("addMeetingSection").style.display = "block";
    document.getElementById("meetingListSection").style.display = "none";
    document.getElementById("updateDeleteSection").style.display = "none";
}

function showUpdateDeleteSection() {
    document.getElementById("addMeetingSection").style.display = "none";
    document.getElementById("meetingListSection").style.display = "none";
    document.getElementById("updateDeleteSection").style.display = "block";
}

function loadMeetingDetails(meetingId) {
fetch(`/meeting/${meetingId}`)
.then(response => response.json())
.then(data => {
    fillUpdateForm(data);
    enableForm();  // enableForm fonksiyonunu burada çağırın
    showUpdateDeleteSection();
})
.catch(error => console.error('Error:', error));
}

function enableForm() {
var form = document.getElementById("updateDeleteForm");
for (var i = 0; i < form.elements.length; i++) {
form.elements[i].removeAttribute("readonly");
}
}

function fillUpdateForm(data) {
var form = document.getElementById("updateDeleteForm");
for (var i = 0; i < form.elements.length; i++) {
var element = form.elements[i];
var fieldName = element.name;
if (fieldName in data) {
    element.value = data[fieldName];
}
}
}

function saveUpdate() {
var meetingId = document.getElementById("meetingSelect").value;

if (meetingId) {
var form = document.getElementById("updateDeleteForm");
var formData = {
    subject: document.getElementById("updateSubject").value,
    date: document.getElementById("updateDate").value,
    start_time: document.getElementById("updateStartTime").value,
    end_time: document.getElementById("updateEndTime").value,
    participants: document.getElementById("updateParticipants").value.split(',').map(item => item.trim())
};

fetch(`/meeting/${meetingId}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    alert(data.message);
    form.reset();
    showMeetingList();
})
.catch(error => console.error('Error:', error));
} else {
alert('Lütfen güncellenecek bir toplantı seçin.');

}
}

function deleteMeeting(meetingId) {
    fetch(`/meeting/${meetingId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        showMeetingList();
    })
    .catch(error => console.error('Error:', error));
}


