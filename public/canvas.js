(function() {
    var canvas = document.getElementById("sigCanvas");
    if (!canvas) {
        return;
    }
    var ctx = canvas.getContext("2d");
    var signed = false;
    var sig = document.getElementsByClassName('signatures')[0]

    var mouseDown = canvas.addEventListener("mousedown", pointerDown, false);
    canvas.addEventListener("mouseup", pointerUp, false);
    ctx.strokeStyle = "#fff";

    function pointerDown(evt) {
        ctx.beginPath();
        ctx.moveTo(evt.offsetX, evt.offsetY);
        canvas.addEventListener("mousemove", paint, false);
    }

    function pointerUp(evt) {
        sig.value = canvas.toDataURL();
        canvas.removeEventListener("mousemove", paint);
        paint(evt);
        document.body.removeEventListener("mouseup", pointerUp);
    }

    function paint(evt) {
        ctx.lineTo(evt.offsetX, evt.offsetY);
        ctx.stroke();
    }

    document
        .getElementById("clearButton")
        .addEventListener("click", function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
})();
