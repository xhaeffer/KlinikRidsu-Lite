function formatTime(timeString) {
    if (timeString !== "") {
        const parsedTime = new Date("1970-01-01T" + timeString + "Z");
        const formattedTime = parsedTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
        return formattedTime;
    }
    return "-";
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.JamMulai').forEach(function (element) {
        element.textContent = formatTime(element.textContent);
    });

    document.querySelectorAll('.JamSelesai').forEach(function (element) {
        element.textContent = formatTime(element.textContent);
    });
});