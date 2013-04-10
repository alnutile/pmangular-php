<?php

function getQuotesForClient($id) {
	$sql = "SELECT * FROM quotes WHERE clientId=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$data = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($data); 
	} catch(PDOException $e) {
		echo '{"error":{"text  for id '.$id.'":'. $e->getMessage() .'}}'; 
	}
}

function addQuote() {
	$request = Slim::getInstance()->request();
	$data = json_decode($request->getBody());
  $test = print_r($data, 1);
  error_log("Results of Quote Update {$test}", 3, '/var/tmp/pmangularQuotes.log');
  echo json_encode($data); 
  /*
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
  */
}
