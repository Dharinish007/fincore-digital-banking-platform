<?php
require_once "db_connect.php";
if($_SERVER["REQUEST_METHOD"]!=="POST"){http_response_code(405);
echo json_encode(["success"=>false,"message"=>"Only POST method is allowed"]);exit;}
$data=json_decode(file_get_contents("php://input"),true);
$customer_id=$data["customer_id"]??null;$match_result=$data["match_result"]??null;$confidence=$data["confidence"]??null;
if(!$customer_id||!$match_result||$confidence===null)
{http_response_code(400);echo json_encode(["success"=>false,"message"=>"customer_id, match_result and confidence are required"]);exit;}
$sql="INSERT INTO face_match (customer_id,match_result,confidence) VALUES (?,?,?)";
$stmt=$conn->prepare($sql);
if(!$stmt){http_response_code(500);
echo json_encode(["success"=>false,"message"=>"Failed to prepare face match query"]);exit;}
$stmt->bind_param("isd",$customer_id,$match_result,$confidence);
if($stmt->execute()) echo json_encode(["success"=>true,"message"=>"Face match result saved successfully","face_match_id"=>$stmt->insert_id,"match_result"=>$match_result,"confidence"=>$confidence]); else {http_response_code(500);echo json_encode(["success"=>false,"message"=>"Failed to save face match result"]);}
$stmt->close();$conn->close();
?>
