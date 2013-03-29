<?php

/**
 * @file
 * Client related end points
 */



function getClient($id) {
	$sql = "SELECT * FROM client WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$clients = $stmt->fetchObject();  
		$db = null;
		echo json_encode($clients); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addClient() {
	error_log('addClient\n', 3, '/var/tmp/pmbackend.log');
	$request = Slim::getInstance()->request();
	$client = json_decode($request->getBody());
	$sql = "INSERT INTO client (id, drupalId, clientName, phone, phone2, notes) VALUES (NULL, NULL, :clientName, :phone, :phone2, :note)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("clientName", $client->clientName);
		$stmt->bindParam("note", $client->phone);
		$stmt->bindParam("note", $client->phone2);
		$stmt->bindParam("note", $client->notes);
		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		error_log("new client id: $lastId name: $client->clientName Inserted \n", 
		3, 
		'/var/tmp/pmbackend.log');
		echo json_encode($client); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateClient($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$client = json_decode($body);
	$sql = "UPDATE client SET clientName=:clientName, notes=:notes, phone=:phone, phone2=:phone2 WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("clientName", $client->clientName);
		$stmt->bindParam("notes", $client->note);
		$stmt->bindParam("phone", $client->phone);
		$stmt->bindParam("phone2", $client->phone2);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($client); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteCient($id) {
	$sql = "DELETE FROM client WHERE id=:id";
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

function findClientByName($query) {
	$sql = "SELECT * FROM client WHERE UPPER(clientName) LIKE :query ORDER BY clientName";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$clients = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($clients);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
?>