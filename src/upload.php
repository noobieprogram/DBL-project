<?php

// Pieter and Daan

ini_set('post_max_size', '64M');
ini_set('upload_max_filesize', '64M');

$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);

$reponse = array(
    'type' => 'success',
    'message' => 'yah'
);

function create_reponse($res) {
    return json_encode($res);
}

// Create upload folder if not exists yet
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

// Check if file already exists
if (file_exists($target_file)) {
    $reponse['type'] = 'error';
    $reponse['message'] = 'File already exists';
    echo(json_encode($reponse));
    die();
}

// if everything is ok, try to upload file
if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    $reponse['type'] = 'success';
    $reponse['message'] = 'The file ' . basename($_FILES["fileToUpload"]["name"]). ' has been uploaded!';
    echo(json_encode($reponse));
    die();
} else {
    $reponse['type'] = 'error';
    $reponse['message'] = 'Sorry, there was an error uploading: ' . print_r($_FILES["fileToUpload"], true);
    echo(json_encode($reponse));
    die();
}
