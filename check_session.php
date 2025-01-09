<?php
session_start();

if (isset($_SESSION['username'])) {
    echo json_encode(["connected" => true, "username" => $_SESSION['username']]);
} else {
    echo json_encode(["connected" => false]);
}
?>
