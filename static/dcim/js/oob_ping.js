/**
 * OOB IP Ping functionality for NetBox DCIM
 */

function pingOobIP(button) {
  const ip = button.getAttribute("data-ip");
  const resultSpan = button.nextElementSibling;

  if (!ip) {
    console.error("No IP address found");
    return;
  }

  // Disable button and show loading state
  button.disabled = true;
  button.innerHTML =
    '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Pinging...';
  resultSpan.style.display = "none";

  // Make AJAX request to ping endpoint
  fetch("/dcim/ping-oob-ip/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({ ip: ip }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Hide button and show result
      button.style.display = "none";
      resultSpan.style.display = "inline";

      if (data.status === "online") {
        resultSpan.innerHTML = '<span class="badge bg-success">Online</span>';
      } else if (data.status === "offline") {
        resultSpan.innerHTML = '<span class="badge bg-danger">Offline</span>';
      } else {
        resultSpan.innerHTML = '<span class="badge bg-warning">Error</span>';
      }

      // Show button again after 5 seconds
      setTimeout(() => {
        button.style.display = "inline-block";
        button.disabled = false;
        button.innerHTML = "Ping";
        resultSpan.style.display = "none";
      }, 5000);
    })
    .catch((error) => {
      console.error("Ping request failed:", error);

      // Reset button state
      button.disabled = false;
      button.innerHTML = "Ping";

      // Show error result
      resultSpan.style.display = "inline";
      resultSpan.innerHTML = '<span class="badge bg-danger">Error</span>';

      // Hide error after 3 seconds
      setTimeout(() => {
        resultSpan.style.display = "none";
      }, 3000);
    });
}

function getCSRFToken() {
  // Get CSRF token from meta tag or cookie
  const token = document.querySelector('meta[name="csrf-token"]');
  if (token) {
    return token.getAttribute("content");
  }

  // Fallback to cookie method
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrftoken") {
      return value;
    }
  }

  return "";
}

// Initialize when document is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("OOB Ping functionality loaded");
});
