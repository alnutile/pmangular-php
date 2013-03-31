<?php

/**
 * @file
 * People related end points
 */

function getPeople() {
	$sql = "select * FROM people WHERE drupalId != 0 ORDER BY lname";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getPerson($id) {
	$sql = "SELECT * FROM people WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$data = $stmt->fetchObject();  
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addPerson() {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
	$sql = "INSERT INTO people (id, drupalId, email, fname, lname, clientId, status, phone, notes) VALUES (NULL, NULL, :email, :fname, :lname, :clientId, :status, :phone, :notes)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("fname", $data->fname);
		$stmt->bindParam("lname", $data->lname);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("clientId", $data->clientId);
		$stmt->bindParam("status", $data->status);
		$stmt->bindParam("phone", $data->phone);
		$stmt->bindParam("notes", $data->notes);

		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updatePerson($id) {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
	$sql = "UPDATE people SET 
				email=:email,
				fname=:fname,
				lname=:lname,
				clientId=:clientId,
				status=:status,
				phone=:phone,
				notes=:notes
				WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("fname", $data->fname);
		$stmt->bindParam("lname", $data->lname);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("email", $data->email);
		$stmt->bindParam("clientId", $data->clientId);
		$stmt->bindParam("status", $data->status);
		$stmt->bindParam("phone", $data->phone);
		$stmt->bindParam("notes", $data->notes);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deletePerson($id) {
	$sql = "DELETE FROM people WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

?>