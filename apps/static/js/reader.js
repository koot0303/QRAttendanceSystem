const video = document.querySelector("#camera");
const canvas = document.querySelector("#picture");
const ctx = canvas.getContext("2d");
let lastCode = null;

window.onload = () => {
    const constraints = {
        audio: false,
        video: {
            width: 300,
            height: 200,
            facingMode: "user"
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            video.play();
            checkPicture();
        };
    })
    .catch((err) => {
        console.error(err.name + ": " + err.message);
        document.querySelector("#result").innerHTML = "カメラの起動に失敗しました。";
    });
};

function checkPicture() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
        if (code.data !== lastCode) {
            lastCode = code.data;
            setQRResult("#result", code.data);
            drawLine(ctx, code.location);
            sendQRData(code.data);
        }
    }

    setTimeout(() => {
        checkPicture();
    }, 300);
}

function sendQRData(data) {
    const courseId = "{{ course.id }}";

    fetch('/attendances/save_attendance/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: new URLSearchParams({
            'qr_data': data,
            'course_id': courseId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Attendance recorded successfully');
            document.querySelector("#result").innerHTML += "<br>出席が記録されました。";
        } else {
            console.error('Error:', data.message);
            document.querySelector("#result").innerHTML += "<br>エラー: " + data.message;
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
        document.querySelector("#result").innerHTML += "<br>サーバーへの送信に失敗しました。";
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function drawLine(ctx, pos, options={color:"blue", size:5}) {
    ctx.strokeStyle = options.color;
    ctx.lineWidth = options.size;
    ctx.beginPath();
    ctx.moveTo(pos.topLeftCorner.x, pos.topLeftCorner.y);
    ctx.lineTo(pos.topRightCorner.x, pos.topRightCorner.y);
    ctx.lineTo(pos.bottomRightCorner.x, pos.bottomRightCorner.y);
    ctx.lineTo(pos.bottomLeftCorner.x, pos.bottomLeftCorner.y);
    ctx.lineTo(pos.topLeftCorner.x, pos.topLeftCorner.y);
    ctx.stroke();
}

function setQRResult(id, data) {
    document.querySelector(id).innerHTML = escapeHTML(data);
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;")
                .replace(/'/g, "&#x27;")
                .replace(/`/g, "&#x60;")
                .replace(/"/g, "&quot;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/\n/g, "<br>");
}