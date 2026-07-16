<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set header to JSON
header('Content-Type: application/json');

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize form data
$fullName = isset($_POST['fullName']) ? trim(htmlspecialchars($_POST['fullName'])) : '';
$organization = isset($_POST['organization']) ? trim(htmlspecialchars($_POST['organization'])) : '';
$inquiryType = isset($_POST['inquiryType']) ? trim(htmlspecialchars($_POST['inquiryType'])) : '';
$email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Validate required fields
if (empty($fullName) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address']);
    exit;
}

// Email recipient
$toEmail = 'principal.coaching.partners@gmail.com';
$subject = 'New Inquiry from ' . $fullName;

// Build email body
$emailBody = "
===========================================
NEW INQUIRY FROM WEBSITE
===========================================

Full Name: $fullName
Email: $email
Organization: $organization
Inquiry Type: $inquiryType

Message:
$message

===========================================
This email was sent from the Contact Form on Dr. Michael Bishop's website.
===========================================
";

// Email headers
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send email
$mailSent = mail($toEmail, $subject, $emailBody, $headers);

if ($mailSent) {
    // Send success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your inquiry has been sent successfully. We will get back to you soon.'
    ]);
    
    // Optional: Log the submission
    $logFile = __DIR__ . '/contact-submissions.log';
    $logEntry = date('Y-m-d H:i:s') . " | " . $fullName . " | " . $email . " | " . $inquiryType . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your inquiry. Please try again or contact us directly.'
    ]);
}
?>
