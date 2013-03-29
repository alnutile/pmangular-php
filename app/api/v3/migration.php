<?php
/**
 * @file migrate data into system
 */


/**
 * Pull in Client data
 */

function clientImport(){
	$sql = "SELECT * FROM taxonomy_term_data WHERE vid = 2";
	try {
		$db = getConnectionMigrate();
		$stmt = $db->query($sql);  
		$clients = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		foreach($clients as $drupalRecord) {
			$seeIfExists = "SELECT * FROM client WHERE drupalId = :drupalId";
			$dbExists = getConnection();
			$queryExists = $dbExists->prepare($seeIfExists);
			$queryExistTid = $drupalRecord->tid;
			$queryExists->bindParam("drupalId", $queryExistTid);
			$queryExists->execute();
			$rowExists = $queryExists->fetchAll(PDO::FETCH_OBJ);
			$dbExists = null;
			if(count($rowExists)) {
				$compareRows = migrateCompareClient($rowExists[0], $drupalRecord);
			} else {
				$insert = migrateInsertClient($drupalRecord);
			}
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
function migrateCompareClient($newSystem, $drupalRecord){
	if($newSystem->clientName != $drupalRecord->name) {
		$sql = "UPDATE client SET clientName=:clientName WHERE id=:id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("clientName", $drupalRecord->name);
			$stmt->bindParam("id", $newSystem->id);
			$stmt->execute();
			$db = null;
			error_log("migrateClient client id: $newSystem->id name: $drupalRecord->name Updated \n", 
			3, 
			'/var/tmp/pmmigrate.log');
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}		
	} 
}

function migrateInsertClient($row){
	$sql = "INSERT INTO client (id, drupalId, clientName, phone, phone2, notes) VALUES (NULL, :drupalId, :clientName, null, null, null)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("clientName", $row->name);
		$stmt->bindParam("drupalId", $row->tid);
		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		error_log("migrateClient client id: $lastId name: $row->name Inserted \n", 
		3, 
		'/var/tmp/pmmigrate.log');
		return $lastId;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function clientIdNewFromDrupalIdOld($tid) {
	$seeIfExists = "SELECT id FROM client WHERE drupalId = :drupalId";
	$dbExists = getConnection();
	$queryExists = $dbExists->prepare($seeIfExists);
	$queryExistTid = $tid;
	$queryExists->bindParam("drupalId", $queryExistTid);
	$queryExists->execute();
	$rowExists = $queryExists->fetchColumn();
	$dbExists = null;
	return $rowExists;
}


function projectIdNewFromDrupalIdOld($tid) {
	$seeIfExists = "SELECT id FROM projects WHERE drupalId = :drupalId";
	$dbExists = getConnection();
	$queryExists = $dbExists->prepare($seeIfExists);
	$queryExistTid = $tid;
	$queryExists->bindParam("drupalId", $queryExistTid);
	$queryExists->execute();
	$rowExists = $queryExists->fetchColumn();
	$dbExists = null;
	return $rowExists;
}


function getConnectionMigrate() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="thisisit05";
	$dbname="mailhandler";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}
