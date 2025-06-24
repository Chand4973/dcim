# OOB IP Ping Status Implementation

## Overview

This implementation adds a new "OOB IP Ping Status" column to the NetBox DCIM devices table that allows users to ping the Out-of-Band (OOB) IP address of devices and see real-time connectivity status.

## Features Implemented

### 1. New Table Column

- **Column Name**: "OOB IP Ping Status"
- **Location**: `tables/devices.py` - DeviceTable class
- **Functionality**: Shows a ping button for devices with OOB IP addresses
- **Behavior**:
  - Displays "Ping" button for devices with OOB IP
  - Shows "—" for devices without OOB IP
  - Replaces button with status badge after ping
  - Auto-restores button after 5 seconds

### 2. Backend Ping Functionality

- **Endpoint**: `/dcim/ping-oob-ip/`
- **Method**: POST (AJAX)
- **Location**: `views.py` - `ping_oob_ip()` function
- **Security**: CSRF protection enabled
- **Response**: JSON with status (online/offline/error)

### 3. Frontend JavaScript

- **File**: `static/dcim/js/oob_ping.js`
- **Functions**:
  - `pingOobIP(button)` - Main ping functionality
  - `getCSRFToken()` - CSRF token retrieval
- **UI Features**:
  - Loading spinner during ping
  - Bootstrap badges for status display
  - Automatic button restoration
  - Error handling and display

### 4. Table Configuration

- **Column Field**: `oob_ip_ping_status`
- **Configurable**: Yes - can be added/removed via "Configure Table"
- **Default**: Not included in default columns (user must add manually)
- **Ordering**: Not orderable (ping status is dynamic)

## Files Modified/Created

### Modified Files:

1. **`tables/devices.py`**
   - Added `format_html` import
   - Added `oob_ip_ping_status` column definition
   - Added `render_oob_ip_ping_status()` method
   - Added column to Meta.fields list

2. **`views.py`**
   - Added ping view function `ping_oob_ip()`
   - Added required imports for JSON, subprocess, etc.

3. **`urls.py`**
   - Added URL pattern for ping endpoint

### Created Files:

1. **`static/dcim/js/oob_ping.js`**
   - JavaScript functionality for ping buttons
   - AJAX request handling
   - UI state management

2. **`templates/dcim/inc/oob_ping_js.html`**
   - Template fragment for JavaScript inclusion

3. **`demo_devices.html`**
   - Demo page showing the functionality

## Usage Instructions

### For End Users:

1. Navigate to **Devices > Devices > Devices**
2. Click **"Configure Table"** option
3. Add **"OOB IP Ping Status"** column to your table view
4. Click **"Ping"** button next to devices with OOB IP addresses
5. View real-time ping results (Online/Offline badges)

### For Developers:

1. The column automatically appears in the configurable columns list
2. Only devices with `oob_ip` field populated will show ping buttons
3. The ping uses system `ping` command with 1 packet and 3-second timeout
4. Results are cached in the UI for 5 seconds before allowing re-ping

## Technical Details

### Ping Implementation:

- Uses `subprocess.run()` with `ping -c 1 -W 3 [ip]`
- 5-second total timeout for safety
- Returns JSON with status: 'online', 'offline', or 'error'

### Security Considerations:

- CSRF protection on ping endpoint
- Input validation for IP addresses
- Subprocess timeout to prevent hanging
- Limited to OOB IP addresses only

### UI/UX Features:

- Bootstrap 5 compatible styling
- Loading indicators during ping
- Color-coded status badges (green=online, red=offline, yellow=error)
- Automatic UI state restoration
- Non-blocking AJAX requests

## Future Enhancements

Potential improvements that could be added:

1. Ping history/logging
2. Bulk ping functionality
3. Configurable ping timeout
4. IPv6 support
5. Ping statistics (response time, packet loss)
6. WebSocket for real-time updates
7. Scheduled ping monitoring

## Compatibility

- **NetBox Version**: Compatible with NetBox 3.x+ (Django-based)
- **Browser Support**: Modern browsers with fetch() API support
- **Dependencies**: Bootstrap 5, Django Tables 2
- **System Requirements**: System with `ping` command available
