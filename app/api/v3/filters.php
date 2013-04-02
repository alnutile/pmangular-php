<?php

function getFilters() {
	$statusItems = getStatusData();
	$filters['taskStatus'] = $statusItems;

	//Get Who
	$people = getPeopleData();
	$filters['assigned'] = $people;

	echo json_encode($filters); 
}


function getStatusData(){
	$sql = "SELECT * FROM status";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ); 
		$db = null;
		return $data; 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getPeopleData(){
	$sql = "SELECT * FROM people WHERE staff = 1";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ); 
		$db = null;
		return $data; 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}