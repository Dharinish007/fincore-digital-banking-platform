<?php
require_once "db_connect.php";
if($_SERVER["REQUEST_METHOD"]!=="POST"){http_response_code(405);echo json_encode(["success"=>false,"message"=>"Only POST method is allowed"]);exit;}
$data=json_decode(file_get_contents("php://input"),true);
$customer_id=$data["customer_id"]??null;$document_type=$data["document_type"]??null;$document_reference=$data["document_reference"]??null;$extracted_name=$data["extracted_name"]??null;$extracted_id_number=$data["extracted_id_number"]??null;$extracted_date_of_birth=$data["extracted_date_of_birth"]??null;$extracted_gender=$data["extracted_gender"]??null;$extracted_address=$data["extracted_address"]??null;$ocr_confidence=$data["ocr_confidence"]??null;$ocr_status=$data["ocr_status"]??"Pending";
if(!$customer_id||!$document_type){http_response_code(400);echo json_encode(["success"=>false,"message"=>"customer_id and document_type are required"]);exit;}
$sql="INSERT INTO document_ocr (customer_id,document_type,document_reference,extracted_name,extracted_id_number,extracted_date_of_birth,extracted_gender,extracted_address,ocr_confidence,ocr_status,processed_at) VALUES (?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)";
$stmt=$conn->prepare($sql);if(!$stmt){http_response_code(500);echo json_encode(["success"=>false,"message"=>"Failed to prepare OCR query"]);exit;}
$stmt->bind_param("issssssdds",$customer_id,$document_type,$document_reference,$extracted_name,$extracted_id_number,$extracted_date_of_birth,$extracted_gender,$extracted_address,$ocr_confidence,$ocr_status);
if($stmt->execute()) echo json_encode(["success"=>true,"message"=>"OCR result saved successfully","ocr_id"=>$stmt->insert_id]); else {http_response_code(500);echo json_encode(["success"=>false,"message"=>"Failed to save OCR result"]);}
$stmt->close();$conn->close();
?>
