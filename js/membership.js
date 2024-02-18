var phoneNumber;
var timerCount = 60; // Set the initial timer value in seconds

async function sendInfo() {
    try {
        let formData = new FormData();
        formData.append('login_token', localStorage.getItem('login_token'));
        let response = await fetch(AUTH_API + "/user_information/", {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.status === 200) {
            if (data.data !== undefined) {
                phoneNumber = data.data.phone_number;
                try {
                    let formData = new FormData();
                    formData.append('mobile', phoneNumber);
                    let response = await fetch("https://api.tehran-athletics.ir/api/send-code", {
                        method: 'POST',
                        body: formData,
                    });
                    const data = await response.json();
                    if (response.status !== 200) {
                        Swal.fire({
                            icon: "error",
                            title: 'شماره شما ثبت نشده است',
                            text: data.errors.message,
                            showConfirmButton: !1,
                            timer: 2000
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: 'مشکلی رخ داده است',
                        text: error,
                        showConfirmButton: !1,
                        timer: 2000
                    });
                }
            }
        } else {
            Swal.fire({
                icon: "info",
                title: 'مشکلی رخ داده است',
                text: data.message,
                showConfirmButton: !1,
                timer: 2000
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: 'مشکلی رخ داده است',
            text: error,
            showConfirmButton: !1,
            timer: 2000
        });
    }
}

async function checkPayment() {
    var digit1 = document.getElementById('digit1').value;
    var digit2 = document.getElementById('digit2').value;
    var digit3 = document.getElementById('digit3').value;
    var digit4 = document.getElementById('digit4').value;
    var digit5 = document.getElementById('digit5').value;

    var paymentCode = digit1 + digit2 + digit3 + digit4 + digit5;
    var resultDiv = document.getElementById('result');

    if(digit1 && digit2 && digit3 && digit4 && digit5) {
        try {
            let formData = new FormData();
            formData.append('mobile', phoneNumber);
            formData.append('code', paymentCode);
            let response = await fetch("https://api.tehran-athletics.ir/api/login", {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.status === 200) {
                if (data.data !== undefined) {
                    var name = data.data.name;
                    var hasCredit = data.data.hasCredit;
                    var expired = data.data.expired;
                    stopTimer();
                    // Navigate to another page after 2 seconds (adjust as needed)
                    setTimeout(async function () {
                        try {
                            let formData = new FormData();
                            formData.append('login_token', localStorage.getItem('login_token'));
                            formData.append('phone_number', phoneNumber);
                            formData.append('hasCredit', hasCredit);
                            let response = await fetch(AUTH_API + "/change_credit/", {
                                method: 'POST',
                                body: formData,
                            });
                            const data = await response.json();
                            if (response.status === 200) {
                                resultDiv.innerHTML = 'درستی کد شما تایید شد ، ' + name + 'کاربر  ';
                                resultDiv.style.color = 'green';
                                window.location.href = '../';
                            } else {
                                Swal.fire({
                                    icon: "error",
                                    title: 'مشکلی رخ داده است',
                                    text: data.errors.message,
                                    showConfirmButton: !1,
                                    timer: 2000
                                });
                            }
                        } catch (error) {
                            Swal.fire({
                                icon: "error",
                                title: 'مشکلی رخ داده است',
                                text: error,
                                showConfirmButton: !1,
                                timer: 2000
                            });
                        }
                    }, 1000);
                }
            } else {
                resultDiv.innerHTML = 'کد وارد شده صحیح نمی‌باشد';
                resultDiv.style.color = 'red';
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: 'مشکلی رخ داده است',
                text: error,
                showConfirmButton: !1,
                timer: 2000
            });
        }
    } else {
        resultDiv.innerHTML = 'لطفا کد را کامل وارد کنید';
        resultDiv.style.color = 'red';
    }
}

function resendCode() {
    // Add logic to resend the code (this is just a placeholder)
    alert('Code resent!');
    document.querySelector('button.resend').setAttribute('disabled', 'disabled');
    // Reset the timerCount and enable the timer
    timerCount = 60; // Set the initial timer value in seconds
    document.getElementById('timerCount').textContent = timerCount;
    document.getElementById('timer').classList.remove('red');
    // Start the timer countdown again
    timerInterval = setInterval(enableResend, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function enableResend() {
    timerCount--;
    document.getElementById('timerCount').textContent = formatTimer(timerCount);

    if (timerCount <= 0) {
        clearInterval(timerInterval);
        // Disable the "Re-send" button
        document.querySelector('button.resend').removeAttribute('disabled');
    } else if (timerCount <= 10) {
        document.getElementById('timer').classList.add('red');
    }
}

function formatTimer(count) {
    // Format the timer value to always have two digits
    return count < 10 ? '0' + count : count;
}

function focusNext(currentInput, nextInputId) {
    document.getElementById('result').innerHTML = '';
    if (currentInput.value.length === currentInput.maxLength) {
        document.getElementById(nextInputId).focus();
    }
}

function checkAndFocus(currentInput, nextButtonId) {
    if (currentInput.value.length === currentInput.maxLength) {
        document.getElementById(nextButtonId).click();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.getElementById("backButton");

    backButton.addEventListener("click", function (event) {
        window.location.href = '../';
    });
});

sendInfo();
// Timer countdown
var timerInterval = setInterval(enableResend, 1000);