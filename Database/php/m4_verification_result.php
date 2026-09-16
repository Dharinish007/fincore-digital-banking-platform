<?php
require_once "db_connect.php";
if($_SERVER["REQUEST_METHOD"]!=="GET"){http_response_code(405);echo json_encode(["success"=>false,"message"=>"Only GET method is allowed"]);exit;}
$customer_id=$_GET["customer_id"]??null;if(!$customer_id){http_response_code(400);echo json_encode(["success"=>false,"message"=>"customer_id is required"]);exit;}
$sql="SELECT c.customer_id,c.full_name,o.document_type,o.extracted_name,o.extracted_id_number,o.ocr_confidence,o.ocr_status,l.liveness_score,l.liveness_threshold,l.detection_result,f.match_result,f.confidence AS face_match_confidence FROM customer c LEFT JOIN document_ocr o ON c.customer_id=o.customer_id LEFT JOIN liveness_detection l ON c.customer_id=l.customer_id LEFT JOIN face_match f ON c.customer_id=f.customer_id WHERE c.customer_id=?";
$stmt=$conn->prepare($sql);if(!$stmt){http_response_code(500);echo json_encode(["success"=>false,"message"=>"Failed to prepare result query"]);exit;}$stmt->bind_param("i",$customer_id);$stmt->execute();$result=$stmt->get_result();
if($result->num_rows===0){http_response_code(404);echo json_encode(["success"=>false,"message"=>"Customer not found"]);exit;}
$row=$result->fetch_assoc();$overall=($row["ocr_status"]==="Verified"&&$row["detection_result"]==="Passed"&&$row["match_result"]==="SUCCESS")?"AI VERIFICATION PASSED":"AI VERIFICATION PENDING / FAILED";
echo json_encode(["success"=>true,"customer_id"=>$row["customer_id"],"customer_name"=>$row["full_name"],"ocr"=>["document_type"=>$row["document_type"],"extracted_name"=>$row["extracted_name"],"extracted_id_number"=>$row["extracted_id_number"],"confidence"=>$row["ocr_confidence"],"status"=>$row["ocr_status"]],"liveness"=>["score"=>$row["liveness_score"],"threshold"=>$row["liveness_threshold"],"result"=>$row["detection_result"]],"face_match"=>["match_result"=>$row["match_result"],"confidence"=>$row["face_match_confidence"]],"overall_ai_verification"=>$overall]);
$stmt->close();$conn->close();
?>
