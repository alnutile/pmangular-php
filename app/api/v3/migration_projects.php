<?php
/**
 * Pull in Client data
 */

function projectImport(){
	$sql = "SELECT tid, name, description, field_client_tid AS clientId
                FROM taxonomy_term_data
                LEFT JOIN field_data_field_client relatedClient ON relatedClient.entity_id = taxonomy_term_data.tid
                WHERE vid =3";
	try {
		$db = getConnectionMigrate();
		$stmt = $db->query($sql);  
		$projects = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		foreach($projects as $drupalRecord) {
			$seeIfExists = "SELECT p.clientId, p.drupalId, p.notes, p.id, p.name FROM projects as p
                        LEFT JOIN client relatedClient on relatedClient.id = p.clientId
                        WHERE p.drupalId = :drupalId";
			$dbExists = getConnection();
			$queryExists = $dbExists->prepare($seeIfExists);
			$queryExistTid = $drupalRecord->tid;
			$queryExists->bindParam("drupalId", $queryExistTid);
			$queryExists->execute();
			$rowExists = $queryExists->fetchAll(PDO::FETCH_OBJ);
			$dbExists = null;
			if(count($rowExists)) {
				$compareRows = migrateCompareProject($rowExists[0], $drupalRecord);
			} else {
				$insert = migrateInsertProject($drupalRecord);
			}
		}
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function migrateCompareProject($newSystem, $drupalRecord){
	//See if it is worth updating
        if($newSystem->name != $drupalRecord->name || $drupalRecord->description != $newSystem->notes) {
		$sql = "UPDATE projects SET name=:name, notes=:notes WHERE id=:id";
		try {
			$db = getConnection();
			$stmt = $db->prepare($sql);  
			$stmt->bindParam("name", $drupalRecord->name);
                        $stmt->bindParam("notes", $drupalRecord->description);
			$stmt->bindParam("id", $newSystem->id);
			$stmt->execute();
			$db = null;
			error_log("migrateClient project id: $newSystem->id name: $drupalRecord->name Updated \n", 
			3, 
			'/var/tmp/pmmigrate.log');
		} catch(PDOException $e) {
			echo '{"error":{"text":'. $e->getMessage() .'}}'; 
		}		
	} 
}

/**
 *Need to relate to existing client
 **/

function migrateInsertProject($drupalRecord){
	$sql = "INSERT INTO projects (id, name, clientId, drupalId, notes) VALUES (NULL, :name, :clientId, :drupalId, :notes)";
	//Need to see if there is a matching clientId
        $clientIdNew = clientIdNewFromDrupalIdOld($drupalRecord->clientId);
        try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("name", $drupalRecord->name);
		$stmt->bindParam("drupalId", $drupalRecord->tid);
                $stmt->bindParam("clientId", $clientIdNew);
                $stmt->bindParam("notes", $drupalRecord->description);
		$stmt->execute();
		$lastId = $db->lastInsertId();
		$db = null;
		error_log("migrateProject project id: $lastId name: $drupalRecord->name Inserted \n", 
		3, 
		'/var/tmp/pmmigrate.log');
		return $lastId;
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/pmbackend.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}


