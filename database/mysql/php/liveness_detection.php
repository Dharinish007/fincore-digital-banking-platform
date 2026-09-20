<?php
require_once "db_connect.php";
if($_SERVER["REQUEST_METHOD"]!=="POST"){http_response_code(405);echo json_encode(["success"=>false,"message"=>"Only POST method is allowed"]);exit;}
$data=json_decode(file_get_contents("php://input"),true);
$customer_id=$data["customer_id"]??null;$capture_reference=$data["capture_reference"]??null;$liveness_score=$data["liveness_score"]??null;$liveness_threshold=$data["liveness_threshold"]??80.00;$detection_result=$data["detection_result"]??"Pending";
if(!$customer_id){http_response_code(400);echo json_encode(["success"=>false,"message"=>"customer_id is required"]);exit;}
$sql="INSERT INTO liveness_detection (customer_id,capture_reference,liveness_score,liveness_threshold,detection_result,checked_at) VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)";
$stmt=$conn->prepare($sql);if(!$stmt){http_response_code(500);echo json_encode(["success"=>false,"message"=>"Failed to prepare liveness query"]);exit;}
$stmt->bind_param("isdds",$customer_id,$capture_reference,$liveness_score,$liveness_threshold,$detection_result);
if($stmt->execute()) echo json_encode(["success"=>true,"message"=>"Liveness result saved successfully","liveness_id"=>$stmt->insert_id]); else {http_response_code(500);echo json_encode(["success"=>false,"message"=>"Failed to save liveness result"]);}
$stmt->close();$conn->close();
?>
